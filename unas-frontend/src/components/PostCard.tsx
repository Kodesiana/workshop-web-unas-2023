import {
	AspectRatio,
	Card,
	Group,
	Image,
	Text,
	createStyles,
} from "@mantine/core";
import { Link } from "react-router-dom";

import { PostItem } from "@/services/posts.types";
import { formatDate } from "@/helpers/formatter";

export type PostCardProps = {
	post: PostItem;
};

const useStyles = createStyles((theme) => ({
	card: {
		transition: "transform 150ms ease, box-shadow 150ms ease",

		"&:hover": {
			transform: "scale(1.01)",
			boxShadow: theme.shadows.md,
		},
	},

	title: {
		fontFamily: `Greycliff CF, ${theme.fontFamily}`,
		fontWeight: 600,
	},
}));

export function PostCard({ post }: PostCardProps) {
	const { classes } = useStyles();
	return (
		<Card
			p="md"
			radius="md"
			className={classes.card}
			component={Link}
			to={`/${post.id}`}
		>
			<AspectRatio ratio={1920 / 1080}>
				<Image src={post.imageUrl} />
			</AspectRatio>
			<Group position="apart" mt="md">
				<Text color="dimmed" size="xs">
					{formatDate(post.createdAt)}
				</Text>
				<Text color="dimmed" size="xs">
					Oleh: {post.author}
				</Text>
			</Group>
			<Text className={classes.title} mt={5}>
				{post.title}
			</Text>
		</Card>
	);
}
