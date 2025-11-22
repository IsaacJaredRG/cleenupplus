import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
  topic: String,
  u: Number,
  m: String,
  timestamp: { type: Date, default: Date.now }
});

export default mongoose.model("Message", MessageSchema);

