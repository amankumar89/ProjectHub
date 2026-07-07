import app from "./src";
import { PORT } from "./src/config/env";

app.listen(PORT, (error) => {
  if (error) return console.log("Error in server running", error);
  console.log(`Server is running at http://localhost:${PORT}`);
});
