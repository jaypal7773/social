const express = require("express");
const router = express.Router();
// const auth = require('../middlewares/auth');
const { auth } = require("../middlewares/auth");

const ctrl = require("../controllers/commentController");

router.get("/post/:postId", ctrl.getCommentsForPost);
router.post("/", auth, ctrl.addComment);
router.put("/:id", auth, ctrl.updateComment);
router.delete("/:id", auth, ctrl.deleteComment);

module.exports = router;
