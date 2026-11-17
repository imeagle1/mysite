<?php
/**
 * Module: Elementor Pre-Built Pages & Theme Builder Library Seeder
 * Populates `_elementor_data` on Pages (Home, Services, Panel) AND creates real editable
 * `elementor_library` templates (Header, Footer, AI Tools Archive/Single, Product Landing,
 * Courses, Articles, 404) so 100% of the site is visually editable in Elementor out of the box.
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

function iramo_el_container( $id, $children, $settings = [] ) {
    $base = array_merge( [
        'content_width' => 'full',
        'padding'       => [ 'unit' => 'px', 'top' => '0', 'right' => '0', 'bottom' => '0', 'left' => '0' ],
    ], $settings );
    return [
        'id'       => $id,
        'elType'   => 'container',
        'settings' => $base,
        'elements' => $children,
    ];
}

function iramo_save_elementor_payload( $post_id, $elements, $tpl_type = 'wp-page', $conditions = [] ) {
    update_post_meta( $post_id, '_elementor_edit_mode', 'builder' );
    update_post_meta( $post_id, '_elementor_template_type', $tpl_type );
    update_post_meta( $post_id, '_elementor_version', '3.24.0' );
    $json = wp_json_encode( $elements, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES );
    update_post_meta( $post_id, '_elementor_data', wp_slash( $json ) );
    if ( ! empty( $conditions ) ) {
        update_post_meta( $post_id, '_elementor_conditions', $conditions );
    }
    delete_post_meta( $post_id, '_elementor_css' );
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
    if ( $tpl_id && ! $force ) {
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
 * Build & Seed All Elementor Pages + Elementor Pro Theme Builder Templates
 */
