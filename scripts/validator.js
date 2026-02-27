const validationSchema = require("../assets/validation.json");

function validate(content, type) {
  const errors = [];
  const schema = validationSchema[type];

  if (!schema) {
    return { valid: false, errors: [`Unknown template type: "${type}"`] };
  }

  if (content.length < schema.minLength) {
    errors.push(
      `Content too short: ${content.length} chars (minimum: ${schema.minLength})`
    );
  }

  if (content.length > schema.maxLength) {
    errors.push(
      `Content too long: ${content.length} chars (maximum: ${schema.maxLength})`
    );
  }

  const headingPattern = /^## (.+)$/gm;
  const foundSections = [];
  let match;
  while ((match = headingPattern.exec(content)) !== null) {
    foundSections.push(match[1].trim());
  }

  for (const required of schema.requiredSections) {
    const found = foundSections.some(
      (s) => s.toLowerCase() === required.toLowerCase()
    );
    if (!found) {
      errors.push(`Missing required section: "${required}"`);
    }
  }

  if (foundSections.length < schema.minSections) {
    errors.push(
      `Too few sections: ${foundSections.length} (minimum: ${schema.minSections})`
    );
  }

  return {
    valid: errors.length === 0,
    errors,
    sections: foundSections,
    length: content.length,
  };
}

module.exports = { validate };
