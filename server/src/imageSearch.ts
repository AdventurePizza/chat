import express, { Request, Response } from "express";
const imageSearchRouter = express.Router();
const google = require("googlethis");

// request Images, This request on serverside because of CORS restriction in client side
imageSearchRouter.get("/:query", async (req, res) => {
  const { query } = req.params as { query: string };
  const options = {
    page: 0,
    safe: false, // show explicit results?
    additional_params: {
      hl: 'en'
    }
  }
  const images = await google.image(query,  options );
  res.status(200).send(images);
});

export default imageSearchRouter;
