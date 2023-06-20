import cors from "cors";
import express from "express";

import config from "./config";
import * as routers from "./routes";

// create Express app
const app = express();

// add middleware
app.use(cors({ origin: config.corsOrigin }));
app.use(express.json());

// add routes
app.use(routers.Users);
app.use(routers.Posts);

// start Express server
app.listen(config.port, () => {
	console.log(`Server started at http://localhost:${config.port}`);
});
