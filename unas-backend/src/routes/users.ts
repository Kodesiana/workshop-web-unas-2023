import dayjs from "dayjs";
import jwt from "jsonwebtoken";
import { Router } from "express";
import { v4 as uuid } from "uuid";

import db from "../database";
import config from "../config";
import * as helper from "../helper";
import * as schemas from "./users_schemas";

const router = Router();

router.post("/api/v1/users/register", async (req, res) => {
	// get the request body
	const model = await schemas.RegisterSchema.safeParseAsync(req.body);
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
	if (user) {
		return res.status(401).json({
			message: "User already exists",
		});
	}

	// create user
	const registeredUser = await db.user.create({
		data: {
			id: uuid(),
			name: model.data.name,
			email: model.data.email.toLowerCase(),
			hashedPassword: await helper.hashPassword(model.data.password),
		},
	});

	// return the response
	return res.json({
		id: registeredUser.id,
		name: registeredUser.name,
		email: registeredUser.email,
	});
});

router.post("/api/v1/users/login", async (req, res) => {
	// get the request body
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
	if (!(await helper.checkPassword(model.data.password, user.hashedPassword))) {
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
		expiredAt: dayjs().add(config.jwt.expiresIn, "second").toISOString(),
	});
});

export default router;
