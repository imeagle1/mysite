<?php
/**
 * Module: Built-in SSR SEO Meta, OpenGraph, Schema.org JSON-LD & Security Hardening
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

/**
 * Check if a dedicated third-party SEO plugin is active so we avoid duplicate OG/canonical tags.
 */
function iramo_seo_external_plugin_active() {
    return defined( 'RANK_MATH_VERSION' ) || defined( 'WPSEO_VERSION' ) || defined( 'AIOSEO_VERSION' );
}

/**
 * Output Dynamic Meta Description, Canonical, OpenGraph & Twitter Tags
 */
add_action( 'wp_head', function() {
    $opts = get_option( 'iramo_ai_settings', [] );
    if ( isset( $opts['enable_builtin_seo'] ) && empty( $opts['enable_builtin_seo'] ) ) {
        return;
    }

    $brand_name = ! empty( $opts['brand_name'] ) ? $opts['brand_name'] : 'iRamoAi';
    $url        = is_front_page() ? home_url( '/' ) : ( is_singular() ? get_permalink() : home_url( add_query_arg( [] ) ) );
    $title      = wp_get_document_title();
    $desc       = get_bloginfo( 'description' ) ?: 'اکوسیستم نرم‌افزارهای هوشمند، دایرکتوری ابزارهای هوش مصنوعی و آکادمی آموزش iRamoAi.';
    $image      = '';

    if ( is_singular() ) {
        $pid     = get_queried_object_id();
        $tagline = get_post_meta( $pid, '_iramo_tagline', true );
        $excerpt = wp_strip_all_tags( get_the_excerpt( $pid ) ?: get_post_field( 'post_content', $pid ) );
        $desc    = wp_trim_words( $tagline ?: $excerpt ?: $desc, 30 );
        $image   = get_the_post_thumbnail_url( $pid, 'large' ) ?: '';
    } elseif ( is_post_type_archive( 'iramo_ai_tool' ) ) {
        $desc = 'دایرکتوری جامع و بررسی تخصصی ابزارهای هوش مصنوعی با ورودی، خروجی، تعرفه و نمونه پرامپت آماده.';
    } elseif ( is_post_type_archive( 'iramo_product' ) ) {
        $desc = 'محصولات نرم‌افزاری و اتوماسیون هوشمند iRamoAi با صدور خودکار لایسنس و اتصال ووکامرس.';
    }

    if ( ! iramo_seo_external_plugin_active() ) :
        ?>
        <meta name="description" content="<?php echo esc_attr( $desc ); ?>" />
        <link rel="canonical" href="<?php echo esc_url( $url ); ?>" />
        <meta property="og:locale" content="fa_IR" />
        <meta property="og:site_name" content="<?php echo esc_attr( $brand_name ); ?>" />
        <meta property="og:type" content="<?php echo is_singular() ? 'article' : 'website'; ?>" />
        <meta property="og:title" content="<?php echo esc_attr( $title ); ?>" />
        <meta property="og:description" content="<?php echo esc_attr( $desc ); ?>" />
        <meta property="og:url" content="<?php echo esc_url( $url ); ?>" />
        <?php if ( $image ) : ?>
            <meta property="og:image" content="<?php echo esc_url( $image ); ?>" />
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:image" content="<?php echo esc_url( $image ); ?>" />
        <?php else : ?>
            <meta name="twitter:card" content="summary" />
        <?php endif; ?>
        <meta name="twitter:title" content="<?php echo esc_attr( $title ); ?>" />
        <meta name="twitter:description" content="<?php echo esc_attr( $desc ); ?>" />
        <?php
    endif;

    // Output Rich Schema.org JSON-LD (always helpful for AI Tools, Products & Courses)
    $schema = null;
    if ( is_front_page() ) {
        $tools_url = get_post_type_archive_link( 'iramo_ai_tool' ) ?: home_url( '/ai-tools/' );
        $schema = [
            '@context' => 'https://schema.org',
            '@type'    => 'EducationalOrganization',
            'name'     => $brand_name,
            'url'      => home_url( '/' ),
            'potentialAction' => [
                '@type'       => 'SearchAction',
                'target'      => $tools_url . '?q={search_term_string}',
                'query-input' => 'required name=search_term_string',
            ],
        ];
    } elseif ( is_singular( 'iramo_ai_tool' ) ) {
        $pid       = get_queried_object_id();
        $pricing   = get_post_meta( $pid, '_iramo_pricing', true ) ?: 'Freemium';
        $pop_score = (int) ( get_post_meta( $pid, '_iramo_popularity', true ) ?: 94 );
        $rating    = round( max( 3.5, min( 5.0, ( $pop_score / 20 ) ) ), 1 );
        $schema = [
            '@context'            => 'https://schema.org',
            '@type'               => 'SoftwareApplication',
            'name'                => get_the_title( $pid ),
            'applicationCategory' => get_post_meta( $pid, '_iramo_task', true ) ?: 'AIApplication',
            'operatingSystem'     => 'Web',
            'description'         => $desc,
            'url'                 => get_permalink( $pid ),
            'author'              => [
                '@type' => 'Organization',
                'name'  => get_post_meta( $pid, '_iramo_provider', true ) ?: $brand_name,
            ],
            'offers' => [
                '@type'         => 'Offer',
                'price'         => $pricing === 'Free' ? '0' : '20',
                'priceCurrency' => 'USD',
            ],
            'aggregateRating' => [
                '@type'       => 'AggregateRating',
                'ratingValue' => $rating,
                'ratingCount' => max( 12, (int) get_post_meta( $pid, '_iramo_likes', true ) ),
            ],
        ];
    } elseif ( is_singular( [ 'iramo_product', 'product' ] ) ) {
        $pid   = get_queried_object_id();
        $price = (int) get_post_meta( $pid, '_iramo_price_toman', true );
        $schema = [
            '@context'    => 'https://schema.org',
            '@type'       => 'Product',
            'name'        => get_the_title( $pid ),
            'description' => $desc,
            'url'         => get_permalink( $pid ),
            'brand'       => [ '@type' => 'Brand', 'name' => $brand_name ],
            'offers'      => [
                '@type'         => 'Offer',
                'price'         => $price ?: 1900000,
                'priceCurrency' => 'IRR',
                'availability'  => 'https://schema.org/InStock',
            ],
        ];
    } elseif ( is_singular( 'iramo_course' ) ) {
        $pid = get_queried_object_id();
        $schema = [
            '@context'    => 'https://schema.org',
            '@type'       => 'Course',
            'name'        => get_the_title( $pid ),
            'description' => $desc,
            'provider'    => [
                '@type' => 'Organization',
                'name'  => $brand_name,
                'url'   => home_url( '/' ),
            ],
        ];
    } elseif ( is_singular( [ 'iramo_article', 'post' ] ) ) {
        $pid = get_queried_object_id();
        $schema = [
            '@context'      => 'https://schema.org',
            '@type'         => 'Article',
            'headline'      => get_the_title( $pid ),
            'description'   => $desc,
            'datePublished' => get_the_date( 'c', $pid ),
            'dateModified'  => get_the_modified_date( 'c', $pid ),
            'author'        => [
                '@type' => 'Person',
                'name'  => get_the_author_meta( 'display_name', get_post_field( 'post_author', $pid ) ),
            ],
        ];
    }

    if ( $schema ) {
        echo "\n<script type=\"application/ld+json\">" . wp_json_encode( $schema, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES ) . "</script>\n";
    }
}, 5 );

