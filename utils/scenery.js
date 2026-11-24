// The scenery follows the visible garment; empty layers can show the launch look.
function isQuanzhou(layers, fallbackToLaunch) {
  if (!Array.isArray(layers) || layers.length === 0) return !!fallbackToLaunch;
  return layers.some(piece => piece && piece.id === 'silk-top');
}
module.exports = { isQuanzhou };
