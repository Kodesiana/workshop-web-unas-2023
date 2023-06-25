import path from "path";
import fs from "fs/promises";
import bcryptjs from "bcryptjs";

import config from "./config";

export async function hashPassword(password: string) {
	return await bcryptjs.hash(password, 10);
}

export async function checkPassword(password: string, hashedPassword: string) {
	return await bcryptjs.compare(password, hashedPassword);
}

export function calcTotalPage(total: number, limit: number) {
	return Math.ceil(total / limit);
}

export function calcPageOffset(page: number, limit: number) {
	return (page - 1) * limit;
}

export function saveUploadedFile(
	multerData: { originalname: string; filename: string },
	id: string,
) {
	const ext = path.extname(multerData.originalname);
	const oldPath = path.resolve(process.cwd(), "tmp", multerData.filename);
	const newPath = path.resolve(process.cwd(), "uploads", `${id}${ext}`);

	fs.rename(oldPath, newPath);

	return `http://localhost:${config.port}/uploads/${id}${ext}`;
}

export async function deleteUploadedFile(imageUrl: string) {
	try {
		const filename = path.basename(imageUrl);
		const fullPath = path.resolve(process.cwd(), "uploads", filename);
		await fs.unlink(fullPath);
	} catch (error) {
		console.error(error);
	}
}
