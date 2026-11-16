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

    register_post_type( 'iramo_product', [
        'labels' => [
            'name'          => __( 'محصولات نرم‌افزاری iRamo', 'iramo-ai' ),
            'singular_name' => __( 'محصول نرم‌افزاری', 'iramo-ai' ),
            'add_new_item'  => __( 'افزودن محصول جدید', 'iramo-ai' ),
        ],
        'public'       => true,
        'show_in_rest' => true,
        'menu_icon'    => 'dashicons-products',
        'supports'     => [ 'title', 'editor', 'thumbnail', 'excerpt', 'custom-fields' ],
        'has_archive'  => true,
        'rewrite'      => [ 'slug' => 'products' ],
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

    register_post_type( 'iramo_assignment', [
        'labels' => [
            'name'          => __( 'تکالیف و پروژه‌ها', 'iramo-ai' ),
            'singular_name' => __( 'تکلیف', 'iramo-ai' ),
        ],
        'public'       => false,
        'show_ui'      => true,
        'show_in_rest' => true,
        'menu_icon'    => 'dashicons-clipboard',
        'supports'     => [ 'title', 'editor', 'custom-fields' ],
    ] );

    register_taxonomy( 'iramo_tool_task', 'iramo_ai_tool', [
        'label'        => __( 'نوع کار (Task)', 'iramo-ai' ),
        'show_in_rest' => true,
        'hierarchical' => true,
    ] );
} );

/**
 * 1.5 Native Meta Boxes for WooCommerce Products, iramo_product & iramo_ai_tool
 * Every product or AI tool added here automatically inherits the iRamoAi card & 6-section landing page.
 */
add_action( 'add_meta_boxes', function() {
    add_meta_box(
        'iramo_product_landing_box',
        __( 'تنظیمات لندینگ‌پیج خودکار iRamoAi', 'iramo-ai' ),
        function( $post ) {
            wp_nonce_field( 'iramo_save_product_meta', 'iramo_product_meta_nonce' );
            $tagline       = get_post_meta( $post->ID, '_iramo_tagline', true );
            $price_toman   = get_post_meta( $post->ID, '_iramo_price_toman', true );
            $price_usd     = get_post_meta( $post->ID, '_iramo_price_usd', true );
            $billing_label = get_post_meta( $post->ID, '_iramo_billing_label', true );
            $accent        = get_post_meta( $post->ID, '_iramo_accent', true ) ?: 'emerald';
            $linked_course = get_post_meta( $post->ID, '_iramo_linked_course_id', true );
            $highlights    = get_post_meta( $post->ID, '_iramo_highlights', true );
            $metrics       = get_post_meta( $post->ID, '_iramo_metrics', true );
            ?>
            <div dir="rtl" style="display:grid;gap:12px;">
                <p class="description">هر محصولی که اینجا ثبت کنید، به‌صورت خودکار با قالب کارت، دکمه قیمت و لندینگ‌پیج ۶ بخشی iRamoAi نمایش داده می‌شود.</p>
                <p><label><strong>شعار کوتاه زیر عنوان (Tagline):</strong></label><br/>
                <input type="text" name="iramo_tagline" value="<?php echo esc_attr( $tagline ); ?>" style="width:100%;" placeholder="مثلاً: اتوماسیون کامل صدور فاکتور با دقت ۹۹٪" /></p>
                <div style="display:flex;gap:12px;flex-wrap:wrap;">
                    <p style="flex:1;min-width:160px;"><label><strong>قیمت تومان (اگر ووکامرس نباشد):</strong></label><br/>
                    <input type="number" name="iramo_price_toman" value="<?php echo esc_attr( $price_toman ); ?>" style="width:100%;" placeholder="2900000" /></p>
                    <p style="flex:1;min-width:140px;"><label><strong>قیمت دلار (اختیاری):</strong></label><br/>
                    <input type="number" name="iramo_price_usd" value="<?php echo esc_attr( $price_usd ); ?>" style="width:100%;" placeholder="49" /></p>
                    <p style="flex:1;min-width:160px;"><label><strong>نوع لایسنس:</strong></label><br/>
                    <input type="text" name="iramo_billing_label" value="<?php echo esc_attr( $billing_label ); ?>" style="width:100%;" placeholder="لایسنس دائمی" /></p>
                    <p style="flex:1;min-width:140px;"><label><strong>رنگ تاکیدی کارت:</strong></label><br/>
                    <select name="iramo_accent" style="width:100%;">
                        <option value="emerald" <?php selected( $accent, 'emerald' ); ?>>سبز زمردی</option>
                        <option value="blue" <?php selected( $accent, 'blue' ); ?>>آبی برند</option>
                        <option value="amber" <?php selected( $accent, 'amber' ); ?>>طلایی</option>
                        <option value="indigo" <?php selected( $accent, 'indigo' ); ?>>نیلی</option>
                    </select></p>
                </div>
                <p><label><strong>ویژگی‌های کلیدی (هر ویژگی در یک خط):</strong></label><br/>
                <textarea name="iramo_highlights" rows="3" style="width:100%;" placeholder="پشتیبانی ۲۴ ساعته&#10;اتصال به تلگرام و بله&#10;نصب خودکار در ۵ دقیقه"><?php echo esc_textarea( $highlights ); ?></textarea></p>
                <p><label><strong>آمار و متریک‌ها (فرمت: برچسب | مقدار در هر خط):</strong></label><br/>
                <textarea name="iramo_metrics" rows="2" style="width:100%;" placeholder="دقت پردازش | ۹۹.۲٪&#10;صرفه‌جویی زمان | ۱۲ ساعت در هفته"><?php echo esc_textarea( $metrics ); ?></textarea></p>
                <p><label><strong>آیدی دوره متصل آکادمی (برای باندل و ثبت‌نام خودکار):</strong></label><br/>
                <input type="text" dir="ltr" name="iramo_linked_course_id" value="<?php echo esc_attr( $linked_course ); ?>" style="width:260px;" placeholder="course-ai-zero-pro" /></p>
            </div>
            <?php
        },
        [ 'product', 'iramo_product' ],
        'normal',
        'high'
    );

    add_meta_box(
        'iramo_ai_tool_specs_box',
        __( 'مشخصات و برچسب‌های دایرکتوری ابزار AI', 'iramo-ai' ),
        function( $post ) {
            wp_nonce_field( 'iramo_save_tool_meta', 'iramo_tool_meta_nonce' );
            $provider    = get_post_meta( $post->ID, '_iramo_provider', true );
            $tagline     = get_post_meta( $post->ID, '_iramo_tagline', true );
            $task        = get_post_meta( $post->ID, '_iramo_task', true ) ?: 'AI Assistant';
            $input       = get_post_meta( $post->ID, '_iramo_input', true ) ?: 'Text';
            $output      = get_post_meta( $post->ID, '_iramo_output', true ) ?: 'Text';
            $pricing     = get_post_meta( $post->ID, '_iramo_pricing', true ) ?: 'Freemium';
            $tool_url    = get_post_meta( $post->ID, '_iramo_url', true );
            $has_api     = get_post_meta( $post->ID, '_iramo_has_api', true );
            $has_mobile  = get_post_meta( $post->ID, '_iramo_has_mobile', true );
            $features    = get_post_meta( $post->ID, '_iramo_features', true );
            $steps       = get_post_meta( $post->ID, '_iramo_steps', true );
            $prompt_ex   = get_post_meta( $post->ID, '_iramo_sample_prompt', true );
            ?>
            <div dir="rtl" style="display:grid;gap:12px;">
                <div style="display:flex;gap:12px;flex-wrap:wrap;">
                    <p style="flex:1;min-width:180px;"><label><strong>نام شرکت / پلتفرم سازنده:</strong></label><br/>
                    <input type="text" name="iramo_provider" value="<?php echo esc_attr( $provider ); ?>" style="width:100%;" placeholder="OpenAI / Anthropic" /></p>
                    <p style="flex:2;min-width:240px;"><label><strong>توضیح کوتاه کارت:</strong></label><br/>
                    <input type="text" name="iramo_tagline" value="<?php echo esc_attr( $tagline ); ?>" style="width:100%;" /></p>
                </div>
                <div style="display:flex;gap:10px;flex-wrap:wrap;">
                    <p style="flex:1;"><label><strong>دسته‌بندی (Task):</strong></label><br/>
                    <select name="iramo_task" style="width:100%;">
                        <?php foreach ( [ 'AI Assistant', 'Art & Image', 'Video Generation', '3D & Avatar', 'Code Assistant', 'Audio & Music', 'Data & Finance', 'Automation & Agents', 'Writing & SEO', 'Research & Study' ] as $opt ) : ?>
                            <option value="<?php echo esc_attr( $opt ); ?>" <?php selected( $task, $opt ); ?>><?php echo esc_html( $opt ); ?></option>
                        <?php endforeach; ?>
                    </select></p>
                    <p style="flex:1;"><label><strong>ورودی (Input):</strong></label><br/>
                    <select name="iramo_input" style="width:100%;">
                        <?php foreach ( [ 'Text', 'Prompt', 'Image', 'Audio', 'Video', 'Spreadsheet', 'Document' ] as $opt ) : ?>
                            <option value="<?php echo esc_attr( $opt ); ?>" <?php selected( $input, $opt ); ?>><?php echo esc_html( $opt ); ?></option>
                        <?php endforeach; ?>
                    </select></p>
                    <p style="flex:1;"><label><strong>خروجی (Output):</strong></label><br/>
                    <select name="iramo_output" style="width:100%;">
                        <?php foreach ( [ 'Text', 'Image', 'Video', '3D Model', 'Audio', 'Code', 'Dashboard', 'Workflow', 'Presentation' ] as $opt ) : ?>
                            <option value="<?php echo esc_attr( $opt ); ?>" <?php selected( $output, $opt ); ?>><?php echo esc_html( $opt ); ?></option>
                        <?php endforeach; ?>
                    </select></p>
                    <p style="flex:1;"><label><strong>مدل قیمت (Pricing):</strong></label><br/>
                    <select name="iramo_pricing" style="width:100%;">
                        <?php foreach ( [ 'Free', 'Freemium', 'Free Trial', 'Paid' ] as $opt ) : ?>
                            <option value="<?php echo esc_attr( $opt ); ?>" <?php selected( $pricing, $opt ); ?>><?php echo esc_html( $opt ); ?></option>
                        <?php endforeach; ?>
                    </select></p>
                </div>
                <p><label><strong>لینک مستقیم ابزار (URL):</strong></label><br/>
                <input type="url" dir="ltr" name="iramo_url" value="<?php echo esc_attr( $tool_url ); ?>" style="width:100%;" placeholder="https://..." /></p>
                <p>
                    <label style="margin-left:16px;"><input type="checkbox" name="iramo_has_api" value="1" <?php checked( $has_api, '1' ); ?> /> دارای API رسمی</label>
                    <label><input type="checkbox" name="iramo_has_mobile" value="1" <?php checked( $has_mobile, '1' ); ?> /> دارای اپلیکیشن موبایل</label>
                </p>
                <p><label><strong>ویژگی‌های کلیدی صفحه جزئیات (هر مورد در یک خط):</strong></label><br/>
                <textarea name="iramo_features" rows="3" style="width:100%;"><?php echo esc_textarea( $features ); ?></textarea></p>
                <p><label><strong>مراحل گام‌به‌گام استفاده (هر مرحله در یک خط):</strong></label><br/>
                <textarea name="iramo_steps" rows="3" style="width:100%;"><?php echo esc_textarea( $steps ); ?></textarea></p>
                <p><label><strong>نمونه پرامپت آماده (اختیاری):</strong></label><br/>
                <input type="text" name="iramo_sample_prompt" value="<?php echo esc_attr( $prompt_ex ); ?>" style="width:100%;" /></p>
            </div>
            <?php
        },
        'iramo_ai_tool',
        'normal',
        'high'
    );
} );

