<?php
/**
 * Module: Elementor Dynamic Tags for iRamoAi (AI Tools, Products, Courses, Articles & Loop Builders)
 * Allows binding every CPT field cleanly inside native Elementor widgets & Elementor Pro Loop Items.
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

add_action( 'elementor/dynamic_tags/register', function( $dynamic_tags ) {
    if ( ! class_exists( '\Elementor\Core\DynamicTags\Tag' ) ) {
        return;
    }

    $dynamic_tags->register_group( 'iramo-tags', [
        'title' => __( 'فیلدهای داینامیک iRamoAi', 'iramo-ai' ),
    ] );

    class iRamo_Dynamic_Meta_Tag extends \Elementor\Core\DynamicTags\Tag {
        protected $tag_name;
        protected $tag_title;
        protected $meta_key;
        protected $fallback;
        protected $cats;

        public function __construct( $data = [], $cfg = [] ) {
            $this->tag_name  = $cfg['name'] ?? 'iramo-tool-provider';
            $this->tag_title = $cfg['title'] ?? 'شرکت سازنده ابزار';
            $this->meta_key  = $cfg['meta_key'] ?? '_iramo_provider';
            $this->fallback  = $cfg['fallback'] ?? '';
            $this->cats      = $cfg['cats'] ?? [ \Elementor\Modules\DynamicTags\Module::TEXT_CATEGORY ];
            parent::__construct( $data );
        }

        public function get_name() { return $this->tag_name; }
        public function get_title() { return $this->tag_title; }
        public function get_group() { return 'iramo-tags'; }
        public function get_categories() { return $this->cats; }

        public function render() {
            $pid = get_the_ID();
            if ( ! $pid ) {
                return;
            }

            switch ( $this->meta_key ) {
                case '_iramo_post_title':
                    echo esc_html( get_the_title( $pid ) );
                    return;

                case '_iramo_post_excerpt':
                    $tagline = trim( (string) get_post_meta( $pid, '_iramo_tagline', true ) );
                    $raw     = $tagline !== '' ? $tagline : ( get_the_excerpt( $pid ) ?: wp_trim_words( wp_strip_all_tags( get_post_field( 'post_content', $pid ) ), 24 ) );
                    echo esc_html( $raw );
                    return;

                case '_iramo_post_content':
                    $content = get_post_field( 'post_content', $pid );
                    echo wp_kses_post( apply_filters( 'the_content', $content ) );
                    return;

                case '_iramo_post_url':
                    echo esc_url( get_permalink( $pid ) );
                    return;

                case '_iramo_post_date':
                    $date = get_the_date( 'j F Y', $pid );
                    echo esc_html( function_exists( 'iramo_fa_digits' ) ? iramo_fa_digits( $date ) : $date );
                    return;

                case '_iramo_post_author':
                    $author_id = (int) get_post_field( 'post_author', $pid );
                    echo esc_html( get_the_author_meta( 'display_name', $author_id ) ?: 'تحریریه iRamoAi' );
                    return;

                case '_iramo_post_category':
                    $pt = get_post_type( $pid );
                    if ( $pt === 'iramo_ai_tool' ) {
                        $t = trim( (string) get_post_meta( $pid, '_iramo_task', true ) );
                        if ( $t !== '' ) {
                            echo esc_html( $t );
                        }
                        return;
                    }
                    $terms = wp_get_post_terms( $pid, $pt === 'post' ? 'category' : 'iramo_tool_task', [ 'fields' => 'names' ] );
                    if ( ! is_wp_error( $terms ) && ! empty( $terms ) ) {
                        echo esc_html( $terms[0] );
                    } else {
                        echo esc_html( $pt === 'iramo_course' ? 'دوره آکادمی' : ( $pt === 'iramo_product' ? 'محصول نرم‌افزاری' : 'مقاله تخصصی' ) );
                    }
                    return;

                case '_iramo_specs_line':
                    $in  = get_post_meta( $pid, '_iramo_input', true ) ?: 'Text';
                    $out = get_post_meta( $pid, '_iramo_output', true ) ?: 'Text';
                    $pr  = get_post_meta( $pid, '_iramo_pricing', true ) ?: 'Freemium';
                    echo esc_html( $in . ' → ' . $out . ' | ' . $pr );
                    return;

                case '_iramo_price_toman':
                    $p = (int) get_post_meta( $pid, '_iramo_price_toman', true );
                    if ( ! $p && get_post_type( $pid ) === 'product' && function_exists( 'wc_get_product' ) ) {
                        $wc = wc_get_product( $pid );
                        if ( $wc && $wc->get_price() !== '' ) {
                            $p = (int) $wc->get_price();
                        }
                    }
                    echo esc_html( function_exists( 'iramo_format_toman' ) ? iramo_format_toman( $p ) : number_format_i18n( $p ) . ' تومان' );
                    return;

                case '_iramo_course_duration':
                    $h = (int) ( get_post_meta( $pid, '_iramo_duration_hours', true ) ?: 12 );
                    echo esc_html( ( function_exists( 'iramo_fa_digits' ) ? iramo_fa_digits( $h ) : $h ) . ' ساعت آموزش' );
                    return;

                case '_iramo_course_level':
                    $lvl = trim( (string) get_post_meta( $pid, '_iramo_level', true ) );
                    echo esc_html( $lvl !== '' ? $lvl : 'جامع و پروژه‌محور' );
                    return;

                case '_iramo_course_price':
                    $cp = (int) ( get_post_meta( $pid, '_iramo_price_toman', true ) ?: 2900000 );
                    echo esc_html( 'ثبت‌نام و شروع · ' . ( function_exists( 'iramo_format_toman' ) ? iramo_format_toman( $cp ) : $cp ) );
                    return;

                case '_iramo_url':
                    $u = trim( (string) get_post_meta( $pid, '_iramo_url', true ) );
                    echo esc_url( $u !== '' ? $u : get_permalink( $pid ) );
                    return;

                case '_iramo_tagline':
                    $tl = trim( (string) get_post_meta( $pid, '_iramo_tagline', true ) );
                    echo esc_html( $tl !== '' ? $tl : wp_trim_words( wp_strip_all_tags( get_the_excerpt( $pid ) ?: get_post_field( 'post_content', $pid ) ), 18 ) );
                    return;

                default:
                    $val = get_post_meta( $pid, $this->meta_key, true );
                    echo esc_html( ( $val !== '' && $val !== null ) ? $val : $this->fallback );
                    return;
            }
        }
    }

    if ( class_exists( '\Elementor\Core\DynamicTags\Data_Tag' ) ) {
        class iRamo_Tag_Featured_Image extends \Elementor\Core\DynamicTags\Data_Tag {
            public function get_name() { return 'iramo-post-image'; }
            public function get_title() { return __( 'تصویر شاخص آیتم (iRamoAi)', 'iramo-ai' ); }
            public function get_group() { return 'iramo-tags'; }
            public function get_categories() { return [ \Elementor\Modules\DynamicTags\Module::IMAGE_CATEGORY ]; }

            public function get_value( array $options = [] ) {
                $pid      = get_the_ID();
                $thumb_id = $pid ? (int) get_post_thumbnail_id( $pid ) : 0;
                $url      = $thumb_id ? (string) wp_get_attachment_image_url( $thumb_id, 'large' ) : '';
                if ( ! $url && function_exists( 'iramo_get_theme_image' ) ) {
                    $pt  = $pid ? get_post_type( $pid ) : '';
                    $img = $pt === 'iramo_course' ? 'course_ai_mastery_1794737810266.jpg' : 'hero_iramo_desk_1794738858107.jpg';
                    $url = iramo_get_theme_image( $img );
                }
                return [
                    'id'  => $thumb_id,
                    'url' => $url,
                ];
            }
        }
        $dynamic_tags->register( new iRamo_Tag_Featured_Image() );
    }

    // Core Content & Card Dynamic Tags
    $dynamic_tags->register( new iRamo_Dynamic_Meta_Tag( [], [ 'name' => 'iramo-post-title', 'title' => 'عنوان پست / محصول / دوره / ابزار', 'meta_key' => '_iramo_post_title' ] ) );
    $dynamic_tags->register( new iRamo_Dynamic_Meta_Tag( [], [ 'name' => 'iramo-post-excerpt', 'title' => 'خلاصه / چکیده متن', 'meta_key' => '_iramo_post_excerpt' ] ) );
    $dynamic_tags->register( new iRamo_Dynamic_Meta_Tag( [], [ 'name' => 'iramo-post-content', 'title' => 'متن کامل محتوا', 'meta_key' => '_iramo_post_content' ] ) );
    $dynamic_tags->register( new iRamo_Dynamic_Meta_Tag( [], [ 'name' => 'iramo-post-url', 'title' => 'لینک صفحه آیتم (Permalink)', 'meta_key' => '_iramo_post_url', 'cats' => [ \Elementor\Modules\DynamicTags\Module::URL_CATEGORY, \Elementor\Modules\DynamicTags\Module::TEXT_CATEGORY ] ] ) );
    $dynamic_tags->register( new iRamo_Dynamic_Meta_Tag( [], [ 'name' => 'iramo-post-date', 'title' => 'تاریخ انتشار فارسی', 'meta_key' => '_iramo_post_date' ] ) );
    $dynamic_tags->register( new iRamo_Dynamic_Meta_Tag( [], [ 'name' => 'iramo-post-author', 'title' => 'نویسنده مقاله / مطلب', 'meta_key' => '_iramo_post_author' ] ) );
    $dynamic_tags->register( new iRamo_Dynamic_Meta_Tag( [], [ 'name' => 'iramo-post-category', 'title' => 'دسته‌بندی آیتم', 'meta_key' => '_iramo_post_category' ] ) );

    // AI Tool Dynamic Tags (No fake fallback when provider/popularity/likes are empty)
    $dynamic_tags->register( new iRamo_Dynamic_Meta_Tag( [], [ 'name' => 'iramo-tool-provider', 'title' => 'سازنده ابزار AI (Provider)', 'meta_key' => '_iramo_provider', 'fallback' => '' ] ) );
    $dynamic_tags->register( new iRamo_Dynamic_Meta_Tag( [], [ 'name' => 'iramo-tool-task', 'title' => 'دسته کاربرد ابزار (Task)', 'meta_key' => '_iramo_task', 'fallback' => 'AI Assistant' ] ) );
    $dynamic_tags->register( new iRamo_Dynamic_Meta_Tag( [], [ 'name' => 'iramo-tool-pricing', 'title' => 'مدل تعرفه ابزار (Pricing)', 'meta_key' => '_iramo_pricing', 'fallback' => 'Freemium' ] ) );
    $dynamic_tags->register( new iRamo_Dynamic_Meta_Tag( [], [ 'name' => 'iramo-tool-specs', 'title' => 'خلاصه مشخصات (ورودی/خروجی/قیمت)', 'meta_key' => '_iramo_specs_line' ] ) );
    $dynamic_tags->register( new iRamo_Dynamic_Meta_Tag( [], [ 'name' => 'iramo-tool-url', 'title' => 'لینک مستقیم ابزار (Try Now URL)', 'meta_key' => '_iramo_url', 'cats' => [ \Elementor\Modules\DynamicTags\Module::URL_CATEGORY, \Elementor\Modules\DynamicTags\Module::TEXT_CATEGORY ] ] ) );
    $dynamic_tags->register( new iRamo_Dynamic_Meta_Tag( [], [ 'name' => 'iramo-tool-prompt', 'title' => 'نمونه پرامپت ابزار AI', 'meta_key' => '_iramo_sample_prompt' ] ) );
    $dynamic_tags->register( new iRamo_Dynamic_Meta_Tag( [], [ 'name' => 'iramo-tool-popularity', 'title' => 'امتیاز محبوبیت ابزار AI', 'meta_key' => '_iramo_popularity', 'fallback' => '' ] ) );
    $dynamic_tags->register( new iRamo_Dynamic_Meta_Tag( [], [ 'name' => 'iramo-tool-likes', 'title' => 'تعداد لایک ابزار AI', 'meta_key' => '_iramo_likes', 'fallback' => '' ] ) );

    // Product & Course Dynamic Tags
    $dynamic_tags->register( new iRamo_Dynamic_Meta_Tag( [], [ 'name' => 'iramo-item-tagline', 'title' => 'شعار کوتاه / توضیح کارت (Tagline)', 'meta_key' => '_iramo_tagline' ] ) );
    $dynamic_tags->register( new iRamo_Dynamic_Meta_Tag( [], [ 'name' => 'iramo-product-price', 'title' => 'قیمت محصول iRamoAi (تومان)', 'meta_key' => '_iramo_price_toman' ] ) );
    $dynamic_tags->register( new iRamo_Dynamic_Meta_Tag( [], [ 'name' => 'iramo-product-billing', 'title' => 'برچسب لایسنس محصول', 'meta_key' => '_iramo_billing_label', 'fallback' => 'لایسنس دائمی' ] ) );
    $dynamic_tags->register( new iRamo_Dynamic_Meta_Tag( [], [ 'name' => 'iramo-course-duration', 'title' => 'مدت زمان دوره (ساعت)', 'meta_key' => '_iramo_course_duration' ] ) );
    $dynamic_tags->register( new iRamo_Dynamic_Meta_Tag( [], [ 'name' => 'iramo-course-level', 'title' => 'سطح دوره آموزشی', 'meta_key' => '_iramo_course_level' ] ) );
    $dynamic_tags->register( new iRamo_Dynamic_Meta_Tag( [], [ 'name' => 'iramo-course-price', 'title' => 'شهریه دوره (با برچسب ثبت‌نام)', 'meta_key' => '_iramo_course_price' ] ) );
    $dynamic_tags->register( new iRamo_Dynamic_Meta_Tag( [], [ 'name' => 'iramo-course-instructor', 'title' => 'نام مدرس دوره', 'meta_key' => '_iramo_instructor', 'fallback' => 'آکادمی iRamoAi' ] ) );
} );
