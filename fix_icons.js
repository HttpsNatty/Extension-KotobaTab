const fs = require('fs');
const path = require('path');

// A 1x1 pink pixel PNG in base64
const base64Png = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==';
const buffer = Buffer.from(base64Png, 'base64');

const iconPath = path.join(__dirname, 'icons');
if (!fs.existsSync(iconPath)) {
  fs.mkdirSync(iconPath, { recursive: true });
}

fs.writeFileSync(path.join(iconPath, 'icon16.png'), buffer);
fs.writeFileSync(path.join(iconPath, 'icon48.png'), buffer);
fs.writeFileSync(path.join(iconPath, 'icon128.png'), buffer);
console.log('Icons fixed with basic PNG');
