import { z } from "zod";

// Zod schema for user
const userSchemaZod = z.object({
  name: z.string().min(4, "Name is required"),
  email: z.string().email(),
  password: z.string().optional(),
  role: z.enum(['rider', 'driver'], {
    errorMap: () => ({ message: "Role must be either 'rider' or 'driver'" }),
  }),
  licenseNumber: z.string().optional(),
  vehicleInfo: z.object({
    model: z.string().optional(),
    plate: z.string().optional(),
    color: z.string().optional(),
  }).optional(),
  phone: z.string().optional(),
  picture: z.string().optional(),
  address: z.string().optional(),
  
});

// update user schema
const updateUserSchemaZod = z.object({
  name: z.string().min(4, "Name is required").optional(),

  password: z.string().optional(),
  phone: z.string().optional(),
  picture: z.string().optional(),
  address: z.string().optional(),
});

 const userIdParamSchema = z.object({
  
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, {
      message: 'Invalid user ID format'
    })
  
});

export const emergencyContactSchema = z.object({
  name: z.string()
    .min(1, 'Contact name is required')
    .max(50, 'Contact name cannot exceed 50 characters')
    .trim(),
  
  number: z.string()
    .min(1, 'Contact number is required')
    .transform(val => val.replace(/\s/g, '')) // Remove spaces
    .refine(
      (val) => /^[+]?[1-9][\d]{0,15}$/.test(val),
      'Invalid phone number format. Please include country code (e.g., +1 for US)'
    )
    .refine(
      (val) => val.length >= 5 && val.length <= 20,
      'Phone number must be between 5 and 20 characters'
    ),
  
  type: z.enum(['personal', 'police', 'hospital'], {
    errorMap: () => ({ message: 'Contact type must be personal, police, or hospital' })
  }),
  
  relationship: z.string()
    .max(30, 'Relationship cannot exceed 30 characters')
    .trim()
    .optional(),
  
  isPrimary: z.boolean().optional().default(false)
});

// Update Emergency Contacts Schema
export const updateEmergencyContactsSchema = z.object({
  body: z.object({
    emergencyContacts: z.array(emergencyContactSchema)
      .min(1, 'At least one emergency contact is required')
      .max(10, 'Cannot have more than 10 emergency contacts')
      .refine(
        (contacts) => {
          const numbers = contacts.map(c => c.number);
          return new Set(numbers).size === numbers.length;
        },
        'Duplicate phone numbers found in emergency contacts'
      )
  })
});

// Add Single Emergency Contact Schema
export const addEmergencyContactSchema = z.object({
  body: emergencyContactSchema
});

// Remove Emergency Contact Schema
export const removeEmergencyContactSchema = z.object({
  params: z.object({
    contactIndex: z.string()
      .regex(/^\d+$/, 'Contact index must be a valid number')
      .transform(val => parseInt(val, 10))
      .refine(val => val >= 0, 'Contact index cannot be negative')
  })
});

// Get Emergency Contacts Schema (empty validation)
export const getEmergencyContactsSchema = z.object({});

// Export all validations
export const emergencyContactValidation = {
  updateEmergencyContacts: updateEmergencyContactsSchema,
  addEmergencyContact: addEmergencyContactSchema,
  removeEmergencyContact: removeEmergencyContactSchema,
  getEmergencyContacts: getEmergencyContactsSchema
};
// Type exports for TypeScript
export type EmergencyContactInput = z.infer<typeof emergencyContactSchema>;
export type UpdateEmergencyContactsInput = z.infer<typeof updateEmergencyContactsSchema>['body'];
export type AddEmergencyContactInput = z.infer<typeof addEmergencyContactSchema>['body'];
export type RemoveEmergencyContactInput = z.infer<typeof removeEmergencyContactSchema>['params'];
export { updateUserSchemaZod, userIdParamSchema, userSchemaZod };

