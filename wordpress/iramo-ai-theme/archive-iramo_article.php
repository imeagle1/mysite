<?php
/**
 * Articles Archive Template (SSR Blog/Articles + Daily Quick Tip Widget + Newsletter Bot Widget)
 */
if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

get_header();

if ( function_exists( 'elementor_theme_do_location' ) && elementor_theme_do_location( 'archive' ) ) :
    get_footer();
    return;
endif;

$opts = get_option( 'iramo_ai_settings', [] );
$tips = array_values( array_filter( array_map( 'trim', explode( "\n", (string) ( $opts['quick_tips_text'] ?? '' ) ) ) ) );
if ( empty( $tips ) ) {
    $tips = [ 'برای گرفتن دقیق‌ترین خروجی از مدل‌های AI، همیشه فرمت خروجی و نقش مخاطب را در ابتدای پرامپت بنویسید.' ];
}

$articles_q = new WP_Query( [
    'post_type'      => [ 'iramo_article', 'post' ],
    'post_status'    => 'publish',
    'posts_per_page' => 24,
] );
?>
<main id="primary" class="iramo-main-wrap">
    <div class="iramo-container">
        <div class="iramo-card" style="padding:24px;margin-bottom:24px;">
            <span class="iramo-badge">مقالات و ابزارک‌های کاربردی</span>
            <h1 style="margin:10px 0 6px;font-size:26px;font-weight:900;">مقالات تخصصی هوش مصنوعی و اتوماسیون</h1>
            <p style="margin:0;font-size:14px;color:var(--iramo-muted);">آخرین راهنماهای عملی، نکات سریع روز و خبرنامه هوشمند تلگرام و بله.</p>
        </div>

        <div class="iramo-tools-layout">
            <div>
                <?php if ( $articles_q->have_posts() ) : ?>
                    <div class="iramo-grid-2">
                        <?php
                        while ( $articles_q->have_posts() ) :
                            $articles_q->the_post();
                            iramo_render_article_card( get_the_ID() );
                        endwhile;
                        wp_reset_postdata();
                        ?>
                    </div>
                <?php else : ?>
                    <div class="iramo-card" style="padding:36px;text-align:center;">
                        <h2 style="margin:0 0 8px;">هنوز مقاله‌ای منتشر نشده است</h2>
                        <p style="margin:0;color:var(--iramo-muted);">از پیشخوان وردپرس ← نوشته‌ها یا مقالات تخصصی iRamo اولین مقاله خود را منتشر کنید.</p>
                    </div>
                <?php endif; ?>
            </div>

            <aside style="display:grid;gap:16px;">
                <div class="iramo-card" style="padding:20px;">
                    <span class="iramo-badge">نکته سریع روز</span>
                    <p style="margin:12px 0 0;font-size:13.5px;line-height:1.85;color:var(--iramo-ink);"><?php echo esc_html( $tips[0] ); ?></p>
                </div>
                <div class="iramo-card" style="padding:20px;">
                    <h3 style="margin:0 0 8px;font-size:15px;font-weight:800;">عضویت سریع در خبرنامه ربات</h3>
                    <form class="iramo-newsletter-form" data-iramo-newsletter style="flex-direction:column;">
                        <input type="text" name="handle" class="iramo-input" placeholder="@username یا 0912..." required />
                        <button type="submit" class="iramo-btn iramo-btn-accent" style="width:100%;">دریافت مقالات جدید در تلگرام/بله</button>
                    </form>
                    <div data-iramo-newsletter-msg style="font-size:12px;margin-top:8px;color:var(--iramo-primary);font-weight:700;"></div>
                </div>
            </aside>
        </div>
    </div>
</main>
<?php
get_footer();
