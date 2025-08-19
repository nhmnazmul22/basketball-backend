import canvas from "canvas";
import faceapi from "face-api.js";

// Monkey patch for Node.js
const { Canvas, Image, ImageData } = canvas;
faceapi.env.monkeyPatch({ Canvas, Image, ImageData });

const MODEL_URL = "./models";

// Function to load models once
let modelsLoaded = false;
const loadModels = async () => {
  if (modelsLoaded) return;
  await faceapi.nets.ssdMobilenetv1.loadFromDisk(MODEL_URL);
  await faceapi.nets.faceLandmark68Net.loadFromDisk(MODEL_URL);
  await faceapi.nets.faceRecognitionNet.loadFromDisk(MODEL_URL);
  modelsLoaded = true;
  console.log("✅ Face API models loaded");
};

export { faceapi, canvas, loadModels };
