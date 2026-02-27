const fs = require("fs");
const path = require("path");

const styleExamples = require("../references/style-examples.json");

const REFERENCES_DIR = path.join(__dirname, "..", "references");

function loadReferenceTemplate(agentType) {
  const templateMap = {
    developer: "developer-template.md",
    assistant: "assistant-template.md",
    automation: "automation-template.md",
  };

  const filename = templateMap[agentType];
  if (!filename) {
    throw new Error(
      `Unknown agent type: "${agentType}". Supported: ${Object.keys(templateMap).join(", ")}`
    );
  }

  const templatePath = path.join(REFERENCES_DIR, filename);
  return fs.readFileSync(templatePath, "utf-8");
}

function fillTemplate(template, preferences) {
  return template
    .replace(/\{\{AGENT_NAME\}\}/g, preferences.name)
    .replace(/\{\{PURPOSE\}\}/g, preferences.purpose);
}

function generateSoul(preferences) {
  const template = loadReferenceTemplate(preferences.agentType);
  return fillTemplate(template, preferences);
}

function generateStyle(preferences) {
  const toneData = styleExamples[preferences.tone];
  if (!toneData) {
    throw new Error(
      `Unknown tone: "${preferences.tone}". Supported: ${Object.keys(styleExamples).join(", ")}`
    );
  }

  const lines = [];
  lines.push(`# ${preferences.name} — Style Guide\n`);

  lines.push(`## Tone`);
  lines.push(`${toneData.tone}\n`);

  lines.push(`## Voice`);
  lines.push(`${toneData.voice}\n`);

  lines.push(`## Formatting`);
  lines.push(`| Element | Guideline |`);
  lines.push(`|---------|-----------|`);
  for (const [key, value] of Object.entries(toneData.formatting)) {
    const label = key.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase());
    lines.push(`| ${label} | ${value} |`);
  }
  lines.push("");

  lines.push(`## Communication Patterns`);
  toneData.communicationPatterns.forEach((p) => {
    lines.push(`- ${p}`);
  });
  lines.push("");

  lines.push(`## Example Response`);
  lines.push(`> ${toneData.exampleResponse}\n`);

  lines.push(`## Agent Context`);
  lines.push(`- **Agent Type**: ${preferences.agentType}`);
  lines.push(`- **Primary Purpose**: ${preferences.purpose}`);
  lines.push(
    `- **Style Profile**: ${preferences.tone.charAt(0).toUpperCase() + preferences.tone.slice(1)}`
  );
  lines.push("");

  return lines.join("\n");
}

function generateTemplates(preferences) {
  return {
    soul: generateSoul(preferences),
    style: generateStyle(preferences),
  };
}

module.exports = { generateTemplates, generateSoul, generateStyle, loadReferenceTemplate };
