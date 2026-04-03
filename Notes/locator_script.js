const fs = require('fs');
const path = require('path');

const dirsToSearch = ['tests', 'utils'];
const locatorRegex = /\.locator\([^)]+\)|\.getBy\w+\([^)]+\)/g;
const locators = [];

dirsToSearch.forEach(dir => {
  if (fs.existsSync(dir)) {
    const files = fs.readdirSync(dir).filter(f => f.endsWith('.ts'));
    
    files.forEach(file => {
      const content = fs.readFileSync(path.join(dir, file), 'utf-8');
      const matches = content.match(locatorRegex) || [];
      matches.forEach(match => locators.push(`${file}: ${match}`));
    });
  }
});

console.log(locators.join('\n'));