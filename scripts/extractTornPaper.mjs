import fs from 'fs';
import { PNG } from 'pngjs';

const file = 'C:/Users/hp/.gemini/antigravity-ide/brain/4320a76b-01bc-40f0-afae-ace5635ceef4/.user_uploaded/media_1790751203917.png';

fs.createReadStream(file)
  .pipe(new PNG())
  .on('parsed', function() {
    const w = this.width;
    const h = this.height;
    const points = [];
    for (let x = 0; x <= w; x += 4) {
      const curX = Math.min(x, w - 1);
      let tornY = h;
      for (let y = h - 1; y >= h - 40; y--) {
        const idx = (w * y + curX) << 2;
        const r = this.data[idx];
        const g = this.data[idx + 1];
        const b = this.data[idx + 2];
        if (r > 235 && g > 235 && b > 235) {
          tornY = y;
        } else {
          break;
        }
      }
      const normX = ((curX / w) * 1440).toFixed(1);
      // Let's normalize y such that 0 is the highest torn point (top of tear) and 40 is bottom
      const relY = Math.max(0, tornY - (h - 24));
      const normY = ((relY / 24) * 40).toFixed(1);
      points.push({ x: normX, y: normY });
    }
    
    // SVG path creating the bottom paper overlay (from torn contour down to bottom)
    let d = `M 0 ${points[0].y} `;
    for (let i = 1; i < points.length; i++) {
      d += `L ${points[i].x} ${points[i].y} `;
    }
    d += `L 1440 60 L 0 60 Z`;
    
    const content = `// Auto-generated exact contour from reference image\nexport const TORN_PAPER_D = ${JSON.stringify(d)};\n`;
    fs.writeFileSync('src/components/tornPaperPath.js', content);
    console.log('Successfully wrote src/components/tornPaperPath.js');
  });
