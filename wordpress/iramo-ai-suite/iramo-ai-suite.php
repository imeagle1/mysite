<?php
/**
 * Plugin Name: iRamoAi Suite (LMS, AI Tools, Products, SEO & Elementor Pro)
 * Plugin URI:  https://iramo.ai
 * Description: هسته اختصاصی iRamoAi برای وردپرس و المنتور پرو: ثبت پست‌تایپ‌ها با URL سئو شده، کاشت خودکار ۱۸ ابزار واقعی هوش مصنوعی، ویجت‌ها و Dynamic Tags المنتور پرو، اتصال ووکامرس، ربات تلگرام/بله، سئو/امنیت و پنل دانشجویی [iramo_lms].
 * Version:     2.5.0
 * Author:      iRamoAi Engineering
 * Text Domain: iramo-ai
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

define( 'IRAMO_AI_VERSION', '2.5.0' );
define( 'IRAMO_AI_PATH', plugin_dir_path( __FILE__ ) );
define( 'IRAMO_AI_URL', plugin_dir_url( __FILE__ ) );

// Load modular includes
foreach ( [
    'includes/seo-security.php',
    'includes/admin-settings.php',
    'includes/bot-bridge.php',
    'includes/elementor-dynamic-tags.php',
    'includes/elementor-widgets.php',
    'includes/elementor-seeder.php',
] as $inc_file ) {
    if ( file_exists( IRAMO_AI_PATH . $inc_file ) ) {
        require_once IRAMO_AI_PATH . $inc_file;
    }
}

/**
 * 1. Register Custom Post Types with Clean Non-Colliding SEO Permalinks
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
        'has_archive'  => 'academy',
        'rewrite'      => [ 'slug' => 'course', 'with_front' => false ],
    ] );

    register_post_type( 'iramo_ai_tool', [
        'labels' => [
            'name'          => __( 'ابزارهای هوش مصنوعی', 'iramo-ai' ),
            'singular_name' => __( 'ابزار AI', 'iramo-ai' ),
            'add_new_item'  => __( 'افزودن ابزار هوش مصنوعی', 'iramo-ai' ),
        ],
        'public'       => true,
        'show_in_rest' => true,
        'menu_icon'    => 'dashicons-superhero-alt',
        'supports'     => [ 'title', 'editor', 'thumbnail', 'excerpt', 'custom-fields' ],
        'has_archive'  => 'ai-tools',
        'rewrite'      => [ 'slug' => 'ai-tool', 'with_front' => false ],
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
        'has_archive'  => 'products',
        'rewrite'      => [ 'slug' => 'software', 'with_front' => false ],
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
        'has_archive'  => 'articles',
        'rewrite'      => [ 'slug' => 'article', 'with_front' => false ],
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
                <p class="description">هر محصولی که اینجا ثبت کنید، به‌صورت خودکار با قالب کارت، دکمه قیمت و لندینگ‌پیج ۶ بخشی بومی iRamoAi نمایش داده می‌شود.</p>
                <p><label><strong>شعار کوتاه زیر عنوان (Tagline):</strong></label><br/>
                <input type="text" name="iramo_tagline" value="<?php echo esc_attr( $tagline ); ?>" style="width:100%;" /></p>
                <div style="display:flex;gap:12px;flex-wrap:wrap;">
                    <p style="flex:1;min-width:160px;"><label><strong>قیمت تومان:</strong></label><br/>
                    <input type="number" name="iramo_price_toman" value="<?php echo esc_attr( $price_toman ); ?>" style="width:100%;" /></p>
                    <p style="flex:1;min-width:140px;"><label><strong>قیمت دلار (اختیاری):</strong></label><br/>
                    <input type="number" name="iramo_price_usd" value="<?php echo esc_attr( $price_usd ); ?>" style="width:100%;" /></p>
                    <p style="flex:1;min-width:160px;"><label><strong>نوع لایسنس:</strong></label><br/>
                    <input type="text" name="iramo_billing_label" value="<?php echo esc_attr( $billing_label ); ?>" style="width:100%;" placeholder="لایسنس دائمی" /></p>
                    <p style="flex:1;min-width:140px;"><label><strong>رنگ تاکیدی:</strong></label><br/>
                    <select name="iramo_accent" style="width:100%;">
                        <option value="emerald" <?php selected( $accent, 'emerald' ); ?>>سبز زمردی</option>
                        <option value="blue" <?php selected( $accent, 'blue' ); ?>>آبی برند</option>
                        <option value="amber" <?php selected( $accent, 'amber' ); ?>>طلایی</option>
                        <option value="indigo" <?php selected( $accent, 'indigo' ); ?>>نیلی</option>
                    </select></p>
                </div>
                <p><label><strong>ویژگی‌های کلیدی (هر ویژگی در یک خط):</strong></label><br/>
                <textarea name="iramo_highlights" rows="3" style="width:100%;"><?php echo esc_textarea( $highlights ); ?></textarea></p>
                <p><label><strong>آمار و متریک‌ها (فرمت: برچسب | مقدار در هر خط):</strong></label><br/>
                <textarea name="iramo_metrics" rows="2" style="width:100%;"><?php echo esc_textarea( $metrics ); ?></textarea></p>
                <p><label><strong>آیدی دوره متصل آکادمی (برای ثبت‌نام خودکار ووکامرس):</strong></label><br/>
                <input type="text" dir="ltr" name="iramo_linked_course_id" value="<?php echo esc_attr( $linked_course ); ?>" style="width:260px;" /></p>
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
            $provider      = get_post_meta( $post->ID, '_iramo_provider', true );
            $tagline       = get_post_meta( $post->ID, '_iramo_tagline', true );
            $task          = get_post_meta( $post->ID, '_iramo_task', true ) ?: 'AI Assistant';
            $input         = get_post_meta( $post->ID, '_iramo_input', true ) ?: 'Text';
            $output        = get_post_meta( $post->ID, '_iramo_output', true ) ?: 'Text';
            $pricing       = get_post_meta( $post->ID, '_iramo_pricing', true ) ?: 'Freemium';
            $start_price   = get_post_meta( $post->ID, '_iramo_starting_price', true );
            $pricing_info  = get_post_meta( $post->ID, '_iramo_pricing_details', true );
            $tool_url      = get_post_meta( $post->ID, '_iramo_url', true );
            $popularity    = get_post_meta( $post->ID, '_iramo_popularity', true );
            $likes         = get_post_meta( $post->ID, '_iramo_likes', true );
            $dislikes      = get_post_meta( $post->ID, '_iramo_dislikes', true );
            $has_api       = get_post_meta( $post->ID, '_iramo_has_api', true );
            $has_mobile    = get_post_meta( $post->ID, '_iramo_has_mobile', true );
            $features      = get_post_meta( $post->ID, '_iramo_features', true );
            $steps         = get_post_meta( $post->ID, '_iramo_steps', true );
            $audience      = get_post_meta( $post->ID, '_iramo_audience', true );
            $prompt_ex     = get_post_meta( $post->ID, '_iramo_sample_prompt', true );
            $req           = '<span style="color:#b91c1c;font-weight:700;font-size:11px;">[اجباری ★]</span>';
            $opt_badge     = '<span style="color:#64748b;font-weight:600;font-size:11px;">(اختیاری)</span>';
            ?>
            <div dir="rtl" style="display:grid;gap:12px;">
                <p class="description" style="margin:0;padding:8px 12px;background:#f8fafc;border-right:3px solid #059669;">
                    فیلدهای دارای علامت <strong style="color:#b91c1c;">[اجباری ★]</strong> برای دسته‌بندی و نمایش استاندارد در دایرکتوری ضروری هستند. فیلدهای <strong>(اختیاری)</strong> مثل «شرکت سازنده»، «محبوبیت» و «لایک/دیسلایک» در صورت خالی ماندن، به‌هیچ‌وجه مقدار جعلی نمایش نمی‌دهند و بخش آن‌ها مخفی می‌ماند.
                </p>

                <div style="display:flex;gap:12px;flex-wrap:wrap;">
                    <p style="flex:1;min-width:200px;">
                        <label><strong>نام شرکت / پلتفرم سازنده <?php echo $opt_badge; ?>:</strong> <span class="description">نام برند سازنده مثل OpenAI (خالی = مخفی)</span></label><br/>
                        <input type="text" name="iramo_provider" value="<?php echo esc_attr( $provider ); ?>" placeholder="مثلاً: OpenAI (اختیاری)" style="width:100%;" />
                    </p>
                    <p style="flex:2;min-width:240px;">
                        <label><strong>توضیح کوتاه کارت <?php echo $opt_badge; ?>:</strong> <span class="description">معرفی ۱ خطی روی کارت دایرکتوری</span></label><br/>
                        <input type="text" name="iramo_tagline" value="<?php echo esc_attr( $tagline ); ?>" style="width:100%;" />
                    </p>
                </div>

                <div style="display:flex;gap:10px;flex-wrap:wrap;">
                    <p style="flex:1;min-width:150px;">
                        <label><strong>دسته‌بندی (Task) <?php echo $req; ?>:</strong> <span class="description">کاربرد اصلی ابزار برای فیلتر</span></label><br/>
                        <select name="iramo_task" style="width:100%;" required>
                            <?php foreach ( [ 'AI Assistant', 'Art & Image', 'Video Generation', '3D & Avatar', 'Code Assistant', 'Audio & Music', 'Data & Finance', 'Automation & Agents', 'Writing & SEO', 'Research & Study' ] as $item_opt ) : ?>
                                <option value="<?php echo esc_attr( $item_opt ); ?>" <?php selected( $task, $item_opt ); ?>><?php echo esc_html( $item_opt ); ?></option>
                            <?php endforeach; ?>
                        </select>
                    </p>
                    <p style="flex:1;min-width:130px;">
                        <label><strong>ورودی (Input) <?php echo $req; ?>:</strong> <span class="description">فرمت داده ورودی</span></label><br/>
                        <select name="iramo_input" style="width:100%;" required>
                            <?php foreach ( [ 'Text', 'Prompt', 'Image', 'Audio', 'Video', 'Spreadsheet', 'Document' ] as $item_opt ) : ?>
                                <option value="<?php echo esc_attr( $item_opt ); ?>" <?php selected( $input, $item_opt ); ?>><?php echo esc_html( $item_opt ); ?></option>
                            <?php endforeach; ?>
                        </select>
                    </p>
                    <p style="flex:1;min-width:130px;">
                        <label><strong>خروجی (Output) <?php echo $req; ?>:</strong> <span class="description">فرمت نتیجه تولیدی</span></label><br/>
                        <select name="iramo_output" style="width:100%;" required>
                            <?php foreach ( [ 'Text', 'Image', 'Video', '3D Model', 'Audio', 'Code', 'Dashboard', 'Workflow', 'Presentation' ] as $item_opt ) : ?>
                                <option value="<?php echo esc_attr( $item_opt ); ?>" <?php selected( $output, $item_opt ); ?>><?php echo esc_html( $item_opt ); ?></option>
                            <?php endforeach; ?>
                        </select>
                    </p>
                    <p style="flex:1;min-width:130px;">
                        <label><strong>مدل قیمت (Pricing) <?php echo $req; ?>:</strong> <span class="description">نوع دسترسی رایگان/پولی</span></label><br/>
                        <select name="iramo_pricing" style="width:100%;" required>
                            <?php foreach ( [ 'Free', 'Freemium', 'Free Trial', 'Paid' ] as $item_opt ) : ?>
                                <option value="<?php echo esc_attr( $item_opt ); ?>" <?php selected( $pricing, $item_opt ); ?>><?php echo esc_html( $item_opt ); ?></option>
                            <?php endforeach; ?>
                        </select>
                    </p>
                </div>

                <div style="display:flex;gap:12px;flex-wrap:wrap;">
                    <p style="flex:2;min-width:240px;">
                        <label><strong>لینک مستقیم ابزار (URL) <?php echo $opt_badge; ?>:</strong> <span class="description">در صورت پر بودن، دکمه ورود به سایت ابزار نمایش داده می‌شود</span></label><br/>
                        <input type="url" dir="ltr" name="iramo_url" value="<?php echo esc_attr( $tool_url ); ?>" placeholder="https://..." style="width:100%;" />
                    </p>
                    <p style="flex:1;min-width:180px;">
                        <label><strong>برچسب شروع قیمت <?php echo $opt_badge; ?>:</strong> <span class="description">مثلاً: رایگان / ماهانه ۲۰ دلار</span></label><br/>
                        <input type="text" name="iramo_starting_price" value="<?php echo esc_attr( $start_price ); ?>" style="width:100%;" />
                    </p>
                </div>

                <div style="display:flex;gap:12px;flex-wrap:wrap;padding:10px 12px;background:#f8fafc;border-radius:8px;border:1px solid #e2e8f0;">
                    <p style="flex:1;min-width:160px;margin:0;">
                        <label><strong>امتیاز محبوبیت (۰ تا ۱۰۰) <?php echo $opt_badge; ?>:</strong> <span class="description">خالی = عدم نمایش آمار محبوبیت</span></label><br/>
                        <input type="number" min="0" max="100" dir="ltr" name="iramo_popularity" value="<?php echo esc_attr( $popularity ); ?>" placeholder="خالی (مخفی)" style="width:100%;" />
                    </p>
                    <p style="flex:1;min-width:160px;margin:0;">
                        <label><strong>تعداد رأی مثبت / لایک <?php echo $opt_badge; ?>:</strong> <span class="description">خالی همراه با دیسلایک = عدم نمایش رأی‌گیری</span></label><br/>
                        <input type="number" min="0" dir="ltr" name="iramo_likes" value="<?php echo esc_attr( $likes ); ?>" placeholder="خالی (مخفی)" style="width:100%;" />
                    </p>
                    <p style="flex:1;min-width:160px;margin:0;">
                        <label><strong>تعداد رأی منفی / دیسلایک <?php echo $opt_badge; ?>:</strong> <span class="description">آمار رأی منفی ثبت‌شده</span></label><br/>
                        <input type="number" min="0" dir="ltr" name="iramo_dislikes" value="<?php echo esc_attr( $dislikes ); ?>" placeholder="خالی (مخفی)" style="width:100%;" />
                    </p>
                </div>

                <p>
                    <strong>امکانات فنی <?php echo $opt_badge; ?>:</strong> &nbsp;
                    <label style="margin-left:16px;"><input type="checkbox" name="iramo_has_api" value="1" <?php checked( $has_api, '1' ); ?> /> دارای API رسمی</label>
                    <label><input type="checkbox" name="iramo_has_mobile" value="1" <?php checked( $has_mobile, '1' ); ?> /> دارای اپلیکیشن موبایل</label>
                </p>

                <p>
                    <label><strong>جزئیات تعرفه و نسخه رایگان <?php echo $opt_badge; ?>:</strong> <span class="description">توضیح محدودیت‌های نسخه رایگان یا پلن اشتراک</span></label><br/>
                    <input type="text" name="iramo_pricing_details" value="<?php echo esc_attr( $pricing_info ); ?>" style="width:100%;" />
                </p>
                <p>
                    <label><strong>ویژگی‌های کلیدی <?php echo $opt_badge; ?>:</strong> <span class="description">هر ویژگی در یک خط جدید بنویسید</span></label><br/>
                    <textarea name="iramo_features" rows="3" style="width:100%;"><?php echo esc_textarea( $features ); ?></textarea>
                </p>
                <p>
                    <label><strong>مراحل گام‌به‌گام استفاده <?php echo $opt_badge; ?>:</strong> <span class="description">هر مرحله راهنما در یک خط</span></label><br/>
                    <textarea name="iramo_steps" rows="3" style="width:100%;"><?php echo esc_textarea( $steps ); ?></textarea>
                </p>
                <p>
                    <label><strong>مخاطبان هدف <?php echo $opt_badge; ?>:</strong> <span class="description">چه کسانی بیشترین استفاده را می‌برند؟ (هر گروه در یک خط)</span></label><br/>
                    <textarea name="iramo_audience" rows="2" style="width:100%;"><?php echo esc_textarea( $audience ); ?></textarea>
                </p>
                <p>
                    <label><strong>نمونه پرامپت آماده <?php echo $opt_badge; ?>:</strong> <span class="description">باکس پرامپت قابل کپی در صفحه ابزار</span></label><br/>
                    <input type="text" name="iramo_sample_prompt" value="<?php echo esc_attr( $prompt_ex ); ?>" style="width:100%;" />
                </p>
            </div>
            <?php
        },
        'iramo_ai_tool',
        'normal',
        'high'
    );

    add_meta_box(
        'iramo_course_meta_box',
        __( 'مشخصات دوره آموزشی آکادمی (برای Dynamic Tags و Loop Card)', 'iramo-ai' ),
        function( $post ) {
            wp_nonce_field( 'iramo_save_course_meta', 'iramo_course_meta_nonce' );
            $duration   = get_post_meta( $post->ID, '_iramo_duration_hours', true );
            $level      = get_post_meta( $post->ID, '_iramo_level', true );
            $price      = get_post_meta( $post->ID, '_iramo_price_toman', true );
            $instructor = get_post_meta( $post->ID, '_iramo_instructor', true );
            ?>
            <div dir="rtl" style="display:flex;gap:12px;flex-wrap:wrap;">
                <p style="flex:1;min-width:150px;"><label><strong>مدت دوره (ساعت) <span style="color:#64748b;font-size:11px;">(اختیاری)</span>:</strong> <span class="description">عدد ساعت آموزش</span></label><br/>
                <input type="number" min="1" name="iramo_duration_hours" value="<?php echo esc_attr( $duration ); ?>" placeholder="12" style="width:100%;" /></p>
                <p style="flex:1;min-width:180px;"><label><strong>سطح دوره <span style="color:#64748b;font-size:11px;">(اختیاری)</span>:</strong> <span class="description">مثلاً: مقدماتی تا پیشرفته</span></label><br/>
                <input type="text" name="iramo_level" value="<?php echo esc_attr( $level ); ?>" placeholder="جامع و پروژه‌محور" style="width:100%;" /></p>
                <p style="flex:1;min-width:160px;"><label><strong>شهریه (تومان) <span style="color:#64748b;font-size:11px;">(اختیاری)</span>:</strong> <span class="description">صفر = رایگان</span></label><br/>
                <input type="number" min="0" name="iramo_course_price_toman" value="<?php echo esc_attr( $price ); ?>" placeholder="2900000" style="width:100%;" /></p>
                <p style="flex:1;min-width:180px;"><label><strong>نام مدرس <span style="color:#64748b;font-size:11px;">(اختیاری)</span>:</strong> <span class="description">نمایش در هدر دوره</span></label><br/>
                <input type="text" name="iramo_instructor" value="<?php echo esc_attr( $instructor ); ?>" placeholder="آکادمی iRamoAi" style="width:100%;" /></p>
            </div>
            <?php
        },
        'iramo_course',
        'normal',
        'high'
    );
} );

add_action( 'save_post', function( $post_id ) {
    if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) return;
    if ( ! current_user_can( 'edit_post', $post_id ) ) return;

    if ( isset( $_POST['iramo_product_meta_nonce'] ) && wp_verify_nonce( $_POST['iramo_product_meta_nonce'], 'iramo_save_product_meta' ) ) {
        foreach ( [
            '_iramo_tagline'          => 'iramo_tagline',
            '_iramo_price_toman'      => 'iramo_price_toman',
            '_iramo_price_usd'        => 'iramo_price_usd',
            '_iramo_billing_label'    => 'iramo_billing_label',
            '_iramo_accent'           => 'iramo_accent',
            '_iramo_linked_course_id' => 'iramo_linked_course_id',
        ] as $meta_key => $field ) {
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
        // Provider: delete meta when empty so no fake fallback renders
        if ( isset( $_POST['iramo_provider'] ) ) {
            $prov = trim( sanitize_text_field( wp_unslash( $_POST['iramo_provider'] ) ) );
            if ( $prov === '' ) {
                delete_post_meta( $post_id, '_iramo_provider' );
            } else {
                update_post_meta( $post_id, '_iramo_provider', $prov );
            }
        }

        // Optional numeric stats: store only when explicitly filled, delete when blank
        foreach ( [
            '_iramo_popularity' => 'iramo_popularity',
            '_iramo_likes'      => 'iramo_likes',
            '_iramo_dislikes'   => 'iramo_dislikes',
        ] as $stat_key => $stat_field ) {
            if ( isset( $_POST[ $stat_field ] ) ) {
                $raw_val = trim( sanitize_text_field( wp_unslash( $_POST[ $stat_field ] ) ) );
                if ( $raw_val === '' ) {
                    delete_post_meta( $post_id, $stat_key );
                } else {
                    update_post_meta( $post_id, $stat_key, max( 0, (int) $raw_val ) );
                }
            }
        }

        foreach ( [
            '_iramo_tagline'         => 'iramo_tagline',
            '_iramo_task'            => 'iramo_task',
            '_iramo_input'           => 'iramo_input',
            '_iramo_output'          => 'iramo_output',
            '_iramo_pricing'         => 'iramo_pricing',
            '_iramo_starting_price'  => 'iramo_starting_price',
            '_iramo_pricing_details' => 'iramo_pricing_details',
        ] as $meta_key => $field ) {
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
        if ( isset( $_POST['iramo_audience'] ) ) {
            update_post_meta( $post_id, '_iramo_audience', sanitize_textarea_field( wp_unslash( $_POST['iramo_audience'] ) ) );
        }
        if ( isset( $_POST['iramo_sample_prompt'] ) ) {
            update_post_meta( $post_id, '_iramo_sample_prompt', sanitize_textarea_field( wp_unslash( $_POST['iramo_sample_prompt'] ) ) );
        }
    }

    if ( isset( $_POST['iramo_course_meta_nonce'] ) && wp_verify_nonce( $_POST['iramo_course_meta_nonce'], 'iramo_save_course_meta' ) ) {
        foreach ( [
            '_iramo_duration_hours' => 'iramo_duration_hours',
            '_iramo_level'          => 'iramo_level',
            '_iramo_price_toman'    => 'iramo_course_price_toman',
            '_iramo_instructor'     => 'iramo_instructor',
        ] as $meta_key => $field ) {
            if ( isset( $_POST[ $field ] ) ) {
                update_post_meta( $post_id, $meta_key, sanitize_text_field( wp_unslash( $_POST[ $field ] ) ) );
            }
        }
    }
} );

/**
 * 2. WooCommerce Order Completed -> Auto Enroll Student & License Keys
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
 * Helper: Build Authenticated WP User Payload (For Student LMS Panel)
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
            $licenses      = $order->get_meta( '_iramo_license_keys' );
            $first_license = ( is_array( $licenses ) && ! empty( $licenses ) ) ? reset( $licenses ) : '';
            $date_created  = $order->get_date_created();
            $date_str      = $date_created ? $date_created->date_i18n( 'Y/m/d' ) : '';
            $total_toman   = (int) $order->get_total();

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

    $asg_posts   = get_posts( [ 'post_type' => 'iramo_assignment', 'post_status' => 'publish', 'posts_per_page' => 50 ] );
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
 * 3. REST API Endpoints
 */
