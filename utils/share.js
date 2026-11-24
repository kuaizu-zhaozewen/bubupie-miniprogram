// Brand and character assets stay local. Real mini-program codes must come from the server.
function round(ctx, x, y, w, h, r, color) {
  ctx.setFillStyle(color); ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath(); ctx.fill();
}
function wrapped(ctx, text, x, y, width, lineHeight) {
  let line = '';
  for (const ch of text) { if (ch === '\n' || (line && ctx.measureText(line + ch).width > width)) { ctx.fillText(line, x, y); y += lineHeight; line = ch === '\n' ? '' : ch; } else line += ch; }
  if (line) ctx.fillText(line, x, y);
  return y;
}
function renderShare(page, type) {
  const poster = type === 'poster', timeline = type === 'timeline';
  const w = poster ? 750 : 600, h = poster ? 1120 : timeline ? 600 : 480;
  const canvasId = poster ? 'sharePoster' : timeline ? 'shareTimeline' : 'shareCover';
  const { item, daily } = page.data;
  return new Promise((resolve, reject) => {
    let settled = false;
    const finish = (callback, value) => { if (settled) return; settled = true; clearTimeout(timer); callback(value); };
    const fail = error => finish(reject, error);
    const timer = setTimeout(() => fail(new Error('SHARE_IMAGE_TIMEOUT')), 8000);
    try { wx.getImageInfo({ src: item.image, success(image) {
      if (settled) return;
      try {
      // Use the approved raster brand logo here; SVG is used only in WXML.
      const ctx = wx.createCanvasContext(canvasId, page);
      ctx.setFillStyle(daily.color); ctx.fillRect(0, 0, w, h);
      // Transparent letter-only wordmark; preserve the approved 1872:323 aspect ratio.
      ctx.drawImage('/assets/bubupie-wordmark.png', poster ? 45 : 32, 32, 116, 116 * 323 / 1872);
      ctx.setFillStyle('#80766e'); ctx.setFontSize(poster ? 20 : 17); ctx.fillText(daily.date, w - (poster ? 168 : 142), 55);
      const ih = poster ? 510 : timeline ? 295 : 245, iw = ih * image.width / image.height;
      ctx.drawImage(image.path, (w - iw) / 2, poster ? 85 : 70, iw, ih);
      const cy = poster ? 625 : timeline ? 375 : 315;
      round(ctx, poster ? 35 : 24, cy, w - (poster ? 70 : 48), poster ? 405 : h - cy - 22, 26, '#fffdf8');
      ctx.setFillStyle('#927e6a'); ctx.setFontSize(poster ? 23 : 18); ctx.fillText(item.name + '给我的一句话', poster ? 65 : 46, cy + 42);
      ctx.setFillStyle('#283f3d'); ctx.setFontSize(poster ? 43 : timeline ? 29 : 26);
      wrapped(ctx, daily.quote, poster ? 65 : 46, cy + (poster ? 110 : 82), w - (poster ? 130 : 92), poster ? 65 : 39);
      if (poster) { ctx.setFontSize(22); ctx.setFillStyle('#8b8278'); wrapped(ctx, daily.action, 65, cy + 255, 400, 35); round(ctx, 560, 905, 100, 95, 14, '#f0eee7'); ctx.setFillStyle('#8b8278'); ctx.setFontSize(18); ctx.fillText('小程序', 578, 945); ctx.setFontSize(13); ctx.fillText('码待正式接入', 567, 975); ctx.setFontSize(18); ctx.fillText('角色创作 · 仅供娱乐', 45, 1070); }
      ctx.draw(false, () => {
        if (settled) return;
        try { wx.canvasToTempFilePath({ canvasId, width: w, height: h, destWidth: w, destHeight: h, fileType: 'png', success: res => finish(resolve, res.tempFilePath), fail }, page); }
        catch (error) { fail(error); }
      });
      } catch (error) { fail(error); }
    }, fail }); } catch (error) { fail(error); }
  });
}
module.exports = { renderShare };
