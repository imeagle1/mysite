<?php
/**
 * Generic Page Template — Supports Elementor & Standard Gutenberg Content
 */
if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

get_header();

$is_el = false;
if ( class_exists( '\\Elementor\\Plugin' ) ) {
    $doc = \Elementor\Plugin::$instance->documents->get( get_the_ID() );
    if ( $doc && $doc->is_built_with_elementor() ) {
        $is_el = true;
    }
}
?>
<main id="primary" class="iramo-main-wrap">
    <?php
    while ( have_posts() ) :
        the_post();
        if ( $is_el ) :
            the_content();
        else :
            ?>
            <div class="iramo-container" style="max-width:1080px;">
                <article class="iramo-card" style="padding:26px;">
                    <h1 style="margin:0 0 16px;font-size:26px;font-weight:900;"><?php the_title(); ?></h1>
                    <div style="font-size:15px;line-height:1.95;color:var(--iramo-ink);">
                        <?php the_content(); ?>
                    </div>
                </article>
            </div>
            <?php
        endif;
    endwhile;
    ?>
</main>
<?php
get_footer();
