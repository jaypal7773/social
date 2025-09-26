// routes/requestRoutes.js
const express = require("express");
const router = express.Router();
const {auth} = require("../middlewares/auth");
const requestController = require("../controllers/requestController");

router.post("/send", auth, requestController.sendRequest);

module.exports = router;
