<?php
/**
 * Module: iRamoAi WordPress Admin Control Panel, Curated AI Tools Seeder & Demo Purge
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

// Handle One-Click Demo Purge, Demo Install, Pages Sync & Curated AI Tools Sync
add_action( 'admin_post_iramo_manage_demo_data', function() {
    if ( ! current_user_can( 'manage_options' ) ) wp_die( 'Unauthorized' );
    check_admin_referer( 'iramo_demo_nonce' );

    $action_type = sanitize_text_field( $_POST['demo_action'] ?? '' );
    $post_types  = [ 'iramo_product', 'iramo_course', 'iramo_ai_tool', 'iramo_article' ];

    if ( $action_type === 'purge_demo' ) {
        // Strictly purge ONLY items marked _iramo_is_demo = '1' and NEVER touch _iramo_curated_tool = '1'
        $demo_posts = get_posts( [
            'post_type'      => $post_types,
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

    if ( $action_type === 'install_demo' ) {
        $samples = [
            [ 'post_type' => 'iramo_course', 'title' => 'دوره جامع هوش مصنوعی از صفر تا پیشرفته' ],
            [ 'post_type' => 'iramo_course', 'title' => 'ساخت ربات آموزشی و فروش تلگرام و بله' ],
            [ 'post_type' => 'iramo_article', 'title' => 'معماری اتصال ربات تلگرام و بله به ووکامرس' ],
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
    $opts   = get_option( 'iramo_ai_settings', [] );
    $status = sanitize_text_field( $_GET['demo_status'] ?? '' );
    ?>
    <div class="wrap" dir="rtl" style="max-width: 960px; font-family: Tahoma, sans-serif;">
        <h1>پنل کنترل کامل قالب و افزونه iRamoAi</h1>
        <?php if ( $status === 'purged' ) : ?>
            <div class="notice notice-success is-dismissible"><p>تمام داده‌های نمونه پاکسازی شدند و ۱۸ ابزار واقعی صفحه «ابزارهای هوش مصنوعی» دست‌نخورده حفظ شدند.</p></div>
        <?php elseif ( $status === 'installed' ) : ?>
            <div class="notice notice-success is-dismissible"><p>داده‌های نمونه مجدداً نصب شدند.</p></div>
        <?php elseif ( $status === 'pages_synced' ) : ?>
            <div class="notice notice-success is-dismissible"><p>تمام برگه‌ها (خانه، خدمات، پنل دانشجو)، آرشیوهای native و منوی اصلی سایت همگام‌سازی و پیوندهای یکتا بازسازی شدند.</p></div>
        <?php elseif ( $status === 'tools_synced' ) : ?>
            <div class="notice notice-success is-dismissible"><p>تمام ۱۸ ابزار واقعی هوش مصنوعی به‌صورت کامل درون پست‌تایپ <code>iramo_ai_tool</code> منتشر و به‌روزرسانی شدند.</p></div>
        <?php endif; ?>

        <form method="post" action="options.php" style="background:#fff;padding:24px;border-radius:12px;border:1px solid #dcdcde;margin-top:20px;">
            <?php settings_fields( 'iramo_ai_settings_group' ); ?>
            <h2>تنظیمات عمومی، فونت، سئو و امنیت</h2>
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
                    <th>سئو و امنیت داخلی (Built-in)</th>
                    <td>
                        <label style="display:block;margin-bottom:6px;"><input type="checkbox" name="iramo_ai_settings[enable_builtin_seo]" value="1" <?php checked( ! isset( $opts['enable_builtin_seo'] ) || ! empty( $opts['enable_builtin_seo'] ) ); ?> /> فعال‌سازی تگ‌های سئو، OpenGraph و اسکیما (Schema.org JSON-LD) داخلی (در صورت نصب RankMath/Yoast تداخل ایجاد نمی‌کند)</label>
                        <label style="display:block;"><input type="checkbox" name="iramo_ai_settings[enable_security_hardening]" value="1" <?php checked( ! isset( $opts['enable_security_hardening'] ) || ! empty( $opts['enable_security_hardening'] ) ); ?> /> فعال‌سازی سخت‌گیری امنیتی (محدودسازی درخواست OTP، غیرفعال کردن XML-RPC و مخفی‌سازی شناسه کاربران)</label>
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
                    <th>روش‌های ورود فعال در پنل</th>
                    <td>
                        <label style="margin-left:14px;"><input type="checkbox" name="iramo_ai_settings[enable_telegram_auth]" value="1" <?php checked( ! isset( $opts['enable_telegram_auth'] ) || ! empty( $opts['enable_telegram_auth'] ) ); ?> /> تلگرام</label>
                        <label style="margin-left:14px;"><input type="checkbox" name="iramo_ai_settings[enable_bale_auth]" value="1" <?php checked( ! isset( $opts['enable_bale_auth'] ) || ! empty( $opts['enable_bale_auth'] ) ); ?> /> بله</label>
                        <label style="margin-left:14px;"><input type="checkbox" name="iramo_ai_settings[enable_sms_auth]" value="1" <?php checked( ! isset( $opts['enable_sms_auth'] ) || ! empty( $opts['enable_sms_auth'] ) ); ?> /> پیامک (SMS)</label>
                        <label><input type="checkbox" name="iramo_ai_settings[enable_email_auth]" value="1" <?php checked( ! isset( $opts['enable_email_auth'] ) || ! empty( $opts['enable_email_auth'] ) ); ?> /> ایمیل</label>
                    </td>
                </tr>
                <tr>
                    <th>یوزرنیم و توکن ربات تلگرام</th>
                    <td>
                        <input type="text" dir="ltr" name="iramo_ai_settings[telegram_bot_username]" value="<?php echo esc_attr( $opts['telegram_bot_username'] ?? '@iRamoBot' ); ?>" style="width:150px;margin-left:8px;" />
                        <input type="text" dir="ltr" name="iramo_telegram_bot_token" value="<?php echo esc_attr( get_option( 'iramo_telegram_bot_token' ) ); ?>" class="regular-text" placeholder="123456:ABC..." />
                    </td>
                </tr>
                <tr>
                    <th>یوزرنیم و توکن ربات بله (Bale)</th>
                    <td>
                        <input type="text" dir="ltr" name="iramo_ai_settings[bale_bot_username]" value="<?php echo esc_attr( $opts['bale_bot_username'] ?? '@iRamoBaleBot' ); ?>" style="width:150px;margin-left:8px;" />
                        <input type="text" dir="ltr" name="iramo_bale_bot_token" value="<?php echo esc_attr( get_option( 'iramo_bale_bot_token' ) ); ?>" class="regular-text" placeholder="987654:XYZ..." />
                    </td>
                </tr>
                <tr>
                    <th>چت آیدی مدیر و کلید پیامک</th>
                    <td>
                        <input type="text" dir="ltr" name="iramo_admin_chat_id" value="<?php echo esc_attr( get_option( 'iramo_admin_chat_id' ) ); ?>" placeholder="Admin Chat ID" style="width:180px;margin-left:8px;" />
                        <input type="text" dir="ltr" name="iramo_ai_settings[sms_api_key]" value="<?php echo esc_attr( $opts['sms_api_key'] ?? '' ); ?>" class="regular-text" placeholder="SMS API Key" />
                    </td>
                </tr>
            </table>
            <?php submit_button( 'ذخیره تنظیمات سایت، سئو، امنیت و ربات‌ها' ); ?>
        </form>

        <div style="background:#fff;padding:24px;border-radius:12px;border:1px solid #dcdcde;margin-top:20px;">
            <h2>صفحات، آرشیوهای سئو و ابزارهای واقعی هوش مصنوعی</h2>
            <p>صفحات عمومی سایت با قالب بومی PHP/HTML و المنتور پرو رندر می‌شوند تا سئو کامل داشته باشند و «پنل کاربری و آموزش» (`/panel`) از اپلیکیشن ری‌اکت استفاده می‌کند. ۱۸ ابزار واقعی AI به‌صورت پست مستقل برای گوگل و المنتور ثبت می‌شوند.</p>
            <div style="display:flex;flex-wrap:wrap;gap:12px;margin-top:14px;">
                <form method="post" action="<?php echo esc_url( admin_url( 'admin-post.php' ) ); ?>">
                    <?php wp_nonce_field( 'iramo_demo_nonce' ); ?>
                    <input type="hidden" name="action" value="iramo_manage_demo_data" />
                    <input type="hidden" name="demo_action" value="provision_pages" />
                    <button type="submit" class="button button-primary">ساخت و همگام‌سازی خودکار برگه‌ها و منو</button>
                </form>

                <form method="post" action="<?php echo esc_url( admin_url( 'admin-post.php' ) ); ?>">
                    <?php wp_nonce_field( 'iramo_demo_nonce' ); ?>
                    <input type="hidden" name="action" value="iramo_manage_demo_data" />
                    <input type="hidden" name="demo_action" value="sync_curated_tools" />
                    <button type="submit" class="button button-secondary">نصب / همگام‌سازی ۱۸ ابزار واقعی هوش مصنوعی</button>
                </form>

                <form method="post" action="<?php echo esc_url( admin_url( 'admin-post.php' ) ); ?>">
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
