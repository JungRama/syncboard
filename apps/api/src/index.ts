import express from "express";
import { json } from "body-parser";

const app = express();
app.use(json());

const port = 8000;
app.listen(port, () => {
  console.log(`server listen in port ${port}`);
});
