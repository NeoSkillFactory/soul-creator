const fs = require("fs");
const path = require("path");

function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function exportFiles(templates, outputDir) {
  const resolvedDir = path.resolve(outputDir);
  ensureDir(resolvedDir);

  const soulPath = path.join(resolvedDir, "SOUL.md");
  const stylePath = path.join(resolvedDir, "STYLE.md");

  fs.writeFileSync(soulPath, templates.soul, "utf-8");
  fs.writeFileSync(stylePath, templates.style, "utf-8");

  return {
    files: [soulPath, stylePath],
    outputDir: resolvedDir,
  };
}

module.exports = { exportFiles };
