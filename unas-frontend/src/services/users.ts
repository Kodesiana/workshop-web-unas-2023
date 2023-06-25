import httpClient from "@/helpers/http_client";

import { LoginResponse } from "./users.types";

export async function login(
	email: string,
	password: string,
): Promise<LoginResponse | null> {
	try {
		const response = await httpClient.post("/api/v1/users/login", {
			email,
			password,
		});

		if (response.status !== 200) {
			console.warn(response.data);
			return null;
		}

		return response.data;
	} catch (err) {
		console.error(err);
		return null;
	}
}
