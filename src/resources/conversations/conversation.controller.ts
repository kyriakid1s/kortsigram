import { Request, Response, NextFunction, Router } from 'express';
import ConversationService from './conversation.service';
import authenticatedMiddleware from '../../middlewares/authenticated.middleware';
import Controller from '../../utils/interfaces/controller.interface';
import HttpException from '../../utils/exceptations/http.exception';

class ConversationController implements Controller {
    public path = '/conversations';
    public router = Router();
    private ConversationService = new ConversationService();

    constructor() {
        this.initialiseRoutes();
    }

    private initialiseRoutes() {
        this.router.post(
            `${this.path}/new-conversation`,
            authenticatedMiddleware,
            this.createConversation
        );

        this.router.get(
            `${this.path}/`,
            authenticatedMiddleware,
            this.getConversations
        );
    }

    private createConversation = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const { receiverId } = req.body;
            const members = [req.user.id, receiverId];
            const conversation =
                await this.ConversationService.createConversation(members);
            res.status(201).json(conversation);
        } catch (err: any) {
            next(new HttpException(400, err.message));
        }
    };

    private getConversations = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const conversations =
                await this.ConversationService.getConversations(req.user.id);

            res.status(200).json(conversations);
        } catch (err: any) {
            next(new HttpException(400, err.message));
        }
    };
}

export default ConversationController;
