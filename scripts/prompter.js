const validationSchema = require("../assets/validation.json");

function parseArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg.startsWith("--")) {
      const key = arg.slice(2);
      const next = argv[i + 1];
      if (next && !next.startsWith("--")) {
        args[key] = next;
        i++;
      } else {
        args[key] = true;
      }
    }
  }

  if (args.type && !validationSchema.agentTypes.includes(args.type)) {
    throw new Error(
      `Invalid agent type: "${args.type}". Valid types: ${validationSchema.agentTypes.join(", ")}`
    );
  }

  if (args.tone && !validationSchema.tones.includes(args.tone)) {
    throw new Error(
      `Invalid tone: "${args.tone}". Valid tones: ${validationSchema.tones.join(", ")}`
    );
  }

  return args;
}

function buildPreferences(args, defaults) {
  return {
    agentType: args.type || defaults.defaultAgentType,
    purpose: args.purpose || `A ${args.type || defaults.defaultAgentType} agent`,
    name: args.name || null,
    tone: args.tone || defaults.defaultTone,
    outputDir: args.output || defaults.defaultOutputDir,
  };
}

module.exports = { parseArgs, buildPreferences };
