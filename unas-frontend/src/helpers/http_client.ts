import axios from "axios";

import config from "@/services/config";

// create an axios instance
const instance = axios.create({
	baseURL: config.api_base_url,
});

// inject token to header if exist
instance.interceptors.request.use((config) => {
	// get the access token from local storage
	const user = JSON.parse(localStorage.getItem("user") || "{}");
	if (user && user.token) {
		// inject the access token to the request header
		config.headers.setAuthorization(`Bearer ${user.token}`);
	}

	return config;
});

// intercept expired access token
instance.interceptors.response.use(
	(response) => response,
	async (error) => {
		// if the response is 401 Unauthorized, it's a token invalid error
		if (error.response.status === 401) {
			// clear the local storage and dispatch an event to notify other tabs
			localStorage.clear();
			window.dispatchEvent(new StorageEvent("storage"));
			window.location.href = "/login";

			// reject the promise with the error
			return error;
		}

		return error;
	},
);

export default instance;
