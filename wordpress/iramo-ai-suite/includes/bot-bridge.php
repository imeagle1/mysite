<?php
/**
 * Module: iRamo Hardened Telegram, Bale & SMS OTP Bridge
 * - Cryptographic Webhook Secret Token (X-Telegram-Bot-Api-Secret-Token / Bale URL Secret with hash_equals)
 * - Strict platform whitelist ('telegram' | 'bale')
 * - One-time 10-min transient link codes (no unverified username->chat_id hijacking)
 * - Bounded verified chat_id map (max 500 entries)
 * - 6-digit OTP verified with hash_equals & automatic invalidation after 5 failed attempts
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

/**
 * Normalize a messenger handle without leading '@' (lowercase, alphanumeric + underscore)
 */
function iramo_normalize_bot_handle( $handle ) {
    $clean = ltrim( strtolower( trim( sanitize_text_field( (string) $handle ) ) ), '@' );
    if ( $clean === '' || ! preg_match( '/^[a-z0-9_]{3,64}$/', $clean ) ) {
        return '';
    }
    return $clean;
}

/**
 * Find a WordPress user strictly by verified _iramo_<platform>_chat_id
 */
function iramo_find_user_by_bot_chat_id( $platform, $chat_id, $require_verified = true ) {
    if ( ! iramo_is_valid_bot_platform( $platform ) || $chat_id === '' ) {
        return 0;
    }

    $meta_query = [
        [
            'key'   => '_iramo_' . $platform . '_chat_id',
            'value' => sanitize_text_field( (string) $chat_id ),
        ],
    ];
    if ( $require_verified ) {
        $meta_query['relation'] = 'AND';
        $meta_query[]           = [
            'key'   => '_iramo_' . $platform . '_verified',
            'value' => '1',
        ];
    }

    $users = get_users( [
        'meta_query' => $meta_query,
        'number'     => 1,
        'fields'     => 'ID',
    ] );

    return ! empty( $users ) ? (int) $users[0] : 0;
}

/**
 * Check if a bot handle is already registered on another WordPress user account
 */
function iramo_is_bot_handle_taken( $platform, $handle, $exclude_user_id = 0 ) {
    if ( ! iramo_is_valid_bot_platform( $platform ) ) {
        return false;
    }
    $norm = iramo_normalize_bot_handle( $handle );
    if ( $norm === '' ) {
        return false;
    }

    $users = get_users( [
        'exclude'    => $exclude_user_id > 0 ? [ (int) $exclude_user_id ] : [],
        'meta_query' => [
            [
                'key'     => '_iramo_' . $platform . '_handle',
                'value'   => [ $norm, '@' . $norm ],
                'compare' => 'IN',
            ],
        ],
        'number'     => 1,
        'fields'     => 'ID',
    ] );

    return ! empty( $users );
}

/**
 * Assign a webhook-verified bot handle to a user ONLY after ensuring uniqueness
 */
function iramo_assign_user_bot_handle( $platform, $user_id, $raw_handle ) {
    $uid  = (int) $user_id;
    $norm = iramo_normalize_bot_handle( $raw_handle );
    if ( $uid <= 0 || $norm === '' ) {
        return false;
    }

    if ( iramo_is_bot_handle_taken( $platform, $norm, $uid ) ) {
        return new WP_Error(
            'handle_taken',
            'این نام کاربری پیام‌رسان قبلاً برای حساب کاربری دیگری ثبت شده است.'
        );
    }

    update_user_meta( $uid, '_iramo_' . $platform . '_handle', '@' . $norm );
    return true;
}

/**
 * Retrieve verified chat map entry by verified chat_id
 */
function iramo_get_verified_chat_entry( $platform, $chat_id ) {
    if ( ! iramo_is_valid_bot_platform( $platform ) || $chat_id === '' ) {
        return null;
    }
    $map      = get_option( 'iramo_verified_chat_map_' . $platform, [] );
    $chat_str = sanitize_text_field( (string) $chat_id );
    if ( is_array( $map ) && ! empty( $map[ $chat_str ] ) && is_array( $map[ $chat_str ] ) ) {
        return $map[ $chat_str ];
    }
    return null;
}

