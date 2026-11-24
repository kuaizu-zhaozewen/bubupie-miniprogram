// Code-native doodles: a floppy-eared plush companion, store, bag and person.
const fs = require('fs'), path = require('path'), { createRequire } = require('module');
const bundled = createRequire('C:/Program Files/WindowsApps/OpenAI.CodexPrimaryRuntime.v26-1119-907-0_26.1119.907.0_x64__3k8sg7r9htsxt/dependencies/node/node_modules/_.js');
const sharp = bundled('sharp');
const out = path.resolve(__dirname, '../assets/navigation'); fs.mkdirSync(out, { recursive: true });
const paths = {
  partner: '<path d="M18 20c-5-7-12-2-11 7l1 13c1 8 9 7 12-1M46 20c5-7 12-2 11 7l-1 13c-1 8-9 7-12-1"/><path d="M17 24c0-10 6-15 15-15s15 5 15 15v13c0 12-7 18-15 18s-15-6-15-18Z"/><path d="M24 10l3-5 5 4 5-4 3 5"/><circle cx="25.5" cy="29" r="1.5" fill="currentColor" stroke="none"/><circle cx="38.5" cy="29" r="1.5" fill="currentColor" stroke="none"/><path d="M28 39q4 4 8 0M44 24q-4 4 0 8t0 8"/>',
  shop: '<rect x="9" y="10" width="17" height="17" rx="4"/><rect x="9" y="36" width="17" height="17" rx="4"/><rect x="35" y="36" width="17" height="17" rx="4"/><circle cx="42" cy="17" r="9"/><path d="m49 24 7 7"/>',
  bag: '<path d="M13 22h38l3 31H10Z"/><path d="M23 23V15a9 9 0 0 1 18 0v8"/>',
  profile: '<circle cx="32" cy="19" r="10"/><path d="M13 53c0-12 8-19 19-19s19 7 19 19Z"/>'
};
const filled = {
  partner: '<path fill="#1d1d1f" d="M18 20c-5-7-12-2-11 7l1 13c1 8 9 7 12-1M46 20c5-7 12-2 11 7l-1 13c-1 8-9 7-12-1"/><path fill="#1d1d1f" d="M17 24c0-10 6-15 15-15s15 5 15 15v13c0 12-7 18-15 18s-15-6-15-18Z"/><path fill="#1d1d1f" d="M24 10l3-5 5 4 5-4 3 5Z"/><g stroke="#fff" stroke-width="2.5"><path d="M28 39q4 4 8 0M43 24q-3 4 0 8t0 8"/><circle cx="25.5" cy="29" r="1.4" fill="#fff" stroke="none"/><circle cx="37.5" cy="29" r="1.4" fill="#fff" stroke="none"/></g>',
  shop: '<g fill="#1d1d1f"><rect x="9" y="10" width="17" height="17" rx="4"/><rect x="9" y="36" width="17" height="17" rx="4"/><rect x="35" y="36" width="17" height="17" rx="4"/><circle cx="42" cy="17" r="9"/></g><circle cx="42" cy="17" r="5" fill="#fff" stroke="none"/><path d="m49 24 7 7" stroke-width="4"/>',
  bag: '<path fill="#1d1d1f" d="M13 22h38l3 31H10Z"/><path d="M23 23V15a9 9 0 0 1 18 0v8" fill="none"/>',
  profile: '<circle cx="32" cy="19" r="10" fill="#1d1d1f"/><path fill="#1d1d1f" d="M13 53c0-12 8-19 19-19s19 7 19 19Z"/>'
};
(async () => { for (const [name, body] of Object.entries(paths)) for (const selected of [false, true]) {
  const color = selected ? '#1d1d1f' : '#929297';
  const svg = '<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 64 64"><g color="' + color + '" stroke="' + color + '" stroke-width="2.7" stroke-linecap="round" stroke-linejoin="round" fill="none">' + (selected ? filled[name] : body) + '</g></svg>';
  const file = name + (selected ? '-selected' : ''); fs.writeFileSync(path.join(out, file + '.svg'), svg); await sharp(Buffer.from(svg)).resize(81, 81).png().toFile(path.join(out, file + '.png'));
} console.log('Built 4 native tab icons, with selected/unselected states.'); })().catch(e => { console.error(e); process.exitCode = 1; });
