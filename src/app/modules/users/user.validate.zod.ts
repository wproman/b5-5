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


export { updateUserSchemaZod, userIdParamSchema, userSchemaZod };

