require("dotenv").config();
const express = require("express");
const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");

const router = express.Router();

// ⚙️ Validate and execute script securely
router.post("/run-script", (req, res) => {
  const { file, token } = req.body;

  // 🔐 Verify access token
  if (token !== process.env.SCRIPT_RUNNER_TOKEN) {
    return res.status(403).json({ error: "Unauthorized: Invalid token" });
  }

  // 🧼 Sanitize file path
  const allowedScriptsDir = path.join(__dirname, "../scripts");
  const fullPath = path.resolve(allowedScriptsDir, file);

  if (!fullPath.startsWith(allowedScriptsDir)) {
    return res.status(400).json({ error: "Invalid script path" });
  }

  // ✅ Check file exists
  if (!fs.existsSync(fullPath)) {
    return res.status(404).json({ error: "Script not found" });
  }

  // 🚀 Execute the script
  exec(`node ${fullPath}`, (error, stdout, stderr) => {
    if (error) {
      return res.status(500).json({ error: `Execution failed: ${stderr}` });
    }
    return res.json({ success: true, output: stdout });
  });
});

module.exports = router;
