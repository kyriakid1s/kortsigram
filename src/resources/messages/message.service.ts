import messageModel from './message.model';
import Message from './message.interface';
import conversationModel from '../conversations/conversation.model';

class MessageService {
    private message = messageModel;
    private conversations = conversationModel;

    /**
     * Save message on db
     */
    public async sendMessage(
        senderId: string,
        receiverId: string,
        messageBody: string
    ): Promise<Message | Error> {
        try {
            const haveAlreadyConversation = await this.conversations.findOne({
                members: { $in: [senderId, receiverId] },
            });
            if (!haveAlreadyConversation) {
                const newConversation = await this.conversations.create({
                    members: [senderId, receiverId],
                });
                const message = await this.message.create({
                    senderId: senderId,
                    receiverId: receiverId,
                    conversationId: newConversation._id,
                    message: messageBody,
                });
                return message;
            }
            const message = await this.message.create({
                senderId: senderId,
                receiverId: receiverId,
                conversationId: haveAlreadyConversation._id,
                message: messageBody,
            });
            return message;
        } catch (err: any) {
            throw new Error(err.message);
        }
    }

    /**
     * Get Messages
     */
    public async getMessages(
        conversationId: string
    ): Promise<Message[] | Error> {
        try {
            const currentConversation = await this.conversations.findById(
                conversationId
            );
            if (!currentConversation)
                throw new Error(
                    "This conversation doesn't exist anymore or never existed."
                );
            const messages = this.message.find({
                conversationId: currentConversation._id,
            });
            return messages;
        } catch (err: any) {
            throw new Error(err.message);
        }
    }
}

export default MessageService;
