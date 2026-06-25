import express, { type Request, type Response } from "express";

const app = express();

app.get("/", (req: Request, res: Response) => {
  return res.send("ProjectHub Server is up & running.");
});

export default app;
