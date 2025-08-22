import * as ReportsService from "../services/ReportService.js";

export const DashboardReportController = async (req, res) => {
  const result = await ReportsService.DashboardReportService(req);
  return res
    .status(result.status)
    .json({ message: result.message, data: result.data });
};

export const ReportController = async (req, res) => {
  const result = await ReportsService.ReportService(req);
  return res
    .status(result.status)
    .json({ message: result.message, data: result.data });
};

export const ReportPDFController = async (req, res) => {
  const result = await ReportsService.ReportService(req);
  if (result.status !== 200) {
    return res.status(result.status).json(result);
  }
  const { startDate, endDate } = req.body;
  await ReportsService.ReportPDFService(result.data, res, startDate, endDate);
};
