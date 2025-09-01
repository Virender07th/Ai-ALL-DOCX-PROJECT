// models/Activity.js
import mongoose from "mongoose";

const activitySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  type: { type: String, enum: ["upload", "quiz", "interview"], required: true },
  status: { type: String, enum: ["completed", "processing", "failed"], default: "processing" },
  date: { type: Date, default: Date.now },
});


export default mongoose.model("Activity", activitySchema);
