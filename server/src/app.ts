import express from "express";
import cors from "cors";
import routes from "./routes/index";
import { globalErrorHandler } from "./middlewares/error-handler.middleware";

const app = express();

app.use(cors());
app.use(express.json());

app.use(routes);

app.use(globalErrorHandler);

export default app;
