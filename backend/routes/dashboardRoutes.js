const express = require("express");
const router  = express.Router();
const controller = require("../controllers/DashboardController");

router.get("/admin",          controller.getAdminStats);
router.get("/tenant/:userId", controller.getTenantStats);

module.exports = router;