add_action( 'rest_api_init', function() {
    register_rest_route( 'iramo/v1', '/progress', [
        'methods'             => 'POST',
        'permission_callback' => function() { return is_user_logged_in(); },
        'callback'            => function( WP_REST_Request $request ) {
            $user_id   = get_current_user_id();
            $lesson_id = sanitize_text_field( $request->get_param( 'lesson_id' ) );
            $completed = (bool) $request->get_param( 'completed' );
            $progress  = get_user_meta( $user_id, '_iramo_completed_lessons', true );
            if ( ! is_array( $progress ) ) $progress = [];
            if ( $completed ) $progress[ $lesson_id ] = current_time( 'mysql' );
            else unset( $progress[ $lesson_id ] );
            update_user_meta( $user_id, '_iramo_completed_lessons', $progress );
            return rest_ensure_response( [ 'success' => true, 'completed' => array_keys( $progress ) ] );
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
            $submissions[ $assignment_id ] = [ 'url' => $url, 'status' => 'submitted', 'submitted_at' => current_time( 'mysql' ) ];
            update_user_meta( $user_id, '_iramo_assignment_submissions', $submissions );
            return rest_ensure_response( [ 'success' => true, 'submission' => $submissions[ $assignment_id ] ] );
        },
    ] );

    register_rest_route( 'iramo/v1', '/newsletter', [
        'methods'             => 'POST',
        'permission_callback' => '__return_true',
        'callback'            => function( WP_REST_Request $request ) {
            if ( function_exists( 'iramo_check_rate_limit' ) ) {
                $rl = iramo_check_rate_limit( 'newsletter', 'global', 8, 300 );
                if ( is_wp_error( $rl ) ) return $rl;
            }
            $channel = sanitize_text_field( $request->get_param( 'channel' ) ?: 'telegram' );
            $handle  = sanitize_text_field( $request->get_param( 'handle' ) );
            if ( empty( $handle ) ) {
                return new WP_Error( 'missing_handle', 'Handle or phone is required', [ 'status' => 400 ] );
            }
            $subs = get_option( 'iramo_newsletter_subscribers', [] );
            if ( ! is_array( $subs ) ) $subs = [];
            $subs[ $channel . '_' . strtolower( $handle ) ] = [ 'channel' => $channel, 'handle' => $handle, 'date' => current_time( 'mysql' ) ];
            update_option( 'iramo_newsletter_subscribers', $subs );
            return rest_ensure_response( [ 'success' => true, 'channel' => $channel, 'handle' => $handle ] );
        },
    ] );

    register_rest_route( 'iramo/v1', '/consultation', [
        'methods'             => 'POST',
        'permission_callback' => '__return_true',
        'callback'            => function( WP_REST_Request $request ) {
            if ( function_exists( 'iramo_check_rate_limit' ) ) {
                $rl = iramo_check_rate_limit( 'consultation', 'global', 5, 300 );
                if ( is_wp_error( $rl ) ) return $rl;
            }
            $name    = sanitize_text_field( $request->get_param( 'name' ) );
            $contact = sanitize_text_field( $request->get_param( 'contact' ) );
            $type    = sanitize_text_field( $request->get_param( 'serviceType' ) ?: 'bot' );
            $details = sanitize_textarea_field( $request->get_param( 'details' ) );
            if ( empty( $name ) || empty( $contact ) ) {
                return new WP_Error( 'missing_fields', 'نام و اطلاعات تماس الزامی است.', [ 'status' => 400 ] );
            }
            $leads = get_option( 'iramo_consultation_leads', [] );
            if ( ! is_array( $leads ) ) $leads = [];
            $leads[] = [ 'name' => $name, 'contact' => $contact, 'serviceType' => $type, 'details' => $details, 'created_at' => current_time( 'mysql' ) ];
            update_option( 'iramo_consultation_leads', array_slice( $leads, -100 ) );

            $admin_chat = get_option( 'iramo_admin_chat_id' );
            if ( $admin_chat && class_exists( 'iRamo_Messenger_Bridge' ) ) {
                $msg = sprintf( "<b>درخواست مشاوره جدید iRamoAi</b>\nنام: %s\nتماس: %s\nحوزه: %s\nتوضیحات: %s", esc_html( $name ), esc_html( $contact ), esc_html( $type ), esc_html( $details ?: '-' ) );
                iRamo_Messenger_Bridge::send_message( 'telegram', $admin_chat, $msg );
                iRamo_Messenger_Bridge::send_message( 'bale', $admin_chat, $msg );
            }
            return rest_ensure_response( [ 'success' => true ] );
        },
    ] );

    register_rest_route( 'iramo/v1', '/tools/vote', [
        'methods'             => 'POST',
        'permission_callback' => '__return_true',
        'callback'            => function( WP_REST_Request $request ) {
            $post_id = (int) $request->get_param( 'post_id' );
            $vote    = sanitize_text_field( $request->get_param( 'vote' ) );
            if ( ! $post_id || get_post_type( $post_id ) !== 'iramo_ai_tool' ) {
                return new WP_Error( 'invalid_tool', 'Invalid tool ID', [ 'status' => 400 ] );
            }
            if ( function_exists( 'iramo_check_rate_limit' ) ) {
                $rl = iramo_check_rate_limit( 'tool_vote_' . $post_id, 'vote', 3, 3600 );
                if ( is_wp_error( $rl ) ) return $rl;
            }
            $likes_raw    = trim( (string) get_post_meta( $post_id, '_iramo_likes', true ) );
            $dislikes_raw = trim( (string) get_post_meta( $post_id, '_iramo_dislikes', true ) );
            $likes        = $likes_raw !== '' ? (int) $likes_raw : 0;
            $dislikes     = $dislikes_raw !== '' ? (int) $dislikes_raw : 0;
            if ( $vote === 'dislike' ) {
                $dislikes++;
                update_post_meta( $post_id, '_iramo_dislikes', $dislikes );
            } else {
                $likes++;
                update_post_meta( $post_id, '_iramo_likes', $likes );
            }
            return rest_ensure_response( [ 'success' => true, 'likes' => $likes, 'dislikes' => $dislikes ] );
        },
    ] );

    register_rest_route( 'iramo/v1', '/admin/settings', [
        'methods'             => 'POST',
        'permission_callback' => function() { return current_user_can( 'manage_options' ); },
        'callback'            => function( WP_REST_Request $request ) {
            $payload = $request->get_json_params();
            if ( ! is_array( $payload ) ) return new WP_Error( 'invalid_payload', 'Invalid settings JSON', [ 'status' => 400 ] );
            $opts = get_option( 'iramo_ai_settings', [] );
            if ( ! is_array( $opts ) ) $opts = [];
            if ( isset( $payload['brandTitle'] ) ) $opts['brand_name'] = sanitize_text_field( $payload['brandTitle'] );
            if ( isset( $payload['fontFamily'] ) ) $opts['font_family'] = sanitize_text_field( $payload['fontFamily'] );
            if ( isset( $payload['demoCleared'] ) ) $opts['demo_cleared'] = ! empty( $payload['demoCleared'] ) ? 1 : 0;
            update_option( 'iramo_ai_settings', $opts );
            return rest_ensure_response( [ 'success' => true ] );
        },
    ] );
} );

