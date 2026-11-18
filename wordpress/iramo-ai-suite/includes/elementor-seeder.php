<?php
/**
 * Module: Granular Atomic Elementor Pages, Theme Builder Templates & Elementor Pro Loop Builders (v3.0.0)
 * Seeds every Page (Home, Articles, Services), every Loop Item (Product, AI Tool, Course, Article),
 * and every Theme Builder Library Template (Header, Footer, AI Tools Archive/Single, Products Archive/Single,
 * Courses Archive/Single, Posts Archive/Single, 404) using core atomic Elementor widgets + Dynamic Tags.
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

function iramo_is_elementor_pro_active() {
    return defined( 'ELEMENTOR_PRO_VERSION' ) || class_exists( '\ElementorPro\Plugin' );
}

function iramo_el_tag( $id, $name, $settings = [] ) {
    $json = wp_json_encode( empty( $settings ) ? new stdClass() : $settings, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES );
    return sprintf( '[elementor-tag id="%s" name="%s" settings="%s"]', $id, $name, rawurlencode( $json ) );
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

function iramo_get_library_id_by_slug( $slug ) {
    $found = get_posts( [
        'post_type'      => 'elementor_library',
        'post_status'    => [ 'publish', 'draft', 'private' ],
        'meta_key'       => '_iramo_library_slug',
        'meta_value'     => $slug,
        'posts_per_page' => 1,
        'fields'         => 'ids',
    ] );
    return ! empty( $found ) ? (int) $found[0] : 0;
}

function iramo_save_elementor_payload( $post_id, $elements, $tpl_type = 'wp-page', $conditions = [], $extra_meta = [] ) {
    $pro_tag = iramo_is_elementor_pro_active() ? '3.0.0-pro' : '3.0.0-free';
    update_post_meta( $post_id, '_elementor_edit_mode', 'builder' );
    update_post_meta( $post_id, '_elementor_template_type', $tpl_type );
    update_post_meta( $post_id, '_elementor_version', '3.24.0' );
    update_post_meta( $post_id, '_iramo_seed_version', $pro_tag );
    $json = wp_json_encode( $elements, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES );
    update_post_meta( $post_id, '_elementor_data', wp_slash( $json ) );
    if ( ! empty( $conditions ) ) {
        update_post_meta( $post_id, '_elementor_conditions', $conditions );
    }
    foreach ( $extra_meta as $mk => $mv ) {
        update_post_meta( $post_id, $mk, $mv );
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
    $target   = iramo_is_elementor_pro_active() ? '3.0.0-pro' : '3.0.0-free';
    if ( $seed_ver === $target ) {
        return false;
    }
    // Automatically upgrade untouched legacy seeds cleanly to v3.0.0
    if ( in_array( $seed_ver, [ '2.4.0', '2.5.0-free', '2.5.0-pro', '2.6.0-free', '2.6.0-pro', '3.0.0-free' ], true ) ) {
        return true;
    }
    // Upgrade legacy 2.3.0 monolithic scaffolds cleanly without touching custom user layouts
    foreach ( [ 'iramo_hw_1', 'iramo_srv_w1', 'iramo_hdr_w1', 'iramo_ftr_w1', 'iramo_st_w1', 'irpw205' ] as $legacy_marker ) {
        if ( strpos( $raw, $legacy_marker ) !== false ) {
            return true;
        }
    }
    return false;
}

/**
 * Create or update an Elementor Library Template (`elementor_library`)
 */
function iramo_upsert_elementor_library( $slug, $title, $lib_type, $elements, $conditions = [], $force = false, $extra_meta = [] ) {
    $tpl_id = iramo_get_library_id_by_slug( $slug );
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
        iramo_save_elementor_payload( $tpl_id, $elements, $lib_type, $conditions, $extra_meta );
    }
    return (int) $tpl_id;
}

/**
 * Render an auto-seeded Elementor Library Template (works seamlessly in Free & Pro Elementor)
 */
function iramo_render_elementor_template( $slug, $before = '', $after = '' ) {
    if ( ! class_exists( '\Elementor\Plugin' ) ) {
        return false;
    }
    $tpl_id = iramo_get_library_id_by_slug( $slug );
    if ( ! $tpl_id || get_post_status( $tpl_id ) !== 'publish' ) {
        return false;
    }
    $html = \Elementor\Plugin::$instance->frontend->get_builder_content_for_display( $tpl_id, true );
    if ( empty( $html ) ) {
        return false;
    }
    echo $before . $html . $after;
    return true;
}

/**
 * Helper: Build a native Elementor Pro Loop Grid widget (if Pro is active)
 * or fallback to our Loop-Item-backed iRamo Grid widget (in Free Elementor).
 */
function iramo_build_loop_grid_widget( $id, $post_type, $loop_template_id, $columns = '3', $posts_per_page = 12, $fallback_widget = 'iramo_products_grid', $fallback_extra = [] ) {
    if ( iramo_is_elementor_pro_active() && $loop_template_id ) {
        $pro_pt = is_array( $post_type ) ? reset( $post_type ) : $post_type;
        return iramo_el_widget( $id, 'loop-grid', [
            '_skin'               => 'post',
            'template_id'         => (int) $loop_template_id,
            'posts_per_page'      => (int) $posts_per_page,
            'columns'             => (string) $columns,
            'columns_tablet'      => '2',
            'columns_mobile'      => '1',
            'row_gap'             => [ 'size' => 18, 'unit' => 'px' ],
            'column_gap'          => [ 'size' => 18, 'unit' => 'px' ],
            'post_query_post_type'=> $pro_pt,
            'pagination_type'     => '',
            'equal_height'        => 'yes',
        ] );
    }

    return iramo_el_widget( $id, $fallback_widget, array_merge( [
        'show_header'      => 'no',
        'columns'          => (string) $columns,
        'posts_count'      => (int) $posts_per_page,
        'loop_template_id' => $loop_template_id ? (string) $loop_template_id : '',
    ], $fallback_extra ) );
}

/**
 * Sync Elementor Active Kit System Colors & Typography with iRamoAi Brand Palette
 * Prevents Elementor's default cyan (#6EC1E4) from overriding headings.
 */
function iramo_sync_elementor_active_kit( $force = false ) {
    if ( ! $force && get_option( 'iramo_elementor_kit_synced' ) === '3.0.0' ) {
        return;
    }
    $kit_id = (int) get_option( 'elementor_active_kit' );
    if ( ! $kit_id ) {
        return;
    }

    $opts    = get_option( 'iramo_ai_settings', [] );
    $primary = ! empty( $opts['primary_color'] ) ? sanitize_hex_color( $opts['primary_color'] ) : '#059669';
    $accent  = ! empty( $opts['accent_color'] ) ? sanitize_hex_color( $opts['accent_color'] ) : '#FFBA00';
    $font    = ! empty( $opts['font_family'] ) && $opts['font_family'] === 'Vazirmatn' ? 'Vazirmatn' : 'IRANYekanXVF';

    $kit_settings = get_post_meta( $kit_id, '_elementor_page_settings', true );
    if ( ! is_array( $kit_settings ) ) {
        $kit_settings = [];
    }

    $kit_settings['system_colors'] = [
        [ '_id' => 'primary',   'title' => 'Primary (iRamoAi)',   'color' => $primary ?: '#059669' ],
        [ '_id' => 'secondary', 'title' => 'Secondary (Heading)', 'color' => '#0F172A' ],
        [ '_id' => 'text',      'title' => 'Text (Body)',         'color' => '#475569' ],
        [ '_id' => 'accent',    'title' => 'Accent (Button)',     'color' => $accent ?: '#FFBA00' ],
    ];

    $kit_settings['system_typography'] = [
        [ '_id' => 'primary',   'title' => 'Primary',   'typography_typography' => 'custom', 'typography_font_family' => $font, 'typography_font_weight' => '800' ],
        [ '_id' => 'secondary', 'title' => 'Secondary', 'typography_typography' => 'custom', 'typography_font_family' => $font, 'typography_font_weight' => '700' ],
        [ '_id' => 'text',      'title' => 'Text',      'typography_typography' => 'custom', 'typography_font_family' => $font, 'typography_font_weight' => '400' ],
        [ '_id' => 'accent',    'title' => 'Accent',    'typography_typography' => 'custom', 'typography_font_family' => $font, 'typography_font_weight' => '700' ],
    ];

    update_post_meta( $kit_id, '_elementor_page_settings', $kit_settings );
    delete_post_meta( $kit_id, '_elementor_css' );

    if ( class_exists( '\Elementor\Plugin' ) && isset( \Elementor\Plugin::$instance->files_manager ) ) {
        \Elementor\Plugin::$instance->files_manager->clear_cache();
    }

    update_option( 'iramo_elementor_kit_synced', '3.0.0' );
}

