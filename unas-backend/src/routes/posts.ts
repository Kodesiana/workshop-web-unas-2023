import multer from "multer";
import { Router } from "express";
import { v4 as uuid } from "uuid";

import db from "../database";
import * as helper from "../helper";
import * as middleware from "../middleware";
import * as schemas from "./posts_schemas";

const router = Router();
const uploadMiddleware = multer({
	dest: "tmp/",
});

router.get("/api/v1/posts", async (req, res) => {
	// get the search parameters
	const model = await schemas.ListSchema.safeParseAsync(req.query);
	if (!model.success) {
		return res.status(400).json(model.error);
	}

	// sorting
	const sortQuery = {};
	if (model.data.orderBy === "author") {
		Object.assign(sortQuery, { author: { name: model.data.order } });
	} else {
		Object.assign(sortQuery, { [model.data.orderBy]: model.data.order });
	}

	// build the query
	const posts = await db.post.findMany({
		take: model.data.limit,
		skip: helper.calcPageOffset(model.data.page, model.data.limit),
		where: {
			title: {
				contains: model.data.q,
			},
		},
		orderBy: sortQuery,
		select: {
			id: true,
			title: true,
			createdAt: true,
			imageUrl: true,
			author: {
				select: {
					name: true,
				},
			},
		},
	});

	// get total count
	const total = await db.post.count({
		where: {
			title: {
				contains: model.data.q,
			},
		},
	});

	// return the response
	return res.json({
		meta: {
			total,
			totalPage: helper.calcTotalPage(total, model.data.limit),
			count: posts.length,
			currentPage: model.data.page,
		},
		data: posts.map((post) => ({
			...post,
			author: post.author.name,
			createdAt: new Date(post.createdAt),
		})),
	});
});

router.post(
	"/api/v1/posts",
	middleware.jwtAuth(),
	uploadMiddleware.single("image"),
	async (req, res) => {
		// get the model
		const model = await schemas.CreateSchema.safeParseAsync({
			...req.body,
			image: req.file,
		});
		if (!model.success) {
			return res.status(400).json(model.error);
		}

		// get the user ID from JWT
		// @ts-expect-error
		const userId = req.user.id;

		// create the post
		const id = uuid();
		const post = await db.post.create({
			data: {
				id: id,
				title: model.data.title,
				content: model.data.content,
				imageUrl: helper.saveUploadedFile(model.data.image, id),
				createdAt: new Date(),
				author: {
					connect: {
						id: userId,
					},
				},
			},
		});

		// return the response
		return res.json(post);
	},
);

router.put(
	"/api/v1/posts/:id",
	middleware.jwtAuth(),
	uploadMiddleware.single("image"),
	async (req, res) => {
		// get the model
		const model = await schemas.UpdateSchema.safeParseAsync({
			...req.body,
			image: req.file,
			id: req.params.id,
		});
		if (!model.success) {
			return res.status(400).json(model.error);
		}

		// update the post
		const post = await db.post.update({
			where: {
				id: model.data.id,
			},
			data: {
				title: model.data.title,
				content: model.data.content,
				...(model.data.image && {
					imageUrl: helper.saveUploadedFile(model.data.image, model.data.id),
				}),
			},
		});

		// return the response
		return res.json(post);
	},
);

router.delete("/api/v1/posts/:id", middleware.jwtAuth(), async (req, res) => {
	// get the model
	const model = await schemas.DeleteSchema.safeParseAsync({
		id: req.params.id,
	});
	if (!model.success) {
		return res.status(400).json(model.error);
	}

	// check if the post exists
	const post = await db.post.findUnique({
		where: {
			id: model.data.id,
		},
	});
	if (!post) {
		return res.status(404).json({
			message: "Post not found",
		});
	}

	// delete the file on disk
	if (post.imageUrl) {
		await helper.deleteUploadedFile(post.imageUrl);
	}

	// delete the post
	await db.post.delete({
		where: {
			id: model.data.id,
		},
	});

	// return the response
	return res.json({
		message: "Post deleted",
	});
});

router.get("/api/v1/posts/:id", async (req, res) => {
	// get the model
	const model = await schemas.GetSchema.safeParseAsync({
		id: req.params.id,
	});
	if (!model.success) {
		return res.status(400).json(model.error);
	}

	// get the post
	const post = await db.post.findUnique({
		where: {
			id: model.data.id,
		},
		include: {
			author: {
				select: {
					name: true,
				},
			},
		},
	});
	if (!post) {
		return res.status(404).json({
			message: "Post not found",
		});
	}

	// return the response
	return res.json({
		...post,
		author: post.author.name,
	});
});

export default router;
