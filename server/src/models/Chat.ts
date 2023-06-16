import mongoose, { Document } from "mongoose";
import { IMethod, IChat } from "../interfaces/chat.js";
import { config } from "dotenv";
mongoose
  .connect(process.env.MONGOURL!)
  .then((response: any) => console.log("Connected successfully"));
const ChatSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    lowercase: true,
  },
  chats: [],
});
const Chat = mongoose.model<IChat>("Chat", ChatSchema);
export default Chat;
