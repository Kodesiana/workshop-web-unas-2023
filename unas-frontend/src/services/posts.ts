import httpClient from "@/helpers/http_client";

import {
	CreateArgs,
	ListArgs,
	UpdateArgs,
	Post,
	PostList,
} from "./posts.types";

export async function create(args: CreateArgs): Promise<Post | null> {
	try {
		const formData = new FormData();
		formData.append("title", args.title);
		formData.append("content", args.content);
		formData.append("image", args.image);

		const response = await httpClient.post("/api/v1/posts", formData);
		return {
			...response.data,
			createdAt: new Date(response.data.createdAt),
		};
	} catch (err) {
		console.error(err);
		return null;
	}
}

export async function update(args: UpdateArgs): Promise<Post | null> {
	try {
		const formData = new FormData();
		if (args.title) formData.append("title", args.title);
		if (args.content) formData.append("content", args.content);
		if (args.image) formData.append("image", args.image);

		const response = await httpClient.put(`/api/v1/posts/${args.id}`, formData);
		return {
			...response.data,
			createdAt: new Date(response.data.createdAt),
		};
	} catch (err) {
		console.error(err);
		return null;
	}
}

export async function deletePost(id: string) {
	try {
		await httpClient.delete(`/api/v1/posts/${id}`);
	} catch (err) {
		console.error(err);
	}
}

export async function get(id: string): Promise<Post | null> {
	try {
		const response = await httpClient.get(`/api/v1/posts/${id}`);
		return {
			...response.data,
			createdAt: new Date(response.data.createdAt),
		};
	} catch (err) {
		console.error(err);
		return null;
	}
}

export async function list(args: ListArgs): Promise<PostList | null> {
	try {
		const response = await httpClient.get("/api/v1/posts", { params: args });
		return {
			meta: response.data.meta,
			data: response.data.data.map((t: any) => ({
				...t,
				createdAt: new Date(t.createdAt),
			})),
		};
	} catch (err) {
		console.error(err);
		return null;
	}
}
