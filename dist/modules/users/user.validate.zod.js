"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userSchemaZod = exports.userIdParamSchema = exports.updateUserSchemaZod = exports.emergencyContactValidation = exports.getEmergencyContactsSchema = exports.removeEmergencyContactSchema = exports.addEmergencyContactSchema = exports.updateEmergencyContactsSchema = exports.emergencyContactSchema = void 0;
const zod_1 = require("zod");
// Zod schema for user
const userSchemaZod = zod_1.z.object({
    name: zod_1.z.string().min(4, "Name is required"),
    email: zod_1.z.string().email(),
    password: zod_1.z.string().optional(),
    role: zod_1.z.enum(['rider', 'driver'], {
        errorMap: () => ({ message: "Role must be either 'rider' or 'driver'" }),
    }),
    licenseNumber: zod_1.z.string().optional(),
    vehicleInfo: zod_1.z.object({
        model: zod_1.z.string().optional(),
        plate: zod_1.z.string().optional(),
        color: zod_1.z.string().optional(),
    }).optional(),
    phone: zod_1.z.string().optional(),
    picture: zod_1.z.string().optional(),
    address: zod_1.z.string().optional(),
});
exports.userSchemaZod = userSchemaZod;
// update user schema
const updateUserSchemaZod = zod_1.z.object({
    name: zod_1.z.string().min(4, "Name is required").optional(),
    password: zod_1.z.string().optional(),
    phone: zod_1.z.string().optional(),
    picture: zod_1.z.string().optional(),
    address: zod_1.z.string().optional(),
});
exports.updateUserSchemaZod = updateUserSchemaZod;
const userIdParamSchema = zod_1.z.object({
    id: zod_1.z.string().regex(/^[0-9a-fA-F]{24}$/, {
        message: 'Invalid user ID format'
    })
});
exports.userIdParamSchema = userIdParamSchema;
exports.emergencyContactSchema = zod_1.z.object({
    name: zod_1.z.string()
        .min(1, 'Contact name is required')
        .max(50, 'Contact name cannot exceed 50 characters')
        .trim(),
    number: zod_1.z.string()
        .min(1, 'Contact number is required')
        .transform(val => val.replace(/\s/g, '')) // Remove spaces
        .refine((val) => /^[+]?[1-9][\d]{0,15}$/.test(val), 'Invalid phone number format. Please include country code (e.g., +1 for US)')
        .refine((val) => val.length >= 5 && val.length <= 20, 'Phone number must be between 5 and 20 characters'),
    type: zod_1.z.enum(['personal', 'police', 'hospital'], {
        errorMap: () => ({ message: 'Contact type must be personal, police, or hospital' })
    }),
    relationship: zod_1.z.string()
        .max(30, 'Relationship cannot exceed 30 characters')
        .trim()
        .optional(),
    isPrimary: zod_1.z.boolean().optional().default(false)
});
// Update Emergency Contacts Schema
exports.updateEmergencyContactsSchema = zod_1.z.object({
    body: zod_1.z.object({
        emergencyContacts: zod_1.z.array(exports.emergencyContactSchema)
            .min(1, 'At least one emergency contact is required')
            .max(10, 'Cannot have more than 10 emergency contacts')
            .refine((contacts) => {
            const numbers = contacts.map(c => c.number);
            return new Set(numbers).size === numbers.length;
        }, 'Duplicate phone numbers found in emergency contacts')
    })
});
// Add Single Emergency Contact Schema
exports.addEmergencyContactSchema = zod_1.z.object({
    body: exports.emergencyContactSchema
});
// Remove Emergency Contact Schema
exports.removeEmergencyContactSchema = zod_1.z.object({
    params: zod_1.z.object({
        contactIndex: zod_1.z.string()
            .regex(/^\d+$/, 'Contact index must be a valid number')
            .transform(val => parseInt(val, 10))
            .refine(val => val >= 0, 'Contact index cannot be negative')
    })
});
// Get Emergency Contacts Schema (empty validation)
exports.getEmergencyContactsSchema = zod_1.z.object({});
// Export all validations
exports.emergencyContactValidation = {
    updateEmergencyContacts: exports.updateEmergencyContactsSchema,
    addEmergencyContact: exports.addEmergencyContactSchema,
    removeEmergencyContact: exports.removeEmergencyContactSchema,
    getEmergencyContacts: exports.getEmergencyContactsSchema
};
