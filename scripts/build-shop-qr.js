// Build only the public, invalid-for-production demo QR assets.
const fs = require('fs'), path = require('path');
let qr;
try { qr = require('qrcode'); } catch (e) { qr = require(path.resolve(__dirname, '../../tmp/wardrobe-tools/node_modules/qrcode')); }
// Standalone source package: npm install --no-save qrcode before rebuilding assets. Runtime needs no npm packages.
const out = path.resolve(__dirname, '../assets/shop-qr'); fs.mkdirSync(out, { recursive: true });
Promise.all(require('../utils/commerce').channels.map(c => qr.toFile(path.join(out, c.token + '.png'), 'BUBUPIE:SHOP:' + c.token, { width: 420, margin: 3 })))
  .then(() => console.log('Built 3 public demo QR assets; not official mini-program codes.'))
  .catch(e => { console.error(e); process.exitCode = 1; });
