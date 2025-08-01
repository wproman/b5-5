import { Types } from "mongoose";

export enum UserRole {
  ADMIN = "admin",
  RIDER = "rider",
  DRIVER = "driver",
}

export enum IsActive {
  ACTIVE = "active",
  INACTIVE = "inactive",
  BLOCKED = "blocked",
  DELETED = "deleted",
}
// auth provider
export interface IAuthProvider {
  provider: "google" | "credentials"; // google, facebook, etc.
  providerId: string;
}
export interface IUser {
  id?: Types.ObjectId;
  name: string;
  email: string;
  password?: string;
  phone?: string;
  picture?: string;
  address?: string;
  isDeleted?: boolean;
  isActive?: IsActive;
  isVerified?: boolean;

  auths: IAuthProvider[];
  role: UserRole;

}
// // For creating new user (excludes _id, createdAt, updatedAt)
// interface IUserCreate extends Omit<IUser, '_id' | 'createdAt' | 'updatedAt'> {
//   password: string; // Required during creation
// }

// // For updating user (makes most fields optional)
// interface IUserUpdate extends Partial<Omit<IUser, '_id' | 'email' | 'role' | 'createdAt' | 'updatedAt'>> {
//   password?: string;
// }