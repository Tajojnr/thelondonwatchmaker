// scripts/process-all-assets.js
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const PUBLIC_DIR = path.join(process.cwd(), 'public');
const VIDEOS_DIR = path.join(PUBLIC_DIR, 'videos');
const FRAMES_DIR = path.join(PUBLIC_DIR, 'frames');

// Target configuration (Lowest optimal frame counts for smooth 60fps scrub)
const VIDEO_CONFIG = [
  {
    fileName: 'watch being repaired with detailed view.mp4',
    folderName: 'bench-hero',
    targetFrames: 36,
    description: 'Master Watchmaker Bench Hero sequence'
  },
  {
    fileName: 'exploded view of a watch.mp4',
    folderName: 'exploded-diagnostics',
    targetFrames: 30,
    description: '150-Part Teardown & Diagnostics visualizer'
  },
  {
    fileName: 'detailed insides of a watch.mp4',
    folderName: 'movement-macro',
    targetFrames: 30,
    description: 'Escapement & Gear Train macro precision'
  },
  {
    fileName: 'eploded view sequence+ morphing into a dome like watch.mp4',
    folderName: 'morph-complication',
    targetFrames: 30,
    description: 'Complications & Vintage Heirloom restoration'
  }
];

function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return (bytes / Math.pow(k, i)).toFixed(2) + ' ' + sizes[i];
}

function checkFfmpeg() {
  try {
    execSync('ffmpeg -version', { stdio: 'ignore' });
    return true;
  } catch (e) {
    return false;
  }
}

function getVideoDuration(filePath) {
  try {
    const output = execSync(
      `ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${filePath}"`,
      { encoding: 'utf8' }
    );
    const duration = parseFloat(output.trim());
    return isNaN(duration) ? null : duration;
  } catch (e) {
    return null;
  }
}

// 1. EXTRACT FROM MP4s AND DELETE RAW VIDEOS
function processVideos() {
  console.log('\n======================================================');
  console.log(' 🛠️  STEP 1: EXTRACTING MP4 VIDEOS TO MINIMAL FRAMES');
  console.log('======================================================');

  if (!fs.existsSync(VIDEOS_DIR)) {
    console.log('ℹ️  No public/videos folder found.');
    return;
  }

  if (!checkFfmpeg()) {
    console.error('❌ ffmpeg is not installed or not in PATH.');
    console.log('Install ffmpeg to extract frames automatically:');
    console.log('Windows: winget install Gyan.FFmpeg');
    console.log('Mac: brew install ffmpeg');
    return;
  }

  if (!fs.existsSync(FRAMES_DIR)) {
    fs.mkdirSync(FRAMES_DIR, { recursive: true });
  }

  VIDEO_CONFIG.forEach(item => {
    const videoPath = path.join(VIDEOS_DIR, item.fileName);
    const outFolder = path.join(FRAMES_DIR, item.folderName);

    if (!fs.existsSync(videoPath)) {
      console.log(`⚠️  Video not found: "${item.fileName}" (skipping)`);
      return;
    }

    if (!fs.existsSync(outFolder)) {
      fs.mkdirSync(outFolder, { recursive: true });
    }

    const duration = getVideoDuration(videoPath);
    let fpsFilter = '';
    if (duration && duration > 0) {
      const calcFps = (item.targetFrames / duration).toFixed(3);
      fpsFilter = `fps=${calcFps},`;
    } else {
      fpsFilter = `fps=6,`;
    }

    console.log(`\n⏳ Extracting "${item.fileName}"`);
    console.log(`   ↳ Target: public/frames/${item.folderName}/ (${item.targetFrames} frames)`);
    console.log(`   ↳ Role:   ${item.description}`);

    const command = `ffmpeg -y -i "${videoPath}" -vf "${fpsFilter}scale=1280:-1" -q:v 3 -vframes ${item.targetFrames} "${path.join(outFolder, 'frame_%03d.webp')}"`;

    try {
      execSync(command, { stdio: 'ignore' });
      const frames = fs.readdirSync(outFolder).filter(f => f.endsWith('.webp'));
      const folderSize = frames.reduce((sum, f) => sum + fs.statSync(path.join(outFolder, f)).size, 0);

      console.log(`   ✅ Extracted ${frames.length} frames (${formatBytes(folderSize)})`);

      // DELETE ORIGINAL BULKY MP4
      console.log(`   🗑️  Deleting source video: "${item.fileName}"`);
      fs.unlinkSync(videoPath);
      console.log(`   ✨ Video deleted successfully.`);
    } catch (err) {
      console.error(`   ❌ Failed on ${item.fileName}:`, err.message);
    }
  });
}