add_action( 'save_post', function( $post_id ) {
    if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) return;
    if ( ! current_user_can( 'edit_post', $post_id ) ) return;

    if ( isset( $_POST['iramo_product_meta_nonce'] ) && wp_verify_nonce( $_POST['iramo_product_meta_nonce'], 'iramo_save_product_meta' ) ) {
        $text_keys = [
            '_iramo_tagline'          => 'iramo_tagline',
            '_iramo_price_toman'      => 'iramo_price_toman',
            '_iramo_price_usd'        => 'iramo_price_usd',
            '_iramo_billing_label'    => 'iramo_billing_label',
            '_iramo_accent'           => 'iramo_accent',
            '_iramo_linked_course_id' => 'iramo_linked_course_id',
        ];
        foreach ( $text_keys as $meta_key => $field ) {
            if ( isset( $_POST[ $field ] ) ) {
                update_post_meta( $post_id, $meta_key, sanitize_text_field( wp_unslash( $_POST[ $field ] ) ) );
            }
        }
        if ( isset( $_POST['iramo_highlights'] ) ) {
            update_post_meta( $post_id, '_iramo_highlights', sanitize_textarea_field( wp_unslash( $_POST['iramo_highlights'] ) ) );
        }
        if ( isset( $_POST['iramo_metrics'] ) ) {
            update_post_meta( $post_id, '_iramo_metrics', sanitize_textarea_field( wp_unslash( $_POST['iramo_metrics'] ) ) );
        }
    }

    if ( isset( $_POST['iramo_tool_meta_nonce'] ) && wp_verify_nonce( $_POST['iramo_tool_meta_nonce'], 'iramo_save_tool_meta' ) ) {
        $tool_fields = [
            '_iramo_provider'      => 'iramo_provider',
            '_iramo_tagline'       => 'iramo_tagline',
            '_iramo_task'          => 'iramo_task',
            '_iramo_input'         => 'iramo_input',
            '_iramo_output'        => 'iramo_output',
            '_iramo_pricing'       => 'iramo_pricing',
            '_iramo_sample_prompt' => 'iramo_sample_prompt',
        ];
        foreach ( $tool_fields as $meta_key => $field ) {
            if ( isset( $_POST[ $field ] ) ) {
                update_post_meta( $post_id, $meta_key, sanitize_text_field( wp_unslash( $_POST[ $field ] ) ) );
            }
        }
        if ( isset( $_POST['iramo_url'] ) ) {
            update_post_meta( $post_id, '_iramo_url', esc_url_raw( wp_unslash( $_POST['iramo_url'] ) ) );
        }
        update_post_meta( $post_id, '_iramo_has_api', ! empty( $_POST['iramo_has_api'] ) ? '1' : '0' );
        update_post_meta( $post_id, '_iramo_has_mobile', ! empty( $_POST['iramo_has_mobile'] ) ? '1' : '0' );
        if ( isset( $_POST['iramo_features'] ) ) {
            update_post_meta( $post_id, '_iramo_features', sanitize_textarea_field( wp_unslash( $_POST['iramo_features'] ) ) );
        }
        if ( isset( $_POST['iramo_steps'] ) ) {
            update_post_meta( $post_id, '_iramo_steps', sanitize_textarea_field( wp_unslash( $_POST['iramo_steps'] ) ) );
        }
    }
} );

/**
 * 2. WooCommerce Order Completed -> Auto Enroll Student, Generate License Key & Trigger Bot Bridge
 */
