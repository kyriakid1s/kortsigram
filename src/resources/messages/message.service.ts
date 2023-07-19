import messageModel from './message.model';
import Message from './message.interface';

class MessageService {
    private message = messageModel;

    public async sendMessage(
        senderId: string,
        receiverId: string,
        messageBody: string
    ): Promise<Message | Error> {
        try {
            const message = await this.message.create({
                senderId: senderId,
                receiverId: receiverId,
                message: messageBody,
            });
            return message;
        } catch (err: any) {
            throw new Error(err.message);
        }
    }
}

export default MessageService;
