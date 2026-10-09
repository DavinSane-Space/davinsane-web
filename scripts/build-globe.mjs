// Builds the dotted-globe data for /sobre-mi/ so the browser never does geo math.
// Output: data/globe-land.json ([[lat, lon], ...] with 2 decimals) and img/flags/*.svg.
// Run with: npm run build:globe
import { readFileSync, writeFileSync, mkdirSync, copyFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { feature } from 'topojson-client';
import { geoContains } from 'd3-geo';

const require = createRequire(import.meta.url);
const root = join(dirname(fileURLToPath(import.meta.url)), '..');

const SAMPLES = 6000;
const FLAGS = ['us', 'co', 'in', 'ph', 'ar', 'mx'];

const topology = JSON.parse(readFileSync(require.resolve('world-atlas/land-110m.json'), 'utf8'));
const land = feature(topology, topology.objects.land);

// Fibonacci spiral: evenly spaced points on the sphere.
const golden = Math.PI * (3 - Math.sqrt(5));
const round2 = (n) => Math.round(n * 100) / 100;
const points = [];
for (let i = 0; i < SAMPLES; i++) {
  const y = 1 - ((i + 0.5) / SAMPLES) * 2;
  const lat = Math.asin(y) * 180 / Math.PI;
  let lon = ((golden * i) * 180 / Math.PI) % 360;
  if (lon > 180) lon -= 360;
  if (geoContains(land, [lon, lat])) points.push([round2(lat), round2(lon)]);
}

mkdirSync(join(root, 'data'), { recursive: true });
writeFileSync(join(root, 'data/globe-land.json'), JSON.stringify(points));

const flagSrc = join(dirname(require.resolve('flag-icons/package.json')), 'flags/1x1');
mkdirSync(join(root, 'img/flags'), { recursive: true });
for (const code of FLAGS) copyFileSync(join(flagSrc, code + '.svg'), join(root, 'img/flags', code + '.svg'));

console.log(`globe: ${points.length} land points of ${SAMPLES}, ${FLAGS.length} flags copied`);
