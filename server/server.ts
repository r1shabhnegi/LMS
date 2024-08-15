import { app } from "./app";
require("dotenv").config();
import connectDb from "./utils/db";
// create server

app.listen(process.env.PORT, () => {
  console.log(`Server is connected with port ${process.env.PORT}`);
  connectDb();
});
