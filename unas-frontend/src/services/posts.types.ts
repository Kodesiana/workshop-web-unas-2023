// ---- requests schemas

export type CreateArgs = {
	title: string;
	content: string;
	image: File;
};

export type UpdateArgs = {
	id: string;
	title?: string;
	content?: string;
	image?: File;
};

export type ListArgs = {
	q?: string;
	orderBy?: "id" | "title" | "content" | "publishedAt";
	order?: "asc" | "desc";
	limit?: number;
	page?: number;
};

// ---- responses schemas

export type PostItem = {
	id: string;
	title: string;
	author: string;
	createdAt: Date;
	imageUrl: string;
};

export type PostList = {
	data: PostItem[];
	meta: {
		count: number;
		currentPage: number;
		total: number;
		totalPage: number;
	};
};

export type Post = {
	id: string;
	title: string;
	author: string;
	createdAt: Date;
	imageUrl: string;
	content: string;
};
