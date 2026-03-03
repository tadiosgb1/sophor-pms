const express = require("express");
const router = express.Router();
const controller = require("../controllers/SiteImageController");

const upload = require("../middleware/uploadMiddleware");
const uploadFields = upload.fields([{ name: "image_url", maxCount: 1 }]);


router.get("/", controller.getAll);
router.get("/:id", controller.getOne);
router.get("/by-site/:site_id", controller.getBySiteId);
router.post("/", uploadFields, controller.create);
router.put("/:id", uploadFields, controller.update);
router.delete("/:id", controller.delete);

module.exports = router;
