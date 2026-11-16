export const WP_PLUGIN_CORE_PHP = `<?php
/**
 * Plugin Name: iRamoAi Suite (LMS, AI Tools, Articles & Elementor Pro)
 * Plugin URI:  https://iramo.ai
 * Description: Complete WordPress plugin for iRamoAi: Full App & User Panel Shortcodes, Native Elementor Pro Widgets, WooCommerce Auto-Enrollment, Telegram/Bale Bot Bridge & Demo Data Manager.
 * Version:     2.1.0
 * Author:      iRamoAi Engineering
 * Text Domain: iramo-ai
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

define( 'IRAMO_AI_VERSION', '2.0.0' );
define( 'IRAMO_AI_PATH', plugin_dir_path( __FILE__ ) );
define( 'IRAMO_AI_URL', plugin_dir_url( __FILE__ ) );

// Load modular includes
if ( file_exists( IRAMO_AI_PATH . 'includes/admin-settings.php' ) ) {
    require_once IRAMO_AI_PATH . 'includes/admin-settings.php';
}
if ( file_exists( IRAMO_AI_PATH . 'includes/bot-bridge.php' ) ) {
    require_once IRAMO_AI_PATH . 'includes/bot-bridge.php';
}
if ( file_exists( IRAMO_AI_PATH . 'includes/elementor-widgets.php' ) ) {
    require_once IRAMO_AI_PATH . 'includes/elementor-widgets.php';
}

/**
 * 1. Register Custom Post Types: Courses, AI Tools, Articles & Products
 */
add_action( 'init', function() {
    register_post_type( 'iramo_course', [
        'labels' => [
            'name'          => __( 'دوره‌های آموزشی iRamo', 'iramo-ai' ),
            'singular_name' => __( 'دوره آموزشی', 'iramo-ai' ),
            'add_new_item'  => __( 'افزودن دوره جدید', 'iramo-ai' ),
        ],
        'public'       => true,
        'show_in_rest' => true,
        'menu_icon'    => 'dashicons-welcome-learn-more',
        'supports'     => [ 'title', 'editor', 'thumbnail', 'excerpt', 'custom-fields' ],
        'has_archive'  => true,
        'rewrite'      => [ 'slug' => 'academy' ],
    ] );

    register_post_type( 'iramo_ai_tool', [
        'labels' => [
            'name'          => __( 'ابزارهای هوش مصنوعی', 'iramo-ai' ),
            'singular_name' => __( 'ابزار AI', 'iramo-ai' ),
        ],
        'public'       => true,
        'show_in_rest' => true,
        'menu_icon'    => 'dashicons-superhero-alt',
        'supports'     => [ 'title', 'editor', 'thumbnail', 'custom-fields' ],
    ] );

    register_post_type( 'iramo_article', [
        'labels' => [
            'name'          => __( 'مقالات تخصصی iRamo', 'iramo-ai' ),
            'singular_name' => __( 'مقاله', 'iramo-ai' ),
        ],
        'public'       => true,
        'show_in_rest' => true,
        'menu_icon'    => 'dashicons-media-document',
        'supports'     => [ 'title', 'editor', 'thumbnail', 'excerpt', 'author', 'custom-fields' ],
        'has_archive'  => true,
        'rewrite'      => [ 'slug' => 'articles' ],
    ] );

    register_taxonomy( 'iramo_tool_task', 'iramo_ai_tool', [
        'label'        => __( 'نوع کار (Task)', 'iramo-ai' ),
        'show_in_rest' => true,
        'hierarchical' => true,
    ] );
} );

/**
 * 2. WooCommerce Order Completed -> Auto Enroll Student & Trigger Bot Bridge
 */
add_action( 'woocommerce_order_status_completed', function( $order_id ) {
    if ( ! function_exists( 'wc_get_order' ) ) return;
    $order = wc_get_order( $order_id );
    if ( ! $order ) return;

    $user_id = $order->get_user_id();
    if ( ! $user_id ) return;

    $enrolled = get_user_meta( $user_id, '_iramo_enrolled_courses', true );
    if ( ! is_array( $enrolled ) ) $enrolled = [];

    foreach ( $order->get_items() as $item ) {
        $product_id = $item->get_product_id();
        $linked_course_id = get_post_meta( $product_id, '_iramo_linked_course_id', true );
        if ( $linked_course_id && ! in_array( (int) $linked_course_id, $enrolled, true ) ) {
            $enrolled[] = (int) $linked_course_id;
        }
    }

    update_user_meta( $user_id, '_iramo_enrolled_courses', $enrolled );
    do_action( 'iramo_lms_order_delivered', $order_id, $user_id, $enrolled );
} );

/**
 * 3. REST API for Progress Tracking, Site Config & Demo Data
 */
add_action( 'rest_api_init', function() {
    register_rest_route( 'iramo/v1', '/progress', [
        'methods'             => 'POST',
        'permission_callback' => function() { return is_user_logged_in(); },
        'callback'            => function( WP_REST_Request $request ) {
            $user_id   = get_current_user_id();
            $lesson_id = sanitize_text_field( $request->get_param( 'lesson_id' ) );
            $completed = (bool) $request->get_param( 'completed' );

            $progress = get_user_meta( $user_id, '_iramo_completed_lessons', true );
            if ( ! is_array( $progress ) ) $progress = [];

            if ( $completed ) {
                $progress[ $lesson_id ] = current_time( 'mysql' );
            } else {
                unset( $progress[ $lesson_id ] );
            }
            update_user_meta( $user_id, '_iramo_completed_lessons', $progress );

            return rest_ensure_response( [
                'success'   => true,
                'completed' => array_keys( $progress ),
            ] );
        },
    ] );
} );

/**
 * 4. Shortcode [iramo_lms] & [iramo_site]
 */
function iramo_render_app_shortcode( $atts ) {
    $options = get_option( 'iramo_ai_settings', [] );
    $atts = shortcode_atts( [
        'theme' => $options['default_theme'] ?? 'light',
        'lang'  => is_rtl() ? 'fa' : 'en',
        'view'  => 'home',
    ], $atts, 'iramo_lms' );

    $current_user = wp_get_current_user();
    $user_payload = is_user_logged_in() ? [
        'id'        => $current_user->ID,
        'name'      => $current_user->display_name,
        'email'     => $current_user->user_email,
        'enrolled'  => get_user_meta( $current_user->ID, '_iramo_enrolled_courses', true ) ?: [],
        'completed' => array_keys( get_user_meta( $current_user->ID, '_iramo_completed_lessons', true ) ?: [] ),
        'nonce'     => wp_create_nonce( 'wp_rest' ),
        'restUrl'   => esc_url_raw( rest_url( 'iramo/v1/' ) ),
    ] : null;

    $font_choice = $options['font_family'] ?? 'vazirmatn';
    $font_urls = [
        'vazirmatn'   => 'https://fonts.googleapis.com/css2?family=Vazirmatn:wght@400;500;600;700;800&display=swap',
        'rubik'       => 'https://fonts.googleapis.com/css2?family=Rubik:wght@400;500;600;700;800&display=swap',
        'readex'      => 'https://fonts.googleapis.com/css2?family=Readex+Pro:wght@400;500;600;700&display=swap',
        'noto-arabic' => 'https://fonts.googleapis.com/css2?family=Noto+Sans+Arabic:wght@400;500;600;700;800&display=swap',
    ];
    if ( $font_choice === 'custom' && ! empty( $options['custom_font_css_url'] ) ) {
        wp_enqueue_style( 'iramo-custom-font', esc_url_raw( $options['custom_font_css_url'] ), [], null );
    } elseif ( isset( $font_urls[ $font_choice ] ) ) {
        wp_enqueue_style( 'iramo-active-font', $font_urls[ $font_choice ], [], null );
    }

    if ( file_exists( IRAMO_AI_PATH . 'assets/iramo-lms.js' ) ) {
        wp_enqueue_script( 'iramo-ai-bundle', IRAMO_AI_URL . 'assets/iramo-lms.js', [], IRAMO_AI_VERSION, true );
    }
    if ( file_exists( IRAMO_AI_PATH . 'assets/iramo-lms.css' ) ) {
        wp_enqueue_style( 'iramo-ai-styles', IRAMO_AI_URL . 'assets/iramo-lms.css', [], IRAMO_AI_VERSION );
    }

    $auth_config = [
        'telegram'            => ! isset( $options['enable_telegram_auth'] ) || ! empty( $options['enable_telegram_auth'] ),
        'bale'                => ! isset( $options['enable_bale_auth'] ) || ! empty( $options['enable_bale_auth'] ),
        'sms'                 => ! isset( $options['enable_sms_auth'] ) || ! empty( $options['enable_sms_auth'] ),
        'email'               => ! isset( $options['enable_email_auth'] ) || ! empty( $options['enable_email_auth'] ),
        'defaultChannel'      => $options['default_auth_channel'] ?? 'telegram',
        'allowRegistration'   => ! isset( $options['allow_registration'] ) || ! empty( $options['allow_registration'] ),
        'telegramBotUsername' => $options['telegram_bot_username'] ?? '@iRamoBot',
        'baleBotUsername'     => $options['bale_bot_username'] ?? '@iRamoBaleBot',
        'smsProvider'         => $options['sms_provider'] ?? 'kavenegar',
        'smsPatternCode'      => $options['sms_pattern_code'] ?? 'iramo-verify-otp',
    ];

    $raw_tips = array_filter( array_map( 'trim', explode( "\\n", $options['quick_tips_text'] ?? '' ) ) );
    $quick_tips = [];
    foreach ( $raw_tips as $idx => $line ) {
        $quick_tips[] = [
            'id' => 'wp-tip-' . ( $idx + 1 ),
            'fa' => $line,
            'en' => $line,
        ];
    }

    $color_config = [
        'preset'          => $options['color_preset'] ?? 'emerald-classic',
        'primaryHex'      => $options['primary_color'] ?? '#059669',
        'accentHex'       => $options['accent_color'] ?? '#FFBA00',
        'lightCanvasHex'  => $options['light_canvas_color'] ?? '#F8FAFC',
        'borderIntensity' => $options['border_intensity'] ?? 'subtle',
    ];

    ob_start();
    ?>
    <div
      id="iramo-lms-root"
      data-theme="<?php echo esc_attr( $atts['theme'] ); ?>"
      data-lang="<?php echo esc_attr( $atts['lang'] ); ?>"
      data-view="<?php echo esc_attr( $atts['view'] ); ?>"
      data-font="<?php echo esc_attr( $font_choice ); ?>"
      data-custom-font="<?php echo esc_attr( $options['custom_font_name'] ?? '' ); ?>"
      data-brand-name="<?php echo esc_attr( $options['brand_name'] ?? 'iRamoAi' ); ?>"
      data-color-config="<?php echo esc_attr( wp_json_encode( $color_config ) ); ?>"
      data-auth-config="<?php echo esc_attr( wp_json_encode( $auth_config ) ); ?>"
      data-quick-tips="<?php echo esc_attr( wp_json_encode( $quick_tips ) ); ?>"
      data-demo-cleared="<?php echo ! empty( $options['demo_cleared'] ) ? '1' : '0'; ?>"
      data-plugin-url="<?php echo esc_url( IRAMO_AI_URL ); ?>"
      data-user="<?php echo esc_attr( wp_json_encode( $user_payload ) ); ?>"
      style="min-height: 100vh; width: 100%;"
    ></div>
    <?php
    return ob_get_clean();
}
add_shortcode( 'iramo_lms', 'iramo_render_app_shortcode' );
add_shortcode( 'iramo_site', 'iramo_render_app_shortcode' );
`;

