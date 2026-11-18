<?php
/**
 * Front Page Template — Renders Elementor content if built with Elementor,
 * otherwise renders the full SSR 4-Section iRamoAi Landing Page aligned 1-to-1 with React WebsiteHomeView.
 */
if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

get_header();

$is_elementor_front = false;
if ( is_page() && class_exists( '\\Elementor\\Plugin' ) ) {
    $front_pid = get_the_ID();
    $doc       = \Elementor\Plugin::$instance->documents->get( $front_pid );
    $has_data  = ! empty( get_post_meta( $front_pid, '_elementor_data', true ) );
    if ( $has_data && ( ( $doc && $doc->is_built_with_elementor() ) || get_post_meta( $front_pid, '_elementor_edit_mode', true ) === 'builder' ) ) {
        $is_elementor_front = true;
    }
}

if ( $is_elementor_front ) :
    ?>
    <main id="primary" class="iramo-home-main">
        <?php
        while ( have_posts() ) :
            the_post();
            the_content();
        endwhile;
        ?>
    </main>
    <?php
else :
    $hero_badge    = iramo_get_setting( 'hero_badge', 'جایی برای خلق آینده هوشمند · iRamoAi' );
    $hero_title    = iramo_get_setting( 'hero_title', 'محصولات نرم‌افزاری، آموزش حرفه‌ای و راهکارهای هوشمند AI' );
    $hero_subtitle = iramo_get_setting( 'hero_subtitle', 'از تجربه مهندسی ما در دنیای فناوری بهره ببرید؛ مجموعه نرم‌افزارهای آماده مثل حسابیار و ربات‌های آموزشی، دستیار انتخاب ابزارهای هوش مصنوعی و آکادمی تخصصی iRamo.' );
    $hero_img      = iramo_get_theme_image( 'hero_iramo_desk_1794738858107.jpg' );
    $products_url  = get_post_type_archive_link( 'iramo_product' ) ?: iramo_get_page_url( 'products', '/products/' );
    $tools_url     = get_post_type_archive_link( 'iramo_ai_tool' ) ?: iramo_get_page_url( 'ai-tools', '/ai-tools/' );
    $academy_url   = get_post_type_archive_link( 'iramo_course' ) ?: iramo_get_page_url( 'academy', '/academy/' );
    $services_url  = iramo_get_page_url( 'services', '/services/' );
    ?>
    <main id="primary" class="iramo-home-main">
        <!-- Section 1: Hero -->
        <section class="iramo-hero">
            <div class="iramo-container">
                <div class="iramo-hero-grid">
                    <div>
                        <p class="iramo-hero-eyebrow"><?php echo esc_html( $hero_badge ); ?></p>
                        <h1 class="iramo-hero-title"><?php echo esc_html( $hero_title ); ?></h1>
                        <p class="iramo-hero-subtitle"><?php echo esc_html( $hero_subtitle ); ?></p>

                        <div class="iramo-hero-actions">
                            <a href="<?php echo esc_url( $products_url ); ?>" class="iramo-btn iramo-btn-accent">مشاهده دمو محصولات</a>
                            <a href="<?php echo esc_url( $services_url ); ?>" class="iramo-btn iramo-btn-outline">درخواست مشاوره و پروژه ←</a>
                        </div>

                        <div class="iramo-hero-proof">
                            <span><?php echo esc_html( iramo_fa_digits( '50,000+' ) ); ?> دانشجو و کاربر فعال</span>
                            <span class="proof-dot">•</span>
                            <span><?php echo esc_html( iramo_fa_digits( '24+' ) ); ?> ابزار و ربات هوشمند</span>
                            <span class="proof-dot">•</span>
                            <span>اتصال بومی به تلگرام و بله</span>
                        </div>
                    </div>

                    <div class="iramo-hero-media">
                        <img src="<?php echo esc_url( $hero_img ); ?>" alt="محیط کاری هوشمند iRamoAi" loading="eager" />
                    </div>
                </div>
            </div>
        </section>

        <!-- Section 2: Featured Software Products -->
        <section class="iramo-section">
            <div class="iramo-container">
                <div class="iramo-sec-head">
                    <div>
                        <h2 class="iramo-sec-title">محصولات نرم‌افزاری برتر ما</h2>
                        <p class="iramo-sec-desc">نرم‌افزارها و ربات‌های آماده با طراحی اختصاصی برای کار و کسب‌وکار هوشمندتر</p>
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
                    <div class="iramo-grid-4">
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
                            <a href="<?php echo esc_url( $products_url ); ?>" class="iramo-price-btn">دمو و خرید ←</a>
                        </article>
                        <article class="iramo-card" style="padding:22px;">
                            <span class="iramo-badge">تولید محتوای ویدیویی</span>
                            <h3 style="margin:10px 0 6px;font-size:19px;font-weight:800;">استودیو ویدئومی (زیرنویس و دوبله AI)</h3>
                            <p style="margin:0 0 14px;font-size:13.5px;color:var(--iramo-muted);">تبدیل ویدیوهای آموزشی یوتیوب و دوره‌ها به زیرنویس دقیق و دوبله فارسی هماهنگ.</p>
                            <a href="<?php echo esc_url( $products_url ); ?>" class="iramo-price-btn">دمو و خرید ←</a>
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
                        <span class="iramo-badge">دستیار و بازار ابزارهای هوش مصنوعی</span>
                        <h2 class="iramo-sec-title" style="margin-top:8px;">چه کاری می‌خواهید با هوش مصنوعی انجام دهید؟</h2>
                        <p class="iramo-sec-desc">کافی است هدف خود را بنویسید یا نوع ورودی و خروجی را انتخاب کنید؛ موتور پیشنهادگر ابزارهای AI بهترین راهکار را با دستورالعمل گام‌به‌گام معرفی می‌کند.</p>
                    </div>

                    <form action="<?php echo esc_url( $tools_url ); ?>" method="get" class="iramo-search-form">
                        <input type="search" name="q" class="iramo-input" placeholder="مثلاً: ثبت خودکار فیش بانکی، ساخت ربات تلگرام..." />
                        <button type="submit" class="iramo-btn iramo-btn-primary" style="white-space:nowrap;">پیشنهاد ابزار</button>
                    </form>

                    <div class="iramo-chips">
                        <?php
                        $quick_cats = [
                            ''                    => 'همه ابزارها',
                            'AI Assistant'        => 'دستیار هوشمند',
                            'Video Generation'    => 'تولید ویدیو',
                            'Art & Image'         => 'تصویر و گرافیک',
                            'Code Assistant'      => 'کدنویسی',
                            'Data & Finance'      => 'تحلیل داده',
                        ];
                        foreach ( $quick_cats as $val => $label ) :
                            $href = $val !== '' ? add_query_arg( 'task', $val, $tools_url ) : $tools_url;
                            ?>
                            <a href="<?php echo esc_url( $href ); ?>" class="iramo-chip"><?php echo esc_html( $label ); ?></a>
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
                                <span class="iramo-badge">دوره‌های آموزشی و آکادمی</span>
                                <span style="font-size:12px;font-weight:700;color:var(--iramo-primary);">۱۲ ساعت آموزش · ۶ پروژه عملی</span>
                            </div>
                            <h3 style="margin:12px 0 8px;font-size:21px;font-weight:800;">دوره جامع هوش مصنوعی از صفر تا پیشرفته</h3>
                            <p style="margin:0;font-size:13.5px;color:var(--iramo-muted);line-height:1.8;">
                                از مبانی تا ساخت ایجنت‌های حرفه‌ای، اتصال به وردپرس و اتوماسیون ربات‌های تلگرام و بله.
                            </p>
                        </div>
                        <div style="display:flex;flex-wrap:wrap;gap:10px;">
                            <a href="<?php echo esc_url( $academy_url ); ?>" class="iramo-btn iramo-btn-primary">مشاهده همه دوره‌ها ←</a>
                            <a href="<?php echo esc_url( $services_url ); ?>" class="iramo-btn iramo-btn-outline">مشاوره انتخاب دوره</a>
                        </div>
                    </div>

                    <div class="iramo-card iramo-bento-card">
                        <div>
                            <div class="iramo-bento-head">
                                <span class="iramo-badge">خدمات و مشاوره تخصصی</span>
                                <span style="font-size:12px;font-weight:700;color:var(--iramo-subtle);">پروژه اختصاصی سازمانی</span>
                            </div>
                            <h3 style="margin:12px 0 8px;font-size:21px;font-weight:800;">طراحی ربات، اتوماسیون و پیاده‌سازی AI برای سازمان شما</h3>
                            <p style="margin:0;font-size:13.5px;color:var(--iramo-muted);line-height:1.8;">
                                مشاوره و اجرای پروژه‌های اختصاصی AI، توسعه ربات‌های فروش و پشتیبانی تلگرام و بله و اتوماسیون فرآیندها و اتصال به وردپرس و ووکامرس.
                            </p>
                        </div>
                        <div style="display:flex;flex-wrap:wrap;gap:10px;">
                            <a href="<?php echo esc_url( $services_url ); ?>" class="iramo-btn iramo-btn-accent">ثبت سفارش پروژه ←</a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </main>
    <?php
endif;

get_footer();
