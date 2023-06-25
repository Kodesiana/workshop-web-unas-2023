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

export default instance;
