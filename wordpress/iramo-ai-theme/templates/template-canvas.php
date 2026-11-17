<?php
/**
 * Template Name: iRamo Fullscreen App Canvas
 * Template Post Type: page
 */
if ( ! defined( 'ABSPATH' ) ) {
    exit;
}
get_header();
?>
<main id="primary" class="iramo-canvas-wrapper" style="padding-top:76px;">
    <?php
    while ( have_posts() ) :
        the_post();
        the_content();
    endwhile;
    ?>
</main>
<?php
get_footer();
