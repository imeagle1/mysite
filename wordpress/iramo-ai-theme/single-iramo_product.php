<?php
/**
 * Single Product 6-Section Auto-Inherited Landing Page + Interactive JS Sandbox & WooCommerce Checkout
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
    if ( function_exists( 'iramo_render_elementor_template' ) && iramo_render_elementor_template( 'iramo-tpl-single-product', '<main id="primary" class="iramo-main-wrap">', '</main>' ) ) :
        break;
    endif;
    $pid           = get_the_ID();
    $title         = get_the_title();
    $tagline       = get_post_meta( $pid, '_iramo_tagline', true ) ?: get_the_excerpt();
    $price_toman   = (int) get_post_meta( $pid, '_iramo_price_toman', true );
    if ( ! $price_toman && get_post_type() === 'product' && function_exists( 'wc_get_product' ) ) {
        $wc = wc_get_product( $pid );
        if ( $wc && $wc->get_price() !== '' ) {
            $price_toman = (int) $wc->get_price();
        }
    }
    $billing       = get_post_meta( $pid, '_iramo_billing_label', true ) ?: 'لایسنس دائمی + آپدیت خودکار';
    $highlights    = array_values( array_filter( array_map( 'trim', explode( "\n", (string) get_post_meta( $pid, '_iramo_highlights', true ) ) ) ) );
    if ( empty( $highlights ) ) {
        $highlights = [
            'نصب سریع و بدون نیاز به دانش برنامه‌نویسی',
            'اتصال خودکار به ربات تلگرام و بله پس از خرید',
            'صدور آنی کلید لایسنس و ارسال در سفارش و ایمیل',
        ];
    }
    $raw_metrics   = array_values( array_filter( array_map( 'trim', explode( "\n", (string) get_post_meta( $pid, '_iramo_metrics', true ) ) ) ) );
    $metrics       = [];
    foreach ( $raw_metrics as $line ) {
        $parts = array_map( 'trim', explode( '|', $line ) );
        if ( count( $parts ) >= 2 ) {
            $metrics[] = [ 'label' => $parts[0], 'value' => $parts[1] ];
        }
    }
    if ( empty( $metrics ) ) {
        $metrics = [
            [ 'label' => 'زمان راه‌اندازی', 'value' => 'کمتر از ۵ دقیقه' ],
            [ 'label' => 'دقت و پایداری', 'value' => '۹۹.۴٪' ],
            [ 'label' => 'ارسال لایسنس', 'value' => 'فوری و خودکار' ],
            [ 'label' => 'پشتیبانی', 'value' => '۲۴/۷ ربات و تیکت' ],
        ];
    }
    $checkout_url = ( get_post_type() === 'product' && function_exists( 'wc_get_checkout_url' ) )
        ? add_query_arg( 'add-to-cart', $pid, wc_get_checkout_url() )
        : iramo_get_page_url( 'services', '/services/' );
    $thumb = get_the_post_thumbnail_url( $pid, 'large' ) ?: iramo_get_theme_image( 'hero_iramo_desk_1794738858107.jpg' );
    ?>
    <main id="primary" class="iramo-main-wrap">
        <div class="iramo-container" style="display:grid;gap:28px;">
            <!-- Section 1: Product Hero & Purchase CTA -->
            <section class="iramo-card" style="padding:26px;">
                <div class="iramo-hero-grid">
                    <div>
                        <span class="iramo-badge"><?php echo esc_html( $billing ); ?></span>
                        <h1 style="margin:12px 0 10px;font-size:28px;font-weight:900;line-height:1.3;"><?php echo esc_html( $title ); ?></h1>
                        <p style="margin:0 0 20px;font-size:15px;color:var(--iramo-muted);line-height:1.85;"><?php echo esc_html( $tagline ); ?></p>
                        <div style="display:flex;flex-wrap:wrap;gap:12px;align-items:center;">
                            <a href="<?php echo esc_url( $checkout_url ); ?>" class="iramo-price-btn" style="padding:12px 22px;font-size:14px;">
                                <span class="price-label">خرید و دریافت فوری · <?php echo esc_html( $price_toman > 0 ? iramo_format_toman( $price_toman ) : 'ثبت سفارش' ); ?></span>
                                <span>←</span>
                            </a>
                            <a href="#iramo-sandbox-demo" class="iramo-btn iramo-btn-outline">تست آنلاین دمو</a>
                        </div>
                    </div>
                    <div class="iramo-hero-media">
                        <img src="<?php echo esc_url( $thumb ); ?>" alt="<?php echo esc_attr( $title ); ?>" />
                    </div>
                </div>
            </section>

            <!-- Section 2: Performance Metrics Strip -->
            <section class="iramo-grid-4">
                <?php foreach ( $metrics as $m ) : ?>
                    <div class="iramo-card" style="padding:18px;text-align:center;">
                        <div style="font-size:12px;color:var(--iramo-muted);margin-bottom:4px;"><?php echo esc_html( $m['label'] ); ?></div>
                        <div style="font-size:20px;font-weight:900;color:var(--iramo-primary);"><?php echo esc_html( iramo_fa_digits( $m['value'] ) ); ?></div>
                    </div>
                <?php endforeach; ?>
            </section>

            <!-- Section 3: Description & Technical Highlights -->
            <section class="iramo-grid-2">
                <div class="iramo-card" style="padding:24px;">
                    <h2 style="margin:0 0 12px;font-size:20px;font-weight:800;">معرفی کامل محصول</h2>
                    <div style="font-size:14.5px;line-height:1.95;color:var(--iramo-muted);">
                        <?php the_content(); ?>
                    </div>
                </div>
                <div class="iramo-card" style="padding:24px;">
                    <h2 style="margin:0 0 14px;font-size:20px;font-weight:800;">امکانات و مزیت‌های کلیدی</h2>
                    <ul style="margin:0;padding:0;list-style:none;display:grid;gap:10px;">
                        <?php foreach ( $highlights as $hl ) : ?>
                            <li style="padding:11px 14px;border-radius:12px;background:var(--iramo-canvas);display:flex;align-items:center;gap:10px;font-size:13.5px;">
                                <span style="color:var(--iramo-primary);font-weight:900;">✓</span>
                                <span><?php echo esc_html( $hl ); ?></span>
                            </li>
                        <?php endforeach; ?>
                    </ul>
                </div>
            </section>

            <!-- Section 4: 3-Step Workflow -->
            <section class="iramo-card" style="padding:24px;">
                <h2 style="margin:0 0 16px;font-size:20px;font-weight:800;">روند کار و فعال‌سازی در ۳ گام</h2>
                <div class="iramo-grid-3">
                    <div style="padding:16px;border-radius:16px;background:var(--iramo-canvas);">
                        <span class="iramo-badge">گام ۱</span>
                        <h3 style="margin:10px 0 6px;font-size:16px;font-weight:800;">ثبت سفارش و پرداخت امن</h3>
                        <p style="margin:0;font-size:13px;color:var(--iramo-muted);">بلافاصله پس از تکمیل سفارش ووکامرس، کلید لایسنس یکتا صادر می‌شود.</p>
                    </div>
                    <div style="padding:16px;border-radius:16px;background:var(--iramo-canvas);">
                        <span class="iramo-badge">گام ۲</span>
                        <h3 style="margin:10px 0 6px;font-size:16px;font-weight:800;">تحویل فایل و دوره همراه</h3>
                        <p style="margin:0;font-size:13px;color:var(--iramo-muted);">فایل نصب، آموزش ویدئویی و لایسنس در صفحه سفارش و ربات تلگرام/بله ارسال می‌شوند.</p>
                    </div>
                    <div style="padding:16px;border-radius:16px;background:var(--iramo-canvas);">
                        <span class="iramo-badge">گام ۳</span>
                        <h3 style="margin:10px 0 6px;font-size:16px;font-weight:800;">به‌روزرسانی و پشتیبانی مداوم</h3>
                        <p style="margin:0;font-size:13px;color:var(--iramo-muted);">تمامی آپدیت‌های بعدی محصول بدون هزینه اضافه در دسترس شما قرار می‌گیرد.</p>
                    </div>
                </div>
            </section>

            <!-- Section 5: Interactive Demo Sandbox -->
            <section id="iramo-sandbox-demo" class="iramo-card" style="padding:24px;" data-iramo-sandbox>
                <h2 style="margin:0 0 8px;font-size:20px;font-weight:800;">محیط آزمایش سریع (Interactive Sandbox)</h2>
                <p style="margin:0 0 14px;font-size:13.5px;color:var(--iramo-muted);">یک نمونه ورودی (شماره فاکتور، لینک ویدیو یا موضوع پرامپت) وارد کنید تا شبیه‌ساز عملکرد را ببینید:</p>
                <div class="iramo-search-form" style="margin-top:0;">
                    <input type="text" data-sandbox-input class="iramo-input" value="فاکتور شماره ۴۸۲۱ - تحلیل و ثبت خودکار" />
                    <button type="button" data-sandbox-run class="iramo-btn iramo-btn-primary" style="white-space:nowrap;">اجرای تست آنلاین</button>
                </div>
                <div data-sandbox-output></div>
            </section>

            <!-- Section 6: FAQ Accordion -->
            <section class="iramo-card" style="padding:24px;">
                <h2 style="margin:0 0 16px;font-size:20px;font-weight:800;">سوالات متداول</h2>
                <div style="display:grid;gap:10px;">
                    <div class="iramo-faq-item is-open">
                        <button type="button" class="iramo-faq-btn" data-iramo-faq-toggle>
                            <span>آیا بلافاصله بعد از پرداخت امکان دانلود و استفاده وجود دارد؟</span>
                            <span>+</span>
                        </button>
                        <div class="iramo-faq-body">بله. لایسنس و دسترسی فایل‌ها به‌صورت خودکار پس از تایید ووکامرس در حساب کاربری و ربات شما فعال می‌شود.</div>
                    </div>
                    <div class="iramo-faq-item">
                        <button type="button" class="iramo-faq-btn" data-iramo-faq-toggle>
                            <span>آیا می‌توانم در چند سیستم یا دامنه استفاده کنم؟</span>
                            <span>+</span>
                        </button>
                        <div class="iramo-faq-body">هر لایسنس استاندارد شامل نصب اصلی و پشتیبانی است؛ برای استقرار سازمانی با دسترسی چندکاربره با تیم ما هماهنگ کنید.</div>
                    </div>
                </div>
            </section>
        </div>
    </main>
    <?php
endwhile;

get_footer();
