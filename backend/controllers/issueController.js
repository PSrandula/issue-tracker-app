const Issue = require("../models/Issue");

// Helper to escape CSV values
const escapeCsv = (val) => {
  if (val === undefined || val === null) return "";
  const s = String(val);
  if (s.includes(",") || s.includes('"') || s.includes("\n")) {
    return '"' + s.replace(/"/g, '""') + '"';
  }
  return s;
};

exports.createIssue = async (req, res) => {
  try {
    const { title } = req.body;
    if (!title || !String(title).trim()) {
      return res.status(400).json({ message: "Title is required" });
    }
    const issue = await Issue.create(req.body);
    res.status(201).json(issue);
  } catch (err) {
    console.error("createIssue error:", err);
    res.status(500).json({ message: "Failed to create issue" });
  }
};

exports.getIssues = async (req, res) => {
  try {
    const { search = "", page = 1, limit = 6, status, priority } = req.query;
    const perPage = Number(limit);
    const currentPage = Number(page);

    // Build filter query
    const query = {};
    if (search) query.title = { $regex: search, $options: "i" };
    if (status) query.status = status;
    if (priority) query.priority = priority;

    const [issues, total, statusCounts] = await Promise.all([
      Issue.find(query)
        .skip((currentPage - 1) * perPage)
        .limit(perPage)
        .sort({ createdAt: -1 }),
      Issue.countDocuments(query),
      Issue.aggregate([
        { $group: { _id: "$status", count: { $sum: 1 } } },
      ]),
    ]);

    // Convert aggregate result to { Open: n, "In Progress": n, ... }
    const counts = { Open: 0, "In Progress": 0, Resolved: 0, Closed: 0 };
    statusCounts.forEach((s) => {
      if (s._id in counts) counts[s._id] = s.count;
    });

    res.json({
      issues,
      totalPages: Math.max(1, Math.ceil(total / perPage)),
      statusCounts: counts,
    });
  } catch (err) {
    console.error("getIssues error:", err);
    res.status(500).json({ message: "Failed to fetch issues" });
  }
};

exports.getIssue = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id);
    if (!issue) return res.status(404).json({ message: "Not found" });
    res.json(issue);
  } catch (err) {
    console.error("getIssue error:", err);
    res.status(500).json({ message: "Failed to fetch issue" });
  }
};

exports.updateIssue = async (req, res) => {
  try {
    const issue = await Issue.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!issue) return res.status(404).json({ message: "Not found" });
    res.json(issue);
  } catch (err) {
    console.error("updateIssue error:", err);
    res.status(500).json({ message: "Failed to update issue" });
  }
};

exports.deleteIssue = async (req, res) => {
  try {
    await Issue.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    console.error("deleteIssue error:", err);
    res.status(500).json({ message: "Failed to delete issue" });
  }
};

// Export all issues as CSV (protected route)
exports.exportIssues = async (req, res) => {
  try {
    const all = await Issue.find({}).sort({ createdAt: -1 });
    const headers = ["_id", "title", "description", "status", "priority", "severity", "createdAt"];
    const rows = all.map((it) => headers.map((h) => escapeCsv(it[h])).join(","));
    const csv = headers.join(",") + "\n" + rows.join("\n");
    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=issues_export.csv");
    res.send(csv);
  } catch (err) {
    console.error("exportIssues error:", err);
    res.status(500).json({ message: "Failed to export issues" });
  }
};
