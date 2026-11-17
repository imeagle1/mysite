<?php
/**
 * Single Article / Post Template (SSR Full Article Reader + Elementor Pro Single Override)
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
    if ( function_exists( 'iramo_render_elementor_template' ) && iramo_render_elementor_template( 'iramo-tpl-single-article', '<main id="primary" class="iramo-main-wrap">', '</main>' ) ) :
        break;
    endif;
    $thumb = get_the_post_thumbnail_url( get_the_ID(), 'large' );
    ?>
    <main id="primary" class="iramo-main-wrap">
        <div class="iramo-container" style="max-width:920px;">
            <article class="iramo-card" style="padding:26px;">
                <div style="display:flex;flex-wrap:wrap;gap:10px;font-size:12.5px;color:var(--iramo-muted);margin-bottom:12px;">
                    <span><?php echo esc_html( iramo_fa_digits( get_the_date( 'j F Y' ) ) ); ?></span>
                    <span>•</span>
                    <span>نویسنده: <?php echo esc_html( get_the_author() ); ?></span>
                </div>
                <h1 style="margin:0 0 18px;font-size:28px;font-weight:900;line-height:1.35;"><?php the_title(); ?></h1>
                <?php if ( $thumb ) : ?>
                    <div style="border-radius:18px;overflow:hidden;margin-bottom:22px;aspect-ratio:16/9;">
                        <img src="<?php echo esc_url( $thumb ); ?>" alt="<?php the_title_attribute(); ?>" style="width:100%;height:100%;object-fit:cover;" />
                    </div>
                <?php endif; ?>
                <div style="font-size:15.5px;line-height:2;color:var(--iramo-ink);">
                    <?php the_content(); ?>
                </div>
            </article>
        </div>
    </main>
    <?php
endwhile;

get_footer();
