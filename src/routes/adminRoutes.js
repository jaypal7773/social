const router = require("express").Router();
const { getUsers, deleteUser } = require("../controllers/adminController");
const { auth } = require("../middlewares/auth");        

router.get("/users", auth(["ADMIN"]), getUsers);
router.delete("/users/:id", auth(["ADMIN"]), deleteUser);

module.exports = router;
