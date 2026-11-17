<?php
/**
 * 404 Not Found Template with Elementor Pro Single 404 Override
 */
if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

get_header();

if ( function_exists( 'elementor_theme_do_location' ) && elementor_theme_do_location( 'single' ) ) :
    get_footer();
    return;
endif;

if ( function_exists( 'iramo_render_elementor_template' ) && iramo_render_elementor_template( 'iramo-tpl-404', '<main id="primary" class="iramo-main-wrap">', '</main>' ) ) :
    get_footer();
    return;
endif;

$tools_url    = get_post_type_archive_link( 'iramo_ai_tool' ) ?: iramo_get_page_url( 'ai-tools', '/ai-tools/' );
$products_url = get_post_type_archive_link( 'iramo_product' ) ?: iramo_get_page_url( 'products', '/products/' );
?>
<main id="primary" class="iramo-main-wrap">
    <div class="iramo-container" style="max-width:720px;padding-top:32px;">
        <div class="iramo-card" style="padding:36px 24px;text-align:center;">
            <span class="iramo-badge">خطای <?php echo esc_html( iramo_fa_digits( '404' ) ); ?></span>
            <h1 style="margin:14px 0 8px;font-size:28px;font-weight:900;">صفحه مورد نظر پیدا نشد</h1>
            <p style="margin:0 0 22px;font-size:14.5px;color:var(--iramo-muted);">
                ممکن است آدرس تغییر کرده باشد یا این صفحه حذف شده باشد. از دکمه‌های زیر می‌توانید مستقیماً به بخش‌های اصلی سایت برگردید.
            </p>
            <div style="display:flex;flex-wrap:wrap;justify-content:center;gap:10px;">
                <a href="<?php echo esc_url( home_url( '/' ) ); ?>" class="iramo-btn iramo-btn-accent">بازگشت به صفحه اصلی</a>
                <a href="<?php echo esc_url( $products_url ); ?>" class="iramo-btn iramo-btn-outline">مشاهده محصولات</a>
                <a href="<?php echo esc_url( $tools_url ); ?>" class="iramo-btn iramo-btn-outline">دایرکتوری ابزارهای AI</a>
            </div>
        </div>
    </div>
</main>
<?php
get_footer();
