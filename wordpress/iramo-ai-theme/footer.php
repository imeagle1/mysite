<?php
/**
 * Theme Footer with Elementor Pro Footer Override & Mobile 2-Col Centered Nav Grid
 */
if ( ! defined( 'ABSPATH' ) ) {
    exit;
}
$brand_name   = iramo_get_setting( 'brand_name', 'iRamoAi' );
$footer_about = iramo_get_setting( 'footer_about', 'پلتفرم یکپارچه ارائه محصولات نرم‌افزاری هوشمند، دوره‌های تخصصی کاربردی، دایرکتوری انتخاب ابزارهای AI و زیرساخت بومی اتصال به تلگرام، بله و وردپرس.' );
$copyright    = iramo_get_setting( 'copyright', '© ۲۰۲۵ iRamoAi — طراحی و مهندسی پلتفرم هوشمند' );
$logo_light   = iramo_get_theme_image( 'Group_179_659a031b.png' );
$logo_dark    = iramo_get_theme_image( 'logo_brand_19b8e3d7.png' );

$tg_url   = get_theme_mod( 'iramo_social_telegram', 'https://t.me/iRamoBot' );
$bale_url = get_theme_mod( 'iramo_social_bale', 'https://ble.ir/iRamoBaleBot' );
$ig_url   = get_theme_mod( 'iramo_social_instagram', 'https://instagram.com' );
$yt_url   = get_theme_mod( 'iramo_social_youtube', 'https://youtube.com' );
$gh_url   = get_theme_mod( 'iramo_social_github', 'https://github.com' );
$li_url   = get_theme_mod( 'iramo_social_linkedin', 'https://linkedin.com' );

