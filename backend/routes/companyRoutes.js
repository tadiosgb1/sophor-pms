const express = require("express");
const router = express.Router();
const controller = require("../controllers/CompanyController");

const upload = require("../middleware/uploadMiddleware");
const uploadFields = upload.fields([{ name: "logo", maxCount: 1 }]);


router.get("/", controller.getAll);
router.get("/:id", controller.getOne);
router.get("/owner/:owner_id", controller.getByOwner);
router.post("/", uploadFields, controller.create);
router.put("/:id", uploadFields, controller.update);
router.delete("/:id", controller.delete);

module.exports = router;