add_action( 'woocommerce_order_status_completed', function( $order_id ) {
    if ( ! function_exists( 'wc_get_order' ) ) return;
    $order = wc_get_order( $order_id );
    if ( ! $order ) return;

    $user_id = $order->get_user_id();
    if ( ! $user_id ) return;

    $enrolled = get_user_meta( $user_id, '_iramo_enrolled_courses', true );
    if ( ! is_array( $enrolled ) ) $enrolled = [];

    $licenses = $order->get_meta( '_iramo_license_keys' );
    if ( ! is_array( $licenses ) ) $licenses = [];

    foreach ( $order->get_items() as $item_id => $item ) {
        $product_id       = $item->get_product_id();
        $linked_course_id = trim( (string) get_post_meta( $product_id, '_iramo_linked_course_id', true ) );
        if ( $linked_course_id !== '' ) {
            $normalized_course_id = is_numeric( $linked_course_id ) ? ( 'wp-course-' . $linked_course_id ) : $linked_course_id;
            if ( ! in_array( $normalized_course_id, $enrolled, true ) ) {
                $enrolled[] = $normalized_course_id;
            }
        }
        if ( empty( $licenses[ $item_id ] ) ) {
            $licenses[ $item_id ] = strtoupper( 'IRAMO-' . wp_generate_password( 4, false, false ) . '-' . wp_generate_password( 4, false, false ) . '-' . $order_id );
        }
    }

    $order->update_meta_data( '_iramo_license_keys', $licenses );
    $order->save();

    update_user_meta( $user_id, '_iramo_enrolled_courses', array_values( array_unique( $enrolled ) ) );
    do_action( 'iramo_lms_order_delivered', $order_id, $user_id, $enrolled );
} );

/**
 * Helper: Build Authenticated WP User Payload (Profile, Courses, WC Transactions, Assignments)
 */
function iramo_build_user_payload( $user_id ) {
    $user = get_userdata( $user_id );
    if ( ! $user ) return null;

    $enrolled  = get_user_meta( $user_id, '_iramo_enrolled_courses', true );
    if ( ! is_array( $enrolled ) ) $enrolled = [];

    $completed = get_user_meta( $user_id, '_iramo_completed_lessons', true );
    if ( ! is_array( $completed ) ) $completed = [];

    $transactions = [];
    if ( function_exists( 'wc_get_orders' ) ) {
        $orders = wc_get_orders( [
            'customer_id' => $user_id,
            'limit'       => 30,
            'orderby'     => 'date',
            'order'       => 'DESC',
        ] );
        foreach ( $orders as $order ) {
            $item_names = [];
            foreach ( $order->get_items() as $item ) {
                $item_names[] = $item->get_name();
            }
            $licenses = $order->get_meta( '_iramo_license_keys' );
            $first_license = ( is_array( $licenses ) && ! empty( $licenses ) ) ? reset( $licenses ) : '';
            $date_created = $order->get_date_created();
            $date_str = $date_created ? $date_created->date_i18n( 'Y/m/d' ) : '';
            $total_toman = (int) $order->get_total();

            $transactions[] = [
                'id'          => 'wc-ord-' . $order->get_id(),
                'invoiceNo'   => '#' . $order->get_order_number(),
                'item'        => [
                    'fa' => implode( ' + ', $item_names ) ?: 'سفارش ووکامرس',
                    'en' => implode( ' + ', $item_names ) ?: 'WooCommerce Order',
                ],
                'amountToman' => $total_toman,
                'amountUsd'   => max( 1, (int) round( $total_toman / 60000 ) ),
                'date'        => [ 'fa' => $date_str, 'en' => $date_str ],
                'status'      => $order->get_status() === 'completed' ? 'paid' : ( $order->get_status() === 'failed' ? 'failed' : 'pending' ),
                'licenseKey'  => $first_license ?: null,
            ];
        }
    }

    $submissions = get_user_meta( $user_id, '_iramo_assignment_submissions', true );
    if ( ! is_array( $submissions ) ) $submissions = [];

    $asg_posts = get_posts( [
        'post_type'      => 'iramo_assignment',
        'post_status'    => 'publish',
        'posts_per_page' => 50,
    ] );
    $assignments = [];
    foreach ( $asg_posts as $ap ) {
        $aid   = 'wp-asg-' . $ap->ID;
        $sub   = $submissions[ $aid ] ?? null;
        $due   = get_post_meta( $ap->ID, '_iramo_due_date', true ) ?: get_the_date( 'Y/m/d', $ap->ID );
        $cid   = get_post_meta( $ap->ID, '_iramo_course_id', true ) ?: '';
        $max_s = (int) ( get_post_meta( $ap->ID, '_iramo_max_score', true ) ?: 100 );
        $title = get_the_title( $ap->ID );

        $assignments[] = [
            'id'           => $aid,
            'courseId'     => $cid,
            'title'        => [ 'fa' => $title, 'en' => $title ],
            'dueDate'      => [ 'fa' => $due, 'en' => $due ],
            'status'       => is_array( $sub ) && ! empty( $sub['status'] ) ? $sub['status'] : 'pending',
            'score'        => is_array( $sub ) && isset( $sub['score'] ) ? (int) $sub['score'] : null,
            'maxScore'     => $max_s,
            'submittedUrl' => is_array( $sub ) && ! empty( $sub['url'] ) ? $sub['url'] : null,
            'feedback'     => is_array( $sub ) && ! empty( $sub['feedback'] )
                ? [ 'fa' => $sub['feedback'], 'en' => $sub['feedback'] ]
                : null,
        ];
    }

    return [
        'id'           => $user->ID,
        'name'         => $user->display_name ?: $user->user_login,
        'email'        => $user->user_email,
        'isAdmin'      => user_can( $user_id, 'manage_options' ),
        'telegramId'   => get_user_meta( $user_id, '_iramo_telegram_handle', true ) ?: get_user_meta( $user_id, '_iramo_telegram_chat_id', true ) ?: '',
        'balePhone'    => get_user_meta( $user_id, '_iramo_bale_chat_id', true ) ?: '',
        'phone'        => get_user_meta( $user_id, '_iramo_phone', true ) ?: get_user_meta( $user_id, 'billing_phone', true ) ?: '',
        'authMethod'   => get_user_meta( $user_id, '_iramo_auth_method', true ) ?: 'email',
        'enrolled'     => array_values( array_map( 'strval', $enrolled ) ),
        'completed'    => array_keys( $completed ),
        'transactions' => $transactions,
        'assignments'  => $assignments,
        'botPrefs'     => get_user_meta( $user_id, '_iramo_bot_prefs', true ) ?: [
            'autoLicense'  => true,
            'lessonAlerts' => true,
            'otpLogin'     => true,
        ],
        'nonce'        => wp_create_nonce( 'wp_rest' ),
        'restUrl'      => esc_url_raw( rest_url( 'iramo/v1/' ) ),
    ];
}

