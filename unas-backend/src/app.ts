import path from "path";
import cors from "cors";
import morgan from "morgan";
import express from "express";

import config from "./config";
import * as routers from "./routes";
import { errorHandler } from "./middleware";

// create Express app
const app = express();

// add middleware
app.use(errorHandler());
app.use(cors({ origin: config.corsOrigin }));
app.use(express.json());
app.use(morgan("dev"));

// add routes
app.use(routers.Users);
app.use(routers.Posts);
app.use(
	"/uploads",
	express.static(path.resolve(process.cwd(), "uploads"), { maxAge: "1h" }),
);

// start Express server
app.listen(config.port, () => {
	console.log(`Server started at http://localhost:${config.port}`);
});
