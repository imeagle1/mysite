<?php
/**
 * Module: iRamoAi WordPress Admin Control Panel, Webhook Security, Demo Import & Curated AI Tools Seeder
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

function iramo_sanitize_ai_settings( $input ) {
    $existing = get_option( 'iramo_ai_settings', [] );
    if ( ! is_array( $existing ) ) {
        $existing = [];
    }
    if ( ! is_array( $input ) ) {
        $input = [];
    }

    $merged = $existing;

    $merged['brand_name']            = sanitize_text_field( $input['brand_name'] ?? ( $existing['brand_name'] ?? 'iRamoAi' ) ) ?: 'iRamoAi';
    $merged['default_theme']         = ( isset( $input['default_theme'] ) && $input['default_theme'] === 'dark' ) ? 'dark' : 'light';
    $merged['font_family']           = sanitize_text_field( $input['font_family'] ?? ( $existing['font_family'] ?? 'custom' ) );
    $merged['primary_color']         = sanitize_hex_color( $input['primary_color'] ?? '' ) ?: '#059669';
    $merged['accent_color']          = sanitize_hex_color( $input['accent_color'] ?? '' ) ?: '#FFBA00';
    $merged['telegram_bot_username'] = sanitize_text_field( $input['telegram_bot_username'] ?? ( $existing['telegram_bot_username'] ?? '@iRamoBot' ) );
    $merged['bale_bot_username']     = sanitize_text_field( $input['bale_bot_username'] ?? ( $existing['bale_bot_username'] ?? '@iRamoBaleBot' ) );

    foreach ( [ 'enable_builtin_seo', 'enable_security_hardening' ] as $bool_key ) {
        $merged[ $bool_key ] = ! empty( $input[ $bool_key ] ) ? '1' : '0';
    }

    return $merged;
}

add_action( 'admin_init', function() {
    register_setting( 'iramo_ai_settings_group', 'iramo_ai_settings', [
        'type'              => 'array',
        'sanitize_callback' => 'iramo_sanitize_ai_settings',
        'default'           => [],
    ] );
    register_setting( 'iramo_ai_settings_group', 'iramo_telegram_bot_token', [ 'sanitize_callback' => 'sanitize_text_field' ] );
    register_setting( 'iramo_ai_settings_group', 'iramo_bale_bot_token', [ 'sanitize_callback' => 'sanitize_text_field' ] );
    register_setting( 'iramo_ai_settings_group', 'iramo_admin_chat_id', [ 'sanitize_callback' => 'sanitize_text_field' ] );
} );

/**
 * Deterministic Demo Dataset (idempotently installed via `_iramo_demo_key` without touching the 18 curated AI tools)
 */