/**
 * 3. REST API for Progress, Enrollment, Assignments, Newsletter & Admin Config
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

    register_rest_route( 'iramo/v1', '/enroll', [
        'methods'             => 'POST',
        'permission_callback' => function() { return is_user_logged_in(); },
        'callback'            => function( WP_REST_Request $request ) {
            $user_id   = get_current_user_id();
            $course_id = sanitize_text_field( $request->get_param( 'course_id' ) );
            if ( empty( $course_id ) ) {
                return new WP_Error( 'missing_course', 'Course ID required', [ 'status' => 400 ] );
            }
            $enrolled = get_user_meta( $user_id, '_iramo_enrolled_courses', true );
            if ( ! is_array( $enrolled ) ) $enrolled = [];
            if ( ! in_array( $course_id, $enrolled, true ) ) {
                $enrolled[] = $course_id;
                update_user_meta( $user_id, '_iramo_enrolled_courses', $enrolled );
            }
            return rest_ensure_response( [ 'success' => true, 'enrolled' => $enrolled ] );
        },
    ] );

    register_rest_route( 'iramo/v1', '/assignments/submit', [
        'methods'             => 'POST',
        'permission_callback' => function() { return is_user_logged_in(); },
        'callback'            => function( WP_REST_Request $request ) {
            $user_id       = get_current_user_id();
            $assignment_id = sanitize_text_field( $request->get_param( 'assignment_id' ) );
            $url           = esc_url_raw( $request->get_param( 'url' ) );
            if ( empty( $assignment_id ) || empty( $url ) ) {
                return new WP_Error( 'invalid_submission', 'Assignment ID and valid URL are required', [ 'status' => 400 ] );
            }
            $submissions = get_user_meta( $user_id, '_iramo_assignment_submissions', true );
            if ( ! is_array( $submissions ) ) $submissions = [];
            $submissions[ $assignment_id ] = [
                'url'          => $url,
                'status'       => 'submitted',
                'submitted_at' => current_time( 'mysql' ),
            ];
            update_user_meta( $user_id, '_iramo_assignment_submissions', $submissions );

            $admin_chat = get_option( 'iramo_admin_chat_id' );
            if ( $admin_chat && class_exists( 'iRamo_Messenger_Bridge' ) ) {
                $user = wp_get_current_user();
                $msg  = sprintf( "<b>ارسال تمرین جدید</b>\\nدانشجو: %s\\nتکلیف: %s\\nلینک: %s", esc_html( $user->display_name ), esc_html( $assignment_id ), esc_url( $url ) );
                iRamo_Messenger_Bridge::send_message( 'telegram', $admin_chat, $msg );
                iRamo_Messenger_Bridge::send_message( 'bale', $admin_chat, $msg );
            }

            return rest_ensure_response( [ 'success' => true, 'submission' => $submissions[ $assignment_id ] ] );
        },
    ] );

    register_rest_route( 'iramo/v1', '/newsletter', [
        'methods'             => 'POST',
        'permission_callback' => '__return_true',
        'callback'            => function( WP_REST_Request $request ) {
            $channel = sanitize_text_field( $request->get_param( 'channel' ) ?: 'telegram' );
            $handle  = sanitize_text_field( $request->get_param( 'handle' ) );
            if ( empty( $handle ) ) {
                return new WP_Error( 'missing_handle', 'Handle or phone is required', [ 'status' => 400 ] );
            }
            $subs = get_option( 'iramo_newsletter_subscribers', [] );
            if ( ! is_array( $subs ) ) $subs = [];
            $subs[ $channel . '_' . strtolower( $handle ) ] = [
                'channel' => $channel,
                'handle'  => $handle,
                'date'    => current_time( 'mysql' ),
            ];
            update_option( 'iramo_newsletter_subscribers', $subs );
            return rest_ensure_response( [ 'success' => true, 'channel' => $channel, 'handle' => $handle ] );
        },
    ] );

    register_rest_route( 'iramo/v1', '/admin/settings', [
        'methods'             => 'POST',
        'permission_callback' => function() { return current_user_can( 'manage_options' ); },
        'callback'            => function( WP_REST_Request $request ) {
            $payload = $request->get_json_params();
            if ( ! is_array( $payload ) ) {
                return new WP_Error( 'invalid_payload', 'Invalid settings JSON', [ 'status' => 400 ] );
            }
            $opts = get_option( 'iramo_ai_settings', [] );
            if ( ! is_array( $opts ) ) $opts = [];

            if ( isset( $payload['brandTitle'] ) ) {
                $opts['brand_name'] = sanitize_text_field( $payload['brandTitle'] );
            }
            if ( isset( $payload['fontFamily'] ) ) {
                $opts['font_family'] = sanitize_text_field( $payload['fontFamily'] );
            }
            if ( isset( $payload['customFontName'] ) ) {
                $opts['custom_font_name'] = sanitize_text_field( $payload['customFontName'] );
            }
            if ( isset( $payload['customFontCssUrl'] ) ) {
                $opts['custom_font_css_url'] = esc_url_raw( $payload['customFontCssUrl'] );
            }
            if ( isset( $payload['themeColors'] ) && is_array( $payload['themeColors'] ) ) {
                $tc = $payload['themeColors'];
                $opts['color_preset']       = sanitize_text_field( $tc['preset'] ?? ( $opts['color_preset'] ?? 'emerald-classic' ) );
                $opts['primary_color']      = sanitize_hex_color( $tc['primaryHex'] ?? '' ) ?: ( $opts['primary_color'] ?? '#059669' );
                $opts['accent_color']       = sanitize_hex_color( $tc['accentHex'] ?? '' ) ?: ( $opts['accent_color'] ?? '#FFBA00' );
                $opts['light_canvas_color'] = sanitize_hex_color( $tc['lightCanvasHex'] ?? '' ) ?: ( $opts['light_canvas_color'] ?? '#F8FAFC' );
                $opts['border_intensity']   = sanitize_text_field( $tc['borderIntensity'] ?? 'subtle' );
            }
            if ( isset( $payload['quickTips'] ) && is_array( $payload['quickTips'] ) ) {
                $lines = [];
                foreach ( $payload['quickTips'] as $tip ) {
                    if ( is_array( $tip ) && ! empty( $tip['fa'] ) ) {
                        $lines[] = sanitize_text_field( $tip['fa'] );
                    }
                }
                $opts['quick_tips_text'] = implode( "\\n", $lines );
            }
            if ( isset( $payload['authChannels'] ) && is_array( $payload['authChannels'] ) ) {
                $ac = $payload['authChannels'];
                $opts['enable_telegram_auth']  = ! empty( $ac['telegram'] ) ? 1 : 0;
                $opts['enable_bale_auth']      = ! empty( $ac['bale'] ) ? 1 : 0;
                $opts['enable_sms_auth']       = ! empty( $ac['sms'] ) ? 1 : 0;
                $opts['enable_email_auth']     = ! empty( $ac['email'] ) ? 1 : 0;
                $opts['default_auth_channel']  = sanitize_text_field( $ac['defaultChannel'] ?? 'telegram' );
                $opts['allow_registration']    = ! empty( $ac['allowRegistration'] ) ? 1 : 0;
                $opts['telegram_bot_username'] = sanitize_text_field( $ac['telegramBotUsername'] ?? '@iRamoBot' );
                $opts['bale_bot_username']     = sanitize_text_field( $ac['baleBotUsername'] ?? '@iRamoBaleBot' );
                $opts['sms_provider']          = sanitize_text_field( $ac['smsProvider'] ?? 'kavenegar' );
                $opts['sms_pattern_code']      = sanitize_text_field( $ac['smsPatternCode'] ?? 'iramo-verify-otp' );
            }
            if ( isset( $payload['demoCleared'] ) ) {
                $opts['demo_cleared'] = ! empty( $payload['demoCleared'] ) ? 1 : 0;
            }

            update_option( 'iramo_ai_settings', $opts );
            return rest_ensure_response( [ 'success' => true ] );
        },
    ] );
} );

/**
 * 3.5 Serialize Published WooCommerce & CPT Items into App Data Payloads
 */
