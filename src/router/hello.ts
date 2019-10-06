import express from "express";
var hello = express.Router();

hello.get("/hello", (req, res) => {
  res.send("Hello World");
});

export = hello;