export const WP_ADMIN_SETTINGS_PHP = `<?php
/**
 * Module: iRamoAi Full WordPress Admin Control Panel & Demo Data Cleaner
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

add_action( 'admin_menu', function() {
    add_menu_page(
        __( 'تنظیمات iRamoAi', 'iramo-ai' ),
        __( 'تنظیمات iRamoAi', 'iramo-ai' ),
        'manage_options',
        'iramo-ai-control',
        'iramo_render_admin_control_page',
        'dashicons-superhero-alt',
        3
    );
} );

add_action( 'admin_init', function() {
    register_setting( 'iramo_ai_settings_group', 'iramo_ai_settings' );
    register_setting( 'iramo_ai_settings_group', 'iramo_telegram_bot_token' );
    register_setting( 'iramo_ai_settings_group', 'iramo_bale_bot_token' );
    register_setting( 'iramo_ai_settings_group', 'iramo_admin_chat_id' );
} );

// Handle One-Click Demo Data Purge or Install
add_action( 'admin_post_iramo_manage_demo_data', function() {
    if ( ! current_user_can( 'manage_options' ) ) wp_die( 'Unauthorized' );
    check_admin_referer( 'iramo_demo_nonce' );

    $action_type = sanitize_text_field( $_POST['demo_action'] ?? '' );
    $post_types  = [ 'iramo_course', 'iramo_ai_tool', 'iramo_article' ];

    if ( $action_type === 'purge_demo' ) {
        $demo_posts = get_posts( [
            'post_type'      => $post_types,
            'posts_per_page' => -1,
            'meta_key'       => '_iramo_is_demo',
            'meta_value'     => '1',
            'fields'         => 'ids',
        ] );
        foreach ( $demo_posts as $pid ) {
            wp_delete_post( $pid, true );
        }
        $opts = get_option( 'iramo_ai_settings', [] );
        $opts['demo_cleared'] = 1;
        update_option( 'iramo_ai_settings', $opts );
        wp_redirect( admin_url( 'admin.php?page=iramo-ai-control&demo_status=purged' ) );
        exit;
    }

    if ( $action_type === 'install_demo' ) {
        $samples = [
            [ 'post_type' => 'iramo_course', 'title' => 'دوره جامع هوش مصنوعی از صفر تا پیشرفته' ],
            [ 'post_type' => 'iramo_course', 'title' => 'ساخت ربات آموزشی و فروش تلگرام و بله' ],
            [ 'post_type' => 'iramo_article', 'title' => 'معماری اتصال ربات تلگرام و بله به ووکامرس' ],
            [ 'post_type' => 'iramo_ai_tool', 'title' => 'موتور حسابیار هوشمند OCR' ],
        ];
        foreach ( $samples as $item ) {
            $id = wp_insert_post( [
                'post_type'   => $item['post_type'],
                'post_title'  => $item['title'],
                'post_status' => 'publish',
            ] );
            if ( $id ) {
                update_post_meta( $id, '_iramo_is_demo', '1' );
            }
        }
        $opts = get_option( 'iramo_ai_settings', [] );
        $opts['demo_cleared'] = 0;
        update_option( 'iramo_ai_settings', $opts );
        wp_redirect( admin_url( 'admin.php?page=iramo-ai-control&demo_status=installed' ) );
        exit;
    }
} );

function iramo_render_admin_control_page() {
    $opts = get_option( 'iramo_ai_settings', [] );
    $status = sanitize_text_field( $_GET['demo_status'] ?? '' );
    ?>
    <div class="wrap" dir="rtl" style="max-width: 900px; font-family: Tahoma, sans-serif;">
        <h1>پنل کنترل کامل قالب و افزونه iRamoAi</h1>
        <?php if ( $status === 'purged' ) : ?>
            <div class="notice notice-success is-dismissible"><p>تمام داده‌های نمونه (دوره‌ها، مقالات، نکات سریع روز و ابزارهای پیش‌فرض) با موفقیت پاکسازی شدند.</p></div>
        <?php elseif ( $status === 'installed' ) : ?>
            <div class="notice notice-success is-dismissible"><p>داده‌های نمونه مجدداً نصب شدند.</p></div>
        <?php endif; ?>

        <form method="post" action="options.php" style="background:#fff;padding:24px;border-radius:12px;border:1px solid #dcdcde;margin-top:20px;">
            <?php settings_fields( 'iramo_ai_settings_group' ); ?>
            <h2>تنظیمات عمومی، فونت و ظاهر سایت</h2>
            <table class="form-table">
                <tr>
                    <th>نام برند سایت</th>
                    <td><input type="text" name="iramo_ai_settings[brand_name]" value="<?php echo esc_attr( $opts['brand_name'] ?? 'iRamoAi' ); ?>" class="regular-text" /></td>
                </tr>
                <tr>
                    <th>حالت پیش‌فرض سایت و پنل کاربری</th>
                    <td>
                        <select name="iramo_ai_settings[default_theme]">
                            <option value="light" <?php selected( $opts['default_theme'] ?? 'light', 'light' ); ?>>روشن مدرن (Modern Light)</option>
                            <option value="dark" <?php selected( $opts['default_theme'] ?? 'light', 'dark' ); ?>>تیره زمردی (Dark Emerald)</option>
                        </select>
                    </td>
                </tr>
                <tr>
                    <th>فونت فارسی سایت و افزونه</th>
                    <td>
                        <select name="iramo_ai_settings[font_family]">
                            <option value="vazirmatn" <?php selected( $opts['font_family'] ?? 'vazirmatn', 'vazirmatn' ); ?>>وزیرمتن (Vazirmatn)</option>
                            <option value="rubik" <?php selected( $opts['font_family'] ?? 'vazirmatn', 'rubik' ); ?>>روبیک (Rubik)</option>
                            <option value="readex" <?php selected( $opts['font_family'] ?? 'vazirmatn', 'readex' ); ?>>ریدکس پرو (Readex Pro)</option>
                            <option value="noto-arabic" <?php selected( $opts['font_family'] ?? 'vazirmatn', 'noto-arabic' ); ?>>نوتو سنس فارسی (Noto Sans Arabic)</option>
                            <option value="custom" <?php selected( $opts['font_family'] ?? 'vazirmatn', 'custom' ); ?>>فونت اختصاصی آپلودشده (ایران‌سنس / یکان‌بخ / پیدا)</option>
                        </select>
                    </td>
                </tr>
                <tr>
                    <th>نام فونت اختصاصی (Font Family)</th>
                    <td>
                        <input type="text" dir="ltr" name="iramo_ai_settings[custom_font_name]" value="<?php echo esc_attr( $opts['custom_font_name'] ?? '' ); ?>" class="regular-text" placeholder="IRANSansX" />
                        <p class="description">در صورت انتخاب فونت اختصاصی، نام font-family را اینجا بنویسید.</p>
                    </td>
                </tr>
                <tr>
                    <th>آدرس فایل CSS فونت اختصاصی</th>
                    <td>
                        <input type="url" dir="ltr" name="iramo_ai_settings[custom_font_css_url]" value="<?php echo esc_attr( $opts['custom_font_css_url'] ?? '' ); ?>" class="regular-text" placeholder="https://yourdomain.ir/wp-content/uploads/fonts/fontface.css" />
                    </td>
                </tr>
                <tr>
                    <th>پالت رنگ‌بندی سایت (قاعده ۶۰-۳۰-۱۰)</th>
                    <td>
                        <select name="iramo_ai_settings[color_preset]">
                            <option value="emerald-classic" <?php selected( $opts['color_preset'] ?? 'emerald-classic', 'emerald-classic' ); ?>>نسخه اول روشن (زمردی و طلایی مینیمال)</option>
                            <option value="logo-blue" <?php selected( $opts['color_preset'] ?? 'emerald-classic', 'logo-blue' ); ?>>آبی لوگو iRamoAi (یکدست)</option>
                            <option value="royal-slate" <?php selected( $opts['color_preset'] ?? 'emerald-classic', 'royal-slate' ); ?>>آبی لاجوردی و فیروزه‌ای</option>
                            <option value="teal-indigo" <?php selected( $opts['color_preset'] ?? 'emerald-classic', 'teal-indigo' ); ?>>تیل مدرن و نیلی ملایم</option>
                            <option value="custom" <?php selected( $opts['color_preset'] ?? 'emerald-classic', 'custom' ); ?>>رنگ دلخواه سفارشی</option>
                        </select>
                    </td>
                </tr>
                <tr>
                    <th>رنگ اصلی و رنگ دکمه‌های اقدام (Hex)</th>
                    <td>
                        <label style="margin-left:14px;">اصلی (Primary): <input type="color" name="iramo_ai_settings[primary_color]" value="<?php echo esc_attr( $opts['primary_color'] ?? '#059669' ); ?>" /></label>
                        <label style="margin-left:14px;">تاکیدی دکمه‌ها (Accent): <input type="color" name="iramo_ai_settings[accent_color]" value="<?php echo esc_attr( $opts['accent_color'] ?? '#FFBA00' ); ?>" /></label>
                        <label>شدت حاشیه کارت‌ها:
                            <select name="iramo_ai_settings[border_intensity]">
                                <option value="subtle" <?php selected( $opts['border_intensity'] ?? 'subtle', 'subtle' ); ?>>بسیار ملایم و ظریف</option>
                                <option value="balanced" <?php selected( $opts['border_intensity'] ?? 'subtle', 'balanced' ); ?>>متعادل</option>
                                <option value="defined" <?php selected( $opts['border_intensity'] ?? 'subtle', 'defined' ); ?>>مشخص‌تر</option>
                            </select>
                        </label>
                    </td>
                </tr>
            </table>

            <hr style="margin:24px 0;" />
            <h2>مدیریت ورود کاربران، ربات‌ها و پنل پیامکی (OTP)</h2>
            <table class="form-table">
                <tr>
                    <th>روش‌های ورود فعال در پنل</th>
                    <td>
                        <label style="display:inline-block;margin-left:16px;"><input type="checkbox" name="iramo_ai_settings[enable_telegram_auth]" value="1" <?php checked( ! isset( $opts['enable_telegram_auth'] ) || ! empty( $opts['enable_telegram_auth'] ) ); ?> /> ورود با ربات تلگرام</label>
                        <label style="display:inline-block;margin-left:16px;"><input type="checkbox" name="iramo_ai_settings[enable_bale_auth]" value="1" <?php checked( ! isset( $opts['enable_bale_auth'] ) || ! empty( $opts['enable_bale_auth'] ) ); ?> /> ورود با ربات بله</label>
                        <label style="display:inline-block;margin-left:16px;"><input type="checkbox" name="iramo_ai_settings[enable_sms_auth]" value="1" <?php checked( ! isset( $opts['enable_sms_auth'] ) || ! empty( $opts['enable_sms_auth'] ) ); ?> /> ورود با پنل پیامکی (SMS)</label>
                        <label style="display:inline-block;"><input type="checkbox" name="iramo_ai_settings[enable_email_auth]" value="1" <?php checked( ! isset( $opts['enable_email_auth'] ) || ! empty( $opts['enable_email_auth'] ) ); ?> /> ورود با ایمیل و رمز</label>
                    </td>
                </tr>
                <tr>
                    <th>روش ورود پیش‌فرض و مجوز ثبت‌نام</th>
                    <td>
                        <select name="iramo_ai_settings[default_auth_channel]" style="margin-left:16px;">
                            <option value="telegram" <?php selected( $opts['default_auth_channel'] ?? 'telegram', 'telegram' ); ?>>تلگرام (Telegram)</option>
                            <option value="bale" <?php selected( $opts['default_auth_channel'] ?? 'telegram', 'bale' ); ?>>پیام‌رسان بله (Bale)</option>
                            <option value="sms" <?php selected( $opts['default_auth_channel'] ?? 'telegram', 'sms' ); ?>>پیامک (SMS)</option>
                            <option value="email" <?php selected( $opts['default_auth_channel'] ?? 'telegram', 'email' ); ?>>ایمیل و رمز</option>
                        </select>
                        <label><input type="checkbox" name="iramo_ai_settings[allow_registration]" value="1" <?php checked( ! isset( $opts['allow_registration'] ) || ! empty( $opts['allow_registration'] ) ); ?> /> فعال بودن تب «ایجاد حساب جدید» برای کاربران تازه</label>
                    </td>
                </tr>
                <tr>
                    <th>نکات سریع روز (ابزارک صفحه مقالات)</th>
                    <td>
                        <textarea name="iramo_ai_settings[quick_tips_text]" rows="3" class="large-text" placeholder="هر خط را به عنوان یک نکته سریع روز بنویسید..."><?php echo esc_textarea( $opts['quick_tips_text'] ?? '' ); ?></textarea>
                        <p class="description">هر خط در این کادر مستقیماً در ابزارک «نکته سریع روز» صفحه مقالات نمایش داده می‌شود.</p>
                    </td>
                </tr>
                <tr>
                    <th>یوزرنیم و توکن ربات تلگرام</th>
                    <td>
                        <input type="text" dir="ltr" name="iramo_ai_settings[telegram_bot_username]" value="<?php echo esc_attr( $opts['telegram_bot_username'] ?? '@iRamoBot' ); ?>" placeholder="@iRamoBot" style="width:160px;margin-left:8px;" />
                        <input type="text" dir="ltr" name="iramo_telegram_bot_token" value="<?php echo esc_attr( get_option( 'iramo_telegram_bot_token' ) ); ?>" class="regular-text" placeholder="123456:ABC..." />
                    </td>
                </tr>
                <tr>
                    <th>یوزرنیم و توکن ربات بله (Bale)</th>
                    <td>
                        <input type="text" dir="ltr" name="iramo_ai_settings[bale_bot_username]" value="<?php echo esc_attr( $opts['bale_bot_username'] ?? '@iRamoBaleBot' ); ?>" placeholder="@iRamoBaleBot" style="width:160px;margin-left:8px;" />
                        <input type="text" dir="ltr" name="iramo_bale_bot_token" value="<?php echo esc_attr( get_option( 'iramo_bale_bot_token' ) ); ?>" class="regular-text" placeholder="987654:XYZ..." />
                    </td>
                </tr>
                <tr>
                    <th>چت آیدی مدیر (Admin Chat ID)</th>
                    <td><input type="text" dir="ltr" name="iramo_admin_chat_id" value="<?php echo esc_attr( get_option( 'iramo_admin_chat_id' ) ); ?>" class="regular-text" /></td>
                </tr>
                <tr>
                    <th>درگاه پنل پیامکی (SMS Gateway)</th>
                    <td>
                        <select name="iramo_ai_settings[sms_provider]">
                            <option value="kavenegar" <?php selected( $opts['sms_provider'] ?? 'kavenegar', 'kavenegar' ); ?>>کاوه‌نگار (Kavenegar)</option>
                            <option value="melipayamak" <?php selected( $opts['sms_provider'] ?? 'kavenegar', 'melipayamak' ); ?>>ملی‌پیامک (Melipayamak)</option>
                            <option value="faraz" <?php selected( $opts['sms_provider'] ?? 'kavenegar', 'faraz' ); ?>>فراز اس‌ام‌اس (FarazSMS)</option>
                            <option value="custom" <?php selected( $opts['sms_provider'] ?? 'kavenegar', 'custom' ); ?>>وب‌سرویس اختصاصی (Webhook)</option>
                        </select>
                    </td>
                </tr>
                <tr>
                    <th>کلید API پنل پیامکی</th>
                    <td><input type="text" dir="ltr" name="iramo_ai_settings[sms_api_key]" value="<?php echo esc_attr( $opts['sms_api_key'] ?? '' ); ?>" class="regular-text" placeholder="API Key..." /></td>
                </tr>
                <tr>
                    <th>کد پترن (Pattern) و سرشماره ارسال</th>
                    <td>
                        <input type="text" dir="ltr" name="iramo_ai_settings[sms_pattern_code]" value="<?php echo esc_attr( $opts['sms_pattern_code'] ?? 'iramo-verify-otp' ); ?>" placeholder="Pattern Code" style="width:200px;margin-left:8px;" />
                        <input type="text" dir="ltr" name="iramo_ai_settings[sms_sender]" value="<?php echo esc_attr( $opts['sms_sender'] ?? '' ); ?>" placeholder="3000..." style="width:160px;" />
                    </td>
                </tr>
            </table>
            <?php submit_button( 'ذخیره تنظیمات سایت، فونت و درگاه‌های ورود' ); ?>
        </form>

        <div style="background:#fff;padding:24px;border-radius:12px;border:1px solid #dcdcde;margin-top:20px;">
            <h2>مدیریت و پاکسازی داده‌های نمونه (Demo Data)</h2>
            <p>در هر زمان می‌توانید تمام دوره‌ها، مقالات و ابزارهای نمونه اولیه را با یک کلیک حذف کنید تا سایت برای محتوای اختصاصی شما آماده شود.</p>
            <div style="display:flex;gap:12px;margin-top:14px;">
                <form method="post" action="<?php echo esc_url( admin_url( 'admin-post.php' ) ); ?>">
                    <?php wp_nonce_field( 'iramo_demo_nonce' ); ?>
                    <input type="hidden" name="action" value="iramo_manage_demo_data" />
                    <input type="hidden" name="demo_action" value="purge_demo" />
                    <button type="submit" class="button button-secondary" style="color:#b91c1c;border-color:#fca5a5;">پاکسازی کامل داده‌های نمونه</button>
                </form>
                <form method="post" action="<?php echo esc_url( admin_url( 'admin-post.php' ) ); ?>">
                    <?php wp_nonce_field( 'iramo_demo_nonce' ); ?>
                    <input type="hidden" name="action" value="iramo_manage_demo_data" />
                    <input type="hidden" name="demo_action" value="install_demo" />
                    <button type="submit" class="button button-primary">نصب داده‌های نمونه</button>
                </form>
            </div>
        </div>
    </div>
    <?php
}
`;

