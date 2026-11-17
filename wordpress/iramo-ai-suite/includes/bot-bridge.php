<?php
/**
 * Module: iRamo Telegram, Bale & SMS OTP Bridge (with Rate Limiting)
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
        "<b>خرید شما با موفقیت تایید شد!</b>\nشماره سفارش: #%d\nدسترسی دوره‌ها و لایسنس محصولات در پنل کاربری فعال گردید.",
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
            $msg = sprintf( "کد تایید ورود به پنل کاربری iRamoAi:\n<b>%s</b>\nاعتبار کد: ۳ دقیقه", $code );
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
            if ( function_exists( 'iramo_check_rate_limit' ) ) {
                $rl = iramo_check_rate_limit( 'send_otp', $target, 5, 300 );
                if ( is_wp_error( $rl ) ) {
                    return $rl;
                }
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

            if ( function_exists( 'iramo_check_rate_limit' ) ) {
                $rl = iramo_check_rate_limit( 'verify_otp', $target, 10, 300 );
                if ( is_wp_error( $rl ) ) {
                    return $rl;
                }
            }

            $key   = 'iramo_otp_' . md5( $channel . '_' . strtolower( trim( $target ) ) );
            $saved = get_transient( $key );
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

            if ( function_exists( 'iramo_check_rate_limit' ) ) {
                $rl = iramo_check_rate_limit( 'auth_email', $email, 10, 300 );
                if ( is_wp_error( $rl ) ) {
                    return $rl;
                }
            }

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
                    "سلام! اتصال شما به ربات iRamoAi فعال شد.\nشناسه چت عددی شما: <code>%s</code>\nمی‌توانید این کد را در سایت وارد کنید.",
                    esc_html( $chat_id )
                );
                iRamo_Messenger_Bridge::send_message( $platform, $chat_id, $reply );
            }

            return rest_ensure_response( [ 'ok' => true ] );
        },
    ] );
} );
