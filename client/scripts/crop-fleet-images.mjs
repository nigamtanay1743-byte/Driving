import sharp from 'sharp';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.resolve(__dirname, '../src/assets/fleet');
const input = path.resolve(outDir, 'source.png');

if (!fs.existsSync(input)) {
  console.error('Source image not found:', input);
  process.exit(1);
}

fs.mkdirSync(outDir, { recursive: true });

const meta = await sharp(input).metadata();
const { width, height } = meta;

// Photo grid is on the right ~52% of the reference screenshot
const gridLeft = Math.round(width * 0.48);
const gridWidth = width - gridLeft;
const gridTop = Math.round(height * 0.12);
const gridHeight = Math.round(height * 0.82);

const mainWidth = Math.round(gridWidth * 0.48);
const sideWidth = gridWidth - mainWidth - 8;
const topHeight = Math.round(gridHeight * 0.52);
const bottomHeight = gridHeight - topHeight - 8;

const crops = [
  {
    name: 'training-side.jpg',
    left: gridLeft,
    top: gridTop,
    w: mainWidth,
    h: gridHeight,
  },
  {
    name: 'training-front.jpg',
    left: gridLeft + mainWidth + 8,
    top: gridTop,
    w: sideWidth,
    h: topHeight,
  },
  {
    name: 'school-sidhbari.jpg',
    left: gridLeft + mainWidth + 8,
    top: gridTop + topHeight + 8,
    w: sideWidth,
    h: bottomHeight,
  },
];

for (const c of crops) {
  await sharp(input)
    .extract({ left: c.left, top: c.top, width: c.w, height: c.h })
    .jpeg({ quality: 88 })
    .toFile(path.join(outDir, c.name));
  console.log('Wrote', c.name);
}