function iramo_collect_wp_products() {
    $posts = get_posts( [
        'post_type'      => [ 'product', 'iramo_product' ],
        'post_status'    => 'publish',
        'posts_per_page' => 50,
    ] );
    $items = [];
    foreach ( $posts as $p ) {
        $pid       = $p->ID;
        $title     = get_the_title( $pid );
        $excerpt   = wp_strip_all_tags( get_the_excerpt( $pid ) ?: wp_trim_words( $p->post_content, 28 ) );
        $thumb     = get_the_post_thumbnail_url( $pid, 'large' ) ?: '';
        $tagline   = get_post_meta( $pid, '_iramo_tagline', true ) ?: $excerpt;
        $price_tom = (int) get_post_meta( $pid, '_iramo_price_toman', true );
        $price_usd = (int) get_post_meta( $pid, '_iramo_price_usd', true );
        $cat_label = 'محصول نرم‌افزاری';

        if ( $p->post_type === 'product' && function_exists( 'wc_get_product' ) ) {
            $wc = wc_get_product( $pid );
            if ( $wc ) {
                if ( ! $price_tom && $wc->get_price() !== '' ) {
                    $price_tom = (int) $wc->get_price();
                }
                if ( ! $tagline && $wc->get_short_description() ) {
                    $tagline = wp_strip_all_tags( $wc->get_short_description() );
                }
            }
            $terms = get_the_terms( $pid, 'product_cat' );
            if ( is_array( $terms ) && ! empty( $terms ) ) {
                $cat_label = $terms[0]->name;
            }
        }
        if ( ! $price_usd && $price_tom > 0 ) {
            $price_usd = max( 9, (int) round( $price_tom / 60000 ) );
        }

        $raw_hl     = get_post_meta( $pid, '_iramo_highlights', true );
        $highlights = array_values( array_filter( array_map( 'trim', explode( "\\n", $raw_hl ) ) ) );
        if ( empty( $highlights ) ) {
            $highlights = [
                'نصب سریع و آماده استفاده در سایت و پنل کاربری',
                'اتصال یکپارچه با سیستم ثبت‌نام و درگاه پرداخت ووکامرس',
                'پشتیبانی فنی و به‌روزرسانی منظم در پنل اختصاصی',
            ];
        }

        $raw_metrics = get_post_meta( $pid, '_iramo_metrics', true );
        $metrics     = [];
        foreach ( array_filter( array_map( 'trim', explode( "\\n", $raw_metrics ) ) ) as $line ) {
            $parts = array_map( 'trim', explode( '|', $line ) );
            if ( count( $parts ) >= 2 ) {
                $metrics[] = [
                    'label' => [ 'fa' => $parts[0], 'en' => $parts[0] ],
                    'value' => [ 'fa' => $parts[1], 'en' => $parts[1] ],
                ];
            }
        }
        if ( empty( $metrics ) ) {
            $metrics = [
                [ 'label' => [ 'fa' => 'راه‌اندازی', 'en' => 'Setup' ], 'value' => [ 'fa' => 'فوری', 'en' => 'Instant' ] ],
                [ 'label' => [ 'fa' => 'پشتیبانی', 'en' => 'Support' ], 'value' => [ 'fa' => 'تیکت و ربات', 'en' => '24/7' ] ],
            ];
        }

        $billing = get_post_meta( $pid, '_iramo_billing_label', true ) ?: 'لایسنس دائمی';
        $accent  = get_post_meta( $pid, '_iramo_accent', true ) ?: 'emerald';
        $linked  = get_post_meta( $pid, '_iramo_linked_course_id', true );

        $checkout_url = ( $p->post_type === 'product' && function_exists( 'wc_get_checkout_url' ) )
            ? add_query_arg( 'add-to-cart', $pid, wc_get_checkout_url() )
            : get_permalink( $pid );

        $items[] = [
            'id'             => 'wp-prod-' . $pid,
            'slug'           => $p->post_name ?: ( 'wp-prod-' . $pid ),
            'name'           => [ 'fa' => $title, 'en' => $title ],
            'category'       => [ 'fa' => $cat_label, 'en' => $cat_label ],
            'tagline'        => [ 'fa' => $tagline ?: $title, 'en' => $tagline ?: $title ],
            'description'    => [ 'fa' => $excerpt ?: $tagline, 'en' => $excerpt ?: $tagline ],
            'accent'         => in_array( $accent, [ 'emerald', 'blue', 'amber', 'indigo' ], true ) ? $accent : 'emerald',
            'thumbnail'      => $thumb,
            'priceToman'     => $price_tom ?: 1900000,
            'priceUsd'       => $price_usd ?: 29,
            'billingLabel'   => [ 'fa' => $billing, 'en' => $billing ],
            'highlights'     => [ 'fa' => $highlights, 'en' => $highlights ],
            'demoMetrics'    => $metrics,
            'linkedCourseId' => $linked ?: null,
            'checkoutUrl'    => $checkout_url,
            'isDemo'         => false,
        ];
    }
    return $items;
}

function iramo_collect_wp_tools() {
    $posts = get_posts( [
        'post_type'      => 'iramo_ai_tool',
        'post_status'    => 'publish',
        'posts_per_page' => 100,
    ] );
    $items = [];
    foreach ( $posts as $p ) {
        $pid       = $p->ID;
        $title     = get_the_title( $pid );
        $desc      = wp_strip_all_tags( $p->post_content ?: get_the_excerpt( $pid ) );
        $tagline   = get_post_meta( $pid, '_iramo_tagline', true ) ?: wp_trim_words( $desc, 16 );
        $features  = array_values( array_filter( array_map( 'trim', explode( "\\n", get_post_meta( $pid, '_iramo_features', true ) ) ) ) );
        $steps     = array_values( array_filter( array_map( 'trim', explode( "\\n", get_post_meta( $pid, '_iramo_steps', true ) ) ) ) );
        $prompt_ex = get_post_meta( $pid, '_iramo_sample_prompt', true );

        $items[] = [
            'id'              => 'wp-tool-' . $pid,
            'name'            => $title,
            'provider'        => get_post_meta( $pid, '_iramo_provider', true ) ?: 'iRamo Partner',
            'tagline'         => [ 'fa' => $tagline ?: $title, 'en' => $tagline ?: $title ],
            'task'            => get_post_meta( $pid, '_iramo_task', true ) ?: 'AI Assistant',
            'input'           => get_post_meta( $pid, '_iramo_input', true ) ?: 'Text',
            'output'          => get_post_meta( $pid, '_iramo_output', true ) ?: 'Text',
            'pricing'         => get_post_meta( $pid, '_iramo_pricing', true ) ?: 'Freemium',
            'hasApi'          => get_post_meta( $pid, '_iramo_has_api', true ) === '1',
            'hasMobileApp'    => get_post_meta( $pid, '_iramo_has_mobile', true ) === '1',
            'verified'        => true,
            'popularityScore' => 94,
            'thumbnail'       => get_the_post_thumbnail_url( $pid, 'medium' ) ?: '',
            'isDemo'          => false,
            'url'             => get_post_meta( $pid, '_iramo_url', true ) ?: get_permalink( $pid ),
            'description'     => [ 'fa' => $desc ?: $tagline, 'en' => $desc ?: $tagline ],
            'longDescription' => [ 'fa' => [ $desc ?: $tagline ], 'en' => [ $desc ?: $tagline ] ],
            'keyFeatures'     => ! empty( $features ) ? [ 'fa' => $features, 'en' => $features ] : null,
            'steps'           => ! empty( $steps ) ? [ 'fa' => $steps, 'en' => $steps ] : null,
            'samplePrompt'    => $prompt_ex ? [ 'fa' => $prompt_ex, 'en' => $prompt_ex ] : null,
        ];
    }
    return $items;
}

