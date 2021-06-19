import path from "path";

require("dotenv").config({
  path: path.resolve(__dirname, "..", ".env"),
});

import { Router } from "./router";

const router = new Router();
