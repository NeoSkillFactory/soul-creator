#!/usr/bin/env node

const path = require("path");
const { generateTemplates } = require("./template-generator");
const { parseArgs } = require("./prompter");
const { validate } = require("./validator");
const { exportFiles } = require("./exporter");

const defaultConfig = require("../assets/default-config.json");

async function main() {
  const args = parseArgs(process.argv.slice(2));

  const agentType = args.type || defaultConfig.defaultAgentType;
  const purpose = args.purpose || `A ${agentType} agent`;
  const name = args.name || deriveAgentName(purpose);
  const tone = args.tone || defaultConfig.defaultTone;
  const outputDir = args.output || defaultConfig.defaultOutputDir;

  const preferences = { agentType, purpose, name, tone };

  console.log(`\n--- soul-creator ---`);
  console.log(`Agent Name:  ${preferences.name}`);
  console.log(`Agent Type:  ${preferences.agentType}`);
  console.log(`Purpose:     ${preferences.purpose}`);
  console.log(`Tone:        ${preferences.tone}`);
  console.log(`Output:      ${path.resolve(outputDir)}`);
  console.log(`-------------------\n`);

  console.log("Generating templates...");
  const templates = generateTemplates(preferences);

  console.log("Validating templates...");
  const soulValidation = validate(templates.soul, "soul");
  const styleValidation = validate(templates.style, "style");

  if (!soulValidation.valid) {
    console.error("SOUL.md validation failed:");
    soulValidation.errors.forEach((e) => console.error(`  - ${e}`));
    process.exit(1);
  }

  if (!styleValidation.valid) {
    console.error("STYLE.md validation failed:");
    styleValidation.errors.forEach((e) => console.error(`  - ${e}`));
    process.exit(1);
  }

  console.log("Validation passed.");

  console.log("Exporting files...");
  const result = exportFiles(templates, outputDir);

  console.log(`\nFiles generated successfully:`);
  result.files.forEach((f) => console.log(`  - ${f}`));
  console.log(`\nDone.`);
}

function deriveAgentName(purpose) {
  if (!purpose || typeof purpose !== "string") return "Agent";

  const words = purpose
    .replace(/[^a-zA-Z0-9\s]/g, "")
    .split(/\s+/)
    .filter((w) => w.length > 2)
    .slice(0, 3);

  if (words.length === 0) return "Agent";

  return words
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join("");
}

main().catch((err) => {
  console.error("Error:", err.message);
  process.exit(1);
});
