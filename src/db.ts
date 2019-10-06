import { connect, connection } from "mongoose";
import config from "config";
connect(
  config.get("MONGO_URL"),
  { useUnifiedTopology: true }
);

connection.on("connected", function() {
  console.log("Mongo Connected");
});

connection.on("disconnected", function() {
  console.log("Mongo Disonnected");
});

connection.on("error", function() {
  console.log("Mongo Error");
});
