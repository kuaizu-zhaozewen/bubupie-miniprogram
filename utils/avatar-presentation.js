// Exact complete looks use polished full-body renders; partial mixes keep the existing layered preview.
const looks = [
  { pieces: ['silk-bottom', 'silk-top', 'teal-shoes', 'flower-head'], image: '/assets/bayue-floral-cutout.png' },
  { pieces: ['work-bottom', 'work-top', 'brick-shoes', 'flower-head'], image: '/assets/wardrobe-v38/work-v2.png' },
  { pieces: ['arcade-bottom', 'arcade-top', 'brick-shoes', 'flower-head'], image: '/assets/wardrobe-v38/arcade.png' }
];
function presentation(layers = []) {
  const ids = layers.map(p => p.id);
  if (!ids.length) return { renderImage: '/assets/wardrobe-v38/base.png' };
  const look = looks.find(look => ids.length === look.pieces.length && look.pieces.every(id => ids.includes(id)));
  return { renderImage: look ? look.image : '' };
}
module.exports = { presentation };
