import {
	AspectRatio,
	Image,
	Title,
	Text,
	TypographyStylesProvider,
} from "@mantine/core";
import { Params, useLoaderData } from "react-router-dom";

import { get } from "@/services/posts";
import { Post } from "@/services/posts.types";
import { formatDate } from "@/helpers/formatter";

export type SingleProps = {
	post: Post;
};

export async function SingleLoader({ params }: { params: Params }) {
	const id = params.id ?? "";
	const post = await get(id);

	return { post };
}

export function Single() {
	const post = useLoaderData() as SingleProps;

	if (!post) return <div>Post not found</div>;

	return (
		<div>
			<Title order={2}>{post.post.title}</Title>
			<Text>Ditulis oleh: {post.post.author}</Text>
			<Text>Dipos pada: {formatDate(post.post.createdAt)}</Text>
			<AspectRatio ratio={1920 / 1080} h={400} mt="md" mb="md">
				<Image src={post.post.imageUrl} />
			</AspectRatio>
			<TypographyStylesProvider>
				<div dangerouslySetInnerHTML={{ __html: post.post.content }} />
			</TypographyStylesProvider>
		</div>
	);
}