function iramo_collect_wp_courses() {
    $posts = get_posts( [
        'post_type'      => 'iramo_course',
        'post_status'    => 'publish',
        'posts_per_page' => 50,
    ] );
    $items = [];
    foreach ( $posts as $p ) {
        $pid     = $p->ID;
        $title   = get_the_title( $pid );
        $desc    = wp_strip_all_tags( $p->post_content ?: get_the_excerpt( $pid ) ) ?: $title;
        $excerpt = wp_strip_all_tags( get_the_excerpt( $pid ) ?: wp_trim_words( $desc, 16 ) );
        $author  = get_the_author_meta( 'display_name', $p->post_author ) ?: 'آکادمی iRamoAi';
        $hours   = (int) ( get_post_meta( $pid, '_iramo_duration_hours', true ) ?: 12 );
        $items[] = [
            'id'            => 'wp-course-' . $pid,
            'slug'          => $p->post_name ?: ( 'wp-course-' . $pid ),
            'title'         => [ 'fa' => $title, 'en' => $title ],
            'subtitle'      => [ 'fa' => $excerpt, 'en' => $excerpt ],
            'description'   => [ 'fa' => $desc, 'en' => $desc ],
            'category'      => 'AI',
            'format'        => 'Video',
            'durationTier'  => $hours > 15 ? 'long' : ( $hours >= 6 ? 'medium' : 'short' ),
            'totalDuration' => [ 'fa' => $hours . ' ساعت', 'en' => $hours . ' hrs' ],
            'lessonCount'   => 1,
            'moduleCount'   => 1,
            'enrolled'      => false,
            'featured'      => false,
            'isDemo'        => false,
            'accentColor'   => 'emerald',
            'thumbnail'     => get_the_post_thumbnail_url( $pid, 'large' ) ?: '',
            'instructor'    => [ 'fa' => $author, 'en' => $author ],
            'priceToman'    => (int) ( get_post_meta( $pid, '_iramo_price_toman', true ) ?: 2900000 ),
            'priceUsd'      => (int) ( get_post_meta( $pid, '_iramo_price_usd', true ) ?: 49 ),
            'modules'       => [
                [
                    'id'      => 'wp-mod-' . $pid . '-1',
                    'title'   => [ 'fa' => 'فصل اول: معرفی و شروع سریع', 'en' => 'Module 1: Overview & Setup' ],
                    'lessons' => [
                        [
                            'id'              => 'wp-lesson-' . $pid . '-1',
                            'title'           => [ 'fa' => 'معرفی و شروع سریع دوره', 'en' => 'Course Overview & Setup' ],
                            'duration'        => '18:00',
                            'durationMinutes' => 18,
                            'type'            => 'video',
                            'isFreePreview'   => true,
                            'summary'         => [ 'fa' => $excerpt, 'en' => $excerpt ],
                            'keyTakeaways'    => [
                                'fa' => [ 'آشنایی کامل با نقشه راه دوره' ],
                                'en' => [ 'Complete course roadmap overview' ],
                            ],
                        ],
                    ],
                ],
            ],
        ];
    }
    return $items;
}

