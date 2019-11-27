import express from "express";

import { UserProfileModel } from "../../../models/account";
import { check } from "express-validator";

const user = express.Router();

user.put(
  "/user/:id",
  [
    check("gender")
      .not()
      .isEmpty()
  ],
  async (req: express.Request, res: express.Response) => {
    const user = new UserProfileModel();
    user.gender = req.body.gender;

    try {
      await user.collection.findOneAndUpdate({ _id: req.params.id }, req.body);
      res.json({ message: "update succesful" });
    } catch (error) {
      res.status(400).json(error);
    }
  }
);
user.get(
  "/user/",

  async (req: express.Request, res: express.Response) => {
    res.json({ message: "Hello" });
  }
);

export default user;
