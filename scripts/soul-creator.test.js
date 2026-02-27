const { describe, it, beforeEach, afterEach } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const { generateTemplates, generateSoul, generateStyle, loadReferenceTemplate } = require("./template-generator");
const { parseArgs, buildPreferences } = require("./prompter");
const { validate } = require("./validator");
const { exportFiles } = require("./exporter");

const TEST_OUTPUT_DIR = path.join(__dirname, "..", ".test-output");

function cleanup() {
  if (fs.existsSync(TEST_OUTPUT_DIR)) {
    fs.rmSync(TEST_OUTPUT_DIR, { recursive: true });
  }
}

// --- template-generator tests ---

describe("template-generator", () => {
  it("generates SOUL.md for developer type", () => {
    const soul = generateSoul({ agentType: "developer", name: "TestBot", purpose: "Testing" });
    assert.ok(soul.includes("TestBot"));
    assert.ok(soul.includes("Testing"));
    assert.ok(soul.includes("## Identity"));
    assert.ok(soul.includes("## Purpose"));
  });

  it("generates SOUL.md for assistant type", () => {
    const soul = generateSoul({ agentType: "assistant", name: "Helper", purpose: "Helping users" });
    assert.ok(soul.includes("Helper"));
    assert.ok(soul.includes("Approachable"));
  });

  it("generates SOUL.md for automation type", () => {
    const soul = generateSoul({ agentType: "automation", name: "AutoBot", purpose: "Automation tasks" });
    assert.ok(soul.includes("AutoBot"));
    assert.ok(soul.includes("Systematic"));
  });

  it("throws on unknown agent type", () => {
    assert.throws(() => {
      generateSoul({ agentType: "unknown", name: "X", purpose: "Y" });
    }, /Unknown agent type/);
  });

  it("generates STYLE.md with correct tone sections", () => {
    const style = generateStyle({ agentType: "developer", name: "Dev", purpose: "Coding", tone: "professional" });
    assert.ok(style.includes("## Tone"));
    assert.ok(style.includes("## Voice"));
    assert.ok(style.includes("## Formatting"));
    assert.ok(style.includes("## Communication Patterns"));
  });

  it("throws on unknown tone", () => {
    assert.throws(() => {
      generateStyle({ agentType: "developer", name: "X", purpose: "Y", tone: "angry" });
    }, /Unknown tone/);
  });

  it("generates both templates via generateTemplates", () => {
    const result = generateTemplates({ agentType: "developer", name: "Bot", purpose: "Test", tone: "friendly" });
    assert.ok(result.soul);
    assert.ok(result.style);
    assert.ok(result.soul.includes("Bot"));
    assert.ok(result.style.includes("Bot"));
  });

  it("loads reference templates", () => {
    const template = loadReferenceTemplate("developer");
    assert.ok(template.includes("{{AGENT_NAME}}"));
    assert.ok(template.includes("{{PURPOSE}}"));
  });
});

// --- prompter tests ---

describe("prompter", () => {
  it("parses --type argument", () => {
    const args = parseArgs(["--type", "developer"]);
    assert.equal(args.type, "developer");
  });

  it("parses multiple arguments", () => {
    const args = parseArgs(["--type", "assistant", "--purpose", "Help users", "--tone", "friendly"]);
    assert.equal(args.type, "assistant");
    assert.equal(args.purpose, "Help users");
    assert.equal(args.tone, "friendly");
  });

  it("throws on invalid agent type", () => {
    assert.throws(() => {
      parseArgs(["--type", "invalid"]);
    }, /Invalid agent type/);
  });

  it("throws on invalid tone", () => {
    assert.throws(() => {
      parseArgs(["--tone", "angry"]);
    }, /Invalid tone/);
  });

  it("returns empty object for no args", () => {
    const args = parseArgs([]);
    assert.deepEqual(args, {});
  });

  it("builds preferences from args and defaults", () => {
    const defaults = { defaultAgentType: "developer", defaultTone: "professional", defaultOutputDir: "./output" };
    const prefs = buildPreferences({ type: "assistant", purpose: "Help" }, defaults);
    assert.equal(prefs.agentType, "assistant");
    assert.equal(prefs.purpose, "Help");
  });
});

