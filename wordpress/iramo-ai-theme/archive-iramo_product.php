<?php
/**
 * Products Archive (WooCommerce + iramo_product Unified Showcase)
 */
if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

get_header();

if ( function_exists( 'elementor_theme_do_location' ) && elementor_theme_do_location( 'archive' ) ) :
    get_footer();
    return;
endif;

if ( function_exists( 'iramo_render_elementor_template' ) && iramo_render_elementor_template( 'iramo-tpl-archive-products', '<main id="primary" class="iramo-main-wrap">', '</main>' ) ) :
    get_footer();
    return;
endif;

$products_q = new WP_Query( [
    'post_type'      => [ 'iramo_product', 'product' ],
    'post_status'    => 'publish',
    'posts_per_page' => 24,
] );
?>
<main id="primary" class="iramo-main-wrap">
    <div class="iramo-container">
        <div class="iramo-card" style="padding:24px;margin-bottom:24px;">
            <span class="iramo-badge">محصولات نرم‌افزاری و اتوماسیون</span>
            <h1 style="margin:10px 0 6px;font-size:26px;font-weight:900;">محصولات نرم‌افزاری اختصاصی iRamoAi</h1>
            <p style="margin:0;font-size:14px;color:var(--iramo-muted);">
                نرم‌افزارهای آماده کسب‌وکار با اتصال بومی به ووکامرس، صدور خودکار لایسنس و لندینگ ۶ بخشی اختصاصی.
            </p>
        </div>

        <?php if ( $products_q->have_posts() ) : ?>
            <div class="iramo-grid-2">
                <?php
                while ( $products_q->have_posts() ) :
                    $products_q->the_post();
                    iramo_render_product_card( get_the_ID() );
                endwhile;
                wp_reset_postdata();
                ?>
            </div>
        <?php else : ?>
            <div class="iramo-card" style="padding:36px;text-align:center;">
                <h2 style="margin:0 0 8px;">هنوز محصولی منتشر نشده است</h2>
                <p style="margin:0;color:var(--iramo-muted);">از پیشخوان وردپرس ← محصولات نرم‌افزاری یا ووکامرس ← افزودن محصول جدید، اولین محصول خود را منتشر کنید.</p>
            </div>
        <?php endif; ?>
    </div>
</main>
<?php
get_footer();