export const WP_ELEMENTOR_WIDGETS_PHP = `<?php
/**
 * Module: Native Elementor & Elementor Pro Widgets for iRamoAi
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

add_action( 'elementor/elements/categories_registered', function( $elements_manager ) {
    $elements_manager->add_category( 'iramo-ai', [
        'title' => __( 'ابزارک‌های iRamoAi', 'iramo-ai' ),
        'icon'  => 'eicon-graduation-cap',
    ] );
} );

add_action( 'elementor/widgets/register', function( $widgets_manager ) {
    if ( ! class_exists( '\\Elementor\\Widget_Base' ) ) {
        return;
    }

    // Widget 1: Full Portal / Dashboard Widget
    class iRamo_Elementor_App_Widget extends \\Elementor\\Widget_Base {
        public function get_name() { return 'iramo_lms_dashboard'; }
        public function get_title() { return __( 'اپلیکیشن و پنل کاربری iRamoAi', 'iramo-ai' ); }
        public function get_icon() { return 'eicon-apps'; }
        public function get_categories() { return [ 'iramo-ai' ]; }

        protected function register_controls() {
            $this->start_controls_section( 'section_config', [
                'label' => __( 'تنظیمات نمایش', 'iramo-ai' ),
            ] );

            $this->add_control( 'default_view', [
                'label'   => __( 'صفحه شروع', 'iramo-ai' ),
                'type'    => \\Elementor\\Controls_Manager::SELECT,
                'default' => 'home',
                'options' => [
                    'home'           => __( 'صفحه اصلی کامل سایت', 'iramo-ai' ),
                    'products'       => __( 'ویترین محصولات و دمو', 'iramo-ai' ),
                    'ai-marketplace' => __( 'ابزارهای هوش مصنوعی', 'iramo-ai' ),
                    'articles'       => __( 'مقالات و ابزارک‌ها', 'iramo-ai' ),
                    'course'         => __( 'کتابخانه دوره‌ها', 'iramo-ai' ),
                ],
            ] );

            $this->add_control( 'default_theme', [
                'label'   => __( 'تم سایت و پنل کاربری', 'iramo-ai' ),
                'type'    => \\Elementor\\Controls_Manager::SELECT,
                'default' => 'light',
                'options' => [
                    'light' => __( 'روشن مدرن (Modern Light)', 'iramo-ai' ),
                    'dark'  => __( 'سبز زمردی تیره', 'iramo-ai' ),
                ],
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

    // Widget 2: Native WordPress Articles & Widgets Grid for Elementor
    class iRamo_Elementor_Articles_Widget extends \\Elementor\\Widget_Base {
        public function get_name() { return 'iramo_articles_grid'; }
        public function get_title() { return __( 'گرید مقالات و ابزارک‌ها (iRamo)', 'iramo-ai' ); }
        public function get_icon() { return 'eicon-posts-grid'; }
        public function get_categories() { return [ 'iramo-ai' ]; }

        protected function register_controls() {
            $this->start_controls_section( 'section_articles', [
                'label' => __( 'تنظیمات مقالات', 'iramo-ai' ),
            ] );
            $this->add_control( 'posts_count', [
                'label'   => __( 'تعداد مقالات', 'iramo-ai' ),
                'type'    => \\Elementor\\Controls_Manager::NUMBER,
                'default' => 6,
                'min'     => 1,
                'max'     => 12,
            ] );
            $this->end_controls_section();
        }

        protected function render() {
            $s = $this->get_settings_for_display();
            $query = new \\WP_Query( [
                'post_type'      => [ 'iramo_article', 'post' ],
                'posts_per_page' => (int) ( $s['posts_count'] ?? 6 ),
            ] );
            echo '<div class="iramo-articles-elementor-grid" dir="rtl" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:20px;">';
            if ( $query->have_posts() ) {
                while ( $query->have_posts() ) {
                    $query->the_post();
                    echo '<article style="background:#0B1613;border:1px solid rgba(16,185,129,0.2);border-radius:16px;padding:18px;color:#fff;">';
                    echo '<h3 style="margin:0 0 8px;font-size:16px;"><a href="' . esc_url( get_permalink() ) . '" style="color:#fff;text-decoration:none;">' . esc_html( get_the_title() ) . '</a></h3>';
                    echo '<p style="font-size:13px;color:#94a3b8;margin:0 0 12px;">' . esc_html( get_the_excerpt() ) . '</p>';
                    echo '<a href="' . esc_url( get_permalink() ) . '" style="color:#FFBA00;font-size:12px;font-weight:bold;text-decoration:none;">مطالعه مقاله ←</a>';
                    echo '</article>';
                }
                wp_reset_postdata();
            } else {
                echo '<p style="color:#94a3b8;">هنوز مقاله‌ای منتشر نشده است.</p>';
            }
            echo '</div>';
        }
    }

    $widgets_manager->register( new iRamo_Elementor_App_Widget() );
    $widgets_manager->register( new iRamo_Elementor_Articles_Widget() );
} );
`;