// 2. DOWNSAMPLE EXISTING 100+ FRAME DIRECTORIES
function pruneExistingFrameFolders() {
  console.log('\n======================================================');
  console.log(' ✂️  STEP 2: PRUNING & REPURPOSING EXISTING 100+ FRAMES');
  console.log('======================================================');

  if (!fs.existsSync(FRAMES_DIR)) return;

  const folders = fs.readdirSync(FRAMES_DIR).filter(f => {
    return fs.statSync(path.join(FRAMES_DIR, f)).isDirectory();
  });

  folders.forEach(folder => {
    // Skip the newly generated video folders
    if (VIDEO_CONFIG.some(v => v.folderName === folder)) return;

    const folderPath = path.join(FRAMES_DIR, folder);
    const files = fs.readdirSync(folderPath)
      .filter(f => /\.(jpg|jpeg|png|webp)$/i.test(f))
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }));

    if (files.length <= 40) {
      console.log(`✔️  public/frames/${folder}/ already lightweight (${files.length} frames).`);
      return;
    }

    console.log(`\n📦 Found heavy folder: public/frames/${folder}/ (${files.length} frames)`);
    const TARGET = 35;
    const step = files.length / TARGET;
    const keepIndices = new Set();

    for (let i = 0; i < TARGET; i++) {
      keepIndices.add(Math.min(Math.floor(i * step), files.length - 1));
    }

    let deletedCount = 0;
    files.forEach((file, idx) => {
      if (!keepIndices.has(idx)) {
        fs.unlinkSync(path.join(folderPath, file));
        deletedCount++;
      }
    });

    // Re-index remaining files cleanly frame_001.webp, frame_002.webp...
    const remaining = fs.readdirSync(folderPath)
      .filter(f => /\.(jpg|jpeg|png|webp)$/i.test(f))
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }));

    remaining.forEach((file, index) => {
      const ext = path.extname(file);
      const newName = `frame_${String(index + 1).padStart(3, '0')}${ext}`;
      const oldPath = path.join(folderPath, file);
      const newPath = path.join(folderPath, newName);
      if (oldPath !== newPath) {
        fs.renameSync(oldPath, newPath);
      }
    });

    console.log(`   ✂️  Pruned ${deletedCount} excess frames. Kept ${remaining.length} frames (Smooth 35-step scrub ready).`);
  });
}

// 3. AUDIT WATCH WEBP IMAGES
function auditWatchWebpAssets() {
  console.log('\n======================================================');
  console.log(' ⌚ STEP 3: AUDITING WATCH COLLECTION WEBP ASSETS');
  console.log('======================================================');

  const possiblePaths = [
    path.join(PUBLIC_DIR, 'images', 'watches'),
    path.join(PUBLIC_DIR, 'watches'),
    path.join(PUBLIC_DIR, 'images')
  ];

  let found = [];
  possiblePaths.forEach(p => {
    if (fs.existsSync(p)) {
      const webps = fs.readdirSync(p).filter(f => f.endsWith('.webp') || f.endsWith('.png'));
      if (webps.length > 0) {
        found.push({ dir: path.relative(PUBLIC_DIR, p), files: webps });
      }
    }
  });

  if (found.length > 0) {
    found.forEach(group => {
      console.log(`📍 Found in public/${group.dir}:`);
      group.files.forEach(f => console.log(`   • ${f}`));
    });
  } else {
    console.log(`ℹ️  Place your transparent watch webps in 'public/images/watches/' for the Brand Showcase Carousel.`);
  }
}

function run() {
  processVideos();
  pruneExistingFrameFolders();
  auditWatchWebpAssets();
  console.log('\n======================================================');
  console.log(' 🎉 COMPLETE: All frame sequences optimized & videos purged!');
  console.log('======================================================\n');
}

run();