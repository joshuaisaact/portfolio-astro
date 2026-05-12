const SKIP_CLASSES = ['profile-default', 'profile-ceefax'];
const PIXEL_FACTOR = 12;
const DITHER_STRENGTH = 0.2;

export function ceefaxDitherImages(): void {
  document.querySelectorAll('img').forEach((img) => {
    if (SKIP_CLASSES.some((c) => img.classList.contains(c))) return;

    const process = () => {
      try {
        const w = img.naturalWidth;
        const h = img.naturalHeight;
        if (!w || !h) return;

        const sw = Math.max(Math.round(w / PIXEL_FACTOR), 1);
        const sh = Math.max(Math.round(h / PIXEL_FACTOR), 1);

        const c = document.createElement('canvas');
        c.width = sw;
        c.height = sh;
        const ctx = c.getContext('2d');
        if (!ctx) return;
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(img, 0, 0, sw, sh);

        const px = ctx.getImageData(0, 0, sw, sh);
        const d = px.data;
        const lum = new Float32Array(sw * sh);

        for (let i = 0; i < d.length; i += 4) {
          lum[i >> 2] = 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2];
        }

        // Floyd-Steinberg with reduced strength to soften the dot pattern
        for (let y = 0; y < sh; y++) {
          for (let x = 0; x < sw; x++) {
            const idx = y * sw + x;
            const old = lum[idx];
            const quantized = old > 127 ? 255 : 0;
            const err = (old - quantized) * DITHER_STRENGTH;
            lum[idx] = quantized;
            if (x + 1 < sw)       lum[idx + 1]      += (err * 7) / 16;
            if (y + 1 < sh) {
              if (x > 0)          lum[idx + sw - 1] += (err * 3) / 16;
                                  lum[idx + sw]     += (err * 5) / 16;
              if (x + 1 < sw)     lum[idx + sw + 1] += (err * 1) / 16;
            }
          }
        }

        for (let i = 0; i < d.length; i += 4) {
          if (lum[i >> 2] > 127) {
            d[i] = 0; d[i + 1] = 255; d[i + 2] = 255; // cyan
          } else {
            d[i] = 0; d[i + 1] = 0; d[i + 2] = 0; // black
          }
          d[i + 3] = 255;
        }

        ctx.putImageData(px, 0, 0);

        const c2 = document.createElement('canvas');
        c2.width = w;
        c2.height = h;
        const ctx2 = c2.getContext('2d');
        if (!ctx2) return;
        ctx2.imageSmoothingEnabled = false;
        ctx2.drawImage(c, 0, 0, w, h);
        img.src = c2.toDataURL();
        img.srcset = '';
        img.classList.add('ceefax-pixelated');
      } catch {}
    };

    if (img.complete && img.naturalWidth) process();
    else img.addEventListener('load', process);
  });
}
