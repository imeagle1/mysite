import fs from 'node:fs';
import path from 'node:path';
import JSZip from 'jszip';

const root = process.cwd();
const distAssetsDir = path.join(root, 'dist-wp', 'assets');
const releaseDir = path.join(root, 'release-wp');

fs.mkdirSync(releaseDir, { recursive: true });

// Read templates cleanly from src/data/wordpressPackage.ts by importing or extracting
const pkgSource = fs.readFileSync(
  path.join(root, 'src', 'data', 'wordpressPackage.ts'),
  'utf8'
);

function extractTemplateLiteral(name) {
  const regex = new RegExp(`export const ${name} = \`([\\s\\S]*?)\`;`);
  const match = pkgSource.match(regex);
  if (!match) {
    throw new Error(`Missing constant ${name} in wordpressPackage.ts`);
  }
  return match[1]
    .replace(/\\\\n/g, '\\n')
    .replace(/\\\\Elementor/g, '\\Elementor')
    .replace(/\\\\WP_Query/g, '\\WP_Query');
}

async function buildPluginZip() {
  const zip = new JSZip();
  const base = zip.folder('iramo-ai-suite');

  base.file('iramo-ai-suite.php', extractTemplateLiteral('WP_PLUGIN_CORE_PHP'));
  base.file('includes/admin-settings.php', extractTemplateLiteral('WP_ADMIN_SETTINGS_PHP'));
  base.file('includes/elementor-widgets.php', extractTemplateLiteral('WP_ELEMENTOR_WIDGETS_PHP'));
  base.file('includes/bot-bridge.php', extractTemplateLiteral('WP_BOT_BRIDGE_PHP'));

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

  const out = await zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' });
  fs.writeFileSync(path.join(releaseDir, 'iramo-ai-plugin.zip'), out);
  console.log('Generated release-wp/iramo-ai-plugin.zip');
}

async function buildThemeZip() {
  const zip = new JSZip();
  const base = zip.folder('iramo-ai-theme');

  base.file('style.css', extractTemplateLiteral('WP_THEME_STYLE_CSS'));
  base.file('functions.php', extractTemplateLiteral('WP_THEME_FUNCTIONS_PHP'));
  base.file('index.php', extractTemplateLiteral('WP_THEME_INDEX_PHP'));
  base.file('header.php', extractTemplateLiteral('WP_THEME_HEADER_PHP'));
  base.file('footer.php', extractTemplateLiteral('WP_THEME_FOOTER_PHP'));
  base.file('page.php', extractTemplateLiteral('WP_THEME_INDEX_PHP'));
  base.file('templates/template-canvas.php', extractTemplateLiteral('WP_THEME_CANVAS_TEMPLATE_PHP'));

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
