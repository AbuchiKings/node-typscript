import { Router, Request, Response, NextFunction } from 'express';
import Controller from '@/utils/interfaces/controller.interfaces';
import HttpException from '@/utils/exceptions/http.exception'
import validationMiddleware from '@/middleware/validation.middleware'
import validate from '@/resources/post/post.validation'
import PostService from '@/resources/post/post.service'

class PostController implements Controller {
    public path = '/posts';
    public router = Router();
    private PostService = new PostService();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        console.log(this.path);
        this.router.post(
            `${this.path}`, validationMiddleware(validate.create),
            this.create
        )
        console.log(this.path)
    }

    private async create(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            const { title, body } = req.body;
            const post = await this.PostService.create(title, body);
            res.status(201).json({ post })
        } catch (error) {
            next(new HttpException(400, 'Cannot create post.'))
        }
    }
}

export default PostController;