/**
 * 3.5 Serialize Published Items for the Student Portal React App ([iramo_lms])
 */
function iramo_collect_wp_products() {
    $posts = get_posts( [ 'post_type' => [ 'product', 'iramo_product' ], 'post_status' => 'publish', 'posts_per_page' => 50 ] );
    $items = [];
    foreach ( $posts as $p ) {
        $pid       = $p->ID;
        $title     = get_the_title( $pid );
        $excerpt   = wp_strip_all_tags( get_the_excerpt( $pid ) ?: wp_trim_words( $p->post_content, 24 ) );
        $price_tom = (int) get_post_meta( $pid, '_iramo_price_toman', true );
        if ( $p->post_type === 'product' && function_exists( 'wc_get_product' ) ) {
            $wc = wc_get_product( $pid );
            if ( $wc && ! $price_tom && $wc->get_price() !== '' ) $price_tom = (int) $wc->get_price();
        }
        $items[] = [
            'id'           => 'wp-prod-' . $pid,
            'slug'         => $p->post_name ?: ( 'wp-prod-' . $pid ),
            'name'         => [ 'fa' => $title, 'en' => $title ],
            'category'     => [ 'fa' => 'محصول نرم‌افزاری', 'en' => 'Software' ],
            'tagline'      => [ 'fa' => get_post_meta( $pid, '_iramo_tagline', true ) ?: $excerpt, 'en' => $excerpt ],
            'description'  => [ 'fa' => $excerpt, 'en' => $excerpt ],
            'accent'       => get_post_meta( $pid, '_iramo_accent', true ) ?: 'emerald',
            'thumbnail'    => get_the_post_thumbnail_url( $pid, 'large' ) ?: '',
            'priceToman'   => $price_tom ?: 1900000,
            'priceUsd'     => max( 9, (int) round( ( $price_tom ?: 1900000 ) / 60000 ) ),
            'billingLabel' => [ 'fa' => get_post_meta( $pid, '_iramo_billing_label', true ) ?: 'لایسنس دائمی', 'en' => 'License' ],
            'highlights'   => [ 'fa' => [], 'en' => [] ],
            'demoMetrics'  => [],
            'checkoutUrl'  => get_permalink( $pid ),
            'isDemo'       => false,
        ];
    }
    return $items;
}

