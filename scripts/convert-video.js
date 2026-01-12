const path = require('path');
const { spawnSync } = require('child_process');
let ffmpegPath;
try {
  ffmpegPath = require('ffmpeg-static');
} catch (err) {
  console.error('ffmpeg-static not found. Please run `npm install ffmpeg-static` first.');
  process.exit(1);
}

const projectRoot = path.resolve(__dirname, '..');
const input = path.join(projectRoot, 'public', 'video', 'kuidd-plus.mp4');
const output = path.join(projectRoot, 'public', 'video', 'kuidd-plus-web.mp4');

console.log('Using ffmpeg at', ffmpegPath);
console.log('Input:', input);
console.log('Output:', output);

const args = [
  '-i', input,
  '-c:v', 'libx264',
  '-profile:v', 'main',
  '-pix_fmt', 'yuv420p',
  '-movflags', '+faststart',
  '-c:a', 'aac',
  '-b:a', '128k',
  output,
];

const res = spawnSync(ffmpegPath, args, { stdio: 'inherit' });
if (res.error) {
  console.error('Error running ffmpeg:', res.error);
  process.exit(1);
}
if (res.status !== 0) {
  console.error('ffmpeg exited with code', res.status);
  process.exit(res.status || 1);
}

console.log('Conversion completed successfully.');
