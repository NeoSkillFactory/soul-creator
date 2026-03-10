# soul-creator

![Audit](https://img.shields.io/badge/audit%3A%20PASS-brightgreen) ![License](https://img.shields.io/badge/license-MIT-blue) ![OpenClaw](https://img.shields.io/badge/OpenClaw-skill-orange)

> Automatically generates SOUL.md and STYLE.md templates based on agent purpose to eliminate manual setup work.

## Features

- Generate customized SOUL.md templates based on agent purpose and personality
- Create STYLE.md files with appropriate writing tones and voice guidelines
- Validate generated templates against OpenClaw standards
- Export templates directly to workspace
- Support multiple agent types (developer, assistant, automation)
- Four tone profiles (professional, friendly, technical, casual)
- Zero external dependencies

## Usage

```bash
# With defaults (developer type, professional tone)
node scripts/main.js --purpose "A coding assistant that helps with Python"

# Specify type, tone, and output directory
node scripts/main.js --type assistant --purpose "Customer support bot" --tone friendly --output ./my-agent

# Automation agent
node scripts/main.js --type automation --purpose "CI/CD pipeline manager" --tone technical --output ./deployer
```

## GitHub

Source code: [github.com/NeoSkillFactory/soul-creator](https://github.com/NeoSkillFactory/soul-creator)

## License

MIT © NeoSkillFactory