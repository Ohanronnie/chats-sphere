import mongoose from "mongoose";
mongoose
    .connect(process.env.MONGOURL)
    .then((response) => console.log("Connected successfully"));
const ChatSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        lowercase: true,
    },
    chats: [],
});
const Chat = mongoose.model("Chat", ChatSchema);
export default Chat;
