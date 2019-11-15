import express from "express";
import auth_facebook from "./auth_facebook";
import auth from "./auth";
import login from "./oauth";

var router = express.Router();

router.use("/auth/facebook", auth_facebook);
router.use("/auth", auth);
router.use("/", login);

export default router;
