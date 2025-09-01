// models/UserStats.js
import mongoose from "mongoose";

const statsSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  interviewQuestions: { type: Number, default: 0 },
  filesUploaded: { type: Number, default: 0 },
  quizzesCreated: { type: Number, default: 0 },
});


export default mongoose.model("UserStats", statsSchema);
