import { ColorScheme, MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { ModalsProvider } from "@mantine/modals";
import { useLocalStorage } from "@mantine/hooks";
import { RouterProvider } from "react-router-dom";

import router from "@/routes";
import { AuthProvider } from "@/contexts/AuthContext";

function App() {
	const [colorScheme] = useLocalStorage<ColorScheme>({
		key: "color-scheme",
		defaultValue: "light",
	});

	return (
		<AuthProvider>
			<MantineProvider
				withGlobalStyles
				withNormalizeCSS
				theme={{ colorScheme }}
			>
				<ModalsProvider>
					<Notifications />
					<RouterProvider router={router} />
				</ModalsProvider>
			</MantineProvider>
		</AuthProvider>
	);
}

export default App;
