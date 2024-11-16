import { useEffect } from "react";
import { useSocket } from "./socketContext";
import { IMessage } from "react-native-gifted-chat";

export const sendToMessageSocket = (message: IMessage, roomId: string) => {
    const {socket} = useSocket();

    if (socket) {
        const { _id, text, createdAt, user } = message;
        console.log('Sending message:', message);
        socket.emit('sendMessage', {
            messageId: _id,
            text,
            createdAt,
            userId: String(user._id),
            roomId,
        });
    }
}