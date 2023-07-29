import messageModel from './message.model';
import Message from './message.interface';
import Websocket from '../../utils/Websocket/websocket';
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
                return message.populate('senderId');
            }
            const message = await this.message.create({
                senderId: senderId,
                receiverId: receiverId,
                conversationId: haveAlreadyConversation._id,
                message: messageBody,
            });
            return message.populate('senderId receiverId');
        } catch (err: any) {
            throw new Error(err.message);
        }
    }
}

export default MessageService;