function iramo_collect_wp_tools() {
    $posts = get_posts( [ 'post_type' => 'iramo_ai_tool', 'post_status' => 'publish', 'posts_per_page' => 100 ] );
    $items = [];
    foreach ( $posts as $p ) {
        $pid     = $p->ID;
        $title   = get_the_title( $pid );
        $tagline = get_post_meta( $pid, '_iramo_tagline', true ) ?: wp_trim_words( wp_strip_all_tags( $p->post_content ), 16 );
        $pop_raw = trim( (string) get_post_meta( $pid, '_iramo_popularity', true ) );
        $items[] = [
            'id'              => 'wp-tool-' . $pid,
            'name'            => $title,
            'provider'        => trim( (string) get_post_meta( $pid, '_iramo_provider', true ) ),
            'tagline'         => [ 'fa' => $tagline, 'en' => $tagline ],
            'task'            => get_post_meta( $pid, '_iramo_task', true ) ?: 'AI Assistant',
            'input'           => get_post_meta( $pid, '_iramo_input', true ) ?: 'Text',
            'output'          => get_post_meta( $pid, '_iramo_output', true ) ?: 'Text',
            'pricing'         => get_post_meta( $pid, '_iramo_pricing', true ) ?: 'Freemium',
            'hasApi'          => get_post_meta( $pid, '_iramo_has_api', true ) === '1',
            'hasMobileApp'    => get_post_meta( $pid, '_iramo_has_mobile', true ) === '1',
            'verified'        => get_post_meta( $pid, '_iramo_verified', true ) === '1',
            'popularityScore' => $pop_raw !== '' ? (int) $pop_raw : null,
            'thumbnail'       => get_the_post_thumbnail_url( $pid, 'medium' ) ?: '',
            'isDemo'          => false,
            'url'             => get_post_meta( $pid, '_iramo_url', true ) ?: get_permalink( $pid ),
            'description'     => [ 'fa' => $tagline, 'en' => $tagline ],
        ];
    }
    return $items;
}

