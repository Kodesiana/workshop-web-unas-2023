import { createContext, useMemo } from "react";
import { useLocalStorage } from "@mantine/hooks";

export interface UserData {
	id: string;
	name: string;
	token: string;
	expiredAt: Date;
}

export interface AuthContext {
	user: UserData | null;
	login: (user: UserData | null) => void;
	logout: () => void;
}

export const AuthContext = createContext<AuthContext>({
	user: null,
	login: () => {},
	logout: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const [user, setUser] = useLocalStorage<UserData | null>({ key: "user" });

	function login(user: UserData | null) {
		setUser(user);
	}

	function logout() {
		setUser(null);
	}

	const memo = useMemo(() => ({ user, login, logout }), [user, login, logout]);
	return <AuthContext.Provider value={memo}>{children}</AuthContext.Provider>;
}
