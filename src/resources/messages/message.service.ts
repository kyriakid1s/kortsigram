import messageModel from './message.model';
import Message from './message.interface';
import Websocket from '../../utils/websocket/websocket';
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
                this.sendSocket(message.message);
                return message.populate('senderId');
            }
            const message = await this.message.create({
                senderId: senderId,
                receiverId: receiverId,
                conversationId: haveAlreadyConversation._id,
                message: messageBody,
            });
            this.sendSocket(message.message);
            return message.populate('senderId');
        } catch (err: any) {
            throw new Error(err.message);
        }
    }

    private sendSocket(message: string) {
        const io = Websocket.getInstance();
        io.of('/api/messages').emit('msg', console.log(message));
    }
}

export default MessageService;
