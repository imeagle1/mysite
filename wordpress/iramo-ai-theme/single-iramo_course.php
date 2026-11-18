<?php
/**
 * Single Course Template (SSR Overview + Enrollment Link to Student Panel)
 */
if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

get_header();

if ( function_exists( 'elementor_theme_do_location' ) && elementor_theme_do_location( 'single' ) ) :
    get_footer();
    return;
endif;

while ( have_posts() ) :
    the_post();
    if ( function_exists( 'iramo_render_elementor_template' ) && iramo_render_elementor_template( 'iramo-tpl-single-course', '<main id="primary" class="iramo-main-wrap">', '</main>' ) ) :
        break;
    endif;
    $pid        = get_the_ID();
    $title      = get_the_title();
    $hours      = (int) ( get_post_meta( $pid, '_iramo_duration_hours', true ) ?: 12 );
    $price      = (int) ( get_post_meta( $pid, '_iramo_price_toman', true ) ?: 2900000 );
    $level      = trim( (string) get_post_meta( $pid, '_iramo_level', true ) );
    $instructor = trim( (string) get_post_meta( $pid, '_iramo_instructor', true ) );
    $thumb      = get_the_post_thumbnail_url( $pid, 'large' ) ?: iramo_get_theme_image( 'course_ai_mastery_1794737810266.jpg' );
    $services_url = iramo_get_page_url( 'services', '/services/' );
    $linked_prod  = (int) get_post_meta( $pid, '_iramo_linked_product_id', true );
    $enroll_url   = ( $linked_prod && function_exists( 'wc_get_checkout_url' ) )
        ? add_query_arg( 'add-to-cart', $linked_prod, wc_get_checkout_url() )
        : $services_url;
    ?>
    <main id="primary" class="iramo-main-wrap">
        <div class="iramo-container" style="display:grid;gap:24px;">
            <section class="iramo-card" style="padding:24px;">
                <div class="iramo-hero-grid">
                    <div>
                        <span class="iramo-badge">دوره آکادمی · <?php echo esc_html( iramo_fa_digits( $hours ) ); ?> ساعت آموزش<?php echo $level !== '' ? ' · ' . esc_html( $level ) : ''; ?></span>
                        <h1 style="margin:12px 0 10px;font-size:27px;font-weight:900;"><?php echo esc_html( $title ); ?></h1>
                        <?php if ( $instructor !== '' ) : ?>
                            <p style="margin:0 0 8px;font-size:13px;font-weight:700;color:var(--iramo-primary);">مدرس دوره: <?php echo esc_html( $instructor ); ?></p>
                        <?php endif; ?>
                        <p style="margin:0 0 18px;font-size:15px;color:var(--iramo-muted);"><?php echo esc_html( get_the_excerpt() ); ?></p>
                        <div style="display:flex;flex-wrap:wrap;gap:10px;">
                            <a href="<?php echo esc_url( $enroll_url ); ?>" class="iramo-price-btn iramo-price-btn-green" style="padding:12px 22px;font-size:14px;">
                                <span class="price-label">ثبت‌نام در دوره · <?php echo esc_html( iramo_format_toman( $price ) ); ?></span>
                                <span>←</span>
                            </a>
                        </div>
                    </div>
                    <div class="iramo-hero-media">
                        <img src="<?php echo esc_url( $thumb ); ?>" alt="<?php echo esc_attr( $title ); ?>" />
                    </div>
                </div>
            </section>

            <section class="iramo-card" style="padding:24px;">
                <h2 style="margin:0 0 12px;font-size:20px;font-weight:800;">سرفصل‌ها و توضیحات دوره</h2>
                <div style="font-size:14.5px;line-height:1.95;color:var(--iramo-muted);">
                    <?php the_content(); ?>
                </div>
            </section>
        </div>
    </main>
    <?php
endwhile;

get_footer();
