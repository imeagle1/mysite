<?php
/**
 * Theme Footer with Elementor Pro Footer Override & Mobile 2-Col Navigation Grid
 */
if ( ! defined( 'ABSPATH' ) ) {
    exit;
}
$brand_name   = iramo_get_setting( 'brand_name', 'iRamoAi' );
$footer_about = iramo_get_setting( 'footer_about', 'پلتفرم تخصصی طراحی نرم‌افزارهای هوشمند، آکادمی آموزش کاربردی AI و مرجع معرفی برترین ابزارهای هوش مصنوعی جهان.' );
$copyright    = iramo_get_setting( 'copyright', '© تمامی حقوق برای پلتفرم هوشمند iRamoAi محفوظ است.' );
$logo_light   = iramo_get_theme_image( 'Group_179_659a031b.png' );
$logo_dark    = iramo_get_theme_image( 'logo_brand_19b8e3d7.png' );

$tg_url = get_theme_mod( 'iramo_social_telegram', 'https://t.me/iRamoBot' );
$bale_url = get_theme_mod( 'iramo_social_bale', 'https://ble.ir/iRamoBaleBot' );
$ig_url = get_theme_mod( 'iramo_social_instagram', 'https://instagram.com' );
$gh_url = get_theme_mod( 'iramo_social_github', 'https://github.com' );

$tools_url    = get_post_type_archive_link( 'iramo_ai_tool' ) ?: iramo_get_page_url( 'ai-tools', '/ai-tools/' );
$products_url = get_post_type_archive_link( 'iramo_product' ) ?: iramo_get_page_url( 'products', '/products/' );
$academy_url  = get_post_type_archive_link( 'iramo_course' ) ?: iramo_get_page_url( 'academy', '/academy/' );
$articles_url = get_post_type_archive_link( 'iramo_article' ) ?: iramo_get_page_url( 'articles', '/articles/' );
$services_url = iramo_get_page_url( 'services', '/services/' );
$panel_url    = iramo_get_page_url( 'panel', '/panel/' );
?>

<?php
$has_el_footer = ( function_exists( 'elementor_theme_do_location' ) && elementor_theme_do_location( 'footer' ) )
    || ( function_exists( 'iramo_render_elementor_template' ) && iramo_render_elementor_template( 'iramo-tpl-footer' ) );
if ( ! $has_el_footer ) :
?>
<footer class="iramo-footer" role="contentinfo">
    <div class="iramo-container">
        <div class="iramo-footer-grid">
            <!-- Brand + Social -->
            <div>
                <a href="<?php echo esc_url( home_url( '/' ) ); ?>" class="iramo-logo-link">
                    <img src="<?php echo esc_url( $logo_light ); ?>" alt="<?php echo esc_attr( $brand_name ); ?>" class="iramo-logo-img iramo-logo-light" />
                    <img src="<?php echo esc_url( $logo_dark ); ?>" alt="<?php echo esc_attr( $brand_name ); ?>" class="iramo-logo-img iramo-logo-dark" />
                    <span class="iramo-brand-text"><?php echo esc_html( $brand_name ); ?></span>
                </a>
                <p class="iramo-footer-about-text" style="margin:12px 0 0;font-size:13px;color:var(--iramo-muted);line-height:1.85;max-width:380px;">
                    <?php echo esc_html( $footer_about ); ?>
                </p>
                <div class="iramo-social-row">
                    <?php if ( $tg_url ) : ?>
                        <a href="<?php echo esc_url( $tg_url ); ?>" target="_blank" rel="noopener noreferrer" class="iramo-social-btn" aria-label="Telegram" title="ربات تلگرام">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
                        </a>
                    <?php endif; ?>
                    <?php if ( $bale_url ) : ?>
                        <a href="<?php echo esc_url( $bale_url ); ?>" target="_blank" rel="noopener noreferrer" class="iramo-social-btn" aria-label="Bale" title="ربات بله">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
                        </a>
                    <?php endif; ?>
                    <?php if ( $ig_url ) : ?>
                        <a href="<?php echo esc_url( $ig_url ); ?>" target="_blank" rel="noopener noreferrer" class="iramo-social-btn" aria-label="Instagram" title="اینستاگرام">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="20" height="20" x="2" y="2" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
                        </a>
                    <?php endif; ?>
                    <?php if ( $gh_url ) : ?>
                        <a href="<?php echo esc_url( $gh_url ); ?>" target="_blank" rel="noopener noreferrer" class="iramo-social-btn" aria-label="GitHub" title="گیت‌هاب">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
                        </a>
                    <?php endif; ?>
                </div>
            </div>

            <!-- Two Compact Nav Columns (2-col on mobile + desktop) -->
            <div class="iramo-footer-nav-grid">
                <div>
                    <h4 style="margin:0;font-size:14px;font-weight:800;">بخش‌های سایت</h4>
                    <ul class="iramo-footer-links">
                        <li><a href="<?php echo esc_url( home_url( '/' ) ); ?>">صفحه اصلی</a></li>
                        <li><a href="<?php echo esc_url( $products_url ); ?>">محصولات نرم‌افزاری</a></li>
                        <li><a href="<?php echo esc_url( $tools_url ); ?>">دایرکتوری ابزارهای AI</a></li>
                        <li><a href="<?php echo esc_url( $academy_url ); ?>">آکادمی و دوره‌ها</a></li>
                    </ul>
                </div>
                <div>
                    <h4 style="margin:0;font-size:14px;font-weight:800;">امکانات و پلتفرم</h4>
                    <ul class="iramo-footer-links">
                        <li><a href="<?php echo esc_url( $articles_url ); ?>">مقالات و ابزارک‌ها</a></li>
                        <li><a href="<?php echo esc_url( $services_url ); ?>">خدمات و مشاوره</a></li>
                        <li><a href="<?php echo esc_url( $panel_url ); ?>">پنل کاربری و آموزش</a></li>
                        <li><a href="<?php echo esc_url( $tools_url . '?pricing=Free' ); ?>">ابزارهای رایگان AI</a></li>
                    </ul>
                </div>
            </div>

            <!-- Newsletter Bot Form -->
            <div>
                <h4 style="margin:0;font-size:14px;font-weight:800;">خبرنامه هوشمند تلگرام و بله</h4>
                <p style="margin:8px 0 0;font-size:12.5px;color:var(--iramo-muted);line-height:1.7;">
                    آیدی تلگرام یا شماره موبایل بله خود را وارد کنید تا معرفی ابزارهای جدید AI برایتان ارسال شود.
                </p>
                <form class="iramo-newsletter-form" data-iramo-newsletter>
                    <input type="text" name="handle" class="iramo-input" placeholder="@username یا 0912..." required />
                    <button type="submit" class="iramo-btn iramo-btn-accent" style="padding:10px 16px;font-size:13px;white-space:nowrap;">عضویت</button>
                </form>
                <div data-iramo-newsletter-msg style="font-size:12px;margin-top:8px;color:var(--iramo-primary);font-weight:700;"></div>
            </div>
        </div>

        <div class="iramo-footer-bottom">
            <div><?php echo esc_html( $copyright ); ?></div>
            <div style="display:flex;align-items:center;gap:12px;">
                <button type="button" class="iramo-chip" data-iramo-theme-toggle>تغییر حالت روشن / تیره</button>
            </div>
        </div>
    </div>
</footer>
<?php endif; ?>

<?php wp_footer(); ?>
</body>
</html>