export const WP_BOT_BRIDGE_PHP = `<?php
/**
 * Module: iRamo Telegram & Bale Unified Bot Bridge
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

class iRamo_Messenger_Bridge {
    public static function send_message( $platform, $chat_id, $text, $buttons = [] ) {
        $token = $platform === 'bale'
            ? get_option( 'iramo_bale_bot_token' )
            : get_option( 'iramo_telegram_bot_token' );

        if ( empty( $token ) || empty( $chat_id ) ) {
            return new WP_Error( 'missing_credentials', 'Bot token or Chat ID missing' );
        }

        $base_url = $platform === 'bale'
            ? 'https://tapi.bale.ai/bot' . $token
            : 'https://api.telegram.org/bot' . $token;

        $body = [
            'chat_id'    => $chat_id,
            'text'       => $text,
            'parse_mode' => 'HTML',
        ];

        if ( ! empty( $buttons ) ) {
            $body['reply_markup'] = wp_json_encode( [ 'inline_keyboard' => $buttons ] );
        }

        return wp_remote_post( $base_url . '/sendMessage', [
            'timeout' => 12,
            'body'    => $body,
        ] );
    }
}

add_action( 'iramo_lms_order_delivered', function( $order_id, $user_id, $enrolled ) {
    $tg_chat_id   = get_user_meta( $user_id, '_iramo_telegram_chat_id', true );
    $bale_chat_id = get_user_meta( $user_id, '_iramo_bale_chat_id', true );

    $msg = sprintf(
        "<b>خرید شما با موفقیت تایید شد!</b>\\nشماره سفارش: #%d\\nدسترسی دوره‌ها و محصولات در پنل کاربری فعال گردید.",
        $order_id
    );

    if ( $tg_chat_id ) {
        iRamo_Messenger_Bridge::send_message( 'telegram', $tg_chat_id, $msg );
    }
    if ( $bale_chat_id ) {
        iRamo_Messenger_Bridge::send_message( 'bale', $bale_chat_id, $msg );
    }
}, 10, 3 );

add_action( 'elementor_pro/forms/new_record', function( $record, $handler ) {
    $form_name = $record->get_form_settings( 'form_name' );
    if ( $form_name !== 'iramo_consultation_form' ) {
        return;
    }
    $fields = $record->get( 'fields' );
    $lead_text = "<b>درخواست مشاوره جدید از سایت iRamoAi</b>\\n";
    foreach ( $fields as $field ) {
        $lead_text .= sprintf( "• <b>%s:</b> %s\\n", esc_html( $field['title'] ), esc_html( $field['value'] ) );
    }
    $admin_chat = get_option( 'iramo_admin_chat_id' );
    if ( $admin_chat ) {
        iRamo_Messenger_Bridge::send_message( 'telegram', $admin_chat, $lead_text );
        iRamo_Messenger_Bridge::send_message( 'bale', $admin_chat, $lead_text );
    }
}, 10, 2 );

/**
 * Unified OTP Auth Gateway: Telegram Bot, Bale Bot & SMS Gateways (Kavenegar / Melipayamak / FarazSMS)
 */
class iRamo_OTP_Gateway {
    public static function dispatch_otp( $channel, $target, $code ) {
        $opts = get_option( 'iramo_ai_settings', [] );

        if ( $channel === 'telegram' || $channel === 'bale' ) {
            $msg = sprintf( "کد تایید ورود به پنل کاربری iRamoAi:\n<b>%s</b>\nاعتبار کد: ۳ دقیقه", $code );
            return iRamo_Messenger_Bridge::send_message( $channel, $target, $msg );
        }

        if ( $channel === 'sms' ) {
            $provider = $opts['sms_provider'] ?? 'kavenegar';
            $api_key  = $opts['sms_api_key'] ?? '';
            $pattern  = $opts['sms_pattern_code'] ?? 'iramo-verify-otp';
            if ( empty( $api_key ) ) {
                return new WP_Error( 'missing_sms_key', 'کلید API پنل پیامکی تنظیم نشده است.' );
            }
            if ( $provider === 'kavenegar' ) {
                $url = sprintf(
                    'https://api.kavenegar.com/v1/%s/verify/lookup.json?receptor=%s&token=%s&template=%s',
                    rawurlencode( $api_key ),
                    rawurlencode( $target ),
                    rawurlencode( $code ),
                    rawurlencode( $pattern )
                );
                return wp_remote_get( $url, [ 'timeout' => 12 ] );
            }
            if ( $provider === 'melipayamak' ) {
                return wp_remote_post( 'https://rest.payamak-panel.com/api/SendSMS/BaseServiceNumber', [
                    'timeout' => 12,
                    'body'    => [
                        'username' => $opts['sms_sender'] ?? '',
                        'password' => $api_key,
                        'text'     => $code,
                        'to'       => $target,
                        'bodyId'   => $pattern,
                    ],
                ] );
            }
            return wp_remote_post( 'https://api2.ippanel.com/api/v1/sms/pattern/normal/send', [
                'timeout' => 12,
                'headers' => [
                    'apikey'       => $api_key,
                    'Content-Type' => 'application/json',
                ],
                'body'    => wp_json_encode( [
                    'code'      => $pattern,
                    'sender'    => $opts['sms_sender'] ?? '',
                    'recipient' => $target,
                    'variable'  => [ 'code' => $code ],
                ] ),
            ] );
        }

        return new WP_Error( 'unsupported_channel', 'Unsupported auth channel' );
    }
}

add_action( 'rest_api_init', function() {
    register_rest_route( 'iramo/v1', '/auth/send-otp', [
        'methods'             => 'POST',
        'permission_callback' => '__return_true',
        'callback'            => function( WP_REST_Request $request ) {
            $channel = sanitize_text_field( $request->get_param( 'channel' ) );
            $target  = sanitize_text_field( $request->get_param( 'target' ) );
            if ( empty( $target ) ) {
                return new WP_Error( 'invalid_target', 'Target is required', [ 'status' => 400 ] );
            }
            $code = (string) wp_rand( 10000, 99999 );
            set_transient( 'iramo_otp_' . md5( $channel . '_' . $target ), $code, 3 * MINUTE_IN_SECONDS );
            $result = iRamo_OTP_Gateway::dispatch_otp( $channel, $target, $code );
            if ( is_wp_error( $result ) ) {
                return $result;
            }
            return rest_ensure_response( [ 'success' => true, 'channel' => $channel ] );
        },
    ] );

    register_rest_route( 'iramo/v1', '/auth/verify-otp', [
        'methods'             => 'POST',
        'permission_callback' => '__return_true',
        'callback'            => function( WP_REST_Request $request ) {
            $channel = sanitize_text_field( $request->get_param( 'channel' ) );
            $target  = sanitize_text_field( $request->get_param( 'target' ) );
            $code    = sanitize_text_field( $request->get_param( 'code' ) );
            $key     = 'iramo_otp_' . md5( $channel . '_' . $target );
            $saved   = get_transient( $key );
            if ( ! $saved || $saved !== $code ) {
                return new WP_Error( 'invalid_otp', 'کد تایید نامعتبر یا منقضی شده است.', [ 'status' => 403 ] );
            }
            delete_transient( $key );
            return rest_ensure_response( [ 'success' => true, 'verified' => true ] );
        },
    ] );
} );
`;

