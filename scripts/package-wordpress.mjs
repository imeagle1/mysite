import fs from 'node:fs';
import path from 'node:path';
import JSZip from 'jszip';

const root = process.cwd();
const distAssetsDir = path.join(root, 'dist-wp', 'assets');
const releaseDir = path.join(root, 'release-wp');

fs.mkdirSync(releaseDir, { recursive: true });

// Evaluate exports directly so PHP/CSS template escape sequences match TypeScript runtime identically
const pkgSource = fs.readFileSync(
  path.join(root, 'src', 'data', 'wordpressPackage.ts'),
  'utf8'
);
const pkgExports = await import(
  'data:text/javascript;base64,' + Buffer.from(pkgSource, 'utf8').toString('base64')
);

function getPackageString(name) {
  const value = pkgExports[name];
  if (typeof value !== 'string') {
    throw new Error(`Missing export ${name} in wordpressPackage.ts`);
  }
  return value;
}

async function buildPluginZip() {
  const zip = new JSZip();
  const base = zip.folder('iramo-ai-suite');

  base.file('iramo-ai-suite.php', getPackageString('WP_PLUGIN_CORE_PHP'));
  base.file('includes/admin-settings.php', getPackageString('WP_ADMIN_SETTINGS_PHP'));
  base.file('includes/elementor-widgets.php', getPackageString('WP_ELEMENTOR_WIDGETS_PHP'));
  base.file('includes/bot-bridge.php', getPackageString('WP_BOT_BRIDGE_PHP'));

  const assetsFolder = base.folder('assets');
  if (fs.existsSync(distAssetsDir)) {
    const files = fs.readdirSync(distAssetsDir);
    for (const file of files) {
      const fullPath = path.join(distAssetsDir, file);
      if (fs.statSync(fullPath).isFile()) {
        assetsFolder.file(file, fs.readFileSync(fullPath));
      }
    }
  }

  // Also include public/assets/aistudio logos if present
  const logoDir = path.join(root, 'public', 'assets', 'aistudio');
  if (fs.existsSync(logoDir)) {
    const pubAssets = base.folder('assets/aistudio');
    for (const file of fs.readdirSync(logoDir)) {
      const fullPath = path.join(logoDir, file);
      if (fs.statSync(fullPath).isFile()) {
        pubAssets.file(file, fs.readFileSync(fullPath));
      }
    }
  }

  // Include public/fonts custom uploaded font files inside assets/fonts/
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

  base.file('style.css', getPackageString('WP_THEME_STYLE_CSS'));
  base.file('functions.php', getPackageString('WP_THEME_FUNCTIONS_PHP'));
  base.file('index.php', getPackageString('WP_THEME_INDEX_PHP'));
  base.file('header.php', getPackageString('WP_THEME_HEADER_PHP'));
  base.file('footer.php', getPackageString('WP_THEME_FOOTER_PHP'));
  base.file('page.php', getPackageString('WP_THEME_INDEX_PHP'));
  base.file('templates/template-canvas.php', getPackageString('WP_THEME_CANVAS_TEMPLATE_PHP'));
  base.file('elementor-templates/iramo-canvas-template.json', getPackageString('ELEMENTOR_TEMPLATE_JSON'));

  const out = await zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' });
  fs.writeFileSync(path.join(releaseDir, 'iramo-ai-theme.zip'), out);
  console.log('Generated release-wp/iramo-ai-theme.zip');
}

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
