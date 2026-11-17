<?php
/**
 * Theme Header with Elementor Pro Theme Builder Compatibility & Responsive Floating Pill Nav
 */
if ( ! defined( 'ABSPATH' ) ) {
    exit;
}
$brand_name    = iramo_get_setting( 'brand_name', get_bloginfo( 'name' ) ?: 'iRamoAi' );
$default_theme = iramo_get_setting( 'default_theme', 'light' );
$logo_light    = iramo_get_theme_image( 'Group_179_659a031b.png' );
$logo_dark     = iramo_get_theme_image( 'logo_brand_19b8e3d7.png' );
$panel_url     = iramo_get_page_url( 'panel', '/panel/' );
$tools_url     = get_post_type_archive_link( 'iramo_ai_tool' ) ?: iramo_get_page_url( 'ai-tools', '/ai-tools/' );
$products_url  = get_post_type_archive_link( 'iramo_product' ) ?: iramo_get_page_url( 'products', '/products/' );
$academy_url   = get_post_type_archive_link( 'iramo_course' ) ?: iramo_get_page_url( 'academy', '/academy/' );
$articles_url  = get_post_type_archive_link( 'iramo_article' ) ?: iramo_get_page_url( 'articles', '/articles/' );
$services_url  = iramo_get_page_url( 'services', '/services/' );
?>
<!doctype html>
<html <?php language_attributes(); ?> dir="rtl">
<head>
    <meta charset="<?php bloginfo( 'charset' ); ?>" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="theme-color" content="#059669" />
    <script>
      (function(){
        try {
          var saved = localStorage.getItem('iramo_theme_mode');
          var mode = saved || '<?php echo esc_js( $default_theme ); ?>';
          if (mode === 'dark') { document.documentElement.classList.add('dark'); }
        } catch(e) {}
      })();
    </script>
    <?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
<?php wp_body_open(); ?>

<?php if ( ! function_exists( 'elementor_theme_do_location' ) || ! elementor_theme_do_location( 'header' ) ) : ?>
<header class="iramo-header-wrap" role="banner">
    <div class="iramo-header-pill">
        <a href="<?php echo esc_url( home_url( '/' ) ); ?>" class="iramo-logo-link">
            <img src="<?php echo esc_url( $logo_light ); ?>" alt="<?php echo esc_attr( $brand_name ); ?>" class="iramo-logo-img iramo-logo-light" />
            <img src="<?php echo esc_url( $logo_dark ); ?>" alt="<?php echo esc_attr( $brand_name ); ?>" class="iramo-logo-img iramo-logo-dark" />
            <span class="iramo-brand-text"><?php echo esc_html( $brand_name ); ?></span>
        </a>

        <nav aria-label="منوی اصلی سایت">
            <?php
            if ( has_nav_menu( 'primary' ) ) {
                wp_nav_menu( [
                    'theme_location' => 'primary',
                    'container'      => false,
                    'menu_class'     => 'iramo-nav-list',
                    'depth'          => 1,
                ] );
            } else {
                ?>
                <ul class="iramo-nav-list">
                    <li><a href="<?php echo esc_url( home_url( '/' ) ); ?>" class="<?php echo is_front_page() ? 'is-active' : ''; ?>">خانه</a></li>
                    <li><a href="<?php echo esc_url( $products_url ); ?>" class="<?php echo ( is_post_type_archive( 'iramo_product' ) || is_singular( [ 'iramo_product', 'product' ] ) ) ? 'is-active' : ''; ?>">محصولات</a></li>
                    <li><a href="<?php echo esc_url( $tools_url ); ?>" class="<?php echo ( is_post_type_archive( 'iramo_ai_tool' ) || is_singular( 'iramo_ai_tool' ) ) ? 'is-active' : ''; ?>">ابزارهای هوش مصنوعی</a></li>
                    <li><a href="<?php echo esc_url( $academy_url ); ?>" class="<?php echo ( is_post_type_archive( 'iramo_course' ) || is_singular( 'iramo_course' ) ) ? 'is-active' : ''; ?>">آکادمی</a></li>
                    <li><a href="<?php echo esc_url( $articles_url ); ?>" class="<?php echo ( is_post_type_archive( 'iramo_article' ) || is_singular( [ 'iramo_article', 'post' ] ) ) ? 'is-active' : ''; ?>">مقالات</a></li>
                    <li><a href="<?php echo esc_url( $services_url ); ?>" class="<?php echo is_page( 'services' ) ? 'is-active' : ''; ?>">خدمات و مشاوره</a></li>
                </ul>
                <?php
            }
            ?>
        </nav>

        <div class="iramo-header-actions">
            <button type="button" class="iramo-icon-btn" data-iramo-theme-toggle aria-label="تغییر تم روشن و تیره" title="تغییر تم">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32 1.41 1.41M2 12h2m16 0h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>
            </button>

            <a href="<?php echo esc_url( $panel_url ); ?>" class="iramo-panel-cta">
                <span class="label-full"><?php echo is_user_logged_in() ? 'پنل کاربری من' : 'ورود / پنل کاربری'; ?></span>
                <span class="label-short"><?php echo is_user_logged_in() ? 'پنل من' : 'ورود / پنل'; ?></span>
            </a>

            <button type="button" class="iramo-icon-btn iramo-menu-toggle" data-iramo-menu-toggle aria-label="منوی موبایل" aria-expanded="false">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
            </button>
        </div>
    </div>

    <div class="iramo-mobile-drawer" data-iramo-mobile-drawer>
        <?php
        if ( has_nav_menu( 'primary' ) ) {
            wp_nav_menu( [
                'theme_location' => 'primary',
                'container'      => false,
                'depth'          => 1,
            ] );
        } else {
            ?>
            <ul>
                <li><a href="<?php echo esc_url( home_url( '/' ) ); ?>">صفحه اصلی</a></li>
                <li><a href="<?php echo esc_url( $products_url ); ?>">محصولات نرم‌افزاری</a></li>
                <li><a href="<?php echo esc_url( $tools_url ); ?>">ابزارهای هوش مصنوعی</a></li>
                <li><a href="<?php echo esc_url( $academy_url ); ?>">آکادمی و دوره‌ها</a></li>
                <li><a href="<?php echo esc_url( $articles_url ); ?>">مقالات تخصصی</a></li>
                <li><a href="<?php echo esc_url( $services_url ); ?>">خدمات و مشاوره</a></li>
                <li><a href="<?php echo esc_url( $panel_url ); ?>">پنل کاربری و آموزش</a></li>
            </ul>
            <?php
        }
        ?>
    </div>
</header>
<?php endif; ?>
