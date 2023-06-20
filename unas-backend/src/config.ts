import dotenv from "dotenv";
dotenv.config();

const config = {
	port: parseInt(process.env.PORT ?? "3000"),
	corsOrigin: process.env.CORS_ORIGIN ?? "*",
	jwt: {
		secretKey: process.env.JWT_SECRET ?? "hello secret",
		audience: process.env.JWT_AUDIENCE ?? "UNAS",
		issuer: process.env.JWT_ISSUER ?? "UNAS",
		expiresIn: process.env.JWT_EXPIRES_IN ?? "1h",
	},
};

export default config;
