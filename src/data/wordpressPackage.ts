import wpPluginCorePhp from '../../wordpress/iramo-ai-suite/iramo-ai-suite.php?raw';
import wpAdminSettingsPhp from '../../wordpress/iramo-ai-suite/includes/admin-settings.php?raw';
import wpBotBridgePhp from '../../wordpress/iramo-ai-suite/includes/bot-bridge.php?raw';
import wpElementorWidgetsPhp from '../../wordpress/iramo-ai-suite/includes/elementor-widgets.php?raw';
import wpElementorDynamicTagsPhp from '../../wordpress/iramo-ai-suite/includes/elementor-dynamic-tags.php?raw';
import wpElementorSeederPhp from '../../wordpress/iramo-ai-suite/includes/elementor-seeder.php?raw';
import wpSeoSecurityPhp from '../../wordpress/iramo-ai-suite/includes/seo-security.php?raw';

import wpThemeStyleCss from '../../wordpress/iramo-ai-theme/style.css?raw';
import wpThemeJson from '../../wordpress/iramo-ai-theme/theme.json?raw';
import wpThemeFunctionsPhp from '../../wordpress/iramo-ai-theme/functions.php?raw';
import wpThemeHeaderPhp from '../../wordpress/iramo-ai-theme/header.php?raw';
import wpThemeFooterPhp from '../../wordpress/iramo-ai-theme/footer.php?raw';
import wpThemeFrontPagePhp from '../../wordpress/iramo-ai-theme/front-page.php?raw';
import wpThemeIndexPhp from '../../wordpress/iramo-ai-theme/index.php?raw';
import wpThemePagePhp from '../../wordpress/iramo-ai-theme/page.php?raw';
import wpThemePageServicesPhp from '../../wordpress/iramo-ai-theme/page-services.php?raw';
import wpThemeSinglePhp from '../../wordpress/iramo-ai-theme/single.php?raw';
import wpThemeArchivePhp from '../../wordpress/iramo-ai-theme/archive.php?raw';
import wpThemeArchiveAiToolPhp from '../../wordpress/iramo-ai-theme/archive-iramo_ai_tool.php?raw';
import wpThemeSingleAiToolPhp from '../../wordpress/iramo-ai-theme/single-iramo_ai_tool.php?raw';
import wpThemeArchiveProductPhp from '../../wordpress/iramo-ai-theme/archive-iramo_product.php?raw';
import wpThemeSingleProductPhp from '../../wordpress/iramo-ai-theme/single-iramo_product.php?raw';
import wpThemeSingleWcProductPhp from '../../wordpress/iramo-ai-theme/single-product.php?raw';
import wpThemeArchiveCoursePhp from '../../wordpress/iramo-ai-theme/archive-iramo_course.php?raw';
import wpThemeSingleCoursePhp from '../../wordpress/iramo-ai-theme/single-iramo_course.php?raw';
import wpThemeArchiveArticlePhp from '../../wordpress/iramo-ai-theme/archive-iramo_article.php?raw';
import wpThemeSingleArticlePhp from '../../wordpress/iramo-ai-theme/single-iramo_article.php?raw';
import wpTheme404Php from '../../wordpress/iramo-ai-theme/404.php?raw';
import wpThemeCanvasTemplatePhp from '../../wordpress/iramo-ai-theme/templates/template-canvas.php?raw';
import wpThemeJs from '../../wordpress/iramo-ai-theme/assets/iramo-theme.js?raw';
import wpElementorCanvasJson from '../../wordpress/iramo-ai-theme/elementor-templates/iramo-canvas-template.json?raw';

export const WP_PLUGIN_CORE_PHP = wpPluginCorePhp;
export const WP_ADMIN_SETTINGS_PHP = wpAdminSettingsPhp;
export const WP_BOT_BRIDGE_PHP = wpBotBridgePhp;
export const WP_ELEMENTOR_WIDGETS_PHP = wpElementorWidgetsPhp;
export const WP_ELEMENTOR_DYNAMIC_TAGS_PHP = wpElementorDynamicTagsPhp;
export const WP_ELEMENTOR_SEEDER_PHP = wpElementorSeederPhp;
export const WP_SEO_SECURITY_PHP = wpSeoSecurityPhp;

