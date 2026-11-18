<?php
/**
 * iRamoAi Modern Theme Functions, Customizer, Elementor Pro Locations & Shared Renderers
 *
 * @package iRamoAiTheme
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

define( 'IRAMO_THEME_VERSION', '3.0.0' );

/**
 * 1. Core Theme Setup
 */
add_action( 'after_setup_theme', function() {
    add_theme_support( 'title-tag' );
    add_theme_support( 'post-thumbnails' );
    add_theme_support( 'custom-logo', [
        'height'      => 64,
        'width'       => 220,
        'flex-height' => true,
        'flex-width'  => true,
    ] );
    add_theme_support( 'html5', [ 'search-form', 'comment-form', 'comment-list', 'gallery', 'caption', 'style', 'script' ] );
    add_theme_support( 'woocommerce' );
    add_theme_support( 'align-wide' );

    register_nav_menus( [
        'primary' => __( 'منوی اصلی iRamoAi', 'iramo-ai-theme' ),
        'footer'  => __( 'منوی فوتر iRamoAi', 'iramo-ai-theme' ),
    ] );
} );

/**
 * 2. Helper Utilities
 */
function iramo_fa_digits( $input ) {
    $en = [ '0', '1', '2', '3', '4', '5', '6', '7', '8', '9' ];
    $fa = [ '۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹' ];
    return str_replace( $en, $fa, (string) $input );
}