export const WP_THEME_STYLE_CSS = `/*
Theme Name:   iRamoAi Modern Theme
Theme URI:    https://iramo.ai
Author:       iRamoAi Engineering
Description:  Dedicated lightweight, RTL-ready WordPress Theme engineered for Elementor Pro and the iRamoAi Suite plugin (supports Modern Light & Dark Emerald).
Version:      2.1.0
Text Domain:  iramo-ai-theme
*/

html, body {
  margin: 0;
  padding: 0;
  background-color: #f8fafc;
  color: #0f172a;
  direction: rtl;
  font-family: 'Vazirmatn', system-ui, -apple-system, sans-serif;
}

html.dark, html.dark body {
  background-color: #050C0A;
  color: #f8fafc;
}

.iramo-canvas-wrapper {
  min-height: 100vh;
  width: 100%;
}
`;

export const WP_THEME_FUNCTIONS_PHP = `<?php
/**
 * iRamoAi Theme Functions & Elementor Pro Location Integration
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

add_action( 'after_setup_theme', function() {
    add_theme_support( 'title-tag' );
    add_theme_support( 'post-thumbnails' );
    add_theme_support( 'custom-logo' );
    add_theme_support( 'html5', [ 'search-form', 'comment-form', 'comment-list', 'gallery', 'caption' ] );
    register_nav_menus( [
        'primary' => __( 'منوی اصلی سایت', 'iramo-ai-theme' ),
        'footer'  => __( 'منوی فوتر', 'iramo-ai-theme' ),
    ] );
} );

// Enqueue Vazirmatn Font & Base Theme Stylesheet
add_action( 'wp_enqueue_scripts', function() {
    wp_enqueue_style( 'iramo-vazirmatn', 'https://fonts.googleapis.com/css2?family=Vazirmatn:wght@400;500;600;700;800&display=swap', [], null );
    wp_enqueue_style( 'iramo-theme-style', get_stylesheet_uri(), [ 'iramo-vazirmatn' ], '2.1.0' );
} );

// Full Elementor Pro Theme Builder Location Support
add_action( 'elementor/theme/register_locations', function( $elementor_theme_manager ) {
    $elementor_theme_manager->register_all_core_location();
} );
`;

