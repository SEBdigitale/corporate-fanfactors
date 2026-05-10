/**
 * Form-control tags that need an accessible name.
 */
export const ACCESSIBLE_FORM_CONTROL_PATTERN = /<(input|select|textarea)\b([^>]*)>/gi;

/**
 * Validates baseline accessibility contracts for a static HTML page.
 */
export function validateAccessibilityContract(file, html) {
  const failures = [];

  if (!html.includes('<main id="main"')) {
    failures.push(`${file}: page must include <main id="main"> for skip-link support`);
  }

  const h1Count = (html.match(/<h1\b/gi) || []).length;
  if (h1Count !== 1) {
    failures.push(`${file}: expected exactly one h1, found ${h1Count}`);
  }

  for (const imageTag of html.matchAll(/<img\b[^>]*>/gi)) {
    if (!/\salt="[^"]+"/i.test(imageTag[0])) {
      failures.push(`${file}: image is missing non-empty alt text: ${imageTag[0]}`);
    }
  }

  for (const buttonTag of html.matchAll(/<button\b[^>]*>([\s\S]*?)<\/button>/gi)) {
    const attributes = buttonTag[0].split('>')[0];
    const text = stripTags(buttonTag[1]).trim();
    if (!text && !/\saria-label="[^"]+"/i.test(attributes)) {
      failures.push(`${file}: button needs visible text or aria-label`);
    }
  }

  for (const control of html.matchAll(ACCESSIBLE_FORM_CONTROL_PATTERN)) {
    const attributes = control[2];
    if (/\stype="hidden"/i.test(attributes)) continue;

    const hasAccessibleName = /\s(aria-label|title|placeholder|name)="[^"]+"/i.test(attributes) || isInsideLabel(html, control.index);
    if (!hasAccessibleName) {
      failures.push(`${file}: ${control[1]} control needs an accessible name, placeholder, or title`);
    }
  }

  return failures;
}

function stripTags(value) {
  return value.replace(/<[^>]+>/g, '');
}

function isInsideLabel(html, index) {
  const beforeControl = html.slice(0, index);
  return beforeControl.lastIndexOf('<label') > beforeControl.lastIndexOf('</label>');
}