/**
 * Save a webhook-verified chat_id (exclusively sourced from message.from.id & message.from.username)
 * Indexed STRICTLY by chat_id in a size-bounded map (max 500 entries)
 */
function iramo_save_verified_bot_chat( $platform, $chat_id, $user_id = 0, $from_username = '' ) {
    if ( ! iramo_is_valid_bot_platform( $platform ) || empty( $chat_id ) ) {
        return new WP_Error( 'invalid_chat', 'شناسه چت معتبر نیست.' );
    }

    $chat_str  = sanitize_text_field( (string) $chat_id );
    $uid       = (int) $user_id;
    $norm_user = iramo_normalize_bot_handle( $from_username );

    // Prevent binding an already-claimed chat_id onto a different logged-in account
    $existing_owner = iramo_find_user_by_bot_chat_id( $platform, $chat_str, true );
    if ( $uid > 0 && $existing_owner > 0 && $existing_owner !== $uid ) {
        return new WP_Error(
            'chat_id_already_bound',
            'این حساب پیام‌رسان قبلاً به حساب کاربری دیگری متصل شده است.'
        );
    }

    if ( $uid > 0 ) {
        update_user_meta( $uid, '_iramo_' . $platform . '_chat_id', $chat_str );
        update_user_meta( $uid, '_iramo_' . $platform . '_verified', '1' );
        if ( $norm_user !== '' ) {
            iramo_assign_user_bot_handle( $platform, $uid, $norm_user );
        }
    } elseif ( $existing_owner > 0 && $norm_user !== '' ) {
        iramo_assign_user_bot_handle( $platform, $existing_owner, $norm_user );
    }

    $option_name = 'iramo_verified_chat_map_' . $platform;
    $map         = get_option( $option_name, [] );
    if ( ! is_array( $map ) ) {
        $map = [];
    }

    $entry = [
        'chat_id'     => $chat_str,
        'username'    => $norm_user !== '' ? '@' . $norm_user : '',
        'user_id'     => $uid > 0 ? $uid : $existing_owner,
        'verified_at' => time(),
        'source'      => 'webhook_from',
    ];

    // Strictly index ONLY by verified chat_id (never by user-supplied target strings or handles)
    $map[ $chat_str ] = $entry;

    // Strictly bound option size (cap at 500 entries, keeping most recently verified)
    $max_cap = (int) apply_filters( 'iramo_bot_chat_map_limit', 500 );
    if ( $max_cap > 0 && count( $map ) > $max_cap ) {
        uasort( $map, function( $a, $b ) {
            return ( (int) ( $b['verified_at'] ?? 0 ) ) <=> ( (int) ( $a['verified_at'] ?? 0 ) );
        } );
        $map = array_slice( $map, 0, $max_cap, true );
    }

    update_option( $option_name, $map, false );
    return true;
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

class iRamo_OTP_Gateway {
    /**
     * Resolve identity STRICTLY via verified numeric chat_id (never trusts handles/usernames)
     */
    public static function resolve_bot_chat_id( $channel, $target ) {
        if ( ! iramo_is_valid_bot_platform( $channel ) ) {
            return '';
        }

        $cleaned = trim( sanitize_text_field( (string) $target ) );
        if ( $cleaned === '' || ! preg_match( '/^-?[0-9]{4,32}$/', $cleaned ) ) {
            return '';
        }

        // 1. Check existing verified WordPress user meta (_iramo_<platform>_chat_id)
        $uid = iramo_find_user_by_bot_chat_id( $channel, $cleaned, true );
        if ( $uid > 0 ) {
            return $cleaned;
        }

        // 2. Check webhook-verified chat map indexed strictly by chat_id
        $entry = iramo_get_verified_chat_entry( $channel, $cleaned );
        if ( is_array( $entry ) && ! empty( $entry['chat_id'] ) && (string) $entry['chat_id'] === $cleaned ) {
            return $cleaned;
        }

        return '';
    }

    public static function dispatch_otp( $channel, $target, $code ) {
        $opts = get_option( 'iramo_ai_settings', [] );

        if ( iramo_is_valid_bot_platform( $channel ) ) {
            $chat_id = self::resolve_bot_chat_id( $channel, $target );
            if ( empty( $chat_id ) ) {
                $bot_user = $channel === 'bale'
                    ? ( $opts['bale_bot_username'] ?? '@iRamoBaleBot' )
                    : ( $opts['telegram_bot_username'] ?? '@iRamoBot' );
                return new WP_Error(
                    'bot_not_verified',
                    sprintf( 'ابتدا «دریافت کد اتصال» را بزنید و کد یکبارمصرف را به ربات %s ارسال کنید تا شناسه عددی چت (Chat ID) شما تأیید شود. ورود فقط با Chat ID تأییدشده انجام می‌شود.', $bot_user ),
                    [ 'status' => 400 ]
                );
            }
            $msg = sprintf( "کد تایید ۶ رقمی ورود به پنل کاربری iRamoAi:\n<b>%s</b>\nاعتبار کد: ۳ دقیقه", $code );
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

        return new WP_Error( 'unsupported_channel', 'کانال احراز هویت نامعتبر است.', [ 'status' => 400 ] );
    }
}

add_action( 'rest_api_init', function() {
    /**
     * Request a 10-minute one-time link code for Telegram / Bale verification
     * - Unauthenticated guests: ONLY allowed with intent='login'; input 'target' is NEVER accepted or stored
     * - Logged-in users: any supplied 'target' is echoed ONLY as displayTarget and NEVER stored in transient/mapping
     */
    register_rest_route( 'iramo/v1', '/bot/request-link', [
        'methods'             => 'POST',
        'permission_callback' => '__return_true',
        'callback'            => function( WP_REST_Request $request ) {
            $platform       = sanitize_text_field( (string) $request->get_param( 'platform' ) );
            $intent         = sanitize_text_field( (string) $request->get_param( 'intent' ) );
            $display_target = sanitize_text_field( (string) $request->get_param( 'target' ) );
            $is_logged_in   = is_user_logged_in();

            if ( ! iramo_is_valid_bot_platform( $platform ) ) {
                return new WP_Error( 'invalid_platform', 'پلتفرم مجاز فقط telegram یا bale است.', [ 'status' => 400 ] );
            }

            if ( ! $is_logged_in ) {
                if ( $intent !== 'login' ) {
                    return new WP_Error(
                        'login_intent_required',
                        'برای اتصال حساب به پروفایل وارد شوید یا درخواست را با قصد ورود (intent=login) ارسال کنید.',
                        [ 'status' => 403 ]
                    );
                }
                // Guests cannot supply a target at all
                $display_target = '';
            }

            if ( function_exists( 'iramo_check_rate_limit' ) ) {
                $rl_subject = $is_logged_in ? 'uid_' . get_current_user_id() : ( $_SERVER['REMOTE_ADDR'] ?? 'guest' );
                $rl         = iramo_check_rate_limit( 'bot_request_link_' . $platform, (string) $rl_subject, 8, 600 );
                if ( is_wp_error( $rl ) ) {
                    return $rl;
                }
            }

            // Generate readable unambiguous short code
            $alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
            $rand     = '';
            for ( $i = 0; $i < 6; $i++ ) {
                $rand .= $alphabet[ wp_rand( 0, strlen( $alphabet ) - 1 ) ];
            }
            $code     = 'IR-' . $rand;
            $nonce_id = wp_generate_password( 12, false, false );
            $user_id  = $is_logged_in ? get_current_user_id() : 0;

            // Intentionally store NO user-supplied target in the transient
            set_transient( 'iramo_bind_code_' . $code, [
                'user_id'    => $user_id,
                'platform'   => $platform,
                'intent'     => $is_logged_in ? ( $intent ?: 'bind' ) : 'login',
                'nonce_id'   => $nonce_id,
                'created_at' => time(),
            ], 10 * MINUTE_IN_SECONDS );

            $opts     = get_option( 'iramo_ai_settings', [] );
            $bot_user = $platform === 'bale'
                ? ( $opts['bale_bot_username'] ?? '@iRamoBaleBot' )
                : ( $opts['telegram_bot_username'] ?? '@iRamoBot' );
            $clean_bot = ltrim( $bot_user, '@' );
            $deep_link = $platform === 'telegram'
                ? 'https://t.me/' . rawurlencode( $clean_bot ) . '?start=' . rawurlencode( $code )
                : 'https://ble.ir/' . rawurlencode( $clean_bot );

            $response = [
                'success'     => true,
                'platform'    => $platform,
                'intent'      => $is_logged_in ? ( $intent ?: 'bind' ) : 'login',
                'code'        => $code,
                'command'     => '/start ' . $code,
                'nonceId'     => $nonce_id,
                'expiresIn'   => 600,
                'botUsername' => $bot_user,
                'deepLink'    => $deep_link,
            ];
            if ( $is_logged_in && $display_target !== '' ) {
                $response['displayTarget'] = $display_target;
            }

            return rest_ensure_response( $response );
        },
    ] );

    /**
     * Poll verification status using secret session nonceId (or current logged-in user's verified chat_id)
     */
    register_rest_route( 'iramo/v1', '/bot/check-link', [
        'methods'             => 'POST',
        'permission_callback' => '__return_true',
        'callback'            => function( WP_REST_Request $request ) {
            $platform = sanitize_text_field( (string) $request->get_param( 'platform' ) );
            $nonce_id = sanitize_text_field( (string) $request->get_param( 'nonceId' ) );

            if ( ! iramo_is_valid_bot_platform( $platform ) ) {
                return new WP_Error( 'invalid_platform', 'پلتفرم نامعتبر است.', [ 'status' => 400 ] );
            }

            if ( $nonce_id !== '' ) {
                $confirmed = get_transient( 'iramo_bind_done_' . $nonce_id );
                if ( is_array( $confirmed ) && ! empty( $confirmed['chat_id'] ) && ( $confirmed['platform'] ?? $platform ) === $platform ) {
                    $verified_cid = (string) $confirmed['chat_id'];
                    return rest_ensure_response( [
                        'connected' => true,
                        'chatId'    => $verified_cid,
                        'username'  => (string) ( $confirmed['username'] ?? '' ),
                        'target'    => $verified_cid,
                    ] );
                }
            }

            if ( is_user_logged_in() ) {
                $uid = get_current_user_id();
                $cid = (string) get_user_meta( $uid, '_iramo_' . $platform . '_chat_id', true );
                if ( $cid !== '' && get_user_meta( $uid, '_iramo_' . $platform . '_verified', true ) === '1' ) {
                    return rest_ensure_response( [
                        'connected' => true,
                        'chatId'    => $cid,
                        'username'  => (string) get_user_meta( $uid, '_iramo_' . $platform . '_handle', true ),
                        'target'    => $cid,
                    ] );
                }
            }

            return rest_ensure_response( [ 'connected' => false ] );
        },
    ] );

    /**
     * Send 6-Digit OTP (Bot identity keyed strictly on verified _iramo_<platform>_chat_id)
     */
    register_rest_route( 'iramo/v1', '/auth/send-otp', [
        'methods'             => 'POST',
        'permission_callback' => '__return_true',
        'callback'            => function( WP_REST_Request $request ) {
            $channel = sanitize_text_field( (string) $request->get_param( 'channel' ) );
            $target  = sanitize_text_field( (string) $request->get_param( 'target' ) );

            if ( ! in_array( $channel, [ 'telegram', 'bale', 'sms' ], true ) ) {
                return new WP_Error( 'unsupported_channel', 'روش ارسال کد نامعتبر است.', [ 'status' => 400 ] );
            }
            if ( empty( $target ) ) {
                return new WP_Error( 'invalid_target', 'شماره یا شناسه چت الزامی است.', [ 'status' => 400 ] );
            }
            if ( function_exists( 'iramo_check_rate_limit' ) ) {
                $rl = iramo_check_rate_limit( 'send_otp', $target, 5, 300 );
                if ( is_wp_error( $rl ) ) {
                    return $rl;
                }
            }

            $otp_identity = strtolower( trim( $target ) );
            if ( iramo_is_valid_bot_platform( $channel ) ) {
                $verified_chat_id = iRamo_OTP_Gateway::resolve_bot_chat_id( $channel, $target );
                if ( $verified_chat_id === '' ) {
                    return new WP_Error(
                        'bot_not_verified',
                        'ورود پیام‌رسان فقط با شناسه چت تأییدشده (Chat ID) مجاز است. لطفاً ابتدا «دریافت کد اتصال» را انجام دهید.',
                        [ 'status' => 403 ]
                    );
                }
                // Check account ownership via _iramo_<platform>_chat_id when user is logged in
                $owner_uid = iramo_find_user_by_bot_chat_id( $channel, $verified_chat_id, true );
                if ( is_user_logged_in() && $owner_uid > 0 && $owner_uid !== get_current_user_id() ) {
                    return new WP_Error( 'chat_id_taken', 'این شناسه چت به حساب کاربری دیگری متصل است.', [ 'status' => 403 ] );
                }
                $otp_identity = $verified_chat_id;
            }

            $code   = (string) wp_rand( 100000, 999999 );
            $result = iRamo_OTP_Gateway::dispatch_otp( $channel, $otp_identity, $code );
            if ( is_wp_error( $result ) ) {
                return $result;
            }

            $otp_key = 'iramo_otp_' . md5( $channel . '_' . $otp_identity );
            set_transient( $otp_key, [
                'code'     => $code,
                'attempts' => 0,
            ], 3 * MINUTE_IN_SECONDS );

            return rest_ensure_response( [
                'success' => true,
                'channel' => $channel,
                'chatId'  => iramo_is_valid_bot_platform( $channel ) ? $otp_identity : '',
            ] );
        },
    ] );

    /**
     * Verify 6-Digit OTP using hash_equals with max 5 attempts; finds/binds WP user STRICTLY by _iramo_<platform>_chat_id
     */
    register_rest_route( 'iramo/v1', '/auth/verify-otp', [
        'methods'             => 'POST',
        'permission_callback' => '__return_true',
        'callback'            => function( WP_REST_Request $request ) {
            $channel = sanitize_text_field( (string) $request->get_param( 'channel' ) );
            $target  = sanitize_text_field( (string) $request->get_param( 'target' ) );
            $code    = trim( sanitize_text_field( (string) $request->get_param( 'code' ) ) );
            $name    = sanitize_text_field( (string) $request->get_param( 'name' ) );

            if ( ! in_array( $channel, [ 'telegram', 'bale', 'sms' ], true ) ) {
                return new WP_Error( 'unsupported_channel', 'روش احراز هویت نامعتبر است.', [ 'status' => 400 ] );
            }
            if ( empty( $target ) || empty( $code ) ) {
                return new WP_Error( 'missing_params', 'شناسه و کد تایید الزامی هستند.', [ 'status' => 400 ] );
            }
            if ( function_exists( 'iramo_check_rate_limit' ) ) {
                $rl = iramo_check_rate_limit( 'verify_otp', $target, 10, 300 );
                if ( is_wp_error( $rl ) ) {
                    return $rl;
                }
            }

            $is_bot       = iramo_is_valid_bot_platform( $channel );
            $otp_identity = strtolower( trim( $target ) );
            $verified_cid = '';

            if ( $is_bot ) {
                $verified_cid = iRamo_OTP_Gateway::resolve_bot_chat_id( $channel, $target );
                if ( $verified_cid === '' ) {
                    return new WP_Error( 'bot_not_verified', 'شناسه چت تأییدشده نامعتبر است.', [ 'status' => 403 ] );
                }
                $otp_identity = $verified_cid;
            }

            $key   = 'iramo_otp_' . md5( $channel . '_' . $otp_identity );
            $saved = get_transient( $key );
            if ( ! is_array( $saved ) || empty( $saved['code'] ) ) {
                return new WP_Error( 'invalid_otp', 'کد تایید نامعتبر یا منقضی شده است.', [ 'status' => 403 ] );
            }

            if ( ! hash_equals( (string) $saved['code'], (string) $code ) ) {
                $attempts = (int) ( $saved['attempts'] ?? 0 ) + 1;
                if ( $attempts >= 5 ) {
                    delete_transient( $key );
                    return new WP_Error(
                        'otp_invalidated',
                        'به دلیل چند تلاش اشتباه، کد تایید باطل شد. لطفاً کد جدید درخواست کنید.',
                        [ 'status' => 403 ]
                    );
                }
                $saved['attempts'] = $attempts;
                set_transient( $key, $saved, 3 * MINUTE_IN_SECONDS );
                return new WP_Error( 'invalid_otp', 'کد تایید اشتباه است.', [ 'status' => 403 ] );
            }

            delete_transient( $key );

            if ( $is_bot ) {
                // Find existing user strictly by verified _iramo_<platform>_chat_id
                $user_id = iramo_find_user_by_bot_chat_id( $channel, $verified_cid, true );
                if ( $user_id <= 0 ) {
                    $user_id = iramo_find_user_by_bot_chat_id( $channel, $verified_cid, false );
                }

                if ( $user_id <= 0 && is_user_logged_in() ) {
                    // Bind newly verified chat_id to the currently logged-in user
                    $user_id = get_current_user_id();
                }

                $map_entry       = iramo_get_verified_chat_entry( $channel, $verified_cid );
                $verified_handle = is_array( $map_entry ) ? (string) ( $map_entry['username'] ?? '' ) : '';

                if ( $user_id <= 0 ) {
                    $opts = get_option( 'iramo_ai_settings', [] );
                    if ( isset( $opts['allow_registration'] ) && empty( $opts['allow_registration'] ) ) {
                        return new WP_Error( 'registration_disabled', 'ثبت‌نام کاربر جدید توسط مدیر غیرفعال شده است.', [ 'status' => 403 ] );
                    }
                    if ( $verified_handle !== '' && iramo_is_bot_handle_taken( $channel, $verified_handle, 0 ) ) {
                        return new WP_Error( 'handle_taken', 'نام کاربری پیام‌رسان شما قبلاً روی حساب دیگری ثبت شده است.', [ 'status' => 409 ] );
                    }
                    $login_slug = 'iramo_' . substr( md5( $channel . '_chat_' . $verified_cid ), 0, 10 );
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
                }

                update_user_meta( $user_id, '_iramo_' . $channel . '_chat_id', $verified_cid );
                update_user_meta( $user_id, '_iramo_' . $channel . '_verified', '1' );
                if ( $verified_handle !== '' ) {
                    iramo_assign_user_bot_handle( $channel, $user_id, $verified_handle );
                }
            } else {
                $users = get_users( [
                    'meta_key'   => '_iramo_phone',
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
                    $login_slug = 'iramo_' . substr( md5( 'sms_' . $target ), 0, 10 );
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
                    update_user_meta( $user_id, '_iramo_phone', $target );
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

    /**
     * Save verified bot preferences (chat IDs themselves can ONLY be verified via one-time link code)
     */
    register_rest_route( 'iramo/v1', '/bot/bind', [
        'methods'             => 'POST',
        'permission_callback' => function() { return is_user_logged_in(); },
        'callback'            => function( WP_REST_Request $request ) {
            $user_id = get_current_user_id();
            if ( $request->has_param( 'prefs' ) && is_array( $request->get_param( 'prefs' ) ) ) {
                $raw   = $request->get_param( 'prefs' );
                $clean = [
                    'autoLicense'  => ! empty( $raw['autoLicense'] ),
                    'lessonAlerts' => ! empty( $raw['lessonAlerts'] ),
                    'otpLogin'     => ! empty( $raw['otpLogin'] ),
                ];
                update_user_meta( $user_id, '_iramo_bot_prefs', $clean );
            }
            return rest_ensure_response( [ 'success' => true ] );
        },
    ] );

    /**
     * Authenticated Webhook Endpoint for Telegram & Bale
     * Rejects unauthenticated/invalid secret calls with 403 and strictly whitelists platform
     */
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

        // Bale: support X-Telegram-Bot-Api-Secret-Token header if sent, or secret parameter/route segment
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

        // Extract identity strictly from webhook payload message.from (never from transient target)
        $from        = is_array( $message['from'] ?? null ) ? $message['from'] : [];
        $from_id     = ! empty( $from['id'] ) ? sanitize_text_field( (string) $from['id'] ) : '';
        $msg_chat_id = sanitize_text_field( (string) $message['chat']['id'] );
        $chat_type   = sanitize_text_field( (string) ( $message['chat']['type'] ?? 'private' ) );

        if ( $from_id === '' || $msg_chat_id !== $from_id || $chat_type !== 'private' ) {
            return rest_ensure_response( [ 'ok' => true ] );
        }

        $chat_id       = $from_id;
        $from_username = ! empty( $from['username'] ) ? iramo_normalize_bot_handle( $from['username'] ) : '';
        $text          = trim( sanitize_text_field( (string) ( $message['text'] ?? '' ) ) );

        // Parse one-time binding code from `/start IR-XXXXXX`, `/link IR-XXXXXX`, or `IR-XXXXXX`
        $code = '';
        if ( preg_match( '/^\/(?:start|link)\s+([A-Z0-9\-]{6,16})$/i', $text, $m ) ) {
            $code = strtoupper( $m[1] );
        } elseif ( preg_match( '/^(IR-[A-Z0-9]{6,12})$/i', $text, $m ) ) {
            $code = strtoupper( $m[1] );
        }

        if ( $code !== '' ) {
            $bind_data = get_transient( 'iramo_bind_code_' . $code );
            if ( is_array( $bind_data ) && ( $bind_data['platform'] ?? '' ) === $platform ) {
                // One-time consumption
                delete_transient( 'iramo_bind_code_' . $code );

                $uid      = (int) ( $bind_data['user_id'] ?? 0 );
                $nonce_id = (string) ( $bind_data['nonce_id'] ?? '' );

                $saved = iramo_save_verified_bot_chat( $platform, $chat_id, $uid, $from_username );
                if ( is_wp_error( $saved ) ) {
                    iRamo_Messenger_Bridge::send_message( $platform, $chat_id, $saved->get_error_message() );
                    return rest_ensure_response( [ 'ok' => true, 'bound' => false ] );
                }

                if ( $nonce_id !== '' ) {
                    set_transient( 'iramo_bind_done_' . $nonce_id, [
                        'platform' => $platform,
                        'chat_id'  => $chat_id,
                        'username' => $from_username !== '' ? '@' . $from_username : '',
                    ], 10 * MINUTE_IN_SECONDS );
                }

                $reply = sprintf(
                    "اتصال امن حساب کاربری شما در <b>iRamoAi</b> با موفقیت تأیید شد ✓\nشناسه چت تأییدشده: <code>%s</code>\nاکنون می‌توانید در سایت دکمه «دریافت کد ورود» را بزنید.",
                    esc_html( $chat_id )
                );
                iRamo_Messenger_Bridge::send_message( $platform, $chat_id, $reply );
                return rest_ensure_response( [ 'ok' => true, 'bound' => true ] );
            }

            iRamo_Messenger_Bridge::send_message(
                $platform,
                $chat_id,
                'کد اتصال نامعتبر یا منقضی شده است. لطفاً در سایت روی «دریافت کد اتصال» کلیک کرده و کد جدید را ارسال کنید.'
            );
            return rest_ensure_response( [ 'ok' => true, 'bound' => false ] );
        }

        if ( strpos( $text, '/start' ) === 0 ) {
            $reply = "سلام! برای اتصال امن حساب کاربری iRamoAi خود، روی سایت دکمه «دریافت کد اتصال ربات» را بزنید و کد یکبارمصرف نمایش‌داده‌شده را به همین ربات بفرستید.";
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
