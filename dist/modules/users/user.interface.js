"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IsActive = exports.UserRole = void 0;
var UserRole;
(function (UserRole) {
    UserRole["ADMIN"] = "admin";
    UserRole["RIDER"] = "rider";
    UserRole["DRIVER"] = "driver";
})(UserRole || (exports.UserRole = UserRole = {}));
var IsActive;
(function (IsActive) {
    IsActive["ACTIVE"] = "active";
    IsActive["INACTIVE"] = "inactive";
    IsActive["BLOCKED"] = "blocked";
    IsActive["DELETED"] = "deleted";
})(IsActive || (exports.IsActive = IsActive = {}));
// // For creating new user (excludes _id, createdAt, updatedAt)
// interface IUserCreate extends Omit<IUser, '_id' | 'createdAt' | 'updatedAt'> {
//   password: string; // Required during creation
// }
// // For updating user (makes most fields optional)
// interface IUserUpdate extends Partial<Omit<IUser, '_id' | 'email' | 'role' | 'createdAt' | 'updatedAt'>> {
//   password?: string;
// }
