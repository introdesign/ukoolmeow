const express = require("express");
const { verifyGoogle } = require("../controllers/authController");

const router = express.Router();

router.post("/google", verifyGoogle);

module.exports = router;
