import { z } from "zod";

// Zod schema for user
const userSchemaZod = z.object({
  name: z.string().min(4, "Name is required"),
  email: z.string().email(),
  password: z.string().optional(),

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

export { updateUserSchemaZod, userSchemaZod };