export const WP_THEME_INDEX_PHP = `<?php
/**
 * Main Index & Canvas Template Entry for iRamoAi Theme
 */
get_header();
?>
<main id="primary" class="iramo-canvas-wrapper">
    <?php
    if ( have_posts() ) :
        while ( have_posts() ) :
            the_post();
            the_content();
        endwhile;
    else :
        echo do_shortcode( '[iramo_site view="home"]' );
    endif;
    ?>
</main>
<?php
get_footer();
`;

export const WP_THEME_HEADER_PHP = `<!doctype html>
<html <?php language_attributes(); ?>>
<head>
    <meta charset="<?php bloginfo( 'charset' ); ?>" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
<?php wp_body_open(); ?>
`;

export const WP_THEME_FOOTER_PHP = `<?php wp_footer(); ?>
</body>
</html>
`;

export const WP_THEME_CANVAS_TEMPLATE_PHP = `<?php
/**
 * Template Name: iRamo Fullscreen App Canvas
 * Template Post Type: page
 */
get_header();
while ( have_posts() ) :
    the_post();
    the_content();
endwhile;
get_footer();
`;

export const ELEMENTOR_TEMPLATE_JSON = JSON.stringify(
  {
    version: '0.4',
    title: 'iRamoAi Complete Site & Portal (Elementor Canvas)',
    type: 'page',
    content: [
      {
        id: 'iramo_canvas_container_01',
        elType: 'container',
        settings: {
          content_width: 'full',
          padding: { unit: 'px', top: '0', right: '0', bottom: '0', left: '0' },
          background_background: 'classic',
          background_color: '#F8FAFC',
        },
        elements: [
          {
            id: 'iramo_lms_shortcode_01',
            elType: 'widget',
            widgetType: 'shortcode',
            settings: {
              shortcode: '[iramo_site view="home"]',
            },
          },
        ],
      },
    ],
  },
  null,
  2
);

export const GITHUB_ACTIONS_YML = `name: Build & Package WordPress Theme + Plugin ZIPs

on:
  push:
    branches: [ main, master ]
  workflow_dispatch:

permissions:
  contents: write

jobs:
  build-wordpress-packages:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Setup Node.js 20
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm

      - name: Install dependencies
        run: npm ci

      - name: Build WordPress Assets Bundle
        run: npm run build:wp

      - name: Package Theme & Plugin ZIPs
        run: node scripts/package-wordpress.mjs

      - name: Upload Downloadable ZIP Artifacts
        uses: actions/upload-artifact@v4
        with:
          name: iramo-ai-wordpress-bundle
          path: release-wp/*.zip
`;
