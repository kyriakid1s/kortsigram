import conversationModel from './conversation.model';
import Conversation from './conversation.interface';

class ConversationService {
    private conversation = conversationModel;

    /**
     *
     * Create a Conversation
     */
    public async createConversation(
        membersId: string[]
    ): Promise<Conversation | Error> {
        try {
            const conversation = await this.conversation.create({
                members: membersId,
            });
            return conversation;
        } catch (err: any) {
            throw new Error(err.membersId);
        }
    }

    /**
     * Get a Conversation
     */

    public async getConversations(
        userId: string
    ): Promise<Conversation[] | Error> {
        try {
            const conversations = await this.conversation
                .find({
                    members: { $in: [userId] },
                })
                .populate('members', 'username profilePicture');
            return conversations;
        } catch (err: any) {
            throw new Error(err.message);
        }
    }
}

export default ConversationService;