function iramo_get_demo_dataset() {
    return [
        [
            'demo_key'  => 'demo-prod-hesabyar',
            'post_type' => 'iramo_product',
            'slug'      => 'hesabyar-ai-ocr',
            'title'     => 'نرم‌افزار حسابیار هوشمند (OCR مالی)',
            'excerpt'   => 'استخراج خودکار فاکتور و فیش بانکی با هوش مصنوعی و ثبت مستقیم در اکسل و نرم‌افزارهای مالی.',
            'content'   => '<p>حسابیار هوشمند با استفاده از مدل‌های دقیق بینایی ماشین فارسی، تصاویر فاکتورها، قبوض و فیش‌های بانکی را خوانده و خروجی استاندارد اکسل یا سند حسابداری تولید می‌کند.</p>',
            'meta'      => [
                '_iramo_tagline'       => 'خواندن خودکار فاکتور و فیش بانکی با دقت ۹۹٪',
                '_iramo_price_toman'   => '1950000',
                '_iramo_price_usd'     => '35',
                '_iramo_billing_label' => 'لایسنس دائمی + آپدیت خودکار',
                '_iramo_accent'        => 'emerald',
                '_iramo_highlights'    => "تشخیص خودکار مبلغ، تاریخ و کد پیگیری فارسی\nخروجی مستقیم اکسل و اتصال به نرم‌افزارهای حسابداری\nاتصال آنی به ربات تلگرام و بله برای ارسال عکس فاکتور",
                '_iramo_metrics'       => "زمان پردازش هر سند | کمتر از ۲ ثانیه\nدقت OCR فارسی | ۹۹.۴٪",
            ],
        ],
        [
            'demo_key'  => 'demo-prod-videomi',
            'post_type' => 'iramo_product',
            'slug'      => 'videomi-ai-studio',
            'title'     => 'استودیو ویدئومی (زیرنویس و دوبله AI)',
            'excerpt'   => 'تبدیل ویدیوهای آموزشی یوتیوب و دوره‌ها به زیرنویس دقیق و دوبله فارسی هماهنگ با صدا.',
            'content'   => '<p>ویدئومی استودیوی بومی برای ترجمه، زمان‌بندی دقیق زیرنویس و تولید صدای دوبله فارسی طبیعی روی ویدیوهای آموزشی و تولید محتوا است.</p>',
            'meta'      => [
                '_iramo_tagline'       => 'زیرنویس و دوبله هوشمند ویدیوهای تخصصی و دوره‌ها',
                '_iramo_price_toman'   => '2450000',
                '_iramo_price_usd'     => '42',
                '_iramo_billing_label' => 'لایسنس دائمی دسکتاپ',
                '_iramo_accent'        => 'amber',
                '_iramo_highlights'    => "تشخیص گفتار چندزبانه با زمان‌بندی فریم‌به‌فریم\nتنظیم لحن دوبله فارسی و خروجی SRT و MP4\nپشتیبانی از پردازش دسته‌ای پوشه ویدیوها",
                '_iramo_metrics'       => "پشتیبانی زبان | ۴۲ زبان زنده\nصرفه‌جویی زمان تدوین | ۱۰ برابر سریع‌تر",
            ],
        ],
        [
            'demo_key'  => 'demo-course-ai-mastery',
            'post_type' => 'iramo_course',
            'slug'      => 'ai-mastery-practical-course',
            'title'     => 'دوره جامع هوش مصنوعی کاربردی در کسب‌وکار (از صفر تا پیشرفته)',
            'excerpt'   => 'یادگیری پروژه‌محور پرامپت‌نویسی حرفه‌ای، اتوماسیون کاری و پیاده‌سازی دستیارهای AI در عملیات روزانه.',
            'content'   => '<p>در این دوره به‌صورت کامل و عملی می‌آموزید چگونه ابزارهای هوش مصنوعی، پرامپت‌نویسی ساختاریافته و پایپ‌لاین‌های اتوماسیون را برای افزایش بهره‌وری تیم یا کسب‌وکار شخصی پیاده‌سازی کنید.</p><ul><li>فصل ۱: مبانی پرامپت‌نویسی مهندسی‌شده و کنترل خروجی JSON</li><li>فصل ۲: انتخاب و ترکیب مدل‌های متنی، تصویری و کدی</li><li>فصل ۳: پروژه عملی طراحی ایجنت دستیار سازمانی</li></ul>',
            'meta'      => [
                '_iramo_duration_hours' => '18',
                '_iramo_level'          => 'مقدماتی تا پیشرفته (پروژه‌محور)',
                '_iramo_price_toman'    => '2900000',
                '_iramo_instructor'     => 'مهندس امیرحسین رامو · آکادمی iRamoAi',
            ],
        ],
        [
            'demo_key'  => 'demo-course-bot-builder',
            'post_type' => 'iramo_course',
            'slug'      => 'telegram-bale-woocommerce-bots',
            'title'     => 'دوره ساخت ربات فروش، OTP و تحویل خودکار در تلگرام و بله',
            'excerpt'   => 'آموزش گام‌به‌گام طراحی ربات امن پیام‌رسان، وبهوک، احراز هویت دو مرحله‌ای و اتصال مستقیم به ووکامرس.',
            'content'   => '<p>ساخت زیرساخت ربات‌های واقعی تلگرام و بله با تمرکز بر امنیت وبهوک، صدور خودکار لایسنس سفارش‌های ووکامرس، ارسال کد تایید ۶ رقمی و مدیریت دسترسی دانشجویان.</p>',
            'meta'      => [
                '_iramo_duration_hours' => '14',
                '_iramo_level'          => 'متوسط تا پیشرفته',
                '_iramo_price_toman'    => '3400000',
                '_iramo_instructor'     => 'تیم مهندسی iRamoAi',
            ],
        ],
        [
            'demo_key'  => 'demo-art-bot-arch',
            'post_type' => 'post',
            'slug'      => 'secure-telegram-bale-webhook-architecture',
            'title'     => 'معماری امن اتصال ربات تلگرام و بله به وردپرس و ووکامرس',
            'excerpt'   => 'چگونه با استفاده از Secret Token، کد اتصال یکبارمصرف و Rate Limit جلوی سوءاستفاده در وبهوک ربات‌ها را بگیریم.',
            'content'   => '<p>در سیستم‌های واقعی اتصال ربات به سایت، اتکا به نام کاربری تلگرام یا باز گذاشتن وبهوک بدون امضای رمزنگاری‌شده ریسک امنیتی بالایی دارد. استفاده از هدر X-Telegram-Bot-Api-Secret-Token برای تلگرام، پارامتر secret برای بله، بررسی ثابت‌زمان با hash_equals و اتصال کد ۱۰ دقیقه‌ای از جمله استانداردهای ضروری هستند.</p>',
            'meta'      => [
                '_iramo_tagline' => 'راهنمای امن‌سازی Webhook و احراز هویت OTP در پیام‌رسان‌ها',
            ],
        ],
        [
            'demo_key'  => 'demo-art-prompt-eng',
            'post_type' => 'post',
            'slug'      => 'structured-prompt-engineering-for-teams',
            'title'     => 'الگوهای مهندسی پرامپت برای گرفتن خروجی دقیق از ابزارهای هوش مصنوعی',
            'excerpt'   => '۵ چارچوب کاربردی برای نوشتن پرامپت‌های قابل تکرار در تولید محتوا، تحلیل داده و کدنویسی.',
            'content'   => '<p>تفاوت پرامپت آماتور و پرامپت مهندسی‌شده در تعیین نقش، ورودی ساختاریافته، محدودیت‌ها و فرمت خروجی است. با تعریف چند نمونه ورودی/خروجی (Few-Shot) می‌توان خطای مدل‌ها را تا بیش از ۶۰ درصد کاهش داد.</p>',
            'meta'      => [
                '_iramo_tagline' => 'تکنیک‌های عملی نوشتن پرامپت استاندارد در پروژه‌های فارسی',
            ],
        ],
    ];
}