/**
 * Security Helper: Per-IP & Target Transient Rate Limiter (OTP, Forms, Votes)
 */
function iramo_get_client_ip() {
    $ip = $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
    return sanitize_text_field( (string) $ip );
}

function iramo_check_rate_limit( $action, $identifier = '', $limit = 6, $window_seconds = 300 ) {
    $key   = 'iramo_rl_' . md5( $action . '|' . iramo_get_client_ip() . '|' . strtolower( (string) $identifier ) );
    $count = (int) get_transient( $key );
    if ( $count >= $limit ) {
        return new WP_Error(
            'rate_limited',
            'تعداد درخواست‌های شما از حد مجاز بیشتر شده است. لطفاً چند دقیقه دیگر تلاش کنید.',
            [ 'status' => 429 ]
        );
    }
    set_transient( $key, $count + 1, $window_seconds );
    return true;
}

/**
 * WordPress Security Hardening Hooks
 */
add_action( 'init', function() {
    $opts      = get_option( 'iramo_ai_settings', [] );
    $hardening = ! isset( $opts['enable_security_hardening'] ) || ! empty( $opts['enable_security_hardening'] );

    if ( ! $hardening ) {
        return;
    }

    // Remove WP generator meta tag
    remove_action( 'wp_head', 'wp_generator' );

    // Disable XML-RPC pingback / brute-force surface
    add_filter( 'xmlrpc_enabled', '__return_false' );
} );

// Block anonymous ?author=N scanning
add_action( 'template_redirect', function() {
    $opts      = get_option( 'iramo_ai_settings', [] );
    $hardening = ! isset( $opts['enable_security_hardening'] ) || ! empty( $opts['enable_security_hardening'] );
    if ( $hardening && ! is_admin() && isset( $_GET['author'] ) && ! is_user_logged_in() ) {
        wp_safe_redirect( home_url( '/' ), 301 );
        exit;
    }
} );

// Hide REST user enumeration for unauthenticated requests
add_filter( 'rest_endpoints', function( $endpoints ) {
    $opts      = get_option( 'iramo_ai_settings', [] );
    $hardening = ! isset( $opts['enable_security_hardening'] ) || ! empty( $opts['enable_security_hardening'] );
    if ( $hardening && ! is_user_logged_in() ) {
        unset( $endpoints['/wp/v2/users'] );
        unset( $endpoints['/wp/v2/users/(?P<id>[\d]+)'] );
    }
    return $endpoints;
} );

// Security Headers
add_filter( 'wp_headers', function( $headers ) {
    $headers['X-Content-Type-Options'] = 'nosniff';
    $headers['X-Frame-Options']        = 'SAMEORIGIN';
    $headers['Referrer-Policy']        = 'strict-origin-when-cross-origin';
    return $headers;
} );
