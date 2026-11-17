<?php
/**
 * Courses Archive Template (SSR Academy Catalog + Elementor Pro Archive Override)
 */
if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

get_header();

if ( function_exists( 'elementor_theme_do_location' ) && elementor_theme_do_location( 'archive' ) ) :
    get_footer();
    return;
endif;

if ( function_exists( 'iramo_render_elementor_template' ) && iramo_render_elementor_template( 'iramo-tpl-archive-courses', '<main id="primary" class="iramo-main-wrap">', '</main>' ) ) :
    get_footer();
    return;
endif;

$courses_q = new WP_Query( [
    'post_type'      => 'iramo_course',
    'post_status'    => 'publish',
    'posts_per_page' => 24,
] );
?>
<main id="primary" class="iramo-main-wrap">
    <div class="iramo-container">
        <div class="iramo-card" style="padding:24px;margin-bottom:24px;display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:14px;">
            <div>
                <span class="iramo-badge">آکادمی تخصصی iRamoAi</span>
                <h1 style="margin:10px 0 6px;font-size:26px;font-weight:900;">دوره‌های آموزشی هوش مصنوعی و اتوماسیون</h1>
                <p style="margin:0;font-size:14px;color:var(--iramo-muted);">آموزش پروژه‌محور ساخت ربات، پرامپت‌نویسی و اتوماسیون کسب‌وکار همراه با پنل دانشجویی اختصاصی.</p>
            </div>
            <a href="<?php echo esc_url( iramo_get_page_url( 'panel', '/panel/' ) ); ?>" class="iramo-btn iramo-btn-primary">ورود به پنل دانشجو ←</a>
        </div>

        <?php if ( $courses_q->have_posts() ) : ?>
            <div class="iramo-grid-3">
                <?php
                while ( $courses_q->have_posts() ) :
                    $courses_q->the_post();
                    iramo_render_course_card( get_the_ID() );
                endwhile;
                wp_reset_postdata();
                ?>
            </div>
        <?php else : ?>
            <div class="iramo-card" style="padding:36px;text-align:center;">
                <h2 style="margin:0 0 8px;">دوره‌ای هنوز منتشر نشده است</h2>
                <p style="margin:0;color:var(--iramo-muted);">از پیشخوان وردپرس ← دوره‌های آموزشی iRamo ← افزودن دوره جدید، اولین دوره خود را ثبت کنید.</p>
            </div>
        <?php endif; ?>
    </div>
</main>
<?php
get_footer();
