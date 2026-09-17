import { Document, Model } from "mongoose";
export interface IContact extends Document {
    name: string;
    email: string;
    subject?: string;
    message: string;
    createdAt: Date;
    updatedAt: Date;
}
declare const Contact: Model<IContact>;
export default Contact;
