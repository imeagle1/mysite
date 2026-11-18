<?php
/**
 * Module: 28 Granular Atomic & Full-Featured Elementor Widgets for iRamoAi
 * Allows pixel-accurate ZLM-style drag-and-drop editing of every badge, heading,
 * button, proof strip, menu, footer column, social row, AI tool part & product section
 * built strictly with standard WordPress + Elementor + WooCommerce templates.
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

if ( ! function_exists( 'iramo_plugin_brand_wordmark_html' ) ) {
    function iramo_plugin_brand_wordmark_html( $raw_title = 'iRamoAi' ) {
        $title = trim( (string) ( $raw_title ?: 'iRamoAi' ) );
        if ( strpos( $title, '.' ) !== false ) {
            $parts = explode( '.', $title, 2 );
            return '<span dir="ltr">' . esc_html( $parts[0] ) . '<span class="accent-ai">.' . esc_html( $parts[1] ) . '</span></span>';
        }
        if ( preg_match( '/^(.+?)(ai)$/i', $title, $m ) ) {
            return '<span dir="ltr">' . esc_html( $m[1] ) . '<span class="accent-ai">' . esc_html( $m[2] ) . '</span></span>';
        }
        return '<span dir="ltr">' . esc_html( $title ) . '</span>';
    }
}

add_action( 'elementor/elements/categories_registered', function( $elements_manager ) {
    $elements_manager->add_category( 'iramo-ai', [
        'title' => __( 'ابزارک‌های اختصاصی iRamoAi', 'iramo-ai' ),
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

        protected function register_iramo_card_style_controls( $selector = '{{WRAPPER}} .iramo-card', $label = 'استایل باکس و تایپوگرافی' ) {
            $this->start_controls_section( 'section_style_cards', [
                'label' => __( $label, 'iramo-ai' ),
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
                'selectors' => [ '{{WRAPPER}} h1, {{WRAPPER}} h2, {{WRAPPER}} h3, {{WRAPPER}} h4' => 'color: {{VALUE}};' ],
            ] );

            $this->add_control( 'body_text_color', [
                'label'     => __( 'رنگ متن‌ها', 'iramo-ai' ),
                'type'      => \Elementor\Controls_Manager::COLOR,
                'selectors' => [ '{{WRAPPER}} p, {{WRAPPER}} li, {{WRAPPER}} span' => 'color: {{VALUE}};' ],
            ] );

            $this->add_group_control( \Elementor\Group_Control_Typography::get_type(), [
                'name'     => 'heading_typography',
                'label'    => __( 'تایپوگرافی تیترها', 'iramo-ai' ),
                'selector' => '{{WRAPPER}} h1, {{WRAPPER}} h2, {{WRAPPER}} h3, {{WRAPPER}} h4',
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

            $this->add_responsive_control( 'card_padding', [
                'label'      => __( 'فاصله داخلی (Padding)', 'iramo-ai' ),
                'type'       => \Elementor\Controls_Manager::DIMENSIONS,
                'size_units' => [ 'px', 'em', '%' ],
                'selectors'  => [ $selector => 'padding: {{TOP}}{{UNIT}} {{RIGHT}}{{UNIT}} {{BOTTOM}}{{UNIT}} {{LEFT}}{{UNIT}};' ],
            ] );

            $this->add_group_control( \Elementor\Group_Control_Box_Shadow::get_type(), [
                'name'     => 'card_box_shadow',
                'selector' => $selector,
            ] );

            $this->end_controls_section();
        }

        protected function get_loop_item_options() {
            $opts  = [ '' => 'کارت پیش‌فرض قالب (سریع)' ];
            $posts = get_posts( [
                'post_type'      => 'elementor_library',
                'post_status'    => 'publish',
                'meta_key'       => '_elementor_template_type',
                'meta_value'     => 'loop-item',
                'posts_per_page' => 30,
            ] );
            foreach ( $posts as $lp ) {
                $opts[ (string) $lp->ID ] = $lp->post_title;
            }
            return $opts;
        }
    }

    // =========================================================================
    // PART A: ATOMIC GRANULAR WIDGETS (12 Widgets)
    // =========================================================================

    // 1. Atomic Logo + Brand Widget
    class iRamo_Widget_Logo extends iRamo_Base_Widget {
        public function get_name() { return 'iramo_logo'; }
        public function get_title() { return __( 'لوگو و نام برند iRamoAi', 'iramo-ai' ); }
        public function get_icon() { return 'eicon-site-logo'; }

        protected function register_controls() {
            $this->start_controls_section( 'sec_logo', [ 'label' => __( 'تنظیمات لوگو', 'iramo-ai' ) ] );
            $this->add_control( 'brand_name', [ 'label' => 'نام برند', 'type' => \Elementor\Controls_Manager::TEXT, 'default' => 'iRamoAi' ] );
            $this->add_control( 'show_brand_text', [ 'label' => 'نمایش متن برند کنار لوگو', 'type' => \Elementor\Controls_Manager::SWITCHER, 'default' => 'yes' ] );
            $this->add_control( 'custom_logo', [ 'label' => 'تصویر لوگوی اختصاصی (اختیاری)', 'type' => \Elementor\Controls_Manager::MEDIA ] );
            $this->add_control( 'link_url', [ 'label' => 'لینک لوگو', 'type' => \Elementor\Controls_Manager::URL, 'default' => [ 'url' => '/' ] ] );
            $this->end_controls_section();

            $this->start_controls_section( 'sec_logo_style', [ 'label' => 'استایل لوگو و متن', 'tab' => \Elementor\Controls_Manager::TAB_STYLE ] );
            $this->add_responsive_control( 'logo_height', [
                'label' => 'ارتفاع لوگو (px)',
                'type' => \Elementor\Controls_Manager::SLIDER,
                'range' => [ 'px' => [ 'min' => 18, 'max' => 64 ] ],
                'selectors' => [ '{{WRAPPER}} .iramo-logo-img' => 'height: {{SIZE}}{{UNIT}};' ],
            ] );
            $this->add_control( 'brand_color', [
                'label' => 'رنگ متن برند',
                'type' => \Elementor\Controls_Manager::COLOR,
                'selectors' => [ '{{WRAPPER}} .iramo-brand-text' => 'color: {{VALUE}};' ],
            ] );
            $this->add_group_control( \Elementor\Group_Control_Typography::get_type(), [
                'name' => 'brand_typo',
                'selector' => '{{WRAPPER}} .iramo-brand-text',
            ] );
            $this->end_controls_section();
        }

        protected function render() {
            $s          = $this->get_settings_for_display();
            $brand      = $s['brand_name'] ?: 'iRamoAi';
            $custom     = ! empty( $s['custom_logo']['url'] ) ? $s['custom_logo']['url'] : '';
            $img_fn     = function_exists( 'iramo_get_theme_image' );
            $logo_light = $custom ?: ( $img_fn ? iramo_get_theme_image( 'Group_179_659a031b.png' ) : '' );
            $logo_dark  = $custom ?: ( $img_fn ? iramo_get_theme_image( 'logo_brand_19b8e3d7.png' ) : '' );
            $url        = ! empty( $s['link_url']['url'] ) ? $s['link_url']['url'] : home_url( '/' );
            ?>
            <a href="<?php echo esc_url( $url ); ?>" class="iramo-logo-link">
                <?php if ( $logo_light ) : ?>
                    <img src="<?php echo esc_url( $logo_light ); ?>" alt="<?php echo esc_attr( $brand ); ?>" class="iramo-logo-img iramo-logo-light" />
                    <img src="<?php echo esc_url( $logo_dark ); ?>" alt="<?php echo esc_attr( $brand ); ?>" class="iramo-logo-img iramo-logo-dark" />
                <?php endif; ?>
                <?php if ( ( $s['show_brand_text'] ?? 'yes' ) === 'yes' ) : ?>
                    <span class="iramo-brand-text"><?php echo iramo_plugin_brand_wordmark_html( $brand ); ?></span>
                <?php endif; ?>
            </a>
            <?php
        }
    }

    // 2. Atomic Nav Menu Widget (Desktop Pill Nav + Mobile Drawer)
    class iRamo_Widget_Nav_Menu extends iRamo_Base_Widget {
        public function get_name() { return 'iramo_nav_menu'; }
        public function get_title() { return __( 'منوی ناوبری iRamoAi (+ موبایل)', 'iramo-ai' ); }
        public function get_icon() { return 'eicon-nav-menu'; }

        protected function register_controls() {
            $menus = wp_get_nav_menus();
            $opts  = [ '' => 'منوی پیش‌فرض قالب (primary)' ];
            if ( is_array( $menus ) ) {
                foreach ( $menus as $m ) {
                    $opts[ $m->slug ] = $m->name;
                }
            }
            $this->start_controls_section( 'sec_nav', [ 'label' => __( 'انتخاب منو', 'iramo-ai' ) ] );
            $this->add_control( 'menu_slug', [ 'label' => 'منوی وردپرس', 'type' => \Elementor\Controls_Manager::SELECT, 'default' => '', 'options' => $opts ] );
            $this->add_control( 'render_mobile_drawer', [ 'label' => 'تولید کشوی منوی موبایل', 'type' => \Elementor\Controls_Manager::SWITCHER, 'default' => 'yes' ] );
            $this->end_controls_section();

            $this->start_controls_section( 'sec_nav_style', [ 'label' => 'استایل لینک‌های منو', 'tab' => \Elementor\Controls_Manager::TAB_STYLE ] );
            $this->add_control( 'link_color', [ 'label' => 'رنگ عادی', 'type' => \Elementor\Controls_Manager::COLOR, 'selectors' => [ '{{WRAPPER}} .iramo-nav-list a' => 'color: {{VALUE}};' ] ] );
            $this->add_control( 'link_active_color', [ 'label' => 'رنگ فعال و هاور', 'type' => \Elementor\Controls_Manager::COLOR, 'selectors' => [ '{{WRAPPER}} .iramo-nav-list a:hover, {{WRAPPER}} .iramo-nav-list .current-menu-item > a' => 'color: {{VALUE}};' ] ] );
            $this->add_control( 'link_active_bg', [ 'label' => 'پس‌زمینه فعال و هاور', 'type' => \Elementor\Controls_Manager::COLOR, 'selectors' => [ '{{WRAPPER}} .iramo-nav-list a:hover, {{WRAPPER}} .iramo-nav-list .current-menu-item > a' => 'background-color: {{VALUE}};' ] ] );
            $this->add_group_control( \Elementor\Group_Control_Typography::get_type(), [ 'name' => 'nav_typo', 'selector' => '{{WRAPPER}} .iramo-nav-list a' ] );
            $this->end_controls_section();
        }

        protected function render() {
            $s            = $this->get_settings_for_display();
            $menu_slug    = $s['menu_slug'] ?? '';
            $has_wc       = function_exists( 'iramo_has_woocommerce_account' ) && iramo_has_woocommerce_account();
            $account_url  = function_exists( 'iramo_get_account_url' ) ? iramo_get_account_url() : home_url( '/services/' );
            $articles_url = function_exists( 'iramo_get_page_url' ) ? iramo_get_page_url( 'articles', '/articles/' ) : home_url( '/articles/' );
            $services_url = function_exists( 'iramo_get_page_url' ) ? iramo_get_page_url( 'services', '/services/' ) : home_url( '/services/' );
            $fallback_li  = '<li><a href="' . esc_url( home_url( '/products/' ) ) . '">محصولات</a></li>'
                . '<li><a href="' . esc_url( home_url( '/academy/' ) ) . '">دوره‌های آموزشی</a></li>'
                . '<li><a href="' . esc_url( home_url( '/ai-tools/' ) ) . '">ابزارهای هوش مصنوعی</a></li>'
                . '<li><a href="' . esc_url( $articles_url ) . '">مقالات</a></li>'
                . '<li><a href="' . esc_url( $services_url ) . '">خدمات و مشاوره</a></li>';
            ?>
            <nav aria-label="منوی اصلی سایت">
                <?php
                if ( $menu_slug ) {
                    wp_nav_menu( [ 'menu' => $menu_slug, 'container' => false, 'menu_class' => 'iramo-nav-list', 'depth' => 1 ] );
                } elseif ( has_nav_menu( 'primary' ) ) {
                    wp_nav_menu( [ 'theme_location' => 'primary', 'container' => false, 'menu_class' => 'iramo-nav-list', 'depth' => 1 ] );
                } else {
                    echo '<ul class="iramo-nav-list">' . $fallback_li . '</ul>';
                }
                ?>
            </nav>
            <?php if ( ( $s['render_mobile_drawer'] ?? 'yes' ) === 'yes' ) : ?>
                <div class="iramo-mobile-drawer" data-iramo-mobile-drawer>
                    <?php
                    if ( $menu_slug ) {
                        wp_nav_menu( [ 'menu' => $menu_slug, 'container' => false, 'depth' => 1 ] );
                    } elseif ( has_nav_menu( 'primary' ) ) {
                        wp_nav_menu( [ 'theme_location' => 'primary', 'container' => false, 'depth' => 1 ] );
                    } else {
                        $extra_wc_li = $has_wc ? '<li><a href="' . esc_url( $account_url ) . '">حساب کاربری و سفارش‌ها</a></li>' : '';
                        echo '<ul><li><a href="' . esc_url( home_url( '/' ) ) . '">صفحه اصلی</a></li>' . $fallback_li . $extra_wc_li . '</ul>';
                    }
                    ?>
                </div>
            <?php endif;
        }
    }

    // 3. Atomic Header Actions (Theme Switcher + Account/Consultation CTA + Hamburger)
    class iRamo_Widget_Header_Actions extends iRamo_Base_Widget {
        public function get_name() { return 'iramo_header_actions'; }
        public function get_title() { return __( 'دکمه‌های هدر (تم + حساب/مشاوره + موبایل)', 'iramo-ai' ); }
        public function get_icon() { return 'eicon-button'; }

        protected function register_controls() {
            $this->start_controls_section( 'sec_hact', [ 'label' => __( 'تنظیمات دکمه‌های هدر', 'iramo-ai' ) ] );
            $this->add_control( 'show_theme_toggle', [ 'label' => 'دکمه تغییر تم روشن/تیره', 'type' => \Elementor\Controls_Manager::SWITCHER, 'default' => 'yes' ] );
            $this->add_control( 'show_cta', [ 'label' => 'دکمه اصلی هدر', 'type' => \Elementor\Controls_Manager::SWITCHER, 'default' => 'yes' ] );
            $this->add_control( 'cta_text', [ 'label' => 'متن دکمه دسکتاپ (خالی = خودکار)', 'type' => \Elementor\Controls_Manager::TEXT, 'default' => '' ] );
            $this->add_control( 'cta_short', [ 'label' => 'متن کوتاه موبایل (خالی = خودکار)', 'type' => \Elementor\Controls_Manager::TEXT, 'default' => '' ] );
            $this->add_control( 'cta_url', [ 'label' => 'لینک دکمه (خالی = حساب ووکامرس / مشاوره)', 'type' => \Elementor\Controls_Manager::URL ] );
            $this->add_control( 'show_mobile_toggle', [ 'label' => 'دکمه همبرگری موبایل', 'type' => \Elementor\Controls_Manager::SWITCHER, 'default' => 'yes' ] );
            $this->end_controls_section();

            $this->start_controls_section( 'sec_hact_style', [ 'label' => 'استایل دکمه اصلی هدر', 'tab' => \Elementor\Controls_Manager::TAB_STYLE ] );
            $this->add_control( 'cta_bg', [ 'label' => 'رنگ پس‌زمینه دکمه', 'type' => \Elementor\Controls_Manager::COLOR, 'selectors' => [ '{{WRAPPER}} .iramo-panel-cta' => 'background-color: {{VALUE}};' ] ] );
            $this->add_control( 'cta_color', [ 'label' => 'رنگ متن دکمه', 'type' => \Elementor\Controls_Manager::COLOR, 'selectors' => [ '{{WRAPPER}} .iramo-panel-cta' => 'color: {{VALUE}};' ] ] );
            $this->add_group_control( \Elementor\Group_Control_Typography::get_type(), [ 'name' => 'cta_typo', 'selector' => '{{WRAPPER}} .iramo-panel-cta' ] );
            $this->end_controls_section();
        }

        protected function render() {
            $s          = $this->get_settings_for_display();
            $has_wc     = function_exists( 'iramo_has_woocommerce_account' ) && iramo_has_woocommerce_account();
            $auto_url   = function_exists( 'iramo_get_account_url' ) ? iramo_get_account_url() : home_url( '/services/' );
            $cta_url    = ! empty( $s['cta_url']['url'] ) ? $s['cta_url']['url'] : $auto_url;
            $auto_full  = $has_wc ? ( is_user_logged_in() ? 'حساب کاربری' : 'ورود / حساب کاربری' ) : 'درخواست مشاوره';
            $auto_short = $has_wc ? ( is_user_logged_in() ? 'حساب من' : 'ورود / حساب' ) : 'مشاوره';
            $full_label = ! empty( trim( (string) ( $s['cta_text'] ?? '' ) ) ) ? $s['cta_text'] : $auto_full;
            $short_lbl  = ! empty( trim( (string) ( $s['cta_short'] ?? '' ) ) ) ? $s['cta_short'] : $auto_short;
            ?>
            <div class="iramo-header-actions">
                <?php if ( ( $s['show_theme_toggle'] ?? 'yes' ) === 'yes' ) : ?>
                    <button type="button" class="iramo-icon-btn" data-iramo-theme-toggle aria-label="تغییر تم روشن و تیره" title="تغییر تم">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
                    </button>
                <?php endif; ?>
                <?php if ( ( $s['show_cta'] ?? 'yes' ) === 'yes' ) : ?>
                    <a href="<?php echo esc_url( $cta_url ); ?>" class="iramo-panel-cta">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" x2="3" y1="12" y2="12"/></svg>
                        <span class="label-full"><?php echo esc_html( $full_label ); ?></span>
                        <span class="label-short"><?php echo esc_html( $short_lbl ); ?></span>
                    </a>
                <?php endif; ?>
                <?php if ( ( $s['show_mobile_toggle'] ?? 'yes' ) === 'yes' ) : ?>
                    <button type="button" class="iramo-icon-btn iramo-menu-toggle" data-iramo-menu-toggle aria-label="منوی موبایل" aria-expanded="false">
                        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
                    </button>
                <?php endif; ?>
            </div>
            <?php
        }
    }

    // 4. Atomic Pill Badge Widget
    class iRamo_Widget_Badge extends iRamo_Base_Widget {
        public function get_name() { return 'iramo_badge'; }
        public function get_title() { return __( 'نشان / برچسب کپسولی iRamoAi', 'iramo-ai' ); }
        public function get_icon() { return 'eicon-info-circle-o'; }

        protected function register_controls() {
            $this->start_controls_section( 'sec_badge', [ 'label' => 'محتوای برچسب' ] );
            $this->add_control( 'text', [ 'label' => 'متن برچسب', 'type' => \Elementor\Controls_Manager::TEXT, 'default' => '✨ اکوسیستم نرم‌افزار و هوش مصنوعی فارسی', 'dynamic' => [ 'active' => true ] ] );
            $this->add_control( 'sub_label', [ 'label' => 'متن کناری اختیاری (مثل پروژه‌محور)', 'type' => \Elementor\Controls_Manager::TEXT, 'default' => '', 'dynamic' => [ 'active' => true ] ] );
            $this->add_responsive_control( 'align', [
                'label' => 'چیدمان',
                'type' => \Elementor\Controls_Manager::CHOOSE,
                'options' => [
                    'flex-start' => [ 'title' => 'راست', 'icon' => 'eicon-text-align-right' ],
                    'center' => [ 'title' => 'وسط', 'icon' => 'eicon-text-align-center' ],
                    'space-between' => [ 'title' => 'دوطرفه', 'icon' => 'eicon-text-align-justify' ],
                ],
                'selectors' => [ '{{WRAPPER}} .iramo-bento-head' => 'justify-content: {{VALUE}};' ],
            ] );
            $this->end_controls_section();

            $this->start_controls_section( 'sec_badge_style', [ 'label' => 'استایل برچسب', 'tab' => \Elementor\Controls_Manager::TAB_STYLE ] );
            $this->add_control( 'badge_bg', [ 'label' => 'رنگ پس‌زمینه', 'type' => \Elementor\Controls_Manager::COLOR, 'selectors' => [ '{{WRAPPER}} .iramo-badge' => 'background-color: {{VALUE}};' ] ] );
            $this->add_control( 'badge_color', [ 'label' => 'رنگ متن', 'type' => \Elementor\Controls_Manager::COLOR, 'selectors' => [ '{{WRAPPER}} .iramo-badge' => 'color: {{VALUE}};' ] ] );
            $this->add_control( 'badge_border', [ 'label' => 'رنگ حاشیه', 'type' => \Elementor\Controls_Manager::COLOR, 'selectors' => [ '{{WRAPPER}} .iramo-badge' => 'border-color: {{VALUE}};' ] ] );
            $this->add_group_control( \Elementor\Group_Control_Typography::get_type(), [ 'name' => 'badge_typo', 'selector' => '{{WRAPPER}} .iramo-badge' ] );
            $this->end_controls_section();
        }

        protected function render() {
            $s = $this->get_settings_for_display();
            if ( empty( $s['text'] ) && empty( $s['sub_label'] ) ) return;
            echo '<div class="iramo-bento-head">';
            if ( ! empty( $s['text'] ) ) {
                echo '<span class="iramo-badge">' . esc_html( $s['text'] ) . '</span>';
            }
            if ( ! empty( $s['sub_label'] ) ) {
                echo '<span style="font-size:12px;font-weight:700;color:var(--iramo-primary);">' . esc_html( $s['sub_label'] ) . '</span>';
            }
            echo '</div>';
        }
    }

    // 5. Atomic Button Group Widget (Repeater)
    class iRamo_Widget_Button_Group extends iRamo_Base_Widget {
        public function get_name() { return 'iramo_button_group'; }
        public function get_title() { return __( 'گروه دکمه‌های تاکیدی iRamoAi', 'iramo-ai' ); }
        public function get_icon() { return 'eicon-dual-button'; }

        protected function register_controls() {
            $this->start_controls_section( 'sec_btns', [ 'label' => 'دکمه‌ها' ] );
            $rep = new \Elementor\Repeater();
            $rep->add_control( 'label', [ 'label' => 'متن دکمه', 'type' => \Elementor\Controls_Manager::TEXT, 'default' => 'مشاهده محصولات آماده ←' ] );
            $rep->add_control( 'url', [ 'label' => 'لینک دکمه', 'type' => \Elementor\Controls_Manager::URL, 'default' => [ 'url' => '/products/' ] ] );
            $rep->add_control( 'variant', [
                'label' => 'استایل دکمه',
                'type' => \Elementor\Controls_Manager::SELECT,
                'default' => 'accent',
                'options' => [
                    'accent'  => 'تاکیدی زرد برند (#FFBA00)',
                    'primary' => 'سبز زمردی اصلی (#059669)',
                    'outline' => 'حاشیه‌دار شفاف (Outline)',
                ],
            ] );
            $this->add_control( 'buttons', [
                'label' => 'لیست دکمه‌ها',
                'type' => \Elementor\Controls_Manager::REPEATER,
                'fields' => $rep->get_controls(),
                'title_field' => '{{{ label }}}',
                'default' => [
                    [ 'label' => 'مشاهده محصولات آماده ←', 'url' => [ 'url' => '/products/' ], 'variant' => 'accent' ],
                ],
            ] );
            $this->end_controls_section();

            $this->start_controls_section( 'sec_btns_style', [ 'label' => 'استایل دکمه‌ها', 'tab' => \Elementor\Controls_Manager::TAB_STYLE ] );
            $this->add_group_control( \Elementor\Group_Control_Typography::get_type(), [ 'name' => 'btn_typo', 'selector' => '{{WRAPPER}} .iramo-btn' ] );
            $this->add_responsive_control( 'btn_radius', [
                'label' => 'گردی گوشه‌ها',
                'type' => \Elementor\Controls_Manager::DIMENSIONS,
                'size_units' => [ 'px', '%' ],
                'selectors' => [ '{{WRAPPER}} .iramo-btn' => 'border-radius: {{TOP}}{{UNIT}} {{RIGHT}}{{UNIT}} {{BOTTOM}}{{UNIT}} {{LEFT}}{{UNIT}};' ],
            ] );
            $this->add_responsive_control( 'btn_padding', [
                'label' => 'فاصله داخلی دکمه',
                'type' => \Elementor\Controls_Manager::DIMENSIONS,
                'size_units' => [ 'px', 'em' ],
                'selectors' => [ '{{WRAPPER}} .iramo-btn' => 'padding: {{TOP}}{{UNIT}} {{RIGHT}}{{UNIT}} {{BOTTOM}}{{UNIT}} {{LEFT}}{{UNIT}};' ],
            ] );
            $this->end_controls_section();
        }

        protected function render() {
            $s    = $this->get_settings_for_display();
            $list = $s['buttons'] ?? [];
            if ( empty( $list ) ) return;
            echo '<div class="iramo-hero-actions" style="margin-bottom:0;">';
            foreach ( $list as $btn ) {
                $cls = 'iramo-btn iramo-btn-' . ( in_array( $btn['variant'], [ 'accent', 'primary', 'outline' ], true ) ? $btn['variant'] : 'accent' );
                $url = ! empty( $btn['url']['url'] ) ? $btn['url']['url'] : '#';
                $tgt = ! empty( $btn['url']['is_external'] ) ? ' target="_blank" rel="noopener noreferrer"' : '';
                echo '<a href="' . esc_url( $url ) . '"' . $tgt . ' class="' . esc_attr( $cls ) . '">' . esc_html( $btn['label'] ) . '</a>';
            }
            echo '</div>';
        }
    }

    // 6. Atomic Hero Proof / Feature Strip Widget (Repeater)
    class iRamo_Widget_Proof_List extends iRamo_Base_Widget {
        public function get_name() { return 'iramo_proof_list'; }
        public function get_title() { return __( 'نوار تیک‌های اعتماد و مزایا', 'iramo-ai' ); }
        public function get_icon() { return 'eicon-check-circle-o'; }

        protected function register_controls() {
            $this->start_controls_section( 'sec_proof', [ 'label' => 'آیتم‌های اعتماد' ] );
            $rep = new \Elementor\Repeater();
            $rep->add_control( 'text', [ 'label' => 'متن آیتم', 'type' => \Elementor\Controls_Manager::TEXT, 'default' => '✓ اتصال بومی ووکامرس' ] );
            $this->add_control( 'items', [
                'label' => 'موارد نوار اعتماد',
                'type' => \Elementor\Controls_Manager::REPEATER,
                'fields' => $rep->get_controls(),
                'title_field' => '{{{ text }}}',
                'default' => [
                    [ 'text' => '✓ اتصال بومی ووکامرس' ],
                    [ 'text' => '✓ پنل تلگرام و بله' ],
                    [ 'text' => '✓ ۱۸ ابزار دست‌چین AI' ],
                    [ 'text' => '✓ سئو کامل سمت سرور' ],
                ],
            ] );
            $this->end_controls_section();

            $this->start_controls_section( 'sec_proof_style', [ 'label' => 'استایل متن‌ها', 'tab' => \Elementor\Controls_Manager::TAB_STYLE ] );
            $this->add_control( 'text_color', [ 'label' => 'رنگ متن', 'type' => \Elementor\Controls_Manager::COLOR, 'selectors' => [ '{{WRAPPER}} .iramo-hero-proof' => 'color: {{VALUE}};' ] ] );
            $this->add_control( 'border_color', [ 'label' => 'رنگ خط جداکننده بالا', 'type' => \Elementor\Controls_Manager::COLOR, 'selectors' => [ '{{WRAPPER}} .iramo-hero-proof' => 'border-top-color: {{VALUE}};' ] ] );
            $this->add_group_control( \Elementor\Group_Control_Typography::get_type(), [ 'name' => 'proof_typo', 'selector' => '{{WRAPPER}} .iramo-hero-proof' ] );
            $this->end_controls_section();
        }

        protected function render() {
            $s     = $this->get_settings_for_display();
            $items = $s['items'] ?? [];
            if ( empty( $items ) ) return;
            echo '<div class="iramo-hero-proof" style="margin-top:22px;">';
            $total = count( $items );
            foreach ( $items as $idx => $item ) {
                echo '<span>' . esc_html( $item['text'] ) . '</span>';
                if ( $idx < $total - 1 ) {
                    echo '<span class="proof-dot">•</span>';
                }
            }
            echo '</div>';
        }
    }

    // 7. Atomic Hero Media Box + Floating Glass Card Widget
    class iRamo_Widget_Hero_Media_Box extends iRamo_Base_Widget {
        public function get_name() { return 'iramo_hero_media_box'; }
        public function get_title() { return __( 'باکس تصویر هیرو + کارت شناور', 'iramo-ai' ); }
        public function get_icon() { return 'eicon-image'; }

        protected function register_controls() {
            $this->start_controls_section( 'sec_hm', [ 'label' => 'تصویر و کارت شناور' ] );
            $this->add_control( 'image', [ 'label' => 'تصویر اصلی (خالی = تصویر پیش‌فرض تم)', 'type' => \Elementor\Controls_Manager::MEDIA ] );
            $this->add_control( 'image_alt', [ 'label' => 'متن جایگزین (Alt)', 'type' => \Elementor\Controls_Manager::TEXT, 'default' => 'میز کار هوشمند iRamoAi' ] );
            $this->add_control( 'show_float_chip', [ 'label' => 'نمایش کارت شناور روی تصویر', 'type' => \Elementor\Controls_Manager::SWITCHER, 'default' => 'yes' ] );
            $this->add_control( 'chip_title', [ 'label' => 'تیتر کارت شناور', 'type' => \Elementor\Controls_Manager::TEXT, 'default' => 'اتوماسیون حسابداری، محتوا و آموزش' ] );
            $this->add_control( 'chip_sub', [ 'label' => 'زیرنویس کارت شناور', 'type' => \Elementor\Controls_Manager::TEXT, 'default' => 'ساخته شده برای تیم‌های ایرانی' ] );
            $this->add_control( 'chip_cta_text', [ 'label' => 'متن دکمه کارت شناور', 'type' => \Elementor\Controls_Manager::TEXT, 'default' => 'مشاهده محصولات' ] );
            $this->add_control( 'chip_cta_url', [ 'label' => 'لینک دکمه کارت شناور', 'type' => \Elementor\Controls_Manager::URL, 'default' => [ 'url' => '/products/' ] ] );
            $this->end_controls_section();

            $this->register_iramo_card_style_controls( '{{WRAPPER}} .iramo-hero-media', 'استایل قاب تصویر' );
        }

        protected function render() {
            $s        = $this->get_settings_for_display();
            $custom   = ! empty( $s['image']['url'] ) ? $s['image']['url'] : '';
            $img      = $custom ?: ( function_exists( 'iramo_get_theme_image' ) ? iramo_get_theme_image( 'hero_iramo_desk_1794738858107.jpg' ) : '' );
            $chip_url = ! empty( $s['chip_cta_url']['url'] ) ? $s['chip_cta_url']['url'] : home_url( '/products/' );
            if ( ! $img ) return;
            ?>
            <div class="iramo-hero-media">
                <img src="<?php echo esc_url( $img ); ?>" alt="<?php echo esc_attr( $s['image_alt'] ?: 'iRamoAi' ); ?>" />
                <?php if ( ( $s['show_float_chip'] ?? 'yes' ) === 'yes' ) : ?>
                    <div class="iramo-hero-float-chip">
                        <div>
                            <div style="font-weight:800;"><?php echo esc_html( $s['chip_title'] ); ?></div>
                            <div style="font-size:11px;opacity:0.85;"><?php echo esc_html( $s['chip_sub'] ); ?></div>
                        </div>
                        <?php if ( ! empty( $s['chip_cta_text'] ) ) : ?>
                            <a href="<?php echo esc_url( $chip_url ); ?>" class="iramo-price-btn" style="padding:5px 12px;font-size:11px;"><?php echo esc_html( $s['chip_cta_text'] ); ?></a>
                        <?php endif; ?>
                    </div>
                <?php endif; ?>
            </div>
            <?php
        }
    }

    // 8. Atomic Social Links Row Widget (Repeater)
    class iRamo_Widget_Social_Links extends iRamo_Base_Widget {
        public function get_name() { return 'iramo_social_links'; }
        public function get_title() { return __( 'آیکون‌های شبکه اجتماعی iRamoAi', 'iramo-ai' ); }
        public function get_icon() { return 'eicon-social-icons'; }

        protected function register_controls() {
            $this->start_controls_section( 'sec_social', [ 'label' => 'شبکه‌های اجتماعی' ] );
            $rep = new \Elementor\Repeater();
            $rep->add_control( 'network', [
                'label' => 'پلتفرم',
                'type' => \Elementor\Controls_Manager::SELECT,
                'default' => 'telegram',
                'options' => [
                    'telegram'  => 'تلگرام',
                    'bale'      => 'بله',
                    'instagram' => 'اینستاگرام',
                    'youtube'   => 'یوتیوب',
                    'github'    => 'گیت‌هاب',
                    'linkedin'  => 'لینکدین',
                    'link'      => 'وب‌سایت / لینک دلخواه',
                ],
            ] );
            $rep->add_control( 'label', [ 'label' => 'عنوان (Tooltip)', 'type' => \Elementor\Controls_Manager::TEXT, 'default' => 'تلگرام' ] );
            $rep->add_control( 'url', [ 'label' => 'آدرس لینک', 'type' => \Elementor\Controls_Manager::URL, 'default' => [ 'url' => 'https://t.me/iRamoBot' ] ] );
            $this->add_control( 'socials', [
                'label' => 'لیست شبکه‌ها',
                'type' => \Elementor\Controls_Manager::REPEATER,
                'fields' => $rep->get_controls(),
                'title_field' => '{{{ label }}}',
                'default' => [
                    [ 'network' => 'telegram', 'label' => 'تلگرام', 'url' => [ 'url' => 'https://t.me/iRamoBot' ] ],
                    [ 'network' => 'bale', 'label' => 'پیام‌رسان بله', 'url' => [ 'url' => 'https://ble.ir/iRamoBaleBot' ] ],
                    [ 'network' => 'instagram', 'label' => 'اینستاگرام', 'url' => [ 'url' => 'https://instagram.com' ] ],
                    [ 'network' => 'youtube', 'label' => 'یوتیوب', 'url' => [ 'url' => 'https://youtube.com' ] ],
                    [ 'network' => 'github', 'label' => 'گیت‌هاب', 'url' => [ 'url' => 'https://github.com' ] ],
                    [ 'network' => 'linkedin', 'label' => 'لینکدین', 'url' => [ 'url' => 'https://linkedin.com' ] ],
                ],
            ] );
            $this->end_controls_section();

            $this->start_controls_section( 'sec_social_style', [ 'label' => 'استایل آیکون‌ها', 'tab' => \Elementor\Controls_Manager::TAB_STYLE ] );
            $this->add_control( 'icon_bg', [ 'label' => 'پس‌زمینه دکمه', 'type' => \Elementor\Controls_Manager::COLOR, 'selectors' => [ '{{WRAPPER}} .iramo-social-btn' => 'background-color: {{VALUE}};' ] ] );
            $this->add_control( 'icon_color', [ 'label' => 'رنگ آیکون', 'type' => \Elementor\Controls_Manager::COLOR, 'selectors' => [ '{{WRAPPER}} .iramo-social-btn' => 'color: {{VALUE}};' ] ] );
            $this->end_controls_section();
        }

        protected function render() {
            $s    = $this->get_settings_for_display();
            $list = $s['socials'] ?? [];
            if ( empty( $list ) ) return;
            $svgs = [
                'telegram'  => '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M21.5 3.5 2.8 10.7c-.9.3-.8 1.6.1 1.9l4.7 1.5 1.8 5.5c.3.8 1.3 1 1.9.4l2.7-2.7 4.9 3.6c.7.5 1.7.1 1.9-.8l2.7-15.2c.2-.9-.7-1.6-1.5-1.3Z"/><path d="m8 14 9.5-7"/></svg>',
                'bale'      => '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5Z"/><path d="m9.5 12 1.8 1.8 3.5-3.6"/></svg>',
                'instagram' => '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".8" fill="currentColor"/></svg>',
                'youtube'   => '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/><path d="m10 15 5-3-5-3v6Z" fill="currentColor" stroke="none"/></svg>',
                'github'    => '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>',
                'linkedin'  => '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>',
                'link'      => '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><circle cx="12" cy="12" r="10"/><line x1="2" x2="22" y1="12" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>',
            ];
            echo '<div class="iramo-social-row">';
            foreach ( $list as $item ) {
                $net = $item['network'] ?? 'link';
                $url = ! empty( $item['url']['url'] ) ? $item['url']['url'] : '#';
                echo '<a href="' . esc_url( $url ) . '" target="_blank" rel="noopener noreferrer" class="iramo-social-btn" aria-label="' . esc_attr( $item['label'] ) . '" title="' . esc_attr( $item['label'] ) . '">' . ( $svgs[ $net ] ?? $svgs['link'] ) . '</a>';
            }
            echo '</div>';
        }
    }

    // 9. Atomic Footer Links Column Widget (Repeater)
    class iRamo_Widget_Footer_Links_Col extends iRamo_Base_Widget {
        public function get_name() { return 'iramo_footer_links_col'; }
        public function get_title() { return __( 'ستون لینک‌های فوتر iRamoAi', 'iramo-ai' ); }
        public function get_icon() { return 'eicon-editor-list-ul'; }

        protected function register_controls() {
            $this->start_controls_section( 'sec_fcol', [ 'label' => 'لینک‌های ستون' ] );
            $this->add_control( 'title', [ 'label' => 'تیتر ستون', 'type' => \Elementor\Controls_Manager::TEXT, 'default' => 'بخش‌های سایت' ] );
            $rep = new \Elementor\Repeater();
            $rep->add_control( 'text', [ 'label' => 'عنوان لینک', 'type' => \Elementor\Controls_Manager::TEXT, 'default' => 'صفحه اصلی' ] );
            $rep->add_control( 'url', [ 'label' => 'آدرس لینک', 'type' => \Elementor\Controls_Manager::URL, 'default' => [ 'url' => '/' ] ] );
            $this->add_control( 'links', [
                'label' => 'آیتم‌ها',
                'type' => \Elementor\Controls_Manager::REPEATER,
                'fields' => $rep->get_controls(),
                'title_field' => '{{{ text }}}',
                'default' => [
                    [ 'text' => 'صفحه اصلی', 'url' => [ 'url' => '/' ] ],
                    [ 'text' => 'محصولات', 'url' => [ 'url' => '/products/' ] ],
                    [ 'text' => 'دوره‌های آموزشی', 'url' => [ 'url' => '/academy/' ] ],
                    [ 'text' => 'ابزارهای هوش مصنوعی', 'url' => [ 'url' => '/ai-tools/' ] ],
                    [ 'text' => 'مقالات', 'url' => [ 'url' => '/articles/' ] ],
                    [ 'text' => 'خدمات و مشاوره', 'url' => [ 'url' => '/services/' ] ],
                ],
            ] );
            $this->end_controls_section();

            $this->start_controls_section( 'sec_fcol_style', [ 'label' => 'استایل ستون', 'tab' => \Elementor\Controls_Manager::TAB_STYLE ] );
            $this->add_control( 'col_title_color', [ 'label' => 'رنگ تیتر', 'type' => \Elementor\Controls_Manager::COLOR, 'selectors' => [ '{{WRAPPER}} h4' => 'color: {{VALUE}};' ] ] );
            $this->add_control( 'col_link_color', [ 'label' => 'رنگ لینک‌ها', 'type' => \Elementor\Controls_Manager::COLOR, 'selectors' => [ '{{WRAPPER}} .iramo-footer-links a' => 'color: {{VALUE}};' ] ] );
            $this->add_group_control( \Elementor\Group_Control_Typography::get_type(), [ 'name' => 'col_link_typo', 'selector' => '{{WRAPPER}} .iramo-footer-links a' ] );
            $this->end_controls_section();
        }

        protected function render() {
            $s     = $this->get_settings_for_display();
            $links = $s['links'] ?? [];
            echo '<div dir="rtl">';
            if ( ! empty( $s['title'] ) ) {
                echo '<h4 style="margin:0;font-size:13px;font-weight:800;">' . esc_html( $s['title'] ) . '</h4>';
            }
            if ( ! empty( $links ) ) {
                echo '<ul class="iramo-footer-links">';
                foreach ( $links as $l ) {
                    $url = ! empty( $l['url']['url'] ) ? $l['url']['url'] : '#';
                    echo '<li><a href="' . esc_url( $url ) . '">' . esc_html( $l['text'] ) . '</a></li>';
                }
                echo '</ul>';
            }
            echo '</div>';
        }
    }

    // 10. Atomic Newsletter Form Widget (Modern Card + Email/Bot Input)
    class iRamo_Widget_Newsletter_Form extends iRamo_Base_Widget {
        public function get_name() { return 'iramo_newsletter_form'; }
        public function get_title() { return __( 'فرم خبرنامه هفتگی و ابزارهای AI', 'iramo-ai' ); }
        public function get_icon() { return 'eicon-mail'; }

        protected function register_controls() {
            $this->start_controls_section( 'sec_nl', [ 'label' => 'تنظیمات فرم' ] );
            $this->add_control( 'placeholder', [ 'label' => 'متن پیش‌فرض فیلد', 'type' => \Elementor\Controls_Manager::TEXT, 'default' => 'you@domain.com' ] );
            $this->add_control( 'button_text', [ 'label' => 'متن دکمه', 'type' => \Elementor\Controls_Manager::TEXT, 'default' => 'عضویت' ] );
            $this->add_control( 'layout_dir', [
                'label' => 'چیدمان فرم',
                'type' => \Elementor\Controls_Manager::SELECT,
                'default' => 'row',
                'options' => [ 'row' => 'افقی (کنار هم)', 'column' => 'عمودی (زیر هم)' ],
            ] );
            $this->end_controls_section();

            $this->start_controls_section( 'sec_nl_style', [ 'label' => 'استایل دکمه و فیلد', 'tab' => \Elementor\Controls_Manager::TAB_STYLE ] );
            $this->add_control( 'nl_btn_bg', [ 'label' => 'رنگ دکمه', 'type' => \Elementor\Controls_Manager::COLOR, 'selectors' => [ '{{WRAPPER}} button' => 'background-color: {{VALUE}};' ] ] );
            $this->add_control( 'nl_btn_color', [ 'label' => 'رنگ متن دکمه', 'type' => \Elementor\Controls_Manager::COLOR, 'selectors' => [ '{{WRAPPER}} button' => 'color: {{VALUE}};' ] ] );
            $this->end_controls_section();
        }

        protected function render() {
            $s   = $this->get_settings_for_display();
            $dir = ( $s['layout_dir'] ?? 'row' ) === 'column' ? 'flex-direction:column;' : '';
            ?>
            <div dir="rtl">
                <form class="iramo-newsletter-form" data-iramo-newsletter style="<?php echo esc_attr( $dir ); ?>">
                    <div class="iramo-newsletter-input-wrap">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                        <input type="text" dir="ltr" name="handle" class="iramo-input" placeholder="<?php echo esc_attr( $s['placeholder'] ?: 'you@domain.com' ); ?>" required />
                    </div>
                    <button type="submit" class="iramo-btn iramo-btn-accent" style="padding:9px 16px;font-size:12.5px;white-space:nowrap;border-radius:12px;"><?php echo esc_html( $s['button_text'] ?: 'عضویت' ); ?></button>
                </form>
                <div data-iramo-newsletter-msg style="font-size:12px;margin-top:8px;color:var(--iramo-primary);font-weight:700;"></div>
            </div>
            <?php
        }
    }

    // 11. Atomic Theme Toggle Chip Widget
    class iRamo_Widget_Theme_Toggle_Chip extends iRamo_Base_Widget {
        public function get_name() { return 'iramo_theme_toggle_chip'; }
        public function get_title() { return __( 'دکمه تغییر حالت روشن / تیره', 'iramo-ai' ); }
        public function get_icon() { return 'eicon-light'; }

        protected function register_controls() {
            $this->start_controls_section( 'sec_ttc', [ 'label' => 'متن دکمه' ] );
            $this->add_control( 'label', [ 'label' => 'عنوان دکمه', 'type' => \Elementor\Controls_Manager::TEXT, 'default' => 'تغییر حالت روشن / تیره' ] );
            $this->end_controls_section();
        }

        protected function render() {
            $s = $this->get_settings_for_display();
            echo '<button type="button" class="iramo-chip" data-iramo-theme-toggle>' . esc_html( $s['label'] ?: 'تغییر حالت روشن / تیره' ) . '</button>';
        }
    }

    // 12. Atomic Related AI Tools Sidebar Widget
    class iRamo_Widget_Related_Tools extends iRamo_Base_Widget {
        public function get_name() { return 'iramo_related_tools'; }
        public function get_title() { return __( 'ابزارهای مرتبط سایدبار (AI Tools)', 'iramo-ai' ); }
        public function get_icon() { return 'eicon-post-list'; }

        protected function register_controls() {
            $this->start_controls_section( 'sec_rel', [ 'label' => 'تنظیمات ابزارهای مرتبط' ] );
            $this->add_control( 'title', [ 'label' => 'تیتر باکس', 'type' => \Elementor\Controls_Manager::TEXT, 'default' => 'ابزارهای مرتبط' ] );
            $this->add_control( 'posts_count', [ 'label' => 'تعداد ابزارها', 'type' => \Elementor\Controls_Manager::NUMBER, 'default' => 5, 'min' => 1, 'max' => 12 ] );
            $this->add_control( 'show_back_btn', [ 'label' => 'نمایش دکمه بازگشت به دایرکتوری', 'type' => \Elementor\Controls_Manager::SWITCHER, 'default' => 'yes' ] );
            $this->add_control( 'back_btn_text', [ 'label' => 'متن دکمه بازگشت', 'type' => \Elementor\Controls_Manager::TEXT, 'default' => 'بازگشت به همه ابزارها' ] );
            $this->end_controls_section();
            $this->register_iramo_card_style_controls();
        }

        protected function render() {
            $s         = $this->get_settings_for_display();
            $pid       = get_the_ID();
            $task      = $pid ? ( get_post_meta( $pid, '_iramo_task', true ) ?: 'AI Assistant' ) : 'AI Assistant';
            $tools_url = get_post_type_archive_link( 'iramo_ai_tool' ) ?: home_url( '/ai-tools/' );
            $related   = get_posts( [
                'post_type'      => 'iramo_ai_tool',
                'post_status'    => 'publish',
                'posts_per_page' => (int) ( $s['posts_count'] ?? 5 ),
                'post__not_in'   => $pid ? [ $pid ] : [],
                'meta_key'       => '_iramo_task',
                'meta_value'     => $task,
            ] );
            if ( empty( $related ) ) {
                $related = get_posts( [
                    'post_type'      => 'iramo_ai_tool',
                    'post_status'    => 'publish',
                    'posts_per_page' => (int) ( $s['posts_count'] ?? 5 ),
                    'post__not_in'   => $pid ? [ $pid ] : [],
                ] );
            }
            ?>
            <div class="iramo-card" dir="rtl" style="padding:20px;">
                <h3 style="margin:0 0 12px;font-size:16px;font-weight:800;"><?php echo esc_html( $s['title'] ?: 'ابزارهای مرتبط' ); ?></h3>
                <div style="display:grid;gap:10px;">
                    <?php foreach ( $related as $rel ) :
                        $rel_provider = trim( (string) get_post_meta( $rel->ID, '_iramo_provider', true ) );
                        $rel_pricing  = trim( (string) get_post_meta( $rel->ID, '_iramo_pricing', true ) );
                        $rel_meta     = implode( ' · ', array_filter( [ $rel_provider, $rel_pricing ] ) );
                        ?>
                        <a href="<?php echo esc_url( get_permalink( $rel->ID ) ); ?>" style="display:block;padding:10px 12px;border-radius:12px;background:var(--iramo-canvas);border:1px solid var(--iramo-border-subtle);">
                            <div style="font-weight:800;font-size:14px;"><?php echo esc_html( get_the_title( $rel->ID ) ); ?></div>
                            <?php if ( $rel_meta !== '' ) : ?>
                                <div style="font-size:11.5px;color:var(--iramo-muted);margin-top:2px;"><?php echo esc_html( $rel_meta ); ?></div>
                            <?php endif; ?>
                        </a>
                    <?php endforeach; ?>
                </div>
                <?php if ( ( $s['show_back_btn'] ?? 'yes' ) === 'yes' ) : ?>
                    <a href="<?php echo esc_url( $tools_url ); ?>" class="iramo-btn iramo-btn-outline" style="width:100%;margin-top:14px;font-size:13px;"><?php echo esc_html( $s['back_btn_text'] ?: 'بازگشت به همه ابزارها' ); ?></a>
                <?php endif; ?>
            </div>
            <?php
        }
    }

    // =========================================================================
    // PART B: FULL-FEATURED & GRANULARLY CONFIGURABLE WIDGETS (17 Widgets)
    // =========================================================================

    // 13. Full Pill Header Drop-in (kept for backward-compat quick drag)
    class iRamo_Widget_Header_Nav extends iRamo_Base_Widget {
        public function get_name() { return 'iramo_header_nav'; }
        public function get_title() { return __( 'هدر کامل یکپارچه iRamoAi', 'iramo-ai' ); }
        public function get_icon() { return 'eicon-header'; }

        protected function register_controls() {
            $this->start_controls_section( 'sec_header', [ 'label' => __( 'تنظیمات هدر', 'iramo-ai' ) ] );
            $this->add_control( 'brand_name', [ 'label' => 'نام برند', 'type' => \Elementor\Controls_Manager::TEXT, 'default' => 'iRamoAi' ] );
            $this->add_control( 'cta_text', [ 'label' => 'متن دکمه دسکتاپ (خالی = خودکار)', 'type' => \Elementor\Controls_Manager::TEXT, 'default' => '' ] );
            $this->add_control( 'cta_short', [ 'label' => 'متن کوتاه موبایل (خالی = خودکار)', 'type' => \Elementor\Controls_Manager::TEXT, 'default' => '' ] );
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
            $has_wc     = function_exists( 'iramo_has_woocommerce_account' ) && iramo_has_woocommerce_account();
            $cta_url    = function_exists( 'iramo_get_account_url' ) ? iramo_get_account_url() : home_url( '/services/' );
            $auto_full  = $has_wc ? ( is_user_logged_in() ? 'حساب کاربری' : 'ورود / حساب کاربری' ) : 'درخواست مشاوره';
            $auto_short = $has_wc ? ( is_user_logged_in() ? 'حساب من' : 'ورود / حساب' ) : 'مشاوره';
            $full_label = ! empty( trim( (string) ( $s['cta_text'] ?? '' ) ) ) ? $s['cta_text'] : $auto_full;
            $short_lbl  = ! empty( trim( (string) ( $s['cta_short'] ?? '' ) ) ) ? $s['cta_short'] : $auto_short;
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
                        <span class="iramo-brand-text"><?php echo iramo_plugin_brand_wordmark_html( $brand ); ?></span>
                    </a>
                    <nav aria-label="منوی اصلی">
                        <?php
                        $articles_url = function_exists( 'iramo_get_page_url' ) ? iramo_get_page_url( 'articles', '/articles/' ) : home_url( '/articles/' );
                        $services_url = function_exists( 'iramo_get_page_url' ) ? iramo_get_page_url( 'services', '/services/' ) : home_url( '/services/' );
                        if ( has_nav_menu( 'primary' ) ) {
                            wp_nav_menu( [ 'theme_location' => 'primary', 'container' => false, 'menu_class' => 'iramo-nav-list', 'depth' => 1 ] );
                        } else {
                            echo '<ul class="iramo-nav-list"><li><a href="' . esc_url( home_url( '/products/' ) ) . '">محصولات</a></li><li><a href="' . esc_url( home_url( '/academy/' ) ) . '">دوره‌های آموزشی</a></li><li><a href="' . esc_url( home_url( '/ai-tools/' ) ) . '">ابزارهای هوش مصنوعی</a></li><li><a href="' . esc_url( $articles_url ) . '">مقالات</a></li><li><a href="' . esc_url( $services_url ) . '">خدمات و مشاوره</a></li></ul>';
                        }
                        ?>
                    </nav>
                    <div class="iramo-header-actions">
                        <?php if ( ( $s['show_theme_toggle'] ?? 'yes' ) === 'yes' ) : ?>
                            <button type="button" class="iramo-icon-btn" data-iramo-theme-toggle aria-label="تغییر تم">
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
                            </button>
                        <?php endif; ?>
                        <a href="<?php echo esc_url( $cta_url ); ?>" class="iramo-panel-cta">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" x2="3" y1="12" y2="12"/></svg>
                            <span class="label-full"><?php echo esc_html( $full_label ); ?></span>
                            <span class="label-short"><?php echo esc_html( $short_lbl ); ?></span>
                        </a>
                        <button type="button" class="iramo-icon-btn iramo-menu-toggle" data-iramo-menu-toggle aria-label="منوی موبایل">☰</button>
                    </div>
                </div>
                <div class="iramo-mobile-drawer" data-iramo-mobile-drawer>
                    <?php
                    if ( has_nav_menu( 'primary' ) ) {
                        wp_nav_menu( [ 'theme_location' => 'primary', 'container' => false, 'depth' => 1 ] );
                    } else {
                        $extra_wc_li = $has_wc ? '<li><a href="' . esc_url( $cta_url ) . '">حساب کاربری</a></li>' : '';
                        echo '<ul><li><a href="' . esc_url( home_url( '/' ) ) . '">صفحه اصلی</a></li><li><a href="' . esc_url( home_url( '/products/' ) ) . '">محصولات</a></li><li><a href="' . esc_url( home_url( '/academy/' ) ) . '">دوره‌های آموزشی</a></li><li><a href="' . esc_url( home_url( '/ai-tools/' ) ) . '">ابزارهای هوش مصنوعی</a></li><li><a href="' . esc_url( $articles_url ) . '">مقالات</a></li><li><a href="' . esc_url( $services_url ) . '">خدمات و مشاوره</a></li>' . $extra_wc_li . '</ul>';
                    }
                    ?>
                </div>
            </header>
            <?php
        }
    }

    // 14. Full Footer Drop-in (kept for backward-compat quick drag)
    class iRamo_Widget_Footer_Box extends iRamo_Base_Widget {
        public function get_name() { return 'iramo_footer_box'; }
        public function get_title() { return __( 'فوتر کامل یکپارچه iRamoAi', 'iramo-ai' ); }
        public function get_icon() { return 'eicon-footer'; }

        protected function register_controls() {
            $this->start_controls_section( 'sec_footer', [ 'label' => __( 'محتوای فوتر', 'iramo-ai' ) ] );
            $this->add_control( 'brand_name', [ 'label' => 'نام برند', 'type' => \Elementor\Controls_Manager::TEXT, 'default' => 'iRamoAi' ] );
            $this->add_control( 'about', [ 'label' => 'معرفی کوتاه', 'type' => \Elementor\Controls_Manager::TEXTAREA, 'default' => 'پلتفرم یکپارچه ارائه محصولات نرم‌افزاری هوشمند، دوره‌های تخصصی کاربردی، دایرکتوری انتخاب ابزارهای AI و زیرساخت بومی اتصال به تلگرام، بله و وردپرس.' ] );
            $this->add_control( 'newsletter_title', [ 'label' => 'عنوان خبرنامه', 'type' => \Elementor\Controls_Manager::TEXT, 'default' => 'خبرنامه هفتگی ابزارها و آموزش‌های AI' ] );
            $this->add_control( 'copyright', [ 'label' => 'متن کپی‌رایت', 'type' => \Elementor\Controls_Manager::TEXT, 'default' => '© ۲۰۲۵ iRamoAi — طراحی و مهندسی پلتفرم هوشمند' ] );
            $this->end_controls_section();
            $this->register_iramo_card_style_controls( '{{WRAPPER}} .iramo-footer' );
        }

        protected function render() {
            $s            = $this->get_settings_for_display();
            $brand        = $s['brand_name'] ?: 'iRamoAi';
            $img_fn       = function_exists( 'iramo_get_theme_image' );
            $logo_light   = $img_fn ? iramo_get_theme_image( 'Group_179_659a031b.png' ) : '';
            $logo_dark    = $img_fn ? iramo_get_theme_image( 'logo_brand_19b8e3d7.png' ) : '';
            $has_wc       = function_exists( 'iramo_has_woocommerce_account' ) && iramo_has_woocommerce_account();
            $account_url  = function_exists( 'iramo_get_account_url' ) ? iramo_get_account_url() : home_url( '/services/' );
            $articles_url = function_exists( 'iramo_get_page_url' ) ? iramo_get_page_url( 'articles', '/articles/' ) : home_url( '/articles/' );
            $services_url = function_exists( 'iramo_get_page_url' ) ? iramo_get_page_url( 'services', '/services/' ) : home_url( '/services/' );
            ?>
            <footer class="iramo-footer" role="contentinfo" dir="rtl">
                <div class="iramo-container">
                    <div class="iramo-footer-grid">
                        <div>
                            <a href="<?php echo esc_url( home_url( '/' ) ); ?>" class="iramo-logo-link">
                                <?php if ( $logo_light ) : ?>
                                    <span class="iramo-footer-logo-box">
                                        <img src="<?php echo esc_url( $logo_light ); ?>" alt="<?php echo esc_attr( $brand ); ?>" class="iramo-logo-img iramo-logo-light" />
                                        <img src="<?php echo esc_url( $logo_dark ); ?>" alt="<?php echo esc_attr( $brand ); ?>" class="iramo-logo-img iramo-logo-dark" />
                                    </span>
                                <?php endif; ?>
                                <span>
                                    <span class="iramo-brand-text" style="display:block;font-size:19px;"><?php echo iramo_plugin_brand_wordmark_html( $brand ); ?></span>
                                    <span style="display:block;font-size:11.5px;font-weight:600;color:var(--iramo-primary);">آکادمی هوش مصنوعی، ربات‌سازی و مهندسی نرم‌افزار</span>
                                </span>
                            </a>
                            <p class="iramo-footer-about-text" style="margin:12px 0 0;font-size:13px;color:var(--iramo-muted);line-height:1.85;max-width:420px;"><?php echo esc_html( $s['about'] ); ?></p>
                        </div>
                        <div class="iramo-footer-nav-grid">
                            <div>
                                <h4 style="margin:0;font-size:13px;font-weight:800;">بخش‌های سایت</h4>
                                <ul class="iramo-footer-links">
                                    <li><a href="<?php echo esc_url( home_url( '/' ) ); ?>">صفحه اصلی</a></li>
                                    <li><a href="<?php echo esc_url( home_url( '/products/' ) ); ?>">محصولات</a></li>
                                    <li><a href="<?php echo esc_url( home_url( '/academy/' ) ); ?>">دوره‌های آموزشی</a></li>
                                    <li><a href="<?php echo esc_url( home_url( '/ai-tools/' ) ); ?>">ابزارهای هوش مصنوعی</a></li>
                                    <li><a href="<?php echo esc_url( $articles_url ); ?>">مقالات</a></li>
                                    <li><a href="<?php echo esc_url( $services_url ); ?>">خدمات و مشاوره</a></li>
                                </ul>
                            </div>
                            <div>
                                <h4 style="margin:0;font-size:13px;font-weight:800;">امکانات و پلتفرم</h4>
                                <ul class="iramo-footer-links">
                                    <li><a href="<?php echo esc_url( $account_url ); ?>"><?php echo esc_html( $has_wc ? 'حساب کاربری و سفارش‌ها' : 'مشاوره و ثبت سفارش' ); ?></a></li>
                                    <li><a href="<?php echo esc_url( home_url( '/products/' ) ); ?>">نرم‌افزار حسابیار</a></li>
                                    <li><a href="<?php echo esc_url( home_url( '/ai-tools/' ) ); ?>">دایرکتوری ابزارهای AI</a></li>
                                    <li><a href="<?php echo esc_url( $services_url ); ?>">پلاگین وردپرس و المنتور</a></li>
                                </ul>
                            </div>
                        </div>
                        <div class="iramo-newsletter-card">
                            <h4 style="margin:0;font-size:13px;font-weight:800;"><?php echo esc_html( $s['newsletter_title'] ); ?></h4>
                            <p style="margin:6px 0 0;font-size:11.5px;color:var(--iramo-muted);line-height:1.75;">معرفی جدیدترین ابزارهای هوش مصنوعی، پرامپت‌های کاربردی و آپدیت محصولات را در ایمیل دریافت کنید.</p>
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
                        <div><?php echo esc_html( $s['copyright'] ); ?></div>
                        <button type="button" class="iramo-chip" data-iramo-theme-toggle>نمای تیره / روشن سایت</button>
                    </div>
                </div>
            </footer>
            <?php
        }
    }

    // 15. Hero Full Drop-in
    class iRamo_Widget_Hero extends iRamo_Base_Widget {
        public function get_name() { return 'iramo_hero'; }
        public function get_title() { return __( 'هیرو کامل یکپارچه (Hero)', 'iramo-ai' ); }
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
            $s            = $this->get_settings_for_display();
            $custom       = ! empty( $s['image']['url'] ) ? $s['image']['url'] : '';
            $hero_img     = $custom ?: ( function_exists( 'iramo_get_theme_image' ) ? iramo_get_theme_image( 'hero_iramo_desk_1794738858107.jpg' ) : '' );
            $products_url = get_post_type_archive_link( 'iramo_product' ) ?: home_url( '/products/' );
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
                                <span>✓ اتصال ربات تلگرام و بله</span><span class="proof-dot">•</span>
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
                                    <a href="<?php echo esc_url( $products_url ); ?>" class="iramo-price-btn" style="padding:5px 12px;font-size:11px;">مشاهده محصولات</a>
                                </div>
                            </div>
                        <?php endif; ?>
                    </div>
                </div>
            </section>
            <?php
        }
    }

    // 16. Products Grid Widget (supports standalone header OR atomic header outside)
    class iRamo_Widget_Products_Grid extends iRamo_Base_Widget {
        public function get_name() { return 'iramo_products_grid'; }
        public function get_title() { return __( 'گرید و ویترین محصولات (iRamoAi)', 'iramo-ai' ); }
        public function get_icon() { return 'eicon-products'; }

        protected function register_controls() {
            $this->start_controls_section( 'sec_query', [ 'label' => __( 'چیدمان و کوئری محصولات', 'iramo-ai' ) ] );
            $this->add_control( 'show_header', [ 'label' => 'نمایش تیتر و دکمه بالای گرید', 'type' => \Elementor\Controls_Manager::SWITCHER, 'default' => 'yes' ] );
            $this->add_control( 'section_badge', [ 'label' => 'برچسب بخش', 'type' => \Elementor\Controls_Manager::TEXT, 'default' => 'محصولات نرم‌افزاری اختصاصی', 'condition' => [ 'show_header' => 'yes' ] ] );
            $this->add_control( 'section_title', [ 'label' => 'تیتر بخش', 'type' => \Elementor\Controls_Manager::TEXT, 'default' => 'محصولات آماده برای رشد سریع کسب‌وکار', 'condition' => [ 'show_header' => 'yes' ] ] );
            $this->add_control( 'all_btn_text', [ 'label' => 'متن دکمه مشاهده همه', 'type' => \Elementor\Controls_Manager::TEXT, 'default' => 'مشاهده همه محصولات ←', 'condition' => [ 'show_header' => 'yes' ] ] );
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
            $this->add_control( 'loop_template_id', [ 'label' => 'قالب کارت (Loop Item)', 'type' => \Elementor\Controls_Manager::SELECT, 'default' => '', 'options' => $this->get_loop_item_options() ] );
            $this->end_controls_section();
            $this->register_iramo_card_style_controls();
        }

        protected function render() {
            $s    = $this->get_settings_for_display();
            $src  = $s['source'] ?? 'both';
            $pt   = $src === 'both' ? [ 'iramo_product', 'product' ] : $src;
            $col  = in_array( $s['columns'], [ '2', '3', '4' ], true ) ? $s['columns'] : '2';
            $loop_tpl_id = (int) ( $s['loop_template_id'] ?? 0 );
            $q    = new \WP_Query( [ 'post_type' => $pt, 'post_status' => 'publish', 'posts_per_page' => (int) ( $s['posts_count'] ?? 4 ) ] );
            $show_head = ( $s['show_header'] ?? 'yes' ) === 'yes';
            ?>
            <div dir="rtl">
                <?php if ( $show_head && ! empty( $s['section_title'] ) ) : ?>
                    <div class="iramo-sec-head">
                        <div>
                            <?php if ( ! empty( $s['section_badge'] ) ) : ?><span class="iramo-badge"><?php echo esc_html( $s['section_badge'] ); ?></span><?php endif; ?>
                            <h2 class="iramo-sec-title" style="margin-top:8px;"><?php echo esc_html( $s['section_title'] ); ?></h2>
                        </div>
                        <?php if ( ! empty( $s['all_btn_text'] ) ) : ?>
                            <a href="<?php echo esc_url( home_url( '/products/' ) ); ?>" class="iramo-btn iramo-btn-outline" style="padding:8px 16px;font-size:13px;"><?php echo esc_html( $s['all_btn_text'] ); ?></a>
                        <?php endif; ?>
                    </div>
                <?php endif; ?>
                <div class="iramo-grid-<?php echo esc_attr( $col ); ?>">
                    <?php
                    if ( $q->have_posts() ) {
                        while ( $q->have_posts() ) {
                            $q->the_post();
                            $pid = get_the_ID();
                            if ( $loop_tpl_id && function_exists( 'iramo_render_loop_item_template' ) && iramo_render_loop_item_template( $loop_tpl_id, $pid ) ) {
                                continue;
                            }
                            if ( function_exists( 'iramo_render_product_card' ) ) iramo_render_product_card( $pid );
                        }
                        wp_reset_postdata();
                    } else {
                        echo '<article class="iramo-card" style="padding:22px;"><span class="iramo-badge">اتوماسیون مالی</span><h3 style="margin:10px 0 6px;font-size:19px;font-weight:800;">نرم‌افزار حسابیار هوشمند (OCR مالی)</h3><p style="margin:0 0 14px;font-size:13.5px;color:var(--iramo-muted);">خواندن خودکار فاکتور و فیش بانکی با هوش مصنوعی و ثبت مستقیم در اکسل و نرم‌افزارهای مالی.</p><a href="' . esc_url( home_url( '/products/' ) ) . '" class="iramo-price-btn">معرفی محصول و دمو ←</a></article>';
                        echo '<article class="iramo-card" style="padding:22px;"><span class="iramo-badge">تولید محتوای ویدیویی</span><h3 style="margin:10px 0 6px;font-size:19px;font-weight:800;">استودیو ویدئومی (زیرنویس و دوبله AI)</h3><p style="margin:0 0 14px;font-size:13.5px;color:var(--iramo-muted);">تبدیل ویدیوهای آموزشی یوتیوب و دوره‌ها به زیرنویس دقیق و دوبله فارسی هماهنگ.</p><a href="' . esc_url( home_url( '/products/' ) ) . '" class="iramo-price-btn">معرفی محصول و دمو ←</a></article>';
                    }
                    ?>
                </div>
            </div>
            <?php
        }
    }

    // 17. AI Discovery Search + Quick Chips Widget
    class iRamo_Widget_AI_Discovery extends iRamo_Base_Widget {
        public function get_name() { return 'iramo_ai_discovery_search'; }
        public function get_title() { return __( 'موتور جستجو و چیپ‌های دایرکتوری AI', 'iramo-ai' ); }
        public function get_icon() { return 'eicon-search'; }

        protected function register_controls() {
            $this->start_controls_section( 'sec_discovery', [ 'label' => __( 'تنظیمات جستجو', 'iramo-ai' ) ] );
            $this->add_control( 'show_header', [ 'label' => 'نمایش تیتر و توضیح داخل باکس', 'type' => \Elementor\Controls_Manager::SWITCHER, 'default' => 'yes' ] );
            $this->add_control( 'badge', [ 'label' => 'برچسب', 'type' => \Elementor\Controls_Manager::TEXT, 'default' => 'موتور جستجوی ابزارهای AI', 'condition' => [ 'show_header' => 'yes' ] ] );
            $this->add_control( 'title', [ 'label' => 'تیتر', 'type' => \Elementor\Controls_Manager::TEXT, 'default' => 'دایرکتوری تخصصی و بررسی ابزارهای هوش مصنوعی', 'condition' => [ 'show_header' => 'yes' ] ] );
            $this->add_control( 'desc', [ 'label' => 'توضیح', 'type' => \Elementor\Controls_Manager::TEXTAREA, 'default' => 'ابزار مناسب خود را بر اساس نیاز، مدل قیمت‌گذاری، ورودی/خروجی و نمونه پرامپت پیدا کنید.', 'condition' => [ 'show_header' => 'yes' ] ] );
            $this->add_control( 'placeholder', [ 'label' => 'متن پیش‌فرض سرچ', 'type' => \Elementor\Controls_Manager::TEXT, 'default' => 'جستجو در نام ابزار، شرکت سازنده یا کاربرد (مثلاً: ChatGPT، تولید ویدیو، کدنویسی)...' ] );
            $this->add_control( 'search_btn_text', [ 'label' => 'متن دکمه جستجو', 'type' => \Elementor\Controls_Manager::TEXT, 'default' => 'جستجو در دایرکتوری' ] );
            $this->add_control( 'show_chips', [ 'label' => 'نمایش تگ‌های دسته‌بندی سریع', 'type' => \Elementor\Controls_Manager::SWITCHER, 'default' => 'yes' ] );

            $rep = new \Elementor\Repeater();
            $rep->add_control( 'label', [ 'label' => 'عنوان دسته‌بندی', 'type' => \Elementor\Controls_Manager::TEXT, 'default' => 'دستیار هوشمند' ] );
            $rep->add_control( 'task_key', [ 'label' => 'کلید Task فیلتر', 'type' => \Elementor\Controls_Manager::TEXT, 'default' => 'AI Assistant' ] );
            $this->add_control( 'quick_cats', [
                'label' => 'تگ‌های سریع دسته‌بندی',
                'type' => \Elementor\Controls_Manager::REPEATER,
                'fields' => $rep->get_controls(),
                'title_field' => '{{{ label }}}',
                'condition' => [ 'show_chips' => 'yes' ],
                'default' => [
                    [ 'label' => 'دستیار هوشمند', 'task_key' => 'AI Assistant' ],
                    [ 'label' => 'تصویر و گرافیک', 'task_key' => 'Art & Image' ],
                    [ 'label' => 'تولید ویدیو', 'task_key' => 'Video Generation' ],
                    [ 'label' => 'برنامه‌نویسی', 'task_key' => 'Code Assistant' ],
                    [ 'label' => 'صدا و دوبله', 'task_key' => 'Audio & Music' ],
                    [ 'label' => 'اتوماسیون و ایجنت', 'task_key' => 'Automation & Agents' ],
                    [ 'label' => 'پژوهش و مقاله', 'task_key' => 'Research & Study' ],
                ],
            ] );
            $this->end_controls_section();

            $this->start_controls_section( 'sec_disc_style', [ 'label' => 'استایل دکمه و تگ‌ها', 'tab' => \Elementor\Controls_Manager::TAB_STYLE ] );
            $this->add_control( 'sbtn_bg', [ 'label' => 'رنگ دکمه جستجو', 'type' => \Elementor\Controls_Manager::COLOR, 'selectors' => [ '{{WRAPPER}} .iramo-search-form button' => 'background-color: {{VALUE}};' ] ] );
            $this->add_control( 'chip_bg', [ 'label' => 'پس‌زمینه تگ‌ها', 'type' => \Elementor\Controls_Manager::COLOR, 'selectors' => [ '{{WRAPPER}} .iramo-chip' => 'background-color: {{VALUE}};' ] ] );
            $this->add_control( 'chip_color', [ 'label' => 'رنگ متن تگ‌ها', 'type' => \Elementor\Controls_Manager::COLOR, 'selectors' => [ '{{WRAPPER}} .iramo-chip' => 'color: {{VALUE}};' ] ] );
            $this->end_controls_section();
        }

        protected function render() {
            $s         = $this->get_settings_for_display();
            $tools_url = get_post_type_archive_link( 'iramo_ai_tool' ) ?: home_url( '/ai-tools/' );
            $cats      = $s['quick_cats'] ?? [];
            $show_head = ( $s['show_header'] ?? 'yes' ) === 'yes';
            ?>
            <div dir="rtl">
                <?php if ( $show_head ) : ?>
                    <div style="max-width:740px;">
                        <?php if ( ! empty( $s['badge'] ) ) : ?><span class="iramo-badge"><?php echo esc_html( $s['badge'] ); ?></span><?php endif; ?>
                        <?php if ( ! empty( $s['title'] ) ) : ?><h2 class="iramo-sec-title" style="margin-top:8px;"><?php echo esc_html( $s['title'] ); ?></h2><?php endif; ?>
                        <?php if ( ! empty( $s['desc'] ) ) : ?><p class="iramo-sec-desc"><?php echo esc_html( $s['desc'] ); ?></p><?php endif; ?>
                    </div>
                <?php endif; ?>
                <form action="<?php echo esc_url( $tools_url ); ?>" method="get" class="iramo-search-form" style="<?php echo $show_head ? '' : 'margin-top:16px;'; ?>">
                    <input type="search" name="q" class="iramo-input" placeholder="<?php echo esc_attr( $s['placeholder'] ); ?>" />
                    <button type="submit" class="iramo-btn iramo-btn-primary" style="white-space:nowrap;"><?php echo esc_html( $s['search_btn_text'] ?: 'جستجو در دایرکتوری' ); ?></button>
                </form>
                <?php if ( ( $s['show_chips'] ?? 'yes' ) === 'yes' && ! empty( $cats ) ) : ?>
                    <div class="iramo-chips">
                        <?php foreach ( $cats as $cat ) : ?>
                            <a href="<?php echo esc_url( add_query_arg( 'task', $cat['task_key'], $tools_url ) ); ?>" class="iramo-chip"><?php echo esc_html( $cat['label'] ); ?></a>
                        <?php endforeach; ?>
                    </div>
                <?php endif; ?>
            </div>
            <?php
        }
    }

    // 18. Dual Bento Cards Drop-in
    class iRamo_Widget_Bento_CTA extends iRamo_Base_Widget {
        public function get_name() { return 'iramo_bento_cta'; }
        public function get_title() { return __( 'کارت‌های دوتایی آکادمی و مشاوره', 'iramo-ai' ); }
        public function get_icon() { return 'eicon-columns'; }

        protected function register_controls() {
            $this->start_controls_section( 'sec_bento', [ 'label' => __( 'محتوای دو کارت', 'iramo-ai' ) ] );
            $this->add_control( 'card1_title', [ 'label' => 'تیتر کارت آکادمی', 'type' => \Elementor\Controls_Manager::TEXT, 'default' => 'دوره‌های کاربردی هوش مصنوعی و ساخت ربات' ] );
            $this->add_control( 'card1_desc', [ 'label' => 'توضیح کارت آکادمی', 'type' => \Elementor\Controls_Manager::TEXTAREA, 'default' => 'یادگیری عملی ساخت ربات‌های تلگرام و بله، پرامپت‌نویسی مهندسی‌شده، اتوماسیون n8n و استفاده حرفه‌ای از ابزارهای AI همراه با پشتیبانی تخصصی.' ] );
            $this->add_control( 'card2_title', [ 'label' => 'تیتر کارت خدمات و مشاوره', 'type' => \Elementor\Controls_Manager::TEXT, 'default' => 'طراحی ربات، اتوماسیون و پیاده‌سازی AI برای سازمان شما' ] );
            $this->add_control( 'card2_desc', [ 'label' => 'توضیح کارت خدمات و مشاوره', 'type' => \Elementor\Controls_Manager::TEXTAREA, 'default' => 'اگر برای اتصال CRM، ووکامرس، صدور خودکار فاکتور یا راه‌اندازی دستیار اختصاصی AI در تلگرام و بله به تیم فنی نیاز دارید، با مهندسان ما مشورت کنید.' ] );
            $this->end_controls_section();
            $this->register_iramo_card_style_controls();
        }

        protected function render() {
            $s            = $this->get_settings_for_display();
            $academy_url  = get_post_type_archive_link( 'iramo_course' ) ?: home_url( '/academy/' );
            $services_url = function_exists( 'iramo_get_page_url' ) ? iramo_get_page_url( 'services', '/services/' ) : home_url( '/services/' );
            ?>
            <section class="iramo-section" style="padding-top:12px;" dir="rtl">
                <div class="iramo-container">
                    <div class="iramo-grid-2">
                        <div class="iramo-card iramo-bento-card">
                            <div>
                                <div class="iramo-bento-head"><span class="iramo-badge">آکادمی تخصصی iRamoAi</span><span style="font-size:12px;font-weight:700;color:var(--iramo-primary);">پروژه‌محور + گواهینامه</span></div>
                                <h3 style="margin:12px 0 8px;font-size:21px;font-weight:800;"><?php echo esc_html( $s['card1_title'] ); ?></h3>
                                <p style="margin:0;font-size:13.5px;color:var(--iramo-muted);line-height:1.8;"><?php echo esc_html( $s['card1_desc'] ); ?></p>
                            </div>
                            <div style="display:flex;flex-wrap:wrap;gap:10px;">
                                <a href="<?php echo esc_url( $academy_url ); ?>" class="iramo-btn iramo-btn-primary">مشاهده دوره‌های آکادمی ←</a>
                                <a href="<?php echo esc_url( $services_url ); ?>" class="iramo-btn iramo-btn-outline">مشاوره انتخاب دوره</a>
                            </div>
                        </div>
                        <div class="iramo-card iramo-bento-card">
                            <div>
                                <div class="iramo-bento-head"><span class="iramo-badge">خدمات مهندسی و مشاوره</span><span style="font-size:12px;font-weight:700;color:var(--iramo-subtle);">پروژه اختصاصی سازمانی</span></div>
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

    // 19. Full 6-Section Single Product Landing Widget (Granular Toggles, Step Texts & FAQ Repeater)
    class iRamo_Widget_Product_Landing extends iRamo_Base_Widget {
        public function get_name() { return 'iramo_product_landing'; }
        public function get_title() { return __( 'لندینگ کامل ۶ بخشی محصول (iRamoAi)', 'iramo-ai' ); }
        public function get_icon() { return 'eicon-price-table'; }

        protected function register_controls() {
            $this->start_controls_section( 'sec_opts', [ 'label' => __( 'بخش‌ها و دکمه‌های لندینگ', 'iramo-ai' ) ] );
            $this->add_control( 'show_hero', [ 'label' => 'نمایش باکس هیرو محصول', 'type' => \Elementor\Controls_Manager::SWITCHER, 'default' => 'yes' ] );
            $this->add_control( 'cta_prefix', [ 'label' => 'متن دکمه خرید', 'type' => \Elementor\Controls_Manager::TEXT, 'default' => 'خرید و دریافت فوری' ] );
            $this->add_control( 'demo_btn_text', [ 'label' => 'متن دکمه تست دمو', 'type' => \Elementor\Controls_Manager::TEXT, 'default' => 'تست آنلاین دمو' ] );
            $this->add_control( 'show_metrics', [ 'label' => 'نمایش نوار متریک‌ها', 'type' => \Elementor\Controls_Manager::SWITCHER, 'default' => 'yes' ] );
            $this->add_control( 'show_description', [ 'label' => 'نمایش معرفی و مزیت‌های کلیدی', 'type' => \Elementor\Controls_Manager::SWITCHER, 'default' => 'yes' ] );
            $this->add_control( 'show_steps', [ 'label' => 'نمایش روند ۳ گام', 'type' => \Elementor\Controls_Manager::SWITCHER, 'default' => 'yes' ] );
            $this->add_control( 'steps_title', [ 'label' => 'تیتر بخش ۳ گام', 'type' => \Elementor\Controls_Manager::TEXT, 'default' => 'روند کار و فعال‌سازی در ۳ گام', 'condition' => [ 'show_steps' => 'yes' ] ] );
            $this->add_control( 'show_sandbox', [ 'label' => 'نمایش شبیه‌ساز دمو', 'type' => \Elementor\Controls_Manager::SWITCHER, 'default' => 'yes' ] );
            $this->add_control( 'sandbox_title', [ 'label' => 'تیتر باکس تست آنلاین', 'type' => \Elementor\Controls_Manager::TEXT, 'default' => 'محیط آزمایش سریع (Interactive Sandbox)', 'condition' => [ 'show_sandbox' => 'yes' ] ] );
            $this->add_control( 'show_faq', [ 'label' => 'نمایش سوالات متداول', 'type' => \Elementor\Controls_Manager::SWITCHER, 'default' => 'yes' ] );
            $rep = new \Elementor\Repeater();
            $rep->add_control( 'q', [ 'label' => 'پرسش', 'type' => \Elementor\Controls_Manager::TEXT, 'default' => 'آیا بلافاصله پس از پرداخت دسترسی فعال می‌شود؟' ] );
            $rep->add_control( 'a', [ 'label' => 'پاسخ', 'type' => \Elementor\Controls_Manager::TEXTAREA, 'default' => 'بله؛ بلافاصله پس از تکمیل سفارش در ووکامرس، لینک دانلود و راهنمای فعال‌سازی در بخش سفارش‌های شما و ایمیل ثبت‌نامی قرار می‌گیرد.' ] );
            $this->add_control( 'faqs', [
                'label' => 'سوالات متداول',
                'type' => \Elementor\Controls_Manager::REPEATER,
                'fields' => $rep->get_controls(),
                'title_field' => '{{{ q }}}',
                'condition' => [ 'show_faq' => 'yes' ],
                'default' => [
                    [ 'q' => 'آیا بلافاصله پس از پرداخت دسترسی فعال می‌شود؟', 'a' => 'بله؛ بلافاصله پس از پرداخت در ووکامرس، لینک دانلود و جزئیات سفارش در حساب کاربری شما فعال شده و اعلان آن به تلگرام یا بله ارسال می‌شود.' ],
                    [ 'q' => 'آیا می‌توانم در چند سیستم استفاده کنم؟', 'a' => 'هر لایسنس استاندارد شامل نصب اصلی و پشتیبانی است؛ برای استقرار سازمانی با ما هماهنگ کنید.' ],
                ],
            ] );
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
            $wc_linked = (int) get_post_meta( $pid, '_iramo_linked_product_id', true );
            if ( get_post_type( $pid ) === 'product' && function_exists( 'wc_get_checkout_url' ) ) {
                $checkout = add_query_arg( 'add-to-cart', $pid, wc_get_checkout_url() );
            } elseif ( $wc_linked && function_exists( 'wc_get_checkout_url' ) ) {
                $checkout = add_query_arg( 'add-to-cart', $wc_linked, wc_get_checkout_url() );
            } else {
                $checkout = function_exists( 'iramo_get_page_url' ) ? iramo_get_page_url( 'services', '/services/' ) : home_url( '/services/' );
            }
            $thumb = get_the_post_thumbnail_url( $pid, 'large' ) ?: ( function_exists( 'iramo_get_theme_image' ) ? iramo_get_theme_image( 'hero_iramo_desk_1794738858107.jpg' ) : '' );
            ?>
            <div class="iramo-container" dir="rtl" style="display:grid;gap:26px;">
                <?php if ( ( $s['show_hero'] ?? 'yes' ) === 'yes' ) : ?>
                    <section class="iramo-card" style="padding:24px;">
                        <div class="iramo-hero-grid">
                            <div>
                                <span class="iramo-badge"><?php echo esc_html( $billing ); ?></span>
                                <h1 style="margin:12px 0 10px;font-size:28px;font-weight:900;"><?php echo esc_html( $title ); ?></h1>
                                <p style="margin:0 0 20px;font-size:15px;color:var(--iramo-muted);line-height:1.85;"><?php echo esc_html( $tagline ); ?></p>
                                <div style="display:flex;flex-wrap:wrap;gap:12px;align-items:center;">
                                    <a href="<?php echo esc_url( $checkout ); ?>" class="iramo-price-btn" style="padding:12px 22px;font-size:14px;">
                                        <span class="price-label"><?php echo esc_html( $s['cta_prefix'] ?: 'خرید و دریافت فوری' ); ?> · <?php echo esc_html( function_exists( 'iramo_format_toman' ) ? iramo_format_toman( $price_toman ) : $price_toman ); ?></span>
                                        <span>←</span>
                                    </a>
                                    <?php if ( ( $s['show_sandbox'] ?? 'yes' ) === 'yes' ) : ?>
                                        <a href="#iramo-sandbox-demo" class="iramo-btn iramo-btn-outline"><?php echo esc_html( $s['demo_btn_text'] ?: 'تست آنلاین دمو' ); ?></a>
                                    <?php endif; ?>
                                </div>
                            </div>
                            <?php if ( $thumb ) : ?>
                                <div class="iramo-hero-media"><img src="<?php echo esc_url( $thumb ); ?>" alt="<?php echo esc_attr( $title ); ?>" /></div>
                            <?php endif; ?>
                        </div>
                    </section>
                <?php endif; ?>

                <?php if ( ( $s['show_metrics'] ?? 'yes' ) === 'yes' ) : ?>
                    <section class="iramo-grid-4">
                        <div class="iramo-card" style="padding:18px;text-align:center;"><div style="font-size:12px;color:var(--iramo-muted);">زمان راه‌اندازی</div><div style="font-size:20px;font-weight:900;color:var(--iramo-primary);">کمتر از ۵ دقیقه</div></div>
                        <div class="iramo-card" style="padding:18px;text-align:center;"><div style="font-size:12px;color:var(--iramo-muted);">دقت و پایداری</div><div style="font-size:20px;font-weight:900;color:var(--iramo-primary);">۹۹.۴٪</div></div>
                        <div class="iramo-card" style="padding:18px;text-align:center;"><div style="font-size:12px;color:var(--iramo-muted);">ارسال لایسنس</div><div style="font-size:20px;font-weight:900;color:var(--iramo-primary);">فوری و خودکار</div></div>
                        <div class="iramo-card" style="padding:18px;text-align:center;"><div style="font-size:12px;color:var(--iramo-muted);">پشتیبانی</div><div style="font-size:20px;font-weight:900;color:var(--iramo-primary);">۲۴/۷ ربات و تیکت</div></div>
                    </section>
                <?php endif; ?>

                <?php if ( ( $s['show_description'] ?? 'yes' ) === 'yes' ) :
                    $raw_body   = get_post_field( 'post_content', $pid );
                    $highlights = array_values( array_filter( array_map( 'trim', explode( "\n", (string) get_post_meta( $pid, '_iramo_highlights', true ) ) ) ) );
                    if ( empty( $highlights ) ) {
                        $highlights = [ 'نصب سریع و بدون نیاز به دانش برنامه‌نویسی', 'اعلان خودکار سفارش به ربات تلگرام و بله مدیر', 'تحویل آنی فایل‌ها و جزئیات سفارش در حساب ووکامرس' ];
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
                                    <li style="padding:11px 14px;border-radius:12px;background:var(--iramo-canvas);display:flex;align-items:center;gap:10px;font-size:13.5px;"><span style="color:var(--iramo-primary);font-weight:900;">✓</span><span><?php echo esc_html( $hl ); ?></span></li>
                                <?php endforeach; ?>
                            </ul>
                        </div>
                    </section>
                <?php endif; ?>

                <?php if ( ( $s['show_steps'] ?? 'yes' ) === 'yes' ) : ?>
                    <section class="iramo-card" style="padding:24px;">
                        <h2 style="margin:0 0 16px;font-size:20px;font-weight:800;"><?php echo esc_html( $s['steps_title'] ?: 'روند کار و فعال‌سازی در ۳ گام' ); ?></h2>
                        <div class="iramo-grid-3">
                            <div style="padding:16px;border-radius:16px;background:var(--iramo-canvas);"><span class="iramo-badge">گام ۱</span><h3 style="margin:10px 0 6px;font-size:16px;font-weight:800;">ثبت سفارش و پرداخت</h3><p style="margin:0;font-size:13px;color:var(--iramo-muted);">پرداخت آنلاین امن از طریق درگاه ووکامرس انجام می‌شود.</p></div>
                            <div style="padding:16px;border-radius:16px;background:var(--iramo-canvas);"><span class="iramo-badge">گام ۲</span><h3 style="margin:10px 0 6px;font-size:16px;font-weight:800;">تحویل فوری و اعلان ربات</h3><p style="margin:0;font-size:13px;color:var(--iramo-muted);">فایل‌ها در بخش سفارش‌های ووکامرس فعال و اعلان به تلگرام و بله ارسال می‌شود.</p></div>
                            <div style="padding:16px;border-radius:16px;background:var(--iramo-canvas);"><span class="iramo-badge">گام ۳</span><h3 style="margin:10px 0 6px;font-size:16px;font-weight:800;">آپدیت و پشتیبانی</h3><p style="margin:0;font-size:13px;color:var(--iramo-muted);">به‌روزرسانی‌های بعدی به‌صورت استاندارد از حساب کاربری قابل دریافت است.</p></div>
                        </div>
                    </section>
                <?php endif; ?>

                <?php if ( ( $s['show_sandbox'] ?? 'yes' ) === 'yes' ) : ?>
                    <section id="iramo-sandbox-demo" class="iramo-card" style="padding:24px;" data-iramo-sandbox>
                        <h2 style="margin:0 0 8px;font-size:20px;font-weight:800;"><?php echo esc_html( $s['sandbox_title'] ?: 'محیط آزمایش سریع (Interactive Sandbox)' ); ?></h2>
                        <div class="iramo-search-form" style="margin-top:10px;">
                            <input type="text" data-sandbox-input class="iramo-input" value="فاکتور شماره ۴۸۲۱ - تحلیل و ثبت خودکار" />
                            <button type="button" data-sandbox-run class="iramo-btn iramo-btn-primary" style="white-space:nowrap;">اجرای تست آنلاین</button>
                        </div>
                        <div data-sandbox-output></div>
                    </section>
                <?php endif; ?>

                <?php if ( ( $s['show_faq'] ?? 'yes' ) === 'yes' && ! empty( $s['faqs'] ) ) : ?>
                    <section class="iramo-card" style="padding:24px;">
                        <h2 style="margin:0 0 14px;font-size:20px;font-weight:800;">سوالات متداول</h2>
                        <div style="display:grid;gap:10px;">
                            <?php foreach ( $s['faqs'] as $idx => $fq ) : ?>
                                <div class="iramo-faq-item <?php echo $idx === 0 ? 'is-open' : ''; ?>">
                                    <button type="button" class="iramo-faq-btn" data-iramo-faq-toggle><span><?php echo esc_html( $fq['q'] ); ?></span><span>+</span></button>
                                    <div class="iramo-faq-body"><?php echo esc_html( $fq['a'] ); ?></div>
                                </div>
                            <?php endforeach; ?>
                        </div>
                    </section>
                <?php endif; ?>
            </div>
            <?php
        }
    }

    // 20. AI Tools Directory Grid with Live Filter & Search (Granular Filter Toggles + Columns)
    class iRamo_Widget_AI_Tools_Grid extends iRamo_Base_Widget {
        public function get_name() { return 'iramo_ai_tools_grid'; }
        public function get_title() { return __( 'گرید دایرکتوری ابزارهای AI + فیلتر زنده', 'iramo-ai' ); }
        public function get_icon() { return 'eicon-gallery-grid'; }

        protected function register_controls() {
            $this->start_controls_section( 'sec_tools', [ 'label' => __( 'تنظیمات دایرکتوری', 'iramo-ai' ) ] );
            $this->add_control( 'show_header', [ 'label' => 'نمایش باکس تیتر و فیلتر', 'type' => \Elementor\Controls_Manager::SWITCHER, 'default' => 'yes' ] );
            $this->add_control( 'badge', [ 'label' => 'برچسب بالای تیتر', 'type' => \Elementor\Controls_Manager::TEXT, 'default' => 'دایرکتوری تاییدشده هوش مصنوعی', 'condition' => [ 'show_header' => 'yes' ] ] );
            $this->add_control( 'title', [ 'label' => 'تیتر دایرکتوری', 'type' => \Elementor\Controls_Manager::TEXT, 'default' => 'مجموعه تخصصی ابزارهای هوش مصنوعی', 'condition' => [ 'show_header' => 'yes' ] ] );
            $this->add_control( 'show_filters', [ 'label' => 'نمایش نوار جستجو و سلکت‌ها', 'type' => \Elementor\Controls_Manager::SWITCHER, 'default' => 'yes' ] );
            $this->add_control( 'show_chips', [ 'label' => 'نمایش تگ‌های سریع دسته‌بندی', 'type' => \Elementor\Controls_Manager::SWITCHER, 'default' => 'yes' ] );
            $this->add_control( 'show_grid', [ 'label' => 'نمایش گرید ابزارها', 'type' => \Elementor\Controls_Manager::SWITCHER, 'default' => 'yes' ] );
            $this->add_control( 'columns', [ 'label' => 'تعداد ستون', 'type' => \Elementor\Controls_Manager::SELECT, 'default' => '3', 'options' => [ '2' => '۲ ستونه', '3' => '۳ ستونه', '4' => '۴ ستونه' ], 'condition' => [ 'show_grid' => 'yes' ] ] );
            $this->add_control( 'posts_count', [ 'label' => 'تعداد ابزارها', 'type' => \Elementor\Controls_Manager::NUMBER, 'default' => 24, 'min' => 1, 'max' => 100, 'condition' => [ 'show_grid' => 'yes' ] ] );
            $this->add_control( 'loop_template_id', [ 'label' => 'قالب کارت (Loop Item)', 'type' => \Elementor\Controls_Manager::SELECT, 'default' => '', 'options' => $this->get_loop_item_options(), 'condition' => [ 'show_grid' => 'yes' ] ] );
            $this->end_controls_section();
            $this->register_iramo_card_style_controls();
        }

        protected function render() {
            $s        = $this->get_settings_for_display();
            $q_param  = sanitize_text_field( $_GET['q'] ?? '' );
            $tk_param = sanitize_text_field( $_GET['task'] ?? '' );
            $col      = in_array( $s['columns'], [ '2', '3', '4' ], true ) ? $s['columns'] : '3';
            $tasks    = [ 'AI Assistant', 'Art & Image', 'Video Generation', '3D & Avatar', 'Code Assistant', 'Audio & Music', 'Data & Finance', 'Automation & Agents', 'Writing & SEO', 'Research & Study' ];
            echo '<div class="iramo-container" dir="rtl" data-iramo-tools-filter-root>';
            if ( ( $s['show_header'] ?? 'yes' ) === 'yes' ) {
                echo '<div class="iramo-card" style="padding:22px;margin-bottom:20px;">';
                if ( ! empty( $s['badge'] ) ) echo '<span class="iramo-badge">' . esc_html( $s['badge'] ) . '</span>';
                if ( ! empty( $s['title'] ) ) echo '<h1 style="margin:8px 0 6px;font-size:24px;font-weight:900;">' . esc_html( $s['title'] ) . '</h1>';
                if ( ( $s['show_filters'] ?? 'yes' ) === 'yes' ) {
                    echo '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));gap:10px;margin-top:14px;">';
                    echo '<input type="search" data-filter-search class="iramo-input" value="' . esc_attr( $q_param ) . '" placeholder="جستجوی نام ابزار یا کاربرد..." />';
                    echo '<select data-filter-task class="iramo-input"><option value="">همه دسته‌بندی‌ها</option>';
                    foreach ( $tasks as $tk ) echo '<option value="' . esc_attr( $tk ) . '" ' . selected( $tk_param, $tk, false ) . '>' . esc_html( $tk ) . '</option>';
                    echo '</select>';
                    echo '<select data-filter-pricing class="iramo-input"><option value="">همه مدل‌های تعرفه</option><option value="Free">Free</option><option value="Freemium">Freemium</option><option value="Free Trial">Free Trial</option><option value="Paid">Paid</option></select>';
                    echo '</div>';
                }
                if ( ( $s['show_chips'] ?? 'yes' ) === 'yes' ) {
                    echo '<div class="iramo-chips" style="margin-top:12px;"><button type="button" class="iramo-chip is-active" data-quick-task="">همه</button>';
                    foreach ( $tasks as $tk ) echo '<button type="button" class="iramo-chip" data-quick-task="' . esc_attr( $tk ) . '">' . esc_html( $tk ) . '</button>';
                    echo '</div>';
                }
                echo '</div>';
            }
            if ( ( $s['show_grid'] ?? 'yes' ) === 'yes' ) {
                $loop_tpl_id = (int) ( $s['loop_template_id'] ?? 0 );
                $q = new \WP_Query( [ 'post_type' => 'iramo_ai_tool', 'post_status' => 'publish', 'posts_per_page' => (int) ( $s['posts_count'] ?? 24 ) ] );
                echo '<div class="iramo-grid-' . esc_attr( $col ) . '">';
                if ( $q->have_posts() ) {
                    while ( $q->have_posts() ) {
                        $q->the_post();
                        $pid = get_the_ID();
                        if ( $loop_tpl_id && function_exists( 'iramo_render_loop_item_template' ) ) {
                            $t_title    = get_the_title( $pid );
                            $t_provider = trim( (string) get_post_meta( $pid, '_iramo_provider', true ) );
                            $t_tagline  = get_post_meta( $pid, '_iramo_tagline', true );
                            $t_task     = get_post_meta( $pid, '_iramo_task', true ) ?: 'AI Assistant';
                            $t_input    = get_post_meta( $pid, '_iramo_input', true ) ?: 'Text';
                            $t_output   = get_post_meta( $pid, '_iramo_output', true ) ?: 'Text';
                            $t_pricing  = get_post_meta( $pid, '_iramo_pricing', true ) ?: 'Freemium';
                            echo '<div data-tool-item="1" data-title="' . esc_attr( mb_strtolower( trim( $t_title . ' ' . $t_provider . ' ' . $t_tagline . ' ' . $t_task ) ) ) . '" data-task="' . esc_attr( $t_task ) . '" data-input="' . esc_attr( $t_input ) . '" data-output="' . esc_attr( $t_output ) . '" data-pricing="' . esc_attr( $t_pricing ) . '">';
                            if ( ! iramo_render_loop_item_template( $loop_tpl_id, $pid ) && function_exists( 'iramo_render_tool_card' ) ) {
                                iramo_render_tool_card( $pid );
                            }
                            echo '</div>';
                            continue;
                        }
                        if ( function_exists( 'iramo_render_tool_card' ) ) iramo_render_tool_card( $pid );
                    }
                    wp_reset_postdata();
                }
                echo '</div>';
            }
            echo '</div>';
        }
    }

    // 21. Single AI Tool Card Widget
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

    // 22. Single AI Tool Header + Try Now + Vote Widget (NOW WITH FULL GRANULAR CONTROLS!)
    class iRamo_Widget_AI_Tool_Header extends iRamo_Base_Widget {
        public function get_name() { return 'iramo_ai_tool_header'; }
        public function get_title() { return __( 'هدر ابزار AI + دکمه ورود و رأی‌گیری', 'iramo-ai' ); }
        public function get_icon() { return 'eicon-header'; }

        protected function register_controls() {
            $this->start_controls_section( 'sec_th_content', [ 'label' => 'اجزا و دکمه‌های هدر ابزار' ] );
            $this->add_control( 'show_breadcrumbs', [ 'label' => 'نمایش مسیر صفحه (Breadcrumbs)', 'type' => \Elementor\Controls_Manager::SWITCHER, 'default' => 'yes' ] );
            $this->add_control( 'show_task_badge', [ 'label' => 'نمایش بج دسته‌بندی (Task)', 'type' => \Elementor\Controls_Manager::SWITCHER, 'default' => 'yes' ] );
            $this->add_control( 'show_provider', [ 'label' => 'نمایش نام شرکت سازنده', 'type' => \Elementor\Controls_Manager::SWITCHER, 'default' => 'yes' ] );
            $this->add_control( 'show_popularity', [ 'label' => 'نمایش امتیاز محبوبیت', 'type' => \Elementor\Controls_Manager::SWITCHER, 'default' => 'yes' ] );
            $this->add_control( 'show_try_btn', [ 'label' => 'نمایش دکمه ورود به سایت ابزار', 'type' => \Elementor\Controls_Manager::SWITCHER, 'default' => 'yes' ] );
            $this->add_control( 'try_btn_text', [ 'label' => 'متن دکمه ورود به ابزار', 'type' => \Elementor\Controls_Manager::TEXT, 'default' => 'ورود به سایت ابزار (Try Now) ↗', 'condition' => [ 'show_try_btn' => 'yes' ] ] );
            $this->add_control( 'show_votes', [ 'label' => 'نمایش دکمه‌های لایک و دیسلایک', 'type' => \Elementor\Controls_Manager::SWITCHER, 'default' => 'yes' ] );
            $this->add_control( 'tagline_override', [ 'label' => 'زیرعنوان جایگزین (اختیاری)', 'type' => \Elementor\Controls_Manager::TEXT, 'default' => '' ] );
            $this->end_controls_section();

            $this->start_controls_section( 'sec_th_btn_style', [ 'label' => 'استایل دکمه و برچسب‌ها', 'tab' => \Elementor\Controls_Manager::TAB_STYLE ] );
            $this->add_control( 'badge_bg', [ 'label' => 'پس‌زمینه بج دسته', 'type' => \Elementor\Controls_Manager::COLOR, 'selectors' => [ '{{WRAPPER}} .iramo-badge' => 'background-color: {{VALUE}};' ] ] );
            $this->add_control( 'badge_color', [ 'label' => 'رنگ متن بج', 'type' => \Elementor\Controls_Manager::COLOR, 'selectors' => [ '{{WRAPPER}} .iramo-badge' => 'color: {{VALUE}};' ] ] );
            $this->add_control( 'try_btn_bg', [ 'label' => 'رنگ دکمه Try Now', 'type' => \Elementor\Controls_Manager::COLOR, 'selectors' => [ '{{WRAPPER}} .iramo-btn-accent' => 'background-color: {{VALUE}};' ] ] );
            $this->add_control( 'try_btn_color', [ 'label' => 'رنگ متن دکمه Try Now', 'type' => \Elementor\Controls_Manager::COLOR, 'selectors' => [ '{{WRAPPER}} .iramo-btn-accent' => 'color: {{VALUE}};' ] ] );
            $this->end_controls_section();

            $this->register_iramo_card_style_controls();
        }

        protected function render() {
            $s   = $this->get_settings_for_display();
            $pid = get_the_ID();
            if ( ! $pid ) return;
            $title        = get_the_title( $pid );
            $provider_raw = trim( (string) get_post_meta( $pid, '_iramo_provider', true ) );
            $tagline      = ! empty( $s['tagline_override'] ) ? $s['tagline_override'] : ( get_post_meta( $pid, '_iramo_tagline', true ) ?: get_the_excerpt( $pid ) );
            $task         = get_post_meta( $pid, '_iramo_task', true ) ?: 'AI Assistant';
            $pop_raw      = trim( (string) get_post_meta( $pid, '_iramo_popularity', true ) );
            $likes_raw    = trim( (string) get_post_meta( $pid, '_iramo_likes', true ) );
            $dislikes_raw = trim( (string) get_post_meta( $pid, '_iramo_dislikes', true ) );
            $has_votes    = ( $likes_raw !== '' || $dislikes_raw !== '' );
            $likes        = $likes_raw !== '' ? (int) $likes_raw : 0;
            $dislikes     = $dislikes_raw !== '' ? (int) $dislikes_raw : 0;
            $url          = trim( (string) get_post_meta( $pid, '_iramo_url', true ) );
            $tools_url    = get_post_type_archive_link( 'iramo_ai_tool' ) ?: home_url( '/ai-tools/' );
            ?>
            <div dir="rtl">
                <?php if ( ( $s['show_breadcrumbs'] ?? 'yes' ) === 'yes' ) : ?>
                    <nav aria-label="مسیر صفحه" style="display:flex;flex-wrap:wrap;gap:8px;font-size:12.5px;color:var(--iramo-muted);margin-bottom:14px;">
                        <a href="<?php echo esc_url( home_url( '/' ) ); ?>">خانه</a><span>/</span>
                        <a href="<?php echo esc_url( $tools_url ); ?>">ابزارهای هوش مصنوعی</a><span>/</span>
                        <strong style="color:var(--iramo-ink);"><?php echo esc_html( $title ); ?></strong>
                    </nav>
                <?php endif; ?>
                <section class="iramo-card" style="padding:24px;">
                    <div style="display:flex;flex-wrap:wrap;align-items:flex-start;justify-content:space-between;gap:18px;">
                        <div style="flex:1;min-width:250px;">
                            <div style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:10px;">
                                <?php if ( ( $s['show_task_badge'] ?? 'yes' ) === 'yes' ) : ?><span class="iramo-badge"><?php echo esc_html( $task ); ?></span><?php endif; ?>
                                <?php if ( ( $s['show_provider'] ?? 'yes' ) === 'yes' && $provider_raw !== '' ) : ?><span class="iramo-meta-pill">ارائه‌دهنده: <?php echo esc_html( $provider_raw ); ?></span><?php endif; ?>
                                <?php if ( ( $s['show_popularity'] ?? 'yes' ) === 'yes' && $pop_raw !== '' ) : ?><span class="iramo-meta-pill">★ <?php echo esc_html( $pop_raw ); ?></span><?php endif; ?>
                            </div>
                            <h1 style="margin:0 0 8px;font-size:26px;font-weight:900;"><?php echo esc_html( $title ); ?></h1>
                            <p style="margin:0;font-size:15px;color:var(--iramo-muted);line-height:1.8;"><?php echo esc_html( $tagline ); ?></p>
                        </div>
                        <?php if ( ( ( $s['show_try_btn'] ?? 'yes' ) === 'yes' && $url !== '' && $url !== '#' ) || ( ( $s['show_votes'] ?? 'yes' ) === 'yes' && $has_votes ) ) : ?>
                            <div style="display:flex;flex-direction:column;gap:10px;min-width:220px;">
                                <?php if ( ( $s['show_try_btn'] ?? 'yes' ) === 'yes' && $url !== '' && $url !== '#' ) : ?>
                                    <a href="<?php echo esc_url( $url ); ?>" target="_blank" rel="noopener noreferrer" class="iramo-btn iramo-btn-accent"><?php echo esc_html( $s['try_btn_text'] ?: 'ورود به سایت ابزار (Try Now) ↗' ); ?></a>
                                <?php endif; ?>
                                <?php if ( ( $s['show_votes'] ?? 'yes' ) === 'yes' && $has_votes ) : ?>
                                    <div style="display:flex;gap:8px;">
                                        <button type="button" class="iramo-btn iramo-btn-outline" style="flex:1;padding:8px 12px;font-size:12.5px;" data-iramo-tool-vote="like" data-tool-id="<?php echo esc_attr( $pid ); ?>">👍 مفید بود (<span data-vote-count><?php echo esc_html( $likes ); ?></span>)</button>
                                        <button type="button" class="iramo-btn iramo-btn-outline" style="flex:1;padding:8px 12px;font-size:12.5px;" data-iramo-tool-vote="dislike" data-tool-id="<?php echo esc_attr( $pid ); ?>">👎 (<span data-vote-count><?php echo esc_html( $dislikes ); ?></span>)</button>
                                    </div>
                                <?php endif; ?>
                            </div>
                        <?php endif; ?>
                    </div>
                </section>
            </div>
            <?php
        }
    }

    // 23. AI Tool Specs Bar Widget (NOW WITH FULL GRANULAR CONTROLS!)
    class iRamo_Widget_AI_Tool_Specs extends iRamo_Base_Widget {
        public function get_name() { return 'iramo_ai_tool_specs'; }
        public function get_title() { return __( 'نوار مشخصات ابزار AI (ورودی/خروجی/قیمت)', 'iramo-ai' ); }
        public function get_icon() { return 'eicon-table'; }

        protected function register_controls() {
            $this->start_controls_section( 'sec_sp_items', [ 'label' => 'برچسب و نمایش مشخصات' ] );
            $this->add_control( 'columns', [ 'label' => 'تعداد ستون', 'type' => \Elementor\Controls_Manager::SELECT, 'default' => '4', 'options' => [ '2' => '۲ ستونه', '4' => '۴ ستونه' ] ] );
            $this->add_control( 'show_input', [ 'label' => 'نمایش باکس ورودی', 'type' => \Elementor\Controls_Manager::SWITCHER, 'default' => 'yes' ] );
            $this->add_control( 'label_input', [ 'label' => 'عنوان ورودی', 'type' => \Elementor\Controls_Manager::TEXT, 'default' => 'ورودی (Accepts)', 'condition' => [ 'show_input' => 'yes' ] ] );
            $this->add_control( 'show_output', [ 'label' => 'نمایش باکس خروجی', 'type' => \Elementor\Controls_Manager::SWITCHER, 'default' => 'yes' ] );
            $this->add_control( 'label_output', [ 'label' => 'عنوان خروجی', 'type' => \Elementor\Controls_Manager::TEXT, 'default' => 'خروجی (Produces)', 'condition' => [ 'show_output' => 'yes' ] ] );
            $this->add_control( 'show_pricing', [ 'label' => 'نمایش باکس تعرفه', 'type' => \Elementor\Controls_Manager::SWITCHER, 'default' => 'yes' ] );
            $this->add_control( 'label_pricing', [ 'label' => 'عنوان تعرفه', 'type' => \Elementor\Controls_Manager::TEXT, 'default' => 'تعرفه (Pricing)', 'condition' => [ 'show_pricing' => 'yes' ] ] );
            $this->add_control( 'show_api', [ 'label' => 'نمایش باکس دسترسی API و موبایل', 'type' => \Elementor\Controls_Manager::SWITCHER, 'default' => 'yes' ] );
            $this->add_control( 'label_api', [ 'label' => 'عنوان دسترسی فنی', 'type' => \Elementor\Controls_Manager::TEXT, 'default' => 'دسترسی فنی و موبایل', 'condition' => [ 'show_api' => 'yes' ] ] );
            $this->end_controls_section();

            $this->start_controls_section( 'sec_sp_style', [ 'label' => 'استایل باکس‌های مشخصات', 'tab' => \Elementor\Controls_Manager::TAB_STYLE ] );
            $this->add_control( 'cell_bg', [ 'label' => 'پس‌زمینه سلول‌ها', 'type' => \Elementor\Controls_Manager::COLOR, 'selectors' => [ '{{WRAPPER}} .iramo-spec-cell' => 'background-color: {{VALUE}};' ] ] );
            $this->add_control( 'cell_val_color', [ 'label' => 'رنگ مقدار اصلی', 'type' => \Elementor\Controls_Manager::COLOR, 'selectors' => [ '{{WRAPPER}} .iramo-spec-cell strong' => 'color: {{VALUE}};' ] ] );
            $this->add_group_control( \Elementor\Group_Control_Typography::get_type(), [ 'name' => 'cell_val_typo', 'selector' => '{{WRAPPER}} .iramo-spec-cell strong' ] );
            $this->end_controls_section();

            $this->register_iramo_card_style_controls();
        }

        protected function render() {
            $s   = $this->get_settings_for_display();
            $pid = get_the_ID();
            if ( ! $pid ) return;
            $in  = get_post_meta( $pid, '_iramo_input', true ) ?: 'Text';
            $out = get_post_meta( $pid, '_iramo_output', true ) ?: 'Text';
            $pr  = get_post_meta( $pid, '_iramo_starting_price', true ) ?: ( get_post_meta( $pid, '_iramo_pricing', true ) ?: 'Freemium' );
            $api = ( get_post_meta( $pid, '_iramo_has_api', true ) === '1' ? 'API رسمی ✓' : 'بدون API' ) . ' · ' . ( get_post_meta( $pid, '_iramo_has_mobile', true ) === '1' ? 'اپ موبایل ✓' : 'نسخه وب' );
            $col = ( $s['columns'] ?? '4' ) === '2' ? '2' : '4';
            ?>
            <div class="iramo-card" dir="rtl" style="padding:18px;">
                <div class="iramo-grid-<?php echo esc_attr( $col ); ?>">
                    <?php if ( ( $s['show_input'] ?? 'yes' ) === 'yes' ) : ?>
                        <div class="iramo-spec-cell" style="padding:12px;border-radius:14px;background:var(--iramo-canvas);"><div style="font-size:11.5px;color:var(--iramo-subtle);"><?php echo esc_html( $s['label_input'] ); ?></div><strong><?php echo esc_html( $in ); ?></strong></div>
                    <?php endif; ?>
                    <?php if ( ( $s['show_output'] ?? 'yes' ) === 'yes' ) : ?>
                        <div class="iramo-spec-cell" style="padding:12px;border-radius:14px;background:var(--iramo-canvas);"><div style="font-size:11.5px;color:var(--iramo-subtle);"><?php echo esc_html( $s['label_output'] ); ?></div><strong><?php echo esc_html( $out ); ?></strong></div>
                    <?php endif; ?>
                    <?php if ( ( $s['show_pricing'] ?? 'yes' ) === 'yes' ) : ?>
                        <div class="iramo-spec-cell" style="padding:12px;border-radius:14px;background:var(--iramo-canvas);"><div style="font-size:11.5px;color:var(--iramo-subtle);"><?php echo esc_html( $s['label_pricing'] ); ?></div><strong><?php echo esc_html( $pr ); ?></strong></div>
                    <?php endif; ?>
                    <?php if ( ( $s['show_api'] ?? 'yes' ) === 'yes' ) : ?>
                        <div class="iramo-spec-cell" style="padding:12px;border-radius:14px;background:var(--iramo-canvas);"><div style="font-size:11.5px;color:var(--iramo-subtle);"><?php echo esc_html( $s['label_api'] ); ?></div><strong><?php echo esc_html( $api ); ?></strong></div>
                    <?php endif; ?>
                </div>
            </div>
            <?php
        }
    }

    // 24. AI Tool Workflow & Copyable Prompt Widget (NOW WITH FULL GRANULAR CONTROLS!)
    class iRamo_Widget_AI_Tool_Workflow extends iRamo_Base_Widget {
        public function get_name() { return 'iramo_ai_tool_workflow'; }
        public function get_title() { return __( 'مراحل استفاده و نمونه پرامپت ابزار AI', 'iramo-ai' ); }
        public function get_icon() { return 'eicon-editor-code'; }

        protected function register_controls() {
            $this->start_controls_section( 'sec_wf_content', [ 'label' => 'تنظیمات مراحل و پرامپت' ] );
            $this->add_control( 'show_steps', [ 'label' => 'نمایش بخش مراحل شروع کار', 'type' => \Elementor\Controls_Manager::SWITCHER, 'default' => 'yes' ] );
            $this->add_control( 'steps_title', [ 'label' => 'تیتر مراحل استفاده', 'type' => \Elementor\Controls_Manager::TEXT, 'default' => 'مراحل شروع کار و استفاده گام‌به‌گام', 'condition' => [ 'show_steps' => 'yes' ] ] );
            $this->add_control( 'show_prompt', [ 'label' => 'نمایش باکس نمونه پرامپت', 'type' => \Elementor\Controls_Manager::SWITCHER, 'default' => 'yes' ] );
            $this->add_control( 'prompt_title', [ 'label' => 'تیتر باکس پرامپت', 'type' => \Elementor\Controls_Manager::TEXT, 'default' => 'نمونه پرامپت آماده برای شروع', 'condition' => [ 'show_prompt' => 'yes' ] ] );
            $this->add_control( 'copy_btn_text', [ 'label' => 'متن دکمه کپی پرامپت', 'type' => \Elementor\Controls_Manager::TEXT, 'default' => 'کپی پرامپت', 'condition' => [ 'show_prompt' => 'yes' ] ] );
            $this->end_controls_section();

            $this->start_controls_section( 'sec_wf_style', [ 'label' => 'استایل باکس پرامپت و مراحل', 'tab' => \Elementor\Controls_Manager::TAB_STYLE ] );
            $this->add_control( 'prompt_box_bg', [ 'label' => 'پس‌زمینه باکس کد پرامپت', 'type' => \Elementor\Controls_Manager::COLOR, 'selectors' => [ '{{WRAPPER}} .iramo-prompt-box' => 'background-color: {{VALUE}};' ] ] );
            $this->add_control( 'prompt_box_color', [ 'label' => 'رنگ متن پرامپت', 'type' => \Elementor\Controls_Manager::COLOR, 'selectors' => [ '{{WRAPPER}} .iramo-prompt-box' => 'color: {{VALUE}};' ] ] );
            $this->add_group_control( \Elementor\Group_Control_Typography::get_type(), [ 'name' => 'prompt_typo', 'selector' => '{{WRAPPER}} .iramo-prompt-box' ] );
            $this->end_controls_section();

            $this->register_iramo_card_style_controls();
        }

        protected function render() {
            $s      = $this->get_settings_for_display();
            $pid    = get_the_ID();
            if ( ! $pid ) return;
            $steps  = array_values( array_filter( array_map( 'trim', explode( "\n", (string) get_post_meta( $pid, '_iramo_steps', true ) ) ) ) );
            $prompt = get_post_meta( $pid, '_iramo_sample_prompt', true );
            echo '<div dir="rtl" style="display:grid;gap:16px;">';
            if ( ( $s['show_steps'] ?? 'yes' ) === 'yes' && ! empty( $steps ) ) {
                echo '<div class="iramo-card" style="padding:22px;"><h3 style="margin:0 0 12px;font-size:18px;font-weight:800;">' . esc_html( $s['steps_title'] ) . '</h3><div style="display:grid;gap:10px;">';
                foreach ( $steps as $i => $st ) {
                    echo '<div style="display:flex;gap:12px;align-items:flex-start;padding:12px 14px;border-radius:14px;background:var(--iramo-canvas);"><span class="iramo-badge" style="flex-shrink:0;">' . esc_html( $i + 1 ) . '</span><span style="font-size:13.5px;">' . esc_html( $st ) . '</span></div>';
                }
                echo '</div></div>';
            }
            if ( ( $s['show_prompt'] ?? 'yes' ) === 'yes' && $prompt ) {
                echo '<div class="iramo-card" style="padding:22px;"><div style="display:flex;justify-content:space-between;align-items:center;gap:10px;margin-bottom:12px;"><h3 style="margin:0;font-size:18px;font-weight:800;">' . esc_html( $s['prompt_title'] ) . '</h3><button type="button" class="iramo-btn iramo-btn-accent" style="padding:6px 14px;font-size:12px;" data-iramo-copy-prompt="' . esc_attr( $prompt ) . '">' . esc_html( $s['copy_btn_text'] ?: 'کپی پرامپت' ) . '</button></div><div class="iramo-prompt-box">' . esc_html( $prompt ) . '</div></div>';
            }
            echo '</div>';
        }
    }

    // 25. AI Tool Body, Features & Audience Widget (NOW WITH FULL GRANULAR CONTROLS!)
    class iRamo_Widget_AI_Tool_Features extends iRamo_Base_Widget {
        public function get_name() { return 'iramo_ai_tool_features'; }
        public function get_title() { return __( 'توضیحات کامل، ویژگی‌ها و مخاطبان ابزار AI', 'iramo-ai' ); }
        public function get_icon() { return 'eicon-bullet-list'; }

        protected function register_controls() {
            $this->start_controls_section( 'sec_tf_content', [ 'label' => 'کنترل بخش‌های محتوا' ] );
            $this->add_control( 'show_body', [ 'label' => 'نمایش معرفی و بررسی کامل', 'type' => \Elementor\Controls_Manager::SWITCHER, 'default' => 'yes' ] );
            $this->add_control( 'body_title', [ 'label' => 'تیتر بخش معرفی', 'type' => \Elementor\Controls_Manager::TEXT, 'default' => 'معرفی و بررسی کامل ابزار', 'condition' => [ 'show_body' => 'yes' ] ] );
            $this->add_control( 'show_pricing_box', [ 'label' => 'نمایش باکس جزئیات تعرفه', 'type' => \Elementor\Controls_Manager::SWITCHER, 'default' => 'yes', 'condition' => [ 'show_body' => 'yes' ] ] );
            $this->add_control( 'show_features', [ 'label' => 'نمایش ویژگی‌های کلیدی', 'type' => \Elementor\Controls_Manager::SWITCHER, 'default' => 'yes' ] );
            $this->add_control( 'features_title', [ 'label' => 'تیتر ویژگی‌های کلیدی', 'type' => \Elementor\Controls_Manager::TEXT, 'default' => 'ویژگی‌ها و قابلیت‌های کلیدی', 'condition' => [ 'show_features' => 'yes' ] ] );
            $this->add_control( 'features_cols', [ 'label' => 'تعداد ستون ویژگی‌ها', 'type' => \Elementor\Controls_Manager::SELECT, 'default' => '2', 'options' => [ '1' => '۱ ستونه', '2' => '۲ ستونه' ], 'condition' => [ 'show_features' => 'yes' ] ] );
            $this->add_control( 'show_audience', [ 'label' => 'نمایش بخش مخاطبان هدف', 'type' => \Elementor\Controls_Manager::SWITCHER, 'default' => 'yes' ] );
            $this->add_control( 'audience_title', [ 'label' => 'تیتر مخاطبان هدف', 'type' => \Elementor\Controls_Manager::TEXT, 'default' => 'این ابزار برای چه کسانی مناسب است؟', 'condition' => [ 'show_audience' => 'yes' ] ] );
            $this->end_controls_section();

            $this->start_controls_section( 'sec_tf_style', [ 'label' => 'استایل ویژگی‌ها و چیپ‌ها', 'tab' => \Elementor\Controls_Manager::TAB_STYLE ] );
            $this->add_control( 'feat_item_bg', [ 'label' => 'پس‌زمینه باکس هر ویژگی', 'type' => \Elementor\Controls_Manager::COLOR, 'selectors' => [ '{{WRAPPER}} .iramo-feat-item' => 'background-color: {{VALUE}};' ] ] );
            $this->add_control( 'check_color', [ 'label' => 'رنگ علامت تیک ✓', 'type' => \Elementor\Controls_Manager::COLOR, 'selectors' => [ '{{WRAPPER}} .iramo-feat-check' => 'color: {{VALUE}};' ] ] );
            $this->end_controls_section();

            $this->register_iramo_card_style_controls();
        }

        protected function render() {
            $s            = $this->get_settings_for_display();
            $pid          = get_the_ID();
            if ( ! $pid ) return;
            $body         = get_post_field( 'post_content', $pid );
            $pricing_info = get_post_meta( $pid, '_iramo_pricing_details', true );
            $features     = array_values( array_filter( array_map( 'trim', explode( "\n", (string) get_post_meta( $pid, '_iramo_features', true ) ) ) ) );
            $audience     = array_values( array_filter( array_map( 'trim', explode( "\n", (string) get_post_meta( $pid, '_iramo_audience', true ) ) ) ) );
            $fgrid        = ( $s['features_cols'] ?? '2' ) === '1' ? 'display:grid;gap:10px;' : '';
            $fclass       = ( $s['features_cols'] ?? '2' ) === '1' ? '' : 'iramo-grid-2';

            echo '<div dir="rtl" style="display:grid;gap:16px;">';
            if ( ( $s['show_body'] ?? 'yes' ) === 'yes' && ( $body || $pricing_info ) ) {
                echo '<div class="iramo-card" style="padding:22px;"><h3 style="margin:0 0 10px;font-size:18px;font-weight:800;">' . esc_html( $s['body_title'] ) . '</h3>';
                if ( $body ) echo '<div style="font-size:14.5px;line-height:1.95;color:var(--iramo-muted);">' . wp_kses_post( apply_filters( 'the_content', $body ) ) . '</div>';
                if ( ( $s['show_pricing_box'] ?? 'yes' ) === 'yes' && $pricing_info ) {
                    echo '<div style="margin-top:14px;padding:12px 14px;border-radius:12px;background:var(--iramo-primary-soft);border:1px solid var(--iramo-border);font-size:13.5px;"><strong>جزئیات تعرفه و نسخه رایگان:</strong> ' . esc_html( $pricing_info ) . '</div>';
                }
                echo '</div>';
            }
            if ( ( $s['show_features'] ?? 'yes' ) === 'yes' && ! empty( $features ) ) {
                echo '<div class="iramo-card" style="padding:22px;"><h3 style="margin:0 0 12px;font-size:18px;font-weight:800;">' . esc_html( $s['features_title'] ) . '</h3><div class="' . esc_attr( $fclass ) . '" style="' . esc_attr( $fgrid ) . '">';
                foreach ( $features as $f ) {
                    echo '<div class="iramo-feat-item" style="padding:11px 14px;border-radius:14px;background:var(--iramo-canvas);border:1px solid var(--iramo-border-subtle);display:flex;align-items:flex-start;gap:8px;font-size:13.5px;"><span class="iramo-feat-check" style="color:var(--iramo-primary);font-weight:900;">✓</span><span>' . esc_html( $f ) . '</span></div>';
                }
                echo '</div></div>';
            }
            if ( ( $s['show_audience'] ?? 'yes' ) === 'yes' && ! empty( $audience ) ) {
                echo '<div class="iramo-card" style="padding:22px;"><h3 style="margin:0 0 12px;font-size:18px;font-weight:800;">' . esc_html( $s['audience_title'] ) . '</h3><div class="iramo-chips">';
                foreach ( $audience as $aud ) echo '<span class="iramo-chip is-active">' . esc_html( $aud ) . '</span>';
                echo '</div></div>';
            }
            echo '</div>';
        }
    }

    // 26. Academy Courses Grid Widget
    class iRamo_Widget_Courses_Grid extends iRamo_Base_Widget {
        public function get_name() { return 'iramo_courses_grid'; }
        public function get_title() { return __( 'گرید دوره‌های آکادمی (iRamoAi)', 'iramo-ai' ); }
        public function get_icon() { return 'eicon-graduation-cap'; }

        protected function register_controls() {
            $this->start_controls_section( 'sec_courses', [ 'label' => __( 'تنظیمات دوره‌ها', 'iramo-ai' ) ] );
            $this->add_control( 'show_header', [ 'label' => 'نمایش باکس عنوان بالای گرید', 'type' => \Elementor\Controls_Manager::SWITCHER, 'default' => 'yes' ] );
            $this->add_control( 'badge', [ 'label' => 'برچسب', 'type' => \Elementor\Controls_Manager::TEXT, 'default' => 'آکادمی تخصصی iRamoAi', 'condition' => [ 'show_header' => 'yes' ] ] );
            $this->add_control( 'title', [ 'label' => 'تیتر بخش', 'type' => \Elementor\Controls_Manager::TEXT, 'default' => 'دوره‌های آموزشی هوش مصنوعی و اتوماسیون', 'condition' => [ 'show_header' => 'yes' ] ] );
            $this->add_control( 'columns', [ 'label' => 'تعداد ستون', 'type' => \Elementor\Controls_Manager::SELECT, 'default' => '3', 'options' => [ '2' => '۲ ستونه', '3' => '۳ ستونه' ] ] );
            $this->add_control( 'posts_count', [ 'label' => 'تعداد دوره‌ها', 'type' => \Elementor\Controls_Manager::NUMBER, 'default' => 6, 'min' => 1, 'max' => 24 ] );
            $this->add_control( 'loop_template_id', [ 'label' => 'قالب کارت (Loop Item)', 'type' => \Elementor\Controls_Manager::SELECT, 'default' => '', 'options' => $this->get_loop_item_options() ] );
            $this->end_controls_section();
            $this->register_iramo_card_style_controls();
        }

        protected function render() {
            $s   = $this->get_settings_for_display();
            $q   = new \WP_Query( [ 'post_type' => 'iramo_course', 'post_status' => 'publish', 'posts_per_page' => (int) ( $s['posts_count'] ?? 6 ) ] );
            $col = ( $s['columns'] ?? '3' ) === '2' ? '2' : '3';
            $loop_tpl_id = (int) ( $s['loop_template_id'] ?? 0 );
            echo '<div class="iramo-container" dir="rtl">';
            if ( ( $s['show_header'] ?? 'yes' ) === 'yes' && ! empty( $s['title'] ) ) {
                echo '<div class="iramo-card" style="padding:22px;margin-bottom:20px;"><span class="iramo-badge">' . esc_html( $s['badge'] ) . '</span><h1 style="margin:8px 0 0;font-size:24px;font-weight:900;">' . esc_html( $s['title'] ) . '</h1></div>';
            }
            echo '<div class="iramo-grid-' . esc_attr( $col ) . '">';
            if ( $q->have_posts() ) {
                while ( $q->have_posts() ) {
                    $q->the_post();
                    $pid = get_the_ID();
                    if ( $loop_tpl_id && function_exists( 'iramo_render_loop_item_template' ) && iramo_render_loop_item_template( $loop_tpl_id, $pid ) ) {
                        continue;
                    }
                    if ( function_exists( 'iramo_render_course_card' ) ) iramo_render_course_card( $pid );
                }
                wp_reset_postdata();
            }
            echo '</div></div>';
        }
    }

    // 27. Articles Grid Widget
    class iRamo_Widget_Articles_Grid extends iRamo_Base_Widget {
        public function get_name() { return 'iramo_articles_grid'; }
        public function get_title() { return __( 'گرید مقالات و ابزارک‌ها (iRamoAi)', 'iramo-ai' ); }
        public function get_icon() { return 'eicon-posts-grid'; }

        protected function register_controls() {
            $this->start_controls_section( 'sec_articles', [ 'label' => __( 'تنظیمات مقالات', 'iramo-ai' ) ] );
            $this->add_control( 'show_header', [ 'label' => 'نمایش باکس عنوان بالای گرید', 'type' => \Elementor\Controls_Manager::SWITCHER, 'default' => 'yes' ] );
            $this->add_control( 'badge', [ 'label' => 'برچسب', 'type' => \Elementor\Controls_Manager::TEXT, 'default' => 'مقالات و ابزارک‌های کاربردی', 'condition' => [ 'show_header' => 'yes' ] ] );
            $this->add_control( 'title', [ 'label' => 'تیتر بخش', 'type' => \Elementor\Controls_Manager::TEXT, 'default' => 'مقالات تخصصی هوش مصنوعی و اتوماسیون', 'condition' => [ 'show_header' => 'yes' ] ] );
            $this->add_control( 'columns', [ 'label' => 'تعداد ستون', 'type' => \Elementor\Controls_Manager::SELECT, 'default' => '3', 'options' => [ '2' => '۲ ستونه', '3' => '۳ ستونه' ] ] );
            $this->add_control( 'posts_count', [ 'label' => 'تعداد مقالات', 'type' => \Elementor\Controls_Manager::NUMBER, 'default' => 6, 'min' => 1, 'max' => 24 ] );
            $this->add_control( 'loop_template_id', [ 'label' => 'قالب کارت (Loop Item)', 'type' => \Elementor\Controls_Manager::SELECT, 'default' => '', 'options' => $this->get_loop_item_options() ] );
            $this->end_controls_section();
            $this->register_iramo_card_style_controls();
        }

        protected function render() {
            $s   = $this->get_settings_for_display();
            $q   = new \WP_Query( [
                'post_type'      => 'post',
                'post_status'    => 'publish',
                'posts_per_page' => (int) ( $s['posts_count'] ?? 6 ),
            ] );
            $col = ( $s['columns'] ?? '3' ) === '2' ? '2' : '3';
            $loop_tpl_id = (int) ( $s['loop_template_id'] ?? 0 );
            echo '<div class="iramo-container" dir="rtl">';
            if ( ( $s['show_header'] ?? 'yes' ) === 'yes' && ! empty( $s['title'] ) ) {
                echo '<div class="iramo-card" style="padding:22px;margin-bottom:20px;"><span class="iramo-badge">' . esc_html( $s['badge'] ) . '</span><h1 style="margin:8px 0 0;font-size:24px;font-weight:900;">' . esc_html( $s['title'] ) . '</h1></div>';
            }
            echo '<div class="iramo-grid-' . esc_attr( $col ) . '">';
            if ( $q->have_posts() ) {
                while ( $q->have_posts() ) {
                    $q->the_post();
                    $pid = get_the_ID();
                    if ( get_post_field( 'post_name', $pid ) === 'hello-world' && $q->found_posts > 1 ) {
                        continue;
                    }
                    if ( $loop_tpl_id && function_exists( 'iramo_render_loop_item_template' ) && iramo_render_loop_item_template( $loop_tpl_id, $pid ) ) {
                        continue;
                    }
                    if ( function_exists( 'iramo_render_article_card' ) ) iramo_render_article_card( $pid );
                }
                wp_reset_postdata();
            }
            echo '</div></div>';
        }
    }

    // 28. Consultation & Services Form Widget (1-to-1 Match with ServicesConsultationView)
    class iRamo_Widget_Consultation_Form extends iRamo_Base_Widget {
        public function get_name() { return 'iramo_consultation_form'; }
        public function get_title() { return __( 'خدمات و فرم مشاوره متصل به ربات (iRamoAi)', 'iramo-ai' ); }
        public function get_icon() { return 'eicon-form-horizontal'; }

        protected function register_controls() {
            $this->start_controls_section( 'sec_form', [ 'label' => __( 'تنظیمات فرم مشاوره', 'iramo-ai' ) ] );
            $this->add_control( 'show_service_cards', [ 'label' => 'نمایش ستون معرفی و کارت‌های خدمات', 'type' => \Elementor\Controls_Manager::SWITCHER, 'default' => 'yes' ] );
            $this->add_control( 'eyebrow', [ 'label' => 'برچسب بالای عنوان', 'type' => \Elementor\Controls_Manager::TEXT, 'default' => 'مهندسی پروژه و مشاوره تخصصی', 'condition' => [ 'show_service_cards' => 'yes' ] ] );
            $this->add_control( 'hero_heading', [ 'label' => 'تیتر اصلی بخش خدمات', 'type' => \Elementor\Controls_Manager::TEXT, 'default' => 'پروژه هوشمند کسب‌وکار خود را به تیم iRamoAi بسپارید', 'condition' => [ 'show_service_cards' => 'yes' ] ] );
            $this->add_control( 'hero_desc', [ 'label' => 'توضیح زیر تیتر خدمات', 'type' => \Elementor\Controls_Manager::TEXTAREA, 'default' => 'تمامی درخواست‌های ثبت‌شده بلافاصله از طریق پل ربات به تلگرام و بله تیم فنی ارسال می‌شوند تا در کمتر از ۲ ساعت جلسه بررسی زمان‌بندی شود.', 'condition' => [ 'show_service_cards' => 'yes' ] ] );
            $rep = new \Elementor\Repeater();
            $rep->add_control( 'num', [ 'label' => 'شماره ردیف', 'type' => \Elementor\Controls_Manager::TEXT, 'default' => '۰۱.' ] );
            $rep->add_control( 'title', [ 'label' => 'تیتر خدمت', 'type' => \Elementor\Controls_Manager::TEXT, 'default' => 'طراحی ربات‌های فروشگاهی و پشتیبانی تلگرام و بله' ] );
            $rep->add_control( 'desc', [ 'label' => 'توضیح کوتاه', 'type' => \Elementor\Controls_Manager::TEXTAREA, 'default' => 'اتصال کامل به درگاه پرداخت، ووکامرس، احراز هویت کد تایید و پشتیبانی هوشمند ۲۴ ساعته.' ] );
            $this->add_control( 'services', [
                'label' => 'کارت‌های معرفی خدمات',
                'type' => \Elementor\Controls_Manager::REPEATER,
                'fields' => $rep->get_controls(),
                'title_field' => '{{{ title }}}',
                'condition' => [ 'show_service_cards' => 'yes' ],
                'default' => [
                    [ 'num' => '۰۱.', 'title' => 'طراحی ربات‌های فروشگاهی و پشتیبانی تلگرام و بله', 'desc' => 'اتصال کامل به درگاه پرداخت، ووکامرس، احراز هویت کد تایید و پشتیبانی هوشمند ۲۴ ساعته.' ],
                    [ 'num' => '۰۲.', 'title' => 'هوشمندسازی و اتوماسیون فرآیندهای سازمانی', 'desc' => 'حذف کارهای تکراری، تحلیل فاکتورها با حسابیار و اتصال فرم‌های المنتور به CRM.' ],
                    [ 'num' => '۰۳.', 'title' => 'توسعه پلاگین‌های اختصاصی وردپرس و آکادمی', 'desc' => 'پیاده‌سازی سیستم‌های آموزش آنلاین، بازار ابزارها و داشبورد کاربری سریع بدون کندی سایت.' ],
                ],
            ] );
            $this->add_control( 'title', [ 'label' => 'تیتر فرم', 'type' => \Elementor\Controls_Manager::TEXT, 'default' => 'فرم درخواست مشاوره و برآورد پروژه' ] );
            $this->add_control( 'btn_text', [ 'label' => 'متن دکمه ارسال', 'type' => \Elementor\Controls_Manager::TEXT, 'default' => 'ارسال درخواست مشاوره' ] );
            $this->end_controls_section();
            $this->register_iramo_card_style_controls();
        }

        protected function render() {
            $s          = $this->get_settings_for_display();
            $list       = $s['services'] ?? [];
            $show_cards = ( $s['show_service_cards'] ?? 'yes' ) === 'yes';
            ?>
            <section class="iramo-container" dir="rtl">
                <div class="<?php echo $show_cards ? 'iramo-grid-2' : ''; ?>" style="align-items:start;gap:28px;">
                    <?php if ( $show_cards ) : ?>
                        <div style="display:grid;gap:20px;">
                            <div style="display:grid;gap:8px;">
                                <?php if ( ! empty( $s['eyebrow'] ) ) : ?>
                                    <p style="margin:0;font-size:12px;font-weight:700;color:var(--iramo-primary);"><?php echo esc_html( $s['eyebrow'] ); ?></p>
                                <?php endif; ?>
                                <?php if ( ! empty( $s['hero_heading'] ) ) : ?>
                                    <h1 style="margin:0;font-size:28px;font-weight:800;line-height:1.35;color:var(--iramo-ink);"><?php echo esc_html( $s['hero_heading'] ); ?></h1>
                                <?php endif; ?>
                                <?php if ( ! empty( $s['hero_desc'] ) ) : ?>
                                    <p style="margin:4px 0 0;font-size:14px;color:var(--iramo-muted);line-height:1.85;"><?php echo esc_html( $s['hero_desc'] ); ?></p>
                                <?php endif; ?>
                            </div>
                            <?php if ( ! empty( $list ) ) : ?>
                                <div style="display:grid;gap:12px;">
                                    <?php foreach ( $list as $srv ) : ?>
                                        <div class="iramo-card" style="padding:18px 20px;">
                                            <p style="margin:0 0 6px;font-size:14.5px;font-weight:800;color:var(--iramo-ink);">
                                                <?php if ( ! empty( $srv['num'] ) ) : ?><span style="color:var(--iramo-primary);margin-inline-end:8px;"><?php echo esc_html( $srv['num'] ); ?></span><?php endif; ?>
                                                <?php echo esc_html( $srv['title'] ); ?>
                                            </p>
                                            <p style="margin:0;font-size:12.5px;color:var(--iramo-muted);line-height:1.75;"><?php echo esc_html( $srv['desc'] ); ?></p>
                                        </div>
                                    <?php endforeach; ?>
                                </div>
                            <?php endif; ?>
                        </div>
                    <?php endif; ?>

                    <div class="iramo-card" style="padding:26px;">
                        <h2 style="margin:0 0 18px;font-size:18px;font-weight:800;color:var(--iramo-ink);"><?php echo esc_html( $s['title'] ); ?></h2>
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
                                <span><?php echo esc_html( $s['btn_text'] ?: 'ارسال درخواست مشاوره' ); ?></span>
                            </button>
                            <div data-consultation-msg style="font-size:12.5px;font-weight:700;color:var(--iramo-primary);"></div>
                        </form>
                    </div>
                </div>
            </section>
            <?php
        }
    }

    // Register All 28 Granular + Full Pure WordPress & Elementor Widgets
    $widgets_manager->register( new iRamo_Widget_Logo() );
    $widgets_manager->register( new iRamo_Widget_Nav_Menu() );
    $widgets_manager->register( new iRamo_Widget_Header_Actions() );
    $widgets_manager->register( new iRamo_Widget_Badge() );
    $widgets_manager->register( new iRamo_Widget_Button_Group() );
    $widgets_manager->register( new iRamo_Widget_Proof_List() );
    $widgets_manager->register( new iRamo_Widget_Hero_Media_Box() );
    $widgets_manager->register( new iRamo_Widget_Social_Links() );
    $widgets_manager->register( new iRamo_Widget_Footer_Links_Col() );
    $widgets_manager->register( new iRamo_Widget_Newsletter_Form() );
    $widgets_manager->register( new iRamo_Widget_Theme_Toggle_Chip() );
    $widgets_manager->register( new iRamo_Widget_Related_Tools() );

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
} );
