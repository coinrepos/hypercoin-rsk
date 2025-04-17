const express = require("express");
const router = express.Router();
const { exec } = require("child_process");
const path = require("path");

router.get("/", (req, res) => {
  const scriptName = req.query.file;

  if (!scriptName) {
    return res.status(400).send("❌ No script specified.");
  }

  // 🚨 Prevent directory traversal
  const safePath = path.resolve(__dirname, "../scripts", path.basename(scriptName));

  exec(`node ${safePath}`, (err, stdout, stderr) => {
    if (err) {
      console.error("Script error:", stderr);
      return res.status(500).send(`❌ Execution error:\n${stderr}`);
    }
    res.send(`✅ Script executed successfully:\n${stdout}`);
  });
});

module.exports = router;