export const WP_THEME_STYLE_CSS = wpThemeStyleCss;
export const WP_THEME_JSON = wpThemeJson;
export const WP_THEME_FUNCTIONS_PHP = wpThemeFunctionsPhp;
export const WP_THEME_HEADER_PHP = wpThemeHeaderPhp;
export const WP_THEME_FOOTER_PHP = wpThemeFooterPhp;
export const WP_THEME_FRONT_PAGE_PHP = wpThemeFrontPagePhp;
export const WP_THEME_INDEX_PHP = wpThemeIndexPhp;
export const WP_THEME_CANVAS_TEMPLATE_PHP = wpThemeCanvasTemplatePhp;
export const ELEMENTOR_TEMPLATE_JSON = wpElementorCanvasJson;

export const WP_THEME_FILES: Record<string, string> = {
  'style.css': wpThemeStyleCss,
  'theme.json': wpThemeJson,
  'functions.php': wpThemeFunctionsPhp,
  'header.php': wpThemeHeaderPhp,
  'footer.php': wpThemeFooterPhp,
  'front-page.php': wpThemeFrontPagePhp,
  'index.php': wpThemeIndexPhp,
  'page.php': wpThemePagePhp,
  'page-services.php': wpThemePageServicesPhp,
  'single.php': wpThemeSinglePhp,
  'archive.php': wpThemeArchivePhp,
  'archive-iramo_ai_tool.php': wpThemeArchiveAiToolPhp,
  'single-iramo_ai_tool.php': wpThemeSingleAiToolPhp,
  'archive-iramo_product.php': wpThemeArchiveProductPhp,
  'single-iramo_product.php': wpThemeSingleProductPhp,
  'single-product.php': wpThemeSingleWcProductPhp,
  'archive-iramo_course.php': wpThemeArchiveCoursePhp,
  'single-iramo_course.php': wpThemeSingleCoursePhp,
  'archive-iramo_article.php': wpThemeArchiveArticlePhp,
  'single-iramo_article.php': wpThemeSingleArticlePhp,
  '404.php': wpTheme404Php,
  'templates/template-canvas.php': wpThemeCanvasTemplatePhp,
  'assets/iramo-theme.js': wpThemeJs,
  'elementor-templates/iramo-canvas-template.json': wpElementorCanvasJson,
};

export const WP_PLUGIN_FILES: Record<string, string> = {
  'iramo-ai-suite.php': wpPluginCorePhp,
  'includes/seo-security.php': wpSeoSecurityPhp,
  'includes/admin-settings.php': wpAdminSettingsPhp,
  'includes/bot-bridge.php': wpBotBridgePhp,
  'includes/elementor-dynamic-tags.php': wpElementorDynamicTagsPhp,
  'includes/elementor-widgets.php': wpElementorWidgetsPhp,
  'includes/elementor-seeder.php': wpElementorSeederPhp,
};

export const GITHUB_ACTIONS_YML = `name: Build & Package WordPress Theme + Plugin ZIPs

on:
  push:
    branches: [ main, master ]
  workflow_dispatch:

permissions:
  contents: write

jobs:
  build-wordpress-packages:
    runs-on: ubuntu-latest
    env:
      FORCE_JAVASCRIPT_ACTIONS_TO_NODE24: true
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Setup Node.js 22
        uses: actions/setup-node@v4
        with:
          node-version: '22'

      - name: Install dependencies
        run: |
          if [ -f package-lock.json ]; then
            npm ci --legacy-peer-deps --no-audit --no-fund || npm install --legacy-peer-deps --no-audit --no-fund
          else
            npm install --legacy-peer-deps --no-audit --no-fund
          fi

      - name: Auto-activate uploaded custom fonts
        run: node scripts/generate-custom-font-css.mjs

      - name: TypeScript typecheck
        run: npm run lint

      - name: Build WordPress Assets Bundle
        run: npm run build:wp

      - name: Package Theme & Plugin ZIPs
        run: node scripts/package-wordpress.mjs

      - name: Upload Downloadable ZIP Artifacts
        uses: actions/upload-artifact@v4
        with:
          name: iramo-ai-wordpress-bundle
          path: release-wp/*.zip
          if-no-files-found: error
`;
