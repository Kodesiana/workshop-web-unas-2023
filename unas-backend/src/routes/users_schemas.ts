import { z } from "zod";

const RegisterSchema = z.object({
	name: z.string().min(5),
	email: z.string().email(),
	password: z.string().min(5),
});

const LoginSchema = z.object({
	email: z.string().email(),
	password: z.string().min(5),
});

export { RegisterSchema, LoginSchema };
