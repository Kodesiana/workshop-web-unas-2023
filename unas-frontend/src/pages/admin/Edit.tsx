import { useState } from "react";
import {
	Button,
	Group,
	SimpleGrid,
	Stack,
	Title,
	Text,
	TextInput,
	FileInput,
} from "@mantine/core";
import { Link } from "@mantine/tiptap";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import { Params, useLoaderData, useNavigate } from "react-router-dom";

import { Editor } from "@/components/Editor";
import { Post } from "@/services/posts.types";
import { create, get, update } from "@/services/posts";

export type EditProps = {
	editMode: boolean;
	post: Post;
};

export async function EditLoader({ params }: { params: Params }) {
	if (!params.id) {
		return { editMode: false };
	}

	const post = await get(params.id);
	return { editMode: true, post };
}

export function Edit() {
	const navigate = useNavigate();
	const props = useLoaderData() as EditProps;

	if (!props) {
		return <Text>Server error! Cek apakah backend aktif.</Text>;
	}

	if (props.editMode && !props.post) {
		return <Text>Post tidak ditemukan!</Text>;
	}

	const [title, setTitle] = useState(props.post?.title);
	const [image, setImage] = useState<File | null>(null);
	const editor = useEditor({
		extensions: [
			StarterKit,
			Underline,
			Link,
			TextAlign.configure({ types: ["heading", "paragraph"] }),
		],
		content: props.post?.content,
	});

	async function handleSave() {
		if (props.editMode) {
			await update({
				id: props.post.id,
				title,
				content: editor?.getHTML(),
				image: image as any,
			});

			navigate("/admin");
			return;
		}

		await create({
			title,
			content: editor?.getHTML() || "",
			image: image as any,
		});
		navigate("/admin");
	}

	return (
		<div>
			<Group position="apart" mb="xl">
				<Stack spacing={0}>
					<Title order={2}>Edit Artikel</Title>
				</Stack>
			</Group>
			<SimpleGrid>
				<TextInput
					required={!props.editMode}
					label="Judul"
					placeholder="Judul"
					value={title}
					onChange={(e) => setTitle(e.target.value)}
				/>
				<FileInput
					required={!props.editMode}
					label="Gambar"
					accept="image/*"
					value={image}
					onChange={setImage}
				/>
				<Editor editor={editor} />
				<Button onClick={handleSave}>Simpan</Button>
			</SimpleGrid>
		</div>
	);
}
