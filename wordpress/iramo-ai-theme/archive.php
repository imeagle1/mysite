<?php
/**
 * Standard Archive & Blog Posts Template (SSR + Elementor Pro Archive Override)
 */
if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

get_header();

if ( function_exists( 'elementor_theme_do_location' ) && elementor_theme_do_location( 'archive' ) ) :
    get_footer();
    return;
endif;

if ( function_exists( 'iramo_render_elementor_template' ) && iramo_render_elementor_template( 'iramo-tpl-archive-articles', '<main id="primary" class="iramo-main-wrap">', '</main>' ) ) :
    get_footer();
    return;
endif;

$articles_q = new WP_Query( [
    'post_type'      => 'post',
    'post_status'    => 'publish',
    'posts_per_page' => 24,
] );
?>
<main id="primary" class="iramo-main-wrap">
    <div class="iramo-container">
        <div class="iramo-card" style="padding:24px;margin-bottom:24px;">
            <span class="iramo-badge">مقالات و راهنماهای کاربردی</span>
            <h1 style="margin:10px 0 6px;font-size:26px;font-weight:900;"><?php echo is_category() || is_tag() ? esc_html( single_term_title( '', false ) ) : 'مقالات تخصصی هوش مصنوعی و اتوماسیون'; ?></h1>
            <p style="margin:0;font-size:14px;color:var(--iramo-muted);">آخرین راهنماهای عملی، آموزش‌ها و خبرنامه هفتگی ابزارهای AI.</p>
        </div>

        <div class="iramo-tools-layout">
            <div>
                <?php if ( have_posts() && ! is_home() ) : ?>
                    <div class="iramo-grid-2">
                        <?php
                        while ( have_posts() ) :
                            the_post();
                            iramo_render_article_card( get_the_ID() );
                        endwhile;
                        ?>
                    </div>
                <?php elseif ( $articles_q->have_posts() ) : ?>
                    <div class="iramo-grid-2">
                        <?php
                        while ( $articles_q->have_posts() ) :
                            $articles_q->the_post();
                            $pid = get_the_ID();
                            if ( get_post_field( 'post_name', $pid ) === 'hello-world' && $articles_q->found_posts > 1 ) {
                                continue;
                            }
                            iramo_render_article_card( $pid );
                        endwhile;
                        wp_reset_postdata();
                        ?>
                    </div>
                <?php else : ?>
                    <div class="iramo-card" style="padding:36px;text-align:center;">
                        <h2 style="margin:0 0 8px;">هنوز مقاله‌ای منتشر نشده است</h2>
                        <p style="margin:0;color:var(--iramo-muted);">از پیشخوان وردپرس ← نوشته‌ها ← افزودن نوشته اولین مقاله خود را منتشر کنید.</p>
                    </div>
                <?php endif; ?>
            </div>

            <aside style="display:grid;gap:16px;">
                <div class="iramo-card" style="padding:20px;">
                    <span class="iramo-badge">نکته سریع روز</span>
                    <p style="margin:12px 0 0;font-size:13.5px;line-height:1.85;color:var(--iramo-ink);">برای گرفتن دقیق‌ترین خروجی از مدل‌های AI، همیشه فرمت خروجی و نقش مخاطب را در ابتدای پرامپت بنویسید.</p>
                </div>
                <div class="iramo-card" style="padding:20px;">
                    <h3 style="margin:0 0 8px;font-size:15px;font-weight:800;">خبرنامه هفتگی ابزارهای AI</h3>
                    <form class="iramo-newsletter-form" data-iramo-newsletter style="flex-direction:column;">
                        <div class="iramo-newsletter-input-wrap">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                            <input type="text" dir="ltr" name="handle" class="iramo-input" placeholder="you@domain.com" required />
                        </div>
                        <button type="submit" class="iramo-btn iramo-btn-accent" style="width:100%;">عضویت در خبرنامه</button>
                    </form>
                    <div data-iramo-newsletter-msg style="font-size:12px;margin-top:8px;color:var(--iramo-primary);font-weight:700;"></div>
                </div>
            </aside>
        </div>
    </div>
</main>
<?php
get_footer();
