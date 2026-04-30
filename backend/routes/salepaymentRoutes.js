const express = require("express");
const router  = express.Router();
const controller = require("../controllers/SalePaymentController");
const upload  = require("../middleware/uploadMiddleware");

// Screenshot upload field
const uploadFields = upload.fields([{ name: "screenshot_url", maxCount: 1 }]);

router.get("/",                          controller.getAll);
router.get("/by-sale/:sale_id",          controller.getBySaleId);
router.get("/:id",                       controller.getOne);
router.post("/",        uploadFields,    controller.create);
router.put("/:id",      uploadFields,    controller.update);
router.patch("/:id/verify",              controller.verify);
router.patch("/:id/reject",              controller.reject);
router.delete("/:id",                    controller.delete);

module.exports = router;
