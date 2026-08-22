const fs = require('fs');

function parseDataArray(content, declaration) {
  const match = content.match(
    new RegExp(`export const ${declaration}[^=]*=\\s*(\\[[\\s\\S]*?\\])\\s*;`, 'm')
  );

  if (!match) {
    console.log('No match found');
    return null;
  }

  console.log('Raw matched content:\n---');
  console.log(match[1].substring(0, 500));
  console.log('---\n');

  try {
    const result = JSON.parse(match[1]);
    console.log('Parsed successfully, items:', result.length);
    return result;
  } catch (e) {
    console.log('Parse error:', e.message);
    console.log('\nTrying to identify the issue...');

    // Show the problematic part
    const lines = match[1].split('\n');
    console.log('First few lines:');
    lines.slice(0, 5).forEach((line, i) => {
      console.log(`Line ${i}: "${line}"`);
    });

    return null;
  }
}

const content = fs.readFileSync('src/data/index.ts', 'utf-8');
console.log('Testing content-repository parseDataArray...\n');
const result = parseDataArray(content, 'projectsData');