function iramo_collect_wp_courses() {
    $posts = get_posts( [ 'post_type' => 'iramo_course', 'post_status' => 'publish', 'posts_per_page' => 50 ] );
    $items = [];
    foreach ( $posts as $p ) {
        $pid     = $p->ID;
        $title   = get_the_title( $pid );
        $excerpt = wp_strip_all_tags( get_the_excerpt( $pid ) ?: wp_trim_words( $p->post_content, 18 ) );
        $hours   = (int) ( get_post_meta( $pid, '_iramo_duration_hours', true ) ?: 12 );
        $items[] = [
            'id'            => 'wp-course-' . $pid,
            'slug'          => $p->post_name ?: ( 'wp-course-' . $pid ),
            'title'         => [ 'fa' => $title, 'en' => $title ],
            'subtitle'      => [ 'fa' => $excerpt, 'en' => $excerpt ],
            'description'   => [ 'fa' => wp_strip_all_tags( $p->post_content ) ?: $excerpt, 'en' => $excerpt ],
            'category'      => 'AI',
            'format'        => 'Video',
            'durationTier'  => $hours > 15 ? 'long' : 'medium',
            'totalDuration' => [ 'fa' => $hours . ' ساعت', 'en' => $hours . ' hrs' ],
            'lessonCount'   => 1,
            'moduleCount'   => 1,
            'enrolled'      => false,
            'featured'      => false,
            'isDemo'        => false,
            'accentColor'   => 'emerald',
            'thumbnail'     => get_the_post_thumbnail_url( $pid, 'large' ) ?: '',
            'instructor'    => [ 'fa' => 'آکادمی iRamoAi', 'en' => 'iRamoAi Academy' ],
            'priceToman'    => (int) ( get_post_meta( $pid, '_iramo_price_toman', true ) ?: 2900000 ),
            'priceUsd'      => (int) ( get_post_meta( $pid, '_iramo_price_usd', true ) ?: 49 ),
            'modules'       => [],
        ];
    }
    return $items;
}

