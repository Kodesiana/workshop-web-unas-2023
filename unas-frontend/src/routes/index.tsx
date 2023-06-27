import { useContext } from "react";
import { Navigate, createBrowserRouter } from "react-router-dom";

import { AuthContext } from "@/contexts/AuthContext";

import * as RootPages from "@/pages";
import * as AdminPages from "@/pages/admin";

function LoginRoute() {
	const { user } = useContext(AuthContext);
	if (user && user.expiredAt > new Date()) {
		return <Navigate to="/admin" />;
	}

	return <RootPages.Login />;
}

function ProtectedRoute() {
	const { user, logout } = useContext(AuthContext);
	if (!user || user.expiredAt < new Date()) {
		logout();
		return <Navigate to="/login" />;
	}

	return <RootPages.Layout />;
}

const router = createBrowserRouter([
	{
		element: <RootPages.Layout />,
		children: [
			{
				index: true,
				loader: RootPages.ListLoader,
				element: <RootPages.List />,
			},
			{
				path: "login",
				element: <LoginRoute />,
			},
			{
				path: ":id",
				loader: RootPages.SingleLoader,
				element: <RootPages.Single />,
			},
		],
	},
	{
		path: "/admin",
		element: <ProtectedRoute />,
		children: [
			{
				index: true,
				loader: AdminPages.ListLoader,
				element: <AdminPages.List />,
			},
			{
				path: "create",
				loader: AdminPages.EditLoader,
				element: <AdminPages.Edit />,
			},
			{
				path: ":id",
				loader: AdminPages.EditLoader,
				element: <AdminPages.Edit />,
			},
		],
	},
]);

export default router;
