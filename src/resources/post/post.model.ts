import { Schema, model } from 'mongoose';
import Post from '@/resources/post/post.interface';


const PostSchema = new Schema({
    title: {
        type: Schema.Types.String,
        required: true
    },
    body: {
        type: Schema.Types.String,
        required: true
    },

}, { timestamps: true });

export default model<Post>('Post', PostSchema)