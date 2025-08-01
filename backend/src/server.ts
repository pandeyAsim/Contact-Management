import "dotenv/config";
import express, { Request, Response } from "express";
const app = express();
import { connectDb } from "./config/db.config";
import env from "./config/env.config";
import ApiRoutes from "./routes";
import { ApiError } from "./utils";
import { errorHandler } from "./middlewares";
import cors from "cors";
import path from "path";

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.use(express.json({}));

app.use("/api", ApiRoutes);

app.use((req: Request, res: Response) => {
  throw new ApiError({
    status: 404,
    message: "Route not found",
  });
});

//handle all errors
app.use(errorHandler);

app.listen(env.APP_PORT, async () => {
  console.log(`Server is running on http://localhost:${env.APP_PORT}`);
  // connectDb().then(() => {}).catch((error) => {});
  try {
    await connectDb();
  } catch (error) {
    process.exit(1);
  }
});
