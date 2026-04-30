const express    = require("express");
const router     = express.Router();
const controller = require("../controllers/RentPaymentController");
const upload     = require("../middleware/uploadMiddleware");

const uploadFields = upload.fields([{ name: "screenshot_url", maxCount: 1 }]);

router.get("/preview-cycles",          controller.previewCycles);   // must be before /:id
router.get("/",                        controller.getAll);
router.get("/by-rent/:rent_id",        controller.getByRentId);
router.get("/:id",                     controller.getOne);
router.post("/",        uploadFields,  controller.create);
router.put("/:id",      uploadFields,  controller.update);
router.patch("/:id/verify",            controller.verify);
router.patch("/:id/reject",            controller.reject);
router.delete("/:id",                  controller.delete);

module.exports = router;
