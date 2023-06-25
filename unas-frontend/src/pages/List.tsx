import {
	SimpleGrid,
	Image,
	Text,
	Title,
	Group,
	Stack,
	Flex,
	Button,
	ActionIcon,
	ColorScheme,
} from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";
import { IconMoonStars, IconSun } from "@tabler/icons-react";
import { useLoaderData, useNavigate } from "react-router-dom";

import logo from "@/assets/logo.png";

import config from "@/services/config";
import { list } from "@/services/posts";
import { PostList } from "@/services/posts.types";
import { PostCard } from "@/components/PostCard";

export type ListProps = {
	posts: PostList;
};

export async function ListLoader() {
	const posts = await list({});
	return { posts };
}

export function List() {
	const navigate = useNavigate();
	const props = useLoaderData() as ListProps;

	if (!props) {
		return <Text>Server error! Cek apakah backend aktif.</Text>;
	}

	const [colorScheme, setColorScheme] = useLocalStorage<ColorScheme>({
		key: "color-scheme",
		defaultValue: "light",
	});

	function toggleColorScheme() {
		setColorScheme(colorScheme === "dark" ? "light" : "dark");
	}

	function goToAdmin() {
		navigate("/admin");
	}

	const cards = props.posts.data.map((article) => (
		<PostCard key={article.id} post={article} />
	));

	return (
		<div>
			<Group position="apart" mb="xl">
				<Flex align="center">
					<Image src={logo} width={54} mr={"md"} />
					<Stack spacing="0">
						<Title>{config.title}</Title>
						<Text c="dimmed">{config.description}</Text>
					</Stack>
				</Flex>
				<Flex align="center">
					<ActionIcon onClick={toggleColorScheme}>
						{colorScheme === "dark" ? <IconSun /> : <IconMoonStars />}
					</ActionIcon>
					<Button ml="sm" variant="subtle" onClick={goToAdmin}>
						Admin
					</Button>
				</Flex>
			</Group>

			<SimpleGrid cols={2} breakpoints={[{ maxWidth: "sm", cols: 1 }]}>
				{cards.length > 0 ? cards : <Text>Belum ada artikel.</Text>}
			</SimpleGrid>
		</div>
	);
}
