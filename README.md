# soul-creator

![Audit](https://img.shields.io/badge/audit%3A%20PASS-brightgreen) ![License](https://img.shields.io/badge/license-MIT-blue) ![OpenClaw](https://img.shields.io/badge/OpenClaw-skill-orange)

> Automatically generates SOUL.md and STYLE.md templates based on agent purpose to eliminate manual setup work.

## Features

- Generate customized SOUL.md templates based on agent purpose and personality
- Create STYLE.md files with appropriate writing tones and voice guidelines
- Provide interactive prompts to refine agent identity and style preferences
- Validate generated templates against OpenClaw standards
- Export templates directly to workspace
- Support multiple agent types (developer, assistant, automation)
- Include examples and best practices for each agent type

## Usage

```bash
# Interactive mode
node scripts/main.js

# Direct mode
node scripts/main.js --type developer --purpose "A coding assistant that helps with Python"

# With output directory
node scripts/main.js --type assistant --purpose "Customer support bot" --output ./my-agent
```

## GitHub

Source code: [github.com/NeoSkillFactory/soul-creator](https://github.com/NeoSkillFactory/soul-creator)

**Price suggestion:** $18 USD

## License

MIT © NeoSkillFactory