function iramo_provision_elementor_layouts( $page_ids = [], $force = false ) {
    // 1. Page: Home (صفحه اصلی با ۴ بخش کامل ویجت‌های المنتور)
    if ( ! empty( $page_ids['home'] ) ) {
        $home_id = (int) $page_ids['home'];
        if ( $force || ! get_post_meta( $home_id, '_elementor_data', true ) ) {
            $home_elements = [
                iramo_el_container( 'iramo_home_c1', [ iramo_el_widget( 'iramo_hw_1', 'iramo_hero' ) ] ),
                iramo_el_container( 'iramo_home_c2', [ iramo_el_widget( 'iramo_hw_2', 'iramo_products_grid', [ 'posts_count' => 4, 'columns' => '2' ] ) ] ),
                iramo_el_container( 'iramo_home_c3', [ iramo_el_widget( 'iramo_hw_3', 'iramo_ai_discovery_search' ) ] ),
                iramo_el_container( 'iramo_home_c4', [ iramo_el_widget( 'iramo_hw_4', 'iramo_bento_cta' ) ] ),
            ];
            iramo_save_elementor_payload( $home_id, $home_elements, 'wp-page' );
        }
    }

    // 2. Page: Services (/services/)
    if ( ! empty( $page_ids['services'] ) ) {
        $srv_id = (int) $page_ids['services'];
        if ( $force || ! get_post_meta( $srv_id, '_elementor_data', true ) ) {
            $srv_elements = [
                iramo_el_container( 'iramo_srv_c1', [
                    iramo_el_widget( 'iramo_srv_w1', 'iramo_hero', [
                        'badge'        => 'خدمات مهندسی و اتوماسیون اختصاصی',
                        'title'        => 'طراحی ربات هوشمند، ایجنت AI و اتوماسیون سازمانی',
                        'subtitle'     => 'اتصال مستقیم وردپرس و ووکامرس به تلگرام، بله و مدل‌های پیشرفته هوش مصنوعی اختصاصی کسب‌وکار شما.',
                        'cta_text'     => 'ثبت درخواست مشاوره ↓',
                        'cta_url'      => [ 'url' => '#iramo-consult-box' ],
                        'sec_cta_text' => 'مشاهده محصولات آماده',
                        'sec_cta_url'  => [ 'url' => '/products/' ],
                    ] ),
                ] ),
                iramo_el_container( 'iramo_srv_c2', [
                    iramo_el_widget( 'iramo_srv_w2', 'iramo_consultation_form' ),
                ], [ 'css_id' => 'iramo-consult-box', 'padding' => [ 'unit' => 'px', 'top' => '32', 'right' => '0', 'bottom' => '48', 'left' => '0' ] ] ),
            ];
            iramo_save_elementor_payload( $srv_id, $srv_elements, 'wp-page' );
        }
    }

    // 3. Page: Student Panel (/panel/)
    if ( ! empty( $page_ids['panel'] ) ) {
        $panel_id = (int) $page_ids['panel'];
        if ( $force || ! get_post_meta( $panel_id, '_elementor_data', true ) ) {
            $panel_elements = [
                iramo_el_container( 'iramo_pnl_c1', [
                    iramo_el_widget( 'iramo_pnl_w1', 'iramo_lms_dashboard', [ 'default_view' => 'panel', 'default_theme' => 'light' ] ),
                ] ),
            ];
            iramo_save_elementor_payload( $panel_id, $panel_elements, 'wp-page' );
        }
    }

    // 4. Elementor Pro / Library Theme Builder Templates (Header, Footer, Archives, Singles, 404)
    iramo_upsert_elementor_library(
        'iramo-tpl-header',
        'هدر اصلی iRamoAi (قابل ویرایش در المنتور)',
        'header',
        [ iramo_el_container( 'iramo_hdr_c1', [ iramo_el_widget( 'iramo_hdr_w1', 'iramo_header_nav' ) ] ) ],
        [ 'include/general' ],
        $force
    );

    iramo_upsert_elementor_library(
        'iramo-tpl-footer',
        'فوتر اصلی iRamoAi (قابل ویرایش در المنتور)',
        'footer',
        [ iramo_el_container( 'iramo_ftr_c1', [ iramo_el_widget( 'iramo_ftr_w1', 'iramo_footer_box' ) ] ) ],
        [ 'include/general' ],
        $force
    );

    iramo_upsert_elementor_library(
        'iramo-tpl-archive-tools',
        'آرشیو دایرکتوری ابزارهای هوش مصنوعی (المنتور)',
        'archive',
        [ iramo_el_container( 'iramo_at_c1', [ iramo_el_widget( 'iramo_at_w1', 'iramo_ai_tools_grid', [ 'posts_count' => 30, 'show_filters' => 'yes' ] ) ], [ 'padding' => [ 'unit' => 'px', 'top' => '24', 'right' => '0', 'bottom' => '48', 'left' => '0' ] ] ) ],
        [ 'include/archive/iramo_ai_tool_archive' ],
        $force
    );

    iramo_upsert_elementor_library(
        'iramo-tpl-single-tool',
        'صفحه تکی ابزار هوش مصنوعی (المنتور + Dynamic Tags)',
        'single-post',
        [
            iramo_el_container( 'iramo_st_c1', [
                iramo_el_widget( 'iramo_st_w1', 'iramo_ai_tool_header' ),
                iramo_el_widget( 'iramo_st_w2', 'iramo_ai_tool_specs' ),
                iramo_el_widget( 'iramo_st_w3', 'iramo_ai_tool_features' ),
                iramo_el_widget( 'iramo_st_w4', 'iramo_ai_tool_workflow' ),
            ], [ 'css_classes' => 'iramo-container', 'padding' => [ 'unit' => 'px', 'top' => '24', 'right' => '0', 'bottom' => '48', 'left' => '0' ], 'flex_gap' => [ 'size' => 20, 'unit' => 'px' ] ] ),
        ],
        [ 'include/singular/iramo_ai_tool' ],
        $force
    );

    iramo_upsert_elementor_library(
        'iramo-tpl-archive-products',
        'آرشیو محصولات نرم‌افزاری (المنتور)',
        'archive',
        [ iramo_el_container( 'iramo_ap_c1', [ iramo_el_widget( 'iramo_ap_w1', 'iramo_products_grid', [ 'posts_count' => 12, 'columns' => '2' ] ) ] ) ],
        [ 'include/archive/iramo_product_archive' ],
        $force
    );

    iramo_upsert_elementor_library(
        'iramo-tpl-single-product',
        'لندینگ ۶ بخشی تکی محصول (المنتور)',
        'single-post',
        [ iramo_el_container( 'iramo_sp_c1', [ iramo_el_widget( 'iramo_sp_w1', 'iramo_product_landing' ) ], [ 'padding' => [ 'unit' => 'px', 'top' => '24', 'right' => '0', 'bottom' => '48', 'left' => '0' ] ] ) ],
        [ 'include/singular/iramo_product', 'include/singular/product' ],
        $force
    );

    iramo_upsert_elementor_library(
        'iramo-tpl-archive-courses',
        'آرشیو دوره‌های آکادمی (المنتور)',
        'archive',
        [ iramo_el_container( 'iramo_ac_c1', [ iramo_el_widget( 'iramo_ac_w1', 'iramo_courses_grid', [ 'posts_count' => 12 ] ) ], [ 'padding' => [ 'unit' => 'px', 'top' => '24', 'right' => '0', 'bottom' => '48', 'left' => '0' ] ] ) ],
        [ 'include/archive/iramo_course_archive' ],
        $force
    );

    iramo_upsert_elementor_library(
        'iramo-tpl-archive-articles',
        'آرشیو مقالات و ابزارک‌ها (المنتور)',
        'archive',
        [ iramo_el_container( 'iramo_aa_c1', [ iramo_el_widget( 'iramo_aa_w1', 'iramo_articles_grid', [ 'posts_count' => 12 ] ) ], [ 'padding' => [ 'unit' => 'px', 'top' => '24', 'right' => '0', 'bottom' => '48', 'left' => '0' ] ] ) ],
        [ 'include/archive/iramo_article_archive' ],
        $force
    );

    iramo_upsert_elementor_library(
        'iramo-tpl-404',
        'صفحه خطای ۴۰۴ iRamoAi (المنتور)',
        'error-404',
        [
            iramo_el_container( 'iramo_404_c1', [
                iramo_el_widget( 'iramo_404_w1', 'heading', [ 'title' => 'صفحه مورد نظر پیدا نشد (۴۰۴)', 'align' => 'center' ] ),
                iramo_el_widget( 'iramo_404_w2', 'button', [ 'text' => 'بازگشت به صفحه اصلی', 'link' => [ 'url' => '/' ], 'align' => 'center' ] ),
            ], [ 'padding' => [ 'unit' => 'px', 'top' => '64', 'right' => '24', 'bottom' => '64', 'left' => '24' ] ] ),
        ],
        [ 'include/singular/not_found404' ],
        $force
    );

    update_option( 'iramo_elementor_seeded', '2.3.0' );
}

/**
 * Add direct "ویرایش قالب این صفحه با المنتور" link to WP Admin Bar for Archive/Single templates
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

    if ( ! $slug ) return;

    $found = get_posts( [
        'post_type'      => 'elementor_library',
        'post_status'    => 'publish',
        'meta_key'       => '_iramo_library_slug',
        'meta_value'     => $slug,
        'posts_per_page' => 1,
        'fields'         => 'ids',
    ] );
    if ( ! empty( $found ) ) {
        $wp_admin_bar->add_node( [
            'id'    => 'iramo-edit-elementor-template',
            'title' => '✨ ویرایش قالب این بخش در المنتور',
            'href'  => admin_url( 'post.php?post=' . (int) $found[0] . '&action=elementor' ),
        ] );
    }
}, 90 );
