import { Schema } from 'mongoose';

interface Token {
    id: Schema.Types.ObjectId;
    expiresIn: number;
}

export default Token;
