import User from "../models/User.js";
import Chat from "../models/Chat.js";
export async function ChatMessage(data) {
    let { from, to, url, createdAt, message, replyTo } = data;
    let sender = (await User.findOne({ _id: from }).select("email"));
    let receiver = (await User.findOne({ _id: to }).select("email"));
    let senderChat = (await Chat.findOne({ email: sender.email }));
    let receiverChat = (await Chat.findOne({ email: receiver.email }));
    let insertedObject = {
        from: sender._id,
        to: receiver._id,
        message,
        createdAt,
    };
    if (url)
        insertedObject.url = url;
    if(replyTo) insertedObject.replyTo = replyTo;
    if (senderChat.chats.length === 0 ||
        !senderChat.chats.find((e) => e.hasOwnProperty(receiver._id))) {
        senderChat.chats.push({
            [receiver._id]: [insertedObject],
        });
        await Chat.updateOne({ _id: senderChat._id }, senderChat);
    }
    else {
        senderChat.chats.forEach((e) => {
            if (e.hasOwnProperty(receiver._id)) {
                e[receiver._id].push(insertedObject);
            }
        });
        await Chat.updateOne({ _id: senderChat._id }, senderChat);
    }
    if (receiverChat.chats.length === 0 ||
        !receiverChat.chats.find((e) => e.hasOwnProperty(sender._id))) {
        receiverChat.chats.push({
            [sender._id]: [insertedObject],
        });
        await Chat.updateOne({ _id: receiverChat._id }, receiverChat);
    }
    else {
        receiverChat.chats.forEach((e) => {
            if (e.hasOwnProperty(sender._id)) {
                e[sender._id].push(insertedObject);
            }
        });
        await Chat.updateOne({ _id: receiverChat._id }, receiverChat);
    }
}
