// 🔐 server/secure-run.js
require("dotenv").config();
const express = require("express");
const router = express.Router();
const { exec } = require("child_process");

const allowedScripts = ["mintKitCoin.js", "mintLuckyCoin.js", "deployDAO.js", "triggerFreeze.js"];

router.post("/secure-run", (req, res) => {
  const { token, file } = req.body;

  if (token !== process.env.SCRIPT_RUNNER_TOKEN) {
    return res.status(401).json({ message: "❌ Invalid token" });
  }

  if (!allowedScripts.includes(file)) {
    return res.status(403).json({ message: "❌ Script not allowed" });
  }

  exec(`node ./scripts/${file}`, (error, stdout, stderr) => {
    if (error) {
      return res.status(500).json({ message: `❌ Script error: ${stderr}` });
    }
    return res.json({ message: `✅ ${file} executed:\n${stdout}` });
  });
});

module.exports = router;
