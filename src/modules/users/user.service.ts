/* eslint-disable @typescript-eslint/no-explicit-any */
import { JwtPayload } from "jsonwebtoken";
import AppError from "../../errorHelper/AppError";
import { DriverModel } from "../driver/driver.model";
import { IUser, UserRole } from "./user.interface";
import { User } from "./user.models";
import { EmergencyContactInput, UpdateEmergencyContactsInput } from "./user.validate.zod";



const updateUserService = async (
  userId: string,
  payload: Partial<IUser>,
  decodedToken: JwtPayload
) => {
  // Check if user exists
  const isUserExist = await User.findById(userId);
  if (!isUserExist) {
    throw new AppError("User not found", 404);
  }

  // Authorization: User can only update their own profile, admin can update any
  if (decodedToken.id !== userId && decodedToken.role !== UserRole.ADMIN) {
    throw new AppError("You are not authorized to update this profile", 403);
  }

  // Regular users can only update specific fields
  if (decodedToken.role !== UserRole.ADMIN) {
    const allowedFields = ['name', 'phone', 'address', 'picture'];
    const forbiddenFields = Object.keys(payload).filter(
      field => !allowedFields.includes(field)
    );
    
    if (forbiddenFields.length > 0) {
      throw new AppError(`You are not authorized to update: ${forbiddenFields.join(', ')}`, 403);
    }
  }

  // Handle password separately (should use changePassword endpoint)
  if (payload.password) {
    throw new AppError("Please use the change password endpoint to update password", 400);
  }

  // Update user
  const updatedUser = await User.findByIdAndUpdate(userId, payload, {
    new: true,
    runValidators: true,
  }).select('-password'); // Exclude password from response

  return updatedUser;
};
const getAllUsersService = async (
  query: Record<string, string | string[]>
): Promise<any[]> => {
  const searchTerm = query.searchTerm || "";
  delete query.searchTerm;
  
  const toSeachableFields = ["name", "email", "phone"];   
  const searchConditions = toSeachableFields.map((field) => ({
    [field]: { $regex: searchTerm, $options: "i" },
  }));

  const users = await User.aggregate([
    // Match users based on search
    {
      $match: {
        $or: searchConditions,
        ...query
      }
    },
    // Lookup driver data
    {
      $lookup: {
        from: "drivers", // MongoDB collection name (usually pluralized)
        localField: "_id",
        foreignField: "userId",
        as: "driver"
      }
    },
    // Convert driver array to object (since it's one-to-one)
    {
      $addFields: {
        driver: { $arrayElemAt: ["$driver", 0] }
      }
    }
  ]);

  return users;
};
const toggleUserBlockStatus = async (
  userId: string,
  admin: JwtPayload,
  shouldBlock: boolean
) => {
  // Verify admin privileges
  if (admin.role !== UserRole.ADMIN) {
    throw new AppError('Unauthorized: Admin access required', 403);
  }

  // Prevent self-blocking
  if (admin.userId === userId) {
    throw new AppError('Admins cannot block themselves', 400);
  }

  const user = await User.findById(userId);
  if (!user) {
    throw new AppError('User not found', 404);
  }

  // Prevent blocking other admins
  if (user.role === UserRole.ADMIN) {
    throw new AppError('Cannot block other admin users', 403);
  }

  // Update block status
  user.isBlocked = shouldBlock;
  await user.save();

  // If blocking a driver, set offline
  if (shouldBlock && user.role === UserRole.DRIVER) {
    await DriverModel.findOneAndUpdate(
      { userId },
      { onlineStatus: false },
      { new: true }
    );
  }

  return user;
};
const getProfileService = async (userId: string): Promise<IUser | null> => {
  const user = await User.findById(userId);

  if (!user) {
    throw new AppError("User not found", 404);
  }
  return user;
};

// Emergency Contact Services


export const updateEmergencyContactsService = async (
  userId: string,
  payload: UpdateEmergencyContactsInput,
  decodedToken: any
) => {
  // Check if user exists
  const isUserExist = await User.findById(userId);
  if (!isUserExist) {
    throw new AppError("User not found", 404);
  }

  // Authorization: User can only update their own emergency contacts, admin can update any
  if (decodedToken.id !== userId && decodedToken.role !== 'admin') {
    throw new AppError("You are not authorized to update these emergency contacts", 403);
  }

  // Update user's emergency contacts
  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { 
      $set: { 
        emergencyContacts: payload.emergencyContacts,
        updatedAt: new Date()
      } 
    },
    { new: true, runValidators: true }
  ).select('-password'); // Exclude password from response

  if (!updatedUser) {
    throw new AppError("Failed to update emergency contacts", 500);
  }

  return updatedUser;
};

export const getEmergencyContactsService = async (
  userId: string,
  decodedToken: any
) => {
  // Check if user exists
  const isUserExist = await User.findById(userId);
  if (!isUserExist) {
    throw new AppError("User not found", 404);
  }

  // Authorization: User can only view their own emergency contacts, admin can view any
  if (decodedToken.id !== userId && decodedToken.role !== 'admin') {
    throw new AppError("You are not authorized to view these emergency contacts", 403);
  }

  const user = await User.findById(userId).select('emergencyContacts');
  return user?.emergencyContacts || [];
};

export const addEmergencyContactService = async (
  userId: string,
  payload: EmergencyContactInput,
  decodedToken: any
) => {
  // Check if user exists
  const isUserExist = await User.findById(userId);
  if (!isUserExist) {
    throw new AppError("User not found", 404);
  }

  // Authorization: User can only add to their own emergency contacts, admin can add to any
  if (decodedToken.id !== userId && decodedToken.role !== 'admin') {
    throw new AppError("You are not authorized to add emergency contacts", 403);
  }

  // Check if user already has maximum number of contacts
  const currentContacts = isUserExist.emergencyContacts || [];
  if (currentContacts.length >= 10) {
    throw new AppError("Cannot have more than 10 emergency contacts", 400);
  }

  // Check for duplicate phone number
  const duplicateContact = currentContacts.find(
    contact => contact.number === payload.number
  );
  if (duplicateContact) {
    throw new AppError("Emergency contact with this phone number already exists", 400);
  }

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { 
      $push: { emergencyContacts: payload },
      $set: { updatedAt: new Date() }
    },
    { new: true, runValidators: true }
  ).select('-password');

  if (!updatedUser) {
    throw new AppError("Failed to add emergency contact", 500);
  }

  return updatedUser;
};

export const removeEmergencyContactService = async (
  userId: string,
  contactIndex: number,
  decodedToken: any
) => {
  // Check if user exists
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError("User not found", 404);
  }

  // Authorization: User can only remove their own emergency contacts, admin can remove from any
  if (decodedToken.id !== userId && decodedToken.role !== 'admin') {
    throw new AppError("You are not authorized to remove emergency contacts", 403);
  }

  // Check if contact index is valid
  if (!user.emergencyContacts || contactIndex >= user.emergencyContacts.length) {
    throw new AppError("Emergency contact not found", 404);
  }

  // Remove the contact at specified index
  user.emergencyContacts.splice(contactIndex, 1);
  
  const updatedUser = await user.save();
  return updatedUser;
};


export const UserService = {
getProfileService,
  getAllUsersService,
  updateUserService,
  toggleUserBlockStatus,
  updateEmergencyContactsService,
  getEmergencyContactsService,
  addEmergencyContactService,
  removeEmergencyContactService
};
