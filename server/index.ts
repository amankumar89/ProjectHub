import app from "./src/app";
import { error } from "node:console";
import { PORT } from "./src/config/env";

app.listen(PORT, (error) => {
  if (error) return console.log("Error in server running", error);
  console.log(`Server is running at http://localhost:${PORT}`);
});