function iramo_collect_wp_articles() {
    $posts = get_posts( [ 'post_type' => [ 'iramo_article', 'post' ], 'post_status' => 'publish', 'posts_per_page' => 50 ] );
    $items = [];
    foreach ( $posts as $p ) {
        if ( $p->post_type === 'post' && $p->post_name === 'hello-world' ) continue;
        $pid     = $p->ID;
        $title   = get_the_title( $pid );
        $excerpt = wp_strip_all_tags( get_the_excerpt( $pid ) ?: wp_trim_words( $p->post_content, 24 ) );
        $items[] = [
            'id'          => 'wp-art-' . $pid,
            'slug'        => $p->post_name ?: ( 'wp-art-' . $pid ),
            'title'       => [ 'fa' => $title, 'en' => $title ],
            'excerpt'     => [ 'fa' => $excerpt, 'en' => $excerpt ],
            'category'    => 'AI',
            'tags'        => [ 'fa' => [ 'iRamoAi' ], 'en' => [ 'iRamoAi' ] ],
            'author'      => [ 'fa' => 'تحریریه iRamoAi', 'en' => 'iRamoAi' ],
            'publishedAt' => [ 'fa' => get_the_date( 'j F Y', $pid ), 'en' => get_the_date( 'M j, Y', $pid ) ],
            'readMinutes' => 4,
            'views'       => 120,
            'featured'    => false,
            'isDemo'      => false,
            'thumbnail'   => get_the_post_thumbnail_url( $pid, 'large' ) ?: '',
            'sections'    => [],
        ];
    }
    return $items;
}

/**
 * 4. Shortcode [iramo_lms] for Student Portal React App (/panel/)
 */
