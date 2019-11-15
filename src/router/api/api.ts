import express from "express";
import user from "./logic/user";
const api = express.Router();
api.use("/", user);

export default api;
