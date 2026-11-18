<?php
/**
 * Services & Custom AI Consulting Page Template (SSR + Elementor, 1-to-1 Aligned with ServicesConsultationView)
 */
if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

get_header();

$is_el = false;
if ( class_exists( '\\Elementor\\Plugin' ) ) {
    $srv_pid  = get_the_ID();
    $doc      = \Elementor\Plugin::$instance->documents->get( $srv_pid );
    $has_data = ! empty( get_post_meta( $srv_pid, '_elementor_data', true ) );
    if ( $has_data && ( ( $doc && $doc->is_built_with_elementor() ) || get_post_meta( $srv_pid, '_elementor_edit_mode', true ) === 'builder' ) ) {
        $is_el = true;
    }
}

if ( $is_el ) :
    ?>
    <main id="primary" class="iramo-home-main">
        <?php while ( have_posts() ) : the_post(); the_content(); endwhile; ?>
    </main>
    <?php
else :
    ?>
    <main id="primary" class="iramo-main-wrap">
        <section class="iramo-container" style="padding-top:24px;padding-bottom:32px;" dir="rtl">
            <div class="iramo-grid-2" style="align-items:start;gap:28px;">
                <div style="display:grid;gap:20px;">
                    <div style="display:grid;gap:8px;">
                        <p style="margin:0;font-size:12px;font-weight:700;color:var(--iramo-primary);">مهندسی پروژه و مشاوره تخصصی</p>
                        <h1 style="margin:0;font-size:28px;font-weight:800;line-height:1.35;color:var(--iramo-ink);">پروژه هوشمند کسب‌وکار خود را به تیم iRamoAi بسپارید</h1>
                        <p style="margin:4px 0 0;font-size:14px;color:var(--iramo-muted);line-height:1.85;">
                            تمامی درخواست‌های ثبت‌شده بلافاصله از طریق پل ربات به تلگرام و بله تیم فنی ارسال می‌شوند تا در کمتر از ۲ ساعت جلسه بررسی زمان‌بندی شود.
                        </p>
                    </div>
                    <div style="display:grid;gap:12px;">
                        <div class="iramo-card" style="padding:18px 20px;">
                            <p style="margin:0 0 6px;font-size:14.5px;font-weight:800;color:var(--iramo-ink);"><span style="color:var(--iramo-primary);margin-inline-end:8px;">۰۱.</span>طراحی ربات‌های فروشگاهی و پشتیبانی تلگرام و بله</p>
                            <p style="margin:0;font-size:12.5px;color:var(--iramo-muted);line-height:1.75;">اتصال کامل به درگاه پرداخت، ووکامرس، احراز هویت کد تایید و پشتیبانی هوشمند ۲۴ ساعته.</p>
                        </div>
                        <div class="iramo-card" style="padding:18px 20px;">
                            <p style="margin:0 0 6px;font-size:14.5px;font-weight:800;color:var(--iramo-ink);"><span style="color:var(--iramo-primary);margin-inline-end:8px;">۰۲.</span>هوشمندسازی و اتوماسیون فرآیندهای سازمانی</p>
                            <p style="margin:0;font-size:12.5px;color:var(--iramo-muted);line-height:1.75;">حذف کارهای تکراری، تحلیل فاکتورها با حسابیار و اتصال فرم‌های المنتور به CRM.</p>
                        </div>
                        <div class="iramo-card" style="padding:18px 20px;">
                            <p style="margin:0 0 6px;font-size:14.5px;font-weight:800;color:var(--iramo-ink);"><span style="color:var(--iramo-primary);margin-inline-end:8px;">۰۳.</span>توسعه پلاگین‌های اختصاصی وردپرس و آکادمی</p>
                            <p style="margin:0;font-size:12.5px;color:var(--iramo-muted);line-height:1.75;">پیاده‌سازی سیستم‌های آموزش آنلاین، بازار ابزارها و داشبورد کاربری سریع بدون کندی سایت.</p>
                        </div>
                    </div>
                </div>

                <div class="iramo-card" style="padding:26px;">
                    <h2 style="margin:0 0 18px;font-size:18px;font-weight:800;color:var(--iramo-ink);">فرم درخواست مشاوره و برآورد پروژه</h2>
                    <form data-iramo-consultation style="display:grid;gap:14px;">
                        <div>
                            <label style="display:block;font-size:12px;font-weight:600;color:var(--iramo-muted);margin-bottom:6px;">نام و نام خانوادگی</label>
                            <input type="text" name="name" class="iramo-input" placeholder="مثلاً: علی محمدی" required />
                        </div>
                        <div>
                            <label style="display:block;font-size:12px;font-weight:600;color:var(--iramo-muted);margin-bottom:6px;">شماره تماس یا آیدی تلگرام/بله</label>
                            <input type="text" dir="ltr" name="contact" class="iramo-input" placeholder="@username / 0912..." required />
                        </div>
                        <div>
                            <label style="display:block;font-size:12px;font-weight:600;color:var(--iramo-muted);margin-bottom:6px;">نوع پروژه مورد نیاز</label>
                            <select name="serviceType" class="iramo-input">
                                <option value="bot">توسعه ربات هوشمند تلگرام و بله</option>
                                <option value="ai">پیاده‌سازی سیستم هوش مصنوعی و پایگاه دانش</option>
                                <option value="wp">پلاگین اختصاصی وردپرس و المنتور پرو</option>
                                <option value="hesabyar">سفارشی‌سازی حسابیار و اتوماسیون مالی</option>
                            </select>
                        </div>
                        <div>
                            <label style="display:block;font-size:12px;font-weight:600;color:var(--iramo-muted);margin-bottom:6px;">توضیحات کوتاه درباره ایده یا نیاز شما</label>
                            <textarea name="details" rows="4" class="iramo-input" placeholder="بفرمایید ربات یا سیستم هوشمند قرار است چه کاری برای کسب‌وکار شما انجام دهد..."></textarea>
                        </div>
                        <button type="submit" class="iramo-btn iramo-btn-accent" style="width:100%;padding:12px 18px;">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
                            <span>ارسال درخواست مشاوره</span>
                        </button>
                        <div data-consultation-msg style="font-size:12.5px;font-weight:700;color:var(--iramo-primary);"></div>
                    </form>
                </div>
            </div>
        </section>
    </main>
    <?php
endif;

get_footer();
