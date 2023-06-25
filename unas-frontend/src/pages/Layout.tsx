import { Container } from "@mantine/core";
import { Outlet } from "react-router-dom";

export function Layout() {
	return (
		<Container p="xl">
			<Outlet />
		</Container>
	);
}
