import express from "express";
import cors from "cors";
import dotenv from 'dotenv'
import errorMiddleware from "./middlewares/error.js";
import ruleRoutes from "./routes/ruleRoutes.js";

dotenv.config();

const app = express();

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/rules", ruleRoutes);

app.use(errorMiddleware);

export default app;
