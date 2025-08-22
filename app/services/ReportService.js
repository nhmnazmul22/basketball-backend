import UserModel from "../models/UserModel.js";
import TransactionModel from "../models/TransactionModel.js";
import AttendanceModel from "../models/AttendanceModel.js";
import PDFDocument from "pdfkit";
import { ChartJSNodeCanvas } from "chartjs-node-canvas";
import fs from "fs";
import path from "path";

export const DashboardReportService = async () => {
  try {
    const summary = {
      totalStudent: 0,
      totalCoach: 0,
      paymentPending: 0,
      netIncome: 0,
    };

    const attendanceReport = {
      totalPresent: 0,
      totalAbsent: 0,
      late: 0,
      averageAttendance: 0,
    };

    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthEnd = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      0,
      23,
      59,
      59,
      999
    ); // last day of current month

    const users = await UserModel.find({
      createdAt: { $gte: monthStart, $lte: monthEnd },
    });
    const transaction = await TransactionModel.find({
      createdAt: { $gte: monthStart, $lte: monthEnd },
    });
    const attendances = await AttendanceModel.find({
      createdAt: { $gte: monthStart, $lte: monthEnd },
    });

    if (users.length > 0) {
      summary.totalStudent = users.filter(
        (user) => user.role === "murid"
      ).length;
      summary.totalCoach = users.filter(
        (user) => user.role === "pelatih"
      ).length;
    }

    if (transaction.length > 0) {
      // Calculate payment pending
      transaction.forEach((tran) => {
        if (tran.status === "menunggu" && tran.type === "penghasilan") {
          summary.paymentPending += Number(tran.amount);
        }
      });

      // Calculate total income and expenses
      let totalExpenses = 0;
      let totalIncome = 0;
      transaction.forEach((tran) => {
        if (tran.status === "dibayar") {
          if (tran.type === "pengeluaran") {
            totalExpenses += Number(tran.amount);
          } else {
            totalIncome += Number(tran.amount);
          }
        }
      });

      console.log(totalIncome), console.log(totalExpenses);
      summary.netIncome = totalIncome - totalExpenses;
    }

    if (attendances.length > 0) {
      attendanceReport.totalPresent = attendances.filter(
        (att) => att.status === "hadiah"
      ).length;
      attendanceReport.totalAbsent = attendances.filter(
        (att) => att.status === "absen"
      ).length;
      attendanceReport.late = attendances.filter(
        (att) => att.status === "terlambat"
      ).length;

      // Calculate average attendance
      attendanceReport.averageAttendance =
        (attendanceReport.totalPresent /
          (attendanceReport.totalPresent + attendanceReport.totalAbsent)) *
        100;
    }

    return {
      status: 200,
      message: "Report Generate Successful",
      data: {
        summary,
        attendanceReport,
      },
    };
  } catch (err) {
    return {
      status: 500,
      message: err.message || "Server issue",
      data: null,
    };
  }
};

export const ReportService = async (req) => {
  try {
    const { startDate, endDate } = req.body; // frontend sends ISO date strings
    const start = new Date(startDate);
    const end = new Date(endDate);

    const summary = {
      totalStudent: 0,
      totalCoach: 0,
      averageAttendance: 0,
      paymentPaid: 0,
      paymentPending: 0,
      totalIncome: 0,
      totalExpenses: 0,
      netIncome: 0,
    };

    // last 6 months labels
    const months = [
      "jan",
      "feb",
      "mar",
      "apr",
      "may",
      "jun",
      "jul",
      "aug",
      "sep",
      "oct",
      "nov",
      "dec",
    ];
    const attendanceGraphData = {};
    const incomeGraphData = {};

    // initialize with 0
    months.forEach((m) => {
      attendanceGraphData[m] = 0;
      incomeGraphData[m] = 0;
    });

    // Filtered users (not by date, assuming you always count them)
    const users = await UserModel.find({
      createdAt: { $gte: start, $lte: end },
    });
    if (users.length > 0) {
      summary.totalStudent = users.filter((u) => u.role === "murid").length;
      summary.totalCoach = users.filter((u) => u.role === "pelatih").length;
    }

    // Transactions filtered by date
    const transactions = await TransactionModel.find({
      createdAt: { $gte: start, $lte: end },
    });
    const allTransaction = await TransactionModel.find({});

    if (transactions.length > 0) {
      transactions.forEach((tran) => {
        if (tran.type === "penghasilan") {
          if (tran.status === "dibayar") {
            summary.totalIncome += Number(tran.amount);
            summary.paymentPaid += Number(tran.amount);
          }
          if (tran.status === "menunggu") {
            summary.paymentPending += Number(tran.amount);
          }
        } else {
          summary.totalExpenses += Number(tran.amount);
        }
      });

      summary.netIncome = summary.totalIncome - summary.totalExpenses;
    }

    if (allTransaction.length > 0) {
      allTransaction.forEach((tran) => {
        // graph (last 6 months)
        const monthIdx = new Date(tran.createdAt).getMonth(); // 0-11
        const monthKey = months[monthIdx];
        let totalIncome = 0;
        let totalExpenses = 0;
        if (tran.type === "penghasilan") {
          if (tran.status === "dibayar") {
            totalIncome += Number(tran.amount);
          }
        } else {
          if (tran.status === "dibayar") {
            totalExpenses += Number(tran.amount);
          }
        }
        incomeGraphData[monthKey] += totalIncome - totalExpenses;
      });
    }

    // Attendance filtered by date
    const attendances = await AttendanceModel.find({
      createdAt: { $gte: start, $lte: end },
    });
    const allAttendances = await AttendanceModel.find({});

    if (attendances.length > 0) {
      const totalPresent = attendances.filter(
        (att) => att.status === "hadiah" || att.status === "terlambat"
      ).length;

      const totalAbsent = attendances.filter(
        (att) => att.status === "absen"
      ).length;

      summary.averageAttendance =
        (totalPresent / (totalPresent + totalAbsent)) * 100;
    }

    if (allAttendances.length > 0) {
      // graph (last 6 months)
      allAttendances.forEach((att) => {
        const monthIdx = new Date(att.createdAt).getMonth();
        const monthKey = months[monthIdx];
        attendanceGraphData[monthKey] += 1;
      });
    }

    // Keep only last 6 months in graph
    const now = new Date();
    const last6Months = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      last6Months.push(months[d.getMonth()]);
    }

    const finalAttendanceGraph = {};
    const finalIncomeGraph = {};
    last6Months.forEach((m) => {
      finalAttendanceGraph[m] = attendanceGraphData[m];
      finalIncomeGraph[m] = incomeGraphData[m];
    });

    return {
      status: 200,
      message: "Report Generated Successfully",
      data: {
        summary,
        attendanceGraph: finalAttendanceGraph,
        incomeGraph: finalIncomeGraph,
      },
    };
  } catch (err) {
    return {
      status: 500,
      message: err.message || "Server issue",
      data: null,
    };
  }
};