// --- validator tests ---

describe("validator", () => {
  it("validates a correct SOUL.md", () => {
    const soul = generateSoul({ agentType: "developer", name: "TestBot", purpose: "Testing purposes" });
    const result = validate(soul, "soul");
    assert.ok(result.valid, `Validation failed: ${result.errors.join(", ")}`);
  });

  it("validates a correct STYLE.md", () => {
    const style = generateStyle({ agentType: "developer", name: "TestBot", purpose: "Testing", tone: "professional" });
    const result = validate(style, "style");
    assert.ok(result.valid, `Validation failed: ${result.errors.join(", ")}`);
  });

  it("fails on empty content", () => {
    const result = validate("", "soul");
    assert.ok(!result.valid);
    assert.ok(result.errors.some((e) => e.includes("too short")));
  });

  it("fails on missing sections", () => {
    const result = validate("## Identity\nSome content here that is long enough to pass the minimum length check for the validator to process properly.", "soul");
    assert.ok(!result.valid);
    assert.ok(result.errors.some((e) => e.includes("Missing required section")));
  });

  it("fails on unknown template type", () => {
    const result = validate("content", "unknown");
    assert.ok(!result.valid);
    assert.ok(result.errors.some((e) => e.includes("Unknown template type")));
  });

  it("reports found sections", () => {
    const soul = generateSoul({ agentType: "developer", name: "Bot", purpose: "Test" });
    const result = validate(soul, "soul");
    assert.ok(result.sections.length >= 5);
  });
});

// --- exporter tests ---

describe("exporter", () => {
  beforeEach(() => cleanup());
  afterEach(() => cleanup());

  it("creates output directory and writes files", () => {
    const templates = generateTemplates({ agentType: "developer", name: "Bot", purpose: "Test", tone: "professional" });
    const result = exportFiles(templates, TEST_OUTPUT_DIR);

    assert.equal(result.files.length, 2);
    assert.ok(fs.existsSync(path.join(TEST_OUTPUT_DIR, "SOUL.md")));
    assert.ok(fs.existsSync(path.join(TEST_OUTPUT_DIR, "STYLE.md")));
  });

  it("written SOUL.md contains expected content", () => {
    const templates = generateTemplates({ agentType: "assistant", name: "Helper", purpose: "Assistance", tone: "friendly" });
    exportFiles(templates, TEST_OUTPUT_DIR);

    const content = fs.readFileSync(path.join(TEST_OUTPUT_DIR, "SOUL.md"), "utf-8");
    assert.ok(content.includes("Helper"));
  });

  it("written STYLE.md contains expected content", () => {
    const templates = generateTemplates({ agentType: "automation", name: "AutoBot", purpose: "Automate", tone: "technical" });
    exportFiles(templates, TEST_OUTPUT_DIR);

    const content = fs.readFileSync(path.join(TEST_OUTPUT_DIR, "STYLE.md"), "utf-8");
    assert.ok(content.includes("AutoBot"));
    assert.ok(content.includes("## Tone"));
  });
});

// --- CLI integration test ---

describe("CLI integration", () => {
  beforeEach(() => cleanup());
  afterEach(() => cleanup());

  it("runs main.js end-to-end via CLI", () => {
    const mainPath = path.join(__dirname, "main.js");
    const output = execSync(
      `node "${mainPath}" --type developer --purpose "CLI test agent" --tone casual --output "${TEST_OUTPUT_DIR}"`,
      { encoding: "utf-8" }
    );

    assert.ok(output.includes("Done."));
    assert.ok(fs.existsSync(path.join(TEST_OUTPUT_DIR, "SOUL.md")));
    assert.ok(fs.existsSync(path.join(TEST_OUTPUT_DIR, "STYLE.md")));
  });

  it("exits with error on invalid type via CLI", () => {
    const mainPath = path.join(__dirname, "main.js");
    assert.throws(() => {
      execSync(`node "${mainPath}" --type badtype`, { encoding: "utf-8" });
    });
  });
});
