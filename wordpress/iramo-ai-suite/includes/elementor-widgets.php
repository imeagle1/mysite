<?php
/**
 * Module: 17 Native Elementor & Elementor Pro Widgets for iRamoAi
 * Covers Header, Footer, Home Sections, Product 6-Section Landing, AI Tools Archive & Detail,
 * Courses, Articles, Consultation Form, and Isolated React Student LMS Portal.
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

add_action( 'elementor/elements/categories_registered', function( $elements_manager ) {
    $elements_manager->add_category( 'iramo-ai', [
        'title' => __( 'ابزارک‌های iRamoAi', 'iramo-ai' ),
        'icon'  => 'eicon-superhero-alt',
    ] );
} );

add_action( 'elementor/widgets/register', function( $widgets_manager ) {
    if ( ! class_exists( '\Elementor\Widget_Base' ) ) {
        return;
    }

    abstract class iRamo_Base_Widget extends \Elementor\Widget_Base {
        public function get_categories() {
            return [ 'iramo-ai' ];
        }

        protected function register_iramo_card_style_controls( $selector = '{{WRAPPER}} .iramo-card' ) {
            $this->start_controls_section( 'section_style_cards', [
                'label' => __( 'استایل کارت‌ها و تایپوگرافی', 'iramo-ai' ),
                'tab'   => \Elementor\Controls_Manager::TAB_STYLE,
            ] );

            $this->add_control( 'card_bg_color', [
                'label'     => __( 'رنگ پس‌زمینه', 'iramo-ai' ),
                'type'      => \Elementor\Controls_Manager::COLOR,
                'selectors' => [ $selector => 'background-color: {{VALUE}};' ],
            ] );

            $this->add_control( 'heading_color', [
                'label'     => __( 'رنگ تیترها', 'iramo-ai' ),
                'type'      => \Elementor\Controls_Manager::COLOR,
                'selectors' => [ '{{WRAPPER}} h1, {{WRAPPER}} h2, {{WRAPPER}} h3' => 'color: {{VALUE}};' ],
            ] );

            $this->add_group_control( \Elementor\Group_Control_Typography::get_type(), [
                'name'     => 'heading_typography',
                'label'    => __( 'تایپوگرافی تیترها', 'iramo-ai' ),
                'selector' => '{{WRAPPER}} h1, {{WRAPPER}} h2, {{WRAPPER}} h3',
            ] );

            $this->add_group_control( \Elementor\Group_Control_Border::get_type(), [
                'name'     => 'card_border',
                'selector' => $selector,
            ] );

            $this->add_control( 'card_border_radius', [
                'label'      => __( 'گردی گوشه‌ها', 'iramo-ai' ),
                'type'       => \Elementor\Controls_Manager::DIMENSIONS,
                'size_units' => [ 'px', 'em', '%' ],
                'selectors'  => [ $selector => 'border-radius: {{TOP}}{{UNIT}} {{RIGHT}}{{UNIT}} {{BOTTOM}}{{UNIT}} {{LEFT}}{{UNIT}};' ],
            ] );

            $this->add_group_control( \Elementor\Group_Control_Box_Shadow::get_type(), [
                'name'     => 'card_box_shadow',
                'selector' => $selector,
            ] );

            $this->end_controls_section();
        }
    }

    // 1. Header Nav Widget (for Elementor Pro Header & Free Elementor Header Template)
    class iRamo_Widget_Header_Nav extends iRamo_Base_Widget {
        public function get_name() { return 'iramo_header_nav'; }
        public function get_title() { return __( 'هدر و منوی شناور iRamoAi', 'iramo-ai' ); }
        public function get_icon() { return 'eicon-nav-menu'; }

        protected function register_controls() {
            $this->start_controls_section( 'sec_header', [ 'label' => __( 'تنظیمات هدر', 'iramo-ai' ) ] );
            $this->add_control( 'brand_name', [ 'label' => 'نام برند', 'type' => \Elementor\Controls_Manager::TEXT, 'default' => 'iRamoAi' ] );
            $this->add_control( 'cta_text', [ 'label' => 'متن دکمه پنل', 'type' => \Elementor\Controls_Manager::TEXT, 'default' => 'ورود / پنل کاربری' ] );
            $this->add_control( 'cta_short', [ 'label' => 'متن کوتاه موبایل', 'type' => \Elementor\Controls_Manager::TEXT, 'default' => 'ورود / پنل' ] );
            $this->add_control( 'show_theme_toggle', [ 'label' => 'نمایش دکمه تغییر تم', 'type' => \Elementor\Controls_Manager::SWITCHER, 'default' => 'yes' ] );
            $this->end_controls_section();
            $this->register_iramo_card_style_controls( '{{WRAPPER}} .iramo-header-pill' );
        }

        protected function render() {
            $s          = $this->get_settings_for_display();
            $brand      = $s['brand_name'] ?: 'iRamoAi';
            $img_fn     = function_exists( 'iramo_get_theme_image' );
            $logo_light = $img_fn ? iramo_get_theme_image( 'Group_179_659a031b.png' ) : '';
            $logo_dark  = $img_fn ? iramo_get_theme_image( 'logo_brand_19b8e3d7.png' ) : '';
            $panel_url  = function_exists( 'iramo_get_page_url' ) ? iramo_get_page_url( 'panel', '/panel/' ) : home_url( '/panel/' );
            $is_editor  = class_exists( '\Elementor\Plugin' ) && \Elementor\Plugin::$instance->editor->is_edit_mode();
            $wrap_style = $is_editor ? 'position:relative;padding:12px;' : '';
            ?>
            <header class="iramo-header-wrap" role="banner" style="<?php echo esc_attr( $wrap_style ); ?>">
                <div class="iramo-header-pill">
                    <a href="<?php echo esc_url( home_url( '/' ) ); ?>" class="iramo-logo-link">
                        <?php if ( $logo_light ) : ?>
                            <img src="<?php echo esc_url( $logo_light ); ?>" alt="<?php echo esc_attr( $brand ); ?>" class="iramo-logo-img iramo-logo-light" />
                            <img src="<?php echo esc_url( $logo_dark ); ?>" alt="<?php echo esc_attr( $brand ); ?>" class="iramo-logo-img iramo-logo-dark" />
                        <?php endif; ?>
                        <span class="iramo-brand-text"><?php echo esc_html( $brand ); ?></span>
                    </a>
                    <nav aria-label="منوی اصلی">
                        <?php
                        if ( has_nav_menu( 'primary' ) ) {
                            wp_nav_menu( [ 'theme_location' => 'primary', 'container' => false, 'menu_class' => 'iramo-nav-list', 'depth' => 1 ] );
                        } else {
                            echo '<ul class="iramo-nav-list"><li><a href="' . esc_url( home_url( '/' ) ) . '">خانه</a></li><li><a href="' . esc_url( home_url( '/products/' ) ) . '">محصولات</a></li><li><a href="' . esc_url( home_url( '/ai-tools/' ) ) . '">ابزارهای AI</a></li><li><a href="' . esc_url( home_url( '/academy/' ) ) . '">آکادمی</a></li><li><a href="' . esc_url( home_url( '/articles/' ) ) . '">مقالات</a></li><li><a href="' . esc_url( home_url( '/services/' ) ) . '">خدمات</a></li></ul>';
                        }
                        ?>
                    </nav>
                    <div class="iramo-header-actions">
                        <?php if ( ( $s['show_theme_toggle'] ?? 'yes' ) === 'yes' ) : ?>
                            <button type="button" class="iramo-icon-btn" data-iramo-theme-toggle aria-label="تغییر تم">☀</button>
                        <?php endif; ?>
                        <a href="<?php echo esc_url( $panel_url ); ?>" class="iramo-panel-cta">
                            <span class="label-full"><?php echo esc_html( is_user_logged_in() ? 'پنل کاربری من' : ( $s['cta_text'] ?: 'ورود / پنل کاربری' ) ); ?></span>
                            <span class="label-short"><?php echo esc_html( is_user_logged_in() ? 'پنل من' : ( $s['cta_short'] ?: 'ورود / پنل' ) ); ?></span>
                        </a>
                        <button type="button" class="iramo-icon-btn iramo-menu-toggle" data-iramo-menu-toggle aria-label="منوی موبایل">☰</button>
                    </div>
                </div>
                <div class="iramo-mobile-drawer" data-iramo-mobile-drawer>
                    <?php
                    if ( has_nav_menu( 'primary' ) ) {
                        wp_nav_menu( [ 'theme_location' => 'primary', 'container' => false, 'depth' => 1 ] );
                    } else {
                        echo '<ul><li><a href="' . esc_url( home_url( '/' ) ) . '">صفحه اصلی</a></li><li><a href="' . esc_url( home_url( '/products/' ) ) . '">محصولات</a></li><li><a href="' . esc_url( home_url( '/ai-tools/' ) ) . '">ابزارهای هوش مصنوعی</a></li><li><a href="' . esc_url( home_url( '/academy/' ) ) . '">آکادمی و دوره‌ها</a></li><li><a href="' . esc_url( home_url( '/articles/' ) ) . '">مقالات</a></li><li><a href="' . esc_url( home_url( '/services/' ) ) . '">خدمات و مشاوره</a></li><li><a href="' . esc_url( $panel_url ) . '">پنل کاربری</a></li></ul>';
                    }
                    ?>
                </div>
            </header>
            <?php
        }
    }

    // 2. Footer Widget (for Elementor Pro Footer & Free Elementor Footer Template)
    class iRamo_Widget_Footer_Box extends iRamo_Base_Widget {
        public function get_name() { return 'iramo_footer_box'; }
        public function get_title() { return __( 'فوتر و خبرنامه ربات iRamoAi', 'iramo-ai' ); }
        public function get_icon() { return 'eicon-footer'; }

        protected function register_controls() {
            $this->start_controls_section( 'sec_footer', [ 'label' => __( 'محتوای فوتر', 'iramo-ai' ) ] );
            $this->add_control( 'brand_name', [ 'label' => 'نام برند', 'type' => \Elementor\Controls_Manager::TEXT, 'default' => 'iRamoAi' ] );
            $this->add_control( 'about', [ 'label' => 'معرفی کوتاه', 'type' => \Elementor\Controls_Manager::TEXTAREA, 'default' => 'پلتفرم تخصصی طراحی نرم‌افزارهای هوشمند، آکادمی آموزش کاربردی AI و مرجع معرفی برترین ابزارهای هوش مصنوعی جهان.' ] );
            $this->add_control( 'newsletter_title', [ 'label' => 'عنوان خبرنامه', 'type' => \Elementor\Controls_Manager::TEXT, 'default' => 'خبرنامه هوشمند تلگرام و بله' ] );
            $this->add_control( 'copyright', [ 'label' => 'متن کپی‌رایت', 'type' => \Elementor\Controls_Manager::TEXT, 'default' => '© تمامی حقوق برای پلتفرم هوشمند iRamoAi محفوظ است.' ] );
            $this->end_controls_section();
            $this->register_iramo_card_style_controls( '{{WRAPPER}} .iramo-footer' );
        }

        protected function render() {
            $s          = $this->get_settings_for_display();
            $brand      = $s['brand_name'] ?: 'iRamoAi';
            $img_fn     = function_exists( 'iramo_get_theme_image' );
            $logo_light = $img_fn ? iramo_get_theme_image( 'Group_179_659a031b.png' ) : '';
            $logo_dark  = $img_fn ? iramo_get_theme_image( 'logo_brand_19b8e3d7.png' ) : '';
            $panel_url  = function_exists( 'iramo_get_page_url' ) ? iramo_get_page_url( 'panel', '/panel/' ) : home_url( '/panel/' );
            ?>
            <footer class="iramo-footer" role="contentinfo" dir="rtl">
                <div class="iramo-container">
                    <div class="iramo-footer-grid">
                        <div>
                            <a href="<?php echo esc_url( home_url( '/' ) ); ?>" class="iramo-logo-link">
                                <?php if ( $logo_light ) : ?>
                                    <img src="<?php echo esc_url( $logo_light ); ?>" alt="<?php echo esc_attr( $brand ); ?>" class="iramo-logo-img iramo-logo-light" />
                                    <img src="<?php echo esc_url( $logo_dark ); ?>" alt="<?php echo esc_attr( $brand ); ?>" class="iramo-logo-img iramo-logo-dark" />
                                <?php endif; ?>
                                <span class="iramo-brand-text"><?php echo esc_html( $brand ); ?></span>
                            </a>
                            <p style="margin:12px 0 0;font-size:13px;color:var(--iramo-muted);line-height:1.85;max-width:380px;">
                                <?php echo esc_html( $s['about'] ); ?>
                            </p>
                        </div>

                        <div class="iramo-footer-nav-grid">
                            <div>
                                <h4 style="margin:0;font-size:14px;font-weight:800;">بخش‌های سایت</h4>
                                <ul class="iramo-footer-links">
                                    <li><a href="<?php echo esc_url( home_url( '/' ) ); ?>">صفحه اصلی</a></li>
                                    <li><a href="<?php echo esc_url( home_url( '/products/' ) ); ?>">محصولات نرم‌افزاری</a></li>
                                    <li><a href="<?php echo esc_url( home_url( '/ai-tools/' ) ); ?>">دایرکتوری ابزارهای AI</a></li>
                                    <li><a href="<?php echo esc_url( home_url( '/academy/' ) ); ?>">آکادمی و دوره‌ها</a></li>
                                </ul>
                            </div>
                            <div>
                                <h4 style="margin:0;font-size:14px;font-weight:800;">امکانات و پلتفرم</h4>
                                <ul class="iramo-footer-links">
                                    <li><a href="<?php echo esc_url( home_url( '/articles/' ) ); ?>">مقالات و ابزارک‌ها</a></li>
                                    <li><a href="<?php echo esc_url( home_url( '/services/' ) ); ?>">خدمات و مشاوره</a></li>
                                    <li><a href="<?php echo esc_url( $panel_url ); ?>">پنل کاربری و آموزش</a></li>
                                </ul>
                            </div>
                        </div>

                        <div>
                            <h4 style="margin:0;font-size:14px;font-weight:800;"><?php echo esc_html( $s['newsletter_title'] ); ?></h4>
                            <form class="iramo-newsletter-form" data-iramo-newsletter>
                                <input type="text" name="handle" class="iramo-input" placeholder="@username یا 0912..." required />
                                <button type="submit" class="iramo-btn iramo-btn-accent" style="padding:10px 16px;font-size:13px;white-space:nowrap;">عضویت</button>
                            </form>
                            <div data-iramo-newsletter-msg style="font-size:12px;margin-top:8px;color:var(--iramo-primary);font-weight:700;"></div>
                        </div>
                    </div>

                    <div class="iramo-footer-bottom">
                        <div><?php echo esc_html( $s['copyright'] ); ?></div>
                        <button type="button" class="iramo-chip" data-iramo-theme-toggle>تغییر حالت روشن / تیره</button>
                    </div>
                </div>
            </footer>
            <?php
        }
    }

    // 3. Hero Section Widget
    class iRamo_Widget_Hero extends iRamo_Base_Widget {
        public function get_name() { return 'iramo_hero'; }
        public function get_title() { return __( 'هیرو صفحه اصلی (iRamoAi Hero)', 'iramo-ai' ); }
        public function get_icon() { return 'eicon-banner'; }

        protected function register_controls() {
            $this->start_controls_section( 'sec_content', [ 'label' => __( 'محتوای هیرو', 'iramo-ai' ) ] );
            $this->add_control( 'badge', [ 'label' => 'برچسب بالای تیتر', 'type' => \Elementor\Controls_Manager::TEXT, 'default' => 'اکوسیستم نرم‌افزار و هوش مصنوعی فارسی' ] );
            $this->add_control( 'title', [ 'label' => 'تیتر اصلی', 'type' => \Elementor\Controls_Manager::TEXTAREA, 'default' => 'آینده کسب‌وکار شما با دستیارها و محصولات هوش مصنوعی' ] );
            $this->add_control( 'subtitle', [ 'label' => 'توضیح', 'type' => \Elementor\Controls_Manager::TEXTAREA, 'default' => 'نرم‌افزارهای آماده حسابیار و ویدئومی، دایرکتوری دست‌چین ابزارهای AI و آکادمی تخصصی آموزش و اتوماسیون در یک پلتفرم یکپارچه.' ] );
            $this->add_control( 'cta_text', [ 'label' => 'متن دکمه اول', 'type' => \Elementor\Controls_Manager::TEXT, 'default' => 'مشاهده محصولات آماده ←' ] );
            $this->add_control( 'cta_url', [ 'label' => 'لینک دکمه اول', 'type' => \Elementor\Controls_Manager::URL, 'default' => [ 'url' => '/products/' ] ] );
            $this->add_control( 'sec_cta_text', [ 'label' => 'متن دکمه دوم', 'type' => \Elementor\Controls_Manager::TEXT, 'default' => 'دایرکتوری ابزارهای AI' ] );
            $this->add_control( 'sec_cta_url', [ 'label' => 'لینک دکمه دوم', 'type' => \Elementor\Controls_Manager::URL, 'default' => [ 'url' => '/ai-tools/' ] ] );
            $this->add_control( 'image', [ 'label' => 'تصویر هیرو (اختیاری)', 'type' => \Elementor\Controls_Manager::MEDIA ] );
            $this->end_controls_section();
            $this->register_iramo_card_style_controls( '{{WRAPPER}} .iramo-hero' );
        }

        protected function render() {
            $s        = $this->get_settings_for_display();
            $custom   = ! empty( $s['image']['url'] ) ? $s['image']['url'] : '';
            $hero_img = $custom ?: ( function_exists( 'iramo_get_theme_image' ) ? iramo_get_theme_image( 'hero_iramo_desk_1794738858107.jpg' ) : '' );
            $panel    = function_exists( 'iramo_get_page_url' ) ? iramo_get_page_url( 'panel', '/panel/' ) : home_url( '/panel/' );
            ?>
            <section class="iramo-hero" dir="rtl">
                <div class="iramo-container">
                    <div class="iramo-hero-grid">
                        <div>
                            <?php if ( ! empty( $s['badge'] ) ) : ?><span class="iramo-badge">✨ <?php echo esc_html( $s['badge'] ); ?></span><?php endif; ?>
                            <h1 class="iramo-hero-title"><?php echo esc_html( $s['title'] ); ?></h1>
                            <p class="iramo-hero-subtitle"><?php echo esc_html( $s['subtitle'] ); ?></p>
                            <div class="iramo-hero-actions">
                                <a href="<?php echo esc_url( $s['cta_url']['url'] ?: home_url( '/products/' ) ); ?>" class="iramo-btn iramo-btn-accent"><?php echo esc_html( $s['cta_text'] ); ?></a>
                                <a href="<?php echo esc_url( $s['sec_cta_url']['url'] ?: home_url( '/ai-tools/' ) ); ?>" class="iramo-btn iramo-btn-outline"><?php echo esc_html( $s['sec_cta_text'] ); ?></a>
                            </div>
                            <div class="iramo-hero-proof">
                                <span>✓ اتصال بومی ووکامرس</span><span class="proof-dot">•</span>
                                <span>✓ پنل تلگرام و بله</span><span class="proof-dot">•</span>
                                <span>✓ ۱۸ ابزار دست‌چین AI</span><span class="proof-dot">•</span>
                                <span>✓ سئو کامل سمت سرور</span>
                            </div>
                        </div>
                        <?php if ( $hero_img ) : ?>
                            <div class="iramo-hero-media">
                                <img src="<?php echo esc_url( $hero_img ); ?>" alt="<?php echo esc_attr( $s['title'] ); ?>" />
                                <div class="iramo-hero-float-chip">
                                    <div>
                                        <div style="font-weight:800;">اتوماسیون حسابداری، محتوا و آموزش</div>
                                        <div style="font-size:11px;opacity:0.85;">ساخته شده برای تیم‌های ایرانی</div>
                                    </div>
                                    <a href="<?php echo esc_url( $panel ); ?>" class="iramo-price-btn" style="padding:5px 12px;font-size:11px;">ورود به پنل</a>
                                </div>
                            </div>
                        <?php endif; ?>
                    </div>
                </div>
            </section>
            <?php
        }
    }

    // 4. Products Grid Widget
    class iRamo_Widget_Products_Grid extends iRamo_Base_Widget {
        public function get_name() { return 'iramo_products_grid'; }
        public function get_title() { return __( 'گرید و ویترین محصولات (iRamoAi)', 'iramo-ai' ); }
        public function get_icon() { return 'eicon-products'; }

        protected function register_controls() {
            $this->start_controls_section( 'sec_query', [ 'label' => __( 'محتوا و چیدمان محصولات', 'iramo-ai' ) ] );
            $this->add_control( 'section_badge', [ 'label' => 'برچسب بخش', 'type' => \Elementor\Controls_Manager::TEXT, 'default' => 'محصولات نرم‌افزاری اختصاصی' ] );
            $this->add_control( 'section_title', [ 'label' => 'تیتر بخش', 'type' => \Elementor\Controls_Manager::TEXT, 'default' => 'محصولات آماده برای رشد سریع کسب‌وکار' ] );
            $this->add_control( 'source', [
                'label'   => 'منبع محصولات',
                'type'    => \Elementor\Controls_Manager::SELECT,
                'default' => 'both',
                'options' => [
                    'both'          => 'هر دو (ووکامرس + محصولات iRamo)',
                    'product'       => 'فقط محصولات ووکامرس',
                    'iramo_product' => 'فقط محصولات نرم‌افزاری iRamo',
                ],
            ] );
            $this->add_control( 'columns', [
                'label'   => 'تعداد ستون در دسکتاپ',
                'type'    => \Elementor\Controls_Manager::SELECT,
                'default' => '2',
                'options' => [ '2' => '۲ ستونه', '3' => '۳ ستونه', '4' => '۴ ستونه' ],
            ] );
            $this->add_control( 'posts_count', [ 'label' => 'تعداد نمایش', 'type' => \Elementor\Controls_Manager::NUMBER, 'default' => 4, 'min' => 1, 'max' => 24 ] );
            $this->end_controls_section();
            $this->register_iramo_card_style_controls();
        }

        protected function render() {
            $s   = $this->get_settings_for_display();
            $src = $s['source'] ?? 'both';
            $pt  = $src === 'both' ? [ 'iramo_product', 'product' ] : $src;
            $col = in_array( $s['columns'], [ '2', '3', '4' ], true ) ? $s['columns'] : '2';
            $q   = new \WP_Query( [ 'post_type' => $pt, 'post_status' => 'publish', 'posts_per_page' => (int) ( $s['posts_count'] ?? 4 ) ] );
            ?>
            <section class="iramo-section" dir="rtl">
                <div class="iramo-container">
                    <?php if ( ! empty( $s['section_title'] ) ) : ?>
                        <div class="iramo-sec-head">
                            <div>
                                <?php if ( ! empty( $s['section_badge'] ) ) : ?><span class="iramo-badge"><?php echo esc_html( $s['section_badge'] ); ?></span><?php endif; ?>
                                <h2 class="iramo-sec-title" style="margin-top:8px;"><?php echo esc_html( $s['section_title'] ); ?></h2>
                            </div>
                            <a href="<?php echo esc_url( home_url( '/products/' ) ); ?>" class="iramo-btn iramo-btn-outline" style="padding:8px 16px;font-size:13px;">مشاهده همه محصولات ←</a>
                        </div>
                    <?php endif; ?>
                    <div class="iramo-grid-<?php echo esc_attr( $col ); ?>">
                        <?php
                        if ( $q->have_posts() ) {
                            while ( $q->have_posts() ) {
                                $q->the_post();
                                if ( function_exists( 'iramo_render_product_card' ) ) iramo_render_product_card( get_the_ID() );
                            }
                            wp_reset_postdata();
                        } else {
                            echo '<article class="iramo-card" style="padding:22px;"><span class="iramo-badge">اتوماسیون مالی</span><h3 style="margin:10px 0 6px;font-size:19px;font-weight:800;">نرم‌افزار حسابیار هوشمند (OCR مالی)</h3><p style="margin:0 0 14px;font-size:13.5px;color:var(--iramo-muted);">خواندن خودکار فاکتور و فیش بانکی با هوش مصنوعی و ثبت مستقیم در اکسل و نرم‌افزارهای مالی.</p><a href="' . esc_url( home_url( '/products/' ) ) . '" class="iramo-price-btn">معرفی محصول و دمو ←</a></article>';
                            echo '<article class="iramo-card" style="padding:22px;"><span class="iramo-badge">تولید محتوای ویدیویی</span><h3 style="margin:10px 0 6px;font-size:19px;font-weight:800;">استودیو ویدئومی (زیرنویس و دوبله AI)</h3><p style="margin:0 0 14px;font-size:13.5px;color:var(--iramo-muted);">تبدیل ویدیوهای آموزشی یوتیوب و دوره‌ها به زیرنویس دقیق و دوبله فارسی هماهنگ.</p><a href="' . esc_url( home_url( '/products/' ) ) . '" class="iramo-price-btn">معرفی محصول و دمو ←</a></article>';
                        }
                        ?>
                    </div>
                </div>
            </section>
            <?php
        }
    }

    // 5. AI Tools Discovery Search Box (Home Section 3)
    class iRamo_Widget_AI_Discovery extends iRamo_Base_Widget {
        public function get_name() { return 'iramo_ai_discovery_search'; }
        public function get_title() { return __( 'موتور جستجوی دایرکتوری ابزارهای AI', 'iramo-ai' ); }
        public function get_icon() { return 'eicon-search'; }

        protected function register_controls() {
            $this->start_controls_section( 'sec_discovery', [ 'label' => __( 'محتوای باکس جستجو', 'iramo-ai' ) ] );
            $this->add_control( 'badge', [ 'label' => 'برچسب', 'type' => \Elementor\Controls_Manager::TEXT, 'default' => 'موتور جستجوی ابزارهای AI' ] );
            $this->add_control( 'title', [ 'label' => 'تیتر', 'type' => \Elementor\Controls_Manager::TEXT, 'default' => 'دایرکتوری تخصصی و بررسی ابزارهای هوش مصنوعی' ] );
            $this->add_control( 'desc', [ 'label' => 'توضیح', 'type' => \Elementor\Controls_Manager::TEXTAREA, 'default' => 'ابزار مناسب خود را بر اساس نیاز، مدل قیمت‌گذاری، ورودی/خروجی و نمونه پرامپت پیدا کنید.' ] );
            $this->add_control( 'placeholder', [ 'label' => 'متن پیش‌فرض سرچ', 'type' => \Elementor\Controls_Manager::TEXT, 'default' => 'جستجو در نام ابزار، شرکت سازنده یا کاربرد (مثلاً: ChatGPT، تولید ویدیو، کدنویسی)...' ] );
            $this->end_controls_section();
            $this->register_iramo_card_style_controls( '{{WRAPPER}} .iramo-discovery-box' );
        }

        protected function render() {
            $s         = $this->get_settings_for_display();
            $tools_url = get_post_type_archive_link( 'iramo_ai_tool' ) ?: home_url( '/ai-tools/' );
            $cats      = [
                'AI Assistant'        => 'دستیار هوشمند',
                'Art & Image'         => 'تصویر و گرافیک',
                'Video Generation'    => 'تولید ویدیو',
                'Code Assistant'      => 'برنامه‌نویسی',
                'Audio & Music'       => 'صدا و دوبله',
                'Automation & Agents' => 'اتوماسیون و ایجنت',
                'Research & Study'    => 'پژوهش و مقاله',
            ];
            ?>
            <section class="iramo-section" style="padding-top:12px;" dir="rtl">
                <div class="iramo-container">
                    <div class="iramo-discovery-box">
                        <div style="max-width:740px;">
                            <span class="iramo-badge"><?php echo esc_html( $s['badge'] ); ?></span>
                            <h2 class="iramo-sec-title" style="margin-top:8px;"><?php echo esc_html( $s['title'] ); ?></h2>
                            <p class="iramo-sec-desc"><?php echo esc_html( $s['desc'] ); ?></p>
                        </div>
                        <form action="<?php echo esc_url( $tools_url ); ?>" method="get" class="iramo-search-form">
                            <input type="search" name="q" class="iramo-input" placeholder="<?php echo esc_attr( $s['placeholder'] ); ?>" />
                            <button type="submit" class="iramo-btn iramo-btn-primary" style="white-space:nowrap;">جستجو در دایرکتوری</button>
                        </form>
                        <div class="iramo-chips">
                            <?php foreach ( $cats as $val => $label ) : ?>
                                <a href="<?php echo esc_url( add_query_arg( 'task', $val, $tools_url ) ); ?>" class="iramo-chip"><?php echo esc_html( $label ); ?></a>
                            <?php endforeach; ?>
                        </div>
                    </div>
                </div>
            </section>
            <?php
        }
    }

    // 6. Dual Bento Cards (Academy + Consulting — Home Section 4)
    class iRamo_Widget_Bento_CTA extends iRamo_Base_Widget {
        public function get_name() { return 'iramo_bento_cta'; }
        public function get_title() { return __( 'کارت‌های دوتایی آکادمی و مشاوره', 'iramo-ai' ); }
        public function get_icon() { return 'eicon-columns'; }

        protected function register_controls() {
            $this->start_controls_section( 'sec_bento', [ 'label' => __( 'محتوای دو کارت', 'iramo-ai' ) ] );
            $this->add_control( 'card1_title', [ 'label' => 'تیتر کارت آکادمی', 'type' => \Elementor\Controls_Manager::TEXT, 'default' => 'دوره‌های کاربردی هوش مصنوعی و ساخت ربات' ] );
            $this->add_control( 'card1_desc', [ 'label' => 'توضیح کارت آکادمی', 'type' => \Elementor\Controls_Manager::TEXTAREA, 'default' => 'یادگیری عملی ساخت ربات‌های تلگرام و بله، پرامپت‌نویسی مهندسی‌شده، اتوماسیون n8n و استفاده حرفه‌ای از ابزارهای AI همراه با پنل دانشجویی اختصاصی.' ] );
            $this->add_control( 'card2_title', [ 'label' => 'تیتر کارت خدمات و مشاوره', 'type' => \Elementor\Controls_Manager::TEXT, 'default' => 'طراحی ربات، اتوماسیون و پیاده‌سازی AI برای سازمان شما' ] );
            $this->add_control( 'card2_desc', [ 'label' => 'توضیح کارت خدمات و مشاوره', 'type' => \Elementor\Controls_Manager::TEXTAREA, 'default' => 'اگر برای اتصال CRM، ووکامرس، صدور خودکار فاکتور یا راه‌اندازی دستیار اختصاصی AI در تلگرام و بله به تیم فنی نیاز دارید، با مهندسان ما مشورت کنید.' ] );
            $this->end_controls_section();
            $this->register_iramo_card_style_controls();
        }

        protected function render() {
            $s            = $this->get_settings_for_display();
            $academy_url  = get_post_type_archive_link( 'iramo_course' ) ?: home_url( '/academy/' );
            $services_url = function_exists( 'iramo_get_page_url' ) ? iramo_get_page_url( 'services', '/services/' ) : home_url( '/services/' );
            $panel_url    = function_exists( 'iramo_get_page_url' ) ? iramo_get_page_url( 'panel', '/panel/' ) : home_url( '/panel/' );
            ?>
            <section class="iramo-section" style="padding-top:12px;" dir="rtl">
                <div class="iramo-container">
                    <div class="iramo-grid-2">
                        <div class="iramo-card iramo-bento-card">
                            <div>
                                <div class="iramo-bento-head">
                                    <span class="iramo-badge">آکادمی تخصصی iRamoAi</span>
                                    <span style="font-size:12px;font-weight:700;color:var(--iramo-primary);">پروژه‌محور + لایسنس</span>
                                </div>
                                <h3 style="margin:12px 0 8px;font-size:21px;font-weight:800;"><?php echo esc_html( $s['card1_title'] ); ?></h3>
                                <p style="margin:0;font-size:13.5px;color:var(--iramo-muted);line-height:1.8;"><?php echo esc_html( $s['card1_desc'] ); ?></p>
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
                                <h3 style="margin:12px 0 8px;font-size:21px;font-weight:800;"><?php echo esc_html( $s['card2_title'] ); ?></h3>
                                <p style="margin:0;font-size:13.5px;color:var(--iramo-muted);line-height:1.8;"><?php echo esc_html( $s['card2_desc'] ); ?></p>
                            </div>
                            <div style="display:flex;flex-wrap:wrap;gap:10px;">
                                <a href="<?php echo esc_url( $services_url ); ?>" class="iramo-btn iramo-btn-accent">ثبت درخواست مشاوره تخصصی ←</a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <?php
        }
    }

    // 7. Full 6-Section Single Product Landing Widget
    class iRamo_Widget_Product_Landing extends iRamo_Base_Widget {
        public function get_name() { return 'iramo_product_landing'; }
        public function get_title() { return __( 'لندینگ کامل ۶ بخشی محصول (iRamoAi)', 'iramo-ai' ); }
        public function get_icon() { return 'eicon-price-table'; }

        protected function register_controls() {
            $this->start_controls_section( 'sec_opts', [ 'label' => __( 'بخش‌های لندینگ محصول', 'iramo-ai' ) ] );
            $this->add_control( 'show_metrics', [ 'label' => 'نمایش نوار متریک‌ها', 'type' => \Elementor\Controls_Manager::SWITCHER, 'default' => 'yes' ] );
            $this->add_control( 'show_steps', [ 'label' => 'نمایش روند ۳ گام', 'type' => \Elementor\Controls_Manager::SWITCHER, 'default' => 'yes' ] );
            $this->add_control( 'show_sandbox', [ 'label' => 'نمایش شبیه‌ساز دمو', 'type' => \Elementor\Controls_Manager::SWITCHER, 'default' => 'yes' ] );
            $this->add_control( 'show_faq', [ 'label' => 'نمایش سوالات متداول', 'type' => \Elementor\Controls_Manager::SWITCHER, 'default' => 'yes' ] );
            $this->end_controls_section();
            $this->register_iramo_card_style_controls();
        }

        protected function render() {
            $s   = $this->get_settings_for_display();
            $pid = get_the_ID();
            if ( ! $pid ) return;

            $title       = get_the_title( $pid );
            $tagline     = get_post_meta( $pid, '_iramo_tagline', true ) ?: get_the_excerpt( $pid );
            $price_toman = (int) get_post_meta( $pid, '_iramo_price_toman', true );
            if ( ! $price_toman && get_post_type( $pid ) === 'product' && function_exists( 'wc_get_product' ) ) {
                $wc = wc_get_product( $pid );
                if ( $wc && $wc->get_price() !== '' ) $price_toman = (int) $wc->get_price();
            }
            $billing  = get_post_meta( $pid, '_iramo_billing_label', true ) ?: 'لایسنس دائمی + آپدیت خودکار';
            $checkout = ( get_post_type( $pid ) === 'product' && function_exists( 'wc_get_checkout_url' ) )
                ? add_query_arg( 'add-to-cart', $pid, wc_get_checkout_url() )
                : ( function_exists( 'iramo_get_page_url' ) ? iramo_get_page_url( 'panel', '/panel/' ) : home_url( '/panel/' ) );
            $thumb = get_the_post_thumbnail_url( $pid, 'large' ) ?: ( function_exists( 'iramo_get_theme_image' ) ? iramo_get_theme_image( 'hero_iramo_desk_1794738858107.jpg' ) : '' );
            ?>
            <div class="iramo-container" dir="rtl" style="display:grid;gap:26px;">
                <section class="iramo-card" style="padding:24px;">
                    <div class="iramo-hero-grid">
                        <div>
                            <span class="iramo-badge"><?php echo esc_html( $billing ); ?></span>
                            <h1 style="margin:12px 0 10px;font-size:28px;font-weight:900;"><?php echo esc_html( $title ); ?></h1>
                            <p style="margin:0 0 20px;font-size:15px;color:var(--iramo-muted);line-height:1.85;"><?php echo esc_html( $tagline ); ?></p>
                            <div style="display:flex;flex-wrap:wrap;gap:12px;align-items:center;">
                                <a href="<?php echo esc_url( $checkout ); ?>" class="iramo-price-btn" style="padding:12px 22px;font-size:14px;">
                                    <span class="price-label">خرید و دریافت فوری · <?php echo esc_html( function_exists( 'iramo_format_toman' ) ? iramo_format_toman( $price_toman ) : $price_toman ); ?></span>
                                    <span>←</span>
                                </a>
                                <?php if ( ( $s['show_sandbox'] ?? 'yes' ) === 'yes' ) : ?>
                                    <a href="#iramo-sandbox-demo" class="iramo-btn iramo-btn-outline">تست آنلاین دمو</a>
                                <?php endif; ?>
                            </div>
                        </div>
                        <?php if ( $thumb ) : ?>
                            <div class="iramo-hero-media"><img src="<?php echo esc_url( $thumb ); ?>" alt="<?php echo esc_attr( $title ); ?>" /></div>
                        <?php endif; ?>
                    </div>
                </section>

                <?php if ( ( $s['show_metrics'] ?? 'yes' ) === 'yes' ) : ?>
                    <section class="iramo-grid-4">
                        <div class="iramo-card" style="padding:18px;text-align:center;"><div style="font-size:12px;color:var(--iramo-muted);">زمان راه‌اندازی</div><div style="font-size:20px;font-weight:900;color:var(--iramo-primary);">کمتر از ۵ دقیقه</div></div>
                        <div class="iramo-card" style="padding:18px;text-align:center;"><div style="font-size:12px;color:var(--iramo-muted);">دقت و پایداری</div><div style="font-size:20px;font-weight:900;color:var(--iramo-primary);">۹۹.۴٪</div></div>
                        <div class="iramo-card" style="padding:18px;text-align:center;"><div style="font-size:12px;color:var(--iramo-muted);">ارسال لایسنس</div><div style="font-size:20px;font-weight:900;color:var(--iramo-primary);">فوری و خودکار</div></div>
                        <div class="iramo-card" style="padding:18px;text-align:center;"><div style="font-size:12px;color:var(--iramo-muted);">پشتیبانی</div><div style="font-size:20px;font-weight:900;color:var(--iramo-primary);">۲۴/۷ ربات و تیکت</div></div>
                    </section>
                <?php endif; ?>

                <?php
                $raw_body   = get_post_field( 'post_content', $pid );
                $highlights = array_values( array_filter( array_map( 'trim', explode( "\n", (string) get_post_meta( $pid, '_iramo_highlights', true ) ) ) ) );
                if ( empty( $highlights ) ) {
                    $highlights = [
                        'نصب سریع و بدون نیاز به دانش برنامه‌نویسی',
                        'اتصال خودکار به ربات تلگرام و بله پس از خرید',
                        'صدور آنی کلید لایسنس و نمایش در پنل کاربری',
                    ];
                }
                ?>
                <section class="iramo-grid-2">
                    <div class="iramo-card" style="padding:24px;">
                        <h2 style="margin:0 0 12px;font-size:20px;font-weight:800;">معرفی کامل محصول</h2>
                        <div style="font-size:14.5px;line-height:1.95;color:var(--iramo-muted);">
                            <?php echo $raw_body ? wp_kses_post( apply_filters( 'the_content', $raw_body ) ) : '<p>' . esc_html( $tagline ) . '</p>'; ?>
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

                <?php if ( ( $s['show_steps'] ?? 'yes' ) === 'yes' ) : ?>
                    <section class="iramo-card" style="padding:24px;">
                        <h2 style="margin:0 0 16px;font-size:20px;font-weight:800;">روند کار و فعال‌سازی در ۳ گام</h2>
                        <div class="iramo-grid-3">
                            <div style="padding:16px;border-radius:16px;background:var(--iramo-canvas);"><span class="iramo-badge">گام ۱</span><h3 style="margin:10px 0 6px;font-size:16px;font-weight:800;">ثبت سفارش و پرداخت</h3><p style="margin:0;font-size:13px;color:var(--iramo-muted);">پس از پرداخت در ووکامرس کلید لایسنس یکتا صادر می‌شود.</p></div>
                            <div style="padding:16px;border-radius:16px;background:var(--iramo-canvas);"><span class="iramo-badge">گام ۲</span><h3 style="margin:10px 0 6px;font-size:16px;font-weight:800;">تحویل در پنل و ربات</h3><p style="margin:0;font-size:13px;color:var(--iramo-muted);">لایسنس و دوره همراه هم در پنل و هم ربات تلگرام/بله فعال می‌شوند.</p></div>
                            <div style="padding:16px;border-radius:16px;background:var(--iramo-canvas);"><span class="iramo-badge">گام ۳</span><h3 style="margin:10px 0 6px;font-size:16px;font-weight:800;">آپدیت دائمی</h3><p style="margin:0;font-size:13px;color:var(--iramo-muted);">به‌روزرسانی‌های بعدی به‌صورت رایگان در پنل قابل دریافت است.</p></div>
                        </div>
                    </section>
                <?php endif; ?>

                <?php if ( ( $s['show_sandbox'] ?? 'yes' ) === 'yes' ) : ?>
                    <section id="iramo-sandbox-demo" class="iramo-card" style="padding:24px;" data-iramo-sandbox>
                        <h2 style="margin:0 0 8px;font-size:20px;font-weight:800;">محیط آزمایش سریع (Interactive Sandbox)</h2>
                        <div class="iramo-search-form" style="margin-top:10px;">
                            <input type="text" data-sandbox-input class="iramo-input" value="فاکتور شماره ۴۸۲۱ - تحلیل و ثبت خودکار" />
                            <button type="button" data-sandbox-run class="iramo-btn iramo-btn-primary" style="white-space:nowrap;">اجرای تست آنلاین</button>
                        </div>
                        <div data-sandbox-output></div>
                    </section>
                <?php endif; ?>

                <?php if ( ( $s['show_faq'] ?? 'yes' ) === 'yes' ) : ?>
                    <section class="iramo-card" style="padding:24px;">
                        <h2 style="margin:0 0 14px;font-size:20px;font-weight:800;">سوالات متداول</h2>
                        <div class="iramo-faq-item is-open">
                            <button type="button" class="iramo-faq-btn" data-iramo-faq-toggle><span>آیا بلافاصله پس از پرداخت دسترسی فعال می‌شود؟</span><span>+</span></button>
                            <div class="iramo-faq-body">بله؛ لایسنس و دوره آموزشی متصل به‌صورت خودکار در پنل کاربری شما فعال می‌شود.</div>
                        </div>
                    </section>
                <?php endif; ?>
            </div>
            <?php
        }
    }

    // 8. AI Tools Directory Grid with Live Filter & Search
    class iRamo_Widget_AI_Tools_Grid extends iRamo_Base_Widget {
        public function get_name() { return 'iramo_ai_tools_grid'; }
        public function get_title() { return __( 'گرید دایرکتوری ابزارهای AI + فیلتر زنده', 'iramo-ai' ); }
        public function get_icon() { return 'eicon-gallery-grid'; }

        protected function register_controls() {
            $this->start_controls_section( 'sec_tools', [ 'label' => __( 'تنظیمات دایرکتوری', 'iramo-ai' ) ] );
            $this->add_control( 'title', [ 'label' => 'تیتر دایرکتوری', 'type' => \Elementor\Controls_Manager::TEXT, 'default' => 'مجموعه تخصصی ابزارهای هوش مصنوعی' ] );
            $this->add_control( 'posts_count', [ 'label' => 'تعداد ابزارها', 'type' => \Elementor\Controls_Manager::NUMBER, 'default' => 24, 'min' => 1, 'max' => 100 ] );
            $this->add_control( 'show_filters', [ 'label' => 'نمایش جستجو و فیلتر زنده', 'type' => \Elementor\Controls_Manager::SWITCHER, 'default' => 'yes' ] );
            $this->end_controls_section();
            $this->register_iramo_card_style_controls();
        }

        protected function render() {
            $s = $this->get_settings_for_display();
            $q = new \WP_Query( [ 'post_type' => 'iramo_ai_tool', 'post_status' => 'publish', 'posts_per_page' => (int) ( $s['posts_count'] ?? 24 ) ] );
            $q_param  = sanitize_text_field( $_GET['q'] ?? '' );
            $tk_param = sanitize_text_field( $_GET['task'] ?? '' );
            echo '<div class="iramo-container" dir="rtl" data-iramo-tools-filter-root>';
            if ( ! empty( $s['title'] ) ) {
                echo '<div class="iramo-card" style="padding:22px;margin-bottom:20px;"><span class="iramo-badge">دایرکتوری تاییدشده هوش مصنوعی</span><h1 style="margin:8px 0 6px;font-size:24px;font-weight:900;">' . esc_html( $s['title'] ) . '</h1>';
                if ( ( $s['show_filters'] ?? 'yes' ) === 'yes' ) {
                    echo '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));gap:10px;margin-top:14px;">';
                    echo '<input type="search" data-filter-search class="iramo-input" value="' . esc_attr( $q_param ) . '" placeholder="جستجوی نام ابزار یا کاربرد..." />';
                    echo '<select data-filter-task class="iramo-input"><option value="">همه دسته‌بندی‌ها</option>';
                    foreach ( [ 'AI Assistant', 'Art & Image', 'Video Generation', '3D & Avatar', 'Code Assistant', 'Audio & Music', 'Data & Finance', 'Automation & Agents', 'Writing & SEO', 'Research & Study' ] as $tk ) {
                        echo '<option value="' . esc_attr( $tk ) . '" ' . selected( $tk_param, $tk, false ) . '>' . esc_html( $tk ) . '</option>';
                    }
                    echo '</select>';
                    echo '<select data-filter-pricing class="iramo-input"><option value="">همه مدل‌های تعرفه</option><option value="Free">Free</option><option value="Freemium">Freemium</option><option value="Free Trial">Free Trial</option><option value="Paid">Paid</option></select>';
                    echo '</div>';
                }
                echo '</div>';
            }
            echo '<div class="iramo-grid-3">';
            if ( $q->have_posts() ) {
                while ( $q->have_posts() ) {
                    $q->the_post();
                    if ( function_exists( 'iramo_render_tool_card' ) ) iramo_render_tool_card( get_the_ID() );
                }
                wp_reset_postdata();
            }
            echo '</div></div>';
        }
    }

    // 9. Single AI Tool Card Widget
    class iRamo_Widget_AI_Tool_Card extends iRamo_Base_Widget {
        public function get_name() { return 'iramo_ai_tool_card'; }
        public function get_title() { return __( 'کارت تکی ابزار هوش مصنوعی', 'iramo-ai' ); }
        public function get_icon() { return 'eicon-info-box'; }

        protected function register_controls() {
            $this->start_controls_section( 'sec_tool_pick', [ 'label' => __( 'انتخاب ابزار', 'iramo-ai' ) ] );
            $this->add_control( 'tool_id', [ 'label' => 'آیدی ابزار (۰ = ابزار جاری)', 'type' => \Elementor\Controls_Manager::NUMBER, 'default' => 0 ] );
            $this->end_controls_section();
            $this->register_iramo_card_style_controls();
        }

        protected function render() {
            $s   = $this->get_settings_for_display();
            $pid = (int) ( $s['tool_id'] ?: get_the_ID() );
            if ( $pid && function_exists( 'iramo_render_tool_card' ) ) {
                echo '<div dir="rtl">';
                iramo_render_tool_card( $pid );
                echo '</div>';
            }
        }
    }

    // 10. Single AI Tool Header + Try Now + Vote Widget
    class iRamo_Widget_AI_Tool_Header extends iRamo_Base_Widget {
        public function get_name() { return 'iramo_ai_tool_header'; }
        public function get_title() { return __( 'هدر ابزار AI + دکمه ورود و رأی‌گیری', 'iramo-ai' ); }
        public function get_icon() { return 'eicon-header'; }

        protected function register_controls() {
            $this->register_iramo_card_style_controls();
        }

        protected function render() {
            $pid = get_the_ID();
            if ( ! $pid ) return;
            $title    = get_the_title( $pid );
            $provider = get_post_meta( $pid, '_iramo_provider', true ) ?: 'AI Platform';
            $tagline  = get_post_meta( $pid, '_iramo_tagline', true ) ?: get_the_excerpt( $pid );
            $task     = get_post_meta( $pid, '_iramo_task', true ) ?: 'AI Assistant';
            $pop      = (int) ( get_post_meta( $pid, '_iramo_popularity', true ) ?: 94 );
            $likes    = (int) ( get_post_meta( $pid, '_iramo_likes', true ) ?: 120 );
            $dislikes = (int) ( get_post_meta( $pid, '_iramo_dislikes', true ) ?: 6 );
            $url      = get_post_meta( $pid, '_iramo_url', true ) ?: '#';
            ?>
            <section class="iramo-card" dir="rtl" style="padding:24px;">
                <div style="display:flex;flex-wrap:wrap;align-items:flex-start;justify-content:space-between;gap:18px;">
                    <div style="flex:1;min-width:250px;">
                        <div style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:10px;">
                            <span class="iramo-badge"><?php echo esc_html( $task ); ?></span>
                            <span class="iramo-meta-pill"><?php echo esc_html( $provider ); ?></span>
                            <span class="iramo-meta-pill">★ <?php echo esc_html( $pop ); ?></span>
                        </div>
                        <h1 style="margin:0 0 8px;font-size:26px;font-weight:900;"><?php echo esc_html( $title ); ?></h1>
                        <p style="margin:0;font-size:15px;color:var(--iramo-muted);line-height:1.8;"><?php echo esc_html( $tagline ); ?></p>
                    </div>
                    <div style="display:flex;flex-direction:column;gap:10px;min-width:220px;">
                        <a href="<?php echo esc_url( $url ); ?>" target="_blank" rel="noopener noreferrer" class="iramo-btn iramo-btn-accent">ورود به سایت ابزار (Try Now) ↗</a>
                        <div style="display:flex;gap:8px;">
                            <button type="button" class="iramo-btn iramo-btn-outline" style="flex:1;padding:8px 12px;font-size:12.5px;" data-iramo-tool-vote="like" data-tool-id="<?php echo esc_attr( $pid ); ?>">👍 (<span data-vote-count><?php echo esc_html( $likes ); ?></span>)</button>
                            <button type="button" class="iramo-btn iramo-btn-outline" style="flex:1;padding:8px 12px;font-size:12.5px;" data-iramo-tool-vote="dislike" data-tool-id="<?php echo esc_attr( $pid ); ?>">👎 (<span data-vote-count><?php echo esc_html( $dislikes ); ?></span>)</button>
                        </div>
                    </div>
                </div>
            </section>
            <?php
        }
    }

    // 11. AI Tool Specs Bar Widget
    class iRamo_Widget_AI_Tool_Specs extends iRamo_Base_Widget {
        public function get_name() { return 'iramo_ai_tool_specs'; }
        public function get_title() { return __( 'نوار مشخصات ابزار AI (ورودی/خروجی/قیمت)', 'iramo-ai' ); }
        public function get_icon() { return 'eicon-table'; }

        protected function register_controls() {
            $this->register_iramo_card_style_controls();
        }

        protected function render() {
            $pid = get_the_ID();
            if ( ! $pid ) return;
            $in  = get_post_meta( $pid, '_iramo_input', true ) ?: 'Text';
            $out = get_post_meta( $pid, '_iramo_output', true ) ?: 'Text';
            $pr  = get_post_meta( $pid, '_iramo_starting_price', true ) ?: ( get_post_meta( $pid, '_iramo_pricing', true ) ?: 'Freemium' );
            $api = get_post_meta( $pid, '_iramo_has_api', true ) === '1' ? 'API رسمی ✓' : 'وب‌سایت';
            ?>
            <div class="iramo-card" dir="rtl" style="padding:18px;">
                <div class="iramo-grid-4">
                    <div style="padding:10px;border-radius:12px;background:var(--iramo-canvas);"><div style="font-size:11.5px;color:var(--iramo-subtle);">ورودی (Accepts)</div><strong><?php echo esc_html( $in ); ?></strong></div>
                    <div style="padding:10px;border-radius:12px;background:var(--iramo-canvas);"><div style="font-size:11.5px;color:var(--iramo-subtle);">خروجی (Produces)</div><strong><?php echo esc_html( $out ); ?></strong></div>
                    <div style="padding:10px;border-radius:12px;background:var(--iramo-canvas);"><div style="font-size:11.5px;color:var(--iramo-subtle);">تعرفه (Pricing)</div><strong><?php echo esc_html( $pr ); ?></strong></div>
                    <div style="padding:10px;border-radius:12px;background:var(--iramo-canvas);"><div style="font-size:11.5px;color:var(--iramo-subtle);">دسترسی فنی</div><strong><?php echo esc_html( $api ); ?></strong></div>
                </div>
            </div>
            <?php
        }
    }

    // 12. AI Tool Workflow & Copyable Prompt Widget
    class iRamo_Widget_AI_Tool_Workflow extends iRamo_Base_Widget {
        public function get_name() { return 'iramo_ai_tool_workflow'; }
        public function get_title() { return __( 'مراحل استفاده و نمونه پرامپت ابزار AI', 'iramo-ai' ); }
        public function get_icon() { return 'eicon-editor-code'; }

        protected function register_controls() {
            $this->register_iramo_card_style_controls();
        }

        protected function render() {
            $pid    = get_the_ID();
            if ( ! $pid ) return;
            $steps  = array_values( array_filter( array_map( 'trim', explode( "\n", (string) get_post_meta( $pid, '_iramo_steps', true ) ) ) ) );
            $prompt = get_post_meta( $pid, '_iramo_sample_prompt', true );
            echo '<div dir="rtl" style="display:grid;gap:16px;">';
            if ( ! empty( $steps ) ) {
                echo '<div class="iramo-card" style="padding:20px;"><h3 style="margin:0 0 12px;font-size:18px;font-weight:800;">مراحل استفاده</h3><div style="display:grid;gap:8px;">';
                foreach ( $steps as $i => $st ) {
                    echo '<div style="display:flex;gap:10px;align-items:center;"><span class="iramo-badge">' . esc_html( $i + 1 ) . '</span><span>' . esc_html( $st ) . '</span></div>';
                }
                echo '</div></div>';
            }
            if ( $prompt ) {
                echo '<div class="iramo-card" style="padding:20px;"><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;"><h3 style="margin:0;font-size:17px;font-weight:800;">نمونه پرامپت</h3><button type="button" class="iramo-btn iramo-btn-accent" style="padding:5px 12px;font-size:12px;" data-iramo-copy-prompt="' . esc_attr( $prompt ) . '">کپی پرامپت</button></div><div class="iramo-prompt-box">' . esc_html( $prompt ) . '</div></div>';
            }
            echo '</div>';
        }
    }

    // 13. AI Tool Key Features Widget
    class iRamo_Widget_AI_Tool_Features extends iRamo_Base_Widget {
        public function get_name() { return 'iramo_ai_tool_features'; }
        public function get_title() { return __( 'ویژگی‌های کلیدی ابزار AI', 'iramo-ai' ); }
        public function get_icon() { return 'eicon-bullet-list'; }

        protected function register_controls() {
            $this->register_iramo_card_style_controls();
        }

        protected function render() {
            $pid          = get_the_ID();
            if ( ! $pid ) return;
            $body         = get_post_field( 'post_content', $pid );
            $pricing_info = get_post_meta( $pid, '_iramo_pricing_details', true );
            $features     = array_values( array_filter( array_map( 'trim', explode( "\n", (string) get_post_meta( $pid, '_iramo_features', true ) ) ) ) );
            $audience     = array_values( array_filter( array_map( 'trim', explode( "\n", (string) get_post_meta( $pid, '_iramo_audience', true ) ) ) ) );
            echo '<div dir="rtl" style="display:grid;gap:16px;">';
            if ( $body || $pricing_info ) {
                echo '<div class="iramo-card" style="padding:20px;"><h3 style="margin:0 0 10px;font-size:18px;font-weight:800;">معرفی و بررسی کامل ابزار</h3>';
                if ( $body ) {
                    echo '<div style="font-size:14px;line-height:1.95;color:var(--iramo-muted);">' . wp_kses_post( apply_filters( 'the_content', $body ) ) . '</div>';
                }
                if ( $pricing_info ) {
                    echo '<div style="margin-top:14px;padding:12px 14px;border-radius:12px;background:var(--iramo-primary-soft);border:1px solid var(--iramo-border);font-size:13px;"><strong>جزئیات تعرفه:</strong> ' . esc_html( $pricing_info ) . '</div>';
                }
                echo '</div>';
            }
            if ( ! empty( $features ) ) {
                echo '<div class="iramo-card" style="padding:20px;"><h3 style="margin:0 0 12px;font-size:18px;font-weight:800;">ویژگی‌های کلیدی</h3><div class="iramo-grid-2">';
                foreach ( $features as $f ) {
                    echo '<div style="padding:10px 12px;border-radius:12px;background:var(--iramo-canvas);font-size:13.5px;">✓ ' . esc_html( $f ) . '</div>';
                }
                echo '</div></div>';
            }
            if ( ! empty( $audience ) ) {
                echo '<div class="iramo-card" style="padding:20px;"><h3 style="margin:0 0 12px;font-size:17px;font-weight:800;">مناسب برای چه کسانی؟</h3><div class="iramo-chips">';
                foreach ( $audience as $aud ) {
                    echo '<span class="iramo-chip is-active">' . esc_html( $aud ) . '</span>';
                }
                echo '</div></div>';
            }
            echo '</div>';
        }
    }

    // 14. Academy Courses Grid Widget
    class iRamo_Widget_Courses_Grid extends iRamo_Base_Widget {
        public function get_name() { return 'iramo_courses_grid'; }
        public function get_title() { return __( 'گرید دوره‌های آکادمی (iRamoAi)', 'iramo-ai' ); }
        public function get_icon() { return 'eicon-graduation-cap'; }

        protected function register_controls() {
            $this->start_controls_section( 'sec_courses', [ 'label' => __( 'تنظیمات دوره‌ها', 'iramo-ai' ) ] );
            $this->add_control( 'title', [ 'label' => 'تیتر بخش', 'type' => \Elementor\Controls_Manager::TEXT, 'default' => 'دوره‌های آموزشی هوش مصنوعی و اتوماسیون' ] );
            $this->add_control( 'posts_count', [ 'label' => 'تعداد دوره‌ها', 'type' => \Elementor\Controls_Manager::NUMBER, 'default' => 6, 'min' => 1, 'max' => 24 ] );
            $this->end_controls_section();
            $this->register_iramo_card_style_controls();
        }

        protected function render() {
            $s = $this->get_settings_for_display();
            $q = new \WP_Query( [ 'post_type' => 'iramo_course', 'post_status' => 'publish', 'posts_per_page' => (int) ( $s['posts_count'] ?? 6 ) ] );
            echo '<div class="iramo-container" dir="rtl">';
            if ( ! empty( $s['title'] ) ) {
                echo '<div class="iramo-card" style="padding:22px;margin-bottom:20px;"><span class="iramo-badge">آکادمی تخصصی iRamoAi</span><h1 style="margin:8px 0 0;font-size:24px;font-weight:900;">' . esc_html( $s['title'] ) . '</h1></div>';
            }
            echo '<div class="iramo-grid-3">';
            if ( $q->have_posts() ) {
                while ( $q->have_posts() ) {
                    $q->the_post();
                    if ( function_exists( 'iramo_render_course_card' ) ) iramo_render_course_card( get_the_ID() );
                }
                wp_reset_postdata();
            }
            echo '</div></div>';
        }
    }

    // 15. Articles Grid Widget
    class iRamo_Widget_Articles_Grid extends iRamo_Base_Widget {
        public function get_name() { return 'iramo_articles_grid'; }
        public function get_title() { return __( 'گرید مقالات و ابزارک‌ها (iRamoAi)', 'iramo-ai' ); }
        public function get_icon() { return 'eicon-posts-grid'; }

        protected function register_controls() {
            $this->start_controls_section( 'sec_articles', [ 'label' => __( 'تنظیمات مقالات', 'iramo-ai' ) ] );
            $this->add_control( 'title', [ 'label' => 'تیتر بخش', 'type' => \Elementor\Controls_Manager::TEXT, 'default' => 'مقالات تخصصی هوش مصنوعی و اتوماسیون' ] );
            $this->add_control( 'posts_count', [ 'label' => 'تعداد مقالات', 'type' => \Elementor\Controls_Manager::NUMBER, 'default' => 6, 'min' => 1, 'max' => 24 ] );
            $this->end_controls_section();
            $this->register_iramo_card_style_controls();
        }

        protected function render() {
            $s = $this->get_settings_for_display();
            $q = new \WP_Query( [ 'post_type' => [ 'iramo_article', 'post' ], 'post_status' => 'publish', 'posts_per_page' => (int) ( $s['posts_count'] ?? 6 ) ] );
            echo '<div class="iramo-container" dir="rtl">';
            if ( ! empty( $s['title'] ) ) {
                echo '<div class="iramo-card" style="padding:22px;margin-bottom:20px;"><span class="iramo-badge">مقالات و ابزارک‌های کاربردی</span><h1 style="margin:8px 0 0;font-size:24px;font-weight:900;">' . esc_html( $s['title'] ) . '</h1></div>';
            }
            echo '<div class="iramo-grid-3">';
            if ( $q->have_posts() ) {
                while ( $q->have_posts() ) {
                    $q->the_post();
                    if ( function_exists( 'iramo_render_article_card' ) ) iramo_render_article_card( get_the_ID() );
                }
                wp_reset_postdata();
            }
            echo '</div></div>';
        }
    }

    // 16. Consultation & Services Form Widget
    class iRamo_Widget_Consultation_Form extends iRamo_Base_Widget {
        public function get_name() { return 'iramo_consultation_form'; }
        public function get_title() { return __( 'خدمات و فرم مشاوره متصل به ربات (iRamoAi)', 'iramo-ai' ); }
        public function get_icon() { return 'eicon-form-horizontal'; }

        protected function register_controls() {
            $this->start_controls_section( 'sec_form', [ 'label' => __( 'تنظیمات فرم مشاوره', 'iramo-ai' ) ] );
            $this->add_control( 'title', [ 'label' => 'تیتر فرم', 'type' => \Elementor\Controls_Manager::TEXT, 'default' => 'ثبت درخواست مشاوره و سفارش پروژه' ] );
            $this->add_control( 'subtitle', [ 'label' => 'زیرعنوان', 'type' => \Elementor\Controls_Manager::TEXT, 'default' => 'درخواست شما بلافاصله در پنل مدیریت و ربات تلگرام/بله ادمین ارسال می‌شود.' ] );
            $this->end_controls_section();
            $this->register_iramo_card_style_controls();
        }

        protected function render() {
            $s = $this->get_settings_for_display();
            ?>
            <section class="iramo-container" dir="rtl">
                <div class="iramo-grid-2">
                    <div style="display:grid;gap:14px;">
                        <div class="iramo-card" style="padding:20px;"><h3 style="margin:0 0 6px;font-size:17px;font-weight:800;">۱. ساخت ربات فروش و پشتیبانی تلگرام و بله</h3><p style="margin:0;font-size:13.5px;color:var(--iramo-muted);">اتصال مستقیم ووکامرس، احراز هویت OTP و صدور لایسنس.</p></div>
                        <div class="iramo-card" style="padding:20px;"><h3 style="margin:0 0 6px;font-size:17px;font-weight:800;">۲. اتوماسیون مالی، OCR و پردازش اسناد</h3><p style="margin:0;font-size:13.5px;color:var(--iramo-muted);">استخراج خودکار اطلاعات فاکتورها و گزارش‌ها در اکسل و CRM.</p></div>
                        <div class="iramo-card" style="padding:20px;"><h3 style="margin:0 0 6px;font-size:17px;font-weight:800;">۳. مشاوره معماری و پیاده‌سازی ایجنت‌های AI</h3><p style="margin:0;font-size:13.5px;color:var(--iramo-muted);">راه‌اندازی پایپ‌لاین‌های n8n و دستیارهای اختصاصی تیم.</p></div>
                    </div>
                    <div class="iramo-card" style="padding:24px;">
                        <h2 style="margin:0 0 8px;font-size:20px;font-weight:800;"><?php echo esc_html( $s['title'] ); ?></h2>
                        <p style="margin:0 0 16px;font-size:13px;color:var(--iramo-muted);"><?php echo esc_html( $s['subtitle'] ); ?></p>
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
                </div>
            </section>
            <?php
        }
    }

    // 17. Student LMS Portal React App Widget (/panel/)
    class iRamo_Widget_LMS_Dashboard extends iRamo_Base_Widget {
        public function get_name() { return 'iramo_lms_dashboard'; }
        public function get_title() { return __( 'پنل کاربری و آموزش (Student LMS)', 'iramo-ai' ); }
        public function get_icon() { return 'eicon-apps'; }

        protected function register_controls() {
            $this->start_controls_section( 'section_config', [ 'label' => __( 'تنظیمات پنل دانشجو', 'iramo-ai' ) ] );
            $this->add_control( 'default_view', [
                'label'   => __( 'نمای پیش‌فرض', 'iramo-ai' ),
                'type'    => \Elementor\Controls_Manager::SELECT,
                'default' => 'panel',
                'options' => [
                    'panel'  => __( 'پنل دانشجو و دوره‌ها (پیشنهادی)', 'iramo-ai' ),
                    'course' => __( 'کتابخانه دوره‌ها', 'iramo-ai' ),
                    'home'   => __( 'وب‌سایت کامل در شورت‌کد', 'iramo-ai' ),
                ],
            ] );
            $this->add_control( 'default_theme', [
                'label'   => __( 'تم پنل', 'iramo-ai' ),
                'type'    => \Elementor\Controls_Manager::SELECT,
                'default' => 'light',
                'options' => [ 'light' => 'روشن مدرن', 'dark' => 'زمردی تیره' ],
            ] );
            $this->end_controls_section();
        }

        protected function render() {
            $s = $this->get_settings_for_display();
            echo do_shortcode( sprintf(
                '[iramo_lms theme="%s" view="%s"]',
                esc_attr( $s['default_theme'] ),
                esc_attr( $s['default_view'] )
            ) );
        }
    }

    $widgets_manager->register( new iRamo_Widget_Header_Nav() );
    $widgets_manager->register( new iRamo_Widget_Footer_Box() );
    $widgets_manager->register( new iRamo_Widget_Hero() );
    $widgets_manager->register( new iRamo_Widget_Products_Grid() );
    $widgets_manager->register( new iRamo_Widget_AI_Discovery() );
    $widgets_manager->register( new iRamo_Widget_Bento_CTA() );
    $widgets_manager->register( new iRamo_Widget_Product_Landing() );
    $widgets_manager->register( new iRamo_Widget_AI_Tools_Grid() );
    $widgets_manager->register( new iRamo_Widget_AI_Tool_Card() );
    $widgets_manager->register( new iRamo_Widget_AI_Tool_Header() );
    $widgets_manager->register( new iRamo_Widget_AI_Tool_Specs() );
    $widgets_manager->register( new iRamo_Widget_AI_Tool_Workflow() );
    $widgets_manager->register( new iRamo_Widget_AI_Tool_Features() );
    $widgets_manager->register( new iRamo_Widget_Courses_Grid() );
    $widgets_manager->register( new iRamo_Widget_Articles_Grid() );
    $widgets_manager->register( new iRamo_Widget_Consultation_Form() );
    $widgets_manager->register( new iRamo_Widget_LMS_Dashboard() );
} );
