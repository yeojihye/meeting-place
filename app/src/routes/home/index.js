"use strict";

const express = require("express");
const router = express.Router();
const ctrl = require("./home.ctrl");

router.get("/", ctrl.output.home);
router.get("/login", ctrl.output.login);
router.get("/logout", ctrl.output.logout);
router.get("/register", ctrl.output.register);
router.get("/midpoint", ctrl.output.midpoint);

router.post("/login", ctrl.process.login);
router.post("/register", ctrl.process.register);
router.post("/midpoint", ctrl.process.confirm);
router.put("/midpoint", ctrl.process.getdb);

module.exports = router;