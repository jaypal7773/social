const express = require('express');
const router = express.Router();
const { auth } = require ("../middlewares/auth.js");
const requestController = require('../controllers/requestController.js');

console.log("Hii")

router.post("/send", auth, requestController.sendRequest);

module.exports = router;




































// const express = require("express");
// const router = express.Router();
// const {auth} = require("../middlewares/auth");
// const requestController = require("../controllers/requestController");

// console.log("requestController:", requestController); // Check what's being imported

// router.post("/send", auth, (req, res, next) => {
//   console.log("Route hit!"); // Verify route is reached
//   next();
// }, requestController.sendRequest);

// module.exports = router;