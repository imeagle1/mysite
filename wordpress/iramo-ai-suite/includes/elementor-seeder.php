<?php
/**
 * Module: Granular Atomic Elementor Pages & Theme Builder Library Seeder (v2.4.0)
 * Seeds every Page (Home, Services, Panel) AND every Theme Builder Library Template
 * (Header, Footer, AI Tools Archive/Single, Products Archive/Single, Courses, Articles, 404)
 * using nested Elementor Flexbox Containers + individual draggable atomic widgets.
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

function iramo_el_widget( $id, $widget_type, $settings = [] ) {
    return [
        'id'         => $id,
        'elType'     => 'widget',
        'widgetType' => $widget_type,
        'settings'   => empty( $settings ) ? new stdClass() : $settings,
        'elements'   => [],
    ];
}

function iramo_el_container( $id, $children, $settings = [], $is_inner = false ) {
    $base = array_merge( [
        'content_width' => 'full',
        'padding'       => [ 'unit' => 'px', 'top' => '0', 'right' => '0', 'bottom' => '0', 'left' => '0', 'isLinked' => true ],
    ], $settings );
    $node = [
        'id'       => $id,
        'elType'   => 'container',
        'settings' => $base,
        'elements' => $children,
    ];
    if ( $is_inner ) {
        $node['isInner'] = true;
    }
    return $node;
}

function iramo_save_elementor_payload( $post_id, $elements, $tpl_type = 'wp-page', $conditions = [] ) {
    update_post_meta( $post_id, '_elementor_edit_mode', 'builder' );
    update_post_meta( $post_id, '_elementor_template_type', $tpl_type );
    update_post_meta( $post_id, '_elementor_version', '3.24.0' );
    update_post_meta( $post_id, '_iramo_seed_version', '2.4.0' );
    $json = wp_json_encode( $elements, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES );
    update_post_meta( $post_id, '_elementor_data', wp_slash( $json ) );
    if ( ! empty( $conditions ) ) {
        update_post_meta( $post_id, '_elementor_conditions', $conditions );
    }
    delete_post_meta( $post_id, '_elementor_css' );
}

function iramo_should_upgrade_seed( $post_id, $force = false ) {
    if ( $force ) {
        return true;
    }
    $raw = (string) get_post_meta( $post_id, '_elementor_data', true );
    if ( $raw === '' ) {
        return true;
    }
    $seed_ver = (string) get_post_meta( $post_id, '_iramo_seed_version', true );
    if ( $seed_ver === '2.4.0' ) {
        return false;
    }
    // Upgrade untouched 2.3.0 monolithic scaffolds cleanly without touching custom user layouts
    foreach ( [ 'iramo_hw_1', 'iramo_srv_w1', 'iramo_hdr_w1', 'iramo_ftr_w1', 'iramo_st_w1' ] as $legacy_marker ) {
        if ( strpos( $raw, $legacy_marker ) !== false ) {
            return true;
        }
    }
    return false;
}

/**
 * Create or update an Elementor Library Template (`elementor_library`)
 */
function iramo_upsert_elementor_library( $slug, $title, $lib_type, $elements, $conditions = [], $force = false ) {
    $existing = get_posts( [
        'post_type'      => 'elementor_library',
        'post_status'    => [ 'publish', 'draft', 'private' ],
        'meta_key'       => '_iramo_library_slug',
        'meta_value'     => $slug,
        'posts_per_page' => 1,
        'fields'         => 'ids',
    ] );

    $tpl_id = ! empty( $existing ) ? (int) $existing[0] : 0;
    if ( $tpl_id && ! iramo_should_upgrade_seed( $tpl_id, $force ) ) {
        return $tpl_id;
    }

    $post_args = [
        'post_type'   => 'elementor_library',
        'post_title'  => $title,
        'post_name'   => $slug,
        'post_status' => 'publish',
    ];
    if ( $tpl_id ) {
        $post_args['ID'] = $tpl_id;
        wp_update_post( $post_args );
    } else {
        $tpl_id = wp_insert_post( $post_args );
    }

    if ( $tpl_id && ! is_wp_error( $tpl_id ) ) {
        update_post_meta( $tpl_id, '_iramo_library_slug', $slug );
        if ( taxonomy_exists( 'elementor_library_type' ) ) {
            wp_set_object_terms( $tpl_id, $lib_type, 'elementor_library_type' );
        }
        iramo_save_elementor_payload( $tpl_id, $elements, $lib_type, $conditions );
    }
    return (int) $tpl_id;
}

/**
 * Render an auto-seeded Elementor Library Template (also works in Free Elementor without Pro)
 */
function iramo_render_elementor_template( $slug, $before = '', $after = '' ) {
    if ( ! class_exists( '\Elementor\Plugin' ) ) {
        return false;
    }
    $found = get_posts( [
        'post_type'      => 'elementor_library',
        'post_status'    => 'publish',
        'meta_key'       => '_iramo_library_slug',
        'meta_value'     => $slug,
        'posts_per_page' => 1,
        'fields'         => 'ids',
    ] );
    if ( empty( $found ) ) {
        return false;
    }
    $tpl_id = (int) $found[0];
    $html   = \Elementor\Plugin::$instance->frontend->get_builder_content_for_display( $tpl_id, true );
    if ( empty( $html ) ) {
        return false;
    }
    echo $before . $html . $after;
    return true;
}

/**
 * Build & Seed All Granular Atomic Elementor Pages + Theme Builder Library Templates
 */