function iramo_render_app_shortcode( $atts ) {
    $options = get_option( 'iramo_ai_settings', [] );
    $atts    = shortcode_atts( [
        'theme' => $options['default_theme'] ?? 'light',
        'lang'  => is_rtl() ? 'fa' : 'en',
        'view'  => 'panel',
    ], $atts, 'iramo_lms' );

    $user_payload = is_user_logged_in() ? iramo_build_user_payload( get_current_user_id() ) : null;
    $font_choice  = $options['font_family'] ?? ( file_exists( IRAMO_AI_PATH . 'assets/fonts/custom-font.css' ) ? 'custom' : 'vazirmatn' );
    $custom_url   = file_exists( IRAMO_AI_PATH . 'assets/fonts/custom-font.css' ) ? IRAMO_AI_URL . 'assets/fonts/custom-font.css' : '';

    if ( $custom_url ) {
        wp_enqueue_style( 'iramo-custom-font', $custom_url, [], IRAMO_AI_VERSION );
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
    ];

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
      data-custom-font="<?php echo esc_attr( $options['custom_font_name'] ?? 'IRANYekanXVF' ); ?>"
      data-custom-font-css-url="<?php echo esc_attr( $custom_url ); ?>"
      data-brand-name="<?php echo esc_attr( $options['brand_name'] ?? 'iRamoAi' ); ?>"
      data-color-config="<?php echo esc_attr( wp_json_encode( $color_config ) ); ?>"
      data-auth-config="<?php echo esc_attr( wp_json_encode( $auth_config ) ); ?>"
      data-quick-tips="[]"
      data-products="<?php echo esc_attr( wp_json_encode( iramo_collect_wp_products() ) ); ?>"
      data-tools="<?php echo esc_attr( wp_json_encode( iramo_collect_wp_tools() ) ); ?>"
      data-courses="<?php echo esc_attr( wp_json_encode( iramo_collect_wp_courses() ) ); ?>"
      data-articles="<?php echo esc_attr( wp_json_encode( iramo_collect_wp_articles() ) ); ?>"
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

/**
 * Load React LMS Vite ES module bundle with type="module" (required for import.meta.url)
 * and exclude it from LiteSpeed Cache / WP Rocket minification, combination & delay.
 */
add_filter( 'script_loader_tag', function( $tag, $handle, $src ) {
    if ( 'iramo-ai-bundle' !== $handle ) {
        return $tag;
    }
    $cleaned = preg_replace( '/\s+type=[\'"][^\'"]*[\'"]/', '', (string) $tag );
    return str_replace(
        '<script ',
        '<script type="module" data-no-optimize="1" data-no-defer="1" data-no-minify="1" ',
        $cleaned
    );
}, 20, 3 );

$iramo_exclude_bundle = function( $excludes ) {
    if ( ! is_array( $excludes ) ) {
        $excludes = [];
    }
    $excludes[] = 'iramo-lms.js';
    $excludes[] = '/iramo-ai-suite/assets/iramo-lms.js';
    return array_values( array_unique( $excludes ) );
};
add_filter( 'litespeed_optimize_js_excludes', $iramo_exclude_bundle );
add_filter( 'litespeed_optm_js_defer_exc', $iramo_exclude_bundle );
add_filter( 'rocket_exclude_js', $iramo_exclude_bundle );
add_filter( 'rocket_exclude_defer_js', $iramo_exclude_bundle );
add_filter( 'rocket_delay_js_exclusions', $iramo_exclude_bundle );

/**
 * 5. Automatic Seeding of 18 Curated Real AI Tools from assets/curated-ai-tools.json
 */
function iramo_seed_curated_ai_tools( $force_update = false ) {
    $json_file = IRAMO_AI_PATH . 'assets/curated-ai-tools.json';
    if ( ! file_exists( $json_file ) ) {
        return;
    }
    $raw   = file_get_contents( $json_file );
    $tools = json_decode( $raw, true );
    if ( ! is_array( $tools ) || empty( $tools ) ) {
        return;
    }

    foreach ( $tools as $tool ) {
        if ( empty( $tool['id'] ) || empty( $tool['name'] ) ) {
            continue;
        }
        $existing = get_posts( [
            'post_type'      => 'iramo_ai_tool',
            'post_status'    => [ 'publish', 'draft', 'pending' ],
            'meta_key'       => '_iramo_curated_id',
            'meta_value'     => sanitize_text_field( $tool['id'] ),
            'posts_per_page' => 1,
            'fields'         => 'ids',
        ] );

        if ( ! empty( $existing ) && ! $force_update ) {
            continue;
        }

        $content_parts = ! empty( $tool['longDescriptionFa'] ) && is_array( $tool['longDescriptionFa'] )
            ? $tool['longDescriptionFa']
            : [ $tool['descriptionFa'] ?? $tool['taglineFa'] ?? '' ];
        $post_content = implode( "\n\n", array_map( function( $p ) {
            return '<p>' . esc_html( $p ) . '</p>';
        }, $content_parts ) );

        $post_data = [
            'post_type'    => 'iramo_ai_tool',
            'post_title'   => sanitize_text_field( $tool['name'] ),
            'post_name'    => sanitize_title( str_replace( 'tool-', '', $tool['id'] ) ),
            'post_content' => $post_content,
            'post_excerpt' => sanitize_text_field( $tool['descriptionFa'] ?? $tool['taglineFa'] ?? '' ),
            'post_status'  => 'publish',
        ];

        if ( ! empty( $existing ) ) {
            $post_data['ID'] = $existing[0];
            $pid = wp_update_post( $post_data );
        } else {
            $pid = wp_insert_post( $post_data );
        }

        if ( $pid && ! is_wp_error( $pid ) ) {
            update_post_meta( $pid, '_iramo_curated_tool', '1' );
            update_post_meta( $pid, '_iramo_curated_id', sanitize_text_field( $tool['id'] ) );
            update_post_meta( $pid, '_iramo_is_demo', '0' );
            if ( ! empty( $tool['provider'] ) ) {
                update_post_meta( $pid, '_iramo_provider', sanitize_text_field( $tool['provider'] ) );
            }
            update_post_meta( $pid, '_iramo_tagline', sanitize_text_field( $tool['taglineFa'] ?? '' ) );
            update_post_meta( $pid, '_iramo_task', sanitize_text_field( $tool['task'] ?? '' ) );
            update_post_meta( $pid, '_iramo_input', sanitize_text_field( $tool['input'] ?? '' ) );
            update_post_meta( $pid, '_iramo_output', sanitize_text_field( $tool['output'] ?? '' ) );
            update_post_meta( $pid, '_iramo_pricing', sanitize_text_field( $tool['pricing'] ?? 'Freemium' ) );
            update_post_meta( $pid, '_iramo_starting_price', sanitize_text_field( $tool['startingPriceFa'] ?? '' ) );
            update_post_meta( $pid, '_iramo_pricing_details', sanitize_text_field( $tool['pricingDetailsFa'] ?? '' ) );
            update_post_meta( $pid, '_iramo_url', esc_url_raw( $tool['url'] ?? '' ) );
            update_post_meta( $pid, '_iramo_has_api', ! empty( $tool['hasApi'] ) ? '1' : '0' );
            update_post_meta( $pid, '_iramo_has_mobile', ! empty( $tool['hasMobileApp'] ) ? '1' : '0' );
            update_post_meta( $pid, '_iramo_verified', ! empty( $tool['verified'] ) ? '1' : '0' );
            if ( isset( $tool['popularityScore'] ) && $tool['popularityScore'] !== '' ) {
                update_post_meta( $pid, '_iramo_popularity', (int) $tool['popularityScore'] );
            }
            if ( isset( $tool['likes'] ) && $tool['likes'] !== '' ) {
                update_post_meta( $pid, '_iramo_likes', (int) $tool['likes'] );
            }
            if ( isset( $tool['dislikes'] ) && $tool['dislikes'] !== '' ) {
                update_post_meta( $pid, '_iramo_dislikes', (int) $tool['dislikes'] );
            }
            if ( ! empty( $tool['keyFeaturesFa'] ) && is_array( $tool['keyFeaturesFa'] ) ) {
                update_post_meta( $pid, '_iramo_features', implode( "\n", $tool['keyFeaturesFa'] ) );
            }
            if ( ! empty( $tool['stepsFa'] ) && is_array( $tool['stepsFa'] ) ) {
                update_post_meta( $pid, '_iramo_steps', implode( "\n", $tool['stepsFa'] ) );
            }
            if ( ! empty( $tool['whoIsItForFa'] ) && is_array( $tool['whoIsItForFa'] ) ) {
                update_post_meta( $pid, '_iramo_audience', implode( "\n", $tool['whoIsItForFa'] ) );
            }
            if ( ! empty( $tool['samplePromptFa'] ) ) {
                update_post_meta( $pid, '_iramo_sample_prompt', sanitize_textarea_field( $tool['samplePromptFa'] ) );
            }
        }
    }
    update_option( 'iramo_curated_tools_seeded', '2.2.0' );
}

/**
 * 6. Automatic Pages, Front Page, Navigation Menu & Clean Archive Links
 */
function iramo_get_blueprint_pages() {
    return [
        'home' => [
            'title'    => 'صفحه اصلی',
            'content'  => '',
            'template' => '',
        ],
        'services' => [
            'title'    => 'خدمات و مشاوره',
            'content'  => '',
            'template' => '',
        ],
        'panel' => [
            'title'    => 'پنل کاربری و آموزش',
            'content'  => '[iramo_lms view="panel"]',
            'template' => 'templates/template-canvas.php',
        ],
    ];
}

function iramo_provision_site_pages( $force = false ) {
    if ( get_transient( 'iramo_provisioning_lock' ) ) {
        return;
    }
    set_transient( 'iramo_provisioning_lock', 1, 15 );

    // Seed all 18 curated AI tools first
    iramo_seed_curated_ai_tools( $force );

    $pages       = iramo_get_blueprint_pages();
    $created_ids = [];

    foreach ( $pages as $slug => $cfg ) {
        $existing = get_posts( [
            'post_type'      => 'page',
            'post_status'    => [ 'publish', 'draft', 'private', 'pending' ],
            'meta_key'       => '_iramo_page_slug',
            'meta_value'     => $slug,
            'posts_per_page' => 1,
        ] );

        $page_id = ! empty( $existing ) ? $existing[0]->ID : 0;
        if ( ! $page_id ) {
            $by_path = get_page_by_path( $slug, OBJECT, 'page' );
            if ( $by_path && $by_path->post_status !== 'trash' ) {
                $page_id = $by_path->ID;
            }
        }

        if ( ! $page_id ) {
            $page_id = wp_insert_post( [
                'post_type'      => 'page',
                'post_title'     => $cfg['title'],
                'post_name'      => $slug,
                'post_content'   => $cfg['content'],
                'post_status'    => 'publish',
                'comment_status' => 'closed',
                'ping_status'    => 'closed',
            ] );
        } elseif ( $force ) {
            wp_update_post( [
                'ID'           => $page_id,
                'post_status'  => 'publish',
                'post_content' => $cfg['content'],
            ] );
        }

        if ( $page_id && ! is_wp_error( $page_id ) ) {
            update_post_meta( $page_id, '_iramo_page_slug', $slug );
            if ( ! empty( $cfg['template'] ) ) {
                update_post_meta( $page_id, '_wp_page_template', $cfg['template'] );
            }
            $created_ids[ $slug ] = (int) $page_id;
        }
    }

    if ( ! empty( $created_ids['home'] ) ) {
        $current_front = (int) get_option( 'page_on_front' );
        if ( $force || get_option( 'show_on_front' ) !== 'page' || ! $current_front || get_post_status( $current_front ) !== 'publish' ) {
            update_option( 'show_on_front', 'page' );
            update_option( 'page_on_front', $created_ids['home'] );
        }
    }

    // Build clean WordPress Navigation Menu pointing to SSR pages + CPT Archives + React Panel
    $menu_name = 'منوی اصلی iRamoAi';
    $menu_obj  = wp_get_nav_menu_object( $menu_name );
    if ( ! $menu_obj || $force ) {
        $menu_id = $menu_obj ? (int) $menu_obj->term_id : wp_create_nav_menu( $menu_name );
        if ( $menu_id && ! is_wp_error( $menu_id ) ) {
            if ( $force ) {
                $old_items = wp_get_nav_menu_items( $menu_id );
                if ( is_array( $old_items ) ) {
                    foreach ( $old_items as $oi ) {
                        wp_delete_post( $oi->ID, true );
                    }
                }
            }
            $existing_items = wp_get_nav_menu_items( $menu_id );
            if ( empty( $existing_items ) ) {
                $nav_entries = [
                    [ 'title' => 'صفحه اصلی', 'url' => home_url( '/' ) ],
                    [ 'title' => 'محصولات', 'url' => home_url( '/products/' ) ],
                    [ 'title' => 'ابزارهای هوش مصنوعی', 'url' => home_url( '/ai-tools/' ) ],
                    [ 'title' => 'آکادمی و دوره‌ها', 'url' => home_url( '/academy/' ) ],
                    [ 'title' => 'مقالات', 'url' => home_url( '/articles/' ) ],
                    [ 'title' => 'خدمات و مشاوره', 'url' => home_url( '/services/' ) ],
                    [ 'title' => 'پنل کاربری', 'url' => home_url( '/panel/' ) ],
                ];
                foreach ( $nav_entries as $entry ) {
                    wp_update_nav_menu_item( $menu_id, 0, [
                        'menu-item-title'  => $entry['title'],
                        'menu-item-url'    => $entry['url'],
                        'menu-item-type'   => 'custom',
                        'menu-item-status' => 'publish',
                    ] );
                }
            }
            $locations = get_theme_mod( 'nav_menu_locations', [] );
            if ( ! is_array( $locations ) ) $locations = [];
            $locations['primary'] = $menu_id;
            set_theme_mod( 'nav_menu_locations', $locations );
        }
    }

    if ( get_option( 'permalink_structure' ) === '' ) {
        global $wp_rewrite;
        if ( $wp_rewrite ) {
            $wp_rewrite->set_permalink_structure( '/%postname%/' );
        }
    }

    if ( function_exists( 'iramo_provision_elementor_layouts' ) ) {
        iramo_provision_elementor_layouts( $created_ids, $force );
    }

    if ( function_exists( 'iramo_get_or_create_webhook_secret' ) ) {
        iramo_get_or_create_webhook_secret();
    }

    update_option( 'iramo_pages_provisioned', '2.5.0' );
    delete_option( 'iramo_pending_page_setup' );
    flush_rewrite_rules();
    delete_transient( 'iramo_provisioning_lock' );
}

register_activation_hook( __FILE__, function() {
    if ( function_exists( 'iramo_get_or_create_webhook_secret' ) ) {
        iramo_get_or_create_webhook_secret();
    }
    iramo_provision_site_pages( false );
} );

add_action( 'after_switch_theme', function() {
    iramo_provision_site_pages( false );
} );

add_action( 'elementor/init', function() {
    $target_seed = ( function_exists( 'iramo_is_elementor_pro_active' ) && iramo_is_elementor_pro_active() ) ? '2.5.0-pro' : '2.5.0-free';
    if ( get_option( 'iramo_elementor_seeded' ) !== $target_seed ) {
        iramo_provision_site_pages( false );
    }
} );

add_action( 'elementor_pro/init', function() {
    if ( get_option( 'iramo_elementor_seeded' ) !== '2.5.0-pro' ) {
        iramo_provision_site_pages( false );
    }
} );

add_action( 'admin_init', function() {
    if ( function_exists( 'iramo_get_or_create_webhook_secret' ) ) {
        iramo_get_or_create_webhook_secret();
    }
    $target_seed = ( function_exists( 'iramo_is_elementor_pro_active' ) && iramo_is_elementor_pro_active() ) ? '2.5.0-pro' : '2.5.0-free';
    if (
        get_option( 'iramo_pages_provisioned' ) !== '2.5.0' ||
        get_option( 'iramo_elementor_seeded' ) !== $target_seed ||
        get_option( 'iramo_curated_tools_seeded' ) !== '2.2.0' ||
        get_option( 'iramo_pending_page_setup' )
    ) {
        iramo_provision_site_pages( false );
    }
} );
