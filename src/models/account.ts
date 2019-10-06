import { Schema, model, Model, Document } from "mongoose";
import Request from "express";

const AccountSchema = new Schema({
  facebookId: { type: String, unique: true },
  facebookToken: { type: String },
  facebookDisplayName: { type: String },
  email: { type: String, unique: true },
  password: { type: String }
});

export interface IAccount extends Document, Request {
  facebookId: string;
  facebookToken: string;
  facebookDisplayName: string;
  email: string;
  password: string;
}

const Account = model<IAccount>("Account", AccountSchema);
export default Account;
