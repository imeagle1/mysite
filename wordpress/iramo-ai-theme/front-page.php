<?php
/**
 * Front Page Template — Renders Elementor content if built with Elementor,
 * otherwise renders the full SSR 4-Section iRamoAi Landing Page.
 */
if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

get_header();

$is_elementor_front = false;
if ( is_page() && class_exists( '\\Elementor\\Plugin' ) ) {
    $doc = \Elementor\Plugin::$instance->documents->get( get_the_ID() );
    if ( $doc && $doc->is_built_with_elementor() ) {
        $is_elementor_front = true;
    }
}

if ( $is_elementor_front ) :
    ?>
    <main id="primary" class="iramo-main-wrap">
        <?php
        while ( have_posts() ) :
            the_post();
            the_content();
        endwhile;
        ?>
    </main>
    <?php
else :
    $hero_badge    = iramo_get_setting( 'hero_badge', 'اکوسیستم نرم‌افزار و هوش مصنوعی فارسی' );
    $hero_title    = iramo_get_setting( 'hero_title', 'آینده کسب‌وکار شما با دستیارها و محصولات هوش مصنوعی' );
    $hero_subtitle = iramo_get_setting( 'hero_subtitle', 'نرم‌افزارهای آماده حسابیار و ویدئومی، دایرکتوری دست‌چین ابزارهای AI و آکادمی تخصصی آموزش و اتوماسیون در یک پلتفرم یکپارچه.' );
    $hero_img      = iramo_get_theme_image( 'hero_iramo_desk_1794738858107.jpg' );
    $products_url  = get_post_type_archive_link( 'iramo_product' ) ?: iramo_get_page_url( 'products', '/products/' );
    $tools_url     = get_post_type_archive_link( 'iramo_ai_tool' ) ?: iramo_get_page_url( 'ai-tools', '/ai-tools/' );
    $academy_url   = get_post_type_archive_link( 'iramo_course' ) ?: iramo_get_page_url( 'academy', '/academy/' );
    $services_url  = iramo_get_page_url( 'services', '/services/' );
    $panel_url     = iramo_get_page_url( 'panel', '/panel/' );
    ?>
    <main id="primary" class="iramo-home-main">
        <!-- Section 1: Hero -->
        <section class="iramo-hero">
            <div class="iramo-container">
                <div class="iramo-hero-grid">
                    <div>
                        <span class="iramo-badge">✨ <?php echo esc_html( $hero_badge ); ?></span>
                        <h1 class="iramo-hero-title"><?php echo esc_html( $hero_title ); ?></h1>
                        <p class="iramo-hero-subtitle"><?php echo esc_html( $hero_subtitle ); ?></p>

                        <div class="iramo-hero-actions">
                            <a href="<?php echo esc_url( $products_url ); ?>" class="iramo-btn iramo-btn-accent">مشاهده محصولات آماده ←</a>
                            <a href="<?php echo esc_url( $tools_url ); ?>" class="iramo-btn iramo-btn-outline">دایرکتوری ابزارهای AI</a>
                        </div>

                        <div class="iramo-hero-proof">
                            <span>✓ اتصال بومی ووکامرس</span>
                            <span class="proof-dot">•</span>
                            <span>✓ پنل تلگرام و بله</span>
                            <span class="proof-dot">•</span>
                            <span>✓ <?php echo esc_html( iramo_fa_digits( '18' ) ); ?> ابزار دست‌چین AI</span>
                            <span class="proof-dot">•</span>
                            <span>✓ سئو کامل سمت سرور</span>
                        </div>
                    </div>

                    <div class="iramo-hero-media">
                        <img src="<?php echo esc_url( $hero_img ); ?>" alt="میز کار هوشمند iRamoAi" loading="eager" />
                        <div class="iramo-hero-float-chip">
                            <div>
                                <div style="font-weight:800;">اتوماسیون حسابداری، محتوا و آموزش</div>
                                <div style="font-size:11px;opacity:0.85;">ساخته شده برای تیم‌های ایرانی</div>
                            </div>
                            <a href="<?php echo esc_url( $panel_url ); ?>" class="iramo-price-btn" style="padding:5px 12px;font-size:11px;">ورود به پنل</a>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Section 2: Featured Software Products -->
        <section class="iramo-section">
            <div class="iramo-container">
                <div class="iramo-sec-head">
                    <div>
                        <span class="iramo-badge">محصولات نرم‌افزاری اختصاصی</span>
                        <h2 class="iramo-sec-title" style="margin-top:8px;">محصولات آماده برای رشد سریع کسب‌وکار</h2>
                        <p class="iramo-sec-desc">تمامی محصولات منتشرشده در ووکامرس یا بخش محصولات با طراحی یکپارچه اینجا نمایش داده می‌شوند.</p>
                    </div>
                    <a href="<?php echo esc_url( $products_url ); ?>" class="iramo-btn iramo-btn-outline" style="padding:8px 16px;font-size:13px;">مشاهده همه محصولات ←</a>
                </div>

                <?php
                $products_q = new WP_Query( [
                    'post_type'      => [ 'iramo_product', 'product' ],
                    'post_status'    => 'publish',
                    'posts_per_page' => 4,
                ] );
                if ( $products_q->have_posts() ) :
                    ?>
                    <div class="iramo-grid-2">
                        <?php
                        while ( $products_q->have_posts() ) :
                            $products_q->the_post();
                            iramo_render_product_card( get_the_ID() );
                        endwhile;
                        wp_reset_postdata();
                        ?>
                    </div>
                <?php else : ?>
                    <div class="iramo-grid-2">
                        <article class="iramo-card" style="padding:22px;">
                            <span class="iramo-badge">اتوماسیون مالی</span>
                            <h3 style="margin:10px 0 6px;font-size:19px;font-weight:800;">نرم‌افزار حسابیار هوشمند (OCR مالی)</h3>
                            <p style="margin:0 0 14px;font-size:13.5px;color:var(--iramo-muted);">خواندن خودکار فاکتور و فیش بانکی با هوش مصنوعی و ثبت مستقیم در اکسل و نرم‌افزارهای مالی.</p>
                            <a href="<?php echo esc_url( $products_url ); ?>" class="iramo-price-btn">معرفی محصول و دمو ←</a>
                        </article>
                        <article class="iramo-card" style="padding:22px;">
                            <span class="iramo-badge">تولید محتوای ویدیویی</span>
                            <h3 style="margin:10px 0 6px;font-size:19px;font-weight:800;">استودیو ویدئومی (زیرنویس و دوبله AI)</h3>
                            <p style="margin:0 0 14px;font-size:13.5px;color:var(--iramo-muted);">تبدیل ویدیوهای آموزشی یوتیوب و دوره‌ها به زیرنویس دقیق و دوبله فارسی هماهنگ.</p>
                            <a href="<?php echo esc_url( $products_url ); ?>" class="iramo-price-btn">معرفی محصول و دمو ←</a>
                        </article>
                    </div>
                <?php endif; ?>
            </div>
        </section>

        <!-- Section 3: AI Tools Discovery Engine -->
        <section class="iramo-section" style="padding-top:12px;">
            <div class="iramo-container">
                <div class="iramo-discovery-box">
                    <div style="max-width:740px;">
                        <span class="iramo-badge">موتور جستجوی ابزارهای AI</span>
                        <h2 class="iramo-sec-title" style="margin-top:8px;">دایرکتوری تخصصی و بررسی ابزارهای هوش مصنوعی</h2>
                        <p class="iramo-sec-desc">ابزار مناسب خود را بر اساس نیاز، مدل قیمت‌گذاری، ورودی/خروجی و نمونه پرامپت پیدا کنید.</p>
                    </div>

                    <form action="<?php echo esc_url( $tools_url ); ?>" method="get" class="iramo-search-form">
                        <input type="search" name="q" class="iramo-input" placeholder="جستجو در نام ابزار، شرکت سازنده یا کاربرد (مثلاً: ChatGPT، تولید ویدیو، کدنویسی)..." />
                        <button type="submit" class="iramo-btn iramo-btn-primary" style="white-space:nowrap;">جستجو در دایرکتوری</button>
                    </form>

                    <div class="iramo-chips">
                        <?php
                        $quick_cats = [
                            'AI Assistant'        => 'دستیار هوشمند',
                            'Art & Image'         => 'تصویر و گرافیک',
                            'Video Generation'    => 'تولید ویدیو',
                            'Code Assistant'      => 'برنامه‌نویسی',
                            'Audio & Music'       => 'صدا و دوبله',
                            'Automation & Agents' => 'اتوماسیون و ایجنت',
                            'Research & Study'    => 'پژوهش و مقاله',
                        ];
                        foreach ( $quick_cats as $val => $label ) :
                            ?>
                            <a href="<?php echo esc_url( add_query_arg( 'task', $val, $tools_url ) ); ?>" class="iramo-chip"><?php echo esc_html( $label ); ?></a>
                        <?php endforeach; ?>
                    </div>
                </div>
            </div>
        </section>

        <!-- Section 4: Dual Bento (Academy & Custom Automation Consulting) -->
        <section class="iramo-section" style="padding-top:12px;">
            <div class="iramo-container">
                <div class="iramo-grid-2">
                    <div class="iramo-card iramo-bento-card">
                        <div>
                            <div class="iramo-bento-head">
                                <span class="iramo-badge">آکادمی تخصصی iRamoAi</span>
                                <span style="font-size:12px;font-weight:700;color:var(--iramo-primary);">پروژه‌محور + لایسنس</span>
                            </div>
                            <h3 style="margin:12px 0 8px;font-size:21px;font-weight:800;">دوره‌های کاربردی هوش مصنوعی و ساخت ربات</h3>
                            <p style="margin:0;font-size:13.5px;color:var(--iramo-muted);line-height:1.8;">
                                یادگیری عملی ساخت ربات‌های تلگرام و بله، پرامپت‌نویسی مهندسی‌شده، اتوماسیون n8n و استفاده حرفه‌ای از ابزارهای AI همراه با پنل دانشجویی اختصاصی.
                            </p>
                        </div>
                        <div style="display:flex;flex-wrap:wrap;gap:10px;">
                            <a href="<?php echo esc_url( $academy_url ); ?>" class="iramo-btn iramo-btn-primary">مشاهده دوره‌های آکادمی ←</a>
                            <a href="<?php echo esc_url( $panel_url ); ?>" class="iramo-btn iramo-btn-outline">ورود به پنل دانشجو</a>
                        </div>
                    </div>

                    <div class="iramo-card iramo-bento-card">
                        <div>
                            <div class="iramo-bento-head">
                                <span class="iramo-badge">خدمات مهندسی و مشاوره</span>
                                <span style="font-size:12px;font-weight:700;color:var(--iramo-subtle);">پروژه اختصاصی سازمانی</span>
                            </div>
                            <h3 style="margin:12px 0 8px;font-size:21px;font-weight:800;">طراحی ربات، اتوماسیون و پیاده‌سازی AI برای سازمان شما</h3>
                            <p style="margin:0;font-size:13.5px;color:var(--iramo-muted);line-height:1.8;">
                                اگر برای اتصال CRM، ووکامرس، صدور خودکار فاکتور یا راه‌اندازی دستیار اختصاصی AI در تلگرام و بله به تیم فنی نیاز دارید، با مهندسان ما مشورت کنید.
                            </p>
                        </div>
                        <div style="display:flex;flex-wrap:wrap;gap:10px;">
                            <a href="<?php echo esc_url( $services_url ); ?>" class="iramo-btn iramo-btn-accent">ثبت درخواست مشاوره تخصصی ←</a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </main>
    <?php
endif;

get_footer();
