import { model, Schema } from "mongoose";
import { IUser, UserRole } from "./user.interface";


const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
    },
    role: {
      type: String,
      enum: UserRole,
     
    },
    phone: {
      type: String,
    },
    picture: {
      type: String,
    },
    address: {
      type: String,
    },
     driverInfo: {
    approved: { type: Boolean, default: false },
    online: { type: Boolean, default: false },
    vehicleNumber: { type: String },
    earnings: { type: Number, default: 0 },
  },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: String,
      enum: ["active", "inactive", "blocked", "deleted"],
      default: "active",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
   
  },
  {
    timestamps: true,
    versionKey: false,
    // toJSON: {
    //     virtuals: true,
    //     transform: (doc, ret) => {
    //         delete ret._id;
    //         return ret;
    //     },
    // },
    toObject: { virtuals: true },
  }
);

export const User = model<IUser>("User", userSchema);