$tools_url    = get_post_type_archive_link( 'iramo_ai_tool' ) ?: iramo_get_page_url( 'ai-tools', '/ai-tools/' );
$products_url = get_post_type_archive_link( 'iramo_product' ) ?: iramo_get_page_url( 'products', '/products/' );
$academy_url  = get_post_type_archive_link( 'iramo_course' ) ?: iramo_get_page_url( 'academy', '/academy/' );
$articles_url = iramo_get_page_url( 'articles', '/articles/' );
$services_url = iramo_get_page_url( 'services', '/services/' );
$has_woo_acct = function_exists( 'iramo_has_woocommerce_account' ) && iramo_has_woocommerce_account();
$account_url  = function_exists( 'iramo_get_account_url' ) ? iramo_get_account_url() : $services_url;
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
                    <span class="iramo-footer-logo-box">
                        <img src="<?php echo esc_url( $logo_light ); ?>" alt="<?php echo esc_attr( $brand_name ); ?>" class="iramo-logo-img iramo-logo-light" />
                        <img src="<?php echo esc_url( $logo_dark ); ?>" alt="<?php echo esc_attr( $brand_name ); ?>" class="iramo-logo-img iramo-logo-dark" />
                    </span>
                    <span>
                        <span class="iramo-brand-text" style="display:block;font-size:19px;"><?php echo function_exists( 'iramo_brand_wordmark_html' ) ? iramo_brand_wordmark_html( $brand_name ) : esc_html( $brand_name ); ?></span>
                        <span class="iramo-footer-tagline" style="display:block;margin:2px 0 0;">آکادمی هوش مصنوعی، ربات‌سازی و مهندسی نرم‌افزار</span>
                    </span>
                </a>
                <p class="iramo-footer-about-text" style="margin:12px 0 0;font-size:13px;color:var(--iramo-muted);line-height:1.85;max-width:400px;">
                    <?php echo esc_html( $footer_about ); ?>
                </p>
                <p class="iramo-social-caption">ما را در شبکه‌های اجتماعی دنبال کنید</p>
                <div class="iramo-social-row">
                    <?php if ( $tg_url ) : ?>
                        <a href="<?php echo esc_url( $tg_url ); ?>" target="_blank" rel="noopener noreferrer" class="iramo-social-btn" aria-label="Telegram" title="تلگرام">
                            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><path d="M21.5 3.5 2.8 10.7c-.9.3-.8 1.6.1 1.9l4.7 1.5 1.8 5.5c.3.8 1.3 1 1.9.4l2.7-2.7 4.9 3.6c.7.5 1.7.1 1.9-.8l2.7-15.2c.2-.9-.7-1.6-1.5-1.3Z"/><path d="m8 14 9.5-7"/></svg>
                        </a>
                    <?php endif; ?>
                    <?php if ( $bale_url ) : ?>
                        <a href="<?php echo esc_url( $bale_url ); ?>" target="_blank" rel="noopener noreferrer" class="iramo-social-btn" aria-label="Bale" title="پیام‌رسان بله">
                            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5Z"/><path d="m9.5 12 1.8 1.8 3.5-3.6"/></svg>
                        </a>
                    <?php endif; ?>
                    <?php if ( $ig_url ) : ?>
                        <a href="<?php echo esc_url( $ig_url ); ?>" target="_blank" rel="noopener noreferrer" class="iramo-social-btn" aria-label="Instagram" title="اینستاگرام">
                            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><rect width="18" height="18" x="3" y="3" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".8" fill="currentColor"/></svg>
                        </a>
                    <?php endif; ?>
                    <?php if ( $yt_url ) : ?>
                        <a href="<?php echo esc_url( $yt_url ); ?>" target="_blank" rel="noopener noreferrer" class="iramo-social-btn" aria-label="YouTube" title="یوتیوب">
                            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/><path d="m10 15 5-3-5-3v6Z" fill="currentColor" stroke="none"/></svg>
                        </a>
                    <?php endif; ?>
                    <?php if ( $gh_url ) : ?>
                        <a href="<?php echo esc_url( $gh_url ); ?>" target="_blank" rel="noopener noreferrer" class="iramo-social-btn" aria-label="GitHub" title="گیت‌هاب">
                            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
                        </a>
                    <?php endif; ?>
                    <?php if ( $li_url ) : ?>
                        <a href="<?php echo esc_url( $li_url ); ?>" target="_blank" rel="noopener noreferrer" class="iramo-social-btn" aria-label="LinkedIn" title="لینکدین">
                            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
                        </a>
                    <?php endif; ?>
                </div>
            </div>

            <!-- Two Compact Nav Columns (2-col centered on mobile, start-aligned on desktop) -->
            <div class="iramo-footer-nav-grid">
                <div>
                    <h4 style="margin:0;font-size:13px;font-weight:800;">بخش‌های سایت</h4>
                    <ul class="iramo-footer-links">
                        <li><a href="<?php echo esc_url( home_url( '/' ) ); ?>">صفحه اصلی</a></li>
                        <li><a href="<?php echo esc_url( $products_url ); ?>">محصولات</a></li>
                        <li><a href="<?php echo esc_url( $academy_url ); ?>">دوره‌های آموزشی</a></li>
                        <li><a href="<?php echo esc_url( $tools_url ); ?>">ابزارهای هوش مصنوعی</a></li>
                        <li><a href="<?php echo esc_url( $articles_url ); ?>">مقالات</a></li>
                        <li><a href="<?php echo esc_url( $services_url ); ?>">خدمات و مشاوره</a></li>
                    </ul>
                </div>
                <div>
                    <h4 style="margin:0;font-size:13px;font-weight:800;">امکانات و پلتفرم</h4>
                    <ul class="iramo-footer-links">
                        <li><a href="<?php echo esc_url( $products_url ); ?>">نرم‌افزار حسابیار</a></li>
                        <li><a href="<?php echo esc_url( $tools_url ); ?>">دایرکتوری ابزارهای AI</a></li>
                        <li><a href="<?php echo esc_url( $services_url ); ?>">پلاگین وردپرس و المنتور</a></li>
                        <li><a href="<?php echo esc_url( $account_url ); ?>"><?php echo $has_woo_acct ? 'حساب کاربری و سفارش‌ها' : 'مشاوره و ثبت سفارش'; ?></a></li>
                    </ul>
                </div>
            </div>

            <!-- Newsletter Bento Card -->
            <div class="iramo-newsletter-card">
                <h4 style="margin:0;font-size:13px;font-weight:800;">✨ خبرنامه هفتگی ابزارها و آموزش‌های AI</h4>
                <p style="margin:6px 0 0;font-size:11.5px;color:var(--iramo-muted);line-height:1.75;">
                    معرفی جدیدترین ابزارهای هوش مصنوعی، پرامپت‌های کاربردی و آپدیت محصولات را در ایمیل دریافت کنید.
                </p>
                <form class="iramo-newsletter-form" data-iramo-newsletter>
                    <div class="iramo-newsletter-input-wrap">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                        <input type="text" dir="ltr" name="handle" class="iramo-input" placeholder="you@domain.com" required />
                    </div>
                    <button type="submit" class="iramo-btn iramo-btn-accent" style="padding:9px 16px;font-size:12.5px;white-space:nowrap;border-radius:12px;">عضویت</button>
                </form>
                <div data-iramo-newsletter-msg style="font-size:12px;margin-top:8px;color:var(--iramo-primary);font-weight:700;"></div>
                <div class="iramo-newsletter-trust">
                    <span>✓ تضمین آپدیت و پشتیبانی فنی</span>
                    <a href="<?php echo esc_url( $services_url ); ?>" style="color:var(--iramo-primary);font-weight:700;">مشاوره پروژه ←</a>
                </div>
            </div>
        </div>

        <div class="iramo-footer-bottom">
            <div><?php echo esc_html( $copyright ); ?></div>
            <div style="display:flex;align-items:center;gap:12px;">
                <button type="button" class="iramo-chip" data-iramo-theme-toggle>نمای تیره / روشن سایت</button>
            </div>
        </div>
    </div>
</footer>
<?php endif; ?>

<?php wp_footer(); ?>
</body>
</html>
