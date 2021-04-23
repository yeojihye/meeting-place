"use strict";

const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const morgan = require("morgan");

const app = express();
dotenv.config();

// 라우팅
const home = require("./src/routes/home");

// 앱세팅
app.set("views", "./src/views");
app.set("view engine", "ejs");
app.use(express.static(`${__dirname}/src/public`));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan("tiny"));

app.use("/", home); // use -> 미들웨어를 등록해주는 메서드.

module.exports = app;