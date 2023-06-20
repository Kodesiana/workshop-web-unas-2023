import { z } from "zod";

const LoginSchema = z.object({
	email: z.string().email(),
	password: z.string().min(1),
});

export { LoginSchema };
