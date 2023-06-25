import { useContext } from "react";
import {
	TextInput,
	PasswordInput,
	Paper,
	Title,
	Text,
	Container,
	Group,
	Button,
} from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { useNavigate } from "react-router-dom";
import { z } from "zod";

import { AuthContext } from "@/contexts/AuthContext";
import { login } from "@/services/users";

import styles from "./Login.module.css";

export function Login() {
	const auth = useContext(AuthContext);
	const navigate = useNavigate();

	const form = useForm({
		initialValues: {
			email: "",
			password: "",
		},

		validate: zodResolver(
			z.object({
				email: z.string().email(),
				password: z.string().min(5),
			}),
		),
	});

	async function handleLogin(values: { email: string; password: string }) {
		// login
		const loginRes = await login(values.email, values.password);
		if (!loginRes) {
			notifications.show({
				title: "Login gagal",
				message: "Email atau password salah",
				color: "red",
			});
			return;
		}

		// set token
		auth.login({
			id: loginRes.id,
			name: loginRes.name,
			token: loginRes.token,
		});

		// navigate to dashboard
		navigate("/admin");
	}

	return (
		<Container size={420} my={40}>
			<Title align="center" className={styles.title}>
				Selamat datang!
			</Title>
			<Text color="dimmed" size="sm" align="center" mt={5}>
				Masuk ke Blog.
			</Text>

			<Paper withBorder shadow="md" p={30} mt={30} radius="md">
				<form onSubmit={form.onSubmit(handleLogin)}>
					<TextInput label="Email" required {...form.getInputProps("email")} />
					<PasswordInput
						label="Kata sandi"
						mt="md"
						required
						{...form.getInputProps("password")}
					/>

					<Group position="apart" mt="xl">
						<Button fullWidth type="submit">
							Masuk
						</Button>
					</Group>
				</form>
			</Paper>
		</Container>
	);
}
