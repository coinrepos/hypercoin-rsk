const express = require("express");
const cors = require("cors");
const path = require("path");
const { exec } = require("child_process");

const app = express();
const PORT = process.env.PORT || 5001;

// 🔐 Your secret token (store in .env in production)
const API_TOKEN = process.env.SCRIPT_RUNNER_TOKEN || "HYPERCORE2025";

// 🎯 Allowed scripts list
const ALLOWED_SCRIPTS = [
  "mintKitCoin.js",
  "mintLuckyCoin.js",
  "deployMint.js"
];

app.use(cors());
app.use(express.json());

// 🔐 Secure API Runner
app.get("/api/run-secure-script", (req, res) => {
  const token = req.query.token;
  const scriptName = req.query.file;

  if (token !== API_TOKEN) {
    return res.status(401).send("⛔ Unauthorized: Invalid token");
  }

  if (!scriptName || !ALLOWED_SCRIPTS.includes(scriptName)) {
    return res.status(400).send("🚫 Invalid or disallowed script.");
  }

  const safePath = path.resolve(__dirname, "scripts", scriptName);

  exec(`node ${safePath}`, (err, stdout, stderr) => {
    if (err) {
      console.error("❌ Script error:", stderr);
      return res.status(500).send(`❌ Execution error:\n${stderr}`);
    }
    res.send(`✅ Script executed:\n${stdout}`);
  });
});

app.get("/ping", (req, res) => {
  res.send("🔐 HyperBot SecureAPI Live");
});

app.listen(PORT, () => {
  console.log(`🛡 SecureAPI running at http://localhost:${PORT}`);
});
