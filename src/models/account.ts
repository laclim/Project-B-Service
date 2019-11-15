import { Schema, model, Model, Document } from "mongoose";
import Request from "express";
import { isBuffer } from "util";

const AccountSchema = new Schema({
  facebookId: { type: String, unique: true },
  facebookToken: { type: String },
  facebookDisplayName: { type: String },
  email: { type: String, unique: true },
  password: { type: String }
});

const UserProfileSchema = new Schema({
  gender: { type: String, enum: ["MALE", "FEMALE"], required: true },
  likes: { type: Number, default: 0 },
  vipStatus: { type: Number, default: 0 }
});

export interface IAccount extends Document, Request {
  facebookId: string;
  facebookToken: string;
  facebookDisplayName: string;
  email: string;
  password: string;
}

interface IUserProfile extends Document, Request {
  gender: "MALE" | "FEMALE";
  likes: string;
  vipStatus: Number;
}
const Account = model<IAccount>("Account", AccountSchema);
const UserProfileModel = model<IUserProfile>("UserProfile", UserProfileSchema);
export { UserProfileModel };