// Handle Demo Install, Demo Purge, Webhook Management, Pages Sync & Curated AI Tools Sync
add_action( 'admin_post_iramo_manage_demo_data', function() {
    if ( ! current_user_can( 'manage_options' ) ) {
        wp_die( 'Unauthorized' );
    }
    check_admin_referer( 'iramo_demo_nonce' );

    $action_type = sanitize_text_field( $_POST['demo_action'] ?? '' );
    $post_types  = [ 'iramo_product', 'iramo_course', 'iramo_ai_tool', 'post', 'product' ];

    if ( $action_type === 'purge_demo' ) {
        // Strictly purge ONLY items marked _iramo_is_demo = '1' and NEVER touch _iramo_curated_tool = '1'
        $demo_posts = get_posts( [
            'post_type'      => $post_types,
            'post_status'    => 'any',
            'posts_per_page' => -1,
            'meta_query'     => [
                'relation' => 'AND',
                [
                    'key'   => '_iramo_is_demo',
                    'value' => '1',
                ],
                [
                    'relation' => 'OR',
                    [
                        'key'     => '_iramo_curated_tool',
                        'compare' => 'NOT EXISTS',
                    ],
                    [
                        'key'     => '_iramo_curated_tool',
                        'value'   => '1',
                        'compare' => '!=',
                    ],
                ],
            ],
            'fields' => 'ids',
        ] );

        $deleted = 0;
        foreach ( $demo_posts as $pid ) {
            if ( get_post_meta( $pid, '_iramo_curated_tool', true ) === '1' ) {
                continue;
            }
            if ( wp_delete_post( $pid, true ) ) {
                $deleted++;
            }
        }

        $curated_count = (int) count( get_posts( [
            'post_type'      => 'iramo_ai_tool',
            'post_status'    => 'publish',
            'posts_per_page' => -1,
            'meta_key'       => '_iramo_curated_tool',
            'meta_value'     => '1',
            'fields'         => 'ids',
        ] ) );

        $opts = get_option( 'iramo_ai_settings', [] );
        if ( ! is_array( $opts ) ) {
            $opts = [];
        }
        $opts['demo_cleared'] = 1;
        update_option( 'iramo_ai_settings', $opts );
        wp_cache_flush();

        wp_redirect( admin_url( 'admin.php?page=iramo-ai-control&demo_status=purged&count=' . $deleted . '&preserved=' . $curated_count ) );
        exit;
    }

    if ( $action_type === 'install_demo' ) {
        $samples   = iramo_get_demo_dataset();
        $installed = 0;

        foreach ( $samples as $item ) {
            $existing = get_posts( [
                'post_type'      => $item['post_type'],
                'post_status'    => 'any',
                'meta_key'       => '_iramo_demo_key',
                'meta_value'     => $item['demo_key'],
                'posts_per_page' => 1,
                'fields'         => 'ids',
            ] );

            $post_args = [
                'post_type'    => $item['post_type'],
                'post_title'   => $item['title'],
                'post_name'    => $item['slug'],
                'post_excerpt' => $item['excerpt'],
                'post_content' => $item['content'],
                'post_status'  => 'publish',
            ];

            if ( ! empty( $existing ) ) {
                $post_args['ID'] = (int) $existing[0];
                $pid = wp_update_post( $post_args, true );
            } else {
                $pid = wp_insert_post( $post_args, true );
            }

            if ( $pid && ! is_wp_error( $pid ) ) {
                update_post_meta( $pid, '_iramo_is_demo', '1' );
                update_post_meta( $pid, '_iramo_demo_key', $item['demo_key'] );
                foreach ( $item['meta'] as $mk => $mv ) {
                    update_post_meta( $pid, $mk, $mv );
                }
                $installed++;
            }
        }

        if ( function_exists( 'iramo_seed_curated_ai_tools' ) ) {
            iramo_seed_curated_ai_tools( false );
        }

        $opts = get_option( 'iramo_ai_settings', [] );
        if ( ! is_array( $opts ) ) {
            $opts = [];
        }
        $opts['demo_cleared'] = 0;
        update_option( 'iramo_ai_settings', $opts );
        flush_rewrite_rules( false );
        wp_cache_flush();

        wp_redirect( admin_url( 'admin.php?page=iramo-ai-control&demo_status=installed&count=' . $installed ) );
        exit;
    }

    if ( $action_type === 'provision_pages' ) {
        if ( function_exists( 'iramo_provision_site_pages' ) ) {
            iramo_provision_site_pages( true );
        }
        wp_redirect( admin_url( 'admin.php?page=iramo-ai-control&demo_status=pages_synced' ) );
        exit;
    }

    if ( $action_type === 'sync_curated_tools' ) {
        if ( function_exists( 'iramo_seed_curated_ai_tools' ) ) {
            iramo_seed_curated_ai_tools( true );
        }
        wp_redirect( admin_url( 'admin.php?page=iramo-ai-control&demo_status=tools_synced' ) );
        exit;
    }

    if ( $action_type === 'regenerate_webhook_secret' ) {
        if ( function_exists( 'iramo_get_or_create_webhook_secret' ) ) {
            iramo_get_or_create_webhook_secret( true );
        }
        wp_redirect( admin_url( 'admin.php?page=iramo-ai-control&demo_status=secret_regenerated' ) );
        exit;
    }

    if ( $action_type === 'register_tg_webhook' || $action_type === 'register_bale_webhook' ) {
        $plat = $action_type === 'register_bale_webhook' ? 'bale' : 'telegram';
        if ( class_exists( 'iRamo_Messenger_Bridge' ) ) {
            $res = iRamo_Messenger_Bridge::register_webhook( $plat );
            if ( is_wp_error( $res ) ) {
                wp_redirect( admin_url( 'admin.php?page=iramo-ai-control&demo_status=webhook_error&err=' . rawurlencode( $res->get_error_message() ) ) );
                exit;
            }
            $code = (int) wp_remote_retrieve_response_code( $res );
            $body = json_decode( (string) wp_remote_retrieve_body( $res ), true );
            if ( $code >= 200 && $code < 300 && ! empty( $body['ok'] ) ) {
                wp_redirect( admin_url( 'admin.php?page=iramo-ai-control&demo_status=webhook_ok&plat=' . $plat ) );
                exit;
            }
            $msg = is_array( $body ) && ! empty( $body['description'] ) ? $body['description'] : 'خطا در ثبت وبهوک (کد ' . $code . ')';
            wp_redirect( admin_url( 'admin.php?page=iramo-ai-control&demo_status=webhook_error&err=' . rawurlencode( $msg ) ) );
            exit;
        }
    }

    wp_redirect( admin_url( 'admin.php?page=iramo-ai-control' ) );
    exit;
} );