export const ReportPDFService = async (reportData, res, startDate, endDate) => {
  try {
    const { summary, attendanceGraph, incomeGraph } = reportData;

    // Better chart dimensions for proper aspect ratio
    const chartWidth = 450;
    const chartHeight = 180;
    const chartJSNodeCanvas = new ChartJSNodeCanvas({
      width: chartWidth,
      height: chartHeight,
      backgroundColor: "white",
      chartCallback: (ChartJS) => {
        ChartJS.defaults.font.family = "Arial";
      },
    });

    // Optimized chart options for smaller size but clear readability
    const chartOptions = {
      responsive: false,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: "top",
          labels: {
            font: {
              size: 10,
              family: "Arial",
              weight: "bold",
            },
            padding: 8,
            usePointStyle: true,
          },
        },
        tooltip: {
          enabled: false,
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            color: "#e0e0e0",
            lineWidth: 1,
          },
          ticks: {
            font: {
              size: 9,
              family: "Arial",
            },
            padding: 4,
          },
          border: {
            display: true,
            color: "#333",
          },
        },
        x: {
          grid: {
            display: false,
          },
          ticks: {
            font: {
              size: 9,
              family: "Arial",
              weight: "bold",
            },
            padding: 4,
            maxRotation: 0,
          },
          border: {
            display: true,
            color: "#333",
          },
        },
      },
      layout: {
        padding: {
          top: 5,
          bottom: 5,
          left: 5,
          right: 5,
        },
      },
    };

    // Attendance chart
    const attendanceChartBuffer = await chartJSNodeCanvas.renderToBuffer({
      type: "bar",
      data: {
        labels: Object.keys(attendanceGraph),
        datasets: [
          {
            label: "Attendance",
            data: Object.values(attendanceGraph),
            backgroundColor: "rgba(54, 162, 235, 0.9)",
            borderColor: "rgba(54, 162, 235, 1)",
            borderWidth: 1,
            borderRadius: 4,
          },
        ],
      },
      options: chartOptions,
    });

    // Income chart
    const incomeChartBuffer = await chartJSNodeCanvas.renderToBuffer({
      type: "bar",
      data: {
        labels: Object.keys(incomeGraph),
        datasets: [
          {
            label: "Income ($)",
            data: Object.values(incomeGraph),
            backgroundColor: "rgba(75, 192, 192, 0.9)",
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 1,
            borderRadius: 4,
          },
        ],
      },
      options: chartOptions,
    });

    // Save temporary images
    const tmpDir = path.join("uploads", "tmp");
    if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });
    const attendancePath = path.join(tmpDir, "attendance.png");
    const incomePath = path.join(tmpDir, "income.png");
    fs.writeFileSync(attendancePath, attendanceChartBuffer);
    fs.writeFileSync(incomePath, incomeChartBuffer);

    // Create single-page PDF
    const doc = new PDFDocument({
      size: "A4",
      margin: 30,
      info: {
        Title: "Business Analytics Report",
        Author: "Business Intelligence System",
        Subject: `Performance Report: ${startDate} to ${endDate}`,
      },
    });

    res.setHeader(
      "Content-Disposition",
      "attachment; filename=business-report.pdf"
    );
    res.setHeader("Content-Type", "application/pdf");
    doc.pipe(res);

    const pageWidth = 535; // A4 width minus margins
    const centerX = 297.5;

    // ===== COMPACT HEADER =====
    doc.rect(30, 30, pageWidth, 45).fill("#2c3e50");
    doc
      .fillColor("white")
      .fontSize(18)
      .font("Helvetica-Bold")
      .text("BUSINESS REPORT", 40, 40);

    doc
      .fontSize(10)
      .text(`${startDate.split("T")[0]} to ${endDate.split("T")[0]}`, 40, 58);

    let currentY = 90;

    // ===== COMPACT SUMMARY SECTION =====
    doc.rect(30, currentY, pageWidth, 20).fill("#34495e");
    doc
      .fillColor("white")
      .fontSize(12)
      .font("Helvetica-Bold")
      .text("EXECUTIVE SUMMARY", 40, currentY + 5);

    currentY += 30;

    // Horizontal summary layout (6 metrics in 2 rows)
    const metricWidth = 165;
    const metricHeight = 50;
    const metricSpacing = 10;

    const summaryItems = [
      {
        label: "Students",
        value: summary.totalStudent.toString(),
        color: "#3498db",
      },
      {
        label: "Coaches",
        value: summary.totalCoach.toString(),
        color: "#e74c3c",
      },
      {
        label: "Attendance",
        value: `${Math.round(summary.averageAttendance)}%`,
        color: "#2ecc71",
      },
      {
        label: "Paid",
        value: `$${summary.paymentPaid.toLocaleString()}`,
        color: "#27ae60",
      },
      {
        label: "Pending",
        value: `$${summary.paymentPending.toLocaleString()}`,
        color: "#f39c12",
      },
      {
        label: "Net Income",
        value: `$${summary.netIncome.toLocaleString()}`,
        color: "#8e44ad",
      },
    ];

    summaryItems.forEach((item, index) => {
      const row = Math.floor(index / 3);
      const col = index % 3;
      const x = 30 + col * (metricWidth + metricSpacing);
      const y = currentY + row * (metricHeight + 8);

      // Compact card
      doc.rect(x, y, metricWidth, metricHeight).fill("#ffffff");
      doc.rect(x, y, metricWidth, metricHeight).stroke("#ddd");
      doc.rect(x, y, metricWidth, 3).fill(item.color);

      // Value
      doc
        .fillColor("#2c3e50")
        .fontSize(16)
        .font("Helvetica-Bold")
        .text(item.value, x + 5, y + 8, {
          width: metricWidth - 10,
          align: "center",
        });

      // Label
      doc
        .fillColor("#7f8c8d")
        .fontSize(8)
        .font("Helvetica")
        .text(item.label, x + 5, y + 32, {
          width: metricWidth - 10,
          align: "center",
        });
    });

    currentY += 2 * metricHeight + 30;

    // ===== VERTICAL CHARTS SECTION =====
    doc.rect(30, currentY, pageWidth, 20).fill("#34495e");
    doc
      .fillColor("white")
      .fontSize(12)
      .font("Helvetica-Bold")
      .text("PERFORMANCE ANALYTICS", 40, currentY + 5);

    currentY += 30;

    // Chart dimensions for vertical layout (better aspect ratio)
    const chartDisplayWidth = 450;
    const chartDisplayHeight = 180;
    const chartSpacing = 25;
    const chartCenterX = centerX - chartDisplayWidth / 2;

    // First chart (Attendance)
    doc
      .fillColor("#2c3e50")
      .fontSize(10)
      .font("Helvetica-Bold")
      .text("Attendance Trends (Last 6 Months)", 40, currentY);

    doc.image(attendancePath, chartCenterX, currentY + 15, {
      width: chartDisplayWidth,
      height: chartDisplayHeight,
    });

    currentY += chartDisplayHeight + chartSpacing + 15;

    // Second chart (Income)
    doc
      .fillColor("#2c3e50")
      .fontSize(10)
      .font("Helvetica-Bold")
      .text("Revenue Trends (Last 6 Months)", 40, currentY);

    doc.image(incomePath, chartCenterX, currentY + 15, {
      width: chartDisplayWidth,
      height: chartDisplayHeight,
    });

    // Clean up temporary files
    setTimeout(() => {
      try {
        if (fs.existsSync(attendancePath)) fs.unlinkSync(attendancePath);
        if (fs.existsSync(incomePath)) fs.unlinkSync(incomePath);
      } catch (err) {
        console.warn("Could not clean up temporary files:", err);
      }
    }, 2000);

    doc.end();
  } catch (err) {
    console.error("PDF generation failed:", err);
    res.status(500).json({
      message: "Failed to generate PDF",
      error: err.message,
    });
  }
};
