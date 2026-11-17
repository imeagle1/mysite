<?php
/**
 * Module: 11 Native Elementor & Elementor Pro Widgets for iRamoAi
 * Each widget includes both Content Controls and Elementor Style Controls (Typography, Colors, Border, Shadow).
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

    // Shared Style Controls Trait-like helper for Elementor Widgets
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
                'label'     => __( 'رنگ پس‌زمینه کارت', 'iramo-ai' ),
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
                'label'      => __( 'گردی گوشه کارت', 'iramo-ai' ),
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

    // 1. Hero Section Widget
    class iRamo_Widget_Hero extends iRamo_Base_Widget {
        public function get_name() { return 'iramo_hero'; }
        public function get_title() { return __( 'هیرو صفحه اصلی (iRamoAi Hero)', 'iramo-ai' ); }
        public function get_icon() { return 'eicon-banner'; }

        protected function register_controls() {
            $this->start_controls_section( 'sec_content', [ 'label' => __( 'محتوای هیرو', 'iramo-ai' ) ] );
            $this->add_control( 'badge', [ 'label' => 'برچسب بالای تیتر', 'type' => \Elementor\Controls_Manager::TEXT, 'default' => 'اکوسیستم نرم‌افزار و هوش مصنوعی فارسی' ] );
            $this->add_control( 'title', [ 'label' => 'تیتر اصلی', 'type' => \Elementor\Controls_Manager::TEXTAREA, 'default' => 'آینده کسب‌وکار شما با دستیارها و محصولات هوش مصنوعی' ] );
            $this->add_control( 'subtitle', [ 'label' => 'توضیح', 'type' => \Elementor\Controls_Manager::TEXTAREA, 'default' => 'نرم‌افزارهای آماده حسابیار و ویدئومی، دایرکتوری دست‌چین ابزارهای AI و آکادمی تخصصی آموزش.' ] );
            $this->add_control( 'cta_text', [ 'label' => 'متن دکمه اول', 'type' => \Elementor\Controls_Manager::TEXT, 'default' => 'مشاهده محصولات ←' ] );
            $this->add_control( 'cta_url', [ 'label' => 'لینک دکمه اول', 'type' => \Elementor\Controls_Manager::URL, 'default' => [ 'url' => '/products/' ] ] );
            $this->add_control( 'sec_cta_text', [ 'label' => 'متن دکمه دوم', 'type' => \Elementor\Controls_Manager::TEXT, 'default' => 'دایرکتوری ابزارهای AI' ] );
            $this->add_control( 'sec_cta_url', [ 'label' => 'لینک دکمه دوم', 'type' => \Elementor\Controls_Manager::URL, 'default' => [ 'url' => '/ai-tools/' ] ] );
            $this->end_controls_section();

            $this->register_iramo_card_style_controls( '{{WRAPPER}} .iramo-hero' );
        }

        protected function render() {
            $s = $this->get_settings_for_display();
            $hero_img = function_exists( 'iramo_get_theme_image' ) ? iramo_get_theme_image( 'hero_iramo_desk_1794738858107.jpg' ) : '';
            ?>
            <section class="iramo-hero" dir="rtl">
                <div class="iramo-container">
                    <div class="iramo-hero-grid">
                        <div>
                            <?php if ( ! empty( $s['badge'] ) ) : ?><span class="iramo-badge">✨ <?php echo esc_html( $s['badge'] ); ?></span><?php endif; ?>
                            <h1 class="iramo-hero-title"><?php echo esc_html( $s['title'] ); ?></h1>
                            <p class="iramo-hero-subtitle"><?php echo esc_html( $s['subtitle'] ); ?></p>
                            <div class="iramo-hero-actions">
                                <a href="<?php echo esc_url( $s['cta_url']['url'] ?: '/products/' ); ?>" class="iramo-btn iramo-btn-accent"><?php echo esc_html( $s['cta_text'] ); ?></a>
                                <a href="<?php echo esc_url( $s['sec_cta_url']['url'] ?: '/ai-tools/' ); ?>" class="iramo-btn iramo-btn-outline"><?php echo esc_html( $s['sec_cta_text'] ); ?></a>
                            </div>
                        </div>
                        <?php if ( $hero_img ) : ?>
                            <div class="iramo-hero-media">
                                <img src="<?php echo esc_url( $hero_img ); ?>" alt="<?php echo esc_attr( $s['title'] ); ?>" />
                            </div>
                        <?php endif; ?>
                    </div>
                </div>
            </section>
            <?php
        }
    }

    // 2. Products Grid / Showcase Widget
    class iRamo_Widget_Products_Grid extends iRamo_Base_Widget {
        public function get_name() { return 'iramo_products_grid'; }
        public function get_title() { return __( 'گرید و اسلایدر محصولات (iRamoAi)', 'iramo-ai' ); }
        public function get_icon() { return 'eicon-products'; }

        protected function register_controls() {
            $this->start_controls_section( 'sec_query', [ 'label' => __( 'منبع و چیدمان محصولات', 'iramo-ai' ) ] );
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
            $this->add_control( 'posts_count', [
                'label'   => 'تعداد نمایش',
                'type'    => \Elementor\Controls_Manager::NUMBER,
                'default' => 4,
                'min'     => 1,
                'max'     => 24,
            ] );
            $this->end_controls_section();
            $this->register_iramo_card_style_controls();
        }

        protected function render() {
            $s   = $this->get_settings_for_display();
            $src = $s['source'] ?? 'both';
            $pt  = $src === 'both' ? [ 'iramo_product', 'product' ] : $src;
            $col = in_array( $s['columns'], [ '2', '3', '4' ], true ) ? $s['columns'] : '2';
            $q   = new \WP_Query( [
                'post_type'      => $pt,
                'post_status'    => 'publish',
                'posts_per_page' => (int) ( $s['posts_count'] ?? 4 ),
            ] );
            echo '<div class="iramo-grid-' . esc_attr( $col ) . '" dir="rtl">';
            if ( $q->have_posts() ) {
                while ( $q->have_posts() ) {
                    $q->the_post();
                    if ( function_exists( 'iramo_render_product_card' ) ) {
                        iramo_render_product_card( get_the_ID() );
                    }
                }
                wp_reset_postdata();
            }
            echo '</div>';
        }
    }

    // 3. Single Product Metrics, Pricing & Highlights Widget
    class iRamo_Widget_Product_Landing extends iRamo_Base_Widget {
        public function get_name() { return 'iramo_product_landing'; }
        public function get_title() { return __( 'متریک‌ها، قیمت و سندباکس محصول', 'iramo-ai' ); }
        public function get_icon() { return 'eicon-price-table'; }

        protected function register_controls() {
            $this->start_controls_section( 'sec_opts', [ 'label' => __( 'بخش‌های نمایش', 'iramo-ai' ) ] );
            $this->add_control( 'show_metrics', [ 'label' => 'نمایش متریک‌ها', 'type' => \Elementor\Controls_Manager::SWITCHER, 'default' => 'yes' ] );
            $this->add_control( 'show_sandbox', [ 'label' => 'نمایش شبیه‌ساز دمو', 'type' => \Elementor\Controls_Manager::SWITCHER, 'default' => 'yes' ] );
            $this->end_controls_section();
            $this->register_iramo_card_style_controls();
        }

        protected function render() {
            $s   = $this->get_settings_for_display();
            $pid = get_the_ID();
            if ( ! $pid ) {
                return;
            }
            $price   = (int) get_post_meta( $pid, '_iramo_price_toman', true );
            $billing = get_post_meta( $pid, '_iramo_billing_label', true ) ?: 'لایسنس دائمی';
            echo '<div dir="rtl" style="display:grid;gap:18px;">';
            echo '<div class="iramo-card" style="padding:20px;display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:12px;">';
            echo '<div><span class="iramo-badge">' . esc_html( $billing ) . '</span><h3 style="margin:8px 0 0;font-size:20px;font-weight:800;">' . esc_html( get_the_title( $pid ) ) . '</h3></div>';
            echo '<span class="iramo-price-btn">' . esc_html( function_exists( 'iramo_format_toman' ) ? iramo_format_toman( $price ) : $price . ' تومان' ) . '</span>';
            echo '</div>';
            if ( $s['show_sandbox'] === 'yes' ) {
                echo '<div class="iramo-card" style="padding:20px;" data-iramo-sandbox><h4 style="margin:0 0 10px;font-size:16px;font-weight:800;">محیط آزمایش سریع</h4><div class="iramo-search-form" style="margin:0;"><input type="text" data-sandbox-input class="iramo-input" value="نمونه آزمایشی محصول" /><button type="button" data-sandbox-run class="iramo-btn iramo-btn-primary">اجرای تست</button></div><div data-sandbox-output style="margin-top:10px;"></div></div>';
            }
            echo '</div>';
        }
    }

    // 4. AI Tools Directory Grid with Live Filter & Search Widget
    class iRamo_Widget_AI_Tools_Grid extends iRamo_Base_Widget {
        public function get_name() { return 'iramo_ai_tools_grid'; }
        public function get_title() { return __( 'گرید ابزارهای هوش مصنوعی + فیلتر زنده', 'iramo-ai' ); }
        public function get_icon() { return 'eicon-gallery-grid'; }

        protected function register_controls() {
            $this->start_controls_section( 'sec_tools', [ 'label' => __( 'تنظیمات دایرکتوری ابزارها', 'iramo-ai' ) ] );
            $this->add_control( 'posts_count', [ 'label' => 'تعداد ابزارها', 'type' => \Elementor\Controls_Manager::NUMBER, 'default' => 18, 'min' => 1, 'max' => 100 ] );
            $this->add_control( 'show_filters', [ 'label' => 'نمایش باکس جستجو و فیلتر زنده', 'type' => \Elementor\Controls_Manager::SWITCHER, 'default' => 'yes' ] );
            $this->end_controls_section();
            $this->register_iramo_card_style_controls();
        }

        protected function render() {
            $s = $this->get_settings_for_display();
            $q = new \WP_Query( [
                'post_type'      => 'iramo_ai_tool',
                'post_status'    => 'publish',
                'posts_per_page' => (int) ( $s['posts_count'] ?? 18 ),
            ] );
            echo '<div dir="rtl" data-iramo-tools-filter-root>';
            if ( $s['show_filters'] === 'yes' ) {
                echo '<div class="iramo-card" style="padding:16px;margin-bottom:18px;display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:10px;">';
                echo '<input type="search" data-filter-search class="iramo-input" placeholder="جستجوی نام ابزار یا کاربرد..." />';
                echo '<select data-filter-pricing class="iramo-input"><option value="">همه مدل‌های تعرفه</option><option value="Free">Free</option><option value="Freemium">Freemium</option><option value="Free Trial">Free Trial</option><option value="Paid">Paid</option></select>';
                echo '</div>';
            }
            echo '<div class="iramo-grid-3">';
            if ( $q->have_posts() ) {
                while ( $q->have_posts() ) {
                    $q->the_post();
                    if ( function_exists( 'iramo_render_tool_card' ) ) {
                        iramo_render_tool_card( get_the_ID() );
                    }
                }
                wp_reset_postdata();
            }
            echo '</div></div>';
        }
    }

    // 5. Single AI Tool Card Widget
    class iRamo_Widget_AI_Tool_Card extends iRamo_Base_Widget {
        public function get_name() { return 'iramo_ai_tool_card'; }
        public function get_title() { return __( 'کارت تکی ابزار هوش مصنوعی', 'iramo-ai' ); }
        public function get_icon() { return 'eicon-info-box'; }

        protected function register_controls() {
            $this->start_controls_section( 'sec_tool_pick', [ 'label' => __( 'انتخاب ابزار', 'iramo-ai' ) ] );
            $this->add_control( 'tool_id', [ 'label' => 'آیدی پست ابزار (خالی = ابزار جاری)', 'type' => \Elementor\Controls_Manager::NUMBER, 'default' => 0 ] );
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

    // 6. AI Tool Specs Bar Widget (Input / Output / Pricing / API)
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
            $pr  = get_post_meta( $pid, '_iramo_pricing', true ) ?: 'Freemium';
            $api = get_post_meta( $pid, '_iramo_has_api', true ) === '1' ? 'API رسمی ✓' : 'بدون API';
            ?>
            <div class="iramo-card" dir="rtl" style="padding:18px;">
                <div class="iramo-grid-4">
                    <div><div style="font-size:11.5px;color:var(--iramo-subtle);">ورودی</div><strong><?php echo esc_html( $in ); ?></strong></div>
                    <div><div style="font-size:11.5px;color:var(--iramo-subtle);">خروجی</div><strong><?php echo esc_html( $out ); ?></strong></div>
                    <div><div style="font-size:11.5px;color:var(--iramo-subtle);">مدل قیمت</div><strong><?php echo esc_html( $pr ); ?></strong></div>
                    <div><div style="font-size:11.5px;color:var(--iramo-subtle);">API</div><strong><?php echo esc_html( $api ); ?></strong></div>
                </div>
            </div>
            <?php
        }
    }

    // 7. AI Tool Workflow Steps & Copyable Sample Prompt
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

    // 8. AI Tool Key Features & Audience
    class iRamo_Widget_AI_Tool_Features extends iRamo_Base_Widget {
        public function get_name() { return 'iramo_ai_tool_features'; }
        public function get_title() { return __( 'ویژگی‌های کلیدی ابزار AI', 'iramo-ai' ); }
        public function get_icon() { return 'eicon-bullet-list'; }

        protected function register_controls() {
            $this->register_iramo_card_style_controls();
        }

        protected function render() {
            $pid      = get_the_ID();
            if ( ! $pid ) return;
            $features = array_values( array_filter( array_map( 'trim', explode( "\n", (string) get_post_meta( $pid, '_iramo_features', true ) ) ) ) );
            if ( empty( $features ) ) return;
            echo '<div class="iramo-card" dir="rtl" style="padding:20px;"><h3 style="margin:0 0 12px;font-size:18px;font-weight:800;">ویژگی‌های کلیدی</h3><div class="iramo-grid-2">';
            foreach ( $features as $f ) {
                echo '<div style="padding:10px 12px;border-radius:12px;background:var(--iramo-canvas);font-size:13.5px;">✓ ' . esc_html( $f ) . '</div>';
            }
            echo '</div></div>';
        }
    }

    // 9. Academy Courses Grid
    class iRamo_Widget_Courses_Grid extends iRamo_Base_Widget {
        public function get_name() { return 'iramo_courses_grid'; }
        public function get_title() { return __( 'گرید دوره‌های آکادمی (iRamoAi)', 'iramo-ai' ); }
        public function get_icon() { return 'eicon-graduation-cap'; }

        protected function register_controls() {
            $this->start_controls_section( 'sec_courses', [ 'label' => __( 'تنظیمات دوره‌ها', 'iramo-ai' ) ] );
            $this->add_control( 'posts_count', [ 'label' => 'تعداد دوره‌ها', 'type' => \Elementor\Controls_Manager::NUMBER, 'default' => 6, 'min' => 1, 'max' => 24 ] );
            $this->end_controls_section();
            $this->register_iramo_card_style_controls();
        }

        protected function render() {
            $s = $this->get_settings_for_display();
            $q = new \WP_Query( [
                'post_type'      => 'iramo_course',
                'post_status'    => 'publish',
                'posts_per_page' => (int) ( $s['posts_count'] ?? 6 ),
            ] );
            echo '<div class="iramo-grid-3" dir="rtl">';
            if ( $q->have_posts() ) {
                while ( $q->have_posts() ) {
                    $q->the_post();
                    if ( function_exists( 'iramo_render_course_card' ) ) {
                        iramo_render_course_card( get_the_ID() );
                    }
                }
                wp_reset_postdata();
            }
            echo '</div>';
        }
    }

    // 10. Articles Grid Widget
    class iRamo_Widget_Articles_Grid extends iRamo_Base_Widget {
        public function get_name() { return 'iramo_articles_grid'; }
        public function get_title() { return __( 'گرید مقالات و ابزارک‌ها (iRamoAi)', 'iramo-ai' ); }
        public function get_icon() { return 'eicon-posts-grid'; }

        protected function register_controls() {
            $this->start_controls_section( 'sec_articles', [ 'label' => __( 'تنظیمات مقالات', 'iramo-ai' ) ] );
            $this->add_control( 'posts_count', [ 'label' => 'تعداد مقالات', 'type' => \Elementor\Controls_Manager::NUMBER, 'default' => 6, 'min' => 1, 'max' => 24 ] );
            $this->end_controls_section();
            $this->register_iramo_card_style_controls();
        }

        protected function render() {
            $s = $this->get_settings_for_display();
            $q = new \WP_Query( [
                'post_type'      => [ 'iramo_article', 'post' ],
                'post_status'    => 'publish',
                'posts_per_page' => (int) ( $s['posts_count'] ?? 6 ),
            ] );
            echo '<div class="iramo-grid-3" dir="rtl">';
            if ( $q->have_posts() ) {
                while ( $q->have_posts() ) {
                    $q->the_post();
                    if ( function_exists( 'iramo_render_article_card' ) ) {
                        iramo_render_article_card( get_the_ID() );
                    }
                }
                wp_reset_postdata();
            }
            echo '</div>';
        }
    }

    // 11. Student LMS Portal App Widget (Isolates React LMS Dashboard for /panel/)
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
                    'panel'    => __( 'پنل دانشجو و دوره‌ها (پیشنهادی)', 'iramo-ai' ),
                    'course'   => __( 'کتابخانه دوره‌ها', 'iramo-ai' ),
                    'home'     => __( 'وب‌سایت کامل در شورت‌کد', 'iramo-ai' ),
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

    $widgets_manager->register( new iRamo_Widget_Hero() );
    $widgets_manager->register( new iRamo_Widget_Products_Grid() );
    $widgets_manager->register( new iRamo_Widget_Product_Landing() );
    $widgets_manager->register( new iRamo_Widget_AI_Tools_Grid() );
    $widgets_manager->register( new iRamo_Widget_AI_Tool_Card() );
    $widgets_manager->register( new iRamo_Widget_AI_Tool_Specs() );
    $widgets_manager->register( new iRamo_Widget_AI_Tool_Workflow() );
    $widgets_manager->register( new iRamo_Widget_AI_Tool_Features() );
    $widgets_manager->register( new iRamo_Widget_Courses_Grid() );
    $widgets_manager->register( new iRamo_Widget_Articles_Grid() );
    $widgets_manager->register( new iRamo_Widget_LMS_Dashboard() );
} );
