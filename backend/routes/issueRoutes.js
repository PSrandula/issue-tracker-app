const express = require("express");
const {
  createIssue,
  getIssues,
  getIssue,
  updateIssue,
  deleteIssue,
  exportIssues,
} = require("../controllers/issueController");
const protect = require("../middlewares/authMiddleware");
const router = express.Router();

router.use(protect);

router.post("/", createIssue);
router.get("/export", exportIssues);
router.get("/", getIssues);
router.get("/:id", getIssue);
router.patch("/:id", updateIssue);
router.delete("/:id", deleteIssue);

module.exports = router;
