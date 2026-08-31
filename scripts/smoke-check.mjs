import fs from 'node:fs';

const app = fs.readFileSync('js/app.js', 'utf8');
const html = fs.readFileSync('index.html', 'utf8');

const checks = [
  ['JavaScript parses', () => { new Function(app); }],
  ['Demo banner exists', () => {
    if (!html.includes('DEMO MODE — ข้อมูลสาธิตเท่านั้น')) throw new Error('Missing demo banner');
  }],
  ['Production Apps Script is absent', () => {
    if (app.includes('script.google.com/macros')) throw new Error('Production cloud endpoint found');
  }],
  ['Storage is demo namespaced', () => {
    if (/dpd_(?!demo_)/.test(app)) throw new Error('Non-demo storage namespace found');
  }],
  ['Demo reset exists', () => {
    if (!app.includes('function resetDemoData()')) throw new Error('Missing demo reset');
  }],
  ['Backup validation is enforced', () => {
    if (!app.includes('validateBackupData(JSON.parse')) throw new Error('Backup validation is not used');
  }],
  ['Approval and rejection exist', () => {
    if (!app.includes('window.approveIssue') || !app.includes('window.rejectIssue')) {
      throw new Error('Incomplete approval workflow');
    }
  }],
  ['No real-looking Thai phone number is embedded', () => {
    const numbers = app.match(/0\d{2}-\d{7}/g) || [];
    const realLooking = numbers.filter(number => number !== '000-0000000');
    if (realLooking.length) throw new Error('Real-looking phone number found');
  }]
];

for (const [name, check] of checks) {
  check();
  console.log('PASS:', name);
}
