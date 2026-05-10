/**
 * Validates the static Indy admin prototype contract.
 */
export function validateIndyAdminContract(config, html, script) {
  const failures = [];

  if (!html.includes(`<script src="${config.script}" defer></script>`)) {
    failures.push(`${config.page}: missing Indy admin script include`);
  }

  if (!script.includes(`'${config.storageKey}'`) && !script.includes(`"${config.storageKey}"`)) {
    failures.push(`${config.script}: missing expected localStorage key ${config.storageKey}`);
  }

  if (!script.includes(config.seedSource)) {
    failures.push(`${config.script}: missing expected seed source ${config.seedSource}`);
  }

  for (const control of config.requiredControls || []) {
    if (!html.includes(control)) {
      failures.push(`${config.page}: missing required Indy control ${control}`);
    }
  }

  for (const field of config.requiredFields || []) {
    const inputPattern = new RegExp(`\\bname=["']${escapeRegExp(field)}["']`, 'i');
    if (!inputPattern.test(html)) {
      failures.push(`${config.page}: missing required Indy field ${field}`);
    }
  }

  return failures;
}

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
