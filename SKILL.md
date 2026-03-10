---
name: soul-creator
description: Automatically generates SOUL.md and STYLE.md templates based on agent purpose to eliminate manual setup work.
version: 1.0.0
author: OpenClaw
---

## Purpose

soul-creator automates the creation of SOUL.md and STYLE.md files for OpenClaw agents. Instead of spending 30-60 minutes manually crafting agent identity and style guidelines, developers can generate production-ready templates in seconds by specifying an agent type and purpose.

## Core Capabilities

- Generate customized SOUL.md templates based on agent purpose and personality
- Create STYLE.md files with appropriate writing tones and voice guidelines
- Validate generated templates against OpenClaw standards
- Export templates directly to workspace
- Support multiple agent types (developer, assistant, automation)
- Four tone profiles (professional, friendly, technical, casual)
- Zero external dependencies

## Triggers

- "Create a SOUL.md template for my new agent"
- "Generate a STYLE.md file for a developer assistant agent"
- "I need to set up an agent persona quickly"
- "Automate the creation of agent identity files"
- "Help me create an automation agent with the right personality"
- "Generate template files for a new AI assistant"
- "I want to skip the manual agent setup process"

## Outputs

- **SOUL.md**: A complete agent identity file containing name, purpose, personality traits, core values, behavioral guidelines, and interaction patterns.
- **STYLE.md**: A writing style guide containing tone, voice, formatting preferences, communication patterns, and example responses.

Both files are generated as Markdown and written directly to the specified output directory.

## Usage

```bash
# With defaults (developer type, professional tone)
node scripts/main.js --purpose "A coding assistant that helps with Python"

# Specify type, tone, and output directory
node scripts/main.js --type assistant --purpose "Customer support bot" --tone friendly --output ./my-agent

# Automation agent
node scripts/main.js --type automation --purpose "CI/CD pipeline manager" --tone technical --output ./deployer
```
