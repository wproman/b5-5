import { model, Schema } from "mongoose";
import { IUser, UserRole } from "./user.interface";

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    role: { type: String, enum: Object.values(UserRole), required: true },
    phone: { type: String },
    picture: { type: String },
    address: { type: String },
    isDeleted: { type: Boolean, default: false },
    isActive: {
      type: String,
      enum: ["active", "inactive", "blocked", "deleted"],
      default: "active",
    },
    isBlocked: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    versionKey: false,
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
  }
);


export const User = model<IUser>("User", userSchema);


