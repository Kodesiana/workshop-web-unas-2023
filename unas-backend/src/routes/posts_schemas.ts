import { z } from "zod";

const CreateSchema = z.object({
	title: z.string().min(1).max(255),
	category: z.string().min(1).max(255),
	content: z.string().min(1),
});

const UpdateSchema = z.object({
	id: z.string().uuid(),
	title: z.string().min(1).max(255).optional(),
	category: z.string().min(1).max(255).optional(),
	content: z.string().min(1).optional(),
});

const DeleteSchema = z.object({
	id: z.string().uuid(),
});

const GetSchema = z.object({
	id: z.string().uuid(),
});

const ListSchema = z.object({
	q: z.string().min(1).optional(),
	orderBy: z
		.enum(["id", "title", "content", "publishedAt"])
		.default("publishedAt"),
	order: z.enum(["asc", "desc"]).default("desc"),
	limit: z.number().min(1).max(100).default(10),
	page: z.number().min(1).default(1),
});

export { CreateSchema, UpdateSchema, DeleteSchema, GetSchema, ListSchema };