function iramo_collect_wp_articles() {
    $posts = get_posts( [
        'post_type'      => [ 'iramo_article', 'post' ],
        'post_status'    => 'publish',
        'posts_per_page' => 50,
    ] );
    $items = [];
    foreach ( $posts as $p ) {
        if ( $p->post_type === 'post' && $p->post_name === 'hello-world' ) {
            continue;
        }
        $pid     = $p->ID;
        $title   = get_the_title( $pid );
        $content = wp_strip_all_tags( $p->post_content );
        $excerpt = wp_strip_all_tags( get_the_excerpt( $pid ) ?: wp_trim_words( $content, 24 ) );
        $author  = get_the_author_meta( 'display_name', $p->post_author ) ?: 'تحریریه iRamoAi';
        $wp_tags = get_the_tags( $pid );
        $tags_fa = [];
        if ( is_array( $wp_tags ) && ! empty( $wp_tags ) ) {
            foreach ( array_slice( $wp_tags, 0, 4 ) as $t ) {
                $tags_fa[] = $t->name;
            }
        }
        if ( empty( $tags_fa ) ) {
            $tags_fa = [ 'iRamoAi', 'مقاله تخصصی' ];
        }
        $items[] = [
            'id'          => 'wp-art-' . $pid,
            'slug'        => $p->post_name ?: ( 'wp-art-' . $pid ),
            'title'       => [ 'fa' => $title, 'en' => $title ],
            'excerpt'     => [ 'fa' => $excerpt, 'en' => $excerpt ],
            'category'    => 'AI',
            'tags'        => [ 'fa' => $tags_fa, 'en' => $tags_fa ],
            'author'      => [ 'fa' => $author, 'en' => $author ],
            'publishedAt' => [ 'fa' => get_the_date( 'j F Y', $pid ), 'en' => get_the_date( 'M j, Y', $pid ) ],
            'readMinutes' => max( 2, (int) ceil( str_word_count( $content ) / 180 ) ),
            'views'       => 140,
            'featured'    => false,
            'isDemo'      => false,
            'thumbnail'   => get_the_post_thumbnail_url( $pid, 'large' ) ?: '',
            'sections'    => [
                [
                    'id'      => 'sec-' . $pid . '-1',
                    'heading' => [ 'fa' => $title, 'en' => $title ],
                    'body'    => [ 'fa' => $content ?: $excerpt, 'en' => $content ?: $excerpt ],
                ],
            ],
        ];
    }
    return $items;
}

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

    $user_payload = is_user_logged_in() ? iramo_build_user_payload( get_current_user_id() ) : null;

    $has_bundled_custom_font = file_exists( IRAMO_AI_PATH . 'assets/fonts/custom-font.css' );
    $font_choice = $options['font_family'] ?? ( $has_bundled_custom_font ? 'custom' : 'vazirmatn' );
    $custom_font_name = ! empty( $options['custom_font_name'] ) ? $options['custom_font_name'] : 'IRANYekanXVF';
    $font_urls = [
        'vazirmatn'   => 'https://fonts.googleapis.com/css2?family=Vazirmatn:wght@400;500;600;700;800&display=swap',
        'rubik'       => 'https://fonts.googleapis.com/css2?family=Rubik:wght@400;500;600;700;800&display=swap',
        'readex'      => 'https://fonts.googleapis.com/css2?family=Readex+Pro:wght@400;500;600;700&display=swap',
        'noto-arabic' => 'https://fonts.googleapis.com/css2?family=Noto+Sans+Arabic:wght@400;500;600;700;800&display=swap',
    ];
    $custom_font_css_url = ! empty( $options['custom_font_css_url'] )
        ? esc_url_raw( $options['custom_font_css_url'] )
        : ( $has_bundled_custom_font ? IRAMO_AI_URL . 'assets/fonts/custom-font.css' : '' );

    // Keep Vazirmatn enqueued as silent fallback alongside custom font
    if ( $font_choice === 'custom' && ! empty( $custom_font_css_url ) ) {
        wp_enqueue_style( 'iramo-custom-font', $custom_font_css_url, [], IRAMO_AI_VERSION );
        wp_enqueue_style( 'iramo-fallback-font', $font_urls['vazirmatn'], [], null );
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

    $wp_products = iramo_collect_wp_products();
    $wp_tools    = iramo_collect_wp_tools();
    $wp_courses  = iramo_collect_wp_courses();
    $wp_articles = iramo_collect_wp_articles();

    ob_start();
    ?>
    <div
      id="iramo-lms-root"
      data-theme="<?php echo esc_attr( $atts['theme'] ); ?>"
      data-lang="<?php echo esc_attr( $atts['lang'] ); ?>"
      data-view="<?php echo esc_attr( $atts['view'] ); ?>"
      data-font="<?php echo esc_attr( $font_choice ); ?>"
      data-custom-font="<?php echo esc_attr( $custom_font_name ); ?>"
      data-custom-font-css-url="<?php echo esc_attr( $custom_font_css_url ); ?>"
      data-brand-name="<?php echo esc_attr( $options['brand_name'] ?? 'iRamoAi' ); ?>"
      data-color-config="<?php echo esc_attr( wp_json_encode( $color_config ) ); ?>"
      data-auth-config="<?php echo esc_attr( wp_json_encode( $auth_config ) ); ?>"
      data-quick-tips="<?php echo esc_attr( wp_json_encode( $quick_tips ) ); ?>"
      data-products="<?php echo esc_attr( wp_json_encode( $wp_products ) ); ?>"
      data-tools="<?php echo esc_attr( wp_json_encode( $wp_tools ) ); ?>"
      data-courses="<?php echo esc_attr( wp_json_encode( $wp_courses ) ); ?>"
      data-articles="<?php echo esc_attr( wp_json_encode( $wp_articles ) ); ?>"
      data-demo-cleared="<?php echo ! empty( $options['demo_cleared'] ) ? '1' : '0'; ?>"
      data-plugin-url="<?php echo esc_url( IRAMO_AI_URL ); ?>"
      data-rest-url="<?php echo esc_url( rest_url( 'iramo/v1/' ) ); ?>"
      data-wp-nonce="<?php echo esc_attr( wp_create_nonce( 'wp_rest' ) ); ?>"
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
    $post_types  = [ 'iramo_product', 'iramo_course', 'iramo_ai_tool', 'iramo_article' ];

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
                        <?php $admin_default_font = file_exists( IRAMO_AI_PATH . 'assets/fonts/custom-font.css' ) ? 'custom' : 'vazirmatn'; ?>
                        <select name="iramo_ai_settings[font_family]">
                            <option value="custom" <?php selected( $opts['font_family'] ?? $admin_default_font, 'custom' ); ?>>فونت اختصاصی آپلودشده (IRANYekanXVF وریبل)</option>
                            <option value="vazirmatn" <?php selected( $opts['font_family'] ?? $admin_default_font, 'vazirmatn' ); ?>>وزیرمتن (Vazirmatn)</option>
                            <option value="rubik" <?php selected( $opts['font_family'] ?? $admin_default_font, 'rubik' ); ?>>روبیک (Rubik)</option>
                            <option value="readex" <?php selected( $opts['font_family'] ?? $admin_default_font, 'readex' ); ?>>ریدکس پرو (Readex Pro)</option>
                            <option value="noto-arabic" <?php selected( $opts['font_family'] ?? $admin_default_font, 'noto-arabic' ); ?>>نوتو سنس فارسی (Noto Sans Arabic)</option>
                        </select>
                    </td>
                </tr>
                <tr>
                    <th>نام فونت اختصاصی (Font Family)</th>
                    <td>
                        <input type="text" dir="ltr" name="iramo_ai_settings[custom_font_name]" value="<?php echo esc_attr( $opts['custom_font_name'] ?? 'IRANYekanXVF' ); ?>" class="regular-text" placeholder="IRANYekanXVF" />
                        <p class="description">پیش‌فرض روی <code>IRANYekanXVF</code> (یا <code>IramoCustomFont</code>) تنظیم شده است.</p>
                    </td>
                </tr>
                <tr>
                    <th>آدرس فایل CSS فونت اختصاصی (اختیاری)</th>
                    <td>
                        <input type="url" dir="ltr" name="iramo_ai_settings[custom_font_css_url]" value="<?php echo esc_attr( $opts['custom_font_css_url'] ?? '' ); ?>" class="regular-text" placeholder="assets/fonts/custom-font.css" />
                        <p class="description">اگر فایل‌های فونت (.woff2) را در پوشه گیت‌هاب <code>public/fonts/</code> آپلود کرده باشید، به‌صورت خودکار داخل بسته افزونه قرار می‌گیرد و خالی گذاشتن این فیلد کافی است.</p>
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
                    echo '<article style="background:var(--iramo-card-bg,#ffffff);border:1px solid var(--iramo-card-border,rgba(5,150,105,0.16));border-radius:16px;padding:18px;box-shadow:0 1px 3px rgba(15,23,42,0.06);">';
                    echo '<h3 style="margin:0 0 8px;font-size:16px;"><a href="' . esc_url( get_permalink() ) . '" style="color:inherit;text-decoration:none;">' . esc_html( get_the_title() ) . '</a></h3>';
                    echo '<p style="font-size:13px;opacity:0.75;margin:0 0 12px;">' . esc_html( get_the_excerpt() ) . '</p>';
                    echo '<a href="' . esc_url( get_permalink() ) . '" style="color:var(--iramo-primary,#059669);font-size:12px;font-weight:bold;text-decoration:none;">مطالعه مقاله ←</a>';
                    echo '</article>';
                }
                wp_reset_postdata();
            } else {
                echo '<p style="opacity:0.7;">هنوز مقاله‌ای منتشر نشده است.</p>';
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
    public static function resolve_bot_chat_id( $channel, $target ) {
        $cleaned = trim( (string) $target );
        if ( preg_match( '/^-?[0-9]{5,}$/', $cleaned ) ) {
            return $cleaned;
        }
        $normalized = ltrim( strtolower( $cleaned ), '@' );
        $map = get_option( 'iramo_bot_chat_map_' . $channel, [] );
        if ( is_array( $map ) && ! empty( $map[ $normalized ] ) ) {
            return (string) $map[ $normalized ];
        }
        return '';
    }

    public static function dispatch_otp( $channel, $target, $code ) {
        $opts = get_option( 'iramo_ai_settings', [] );

        if ( $channel === 'telegram' || $channel === 'bale' ) {
            $chat_id = self::resolve_bot_chat_id( $channel, $target );
            if ( empty( $chat_id ) ) {
                $bot_user = $channel === 'bale'
                    ? ( $opts['bale_bot_username'] ?? '@iRamoBaleBot' )
                    : ( $opts['telegram_bot_username'] ?? '@iRamoBot' );
                return new WP_Error(
                    'bot_not_started',
                    sprintf( 'ابتدا در %s دستور /start را بزنید تا شناسه چت شما ثبت شود، یا شناسه عددی چت را وارد کنید.', $bot_user ),
                    [ 'status' => 400 ]
                );
            }
            $msg = sprintf( "کد تایید ورود به پنل کاربری iRamoAi:\\n<b>%s</b>\\nاعتبار کد: ۳ دقیقه", $code );
            return iRamo_Messenger_Bridge::send_message( $channel, $chat_id, $msg );
        }

        if ( $channel === 'sms' ) {
            $provider = $opts['sms_provider'] ?? 'kavenegar';
            $api_key  = $opts['sms_api_key'] ?? '';
            $pattern  = $opts['sms_pattern_code'] ?? 'iramo-verify-otp';
            if ( empty( $api_key ) ) {
                return new WP_Error( 'missing_sms_key', 'کلید API پنل پیامکی در تنظیمات وردپرس وارد نشده است.', [ 'status' => 400 ] );
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

        return new WP_Error( 'unsupported_channel', 'Unsupported auth channel', [ 'status' => 400 ] );
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
                return new WP_Error( 'invalid_target', 'شماره یا شناسه الزامی است.', [ 'status' => 400 ] );
            }
            $code = (string) wp_rand( 10000, 99999 );
            set_transient( 'iramo_otp_' . md5( $channel . '_' . strtolower( trim( $target ) ) ), $code, 3 * MINUTE_IN_SECONDS );
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
            $name    = sanitize_text_field( $request->get_param( 'name' ) );
            $key     = 'iramo_otp_' . md5( $channel . '_' . strtolower( trim( $target ) ) );
            $saved   = get_transient( $key );
            if ( ! $saved || $saved !== $code ) {
                return new WP_Error( 'invalid_otp', 'کد تایید نامعتبر یا منقضی شده است.', [ 'status' => 403 ] );
            }
            delete_transient( $key );

            $meta_key = $channel === 'sms' ? '_iramo_phone' : ( $channel === 'bale' ? '_iramo_bale_chat_id' : '_iramo_telegram_handle' );
            $users = get_users( [
                'meta_key'   => $meta_key,
                'meta_value' => $target,
                'number'     => 1,
            ] );

            if ( ! empty( $users ) ) {
                $user_id = $users[0]->ID;
            } else {
                $opts = get_option( 'iramo_ai_settings', [] );
                if ( isset( $opts['allow_registration'] ) && empty( $opts['allow_registration'] ) ) {
                    return new WP_Error( 'registration_disabled', 'ثبت‌نام کاربر جدید توسط مدیر غیرفعال شده است.', [ 'status' => 403 ] );
                }
                $login_slug = 'iramo_' . substr( md5( $channel . '_' . $target ), 0, 10 );
                $existing   = get_user_by( 'login', $login_slug );
                if ( $existing ) {
                    $user_id = $existing->ID;
                } else {
                    $user_id = wp_create_user( $login_slug, wp_generate_password( 16, true ), $login_slug . '@members.iramo.ai' );
                    if ( is_wp_error( $user_id ) ) {
                        return $user_id;
                    }
                    if ( $name ) {
                        wp_update_user( [ 'ID' => $user_id, 'display_name' => $name ] );
                    }
                }
                update_user_meta( $user_id, $meta_key, $target );
            }

            if ( $channel === 'telegram' || $channel === 'bale' ) {
                $resolved_id = iRamo_OTP_Gateway::resolve_bot_chat_id( $channel, $target );
                if ( $resolved_id ) {
                    update_user_meta( $user_id, '_iramo_' . $channel . '_chat_id', $resolved_id );
                }
            }
            update_user_meta( $user_id, '_iramo_auth_method', $channel );

            wp_set_current_user( $user_id );
            wp_set_auth_cookie( $user_id, true );

            return rest_ensure_response( [
                'success'  => true,
                'verified' => true,
                'user'     => iramo_build_user_payload( $user_id ),
            ] );
        },
    ] );

    register_rest_route( 'iramo/v1', '/auth/email', [
        'methods'             => 'POST',
        'permission_callback' => '__return_true',
        'callback'            => function( WP_REST_Request $request ) {
            $mode     = sanitize_text_field( $request->get_param( 'mode' ) ?: 'login' );
            $email    = sanitize_email( $request->get_param( 'email' ) );
            $password = (string) $request->get_param( 'password' );
            $name     = sanitize_text_field( $request->get_param( 'name' ) );

            if ( ! is_email( $email ) || strlen( $password ) < 4 ) {
                return new WP_Error( 'invalid_credentials', 'ایمیل معتبر و رمز عبور حداقل ۴ کاراکتری وارد کنید.', [ 'status' => 400 ] );
            }

            if ( $mode === 'register' ) {
                if ( email_exists( $email ) ) {
                    return new WP_Error( 'email_exists', 'این ایمیل قبلاً ثبت شده است. لطفاً وارد شوید.', [ 'status' => 400 ] );
                }
                $username = sanitize_user( current( explode( '@', $email ) ), true );
                if ( username_exists( $username ) || empty( $username ) ) {
                    $username .= '_' . wp_rand( 100, 999 );
                }
                $user_id = wp_create_user( $username, $password, $email );
                if ( is_wp_error( $user_id ) ) {
                    return $user_id;
                }
                if ( $name ) {
                    wp_update_user( [ 'ID' => $user_id, 'display_name' => $name ] );
                }
                update_user_meta( $user_id, '_iramo_auth_method', 'email' );
                wp_set_current_user( $user_id );
                wp_set_auth_cookie( $user_id, true );
            } else {
                $user_obj = get_user_by( 'email', $email );
                $login    = $user_obj ? $user_obj->user_login : $email;
                $signed   = wp_signon( [
                    'user_login'    => $login,
                    'user_password' => $password,
                    'remember'      => true,
                ], is_ssl() );
                if ( is_wp_error( $signed ) ) {
                    return new WP_Error( 'auth_failed', 'ایمیل یا رمز عبور اشتباه است.', [ 'status' => 403 ] );
                }
                $user_id = $signed->ID;
                wp_set_current_user( $user_id );
            }

            return rest_ensure_response( [
                'success' => true,
                'user'    => iramo_build_user_payload( $user_id ),
            ] );
        },
    ] );

    register_rest_route( 'iramo/v1', '/auth/logout', [
        'methods'             => 'POST',
        'permission_callback' => '__return_true',
        'callback'            => function() {
            wp_logout();
            return rest_ensure_response( [ 'success' => true ] );
        },
    ] );

    register_rest_route( 'iramo/v1', '/bot/bind', [
        'methods'             => 'POST',
        'permission_callback' => function() { return is_user_logged_in(); },
        'callback'            => function( WP_REST_Request $request ) {
            $user_id = get_current_user_id();
            if ( $request->has_param( 'telegramId' ) ) {
                $tg = sanitize_text_field( $request->get_param( 'telegramId' ) );
                update_user_meta( $user_id, '_iramo_telegram_handle', $tg );
                $chat_id = iRamo_OTP_Gateway::resolve_bot_chat_id( 'telegram', $tg );
                if ( $chat_id ) {
                    update_user_meta( $user_id, '_iramo_telegram_chat_id', $chat_id );
                }
            }
            if ( $request->has_param( 'balePhone' ) ) {
                $bale = sanitize_text_field( $request->get_param( 'balePhone' ) );
                $chat_id = iRamo_OTP_Gateway::resolve_bot_chat_id( 'bale', $bale ) ?: $bale;
                update_user_meta( $user_id, '_iramo_bale_chat_id', $chat_id );
            }
            if ( $request->has_param( 'prefs' ) && is_array( $request->get_param( 'prefs' ) ) ) {
                update_user_meta( $user_id, '_iramo_bot_prefs', $request->get_param( 'prefs' ) );
            }
            return rest_ensure_response( [ 'success' => true ] );
        },
    ] );

    register_rest_route( 'iramo/v1', '/bot/webhook', [
        'methods'             => 'POST',
        'permission_callback' => '__return_true',
        'callback'            => function( WP_REST_Request $request ) {
            $platform = sanitize_text_field( $request->get_param( 'platform' ) ?: 'telegram' );
            $data     = $request->get_json_params();
            $message  = $data['message'] ?? null;
            if ( ! is_array( $message ) || empty( $message['chat']['id'] ) ) {
                return rest_ensure_response( [ 'ok' => true ] );
            }
            $chat_id  = (string) $message['chat']['id'];
            $username = strtolower( trim( $message['from']['username'] ?? '' ) );
            $text     = trim( $message['text'] ?? '' );

            if ( $username ) {
                $map = get_option( 'iramo_bot_chat_map_' . $platform, [] );
                if ( ! is_array( $map ) ) $map = [];
                $map[ $username ] = $chat_id;
                update_option( 'iramo_bot_chat_map_' . $platform, $map );
            }

            if ( strpos( $text, '/start' ) === 0 ) {
                $reply = sprintf(
                    "سلام! اتصال شما به ربات iRamoAi فعال شد.\\nشناسه چت عددی شما: <code>%s</code>\\nمی‌توانید این کد را در سایت وارد کنید.",
                    esc_html( $chat_id )
                );
                iRamo_Messenger_Bridge::send_message( $platform, $chat_id, $reply );
            }

            return rest_ensure_response( [ 'ok' => true ] );
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
  font-family: var(--font-fa, 'IRANYekanXVF', 'Vazirmatn', system-ui, -apple-system, sans-serif);
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

// Enqueue Active Font & Base Theme Stylesheet
add_action( 'wp_enqueue_scripts', function() {
    $deps = [ 'iramo-vazirmatn' ];
    wp_enqueue_style( 'iramo-vazirmatn', 'https://fonts.googleapis.com/css2?family=Vazirmatn:wght@400;500;600;700;800&display=swap', [], null );
    if ( defined( 'IRAMO_AI_PATH' ) && defined( 'IRAMO_AI_URL' ) && file_exists( IRAMO_AI_PATH . 'assets/fonts/custom-font.css' ) ) {
        wp_enqueue_style( 'iramo-theme-custom-font', IRAMO_AI_URL . 'assets/fonts/custom-font.css', [], '2.1.0' );
        $deps[] = 'iramo-theme-custom-font';
    }
    wp_enqueue_style( 'iramo-theme-style', get_stylesheet_uri(), $deps, '2.1.0' );
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
