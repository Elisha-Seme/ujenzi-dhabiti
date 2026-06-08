const sharp = require("sharp");
(async () => {
  const src = "../Logo Updated-80.jpg.jpeg";
  const { data, info } = await sharp(src).ensureAlpha().raw()
    .toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;
  const out = Buffer.alloc(width * height * 4);
  const FLOOR = 26, SPAN = 255 - FLOOR; // lift the burgundy haze fully to transparent
  for (let i = 0; i < width * height; i++) {
    const r = data[i * channels], g = data[i * channels + 1], b = data[i * channels + 2];
    const m = Math.min(r, g, b);                 // burgundy -> low, white -> 255
    let a = Math.round(Math.max(0, m - FLOOR) * 255 / SPAN);
    if (a > 255) a = 255;
    out[i * 4] = 255; out[i * 4 + 1] = 255; out[i * 4 + 2] = 255; out[i * 4 + 3] = a; // pure white
  }
  await sharp(out, { raw: { width, height, channels: 4 } })
    .trim({ threshold: 10 })
    .png({ compressionLevel: 9 })
    .toFile("public/logo-stacked-white.png");
  const meta = await sharp("public/logo-stacked-white.png").metadata();
  console.log("written logo-stacked-white.png", meta.width + "x" + meta.height);
})();
