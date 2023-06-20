import bcryptjs from "bcryptjs";

export function checkPassword(password: string, hashedPassword: string) {
	return bcryptjs.compareSync(password, hashedPassword);
}

export function calcTotalPage(total: number, limit: number) {
	return Math.ceil(total / limit);
}

export function calcPageOffset(page: number, limit: number) {
	return (page - 1) * limit;
}
