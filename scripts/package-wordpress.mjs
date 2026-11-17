import fs from 'node:fs';
import path from 'node:path';
import JSZip from 'jszip';
import { build as esbuild } from 'esbuild';

const root = process.cwd();
const distAssetsDir = path.join(root, 'dist-wp', 'assets');
const releaseDir = path.join(root, 'release-wp');
const wpThemeDir = path.join(root, 'wordpress', 'iramo-ai-theme');
const wpPluginDir = path.join(root, 'wordpress', 'iramo-ai-suite');

fs.mkdirSync(releaseDir, { recursive: true });

/**
 * 1. Extract all 18 Curated Real AI Tools from src/data/lmsData.ts into curated-ai-tools.json
 */
async function generateCuratedAiToolsJson() {
  const result = await esbuild({
    stdin: {
      contents: `import { AI_TOOLS_DATA } from './src/data/lmsData'; export default AI_TOOLS_DATA;`,
      resolveDir: root,
      loader: 'ts',
    },
    bundle: true,
    write: false,
    format: 'esm',
    platform: 'node',
    loader: {
      '.jpg': 'text',
      '.png': 'text',
      '.webp': 'text',
      '.svg': 'text',
      '.css': 'text',
    },
  });

  const bundledCode = result.outputFiles[0].text;
  const mod = await import(
    'data:text/javascript;base64,' + Buffer.from(bundledCode, 'utf8').toString('base64')
  );
  const rawTools = Array.isArray(mod.default) ? mod.default : [];

  const serialized = rawTools.map((t) => ({
    id: t.id,
    name: t.name,
    provider: t.provider,
    taglineFa: t.tagline?.fa || '',
    task: t.task,
    input: t.input,
    output: t.output,
    pricing: t.pricing,
    startingPriceFa: t.startingPrice?.fa || t.pricing,
    pricingDetailsFa: t.pricingDetails?.fa || '',
    verified: Boolean(t.verified),
    featured: Boolean(t.featured),
    hasApi: Boolean(t.hasApi),
    hasMobileApp: Boolean(t.hasMobileApp),
    popularityScore: Number(t.popularityScore || 92),
    likes: Number(t.likes || 120),
    dislikes: Number(t.dislikes || 6),
    url: t.url || '',
    descriptionFa: t.description?.fa || '',
    longDescriptionFa: Array.isArray(t.longDescription?.fa) ? t.longDescription.fa : [],
    keyFeaturesFa: Array.isArray(t.keyFeatures?.fa) ? t.keyFeatures.fa : [],
    whoIsItForFa: Array.isArray(t.whoIsItFor?.fa) ? t.whoIsItFor.fa : [],
    stepsFa: Array.isArray(t.steps?.fa) ? t.steps.fa : [],
    samplePromptFa: t.samplePrompt?.fa || '',
  }));

  const targetDir = path.join(wpPluginDir, 'assets');
  fs.mkdirSync(targetDir, { recursive: true });
  const targetFile = path.join(targetDir, 'curated-ai-tools.json');
  fs.writeFileSync(targetFile, JSON.stringify(serialized, null, 2), 'utf8');
  console.log(`Generated wordpress/iramo-ai-suite/assets/curated-ai-tools.json (${serialized.length} tools)`);
}

function addDirectoryRecursive(zipFolder, srcDir) {
  if (!fs.existsSync(srcDir)) return;
  for (const entry of fs.readdirSync(srcDir, { withFileTypes: true })) {
    const fullPath = path.join(srcDir, entry.name);
    if (entry.isDirectory()) {
      addDirectoryRecursive(zipFolder.folder(entry.name), fullPath);
    } else if (entry.isFile()) {
      zipFolder.file(entry.name, fs.readFileSync(fullPath));
    }
  }
}

async function buildPluginZip() {
  const zip = new JSZip();
  const base = zip.folder('iramo-ai-suite');

  addDirectoryRecursive(base, wpPluginDir);

  const assetsFolder = base.folder('assets');
  if (fs.existsSync(distAssetsDir)) {
    for (const file of fs.readdirSync(distAssetsDir)) {
      const fullPath = path.join(distAssetsDir, file);
      if (fs.statSync(fullPath).isFile()) {
        assetsFolder.file(file, fs.readFileSync(fullPath));
      }
    }
  }

  const logoDir = path.join(root, 'public', 'assets', 'aistudio');
  const brandLogos = ['Group_179_659a031b.png', 'logo_brand_19b8e3d7.png'];
  if (fs.existsSync(logoDir)) {
    const pubAssets = base.folder('assets/aistudio');
    for (const logo of brandLogos) {
      const p = path.join(logoDir, logo);
      if (fs.existsSync(p) && fs.statSync(p).isFile()) {
        pubAssets.file(logo, fs.readFileSync(p));
      }
    }
  }

  const fontsDir = path.join(root, 'public', 'fonts');
  if (fs.existsSync(fontsDir)) {
    const pluginFonts = base.folder('assets/fonts');
    for (const file of fs.readdirSync(fontsDir)) {
      const fullPath = path.join(fontsDir, file);
      if (fs.statSync(fullPath).isFile()) {
        pluginFonts.file(file, fs.readFileSync(fullPath));
      }
    }
  }

  const out = await zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' });
  fs.writeFileSync(path.join(releaseDir, 'iramo-ai-plugin.zip'), out);
  console.log('Generated release-wp/iramo-ai-plugin.zip');
}

async function buildThemeZip() {
  const zip = new JSZip();
  const base = zip.folder('iramo-ai-theme');

  addDirectoryRecursive(base, wpThemeDir);

  const themeImages = base.folder('assets/images');
  const srcImagesDir = path.join(root, 'src', 'assets', 'images');
  if (fs.existsSync(srcImagesDir)) {
    for (const file of fs.readdirSync(srcImagesDir)) {
      const fullPath = path.join(srcImagesDir, file);
      if (fs.statSync(fullPath).isFile()) {
        themeImages.file(file, fs.readFileSync(fullPath));
      }
    }
  }

  const logoDir = path.join(root, 'public', 'assets', 'aistudio');
  for (const logo of ['Group_179_659a031b.png', 'logo_brand_19b8e3d7.png']) {
    const p = path.join(logoDir, logo);
    if (fs.existsSync(p) && fs.statSync(p).isFile()) {
      themeImages.file(logo, fs.readFileSync(p));
    }
  }

  const out = await zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' });
  fs.writeFileSync(path.join(releaseDir, 'iramo-ai-theme.zip'), out);
  console.log('Generated release-wp/iramo-ai-theme.zip');
}

await generateCuratedAiToolsJson();
await buildPluginZip();
await buildThemeZip();

const publicDownloadsDir = path.join(root, 'public', 'downloads');
fs.mkdirSync(publicDownloadsDir, { recursive: true });
fs.copyFileSync(
  path.join(releaseDir, 'iramo-ai-plugin.zip'),
  path.join(publicDownloadsDir, 'iramo-ai-plugin.zip')
);
fs.copyFileSync(
  path.join(releaseDir, 'iramo-ai-theme.zip'),
  path.join(publicDownloadsDir, 'iramo-ai-theme.zip')
);
console.log('Copied ZIP packages to public/downloads/');
