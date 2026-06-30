import express from "express";
import cors from "cors";
import routes from "./routes/index";
import cookieParser from "cookie-parser";
import { globalErrorHandler } from "./middlewares/error-handler.middleware";
import { PORT } from "./config/env";

const app = express();

app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json());

app.use(routes);

app.use(globalErrorHandler);

app.listen(PORT, (error) => {
  if (error) return console.log("Error in server running", error);
  console.log(`Server is running at http://localhost:${PORT}`);
});