function iramo_render_admin_control_page() {
    $opts      = get_option( 'iramo_ai_settings', [] );
    $status    = sanitize_text_field( $_GET['demo_status'] ?? '' );
    $cnt       = (int) ( $_GET['count'] ?? 0 );
    $preserved = (int) ( $_GET['preserved'] ?? 18 );
    $err_msg   = sanitize_text_field( $_GET['err'] ?? '' );
    $plat      = sanitize_text_field( $_GET['plat'] ?? '' );

    $secret          = function_exists( 'iramo_get_or_create_webhook_secret' ) ? iramo_get_or_create_webhook_secret() : '';
    $tg_webhook_url  = add_query_arg( 'platform', 'telegram', rest_url( 'iramo/v1/bot/webhook' ) );
    $bale_webhook_url = add_query_arg( [ 'platform' => 'bale', 'secret' => $secret ], rest_url( 'iramo/v1/bot/webhook' ) );
    $bale_path_url   = untrailingslashit( rest_url( 'iramo/v1/bot/webhook/bale/' . $secret ) );

    $curated_live = count( get_posts( [
        'post_type'      => 'iramo_ai_tool',
        'post_status'    => 'publish',
        'posts_per_page' => -1,
        'meta_key'       => '_iramo_curated_tool',
        'meta_value'     => '1',
        'fields'         => 'ids',
    ] ) );
    $demo_live = count( get_posts( [
        'post_type'      => [ 'iramo_product', 'iramo_course', 'iramo_ai_tool', 'post', 'product' ],
        'post_status'    => 'any',
        'posts_per_page' => -1,
        'meta_key'       => '_iramo_is_demo',
        'meta_value'     => '1',
        'fields'         => 'ids',
    ] ) );
    ?>
    <div class="wrap" dir="rtl" style="max-width: 980px; font-family: Tahoma, sans-serif;">
        <h1>پنل کنترل کامل قالب، المنتور و امنیت iRamoAi</h1>

        <?php if ( $status === 'purged' ) : ?>
            <div class="notice notice-success is-dismissible"><p>تعداد <strong><?php echo esc_html( $cnt ); ?></strong> آیتم دمو با موفقیت پاکسازی شدند و تمام <strong><?php echo esc_html( $preserved ); ?></strong> ابزار واقعی صفحه «ابزارهای هوش مصنوعی» دست‌نخورده حفظ شدند.</p></div>
        <?php elseif ( $status === 'installed' ) : ?>
            <div class="notice notice-success is-dismissible"><p>تعداد <strong><?php echo esc_html( $cnt ); ?></strong> آیتم دمو (محصولات، دوره‌ها و مقالات نمونه) با موفقیت نصب / به‌روزرسانی شدند.</p></div>
        <?php elseif ( $status === 'pages_synced' ) : ?>
            <div class="notice notice-success is-dismissible"><p>تمام برگه‌ها، ۴ قالب Loop Item، قالب‌های Theme Builder (هدر، فوتر، آرشیو و تکی دوره/مقاله/ابزار/محصول، ۴۰۴) و منوی اصلی سایت همگام‌سازی و پیوندهای یکتا بازسازی شدند.</p></div>
        <?php elseif ( $status === 'tools_synced' ) : ?>
            <div class="notice notice-success is-dismissible"><p>تمام ۱۸ ابزار واقعی هوش مصنوعی به‌صورت کامل درون پست‌تایپ <code>iramo_ai_tool</code> منتشر و به‌روزرسانی شدند.</p></div>
        <?php elseif ( $status === 'secret_regenerated' ) : ?>
            <div class="notice notice-warning is-dismissible"><p>کلید Secret وبهوک بازتولید شد. حتماً وبهوک تلگرام و بله را مجدداً ثبت یا به‌روزرسانی کنید.</p></div>
        <?php elseif ( $status === 'webhook_ok' ) : ?>
            <div class="notice notice-success is-dismissible"><p>وبهوک امن ربات <strong><?php echo esc_html( $plat === 'bale' ? 'بله (Bale)' : 'تلگرام (Telegram)' ); ?></strong> با موفقیت روی سرور پیام‌رسان ثبت شد.</p></div>
        <?php elseif ( $status === 'webhook_error' ) : ?>
            <div class="notice notice-error is-dismissible"><p>خطا در ثبت خودکار وبهوک: <?php echo esc_html( $err_msg ); ?></p></div>
        <?php endif; ?>

        <form method="post" action="options.php" style="background:#fff;padding:24px;border-radius:12px;border:1px solid #dcdcde;margin-top:20px;">
            <?php settings_fields( 'iramo_ai_settings_group' ); ?>
            <h2>تنظیمات عمومی، فونت، سئو، امنیت و پیام‌رسان‌ها</h2>
            <table class="form-table">
                <tr>
                    <th>نام برند سایت</th>
                    <td><input type="text" name="iramo_ai_settings[brand_name]" value="<?php echo esc_attr( $opts['brand_name'] ?? 'iRamoAi' ); ?>" class="regular-text" /></td>
                </tr>
                <tr>
                    <th>حالت پیش‌فرض نمایش سایت</th>
                    <td>
                        <select name="iramo_ai_settings[default_theme]">
                            <option value="light" <?php selected( $opts['default_theme'] ?? 'light', 'light' ); ?>>روشن مدرن (Modern Light)</option>
                            <option value="dark" <?php selected( $opts['default_theme'] ?? 'light', 'dark' ); ?>>تیره زمردی (Dark Emerald)</option>
                        </select>
                    </td>
                </tr>
                <tr>
                    <th>سئو و امنیت داخلی (Built-in)</th>
                    <td>
                        <input type="hidden" name="iramo_ai_settings[enable_builtin_seo]" value="0" />
                        <label style="display:block;margin-bottom:6px;"><input type="checkbox" name="iramo_ai_settings[enable_builtin_seo]" value="1" <?php checked( ! array_key_exists( 'enable_builtin_seo', $opts ) || ! empty( $opts['enable_builtin_seo'] ) ); ?> /> فعال‌سازی تگ‌های سئو، OpenGraph و اسکیما (Schema.org JSON-LD) داخلی (در صورت نصب RankMath/Yoast تداخل ایجاد نمی‌کند)</label>
                        <input type="hidden" name="iramo_ai_settings[enable_security_hardening]" value="0" />
                        <label style="display:block;"><input type="checkbox" name="iramo_ai_settings[enable_security_hardening]" value="1" <?php checked( ! array_key_exists( 'enable_security_hardening', $opts ) || ! empty( $opts['enable_security_hardening'] ) ); ?> /> فعال‌سازی سخت‌گیری امنیتی (محدودسازی درخواست فرم‌ها، غیرفعال کردن XML-RPC و مخفی‌سازی شناسه کاربران)</label>
                    </td>
                </tr>
                <tr>
                    <th>فونت فارسی سایت و افزونه</th>
                    <td>
                        <?php $admin_default_font = file_exists( IRAMO_AI_PATH . 'assets/fonts/custom-font.css' ) ? 'custom' : 'vazirmatn'; ?>
                        <select name="iramo_ai_settings[font_family]">
                            <option value="custom" <?php selected( $opts['font_family'] ?? $admin_default_font, 'custom' ); ?>>فونت اختصاصی آپلودشده (IRANYekanXVF وریبل)</option>
                            <option value="vazirmatn" <?php selected( $opts['font_family'] ?? $admin_default_font, 'vazirmatn' ); ?>>وزیرمتن (Vazirmatn)</option>
                            <option value="rubik" <?php selected( $opts['font_family'] ?? $admin_default_font, 'rubik' ); ?>>روبیک (Rubik)</option>
                        </select>
                    </td>
                </tr>
                <tr>
                    <th>رنگ اصلی و دکمه‌ها (Hex)</th>
                    <td>
                        <label style="margin-left:14px;">اصلی (Primary): <input type="color" name="iramo_ai_settings[primary_color]" value="<?php echo esc_attr( $opts['primary_color'] ?? '#059669' ); ?>" /></label>
                        <label>تاکیدی دکمه‌ها (Accent): <input type="color" name="iramo_ai_settings[accent_color]" value="<?php echo esc_attr( $opts['accent_color'] ?? '#FFBA00' ); ?>" /></label>
                    </td>
                </tr>
                <tr>
                    <th>یوزرنیم و توکن ربات تلگرام (اطلاع‌رسانی)</th>
                    <td>
                        <input type="text" dir="ltr" name="iramo_ai_settings[telegram_bot_username]" value="<?php echo esc_attr( $opts['telegram_bot_username'] ?? '@iRamoBot' ); ?>" style="width:150px;margin-left:8px;" />
                        <input type="text" dir="ltr" name="iramo_telegram_bot_token" value="<?php echo esc_attr( get_option( 'iramo_telegram_bot_token' ) ); ?>" class="regular-text" placeholder="123456:ABC..." />
                    </td>
                </tr>
                <tr>
                    <th>یوزرنیم و توکن ربات بله (اطلاع‌رسانی)</th>
                    <td>
                        <input type="text" dir="ltr" name="iramo_ai_settings[bale_bot_username]" value="<?php echo esc_attr( $opts['bale_bot_username'] ?? '@iRamoBaleBot' ); ?>" style="width:150px;margin-left:8px;" />
                        <input type="text" dir="ltr" name="iramo_bale_bot_token" value="<?php echo esc_attr( get_option( 'iramo_bale_bot_token' ) ); ?>" class="regular-text" placeholder="987654:XYZ..." />
                    </td>
                </tr>
                <tr>
                    <th>چت آیدی مدیر (برای دریافت فرم مشاوره و سفارش‌ها)</th>
                    <td>
                        <input type="text" dir="ltr" name="iramo_admin_chat_id" value="<?php echo esc_attr( get_option( 'iramo_admin_chat_id' ) ); ?>" placeholder="Admin Chat ID" class="regular-text" />
                        <p class="description">برای دریافت شناسه عددی چت، به ربات خود دستور <code>/start</code> بفرستید.</p>
                    </td>
                </tr>
            </table>
            <?php submit_button( 'ذخیره تنظیمات سایت، سئو، امنیت و ربات‌ها' ); ?>
        </form>

        <!-- Webhook Security & Endpoint Inspection Card -->
        <div style="background:#fff;padding:24px;border-radius:12px;border:1px solid #dcdcde;margin-top:20px;">
            <h2>امنیت وبهوک ربات تلگرام و بله (Secret Token)</h2>
            <p class="description">نقطه پایان <code>/iramo/v1/bot/webhook</code> با مقایسه ثابت‌زمان <code>hash_equals</code> محافظت می‌شود و درخواست‌های فاقد Secret معتبر خطای <strong>403 Forbidden</strong> می‌گیرند.</p>
            <table class="form-table">
                <tr>
                    <th>Secret اختصاصی وبهوک (۳۲ کاراکتر)</th>
                    <td>
                        <input type="text" dir="ltr" readonly value="<?php echo esc_attr( $secret ); ?>" class="regular-text code" onclick="this.select();" />
                    </td>
                </tr>
                <tr>
                    <th>آدرس وبهوک تلگرام (به همراه Secret Header)</th>
                    <td>
                        <input type="text" dir="ltr" readonly value="<?php echo esc_attr( $tg_webhook_url ); ?>" style="width:100%;max-width:640px;" class="code" onclick="this.select();" />
                        <p class="description">تلگرام این آدرس را به‌همراه هدر <code>X-Telegram-Bot-Api-Secret-Token: <?php echo esc_html( $secret ); ?></code> (پارامتر <code>secret_token</code> در <code>setWebhook</code>) ارسال می‌کند.</p>
                    </td>
                </tr>
                <tr>
                    <th>آدرس کامل وبهوک بله (دارای Secret در URL)</th>
                    <td>
                        <input type="text" dir="ltr" readonly value="<?php echo esc_attr( $bale_webhook_url ); ?>" style="width:100%;max-width:640px;" class="code" onclick="this.select();" />
                        <p class="description">آدرس جایگزین مسیر: <code dir="ltr"><?php echo esc_html( $bale_path_url ); ?></code></p>
                    </td>
                </tr>
            </table>
            <div style="display:flex;flex-wrap:wrap;gap:10px;margin-top:10px;">
                <form method="post" action="<?php echo esc_url( admin_url( 'admin-post.php' ) ); ?>">
                    <?php wp_nonce_field( 'iramo_demo_nonce' ); ?>
                    <input type="hidden" name="action" value="iramo_manage_demo_data" />
                    <input type="hidden" name="demo_action" value="register_tg_webhook" />
                    <button type="submit" class="button button-primary">ثبت خودکار وبهوک امن تلگرام (با secret_token)</button>
                </form>

                <form method="post" action="<?php echo esc_url( admin_url( 'admin-post.php' ) ); ?>">
                    <?php wp_nonce_field( 'iramo_demo_nonce' ); ?>
                    <input type="hidden" name="action" value="iramo_manage_demo_data" />
                    <input type="hidden" name="demo_action" value="register_bale_webhook" />
                    <button type="submit" class="button button-primary">ثبت خودکار وبهوک امن بله (با پارامتر secret)</button>
                </form>

                <form method="post" action="<?php echo esc_url( admin_url( 'admin-post.php' ) ); ?>" onsubmit="return confirm('آیا مطمئن هستید؟ با تغییر Secret، باید وبهوک ربات‌ها را دوباره ثبت کنید.');">
                    <?php wp_nonce_field( 'iramo_demo_nonce' ); ?>
                    <input type="hidden" name="action" value="iramo_manage_demo_data" />
                    <input type="hidden" name="demo_action" value="regenerate_webhook_secret" />
                    <button type="submit" class="button button-secondary">تولید Secret جدید</button>
                </form>
            </div>
        </div>

        <!-- Elementor, Loop Builder & Demo Lifecycle Card -->
        <div style="background:#fff;padding:24px;border-radius:12px;border:1px solid #dcdcde;margin-top:20px;">
            <h2>صفحات المنتور، Loop Itemها، درون‌ریزی دمو و ابزارهای واقعی هوش مصنوعی</h2>
            <p>وضعیت فعلی سایت: <strong><?php echo esc_html( $demo_live ); ?></strong> آیتم دمو نصب‌شده &nbsp;|&nbsp; <strong><?php echo esc_html( $curated_live ); ?></strong> ابزار واقعی هوش مصنوعی (محافظت‌شده هنگام پاکسازی دمو).</p>
            <div style="display:flex;flex-wrap:wrap;gap:12px;margin-top:14px;">
                <form method="post" action="<?php echo esc_url( admin_url( 'admin-post.php' ) ); ?>">
                    <?php wp_nonce_field( 'iramo_demo_nonce' ); ?>
                    <input type="hidden" name="action" value="iramo_manage_demo_data" />
                    <input type="hidden" name="demo_action" value="provision_pages" />
                    <button type="submit" class="button button-primary">ساخت و همگام‌سازی برگه‌ها، Loop Itemها و قالب‌های المنتور</button>
                </form>

                <a href="<?php echo esc_url( admin_url( 'edit.php?post_type=elementor_library' ) ); ?>" class="button button-secondary">مدیریت قالب‌های المنتور (هدر / فوتر / تکی / Loop Item)</a>

                <form method="post" action="<?php echo esc_url( admin_url( 'admin-post.php' ) ); ?>">
                    <?php wp_nonce_field( 'iramo_demo_nonce' ); ?>
                    <input type="hidden" name="action" value="iramo_manage_demo_data" />
                    <input type="hidden" name="demo_action" value="sync_curated_tools" />
                    <button type="submit" class="button button-secondary">نصب / همگام‌سازی ۱۸ ابزار واقعی هوش مصنوعی</button>
                </form>

                <form method="post" action="<?php echo esc_url( admin_url( 'admin-post.php' ) ); ?>">
                    <?php wp_nonce_field( 'iramo_demo_nonce' ); ?>
                    <input type="hidden" name="action" value="iramo_manage_demo_data" />
                    <input type="hidden" name="demo_action" value="install_demo" />
                    <button type="submit" class="button button-secondary">نصب / بازنصب داده‌های نمونه (محصول، دوره، مقاله)</button>
                </form>

                <form method="post" action="<?php echo esc_url( admin_url( 'admin-post.php' ) ); ?>" onsubmit="return confirm('تمام آیتم‌های دمو پاک می‌شوند و ۱۸ ابزار واقعی AI حفظ خواهند شد. ادامه می‌دهید؟');">
                    <?php wp_nonce_field( 'iramo_demo_nonce' ); ?>
                    <input type="hidden" name="action" value="iramo_manage_demo_data" />
                    <input type="hidden" name="demo_action" value="purge_demo" />
                    <button type="submit" class="button button-secondary" style="color:#b91c1c;border-color:#fca5a5;">پاکسازی کامل داده‌های نمونه (با حفظ ۱۸ ابزار AI)</button>
                </form>
            </div>
        </div>
    </div>
    <?php
}
