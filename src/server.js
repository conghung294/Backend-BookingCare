import express from "express";
import bodyParser from "body-parser";
import viewEngine from "./config/viewEngine";
import initWebRoutes from "./route/web";
import connectDb from "./config/connectDb";
// import cors from "cors";
require("dotenv").config();
let app = express();

app.use(function (req, res, next) {
  // Website you wish to allow to connect
  res.setHeader("Access-Control-Allow-Origin", process.env.URL_REACT);

  // Request methods you wish to allow
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );

  // Request headers you wish to allow
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader("Access-Control-Allow-Credentials", true);

  // Pass to next layer of middleware
  next();
});
// app.use(cors({ origin: true, credentials: true }));

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));

viewEngine(app);
initWebRoutes(app);

connectDb();

let port = process.env.PORT || 8069;

app.listen(port, () => {
  console.log("Listening on port " + port);
});
