const express = require("express");
const router = express.Router();
const faqController = require("../controllers/faqController");
const multer = require("multer");

const upload = multer({ storage: multer.memoryStorage() });

router.post("/add", faqController.addFAQ);
router.get("/all", faqController.getFAQs);
router.post("/upload-pdf", upload.single("file"), faqController.uploadPDF);

module.exports = router;