function iramo_brand_wordmark_html( $raw_title = 'iRamoAi' ) {
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

function iramo_format_toman( $amount ) {
    $num = (int) $amount;
    if ( $num <= 0 ) {
        return 'رایگان';
    }
    return iramo_fa_digits( number_format_i18n( $num ) ) . ' تومان';
}

function iramo_get_theme_image( $filename ) {
    return trailingslashit( get_template_directory_uri() ) . 'assets/images/' . ltrim( $filename, '/' );
}

function iramo_get_page_url( $slug, $fallback = '/' ) {
    $pages = get_posts( [
        'post_type'      => 'page',
        'post_status'    => 'publish',
        'meta_key'       => '_iramo_page_slug',
        'meta_value'     => $slug,
        'posts_per_page' => 1,
        'fields'         => 'ids',
    ] );
    if ( ! empty( $pages ) ) {
        return get_permalink( $pages[0] );
    }
    $by_path = get_page_by_path( $slug );
    if ( $by_path && $by_path->post_status === 'publish' ) {
        return get_permalink( $by_path->ID );
    }
    return home_url( $fallback );
}

function iramo_get_setting( $key, $default = '' ) {
    $mod = get_theme_mod( 'iramo_' . $key, null );
    if ( $mod !== null && $mod !== '' ) {
        return $mod;
    }
    $plugin_opts = get_option( 'iramo_ai_settings', [] );
    if ( isset( $plugin_opts[ $key ] ) && $plugin_opts[ $key ] !== '' ) {
        return $plugin_opts[ $key ];
    }
    return $default;
}

function iramo_has_woocommerce_account() {
    return function_exists( 'wc_get_page_permalink' ) && (bool) wc_get_page_permalink( 'myaccount' );
}

function iramo_get_account_url() {
    if ( iramo_has_woocommerce_account() ) {
        return wc_get_page_permalink( 'myaccount' );
    }
    return iramo_get_page_url( 'services', '/services/' );
}

/**
 * 3. Enqueue Fonts, CSS & Interactive Vanilla JS
 */
add_action( 'wp_enqueue_scripts', function() {
    $deps = [ 'iramo-vazirmatn' ];
    wp_enqueue_style(
        'iramo-vazirmatn',
        'https://fonts.googleapis.com/css2?family=Vazirmatn:wght@400;500;600;700;800;900&display=swap',
        [],
        null
    );

    if ( defined( 'IRAMO_AI_PATH' ) && defined( 'IRAMO_AI_URL' ) && file_exists( IRAMO_AI_PATH . 'assets/fonts/custom-font.css' ) ) {
        wp_enqueue_style( 'iramo-custom-font', IRAMO_AI_URL . 'assets/fonts/custom-font.css', [], IRAMO_THEME_VERSION );
        $deps[] = 'iramo-custom-font';
    }

    wp_enqueue_style( 'iramo-theme-style', get_stylesheet_uri(), $deps, IRAMO_THEME_VERSION );
    wp_enqueue_script(
        'iramo-theme-js',
        get_template_directory_uri() . '/assets/iramo-theme.js',
        [],
        IRAMO_THEME_VERSION,
        true
    );

    wp_localize_script( 'iramo-theme-js', 'iramoThemeData', [
        'restUrl'      => esc_url_raw( rest_url( 'iramo/v1/' ) ),
        'nonce'        => wp_create_nonce( 'wp_rest' ),
        'toolsArchive' => esc_url_raw( get_post_type_archive_link( 'iramo_ai_tool' ) ?: iramo_get_page_url( 'ai-tools', '/ai-tools/' ) ),
        'defaultTheme' => iramo_get_setting( 'default_theme', 'light' ),
    ] );
} );

/**
 * 4. WordPress Customizer: Colors, Fonts, Hero & Socials Synced to CSS Variables & Elementor
 */
add_action( 'customize_register', function( $wp_customize ) {
    $wp_customize->add_panel( 'iramo_theme_panel', [
        'title'    => __( 'تنظیمات قالب iRamoAi', 'iramo-ai-theme' ),
        'priority' => 25,
    ] );

    // Colors & Typography Section
    $wp_customize->add_section( 'iramo_appearance_sec', [
        'title' => __( 'رنگ‌بندی و تایپوگرافی', 'iramo-ai-theme' ),
        'panel' => 'iramo_theme_panel',
    ] );

    $color_controls = [
        'iramo_primary_color'      => [ 'رنگ اصلی برند (Primary)', '#059669' ],
        'iramo_accent_color'       => [ 'رنگ دکمه‌ها و قیمت (Accent)', '#FFBA00' ],
        'iramo_light_canvas_color' => [ 'رنگ پس‌زمینه حالت روشن', '#F8FAFC' ],
        'iramo_dark_canvas_color'  => [ 'رنگ پس‌زمینه حالت تیره', '#050C0A' ],
    ];
    foreach ( $color_controls as $id => $cfg ) {
        $wp_customize->add_setting( $id, [
            'default'           => $cfg[1],
            'sanitize_callback' => 'sanitize_hex_color',
        ] );
        $wp_customize->add_control( new WP_Customize_Color_Control( $wp_customize, $id, [
            'label'   => $cfg[0],
            'section' => 'iramo_appearance_sec',
        ] ) );
    }

    $wp_customize->add_setting( 'iramo_default_theme', [
        'default'           => 'light',
        'sanitize_callback' => 'sanitize_text_field',
    ] );
    $wp_customize->add_control( 'iramo_default_theme', [
        'label'   => __( 'حالت پیش‌فرض نمایش سایت', 'iramo-ai-theme' ),
        'section' => 'iramo_appearance_sec',
        'type'    => 'select',
        'choices' => [
            'light' => 'روشن مدرن (Light)',
            'dark'  => 'تیره زمردی (Dark)',
        ],
    ] );

    $wp_customize->add_setting( 'iramo_font_family', [
        'default'           => 'IRANYekanXVF',
        'sanitize_callback' => 'sanitize_text_field',
    ] );
    $wp_customize->add_control( 'iramo_font_family', [
        'label'   => __( 'فونت اصلی سایت', 'iramo-ai-theme' ),
        'section' => 'iramo_appearance_sec',
        'type'    => 'select',
        'choices' => [
            'IRANYekanXVF' => 'ایران‌یکان وریبل (IRANYekanXVF)',
            'Vazirmatn'    => 'وزیرمتن (Vazirmatn)',
        ],
    ] );

    // Hero Section
    $wp_customize->add_section( 'iramo_hero_sec', [
        'title' => __( 'متن هیرو صفحه اصلی', 'iramo-ai-theme' ),
        'panel' => 'iramo_theme_panel',
    ] );
    $hero_fields = [
        'iramo_brand_name'    => [ 'نام برند', 'iRamoAi' ],
        'iramo_hero_badge'    => [ 'برچسب بالای عنوان هیرو', 'اکوسیستم نرم‌افزار و هوش مصنوعی فارسی' ],
        'iramo_hero_title'    => [ 'عنوان اصلی هیرو (H1)', 'آینده کسب‌وکار شما با دستیارها و محصولات هوش مصنوعی' ],
        'iramo_hero_subtitle' => [ 'توضیح زیر عنوان هیرو', 'نرم‌افزارهای آماده حسابیار و ویدئومی، دایرکتوری دست‌چین ابزارهای AI و آکادمی تخصصی آموزش و اتوماسیون در یک پلتفرم یکپارچه.' ],
        'iramo_footer_about'  => [ 'معرفی کوتاه فوتر', 'پلتفرم تخصصی طراحی نرم‌افزارهای هوشمند، آکادمی آموزش کاربردی AI و مرجع معرفی برترین ابزارهای هوش مصنوعی جهان.' ],
        'iramo_copyright'     => [ 'متن کپی‌رایت فوتر', '© تمامی حقوق برای پلتفرم هوشمند iRamoAi محفوظ است.' ],
    ];
    foreach ( $hero_fields as $id => $cfg ) {
        $wp_customize->add_setting( $id, [
            'default'           => $cfg[1],
            'sanitize_callback' => 'sanitize_text_field',
        ] );
        $wp_customize->add_control( $id, [
            'label'   => $cfg[0],
            'section' => 'iramo_hero_sec',
            'type'    => strlen( $cfg[1] ) > 60 ? 'textarea' : 'text',
        ] );
    }

    // Social Links
    $wp_customize->add_section( 'iramo_social_sec', [
        'title' => __( 'شبکه‌های اجتماعی و ربات‌ها', 'iramo-ai-theme' ),
        'panel' => 'iramo_theme_panel',
    ] );
    $socials = [
        'iramo_social_telegram'  => [ 'لینک کانال / ربات تلگرام', 'https://t.me/iRamoBot' ],
        'iramo_social_bale'      => [ 'لینک کانال / ربات بله', 'https://ble.ir/iRamoBaleBot' ],
        'iramo_social_instagram' => [ 'لینک اینستاگرام', 'https://instagram.com' ],
        'iramo_social_github'    => [ 'لینک گیت‌هاب', 'https://github.com' ],
    ];
    foreach ( $socials as $id => $cfg ) {
        $wp_customize->add_setting( $id, [
            'default'           => $cfg[1],
            'sanitize_callback' => 'esc_url_raw',
        ] );
        $wp_customize->add_control( $id, [
            'label'   => $cfg[0],
            'section' => 'iramo_social_sec',
            'type'    => 'url',
        ] );
    }
} );

add_action( 'wp_head', function() {
    $primary = sanitize_hex_color( iramo_get_setting( 'primary_color', '#059669' ) ) ?: '#059669';
    $accent  = sanitize_hex_color( iramo_get_setting( 'accent_color', '#FFBA00' ) ) ?: '#FFBA00';
    $canvas  = sanitize_hex_color( iramo_get_setting( 'light_canvas_color', '#F8FAFC' ) ) ?: '#F8FAFC';
    $dark_bg = sanitize_hex_color( get_theme_mod( 'iramo_dark_canvas_color', '#050C0A' ) ) ?: '#050C0A';
    $font    = iramo_get_setting( 'font_family', 'IRANYekanXVF' );
    $font_stack = ( $font === 'Vazirmatn' || $font === 'vazirmatn' )
        ? "'Vazirmatn', system-ui, -apple-system, sans-serif"
        : "'IRANYekanXVF', 'Vazirmatn', system-ui, -apple-system, sans-serif";
    ?>
    <style id="iramo-customizer-vars">
      :root,
      [class*="elementor-kit-"] {
        --iramo-primary: <?php echo esc_html( $primary ); ?>;
        --iramo-accent: <?php echo esc_html( $accent ); ?>;
        --iramo-canvas: <?php echo esc_html( $canvas ); ?>;
        --font-fa: <?php echo $font_stack; ?>;
        --e-global-color-primary: <?php echo esc_html( $primary ); ?>;
        --e-global-color-secondary: #0F172A;
        --e-global-color-text: #475569;
        --e-global-color-accent: <?php echo esc_html( $accent ); ?>;
        --e-global-typography-primary-font-family: <?php echo $font_stack; ?>;
        --e-global-typography-secondary-font-family: <?php echo $font_stack; ?>;
        --e-global-typography-text-font-family: <?php echo $font_stack; ?>;
        --e-global-typography-accent-font-family: <?php echo $font_stack; ?>;
      }
      html.dark,
      html.dark [class*="elementor-kit-"] {
        --iramo-canvas: <?php echo esc_html( $dark_bg ); ?>;
        --e-global-color-secondary: #F8FAFC;
        --e-global-color-text: #94A3B8;
      }
    </style>
    <?php
}, 95 );

/**
 * 5. Full Elementor Pro Theme Builder Locations
 */
add_action( 'elementor/theme/register_locations', function( $elementor_theme_manager ) {
    $elementor_theme_manager->register_all_core_location();
} );

/**
 * 6. Trigger Auto Provisioning on Theme Activation
 */
add_action( 'after_switch_theme', function() {
    if ( function_exists( 'iramo_provision_site_pages' ) ) {
        iramo_provision_site_pages( false );
    } else {
        update_option( 'iramo_pending_page_setup', 1 );
    }
} );

/**
 * 7. Shared Card Renderers (Used by Native Templates + Elementor Widgets + Loop Items)
 */
function iramo_render_loop_item_template( $tpl_id, $post_id ) {
    if ( ! $tpl_id || ! class_exists( '\Elementor\Plugin' ) || get_post_status( $tpl_id ) !== 'publish' ) {
        return false;
    }
    global $post;
    $prev_post = $post;
    $post      = get_post( $post_id );
    if ( ! $post ) {
        return false;
    }
    setup_postdata( $post );
    $html = \Elementor\Plugin::$instance->frontend->get_builder_content_for_display( (int) $tpl_id, true );
    wp_reset_postdata();
    $post = $prev_post;
    if ( $prev_post instanceof WP_Post ) {
        setup_postdata( $prev_post );
    }
    if ( empty( $html ) ) {
        return false;
    }
    echo $html;
    return true;
}

function iramo_render_product_card( $post_id ) {
    $title     = get_the_title( $post_id );
    $permalink = get_permalink( $post_id );
    $tagline   = get_post_meta( $post_id, '_iramo_tagline', true ) ?: wp_trim_words( wp_strip_all_tags( get_the_excerpt( $post_id ) ?: get_post_field( 'post_content', $post_id ) ), 18 );
    $price     = (int) get_post_meta( $post_id, '_iramo_price_toman', true );
    if ( ! $price && get_post_type( $post_id ) === 'product' && function_exists( 'wc_get_product' ) ) {
        $wc = wc_get_product( $post_id );
        if ( $wc && $wc->get_price() !== '' ) {
            $price = (int) $wc->get_price();
        }
    }
    $billing  = get_post_meta( $post_id, '_iramo_billing_label', true ) ?: 'لایسنس دائمی';
    $thumb    = get_the_post_thumbnail_url( $post_id, 'large' );
    $hl_raw   = get_post_meta( $post_id, '_iramo_highlights', true );
    $hl_list  = array_slice( array_values( array_filter( array_map( 'trim', explode( "\n", (string) $hl_raw ) ) ) ), 0, 3 );
    ?>
    <article class="iramo-card" style="padding:20px;display:flex;flex-direction:column;justify-content:space-between;gap:14px;">
        <div>
            <?php if ( $thumb ) : ?>
                <a href="<?php echo esc_url( $permalink ); ?>" style="display:block;border-radius:14px;overflow:hidden;margin-bottom:14px;aspect-ratio:16/9;">
                    <img src="<?php echo esc_url( $thumb ); ?>" alt="<?php echo esc_attr( $title ); ?>" loading="lazy" style="width:100%;height:100%;object-fit:cover;" />
                </a>
            <?php endif; ?>
            <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:8px;">
                <span class="iramo-badge"><?php echo esc_html( $billing ); ?></span>
            </div>
            <h3 style="margin:0 0 6px;font-size:18px;font-weight:800;line-height:1.4;">
                <a href="<?php echo esc_url( $permalink ); ?>"><?php echo esc_html( $title ); ?></a>
            </h3>
            <p style="margin:0 0 12px;font-size:13px;color:var(--iramo-muted);line-height:1.7;">
                <?php echo esc_html( $tagline ); ?>
            </p>
            <?php if ( ! empty( $hl_list ) ) : ?>
                <ul style="margin:0;padding:0;list-style:none;display:grid;gap:6px;font-size:12px;color:var(--iramo-muted);">
                    <?php foreach ( $hl_list as $item ) : ?>
                        <li style="display:flex;align-items:center;gap:6px;">
                            <span style="color:var(--iramo-primary);font-weight:900;">✓</span>
                            <span><?php echo esc_html( $item ); ?></span>
                        </li>
                    <?php endforeach; ?>
                </ul>
            <?php endif; ?>
        </div>
        <div style="display:flex;align-items:center;justify-content:space-between;gap:10px;padding-top:12px;border-top:1px solid var(--iramo-border-subtle);flex-wrap:wrap;">
            <a href="<?php echo esc_url( $permalink ); ?>" class="iramo-price-btn">
                <span class="price-label"><?php echo esc_html( $price > 0 ? iramo_format_toman( $price ) : 'مشاهده جزئیات' ); ?></span>
                <span>←</span>
            </a>
            <a href="<?php echo esc_url( $permalink ); ?>" style="font-size:12.5px;font-weight:700;color:var(--iramo-primary);">دمو و بررسی</a>
        </div>
    </article>
    <?php
}

function iramo_render_tool_card( $post_id ) {
    $title     = get_the_title( $post_id );
    $permalink = get_permalink( $post_id );
    $provider  = trim( (string) get_post_meta( $post_id, '_iramo_provider', true ) );
    $tagline   = get_post_meta( $post_id, '_iramo_tagline', true ) ?: wp_trim_words( wp_strip_all_tags( get_post_field( 'post_content', $post_id ) ), 16 );
    $task      = get_post_meta( $post_id, '_iramo_task', true ) ?: 'AI Assistant';
    $input     = get_post_meta( $post_id, '_iramo_input', true ) ?: 'Text';
    $output    = get_post_meta( $post_id, '_iramo_output', true ) ?: 'Text';
    $pricing   = get_post_meta( $post_id, '_iramo_pricing', true ) ?: 'Freemium';
    $tool_url  = trim( (string) get_post_meta( $post_id, '_iramo_url', true ) );
    $has_api   = get_post_meta( $post_id, '_iramo_has_api', true ) === '1';
    $verified  = get_post_meta( $post_id, '_iramo_verified', true ) === '1';
    $pop_raw   = trim( (string) get_post_meta( $post_id, '_iramo_popularity', true ) );
    ?>
    <article
        class="iramo-card iramo-tool-card"
        data-tool-item="1"
        data-title="<?php echo esc_attr( mb_strtolower( trim( $title . ' ' . $provider . ' ' . $tagline . ' ' . $task ) ) ); ?>"
        data-task="<?php echo esc_attr( $task ); ?>"
        data-input="<?php echo esc_attr( $input ); ?>"
        data-output="<?php echo esc_attr( $output ); ?>"
        data-pricing="<?php echo esc_attr( $pricing ); ?>"
    >
        <div>
            <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:10px;margin-bottom:10px;">
                <div style="min-width:0;">
                    <h3 style="margin:0;font-size:17px;font-weight:800;line-height:1.35;">
                        <a href="<?php echo esc_url( $permalink ); ?>"><?php echo esc_html( $title ); ?></a>
                    </h3>
                    <?php if ( $provider !== '' || $verified ) : ?>
                        <div style="font-size:12px;color:var(--iramo-subtle);margin-top:2px;">
                            <?php if ( $provider !== '' ) : ?><?php echo esc_html( $provider ); ?><?php endif; ?>
                            <?php if ( $verified ) : ?><?php echo $provider !== '' ? ' · ' : ''; ?><span style="color:var(--iramo-primary);font-weight:700;">تاییدشده ✓</span><?php endif; ?>
                        </div>
                    <?php endif; ?>
                </div>
                <span class="iramo-badge" style="flex-shrink:0;"><?php echo esc_html( $pricing ); ?></span>
            </div>

            <p style="margin:0 0 12px;font-size:13px;color:var(--iramo-muted);line-height:1.75;">
                <?php echo esc_html( $tagline ); ?>
            </p>

            <div class="iramo-tool-meta-row">
                <span class="iramo-meta-pill"><?php echo esc_html( $task ); ?></span>
                <span class="iramo-meta-pill"><?php echo esc_html( $input ); ?> ← <?php echo esc_html( $output ); ?></span>
                <?php if ( $has_api ) : ?><span class="iramo-meta-pill">API</span><?php endif; ?>
            </div>
        </div>

        <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;padding-top:12px;border-top:1px solid var(--iramo-border-subtle);">
            <a href="<?php echo esc_url( $permalink ); ?>" style="font-size:12.5px;font-weight:700;color:var(--iramo-primary);">بررسی، راهنما و پرامپت ←</a>
            <div style="display:flex;align-items:center;gap:8px;">
                <?php if ( $pop_raw !== '' ) : ?>
                    <span style="font-size:11.5px;font-weight:700;color:var(--iramo-subtle);">★ <?php echo esc_html( iramo_fa_digits( $pop_raw ) ); ?></span>
                <?php endif; ?>
                <?php if ( $tool_url !== '' ) : ?>
                    <a href="<?php echo esc_url( $tool_url ); ?>" target="_blank" rel="noopener noreferrer" class="iramo-btn iramo-btn-outline" style="padding:5px 10px;font-size:11.5px;border-radius:10px;">ورود به ابزار ↗</a>
                <?php endif; ?>
            </div>
        </div>
    </article>
    <?php
}

function iramo_render_course_card( $post_id ) {
    $title     = get_the_title( $post_id );
    $permalink = get_permalink( $post_id );
    $excerpt   = wp_strip_all_tags( get_the_excerpt( $post_id ) ?: wp_trim_words( get_post_field( 'post_content', $post_id ), 20 ) );
    $hours     = (int) ( get_post_meta( $post_id, '_iramo_duration_hours', true ) ?: 12 );
    $price     = (int) ( get_post_meta( $post_id, '_iramo_price_toman', true ) ?: 2900000 );
    $thumb     = get_the_post_thumbnail_url( $post_id, 'large' ) ?: iramo_get_theme_image( 'course_ai_mastery_1794737810266.jpg' );
    ?>
    <article class="iramo-card" style="padding:18px;display:flex;flex-direction:column;justify-content:space-between;gap:14px;">
        <div>
            <a href="<?php echo esc_url( $permalink ); ?>" style="display:block;border-radius:14px;overflow:hidden;margin-bottom:12px;aspect-ratio:16/9;">
                <img src="<?php echo esc_url( $thumb ); ?>" alt="<?php echo esc_attr( $title ); ?>" loading="lazy" style="width:100%;height:100%;object-fit:cover;" />
            </a>
            <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:8px;">
                <span class="iramo-badge">دوره آکادمی</span>
                <span style="font-size:12px;color:var(--iramo-subtle);font-weight:700;"><?php echo esc_html( iramo_fa_digits( $hours ) ); ?> ساعت</span>
            </div>
            <h3 style="margin:0 0 6px;font-size:17px;font-weight:800;line-height:1.4;">
                <a href="<?php echo esc_url( $permalink ); ?>"><?php echo esc_html( $title ); ?></a>
            </h3>
            <p style="margin:0;font-size:13px;color:var(--iramo-muted);line-height:1.7;">
                <?php echo esc_html( $excerpt ); ?>
            </p>
        </div>
        <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;padding-top:12px;border-top:1px solid var(--iramo-border-subtle);">
            <a href="<?php echo esc_url( $permalink ); ?>" class="iramo-price-btn iramo-price-btn-green">
                <span class="price-label"><?php echo esc_html( iramo_format_toman( $price ) ); ?></span>
                <span>←</span>
            </a>
            <a href="<?php echo esc_url( $permalink ); ?>" style="font-size:12px;font-weight:700;color:var(--iramo-primary);">مشاهده دوره ←</a>
        </div>
    </article>
    <?php
}

function iramo_render_article_card( $post_id ) {
    $title     = get_the_title( $post_id );
    $permalink = get_permalink( $post_id );
    $excerpt   = wp_strip_all_tags( get_the_excerpt( $post_id ) ?: wp_trim_words( get_post_field( 'post_content', $post_id ), 22 ) );
    $thumb     = get_the_post_thumbnail_url( $post_id, 'large' );
    $date_str  = get_the_date( 'j F Y', $post_id );
    ?>
    <article class="iramo-card" style="padding:18px;display:flex;flex-direction:column;justify-content:space-between;gap:12px;">
        <div>
            <?php if ( $thumb ) : ?>
                <a href="<?php echo esc_url( $permalink ); ?>" style="display:block;border-radius:14px;overflow:hidden;margin-bottom:12px;aspect-ratio:16/9;">
                    <img src="<?php echo esc_url( $thumb ); ?>" alt="<?php echo esc_attr( $title ); ?>" loading="lazy" style="width:100%;height:100%;object-fit:cover;" />
                </a>
            <?php endif; ?>
            <div style="font-size:11.5px;color:var(--iramo-subtle);margin-bottom:6px;"><?php echo esc_html( iramo_fa_digits( $date_str ) ); ?></div>
            <h3 style="margin:0 0 8px;font-size:16.5px;font-weight:800;line-height:1.45;">
                <a href="<?php echo esc_url( $permalink ); ?>"><?php echo esc_html( $title ); ?></a>
            </h3>
            <p style="margin:0;font-size:13px;color:var(--iramo-muted);line-height:1.75;"><?php echo esc_html( $excerpt ); ?></p>
        </div>
        <div style="padding-top:10px;border-top:1px solid var(--iramo-border-subtle);">
            <a href="<?php echo esc_url( $permalink ); ?>" style="font-size:12.5px;font-weight:700;color:var(--iramo-primary);">مطالعه کامل مقاله ←</a>
        </div>
    </article>
    <?php
}