/**
 * Build & Seed Loop Item Templates + Granular Atomic Pages + Theme Builder Templates
 */
function iramo_provision_elementor_layouts( $page_ids = [], $force = false ) {
    iramo_sync_elementor_active_kit( $force );
    // =========================================================================
    // A. ELEMENTOR PRO LOOP ITEM TEMPLATES (`elementor_library` / `loop-item`)
    // Built exclusively with standard draggable widgets + iRamoAi Dynamic Tags
    // =========================================================================

    // Loop Item 1: Product Card (Image + Billing Badge + Title + Tagline + Price/Details Button)
    $loop_product_id = iramo_upsert_elementor_library(
        'iramo-loop-product',
        'کارت محصول iRamoAi (Loop Item)',
        'loop-item',
        [
            iramo_el_container( 'irlp100', [
                iramo_el_widget( 'irlpw1', 'image', [
                    '__dynamic__' => [
                        'image' => iramo_el_tag( 'tlpimg1', 'iramo-post-image' ),
                        'link'  => iramo_el_tag( 'tlplnk1', 'iramo-post-url' ),
                    ],
                    'link_to'      => 'custom',
                    'image_size'   => 'large',
                    'width'        => [ 'size' => 100, 'unit' => '%' ],
                    'image_border_radius' => [ 'unit' => 'px', 'top' => '14', 'right' => '14', 'bottom' => '14', 'left' => '14', 'isLinked' => true ],
                    '_css_classes' => 'iramo-el-tight iramo-loop-media-16x9',
                ] ),
                iramo_el_widget( 'irlpw2', 'iramo_badge', [
                    'text'         => '',
                    '__dynamic__'  => [ 'text' => iramo_el_tag( 'tlpbil1', 'iramo-product-billing' ) ],
                    '_css_classes' => 'iramo-el-tight',
                ] ),
                iramo_el_widget( 'irlpw3', 'heading', [
                    'title'        => '',
                    '__dynamic__'  => [
                        'title' => iramo_el_tag( 'tlptit1', 'iramo-post-title' ),
                        'link'  => iramo_el_tag( 'tlplnk2', 'iramo-post-url' ),
                    ],
                    'header_size'  => 'h3',
                    '_css_classes' => 'iramo-el-card-title iramo-el-tight',
                ] ),
                iramo_el_widget( 'irlpw4', 'text-editor', [
                    'editor'       => '',
                    '__dynamic__'  => [ 'editor' => iramo_el_tag( 'tlptag1', 'iramo-item-tagline' ) ],
                    '_css_classes' => 'iramo-el-desc iramo-el-tight',
                ] ),
                iramo_el_widget( 'irlpw5', 'button', [
                    'text'         => '',
                    '__dynamic__'  => [
                        'text' => iramo_el_tag( 'tlpprc1', 'iramo-product-price' ),
                        'link' => iramo_el_tag( 'tlplnk3', 'iramo-post-url' ),
                    ],
                    'background_color' => '#FFBA00',
                    'button_text_color'=> '#061A13',
                    'border_radius'    => [ 'unit' => 'px', 'top' => '12', 'right' => '12', 'bottom' => '12', 'left' => '12', 'isLinked' => true ],
                    '_css_classes'     => 'iramo-el-tight',
                ] ),
            ], [
                'css_classes' => 'iramo-card iramo-el-col-stack',
                'flex_gap'    => [ 'size' => 10, 'unit' => 'px' ],
                'padding'     => [ 'unit' => 'px', 'top' => '20', 'right' => '20', 'bottom' => '20', 'left' => '20', 'isLinked' => true ],
            ] ),
        ],
        [],
        $force,
        [ '_elementor_source' => 'post' ]
    );

    // Loop Item 2: AI Tool Card (Pricing Badge + Title + Provider + Excerpt + Task/Specs + Details & Try Buttons)
    $loop_tool_id = iramo_upsert_elementor_library(
        'iramo-loop-tool',
        'کارت ابزار هوش مصنوعی iRamoAi (Loop Item)',
        'loop-item',
        [
            iramo_el_container( 'irlt100', [
                iramo_el_widget( 'irltw1', 'iramo_badge', [
                    'text'         => '',
                    'sub_label'    => '',
                    '__dynamic__'  => [
                        'text'      => iramo_el_tag( 'tltprc1', 'iramo-tool-pricing' ),
                        'sub_label' => iramo_el_tag( 'tltprv1', 'iramo-tool-provider' ),
                    ],
                    '_css_classes' => 'iramo-el-tight',
                ] ),
                iramo_el_widget( 'irltw2', 'heading', [
                    'title'        => '',
                    '__dynamic__'  => [
                        'title' => iramo_el_tag( 'tlttit1', 'iramo-post-title' ),
                        'link'  => iramo_el_tag( 'tltlnk1', 'iramo-post-url' ),
                    ],
                    'header_size'  => 'h3',
                    '_css_classes' => 'iramo-el-card-title iramo-el-tight',
                ] ),
                iramo_el_widget( 'irltw3', 'text-editor', [
                    'editor'       => '',
                    '__dynamic__'  => [ 'editor' => iramo_el_tag( 'tltexc1', 'iramo-post-excerpt' ) ],
                    '_css_classes' => 'iramo-el-desc iramo-el-tight',
                ] ),
                iramo_el_widget( 'irltw4', 'text-editor', [
                    'editor'       => '',
                    '__dynamic__'  => [ 'editor' => iramo_el_tag( 'tltspc1', 'iramo-tool-specs' ) ],
                    '_css_classes' => 'iramo-meta-pill iramo-el-tight',
                ] ),
                iramo_el_container( 'irlt110', [
                    iramo_el_widget( 'irltw5', 'button', [
                        'text'               => 'بررسی، راهنما و پرامپت ←',
                        '__dynamic__'        => [ 'link' => iramo_el_tag( 'tltlnk2', 'iramo-post-url' ) ],
                        'background_color'   => '#059669',
                        'button_text_color'  => '#FFFFFF',
                        'border_radius'      => [ 'unit' => 'px', 'top' => '10', 'right' => '10', 'bottom' => '10', 'left' => '10', 'isLinked' => true ],
                        '_css_classes'       => 'iramo-el-tight',
                    ] ),
                    iramo_el_widget( 'irltw6', 'button', [
                        'text'               => 'ورود به ابزار ↗',
                        '__dynamic__'        => [ 'link' => iramo_el_tag( 'tlturl1', 'iramo-tool-url' ) ],
                        'background_color'   => 'transparent',
                        'button_text_color'  => '#059669',
                        'border_border'      => 'solid',
                        'border_width'       => [ 'unit' => 'px', 'top' => '1', 'right' => '1', 'bottom' => '1', 'left' => '1', 'isLinked' => true ],
                        'border_color'       => '#059669',
                        'border_radius'      => [ 'unit' => 'px', 'top' => '10', 'right' => '10', 'bottom' => '10', 'left' => '10', 'isLinked' => true ],
                        '_css_classes'       => 'iramo-el-tight',
                    ] ),
                ], [
                    'flex_direction' => 'row',
                    'flex_wrap'      => 'wrap',
                    'flex_gap'       => [ 'size' => 8, 'unit' => 'px' ],
                ], true ),
            ], [
                'css_classes' => 'iramo-card iramo-tool-card iramo-el-col-stack',
                'flex_gap'    => [ 'size' => 10, 'unit' => 'px' ],
                'padding'     => [ 'unit' => 'px', 'top' => '20', 'right' => '20', 'bottom' => '20', 'left' => '20', 'isLinked' => true ],
            ] ),
        ],
        [],
        $force,
        [ '_elementor_source' => 'post' ]
    );

    // Loop Item 3: Course Card (Image + Level/Duration Badge + Title + Excerpt + Course Price CTA Button)
    $loop_course_id = iramo_upsert_elementor_library(
        'iramo-loop-course',
        'کارت دوره آکادمی iRamoAi (Loop Item)',
        'loop-item',
        [
            iramo_el_container( 'irlc100', [
                iramo_el_widget( 'irlcw1', 'image', [
                    '__dynamic__' => [
                        'image' => iramo_el_tag( 'tlcimg1', 'iramo-post-image' ),
                        'link'  => iramo_el_tag( 'tlclnk1', 'iramo-post-url' ),
                    ],
                    'link_to'      => 'custom',
                    'image_size'   => 'large',
                    'width'        => [ 'size' => 100, 'unit' => '%' ],
                    'image_border_radius' => [ 'unit' => 'px', 'top' => '14', 'right' => '14', 'bottom' => '14', 'left' => '14', 'isLinked' => true ],
                    '_css_classes' => 'iramo-el-tight iramo-loop-media-16x9',
                ] ),
                iramo_el_widget( 'irlcw2', 'iramo_badge', [
                    'text'         => '',
                    'sub_label'    => '',
                    '__dynamic__'  => [
                        'text'      => iramo_el_tag( 'tlclvl1', 'iramo-course-level' ),
                        'sub_label' => iramo_el_tag( 'tlcdur1', 'iramo-course-duration' ),
                    ],
                    '_css_classes' => 'iramo-el-tight',
                ] ),
                iramo_el_widget( 'irlcw3', 'heading', [
                    'title'        => '',
                    '__dynamic__'  => [
                        'title' => iramo_el_tag( 'tlctit1', 'iramo-post-title' ),
                        'link'  => iramo_el_tag( 'tlclnk2', 'iramo-post-url' ),
                    ],
                    'header_size'  => 'h3',
                    '_css_classes' => 'iramo-el-card-title iramo-el-tight',
                ] ),
                iramo_el_widget( 'irlcw4', 'text-editor', [
                    'editor'       => '',
                    '__dynamic__'  => [ 'editor' => iramo_el_tag( 'tlcexc1', 'iramo-post-excerpt' ) ],
                    '_css_classes' => 'iramo-el-desc iramo-el-tight',
                ] ),
                iramo_el_widget( 'irlcw5', 'button', [
                    'text'               => '',
                    '__dynamic__'        => [
                        'text' => iramo_el_tag( 'tlcprc1', 'iramo-course-price' ),
                        'link' => iramo_el_tag( 'tlclnk3', 'iramo-post-url' ),
                    ],
                    'background_color'   => '#059669',
                    'button_text_color'  => '#FFFFFF',
                    'border_radius'      => [ 'unit' => 'px', 'top' => '12', 'right' => '12', 'bottom' => '12', 'left' => '12', 'isLinked' => true ],
                    '_css_classes'       => 'iramo-el-tight',
                ] ),
            ], [
                'css_classes' => 'iramo-card iramo-el-col-stack',
                'flex_gap'    => [ 'size' => 10, 'unit' => 'px' ],
                'padding'     => [ 'unit' => 'px', 'top' => '18', 'right' => '18', 'bottom' => '18', 'left' => '18', 'isLinked' => true ],
            ] ),
        ],
        [],
        $force,
        [ '_elementor_source' => 'post' ]
    );

    // Loop Item 4: Article Card (Image + Category/Date Badge + Title + Excerpt + Read Article Button)
    $loop_article_id = iramo_upsert_elementor_library(
        'iramo-loop-article',
        'کارت مقاله iRamoAi (Loop Item)',
        'loop-item',
        [
            iramo_el_container( 'irla100', [
                iramo_el_widget( 'irlaw1', 'image', [
                    '__dynamic__' => [
                        'image' => iramo_el_tag( 'tlaimg1', 'iramo-post-image' ),
                        'link'  => iramo_el_tag( 'tlalnk1', 'iramo-post-url' ),
                    ],
                    'link_to'      => 'custom',
                    'image_size'   => 'large',
                    'width'        => [ 'size' => 100, 'unit' => '%' ],
                    'image_border_radius' => [ 'unit' => 'px', 'top' => '14', 'right' => '14', 'bottom' => '14', 'left' => '14', 'isLinked' => true ],
                    '_css_classes' => 'iramo-el-tight iramo-loop-media-16x9',
                ] ),
                iramo_el_widget( 'irlaw2', 'iramo_badge', [
                    'text'         => '',
                    'sub_label'    => '',
                    '__dynamic__'  => [
                        'text'      => iramo_el_tag( 'tlacat1', 'iramo-post-category' ),
                        'sub_label' => iramo_el_tag( 'tladat1', 'iramo-post-date' ),
                    ],
                    '_css_classes' => 'iramo-el-tight',
                ] ),
                iramo_el_widget( 'irlaw3', 'heading', [
                    'title'        => '',
                    '__dynamic__'  => [
                        'title' => iramo_el_tag( 'tlatit1', 'iramo-post-title' ),
                        'link'  => iramo_el_tag( 'tlalnk2', 'iramo-post-url' ),
                    ],
                    'header_size'  => 'h3',
                    '_css_classes' => 'iramo-el-card-title iramo-el-tight',
                ] ),
                iramo_el_widget( 'irlaw4', 'text-editor', [
                    'editor'       => '',
                    '__dynamic__'  => [ 'editor' => iramo_el_tag( 'tlaexc1', 'iramo-post-excerpt' ) ],
                    '_css_classes' => 'iramo-el-desc iramo-el-tight',
                ] ),
                iramo_el_widget( 'irlaw5', 'button', [
                    'text'               => 'مطالعه کامل مقاله ←',
                    '__dynamic__'        => [ 'link' => iramo_el_tag( 'tlalnk3', 'iramo-post-url' ) ],
                    'background_color'   => 'transparent',
                    'button_text_color'  => '#059669',
                    'border_border'      => 'solid',
                    'border_width'       => [ 'unit' => 'px', 'top' => '1', 'right' => '1', 'bottom' => '1', 'left' => '1', 'isLinked' => true ],
                    'border_color'       => '#059669',
                    'border_radius'      => [ 'unit' => 'px', 'top' => '10', 'right' => '10', 'bottom' => '10', 'left' => '10', 'isLinked' => true ],
                    '_css_classes'       => 'iramo-el-tight',
                ] ),
            ], [
                'css_classes' => 'iramo-card iramo-el-col-stack',
                'flex_gap'    => [ 'size' => 10, 'unit' => 'px' ],
                'padding'     => [ 'unit' => 'px', 'top' => '18', 'right' => '18', 'bottom' => '18', 'left' => '18', 'isLinked' => true ],
            ] ),
        ],
        [],
        $force,
        [ '_elementor_source' => 'post' ]
    );

    // =========================================================================
    // B. PAGES (HOME, ARTICLES, SERVICES)
    // =========================================================================

    // 1. Page: Home (1-to-1 Aligned with React WebsiteHomeView)
    if ( ! empty( $page_ids['home'] ) ) {
        $home_id = (int) $page_ids['home'];
        if ( iramo_should_upgrade_seed( $home_id, $force ) ) {
            $home_elements = [
                // Section 1: Hero
                iramo_el_container( 'irhs100', [
                    iramo_el_container( 'irhs110', [
                        iramo_el_container( 'irhs111', [
                            iramo_el_widget( 'irhw101', 'heading', [
                                'title'        => 'جایی برای خلق آینده هوشمند · iRamoAi',
                                'header_size'  => 'p',
                                '_css_classes' => 'iramo-el-eyebrow iramo-el-tight',
                            ] ),
                            iramo_el_widget( 'irhw102', 'heading', [
                                'title'        => 'محصولات نرم‌افزاری، آموزش حرفه‌ای و راهکارهای هوشمند AI',
                                'header_size'  => 'h1',
                                '_css_classes' => 'iramo-el-hero-title iramo-el-tight',
                            ] ),
                            iramo_el_widget( 'irhw103', 'text-editor', [
                                'editor'       => '<p>از تجربه مهندسی ما در دنیای فناوری بهره ببرید؛ مجموعه نرم‌افزارهای آماده مثل حسابیار و ربات‌های آموزشی، دستیار انتخاب ابزارهای هوش مصنوعی و آکادمی تخصصی iRamo.</p>',
                                '_css_classes' => 'iramo-el-subtitle iramo-el-tight',
                            ] ),
                            iramo_el_widget( 'irhw104', 'iramo_button_group', [
                                'buttons' => [
                                    [ 'label' => 'مشاهده دمو محصولات', 'url' => [ 'url' => '/products/' ], 'variant' => 'accent' ],
                                    [ 'label' => 'درخواست مشاوره و پروژه ←', 'url' => [ 'url' => '/services/' ], 'variant' => 'outline' ],
                                ],
                                '_css_classes' => 'iramo-el-tight',
                            ] ),
                            iramo_el_widget( 'irhw105', 'iramo_proof_list', [
                                'items' => [
                                    [ 'text' => '۵۰,۰۰۰+ دانشجو و کاربر فعال' ],
                                    [ 'text' => '۲۴+ ابزار و ربات هوشمند' ],
                                    [ 'text' => 'اتصال بومی به تلگرام و بله' ],
                                ],
                                '_css_classes' => 'iramo-el-tight',
                            ] ),
                        ], [ 'css_classes' => 'iramo-el-col-stack' ], true ),
                        iramo_el_container( 'irhs112', [
                            iramo_el_widget( 'irhw106', 'iramo_hero_media_box', [
                                'show_float_chip' => 'no',
                                'image_alt'       => 'محیط کاری هوشمند iRamoAi',
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

                // Section 2: Products Showcase (Wired to Loop Grid + Product Loop Item)
                iramo_el_container( 'irps200', [
                    iramo_el_container( 'irps210', [
                        iramo_el_container( 'irps211', [
                            iramo_el_container( 'irps212', [
                                iramo_el_widget( 'irpw202', 'heading', [ 'title' => 'محصولات نرم‌افزاری برتر ما', 'header_size' => 'h2', '_css_classes' => 'iramo-el-sec-title iramo-el-tight' ] ),
                                iramo_el_widget( 'irpw203', 'text-editor', [ 'editor' => '<p>نرم‌افزارها و ربات‌های آماده با طراحی اختصاصی برای کار و کسب‌وکار هوشمندتر</p>', '_css_classes' => 'iramo-el-desc iramo-el-tight' ] ),
                            ], [ 'css_classes' => 'iramo-el-col-stack' ], true ),
                            iramo_el_widget( 'irpw204', 'iramo_button_group', [
                                'buttons' => [
                                    [ 'label' => 'مشاهده همه محصولات ←', 'url' => [ 'url' => '/products/' ], 'variant' => 'outline' ],
                                ],
                                '_css_classes' => 'iramo-el-tight',
                            ] ),
                        ], [ 'css_classes' => 'iramo-sec-head' ], true ),
                        iramo_build_loop_grid_widget( 'irpw205', 'iramo_product', $loop_product_id, '4', 4, 'iramo_products_grid' ),
                    ], [
                        'css_classes'    => 'iramo-container',
                        'padding'        => [ 'unit' => 'px', 'top' => '0', 'right' => '24', 'bottom' => '0', 'left' => '24', 'isLinked' => false ],
                        'padding_mobile' => [ 'unit' => 'px', 'top' => '0', 'right' => '16', 'bottom' => '0', 'left' => '16', 'isLinked' => false ],
                    ], true ),
                ], [
                    'css_classes'    => 'iramo-section',
                    'padding'        => [ 'unit' => 'px', 'top' => '56', 'right' => '0', 'bottom' => '56', 'left' => '0', 'isLinked' => false ],
                    'padding_mobile' => [ 'unit' => 'px', 'top' => '40', 'right' => '0', 'bottom' => '40', 'left' => '0', 'isLinked' => false ],
                ] ),

                // Section 3: AI Discovery Box
                iramo_el_container( 'irds300', [
                    iramo_el_container( 'irds310', [
                        iramo_el_container( 'irds311', [
                            iramo_el_widget( 'irdw301', 'iramo_badge', [ 'text' => 'دستیار و بازار ابزارهای هوش مصنوعی', '_css_classes' => 'iramo-el-tight' ] ),
                            iramo_el_widget( 'irdw302', 'heading', [ 'title' => 'چه کاری می‌خواهید با هوش مصنوعی انجام دهید؟', 'header_size' => 'h2', '_css_classes' => 'iramo-el-sec-title iramo-el-tight' ] ),
                            iramo_el_widget( 'irdw303', 'text-editor', [ 'editor' => '<p>کافی است هدف خود را بنویسید یا نوع ورودی و خروجی را انتخاب کنید؛ موتور پیشنهادگر ابزارهای AI بهترین راهکار را با دستورالعمل گام‌به‌گام معرفی می‌کند.</p>', '_css_classes' => 'iramo-el-desc iramo-el-tight' ] ),
                            iramo_el_widget( 'irdw304', 'iramo_ai_discovery_search', [
                                'show_header'  => 'no',
                                'show_chips'   => 'yes',
                                '_css_classes' => 'iramo-el-tight',
                            ] ),
                        ], [
                            'css_classes'    => 'iramo-discovery-box iramo-el-col-stack',
                            'padding'        => [ 'unit' => 'px', 'top' => '32', 'right' => '32', 'bottom' => '32', 'left' => '32', 'isLinked' => true ],
                            'padding_mobile' => [ 'unit' => 'px', 'top' => '22', 'right' => '18', 'bottom' => '22', 'left' => '18', 'isLinked' => false ],
                        ], true ),
                    ], [
                        'css_classes'    => 'iramo-container',
                        'padding'        => [ 'unit' => 'px', 'top' => '0', 'right' => '24', 'bottom' => '0', 'left' => '24', 'isLinked' => false ],
                        'padding_mobile' => [ 'unit' => 'px', 'top' => '0', 'right' => '16', 'bottom' => '0', 'left' => '16', 'isLinked' => false ],
                    ], true ),
                ], [
                    'css_classes'    => 'iramo-section',
                    'padding'        => [ 'unit' => 'px', 'top' => '12', 'right' => '0', 'bottom' => '56', 'left' => '0', 'isLinked' => false ],
                    'padding_mobile' => [ 'unit' => 'px', 'top' => '12', 'right' => '0', 'bottom' => '40', 'left' => '0', 'isLinked' => false ],
                ] ),

                // Section 4: Dual Bento Cards (Academy + Consulting)
                iramo_el_container( 'irbs400', [
                    iramo_el_container( 'irbs410', [
                        iramo_el_container( 'irbs420', [
                            iramo_el_container( 'irbs421', [
                                iramo_el_container( 'irbs421t', [
                                    iramo_el_widget( 'irbw401', 'iramo_badge', [ 'text' => 'دوره‌های آموزشی و آکادمی', 'sub_label' => '۱۲ ساعت آموزش · ۶ پروژه عملی', '_css_classes' => 'iramo-el-tight' ] ),
                                    iramo_el_widget( 'irbw402', 'heading', [ 'title' => 'دوره جامع هوش مصنوعی از صفر تا پیشرفته', 'header_size' => 'h3', '_css_classes' => 'iramo-el-card-title iramo-el-tight' ] ),
                                    iramo_el_widget( 'irbw403', 'text-editor', [ 'editor' => '<p>از مبانی تا ساخت ایجنت‌های حرفه‌ای، اتصال به وردپرس و اتوماسیون ربات‌های تلگرام و بله.</p>', '_css_classes' => 'iramo-el-desc iramo-el-tight' ] ),
                                ], [ 'css_classes' => 'iramo-el-col-stack' ], true ),
                                iramo_el_widget( 'irbw404', 'iramo_button_group', [
                                    'buttons' => [
                                        [ 'label' => 'مشاهده همه دوره‌ها ←', 'url' => [ 'url' => '/academy/' ], 'variant' => 'primary' ],
                                        [ 'label' => 'مشاوره انتخاب دوره', 'url' => [ 'url' => '/services/' ], 'variant' => 'outline' ],
                                    ],
                                    '_css_classes' => 'iramo-el-tight',
                                ] ),
                            ], [
                                'css_classes' => 'iramo-card iramo-bento-card',
                                'padding'     => [ 'unit' => 'px', 'top' => '24', 'right' => '24', 'bottom' => '24', 'left' => '24', 'isLinked' => true ],
                            ], true ),

                            iramo_el_container( 'irbs422', [
                                iramo_el_container( 'irbs422t', [
                                    iramo_el_widget( 'irbw405', 'iramo_badge', [ 'text' => 'خدمات و مشاوره تخصصی', 'sub_label' => 'پروژه اختصاصی سازمانی', '_css_classes' => 'iramo-el-tight' ] ),
                                    iramo_el_widget( 'irbw406', 'heading', [ 'title' => 'طراحی ربات، اتوماسیون و پیاده‌سازی AI برای سازمان شما', 'header_size' => 'h3', '_css_classes' => 'iramo-el-card-title iramo-el-tight' ] ),
                                    iramo_el_widget( 'irbw407', 'text-editor', [ 'editor' => '<p>مشاوره و اجرای پروژه‌های اختصاصی AI، توسعه ربات‌های فروش و پشتیبانی تلگرام و بله و اتوماسیون فرآیندها و اتصال به وردپرس و ووکامرس.</p>', '_css_classes' => 'iramo-el-desc iramo-el-tight' ] ),
                                ], [ 'css_classes' => 'iramo-el-col-stack' ], true ),
                                iramo_el_widget( 'irbw408', 'iramo_button_group', [
                                    'buttons' => [
                                        [ 'label' => 'ثبت سفارش پروژه ←', 'url' => [ 'url' => '/services/' ], 'variant' => 'accent' ],
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
                    'padding'        => [ 'unit' => 'px', 'top' => '12', 'right' => '0', 'bottom' => '56', 'left' => '0', 'isLinked' => false ],
                    'padding_mobile' => [ 'unit' => 'px', 'top' => '12', 'right' => '0', 'bottom' => '40', 'left' => '0', 'isLinked' => false ],
                ] ),
            ];
            iramo_save_elementor_payload( $home_id, $home_elements, 'wp-page' );
        }
    }

    // 2. Page: Articles (/articles/) — Queries Native WordPress Posts (`نوشته‌ها`)
    if ( ! empty( $page_ids['articles'] ) ) {
        $art_id = (int) $page_ids['articles'];
        if ( iramo_should_upgrade_seed( $art_id, $force ) ) {
            $art_elements = [
                iramo_el_container( 'irapg100', [
                    iramo_el_container( 'irapg110', [
                        iramo_el_container( 'irapg111', [
                            iramo_el_widget( 'irapgw1', 'iramo_badge', [ 'text' => 'مقالات و ابزارک‌های کاربردی', '_css_classes' => 'iramo-el-tight' ] ),
                            iramo_el_widget( 'irapgw2', 'heading', [ 'title' => 'مقالات تخصصی هوش مصنوعی و اتوماسیون', 'header_size' => 'h1', '_css_classes' => 'iramo-el-sec-title iramo-el-tight' ] ),
                            iramo_el_widget( 'irapgw3', 'text-editor', [ 'editor' => '<p>آموزش‌های فنی، بررسی معماری ربات‌ها، ترفندهای پرامپت‌نویسی و راهنمای استفاده عملی از AI در کسب‌وکار (مدیریت‌شده از بخش نوشته‌های وردپرس).</p>', '_css_classes' => 'iramo-el-desc iramo-el-tight' ] ),
                        ], [
                            'css_classes' => 'iramo-card iramo-el-col-stack',
                            'padding'     => [ 'unit' => 'px', 'top' => '24', 'right' => '24', 'bottom' => '24', 'left' => '24', 'isLinked' => true ],
                            'margin'      => [ 'unit' => 'px', 'top' => '0', 'right' => '0', 'bottom' => '24', 'left' => '0', 'isLinked' => false ],
                        ], true ),
                        iramo_build_loop_grid_widget( 'iraapw1', 'post', $loop_article_id, '3', 12, 'iramo_articles_grid' ),
                    ], [
                        'css_classes'    => 'iramo-container iramo-el-col-stack',
                        'padding'        => [ 'unit' => 'px', 'top' => '0', 'right' => '24', 'bottom' => '0', 'left' => '24', 'isLinked' => false ],
                        'padding_mobile' => [ 'unit' => 'px', 'top' => '0', 'right' => '16', 'bottom' => '0', 'left' => '16', 'isLinked' => false ],
                    ], true ),
                ], [
                    'padding'        => [ 'unit' => 'px', 'top' => '108', 'right' => '0', 'bottom' => '64', 'left' => '0', 'isLinked' => false ],
                    'padding_mobile' => [ 'unit' => 'px', 'top' => '88', 'right' => '0', 'bottom' => '48', 'left' => '0', 'isLinked' => false ],
                ] ),
            ];
            iramo_save_elementor_payload( $art_id, $art_elements, 'wp-page' );
        }
    }

    // 3. Page: Services (/services/) — Clean 2-Column Layout Matching React ServicesConsultationView
    if ( ! empty( $page_ids['services'] ) ) {
        $srv_id = (int) $page_ids['services'];
        if ( iramo_should_upgrade_seed( $srv_id, $force ) ) {
            $srv_elements = [
                iramo_el_container( 'irsrv100', [
                    iramo_el_widget( 'irsrvw1', 'iramo_consultation_form', [
                        'show_service_cards' => 'yes',
                        '_css_classes'       => 'iramo-el-tight',
                    ] ),
                ], [
                    'css_id'         => 'iramo-consult-box',
                    'padding'        => [ 'unit' => 'px', 'top' => '108', 'right' => '0', 'bottom' => '64', 'left' => '0', 'isLinked' => false ],
                    'padding_mobile' => [ 'unit' => 'px', 'top' => '88', 'right' => '0', 'bottom' => '48', 'left' => '0', 'isLinked' => false ],
                ] ),
            ];
            iramo_save_elementor_payload( $srv_id, $srv_elements, 'wp-page' );
        }
    }

    // =========================================================================
    // C. ELEMENTOR THEME BUILDER TEMPLATES (HEADER, FOOTER, ARCHIVES, SINGLES, 404)
    // =========================================================================

    // 5. Atomic Header Template (Floating Pill + Segmented Nav + Emerald CTA)
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

    // 6. Atomic Footer Template (1-to-1 Aligned with React WebsiteShell Footer + Centered Mobile)
    iramo_upsert_elementor_library(
        'iramo-tpl-footer',
        'فوتر اصلی iRamoAi (قابل ویرایش جزئی در المنتور)',
        'footer',
        [
            iramo_el_container( 'irftr100', [
                iramo_el_container( 'irftr110', [
                    iramo_el_container( 'irftr120', [
                        iramo_el_container( 'irftr121', [
                            iramo_el_widget( 'irftrw1', 'iramo_logo', [ 'brand_name' => 'iRamoAi', '_css_classes' => 'iramo-el-tight' ] ),
                            iramo_el_widget( 'irftrw1b', 'text-editor', [
                                'editor'       => '<p class="iramo-footer-tagline">آکادمی هوش مصنوعی، ربات‌سازی و مهندسی نرم‌افزار</p>',
                                '_css_classes' => 'iramo-el-tight',
                            ] ),
                            iramo_el_widget( 'irftrw2', 'text-editor', [
                                'editor'       => '<p>پلتفرم یکپارچه ارائه محصولات نرم‌افزاری هوشمند، دوره‌های تخصصی کاربردی، دایرکتوری انتخاب ابزارهای AI و زیرساخت بومی اتصال به تلگرام، بله و وردپرس.</p>',
                                '_css_classes' => 'iramo-el-footer-about iramo-el-tight',
                            ] ),
                            iramo_el_widget( 'irftrw2b', 'text-editor', [
                                'editor'       => '<p class="iramo-social-caption">ما را در شبکه‌های اجتماعی دنبال کنید</p>',
                                '_css_classes' => 'iramo-el-tight',
                            ] ),
                            iramo_el_widget( 'irftrw3', 'iramo_social_links', [ '_css_classes' => 'iramo-el-tight' ] ),
                        ], [ 'css_classes' => 'iramo-el-col-stack' ], true ),

                        iramo_el_container( 'irftr122', [
                            iramo_el_widget( 'irftrw4', 'iramo_footer_links_col', [
                                'title' => 'بخش‌های سایت',
                                'links' => [
                                    [ 'text' => 'صفحه اصلی', 'url' => [ 'url' => '/' ] ],
                                    [ 'text' => 'محصولات', 'url' => [ 'url' => '/products/' ] ],
                                    [ 'text' => 'دوره‌های آموزشی', 'url' => [ 'url' => '/academy/' ] ],
                                    [ 'text' => 'ابزارهای هوش مصنوعی', 'url' => [ 'url' => '/ai-tools/' ] ],
                                    [ 'text' => 'مقالات', 'url' => [ 'url' => '/articles/' ] ],
                                    [ 'text' => 'خدمات و مشاوره', 'url' => [ 'url' => '/services/' ] ],
                                ],
                                '_css_classes' => 'iramo-el-tight',
                            ] ),
                            iramo_el_widget( 'irftrw5', 'iramo_footer_links_col', [
                                'title' => 'امکانات و پلتفرم',
                                'links' => [
                                    [ 'text' => 'ثبت سفارش و مشاوره', 'url' => [ 'url' => '/services/' ] ],
                                    [ 'text' => 'نرم‌افزار حسابیار', 'url' => [ 'url' => '/products/' ] ],
                                    [ 'text' => 'دایرکتوری ابزارهای AI', 'url' => [ 'url' => '/ai-tools/' ] ],
                                    [ 'text' => 'پلاگین وردپرس و المنتور', 'url' => [ 'url' => '/services/' ] ],
                                ],
                                '_css_classes' => 'iramo-el-tight',
                            ] ),
                        ], [ 'css_classes' => 'iramo-footer-nav-grid' ], true ),

                        iramo_el_container( 'irftr123', [
                            iramo_el_widget( 'irftrw6', 'heading', [ 'title' => '✨ خبرنامه هفتگی ابزارها و آموزش‌های AI', 'header_size' => 'h4', '_css_classes' => 'iramo-el-footer-title iramo-el-tight' ] ),
                            iramo_el_widget( 'irftrw7', 'text-editor', [
                                'editor'       => '<p>معرفی جدیدترین ابزارهای هوش مصنوعی، پرامپت‌های کاربردی و آپدیت محصولات را در ایمیل دریافت کنید.</p>',
                                '_css_classes' => 'iramo-el-desc iramo-el-tight',
                            ] ),
                            iramo_el_widget( 'irftrw8', 'iramo_newsletter_form', [ 'placeholder' => 'you@domain.com', 'button_text' => 'عضویت', '_css_classes' => 'iramo-el-tight' ] ),
                            iramo_el_widget( 'irftrw8b', 'text-editor', [
                                'editor'       => '<div class="iramo-newsletter-trust"><span>✓ تضمین آپدیت و پشتیبانی فنی</span><a href="/services/" style="color:var(--iramo-primary);font-weight:700;">مشاوره پروژه ←</a></div>',
                                '_css_classes' => 'iramo-el-tight',
                            ] ),
                        ], [
                            'css_classes' => 'iramo-newsletter-card iramo-el-col-stack',
                            'padding'     => [ 'unit' => 'px', 'top' => '18', 'right' => '18', 'bottom' => '18', 'left' => '18', 'isLinked' => true ],
                        ], true ),
                    ], [ 'css_classes' => 'iramo-footer-grid' ], true ),

                    iramo_el_container( 'irftr130', [
                        iramo_el_widget( 'irftrw9', 'text-editor', [ 'editor' => '<p>© ۲۰۲۵ iRamoAi — طراحی و مهندسی پلتفرم هوشمند</p>', '_css_classes' => 'iramo-el-tight' ] ),
                        iramo_el_widget( 'irftrw10', 'iramo_theme_toggle_chip', [ 'label' => 'نمای تیره / روشن سایت', '_css_classes' => 'iramo-el-tight' ] ),
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

    // 6. Archive: AI Tools Directory (Header Filter Bar + Loop Grid wired to AI Tool Loop Item)
    $tools_archive_children = iramo_is_elementor_pro_active()
        ? [
            iramo_el_widget( 'iratw1', 'iramo_ai_tools_grid', [ 'show_header' => 'yes', 'show_grid' => 'no', 'show_filters' => 'yes', 'show_chips' => 'yes' ] ),
            iramo_el_container( 'irat110', [
                iramo_build_loop_grid_widget( 'iratw2', 'iramo_ai_tool', $loop_tool_id, '3', 24, 'iramo_ai_tools_grid' ),
            ], [
                'css_classes'    => 'iramo-container',
                'padding'        => [ 'unit' => 'px', 'top' => '0', 'right' => '24', 'bottom' => '0', 'left' => '24', 'isLinked' => false ],
                'padding_mobile' => [ 'unit' => 'px', 'top' => '0', 'right' => '16', 'bottom' => '0', 'left' => '16', 'isLinked' => false ],
            ], true ),
        ]
        : [
            iramo_el_widget( 'iratw1', 'iramo_ai_tools_grid', [
                'show_header'      => 'yes',
                'show_grid'        => 'yes',
                'posts_count'      => 30,
                'show_filters'     => 'yes',
                'show_chips'       => 'yes',
                'loop_template_id' => $loop_tool_id ? (string) $loop_tool_id : '',
            ] ),
        ];

    iramo_upsert_elementor_library(
        'iramo-tpl-archive-tools',
        'آرشیو دایرکتوری ابزارهای هوش مصنوعی (Loop Grid)',
        'archive',
        [
            iramo_el_container( 'irat100', $tools_archive_children, [ 'padding' => [ 'unit' => 'px', 'top' => '24', 'right' => '0', 'bottom' => '48', 'left' => '0', 'isLinked' => false ] ] ),
        ],
        [ 'include/archive/iramo_ai_tool_archive' ],
        $force
    );

    // 7. Single AI Tool Template
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

    // 8. Archive: Products (Atomic Header + Loop Grid wired to Product Loop Item)
    iramo_upsert_elementor_library(
        'iramo-tpl-archive-products',
        'آرشیو محصولات نرم‌افزاری (Loop Grid)',
        'archive',
        [
            iramo_el_container( 'irap100', [
                iramo_el_container( 'irap110', [
                    iramo_el_container( 'irap111', [
                        iramo_el_widget( 'irapw1', 'iramo_badge', [ 'text' => 'محصولات نرم‌افزاری و اتوماسیون', '_css_classes' => 'iramo-el-tight' ] ),
                        iramo_el_widget( 'irapw2', 'heading', [ 'title' => 'محصولات نرم‌افزاری اختصاصی iRamoAi', 'header_size' => 'h1', '_css_classes' => 'iramo-el-sec-title iramo-el-tight' ] ),
                        iramo_el_widget( 'irapw3', 'text-editor', [ 'editor' => '<p>نرم‌افزارهای آماده کسب‌وکار با اتصال بومی به ووکامرس، صدور خودکار لایسنس و قالب قابل ویرایش Loop Item.</p>', '_css_classes' => 'iramo-el-desc iramo-el-tight' ] ),
                    ], [ 'css_classes' => 'iramo-card iramo-el-col-stack', 'padding' => [ 'unit' => 'px', 'top' => '24', 'right' => '24', 'bottom' => '24', 'left' => '24', 'isLinked' => true ], 'margin' => [ 'unit' => 'px', 'top' => '0', 'right' => '0', 'bottom' => '24', 'left' => '0', 'isLinked' => false ] ], true ),
                    iramo_build_loop_grid_widget( 'irapw4', 'iramo_product', $loop_product_id, '2', 24, 'iramo_products_grid' ),
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

    // 10. Archive: Courses (Atomic Header + Loop Grid wired to Course Loop Item)
    iramo_upsert_elementor_library(
        'iramo-tpl-archive-courses',
        'آرشیو دوره‌های آکادمی (Loop Grid)',
        'archive',
        [
            iramo_el_container( 'irac100', [
                iramo_el_container( 'irac110', [
                    iramo_el_container( 'irac111', [
                        iramo_el_widget( 'iracw01', 'iramo_badge', [ 'text' => 'آکادمی تخصصی iRamoAi', '_css_classes' => 'iramo-el-tight' ] ),
                        iramo_el_widget( 'iracw02', 'heading', [ 'title' => 'دوره‌های آموزشی هوش مصنوعی و اتوماسیون', 'header_size' => 'h1', '_css_classes' => 'iramo-el-sec-title iramo-el-tight' ] ),
                        iramo_el_widget( 'iracw03', 'text-editor', [ 'editor' => '<p>دوره‌های کاربردی و پروژه‌محور با پشتیبانی مدرس، فایل‌های تمرینی و دسترسی مستقیم پس از ثبت‌نام.</p>', '_css_classes' => 'iramo-el-desc iramo-el-tight' ] ),
                    ], [ 'css_classes' => 'iramo-card iramo-el-col-stack', 'padding' => [ 'unit' => 'px', 'top' => '24', 'right' => '24', 'bottom' => '24', 'left' => '24', 'isLinked' => true ], 'margin' => [ 'unit' => 'px', 'top' => '0', 'right' => '0', 'bottom' => '24', 'left' => '0', 'isLinked' => false ] ], true ),
                    iramo_build_loop_grid_widget( 'iracw1', 'iramo_course', $loop_course_id, '3', 12, 'iramo_courses_grid' ),
                ], [
                    'css_classes'    => 'iramo-container iramo-el-col-stack',
                    'padding'        => [ 'unit' => 'px', 'top' => '0', 'right' => '24', 'bottom' => '0', 'left' => '24', 'isLinked' => false ],
                    'padding_mobile' => [ 'unit' => 'px', 'top' => '0', 'right' => '16', 'bottom' => '0', 'left' => '16', 'isLinked' => false ],
                ], true ),
            ], [ 'padding' => [ 'unit' => 'px', 'top' => '24', 'right' => '0', 'bottom' => '48', 'left' => '0', 'isLinked' => false ] ] ),
        ],
        [ 'include/archive/iramo_course_archive' ],
        $force
    );

    // 11. NEW: Single Course Atomic Template (Built strictly from Core Atomic Elementor Widgets + Dynamic Tags!)
    iramo_upsert_elementor_library(
        'iramo-tpl-single-course',
        'صفحه تکی دوره آموزشی (اتمیک + Dynamic Tags)',
        'single-post',
        [
            iramo_el_container( 'irsc100', [
                // Hero Split Card
                iramo_el_container( 'irsc110', [
                    iramo_el_container( 'irsc111', [
                        iramo_el_widget( 'irscw1', 'iramo_badge', [
                            'text'         => '',
                            'sub_label'    => '',
                            '__dynamic__'  => [
                                'text'      => iramo_el_tag( 'tsclvl1', 'iramo-course-level' ),
                                'sub_label' => iramo_el_tag( 'tscdur1', 'iramo-course-duration' ),
                            ],
                            '_css_classes' => 'iramo-el-tight',
                        ] ),
                        iramo_el_widget( 'irscw2', 'heading', [
                            'title'        => '',
                            '__dynamic__'  => [ 'title' => iramo_el_tag( 'tsctit1', 'iramo-post-title' ) ],
                            'header_size'  => 'h1',
                            '_css_classes' => 'iramo-el-hero-title iramo-el-tight',
                        ] ),
                        iramo_el_widget( 'irscw3', 'text-editor', [
                            'editor'       => '',
                            '__dynamic__'  => [ 'editor' => iramo_el_tag( 'tscexc1', 'iramo-post-excerpt' ) ],
                            '_css_classes' => 'iramo-el-subtitle iramo-el-tight',
                        ] ),
                        iramo_el_widget( 'irscw4', 'text-editor', [
                            'editor'       => '',
                            '__dynamic__'  => [ 'editor' => iramo_el_tag( 'tscins1', 'iramo-course-instructor' ) ],
                            '_css_classes' => 'iramo-meta-pill iramo-el-tight',
                        ] ),
                        iramo_el_widget( 'irscw5', 'button', [
                            'text'               => '',
                            '__dynamic__'        => [ 'text' => iramo_el_tag( 'tscprc1', 'iramo-course-price' ) ],
                            'link'               => [ 'url' => '/services/' ],
                            'background_color'   => '#059669',
                            'button_text_color'  => '#FFFFFF',
                            'border_radius'      => [ 'unit' => 'px', 'top' => '14', 'right' => '14', 'bottom' => '14', 'left' => '14', 'isLinked' => true ],
                            '_css_classes'       => 'iramo-el-tight',
                        ] ),
                    ], [ 'css_classes' => 'iramo-el-col-stack', 'flex_gap' => [ 'size' => 12, 'unit' => 'px' ] ], true ),

                    iramo_el_container( 'irsc112', [
                        iramo_el_widget( 'irscw6', 'image', [
                            '__dynamic__'         => [ 'image' => iramo_el_tag( 'tscimg1', 'iramo-post-image' ) ],
                            'image_size'          => 'large',
                            'width'               => [ 'size' => 100, 'unit' => '%' ],
                            'image_border_radius' => [ 'unit' => 'px', 'top' => '18', 'right' => '18', 'bottom' => '18', 'left' => '18', 'isLinked' => true ],
                            '_css_classes'        => 'iramo-hero-media iramo-el-tight',
                        ] ),
                    ], [ 'css_classes' => 'iramo-el-col-stack' ], true ),
                ], [
                    'css_classes' => 'iramo-card iramo-hero-grid',
                    'padding'     => [ 'unit' => 'px', 'top' => '24', 'right' => '24', 'bottom' => '24', 'left' => '24', 'isLinked' => true ],
                ], true ),

                // Full Course Description & Content (Atomic Heading + Text Editor Dynamic)
                iramo_el_container( 'irsc120', [
                    iramo_el_widget( 'irscw7', 'heading', [
                        'title'        => 'معرفی کامل، سرفصل‌ها و خروجی عملی دوره',
                        'header_size'  => 'h2',
                        '_css_classes' => 'iramo-el-sec-title iramo-el-tight',
                    ] ),
                    iramo_el_widget( 'irscw8', 'text-editor', [
                        'editor'       => '',
                        '__dynamic__'  => [ 'editor' => iramo_el_tag( 'tsccnt1', 'iramo-post-content' ) ],
                        '_css_classes' => 'iramo-el-desc iramo-el-tight',
                    ] ),
                ], [
                    'css_classes' => 'iramo-card iramo-el-col-stack',
                    'flex_gap'    => [ 'size' => 12, 'unit' => 'px' ],
                    'padding'     => [ 'unit' => 'px', 'top' => '24', 'right' => '24', 'bottom' => '24', 'left' => '24', 'isLinked' => true ],
                ], true ),

                // Atomic Course FAQ / Learning Modules Accordion
                iramo_el_container( 'irsc130', [
                    iramo_el_widget( 'irscw9', 'heading', [
                        'title'        => 'ساختار آموزش، تکالیف و نحوه دریافت گواهینامه',
                        'header_size'  => 'h2',
                        '_css_classes' => 'iramo-el-sec-title iramo-el-tight',
                    ] ),
                    iramo_el_widget( 'irscw10', 'accordion', [
                        'tabs' => [
                            [
                                'tab_title'   => 'دسترسی فوری به ویدیوها و سرفصل‌ها',
                                'tab_content' => '<p>بلافاصله پس از ثبت‌نام در ووکامرس یا هماهنگی از طریق فرم مشاوره، تمام جلسات ویدیویی و فایل‌های تمرینی دوره در اختیار شما قرار می‌گیرد.</p>',
                            ],
                            [
                                'tab_title'   => 'پشتیبانی مدرس و بررسی پروژه‌ها',
                                'tab_content' => '<p>پروژه‌ها و سوالات فنی شما مستقیماً توسط تیم مدرس بررسی شده و بازخورد از طریق ایمیل، تلگرام یا بله ارسال می‌شود.</p>',
                            ],
                            [
                                'tab_title'   => 'پیش‌نیازها و مخاطبان دوره',
                                'tab_content' => '<p>تمام مفاهیم به صورت پروژه‌محور از پایه تا پیاده‌سازی واقعی تدریس شده‌اند و با کلیک روی جزئیات در المنتور قابل سفارشی‌سازی هستند.</p>',
                            ],
                        ],
                        'title_html_tag' => 'div',
                    ] ),
                    iramo_el_widget( 'irscw11', 'button', [
                        'text'               => 'ثبت‌نام و مشاوره دوره ←',
                        'link'               => [ 'url' => '/services/' ],
                        'background_color'   => '#FFBA00',
                        'button_text_color'  => '#061A13',
                        'border_radius'      => [ 'unit' => 'px', 'top' => '12', 'right' => '12', 'bottom' => '12', 'left' => '12', 'isLinked' => true ],
                        '_css_classes'       => 'iramo-el-tight',
                    ] ),
                ], [
                    'css_classes' => 'iramo-card iramo-el-col-stack',
                    'flex_gap'    => [ 'size' => 14, 'unit' => 'px' ],
                    'padding'     => [ 'unit' => 'px', 'top' => '24', 'right' => '24', 'bottom' => '24', 'left' => '24', 'isLinked' => true ],
                ], true ),
            ], [
                'css_classes'    => 'iramo-container iramo-el-col-stack',
                'flex_gap'       => [ 'size' => 24, 'unit' => 'px' ],
                'padding'        => [ 'unit' => 'px', 'top' => '24', 'right' => '24', 'bottom' => '48', 'left' => '24', 'isLinked' => false ],
                'padding_mobile' => [ 'unit' => 'px', 'top' => '20', 'right' => '16', 'bottom' => '40', 'left' => '16', 'isLinked' => false ],
            ] ),
        ],
        [ 'include/singular/iramo_course' ],
        $force
    );

    // 12. Archive: Articles / Blog Posts (`post` + Loop Grid wired to Article Loop Item)
    iramo_upsert_elementor_library(
        'iramo-tpl-archive-articles',
        'آرشیو مقالات و نوشته‌ها (Loop Grid)',
        'archive',
        [
            iramo_el_container( 'iraa100', [
                iramo_el_container( 'iraa110', [
                    iramo_el_container( 'iraa111', [
                        iramo_el_widget( 'iraaw01', 'iramo_badge', [ 'text' => 'مقالات و ابزارک‌های کاربردی', '_css_classes' => 'iramo-el-tight' ] ),
                        iramo_el_widget( 'iraaw02', 'heading', [ 'title' => 'مقالات تخصصی هوش مصنوعی و اتوماسیون', 'header_size' => 'h1', '_css_classes' => 'iramo-el-sec-title iramo-el-tight' ] ),
                        iramo_el_widget( 'iraaw03', 'text-editor', [ 'editor' => '<p>آموزش‌های فنی، بررسی معماری ربات‌ها، ترفندهای پرامپت‌نویسی و راهنمای استفاده عملی از AI در کسب‌وکار.</p>', '_css_classes' => 'iramo-el-desc iramo-el-tight' ] ),
                    ], [ 'css_classes' => 'iramo-card iramo-el-col-stack', 'padding' => [ 'unit' => 'px', 'top' => '24', 'right' => '24', 'bottom' => '24', 'left' => '24', 'isLinked' => true ], 'margin' => [ 'unit' => 'px', 'top' => '0', 'right' => '0', 'bottom' => '24', 'left' => '0', 'isLinked' => false ] ], true ),
                    iramo_build_loop_grid_widget( 'iraaw1', 'post', $loop_article_id, '3', 12, 'iramo_articles_grid' ),
                ], [
                    'css_classes'    => 'iramo-container iramo-el-col-stack',
                    'padding'        => [ 'unit' => 'px', 'top' => '0', 'right' => '24', 'bottom' => '0', 'left' => '24', 'isLinked' => false ],
                    'padding_mobile' => [ 'unit' => 'px', 'top' => '0', 'right' => '16', 'bottom' => '0', 'left' => '16', 'isLinked' => false ],
                ], true ),
            ], [ 'padding' => [ 'unit' => 'px', 'top' => '24', 'right' => '0', 'bottom' => '48', 'left' => '0', 'isLinked' => false ] ] ),
        ],
        [ 'include/archive/post_archive' ],
        $force
    );

    // 13. NEW: Single Article Atomic Template (Built strictly from Core Atomic Elementor Widgets + Dynamic Tags!)
    iramo_upsert_elementor_library(
        'iramo-tpl-single-article',
        'صفحه تکی مقاله تخصصی (اتمیک + Dynamic Tags)',
        'single-post',
        [
            iramo_el_container( 'irsa100', [
                iramo_el_container( 'irsa110', [
                    iramo_el_widget( 'irsaw1', 'iramo_badge', [
                        'text'         => '',
                        'sub_label'    => '',
                        '__dynamic__'  => [
                            'text'      => iramo_el_tag( 'tsacat1', 'iramo-post-category' ),
                            'sub_label' => iramo_el_tag( 'tsadat1', 'iramo-post-date' ),
                        ],
                        '_css_classes' => 'iramo-el-tight',
                    ] ),
                    iramo_el_widget( 'irsaw2', 'heading', [
                        'title'        => '',
                        '__dynamic__'  => [ 'title' => iramo_el_tag( 'tsatit1', 'iramo-post-title' ) ],
                        'header_size'  => 'h1',
                        '_css_classes' => 'iramo-el-sec-title iramo-el-tight',
                    ] ),
                    iramo_el_widget( 'irsaw3', 'text-editor', [
                        'editor'       => '',
                        '__dynamic__'  => [ 'editor' => iramo_el_tag( 'tsaaut1', 'iramo-post-author' ) ],
                        '_css_classes' => 'iramo-meta-pill iramo-el-tight',
                    ] ),
                    iramo_el_widget( 'irsaw4', 'image', [
                        '__dynamic__'         => [ 'image' => iramo_el_tag( 'tsaimg1', 'iramo-post-image' ) ],
                        'image_size'          => 'large',
                        'width'               => [ 'size' => 100, 'unit' => '%' ],
                        'image_border_radius' => [ 'unit' => 'px', 'top' => '18', 'right' => '18', 'bottom' => '18', 'left' => '18', 'isLinked' => true ],
                        '_css_classes'        => 'iramo-el-tight iramo-loop-media-16x9',
                    ] ),
                    iramo_el_widget( 'irsaw5', 'text-editor', [
                        'editor'       => '',
                        '__dynamic__'  => [ 'editor' => iramo_el_tag( 'tsacnt1', 'iramo-post-content' ) ],
                        '_css_classes' => 'iramo-el-subtitle iramo-el-tight',
                    ] ),
                    iramo_el_container( 'irsa120', [
                        iramo_el_widget( 'irsaw6', 'button', [
                            'text'               => 'بازگشت به همه مقالات ←',
                            'link'               => [ 'url' => '/articles/' ],
                            'background_color'   => 'transparent',
                            'button_text_color'  => '#059669',
                            'border_border'      => 'solid',
                            'border_width'       => [ 'unit' => 'px', 'top' => '1', 'right' => '1', 'bottom' => '1', 'left' => '1', 'isLinked' => true ],
                            'border_color'       => '#059669',
                            'border_radius'      => [ 'unit' => 'px', 'top' => '12', 'right' => '12', 'bottom' => '12', 'left' => '12', 'isLinked' => true ],
                            '_css_classes'       => 'iramo-el-tight',
                        ] ),
                        iramo_el_widget( 'irsaw7', 'button', [
                            'text'               => 'دایرکتوری ابزارهای AI',
                            'link'               => [ 'url' => '/ai-tools/' ],
                            'background_color'   => '#FFBA00',
                            'button_text_color'  => '#061A13',
                            'border_radius'      => [ 'unit' => 'px', 'top' => '12', 'right' => '12', 'bottom' => '12', 'left' => '12', 'isLinked' => true ],
                            '_css_classes'       => 'iramo-el-tight',
                        ] ),
                    ], [
                        'flex_direction' => 'row',
                        'flex_wrap'      => 'wrap',
                        'flex_gap'       => [ 'size' => 10, 'unit' => 'px' ],
                    ], true ),
                ], [
                    'css_classes' => 'iramo-card iramo-el-col-stack',
                    'flex_gap'    => [ 'size' => 16, 'unit' => 'px' ],
                    'padding'     => [ 'unit' => 'px', 'top' => '26', 'right' => '26', 'bottom' => '26', 'left' => '26', 'isLinked' => true ],
                ], true ),
            ], [
                'css_classes'    => 'iramo-container',
                'boxed_width'    => [ 'size' => 940, 'unit' => 'px' ],
                'padding'        => [ 'unit' => 'px', 'top' => '24', 'right' => '24', 'bottom' => '48', 'left' => '24', 'isLinked' => false ],
                'padding_mobile' => [ 'unit' => 'px', 'top' => '20', 'right' => '16', 'bottom' => '40', 'left' => '16', 'isLinked' => false ],
            ] ),
        ],
        [ 'include/singular/post' ],
        $force
    );

    // 14. Error 404
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
                    'css_classes'      => 'iramo-card iramo-el-col-stack',
                    'flex_align_items' => 'center',
                    'flex_gap'         => [ 'size' => 14, 'unit' => 'px' ],
                    'padding'          => [ 'unit' => 'px', 'top' => '36', 'right' => '24', 'bottom' => '36', 'left' => '24', 'isLinked' => false ],
                ], true ),
            ], [ 'css_classes' => 'iramo-container', 'padding' => [ 'unit' => 'px', 'top' => '48', 'right' => '24', 'bottom' => '64', 'left' => '24', 'isLinked' => false ] ] ),
        ],
        [ 'include/singular/not_found404' ],
        $force
    );

    update_option( 'iramo_elementor_seeded', iramo_is_elementor_pro_active() ? '3.0.0-pro' : '3.0.0-free' );
}

/**
 * Add direct "ویرایش قالب این بخش در المنتور" + "ویرایش کارت Loop" + Header/Footer links in WP Admin Bar
 */
add_action( 'admin_bar_menu', function( $wp_admin_bar ) {
    if ( ! current_user_can( 'edit_posts' ) || is_admin() ) {
        return;
    }
    $slug      = '';
    $loop_slug = '';
    if ( is_post_type_archive( 'iramo_ai_tool' ) ) {
        $slug      = 'iramo-tpl-archive-tools';
        $loop_slug = 'iramo-loop-tool';
    } elseif ( is_singular( 'iramo_ai_tool' ) ) {
        $slug = 'iramo-tpl-single-tool';
    } elseif ( is_post_type_archive( 'iramo_product' ) ) {
        $slug      = 'iramo-tpl-archive-products';
        $loop_slug = 'iramo-loop-product';
    } elseif ( is_singular( [ 'iramo_product', 'product' ] ) ) {
        $slug = 'iramo-tpl-single-product';
    } elseif ( is_post_type_archive( 'iramo_course' ) ) {
        $slug      = 'iramo-tpl-archive-courses';
        $loop_slug = 'iramo-loop-course';
    } elseif ( is_singular( 'iramo_course' ) ) {
        $slug = 'iramo-tpl-single-course';
    } elseif ( is_page( 'articles' ) || is_home() || is_category() || is_tag() ) {
        $slug      = 'iramo-tpl-archive-articles';
        $loop_slug = 'iramo-loop-article';
    } elseif ( is_singular( 'post' ) ) {
        $slug = 'iramo-tpl-single-article';
    } elseif ( is_404() ) {
        $slug = 'iramo-tpl-404';
    }

    if ( $slug ) {
        $tid = iramo_get_library_id_by_slug( $slug );
        if ( $tid ) {
            $wp_admin_bar->add_node( [
                'id'    => 'iramo-edit-elementor-template',
                'title' => '✨ ویرایش قالب این بخش در المنتور',
                'href'  => admin_url( 'post.php?post=' . $tid . '&action=elementor' ),
            ] );
        }
    }

    if ( $loop_slug ) {
        $lid = iramo_get_library_id_by_slug( $loop_slug );
        if ( $lid ) {
            $wp_admin_bar->add_node( [
                'id'    => 'iramo-edit-loop-template',
                'title' => 'ویرایش کارت (Loop Item)',
                'href'  => admin_url( 'post.php?post=' . $lid . '&action=elementor' ),
            ] );
        }
    }

    if ( $hdr_id = iramo_get_library_id_by_slug( 'iramo-tpl-header' ) ) {
        $wp_admin_bar->add_node( [
            'id'    => 'iramo-edit-header-template',
            'title' => 'ویرایش هدر در المنتور',
            'href'  => admin_url( 'post.php?post=' . $hdr_id . '&action=elementor' ),
        ] );
    }
    if ( $ftr_id = iramo_get_library_id_by_slug( 'iramo-tpl-footer' ) ) {
        $wp_admin_bar->add_node( [
            'id'    => 'iramo-edit-footer-template',
            'title' => 'ویرایش فوتر در المنتور',
            'href'  => admin_url( 'post.php?post=' . $ftr_id . '&action=elementor' ),
        ] );
    }
}, 90 );