function iramo_provision_elementor_layouts( $page_ids = [], $force = false ) {
    // 1. Page: Home (صفحه اصلی با ۲۲ ویجت و کانتینر مجزا و قابل جابه‌جایی بدون تغییر UI)
    if ( ! empty( $page_ids['home'] ) ) {
        $home_id = (int) $page_ids['home'];
        if ( iramo_should_upgrade_seed( $home_id, $force ) ) {
            $home_elements = [
                // Section 1: Hero
                iramo_el_container( 'irhs100', [
                    iramo_el_container( 'irhs110', [
                        // Hero Right Column (Badge + H1 + Text + Dual Buttons + Proof List)
                        iramo_el_container( 'irhs111', [
                            iramo_el_widget( 'irhw101', 'iramo_badge', [
                                'text'        => '✨ اکوسیستم نرم‌افزار و هوش مصنوعی فارسی',
                                '_css_classes' => 'iramo-el-tight',
                            ] ),
                            iramo_el_widget( 'irhw102', 'heading', [
                                'title'        => 'آینده کسب‌وکار شما با دستیارها و محصولات هوش مصنوعی',
                                'header_size'  => 'h1',
                                '_css_classes' => 'iramo-el-hero-title iramo-el-tight',
                            ] ),
                            iramo_el_widget( 'irhw103', 'text-editor', [
                                'editor'       => '<p>نرم‌افزارهای آماده حسابیار و ویدئومی، دایرکتوری دست‌چین ابزارهای AI و آکادمی تخصصی آموزش و اتوماسیون در یک پلتفرم یکپارچه.</p>',
                                '_css_classes' => 'iramo-el-subtitle iramo-el-tight',
                            ] ),
                            iramo_el_widget( 'irhw104', 'iramo_button_group', [
                                'buttons' => [
                                    [ 'label' => 'مشاهده محصولات آماده ←', 'url' => [ 'url' => '/products/' ], 'variant' => 'accent' ],
                                    [ 'label' => 'دایرکتوری ابزارهای AI', 'url' => [ 'url' => '/ai-tools/' ], 'variant' => 'outline' ],
                                ],
                                '_css_classes' => 'iramo-el-tight',
                            ] ),
                            iramo_el_widget( 'irhw105', 'iramo_proof_list', [
                                'items' => [
                                    [ 'text' => '✓ اتصال بومی ووکامرس' ],
                                    [ 'text' => '✓ پنل تلگرام و بله' ],
                                    [ 'text' => '✓ ۱۸ ابزار دست‌چین AI' ],
                                    [ 'text' => '✓ سئو کامل سمت سرور' ],
                                ],
                                '_css_classes' => 'iramo-el-tight',
                            ] ),
                        ], [ 'css_classes' => 'iramo-el-col-stack' ], true ),
                        // Hero Left Column (Media Box + Floating Chip)
                        iramo_el_container( 'irhs112', [
                            iramo_el_widget( 'irhw106', 'iramo_hero_media_box', [
                                'show_float_chip' => 'yes',
                                'chip_title'      => 'اتوماسیون حسابداری، محتوا و آموزش',
                                'chip_sub'        => 'ساخته شده برای تیم‌های ایرانی',
                                'chip_cta_text'   => 'ورود به پنل',
                                'chip_cta_url'    => [ 'url' => '/panel/' ],
                                '_css_classes'    => 'iramo-el-tight',
                            ] ),
                        ], [ 'css_classes' => 'iramo-el-col-stack' ], true ),
                    ], [
                        'css_classes'    => 'iramo-container iramo-hero-grid',
                        'padding'        => [ 'unit' => 'px', 'top' => '0', 'right' => '24', 'bottom' => '0', 'left' => '24', 'isLinked' => false ],
                        'padding_mobile' => [ 'unit' => 'px', 'top' => '0', 'right' => '16', 'bottom' => '0', 'left' => '16', 'isLinked' => false ],
                    ], true ),
                ], [
                    'css_classes'    => 'iramo-hero',
                    'padding'        => [ 'unit' => 'px', 'top' => '112', 'right' => '0', 'bottom' => '64', 'left' => '0', 'isLinked' => false ],
                    'padding_tablet' => [ 'unit' => 'px', 'top' => '88', 'right' => '0', 'bottom' => '40', 'left' => '0', 'isLinked' => false ],
                    'padding_mobile' => [ 'unit' => 'px', 'top' => '88', 'right' => '0', 'bottom' => '40', 'left' => '0', 'isLinked' => false ],
                ] ),

                // Section 2: Products Showcase (Header Row + Button + Products Grid)
                iramo_el_container( 'irps200', [
                    iramo_el_container( 'irps210', [
                        iramo_el_container( 'irps211', [
                            iramo_el_container( 'irps212', [
                                iramo_el_widget( 'irpw201', 'iramo_badge', [ 'text' => 'محصولات نرم‌افزاری اختصاصی', '_css_classes' => 'iramo-el-tight' ] ),
                                iramo_el_widget( 'irpw202', 'heading', [ 'title' => 'محصولات آماده برای رشد سریع کسب‌وکار', 'header_size' => 'h2', '_css_classes' => 'iramo-el-sec-title iramo-el-tight' ] ),
                                iramo_el_widget( 'irpw203', 'text-editor', [ 'editor' => '<p>تمامی محصولات منتشرشده در ووکامرس یا بخش محصولات با طراحی یکپارچه اینجا نمایش داده می‌شوند.</p>', '_css_classes' => 'iramo-el-desc iramo-el-tight' ] ),
                            ], [ 'css_classes' => 'iramo-el-col-stack' ], true ),
                            iramo_el_widget( 'irpw204', 'iramo_button_group', [
                                'buttons' => [
                                    [ 'label' => 'مشاهده همه محصولات ←', 'url' => [ 'url' => '/products/' ], 'variant' => 'outline' ],
                                ],
                                '_css_classes' => 'iramo-el-tight',
                            ] ),
                        ], [ 'css_classes' => 'iramo-sec-head' ], true ),
                        iramo_el_widget( 'irpw205', 'iramo_products_grid', [
                            'show_header' => 'no',
                            'posts_count' => 4,
                            'columns'     => '2',
                        ] ),
                    ], [
                        'css_classes'    => 'iramo-container',
                        'padding'        => [ 'unit' => 'px', 'top' => '0', 'right' => '24', 'bottom' => '0', 'left' => '24', 'isLinked' => false ],
                        'padding_mobile' => [ 'unit' => 'px', 'top' => '0', 'right' => '16', 'bottom' => '0', 'left' => '16', 'isLinked' => false ],
                    ], true ),
                ], [
                    'css_classes'    => 'iramo-section',
                    'padding'        => [ 'unit' => 'px', 'top' => '64', 'right' => '0', 'bottom' => '64', 'left' => '0', 'isLinked' => false ],
                    'padding_mobile' => [ 'unit' => 'px', 'top' => '44', 'right' => '0', 'bottom' => '44', 'left' => '0', 'isLinked' => false ],
                ] ),

                // Section 3: AI Discovery Box (Badge + Heading + Text + Search & Quick Chips)
                iramo_el_container( 'irds300', [
                    iramo_el_container( 'irds310', [
                        iramo_el_container( 'irds311', [
                            iramo_el_widget( 'irdw301', 'iramo_badge', [ 'text' => 'موتور جستجوی ابزارهای AI', '_css_classes' => 'iramo-el-tight' ] ),
                            iramo_el_widget( 'irdw302', 'heading', [ 'title' => 'دایرکتوری تخصصی و بررسی ابزارهای هوش مصنوعی', 'header_size' => 'h2', '_css_classes' => 'iramo-el-sec-title iramo-el-tight' ] ),
                            iramo_el_widget( 'irdw303', 'text-editor', [ 'editor' => '<p>ابزار مناسب خود را بر اساس نیاز، مدل قیمت‌گذاری، ورودی/خروجی و نمونه پرامپت پیدا کنید.</p>', '_css_classes' => 'iramo-el-desc iramo-el-tight' ] ),
                            iramo_el_widget( 'irdw304', 'iramo_ai_discovery_search', [
                                'show_header'  => 'no',
                                'show_chips'   => 'yes',
                                '_css_classes' => 'iramo-el-tight',
                            ] ),
                        ], [
                            'css_classes'    => 'iramo-discovery-box iramo-el-col-stack',
                            'padding'        => [ 'unit' => 'px', 'top' => '36', 'right' => '36', 'bottom' => '36', 'left' => '36', 'isLinked' => true ],
                            'padding_mobile' => [ 'unit' => 'px', 'top' => '24', 'right' => '18', 'bottom' => '24', 'left' => '18', 'isLinked' => false ],
                        ], true ),
                    ], [
                        'css_classes'    => 'iramo-container',
                        'padding'        => [ 'unit' => 'px', 'top' => '0', 'right' => '24', 'bottom' => '0', 'left' => '24', 'isLinked' => false ],
                        'padding_mobile' => [ 'unit' => 'px', 'top' => '0', 'right' => '16', 'bottom' => '0', 'left' => '16', 'isLinked' => false ],
                    ], true ),
                ], [
                    'css_classes'    => 'iramo-section',
                    'padding'        => [ 'unit' => 'px', 'top' => '12', 'right' => '0', 'bottom' => '64', 'left' => '0', 'isLinked' => false ],
                    'padding_mobile' => [ 'unit' => 'px', 'top' => '12', 'right' => '0', 'bottom' => '44', 'left' => '0', 'isLinked' => false ],
                ] ),

                // Section 4: Dual Bento Cards (2 Independent Cards, Each with Badge + Heading + Text + Buttons)
                iramo_el_container( 'irbs400', [
                    iramo_el_container( 'irbs410', [
                        iramo_el_container( 'irbs420', [
                            // Card 1: Academy
                            iramo_el_container( 'irbs421', [
                                iramo_el_container( 'irbs421t', [
                                    iramo_el_widget( 'irbw401', 'iramo_badge', [ 'text' => 'آکادمی تخصصی iRamoAi', 'sub_label' => 'پروژه‌محور + لایسنس', '_css_classes' => 'iramo-el-tight' ] ),
                                    iramo_el_widget( 'irbw402', 'heading', [ 'title' => 'دوره‌های کاربردی هوش مصنوعی و ساخت ربات', 'header_size' => 'h3', '_css_classes' => 'iramo-el-card-title iramo-el-tight' ] ),
                                    iramo_el_widget( 'irbw403', 'text-editor', [ 'editor' => '<p>یادگیری عملی ساخت ربات‌های تلگرام و بله، پرامپت‌نویسی مهندسی‌شده، اتوماسیون n8n و استفاده حرفه‌ای از ابزارهای AI همراه با پنل دانشجویی اختصاصی.</p>', '_css_classes' => 'iramo-el-desc iramo-el-tight' ] ),
                                ], [ 'css_classes' => 'iramo-el-col-stack' ], true ),
                                iramo_el_widget( 'irbw404', 'iramo_button_group', [
                                    'buttons' => [
                                        [ 'label' => 'مشاهده دوره‌های آکادمی ←', 'url' => [ 'url' => '/academy/' ], 'variant' => 'primary' ],
                                        [ 'label' => 'ورود به پنل دانشجو', 'url' => [ 'url' => '/panel/' ], 'variant' => 'outline' ],
                                    ],
                                    '_css_classes' => 'iramo-el-tight',
                                ] ),
                            ], [
                                'css_classes' => 'iramo-card iramo-bento-card',
                                'padding'     => [ 'unit' => 'px', 'top' => '24', 'right' => '24', 'bottom' => '24', 'left' => '24', 'isLinked' => true ],
                            ], true ),

                            // Card 2: Consulting & Bots
                            iramo_el_container( 'irbs422', [
                                iramo_el_container( 'irbs422t', [
                                    iramo_el_widget( 'irbw405', 'iramo_badge', [ 'text' => 'خدمات مهندسی و مشاوره', 'sub_label' => 'پروژه اختصاصی سازمانی', '_css_classes' => 'iramo-el-tight' ] ),
                                    iramo_el_widget( 'irbw406', 'heading', [ 'title' => 'طراحی ربات، اتوماسیون و پیاده‌سازی AI برای سازمان شما', 'header_size' => 'h3', '_css_classes' => 'iramo-el-card-title iramo-el-tight' ] ),
                                    iramo_el_widget( 'irbw407', 'text-editor', [ 'editor' => '<p>اگر برای اتصال CRM، ووکامرس، صدور خودکار فاکتور یا راه‌اندازی دستیار اختصاصی AI در تلگرام و بله به تیم فنی نیاز دارید، با مهندسان ما مشورت کنید.</p>', '_css_classes' => 'iramo-el-desc iramo-el-tight' ] ),
                                ], [ 'css_classes' => 'iramo-el-col-stack' ], true ),
                                iramo_el_widget( 'irbw408', 'iramo_button_group', [
                                    'buttons' => [
                                        [ 'label' => 'ثبت درخواست مشاوره تخصصی ←', 'url' => [ 'url' => '/services/' ], 'variant' => 'accent' ],
                                    ],
                                    '_css_classes' => 'iramo-el-tight',
                                ] ),
                            ], [
                                'css_classes' => 'iramo-card iramo-bento-card',
                                'padding'     => [ 'unit' => 'px', 'top' => '24', 'right' => '24', 'bottom' => '24', 'left' => '24', 'isLinked' => true ],
                            ], true ),
                        ], [ 'css_classes' => 'iramo-grid-2' ], true ),
                    ], [
                        'css_classes'    => 'iramo-container',
                        'padding'        => [ 'unit' => 'px', 'top' => '0', 'right' => '24', 'bottom' => '0', 'left' => '24', 'isLinked' => false ],
                        'padding_mobile' => [ 'unit' => 'px', 'top' => '0', 'right' => '16', 'bottom' => '0', 'left' => '16', 'isLinked' => false ],
                    ], true ),
                ], [
                    'css_classes'    => 'iramo-section',
                    'padding'        => [ 'unit' => 'px', 'top' => '12', 'right' => '0', 'bottom' => '64', 'left' => '0', 'isLinked' => false ],
                    'padding_mobile' => [ 'unit' => 'px', 'top' => '12', 'right' => '0', 'bottom' => '44', 'left' => '0', 'isLinked' => false ],
                ] ),
            ];
            iramo_save_elementor_payload( $home_id, $home_elements, 'wp-page' );
        }
    }

    // 2. Page: Services (/services/ — Granular Hero + Services Cards & Consultation Form)
    if ( ! empty( $page_ids['services'] ) ) {
        $srv_id = (int) $page_ids['services'];
        if ( iramo_should_upgrade_seed( $srv_id, $force ) ) {
            $srv_elements = [
                iramo_el_container( 'irsrv100', [
                    iramo_el_container( 'irsrv110', [
                        iramo_el_container( 'irsrv111', [
                            iramo_el_widget( 'irsrvw1', 'iramo_badge', [ 'text' => 'خدمات مهندسی و اتوماسیون اختصاصی', '_css_classes' => 'iramo-el-tight' ] ),
                            iramo_el_widget( 'irsrvw2', 'heading', [ 'title' => 'طراحی ربات هوشمند، ایجنت AI و اتوماسیون سازمانی', 'header_size' => 'h1', '_css_classes' => 'iramo-el-hero-title iramo-el-tight' ] ),
                            iramo_el_widget( 'irsrvw3', 'text-editor', [ 'editor' => '<p>اتصال مستقیم وردپرس و ووکامرس به تلگرام، بله و مدل‌های پیشرفته هوش مصنوعی اختصاصی کسب‌وکار شما.</p>', '_css_classes' => 'iramo-el-subtitle iramo-el-tight' ] ),
                            iramo_el_widget( 'irsrvw4', 'iramo_button_group', [
                                'buttons' => [
                                    [ 'label' => 'ثبت درخواست مشاوره ↓', 'url' => [ 'url' => '#iramo-consult-box' ], 'variant' => 'accent' ],
                                    [ 'label' => 'مشاهده محصولات آماده', 'url' => [ 'url' => '/products/' ], 'variant' => 'outline' ],
                                ],
                                '_css_classes' => 'iramo-el-tight',
                            ] ),
                        ], [ 'css_classes' => 'iramo-el-col-stack' ], true ),
                        iramo_el_container( 'irsrv112', [
                            iramo_el_widget( 'irsrvw5', 'iramo_hero_media_box', [
                                'show_float_chip' => 'no',
                                'image_alt'       => 'خدمات مهندسی هوش مصنوعی iRamoAi',
                                '_css_classes'    => 'iramo-el-tight',
                            ] ),
                        ], [ 'css_classes' => 'iramo-el-col-stack' ], true ),
                    ], [
                        'css_classes'    => 'iramo-container iramo-hero-grid',
                        'padding'        => [ 'unit' => 'px', 'top' => '0', 'right' => '24', 'bottom' => '0', 'left' => '24', 'isLinked' => false ],
                        'padding_mobile' => [ 'unit' => 'px', 'top' => '0', 'right' => '16', 'bottom' => '0', 'left' => '16', 'isLinked' => false ],
                    ], true ),
                ], [
                    'css_classes'    => 'iramo-hero',
                    'padding'        => [ 'unit' => 'px', 'top' => '112', 'right' => '0', 'bottom' => '64', 'left' => '0', 'isLinked' => false ],
                    'padding_mobile' => [ 'unit' => 'px', 'top' => '88', 'right' => '0', 'bottom' => '40', 'left' => '0', 'isLinked' => false ],
                ] ),
                iramo_el_container( 'irsrv200', [
                    iramo_el_widget( 'irsrvw6', 'iramo_consultation_form' ),
                ], [
                    'css_id'  => 'iramo-consult-box',
                    'padding' => [ 'unit' => 'px', 'top' => '36', 'right' => '0', 'bottom' => '56', 'left' => '0', 'isLinked' => false ],
                ] ),
            ];
            iramo_save_elementor_payload( $srv_id, $srv_elements, 'wp-page' );
        }
    }

    // 3. Page: Student Panel (/panel/)
    if ( ! empty( $page_ids['panel'] ) ) {
        $panel_id = (int) $page_ids['panel'];
        if ( iramo_should_upgrade_seed( $panel_id, $force ) ) {
            $panel_elements = [
                iramo_el_container( 'irpnl100', [
                    iramo_el_widget( 'irpnlw1', 'iramo_lms_dashboard', [ 'default_view' => 'panel', 'default_theme' => 'light' ] ),
                ] ),
            ];
            iramo_save_elementor_payload( $panel_id, $panel_elements, 'wp-page' );
        }
    }

    // 4. Atomic Header Template (3 Separate Clickable Widgets: Logo + Nav Menu + Actions inside Floating Pill)
    iramo_upsert_elementor_library(
        'iramo-tpl-header',
        'هدر اصلی iRamoAi (قابل ویرایش جزئی در المنتور)',
        'header',
        [
            iramo_el_container( 'irhdr100', [
                iramo_el_container( 'irhdr110', [
                    iramo_el_widget( 'irhdrw1', 'iramo_logo', [ 'brand_name' => 'iRamoAi', '_css_classes' => 'iramo-el-tight' ] ),
                    iramo_el_widget( 'irhdrw2', 'iramo_nav_menu', [ '_css_classes' => 'iramo-el-tight' ] ),
                    iramo_el_widget( 'irhdrw3', 'iramo_header_actions', [ '_css_classes' => 'iramo-el-tight' ] ),
                ], [ 'css_classes' => 'iramo-header-pill' ], true ),
            ], [
                'css_classes'    => 'iramo-header-wrap',
                'padding'        => [ 'unit' => 'px', 'top' => '14', 'right' => '24', 'bottom' => '0', 'left' => '24', 'isLinked' => false ],
                'padding_mobile' => [ 'unit' => 'px', 'top' => '10', 'right' => '12', 'bottom' => '0', 'left' => '12', 'isLinked' => false ],
            ] ),
        ],
        [ 'include/general' ],
        $force
    );

    // 5. Atomic Footer Template (Brand + Socials, 2 Nav Columns, Newsletter Box, Bottom Bar)
    iramo_upsert_elementor_library(
        'iramo-tpl-footer',
        'فوتر اصلی iRamoAi (قابل ویرایش جزئی در المنتور)',
        'footer',
        [
            iramo_el_container( 'irftr100', [
                iramo_el_container( 'irftr110', [
                    iramo_el_container( 'irftr120', [
                        // Col 1: Brand Logo + About Text + Social Links
                        iramo_el_container( 'irftr121', [
                            iramo_el_widget( 'irftrw1', 'iramo_logo', [ 'brand_name' => 'iRamoAi', '_css_classes' => 'iramo-el-tight' ] ),
                            iramo_el_widget( 'irftrw2', 'text-editor', [
                                'editor'       => '<p>پلتفرم تخصصی طراحی نرم‌افزارهای هوشمند، آکادمی آموزش کاربردی AI و مرجع معرفی برترین ابزارهای هوش مصنوعی جهان.</p>',
                                '_css_classes' => 'iramo-el-footer-about iramo-el-tight',
                            ] ),
                            iramo_el_widget( 'irftrw3', 'iramo_social_links', [ '_css_classes' => 'iramo-el-tight' ] ),
                        ], [ 'css_classes' => 'iramo-el-col-stack' ], true ),

                        // Col 2: Two Nav Columns Side-by-Side (also 2-col on mobile!)
                        iramo_el_container( 'irftr122', [
                            iramo_el_widget( 'irftrw4', 'iramo_footer_links_col', [
                                'title' => 'بخش‌های سایت',
                                'links' => [
                                    [ 'text' => 'صفحه اصلی', 'url' => [ 'url' => '/' ] ],
                                    [ 'text' => 'محصولات نرم‌افزاری', 'url' => [ 'url' => '/products/' ] ],
                                    [ 'text' => 'دایرکتوری ابزارهای AI', 'url' => [ 'url' => '/ai-tools/' ] ],
                                    [ 'text' => 'آکادمی و دوره‌ها', 'url' => [ 'url' => '/academy/' ] ],
                                ],
                                '_css_classes' => 'iramo-el-tight',
                            ] ),
                            iramo_el_widget( 'irftrw5', 'iramo_footer_links_col', [
                                'title' => 'امکانات و پلتفرم',
                                'links' => [
                                    [ 'text' => 'مقالات و ابزارک‌ها', 'url' => [ 'url' => '/articles/' ] ],
                                    [ 'text' => 'خدمات و مشاوره', 'url' => [ 'url' => '/services/' ] ],
                                    [ 'text' => 'پنل کاربری و آموزش', 'url' => [ 'url' => '/panel/' ] ],
                                    [ 'text' => 'ابزارهای رایگان AI', 'url' => [ 'url' => '/ai-tools/?pricing=Free' ] ],
                                ],
                                '_css_classes' => 'iramo-el-tight',
                            ] ),
                        ], [ 'css_classes' => 'iramo-footer-nav-grid' ], true ),

                        // Col 3: Newsletter Heading + Description + Bot Form
                        iramo_el_container( 'irftr123', [
                            iramo_el_widget( 'irftrw6', 'heading', [ 'title' => 'خبرنامه هوشمند تلگرام و بله', 'header_size' => 'h4', '_css_classes' => 'iramo-el-footer-title iramo-el-tight' ] ),
                            iramo_el_widget( 'irftrw7', 'text-editor', [
                                'editor'       => '<p>آیدی تلگرام یا شماره موبایل بله خود را وارد کنید تا معرفی ابزارهای جدید AI برایتان ارسال شود.</p>',
                                '_css_classes' => 'iramo-el-desc iramo-el-tight',
                            ] ),
                            iramo_el_widget( 'irftrw8', 'iramo_newsletter_form', [ '_css_classes' => 'iramo-el-tight' ] ),
                        ], [ 'css_classes' => 'iramo-el-col-stack' ], true ),
                    ], [ 'css_classes' => 'iramo-footer-grid' ], true ),

                    // Footer Bottom Bar
                    iramo_el_container( 'irftr130', [
                        iramo_el_widget( 'irftrw9', 'text-editor', [ 'editor' => '<p>© تمامی حقوق برای پلتفرم هوشمند iRamoAi محفوظ است.</p>', '_css_classes' => 'iramo-el-tight' ] ),
                        iramo_el_widget( 'irftrw10', 'iramo_theme_toggle_chip', [ '_css_classes' => 'iramo-el-tight' ] ),
                    ], [ 'css_classes' => 'iramo-footer-bottom' ], true ),
                ], [
                    'css_classes'    => 'iramo-container',
                    'padding'        => [ 'unit' => 'px', 'top' => '0', 'right' => '24', 'bottom' => '0', 'left' => '24', 'isLinked' => false ],
                    'padding_mobile' => [ 'unit' => 'px', 'top' => '0', 'right' => '16', 'bottom' => '0', 'left' => '16', 'isLinked' => false ],
                ], true ),
            ], [
                'css_classes' => 'iramo-footer',
                'padding'     => [ 'unit' => 'px', 'top' => '44', 'right' => '0', 'bottom' => '28', 'left' => '0', 'isLinked' => false ],
                'margin'      => [ 'unit' => 'px', 'top' => '40', 'right' => '0', 'bottom' => '0', 'left' => '0', 'isLinked' => false ],
            ] ),
        ],
        [ 'include/general' ],
        $force
    );

    // 6. Archive: AI Tools Directory
    iramo_upsert_elementor_library(
        'iramo-tpl-archive-tools',
        'آرشیو دایرکتوری ابزارهای هوش مصنوعی (المنتور)',
        'archive',
        [
            iramo_el_container( 'irat100', [
                iramo_el_widget( 'iratw1', 'iramo_ai_tools_grid', [ 'posts_count' => 30, 'show_filters' => 'yes', 'show_chips' => 'yes' ] ),
            ], [ 'padding' => [ 'unit' => 'px', 'top' => '24', 'right' => '0', 'bottom' => '48', 'left' => '0', 'isLinked' => false ] ] ),
        ],
        [ 'include/archive/iramo_ai_tool_archive' ],
        $force
    );

    // 7. Single AI Tool Template (Atomic Header + Specs + Main/Sidebar Split with Full Widget Controls)
    iramo_upsert_elementor_library(
        'iramo-tpl-single-tool',
        'صفحه تکی ابزار هوش مصنوعی (المنتور + Dynamic Tags)',
        'single-post',
        [
            iramo_el_container( 'irst100', [
                iramo_el_widget( 'irstw1', 'iramo_ai_tool_header', [ '_css_classes' => 'iramo-el-tight' ] ),
                iramo_el_widget( 'irstw2', 'iramo_ai_tool_specs', [ '_css_classes' => 'iramo-el-tight' ] ),
                iramo_el_container( 'irst110', [
                    iramo_el_container( 'irst111', [
                        iramo_el_widget( 'irstw3', 'iramo_ai_tool_features', [ '_css_classes' => 'iramo-el-tight' ] ),
                        iramo_el_widget( 'irstw4', 'iramo_ai_tool_workflow', [ '_css_classes' => 'iramo-el-tight' ] ),
                    ], [ 'css_classes' => 'iramo-el-col-stack', 'flex_gap' => [ 'size' => 18, 'unit' => 'px' ] ], true ),
                    iramo_el_container( 'irst112', [
                        iramo_el_widget( 'irstw5', 'iramo_related_tools', [ '_css_classes' => 'iramo-el-tight' ] ),
                    ], [ 'css_classes' => 'iramo-el-col-stack' ], true ),
                ], [ 'css_classes' => 'iramo-detail-grid' ], true ),
            ], [
                'css_classes'    => 'iramo-container iramo-el-col-stack',
                'flex_gap'       => [ 'size' => 20, 'unit' => 'px' ],
                'padding'        => [ 'unit' => 'px', 'top' => '24', 'right' => '24', 'bottom' => '48', 'left' => '24', 'isLinked' => false ],
                'padding_mobile' => [ 'unit' => 'px', 'top' => '20', 'right' => '16', 'bottom' => '40', 'left' => '16', 'isLinked' => false ],
            ] ),
        ],
        [ 'include/singular/iramo_ai_tool' ],
        $force
    );

    // 8. Archive: Products (Atomic Badge + Heading + Text + Grid)
    iramo_upsert_elementor_library(
        'iramo-tpl-archive-products',
        'آرشیو محصولات نرم‌افزاری (المنتور)',
        'archive',
        [
            iramo_el_container( 'irap100', [
                iramo_el_container( 'irap110', [
                    iramo_el_container( 'irap111', [
                        iramo_el_widget( 'irapw1', 'iramo_badge', [ 'text' => 'محصولات نرم‌افزاری و اتوماسیون', '_css_classes' => 'iramo-el-tight' ] ),
                        iramo_el_widget( 'irapw2', 'heading', [ 'title' => 'محصولات نرم‌افزاری اختصاصی iRamoAi', 'header_size' => 'h1', '_css_classes' => 'iramo-el-sec-title iramo-el-tight' ] ),
                        iramo_el_widget( 'irapw3', 'text-editor', [ 'editor' => '<p>نرم‌افزارهای آماده کسب‌وکار با اتصال بومی به ووکامرس، صدور خودکار لایسنس و لندینگ ۶ بخشی اختصاصی.</p>', '_css_classes' => 'iramo-el-desc iramo-el-tight' ] ),
                    ], [ 'css_classes' => 'iramo-card iramo-el-col-stack', 'padding' => [ 'unit' => 'px', 'top' => '24', 'right' => '24', 'bottom' => '24', 'left' => '24', 'isLinked' => true ], 'margin' => [ 'unit' => 'px', 'top' => '0', 'right' => '0', 'bottom' => '24', 'left' => '0', 'isLinked' => false ] ], true ),
                    iramo_el_widget( 'irapw4', 'iramo_products_grid', [ 'show_header' => 'no', 'posts_count' => 24, 'columns' => '2' ] ),
                ], [
                    'css_classes'    => 'iramo-container iramo-el-col-stack',
                    'padding'        => [ 'unit' => 'px', 'top' => '0', 'right' => '24', 'bottom' => '0', 'left' => '24', 'isLinked' => false ],
                    'padding_mobile' => [ 'unit' => 'px', 'top' => '0', 'right' => '16', 'bottom' => '0', 'left' => '16', 'isLinked' => false ],
                ], true ),
            ], [ 'padding' => [ 'unit' => 'px', 'top' => '24', 'right' => '0', 'bottom' => '48', 'left' => '0', 'isLinked' => false ] ] ),
        ],
        [ 'include/archive/iramo_product_archive' ],
        $force
    );

    // 9. Single Product 6-Section Landing
    iramo_upsert_elementor_library(
        'iramo-tpl-single-product',
        'لندینگ ۶ بخشی تکی محصول (المنتور)',
        'single-post',
        [
            iramo_el_container( 'irsp100', [
                iramo_el_widget( 'irspw1', 'iramo_product_landing' ),
            ], [ 'padding' => [ 'unit' => 'px', 'top' => '24', 'right' => '0', 'bottom' => '48', 'left' => '0', 'isLinked' => false ] ] ),
        ],
        [ 'include/singular/iramo_product', 'include/singular/product' ],
        $force
    );

    // 10. Archive: Courses
    iramo_upsert_elementor_library(
        'iramo-tpl-archive-courses',
        'آرشیو دوره‌های آکادمی (المنتور)',
        'archive',
        [
            iramo_el_container( 'irac100', [
                iramo_el_widget( 'iracw1', 'iramo_courses_grid', [ 'posts_count' => 12 ] ),
            ], [ 'padding' => [ 'unit' => 'px', 'top' => '24', 'right' => '0', 'bottom' => '48', 'left' => '0', 'isLinked' => false ] ] ),
        ],
        [ 'include/archive/iramo_course_archive' ],
        $force
    );

    // 11. Archive: Articles
    iramo_upsert_elementor_library(
        'iramo-tpl-archive-articles',
        'آرشیو مقالات و ابزارک‌ها (المنتور)',
        'archive',
        [
            iramo_el_container( 'iraa100', [
                iramo_el_widget( 'iraaw1', 'iramo_articles_grid', [ 'posts_count' => 12 ] ),
            ], [ 'padding' => [ 'unit' => 'px', 'top' => '24', 'right' => '0', 'bottom' => '48', 'left' => '0', 'isLinked' => false ] ] ),
        ],
        [ 'include/archive/iramo_article_archive' ],
        $force
    );

    // 12. Error 404 (Atomic Badge + Heading + Text + Action Buttons)
    iramo_upsert_elementor_library(
        'iramo-tpl-404',
        'صفحه خطای ۴۰۴ iRamoAi (المنتور)',
        'error-404',
        [
            iramo_el_container( 'ir40410', [
                iramo_el_container( 'ir40420', [
                    iramo_el_widget( 'ir404w1', 'iramo_badge', [ 'text' => 'خطای ۴۰۴', '_css_classes' => 'iramo-el-tight' ] ),
                    iramo_el_widget( 'ir404w2', 'heading', [ 'title' => 'صفحه مورد نظر پیدا نشد', 'header_size' => 'h1', 'align' => 'center', '_css_classes' => 'iramo-el-sec-title iramo-el-tight' ] ),
                    iramo_el_widget( 'ir404w3', 'text-editor', [ 'editor' => '<p style="text-align:center;">ممکن است آدرس تغییر کرده باشد یا این صفحه حذف شده باشد. از دکمه‌های زیر می‌توانید مستقیماً به بخش‌های اصلی سایت برگردید.</p>', '_css_classes' => 'iramo-el-desc iramo-el-tight' ] ),
                    iramo_el_widget( 'ir404w4', 'iramo_button_group', [
                        'buttons' => [
                            [ 'label' => 'بازگشت به صفحه اصلی', 'url' => [ 'url' => '/' ], 'variant' => 'accent' ],
                            [ 'label' => 'مشاهده محصولات', 'url' => [ 'url' => '/products/' ], 'variant' => 'outline' ],
                            [ 'label' => 'دایرکتوری ابزارهای AI', 'url' => [ 'url' => '/ai-tools/' ], 'variant' => 'outline' ],
                        ],
                        '_css_classes' => 'iramo-el-tight',
                    ] ),
                ], [
                    'css_classes' => 'iramo-card iramo-el-col-stack',
                    'flex_align_items' => 'center',
                    'flex_gap' => [ 'size' => 14, 'unit' => 'px' ],
                    'padding' => [ 'unit' => 'px', 'top' => '36', 'right' => '24', 'bottom' => '36', 'left' => '24', 'isLinked' => false ],
                ], true ),
            ], [ 'css_classes' => 'iramo-container', 'padding' => [ 'unit' => 'px', 'top' => '48', 'right' => '24', 'bottom' => '64', 'left' => '24', 'isLinked' => false ] ] ),
        ],
        [ 'include/singular/not_found404' ],
        $force
    );

    update_option( 'iramo_elementor_seeded', '2.4.0' );
}

