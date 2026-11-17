<?php
/**
 * Services & Custom AI Consulting Page Template (SSR + REST Telegram/Bale Lead Capture)
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

if ( $is_el ) :
    ?>
    <main id="primary" class="iramo-main-wrap">
        <?php while ( have_posts() ) : the_post(); the_content(); endwhile; ?>
    </main>
    <?php
else :
    $hero_img = iramo_get_theme_image( 'services_ai_neural_1794738838874.jpg' );
    ?>
    <main id="primary" class="iramo-main-wrap">
        <div class="iramo-container" style="display:grid;gap:28px;">
            <section class="iramo-card" style="padding:26px;">
                <div class="iramo-hero-grid">
                    <div>
                        <span class="iramo-badge">خدمات مهندسی و اتوماسیون اختصاصی</span>
                        <h1 style="margin:12px 0 10px;font-size:27px;font-weight:900;">طراحی ربات هوشمند، ایجنت AI و اتوماسیون سازمانی</h1>
                        <p style="margin:0;font-size:15px;color:var(--iramo-muted);line-height:1.85;">
                            تیم مهندسی iRamoAi سیستم‌های اتصال مستقیم بین وب‌سایت وردپرس/ووکامرس، تلگرام، بله و مدل‌های پیشرفته هوش مصنوعی را اختصاصاً برای کسب‌وکار شما پیاده‌سازی می‌کند.
                        </p>
                    </div>
                    <div class="iramo-hero-media">
                        <img src="<?php echo esc_url( $hero_img ); ?>" alt="خدمات مهندسی هوش مصنوعی iRamoAi" />
                    </div>
                </div>
            </section>

            <section class="iramo-grid-2">
                <div style="display:grid;gap:14px;">
                    <div class="iramo-card" style="padding:20px;">
                        <h3 style="margin:0 0 6px;font-size:17px;font-weight:800;">۱. ساخت ربات فروش و پشتیبانی تلگرام و بله</h3>
                        <p style="margin:0;font-size:13.5px;color:var(--iramo-muted);">اتصال مستقیم ووکامرس، احراز هویت OTP، صدور لایسنس و پاسخگویی هوشمند با پایه دانش اختصاصی شما.</p>
                    </div>
                    <div class="iramo-card" style="padding:20px;">
                        <h3 style="margin:0 0 6px;font-size:17px;font-weight:800;">۲. اتوماسیون مالی، OCR و پردازش اسناد</h3>
                        <p style="margin:0;font-size:13.5px;color:var(--iramo-muted);">استخراج خودکار اطلاعات فاکتورها، قراردادها و گزارش‌های بانکی با خروجی مستقیم در اکسل و CRM.</p>
                    </div>
                    <div class="iramo-card" style="padding:20px;">
                        <h3 style="margin:0 0 6px;font-size:17px;font-weight:800;">۳. مشاوره معماری و پیاده‌سازی ایجنت‌های AI</h3>
                        <p style="margin:0;font-size:13.5px;color:var(--iramo-muted);">راه‌اندازی پایپ‌لاین‌های n8n، اتصال APIهای مدل‌های زبانی و کاهش هزینه‌های عملیاتی تیم شما.</p>
                    </div>
                </div>

                <div class="iramo-card" style="padding:24px;">
                    <h2 style="margin:0 0 8px;font-size:20px;font-weight:800;">ثبت درخواست مشاوره و سفارش پروژه</h2>
                    <p style="margin:0 0 16px;font-size:13px;color:var(--iramo-muted);">اطلاعات تماس خود را وارد کنید؛ درخواست بلافاصله در پنل مدیریت و ربات ادمین ثبت می‌شود.</p>
                    <form data-iramo-consultation style="display:grid;gap:12px;">
                        <input type="text" name="name" class="iramo-input" placeholder="نام و نام خانوادگی / نام مجموعه" required />
                        <input type="text" name="contact" class="iramo-input" placeholder="شماره تماس یا آیدی تلگرام / بله" required />
                        <select name="serviceType" class="iramo-input">
                            <option value="bot">ساخت ربات تلگرام و بله متصل به سایت</option>
                            <option value="automation">اتوماسیون سازمانی و n8n</option>
                            <option value="ocr">پردازش اسناد و OCR مالی</option>
                            <option value="consulting">مشاوره تخصصی AI</option>
                        </select>
                        <textarea name="details" rows="4" class="iramo-input" placeholder="توضیح کوتاهی درباره نیاز پروژه بنویسید..."></textarea>
                        <button type="submit" class="iramo-btn iramo-btn-accent" style="width:100%;">ارسال درخواست مشاوره ←</button>
                        <div data-consultation-msg style="font-size:12.5px;font-weight:700;color:var(--iramo-primary);"></div>
                    </form>
                </div>
            </section>
        </div>
    </main>
    <?php
endif;

get_footer();
