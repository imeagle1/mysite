<?php
/**
 * Module: iRamo Hardened Telegram & Bale Notification + Webhook Bridge
 * - Sends instant notifications to Admin Chat ID for Consultation Forms, Elementor Pro Forms & WooCommerce Orders
 * - Cryptographic Webhook Secret Token verification (X-Telegram-Bot-Api-Secret-Token / Bale URL secret via hash_equals)
 * - Strict platform whitelist ('telegram' | 'bale')
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

/**
 * Get or generate the 32-character Webhook Secret stored in plugin options
 */
function iramo_get_or_create_webhook_secret( $regenerate = false ) {
    $secret = (string) get_option( 'iramo_webhook_secret', '' );
    if ( $regenerate || strlen( $secret ) < 24 ) {
        $secret = wp_generate_password( 32, false, false );
        update_option( 'iramo_webhook_secret', $secret, false );
    }
    return $secret;
}

/**
 * Allowed bot platforms strict whitelist
 */
function iramo_is_valid_bot_platform( $platform ) {
    return in_array( (string) $platform, [ 'telegram', 'bale' ], true );
}

class iRamo_Messenger_Bridge {
    public static function send_message( $platform, $chat_id, $text, $buttons = [] ) {
        if ( ! iramo_is_valid_bot_platform( $platform ) ) {
            return new WP_Error( 'invalid_platform', 'Unsupported messenger platform', [ 'status' => 400 ] );
        }

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

    public static function register_webhook( $platform ) {
        if ( ! iramo_is_valid_bot_platform( $platform ) ) {
            return new WP_Error( 'invalid_platform', 'پلتفرم نامعتبر است.' );
        }

        $token = $platform === 'bale'
            ? get_option( 'iramo_bale_bot_token' )
            : get_option( 'iramo_telegram_bot_token' );

        if ( empty( $token ) ) {
            return new WP_Error( 'missing_token', 'توکن ربات در تنظیمات وارد نشده است.' );
        }

        $secret = iramo_get_or_create_webhook_secret();

        if ( $platform === 'telegram' ) {
            $webhook_url = add_query_arg( 'platform', 'telegram', rest_url( 'iramo/v1/bot/webhook' ) );
            return wp_remote_post( 'https://api.telegram.org/bot' . $token . '/setWebhook', [
                'timeout' => 15,
                'body'    => [
                    'url'          => $webhook_url,
                    'secret_token' => $secret,
                ],
            ] );
        }

        $webhook_url = add_query_arg( [
            'platform' => 'bale',
            'secret'   => $secret,
        ], rest_url( 'iramo/v1/bot/webhook' ) );

        return wp_remote_post( 'https://tapi.bale.ai/bot' . $token . '/setWebhook', [
            'timeout' => 15,
            'body'    => [
                'url' => $webhook_url,
            ],
        ] );
    }
}

/**
 * Notify Admin on WooCommerce Order Completion
 */
add_action( 'iramo_order_delivered', function( $order_id, $user_id ) {
    $admin_chat = get_option( 'iramo_admin_chat_id' );
    if ( ! $admin_chat ) {
        return;
    }

    $msg = sprintf(
        "<b>سفارش جدید در سایت تکمیل شد</b>\nشماره سفارش: #%d\nشناسه کاربر: %d",
        (int) $order_id,
        (int) $user_id
    );

    iRamo_Messenger_Bridge::send_message( 'telegram', $admin_chat, $msg );
    iRamo_Messenger_Bridge::send_message( 'bale', $admin_chat, $msg );
}, 10, 2 );

/**
 * Forward Elementor Pro Form Submissions named `iramo_consultation_form` to Admin Telegram/Bale
 */
add_action( 'elementor_pro/forms/new_record', function( $record, $handler ) {
    $form_name = $record->get_form_settings( 'form_name' );
    if ( $form_name !== 'iramo_consultation_form' ) {
        return;
    }
    $fields    = $record->get( 'fields' );
    $lead_text = "<b>درخواست مشاوره جدید از سایت iRamoAi</b>\n";
    foreach ( $fields as $field ) {
        $lead_text .= sprintf( "• <b>%s:</b> %s\n", esc_html( $field['title'] ), esc_html( $field['value'] ) );
    }
    $admin_chat = get_option( 'iramo_admin_chat_id' );
    if ( $admin_chat ) {
        iRamo_Messenger_Bridge::send_message( 'telegram', $admin_chat, $lead_text );
        iRamo_Messenger_Bridge::send_message( 'bale', $admin_chat, $lead_text );
    }
}, 10, 2 );

/**
 * Hardened Webhook Endpoint for Telegram & Bale
 * Rejects unauthenticated/invalid secret calls with 403 Forbidden
 */
add_action( 'rest_api_init', function() {
    $webhook_perm = function( WP_REST_Request $request ) {
        $platform = sanitize_text_field( (string) $request->get_param( 'platform' ) );
        if ( ! iramo_is_valid_bot_platform( $platform ) ) {
            return new WP_Error( 'invalid_platform', 'Forbidden: unsupported bot platform.', [ 'status' => 403 ] );
        }

        $expected_secret = iramo_get_or_create_webhook_secret();
        $header_token    = (string) $request->get_header( 'x-telegram-bot-api-secret-token' );

        if ( $platform === 'telegram' ) {
            if ( $header_token !== '' && hash_equals( $expected_secret, $header_token ) ) {
                return true;
            }
            return new WP_Error( 'forbidden_webhook', 'Forbidden: invalid Telegram secret token.', [ 'status' => 403 ] );
        }

        $param_secret = (string) $request->get_param( 'secret' );
        if ( ( $header_token !== '' && hash_equals( $expected_secret, $header_token ) ) || ( $param_secret !== '' && hash_equals( $expected_secret, $param_secret ) ) ) {
            return true;
        }
        return new WP_Error( 'forbidden_webhook', 'Forbidden: invalid Bale webhook secret.', [ 'status' => 403 ] );
    };

    $webhook_cb = function( WP_REST_Request $request ) {
        $platform = sanitize_text_field( (string) $request->get_param( 'platform' ) );
        if ( ! iramo_is_valid_bot_platform( $platform ) ) {
            return new WP_Error( 'invalid_platform', 'Unsupported platform.', [ 'status' => 400 ] );
        }

        $data    = $request->get_json_params();
        $message = is_array( $data ) ? ( $data['message'] ?? null ) : null;
        if ( ! is_array( $message ) || empty( $message['chat']['id'] ) ) {
            return rest_ensure_response( [ 'ok' => true ] );
        }

        $chat_id = sanitize_text_field( (string) $message['chat']['id'] );
        $text    = trim( sanitize_text_field( (string) ( $message['text'] ?? '' ) ) );

        if ( strpos( $text, '/start' ) === 0 || strpos( $text, '/chatid' ) === 0 ) {
            $reply = sprintf(
                "سلام! به ربات اطلاع‌رسانی <b>iRamoAi</b> خوش آمدید.\nشناسه عددی چت شما (Chat ID): <code>%s</code>",
                esc_html( $chat_id )
            );
            iRamo_Messenger_Bridge::send_message( $platform, $chat_id, $reply );
        }

        return rest_ensure_response( [ 'ok' => true ] );
    };

    register_rest_route( 'iramo/v1', '/bot/webhook', [
        'methods'             => 'POST',
        'permission_callback' => $webhook_perm,
        'callback'            => $webhook_cb,
    ] );

    register_rest_route( 'iramo/v1', '/bot/webhook/(?P<platform>telegram|bale)/(?P<secret>[A-Za-z0-9]+)', [
        'methods'             => 'POST',
        'permission_callback' => $webhook_perm,
        'callback'            => $webhook_cb,
    ] );
} );