/**
 * Add direct "ویرایش قالب این بخش در المنتور" + "ویرایش هدر/فوتر" links in WP Admin Bar
 */
add_action( 'admin_bar_menu', function( $wp_admin_bar ) {
    if ( ! current_user_can( 'edit_posts' ) || is_admin() ) {
        return;
    }
    $slug = '';
    if ( is_post_type_archive( 'iramo_ai_tool' ) ) $slug = 'iramo-tpl-archive-tools';
    elseif ( is_singular( 'iramo_ai_tool' ) ) $slug = 'iramo-tpl-single-tool';
    elseif ( is_post_type_archive( 'iramo_product' ) ) $slug = 'iramo-tpl-archive-products';
    elseif ( is_singular( [ 'iramo_product', 'product' ] ) ) $slug = 'iramo-tpl-single-product';
    elseif ( is_post_type_archive( 'iramo_course' ) ) $slug = 'iramo-tpl-archive-courses';
    elseif ( is_post_type_archive( 'iramo_article' ) ) $slug = 'iramo-tpl-archive-articles';
    elseif ( is_404() ) $slug = 'iramo-tpl-404';

    $lookup = function( $s ) {
        $f = get_posts( [
            'post_type'      => 'elementor_library',
            'post_status'    => 'publish',
            'meta_key'       => '_iramo_library_slug',
            'meta_value'     => $s,
            'posts_per_page' => 1,
            'fields'         => 'ids',
        ] );
        return ! empty( $f ) ? (int) $f[0] : 0;
    };

    if ( $slug ) {
        $tid = $lookup( $slug );
        if ( $tid ) {
            $wp_admin_bar->add_node( [
                'id'    => 'iramo-edit-elementor-template',
                'title' => '✨ ویرایش قالب این بخش در المنتور',
                'href'  => admin_url( 'post.php?post=' . $tid . '&action=elementor' ),
            ] );
        }
    }

    if ( $hdr_id = $lookup( 'iramo-tpl-header' ) ) {
        $wp_admin_bar->add_node( [
            'id'    => 'iramo-edit-header-template',
            'title' => 'ویرایش هدر در المنتور',
            'href'  => admin_url( 'post.php?post=' . $hdr_id . '&action=elementor' ),
        ] );
    }
    if ( $ftr_id = $lookup( 'iramo-tpl-footer' ) ) {
        $wp_admin_bar->add_node( [
            'id'    => 'iramo-edit-footer-template',
            'title' => 'ویرایش فوتر در المنتور',
            'href'  => admin_url( 'post.php?post=' . $ftr_id . '&action=elementor' ),
        ] );
    }
}, 90 );
