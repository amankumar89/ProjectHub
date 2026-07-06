import express from "express";
import cors from "cors";
import routes from "./routes/index";
import cookieParser from "cookie-parser";
import { globalErrorHandler } from "./middlewares/error-handler.middleware";
import { FRONTEND_URL, PORT } from "./config/env";

const app = express();

app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
  }),
);
app.use(cookieParser());
app.use(express.json());

app.use(routes);

app.use(globalErrorHandler);

app.listen(PORT, (error) => {
  if (error) return console.log("Error in server running", error);
  console.log(`Server is running at http://localhost:${PORT}`);
});
