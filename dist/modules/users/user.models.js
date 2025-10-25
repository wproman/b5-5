"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = require("mongoose");
const user_interface_1 = require("./user.interface");
const userSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    role: { type: String, enum: Object.values(user_interface_1.UserRole), required: true },
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
}, {
    timestamps: true,
    versionKey: false,
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
});
exports.User = (0, mongoose_1.model)("User", userSchema);
// import { model, Schema } from "mongoose";
// import { IEmergencyContact, IUser, UserRole } from "./user.interface";
// const emergencyContactSchema = new Schema<IEmergencyContact>({
//   name: {
//     type: String,
//     required: [true, 'Contact name is required'],
//     trim: true,
//     maxlength: [50, 'Contact name cannot exceed 50 characters']
//   },
//   number: {
//     type: String,
//     required: [true, 'Contact number is required'],
//     trim: true,
//     validate: {
//       validator: function(v: string) {
//         return /^[+]?[1-9][\d]{0,15}$/.test(v.replace(/\s/g, ''));
//       },
//       message: 'Invalid phone number format'
//     }
//   },
//   type: {
//     type: String,
//     enum: {
//       values: ['personal', 'police', 'hospital'],
//       message: 'Contact type must be personal, police, or hospital'
//     },
//     required: true
//   },
//   relationship: {
//     type: String,
//     trim: true,
//     maxlength: [30, 'Relationship cannot exceed 30 characters']
//   },
//   isPrimary: {
//     type: Boolean,
//     default: false
//   }
// });
// const userSchema = new Schema<IUser>(
//   {
//     name: { type: String, required: true },
//     email: { type: String, required: true, unique: true },
//     password: { type: String },
//     role: { type: String, enum: Object.values(UserRole), required: true },
//     phone: { type: String },
//      emergencyContacts: [emergencyContactSchema],
//     picture: { type: String },
//     address: { type: String },
//     isDeleted: { type: Boolean, default: false },
//     isActive: {
//       type: String,
//       enum: ["active", "inactive", "blocked", "deleted"],
//       default: "active",
//     },
//     isBlocked: { type: Boolean, default: false },
//     isVerified: { type: Boolean, default: false },
//   },
//   {
//     timestamps: true,
//     versionKey: false,
//     toObject: { virtuals: true },
//     toJSON: { virtuals: true },
//   }
// );
// export const User = model<IUser>("User", userSchema);
