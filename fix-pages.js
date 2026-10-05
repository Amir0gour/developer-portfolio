const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else if (file.endsWith('page.tsx')) {
      results.push(file);
    }
  });
  return results;
}

const files = walk('src/app/admin');
files.forEach((file) => {
  let content = fs.readFileSync(file, 'utf8');
  if (!content.includes('force-dynamic')) {
    // Put it after 'use client'; if it exists
    if (content.startsWith("'use client';") || content.startsWith('"use client";')) {
      content = content.replace(/['"]use client['"];\s*/, "'use client';\nexport const dynamic = 'force-dynamic';\n");
    } else {
      content = "export const dynamic = 'force-dynamic';\n" + content;
    }
    fs.writeFileSync(file, content);
  }
});
console.log('Fixed Admin Pages');
