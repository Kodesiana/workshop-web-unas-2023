import jwt from "jsonwebtoken";
import { Router } from "express";

import db from "../database";
import config from "../config";
import * as helper from "../helper";
import * as schemas from "./users_schemas";

const router = Router();

router.post("/api/v1/users/login", async (req, res) => {
	// get the search parameters
	const model = await schemas.LoginSchema.safeParseAsync(req.body);
	if (!model.success) {
		return res.status(400).json(model.error);
	}

	// find the user
	const user = await db.user.findFirst({
		where: {
			email: model.data.email.toLowerCase(),
		},
	});

	// check if the user exists
	if (!user) {
		return res.status(401).json({
			message: "Credentials is invalid",
		});
	}

	// check if the password is correct
	if (!helper.checkPassword(model.data.password, user.hashedPassword)) {
		return res.status(401).json({
			message: "Credentials is invalid",
		});
	}

	// create token
	const tokenClaims = {
		id: user.id,
		name: user.name,
	};
	const token = jwt.sign(tokenClaims, config.jwt.secretKey, {
		algorithm: "HS256",
		audience: config.jwt.audience,
		issuer: config.jwt.issuer,
		expiresIn: config.jwt.expiresIn,
	});

	// return the response
	return res.json({
		id: user.id,
		name: user.name,
		token,
	});
});

export default router;
