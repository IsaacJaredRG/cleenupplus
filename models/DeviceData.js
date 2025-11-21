import mongoose from "mongoose";

const deviceDataSchema = new mongoose.Schema({
  devEUI: String,
  payload: Object,
  timestamp: { type: Date, default: Date.now }
});

export const DeviceData = mongoose.model("DeviceData", deviceDataSchema);