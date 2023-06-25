import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

import config from "./config";

export function errorHandler() {
	return function innerErrorHandler(
		error: Error,
		req: Request,
		res: Response,
		next: NextFunction,
	) {
		if (error) {
			res.status(500).json({ message: error.message });
		} else {
			next();
		}
	};
}

export function jwtAuth() {
	return function innerAuth(req: Request, res: Response, next: NextFunction) {
		try {
			// check if the authorization header is present
			const parts = req.headers.authorization?.split(" ");
			if (parts?.length !== 2) {
				throw new Error("No token provided");
			}

			// split the authorization header
			const [scheme, token] = parts;

			// check if the authorization scheme is valid
			if (scheme !== "Bearer") {
				throw new Error("Invalid authentication scheme");
			}

			// check if the token is provided
			if (!token) {
				throw new Error("No token provided");
			}

			// verify the token
			const decoded = jwt.verify(token, config.jwt.secretKey);

			// attach the user to the request
			Object.assign(req, { user: decoded });

			// call the next middleware
			next();
		} catch (error) {
			res.status(401).json({ message: "Unauthorized" });
		}
	};
}
