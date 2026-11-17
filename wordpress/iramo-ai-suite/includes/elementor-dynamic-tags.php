<?php
/**
 * Module: Elementor Dynamic Tags for iRamoAi AI Tools & Products
 * Allows displaying Tool Provider, Task, Input/Output, Pricing, Prompt & Product Price inside ANY native Elementor widget.
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
            if ( $this->meta_key === '_iramo_specs_line' ) {
                $in  = get_post_meta( $pid, '_iramo_input', true ) ?: 'Text';
                $out = get_post_meta( $pid, '_iramo_output', true ) ?: 'Text';
                $pr  = get_post_meta( $pid, '_iramo_pricing', true ) ?: 'Freemium';
                echo esc_html( $in . ' → ' . $out . ' | ' . $pr );
                return;
            }
            if ( $this->meta_key === '_iramo_price_toman' ) {
                $p = (int) get_post_meta( $pid, '_iramo_price_toman', true );
                echo esc_html( function_exists( 'iramo_format_toman' ) ? iramo_format_toman( $p ) : number_format_i18n( $p ) . ' تومان' );
                return;
            }
            $val = get_post_meta( $pid, $this->meta_key, true );
            echo esc_html( $val !== '' ? $val : $this->fallback );
        }
    }

    class iRamo_Tag_Provider extends iRamo_Dynamic_Meta_Tag {
        public function __construct( $d = [] ) {
            parent::__construct( $d, [ 'name' => 'iramo-tool-provider', 'title' => 'سازنده ابزار AI (Provider)', 'meta_key' => '_iramo_provider', 'fallback' => 'AI Partner' ] );
        }
    }
    class iRamo_Tag_Task extends iRamo_Dynamic_Meta_Tag {
        public function __construct( $d = [] ) {
            parent::__construct( $d, [ 'name' => 'iramo-tool-task', 'title' => 'دسته کاربرد ابزار (Task)', 'meta_key' => '_iramo_task', 'fallback' => 'AI Assistant' ] );
        }
    }
    class iRamo_Tag_Pricing extends iRamo_Dynamic_Meta_Tag {
        public function __construct( $d = [] ) {
            parent::__construct( $d, [ 'name' => 'iramo-tool-pricing', 'title' => 'مدل تعرفه ابزار (Pricing)', 'meta_key' => '_iramo_pricing', 'fallback' => 'Freemium' ] );
        }
    }
    class iRamo_Tag_Specs extends iRamo_Dynamic_Meta_Tag {
        public function __construct( $d = [] ) {
            parent::__construct( $d, [ 'name' => 'iramo-tool-specs', 'title' => 'خلاصه مشخصات (ورودی/خروجی/قیمت)', 'meta_key' => '_iramo_specs_line' ] );
        }
    }
    class iRamo_Tag_Tool_URL extends iRamo_Dynamic_Meta_Tag {
        public function __construct( $d = [] ) {
            parent::__construct( $d, [ 'name' => 'iramo-tool-url', 'title' => 'لینک مستقیم ابزار (Try Now URL)', 'meta_key' => '_iramo_url', 'cats' => [ \Elementor\Modules\DynamicTags\Module::URL_CATEGORY, \Elementor\Modules\DynamicTags\Module::TEXT_CATEGORY ] ] );
        }
    }
    class iRamo_Tag_Tagline extends iRamo_Dynamic_Meta_Tag {
        public function __construct( $d = [] ) {
            parent::__construct( $d, [ 'name' => 'iramo-item-tagline', 'title' => 'شعار کوتاه / توضیح کارت (Tagline)', 'meta_key' => '_iramo_tagline' ] );
        }
    }
    class iRamo_Tag_Product_Price extends iRamo_Dynamic_Meta_Tag {
        public function __construct( $d = [] ) {
            parent::__construct( $d, [ 'name' => 'iramo-product-price', 'title' => 'قیمت محصول iRamoAi (تومان)', 'meta_key' => '_iramo_price_toman' ] );
        }
    }
    class iRamo_Tag_Sample_Prompt extends iRamo_Dynamic_Meta_Tag {
        public function __construct( $d = [] ) {
            parent::__construct( $d, [ 'name' => 'iramo-tool-prompt', 'title' => 'نمونه پرامپت ابزار AI', 'meta_key' => '_iramo_sample_prompt' ] );
        }
    }

    $dynamic_tags->register( new iRamo_Tag_Provider() );
    $dynamic_tags->register( new iRamo_Tag_Task() );
    $dynamic_tags->register( new iRamo_Tag_Pricing() );
    $dynamic_tags->register( new iRamo_Tag_Specs() );
    $dynamic_tags->register( new iRamo_Tag_Tool_URL() );
    $dynamic_tags->register( new iRamo_Tag_Tagline() );
    $dynamic_tags->register( new iRamo_Tag_Product_Price() );
    $dynamic_tags->register( new iRamo_Tag_Sample_Prompt() );
} );
