import { z } from "zod";

const MulterFile = z.object({
	fieldname: z.string(),
	originalname: z.string(),
	encoding: z.string(),
	mimetype: z.string(),
	size: z.number(),
	destination: z.string(),
	filename: z.string(),
	path: z.string(),
});

const CreateSchema = z.object({
	title: z.string().min(1).max(255),
	content: z.string().min(1),
	image: MulterFile,
});

const UpdateSchema = z.object({
	id: z.string().uuid(),
	title: z.string().min(1).max(255).optional(),
	content: z.string().min(1).optional(),
	image: MulterFile.optional(),
});

const DeleteSchema = z.object({
	id: z.string().uuid(),
});

const GetSchema = z.object({
	id: z.string().uuid(),
});

const ListSchema = z.object({
	q: z.string().min(1).optional(),
	orderBy: z.enum(["id", "title", "author", "createdAt"]).default("createdAt"),
	order: z.enum(["asc", "desc"]).default("desc"),
	limit: z.coerce.number().min(1).max(100).default(10),
	page: z.coerce.number().min(1).default(1),
});

export { CreateSchema, UpdateSchema, DeleteSchema, GetSchema, ListSchema };
