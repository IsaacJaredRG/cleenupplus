import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
  topic: String,
  devEUI: String,
  data: Object,
  timestamp: { type: Date, default: Date.now }
});

export default mongoose.model("Message", MessageSchema);
