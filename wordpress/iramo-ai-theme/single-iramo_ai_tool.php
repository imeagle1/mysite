<?php
/**
 * Single AI Tool Template (SSR SEO, Breadcrumbs, Specs Bar, Steps, Copyable Prompt, Interactive Voting)
 */
if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

get_header();

if ( function_exists( 'elementor_theme_do_location' ) && elementor_theme_do_location( 'single' ) ) :
    get_footer();
    return;
endif;

while ( have_posts() ) :
    the_post();
    if ( function_exists( 'iramo_render_elementor_template' ) && iramo_render_elementor_template( 'iramo-tpl-single-tool', '<main id="primary" class="iramo-main-wrap">', '</main>' ) ) :
        break;
    endif;
    $pid            = get_the_ID();
    $title          = get_the_title();
    $provider       = trim( (string) get_post_meta( $pid, '_iramo_provider', true ) );
    $tagline        = get_post_meta( $pid, '_iramo_tagline', true ) ?: get_the_excerpt();
    $task           = trim( (string) get_post_meta( $pid, '_iramo_task', true ) );
    $input          = get_post_meta( $pid, '_iramo_input', true ) ?: '—';
    $output         = get_post_meta( $pid, '_iramo_output', true ) ?: '—';
    $pricing        = get_post_meta( $pid, '_iramo_pricing', true ) ?: 'Freemium';
    $start_price    = get_post_meta( $pid, '_iramo_starting_price', true ) ?: $pricing;
    $tool_url       = trim( (string) get_post_meta( $pid, '_iramo_url', true ) );
    $has_api        = get_post_meta( $pid, '_iramo_has_api', true ) === '1';
    $has_mobile     = get_post_meta( $pid, '_iramo_has_mobile', true ) === '1';
    $popularity_raw = trim( (string) get_post_meta( $pid, '_iramo_popularity', true ) );
    $popularity     = $popularity_raw !== '' ? (int) $popularity_raw : 0;
    $likes_raw      = get_post_meta( $pid, '_iramo_likes', true );
    $dislikes_raw   = get_post_meta( $pid, '_iramo_dislikes', true );
    $has_votes      = ( $likes_raw !== '' || $dislikes_raw !== '' );
    $likes          = $likes_raw !== '' ? (int) $likes_raw : 0;
    $dislikes       = $dislikes_raw !== '' ? (int) $dislikes_raw : 0;
    $features       = array_values( array_filter( array_map( 'trim', explode( "\n", (string) get_post_meta( $pid, '_iramo_features', true ) ) ) ) );
    $steps          = array_values( array_filter( array_map( 'trim', explode( "\n", (string) get_post_meta( $pid, '_iramo_steps', true ) ) ) ) );
    $audience       = array_values( array_filter( array_map( 'trim', explode( "\n", (string) get_post_meta( $pid, '_iramo_audience', true ) ) ) ) );
    $prompt_ex      = get_post_meta( $pid, '_iramo_sample_prompt', true );
    $pricing_info   = get_post_meta( $pid, '_iramo_pricing_details', true );
    $tools_url      = get_post_type_archive_link( 'iramo_ai_tool' ) ?: iramo_get_page_url( 'ai-tools', '/ai-tools/' );
    ?>
    <main id="primary" class="iramo-main-wrap">
        <div class="iramo-container">
            <!-- Breadcrumbs -->
            <nav aria-label="مسیر صفحه" style="display:flex;flex-wrap:wrap;gap:8px;font-size:12.5px;color:var(--iramo-muted);margin-bottom:16px;">
                <a href="<?php echo esc_url( home_url( '/' ) ); ?>">خانه</a>
                <span>/</span>
                <a href="<?php echo esc_url( $tools_url ); ?>">ابزارهای هوش مصنوعی</a>
                <span>/</span>
                <strong style="color:var(--iramo-ink);"><?php echo esc_html( $title ); ?></strong>
            </nav>

            <!-- Hero Tool Header -->
            <section class="iramo-card" style="padding:24px;margin-bottom:24px;">
                <div style="display:flex;flex-wrap:wrap;align-items:flex-start;justify-content:space-between;gap:18px;">
                    <div style="flex:1;min-width:260px;">
                        <div style="display:flex;flex-wrap:wrap;align-items:center;gap:8px;margin-bottom:10px;">
                            <?php if ( $task !== '' ) : ?>
                                <span class="iramo-badge"><?php echo esc_html( $task ); ?></span>
                            <?php endif; ?>
                            <?php if ( $provider !== '' ) : ?>
                                <span class="iramo-meta-pill">ارائه‌دهنده: <?php echo esc_html( $provider ); ?></span>
                            <?php endif; ?>
                            <?php if ( $popularity_raw !== '' && $popularity > 0 ) : ?>
                                <span class="iramo-meta-pill">امتیاز محبوبیت: ★ <?php echo esc_html( iramo_fa_digits( $popularity ) ); ?></span>
                            <?php endif; ?>
                        </div>
                        <h1 style="margin:0 0 8px;font-size:26px;font-weight:900;"><?php echo esc_html( $title ); ?></h1>
                        <p style="margin:0;font-size:15px;color:var(--iramo-muted);line-height:1.8;"><?php echo esc_html( $tagline ); ?></p>
                    </div>

                    <?php if ( ( $tool_url !== '' && $tool_url !== '#' ) || $has_votes ) : ?>
                        <div style="display:flex;flex-direction:column;gap:10px;min-width:220px;">
                            <?php if ( $tool_url !== '' && $tool_url !== '#' ) : ?>
                                <a href="<?php echo esc_url( $tool_url ); ?>" target="_blank" rel="noopener noreferrer" class="iramo-btn iramo-btn-accent">
                                    ورود به سایت ابزار (Try Now) ↗
                                </a>
                            <?php endif; ?>
                            <?php if ( $has_votes ) : ?>
                                <div style="display:flex;gap:8px;">
                                    <button type="button" class="iramo-btn iramo-btn-outline" style="flex:1;padding:8px 12px;font-size:12.5px;" data-iramo-tool-vote="like" data-tool-id="<?php echo esc_attr( $pid ); ?>">
                                        👍 مفید بود (<span data-vote-count><?php echo esc_html( $likes ); ?></span>)
                                    </button>
                                    <button type="button" class="iramo-btn iramo-btn-outline" style="flex:1;padding:8px 12px;font-size:12.5px;" data-iramo-tool-vote="dislike" data-tool-id="<?php echo esc_attr( $pid ); ?>">
                                        👎 (<span data-vote-count><?php echo esc_html( $dislikes ); ?></span>)
                                    </button>
                                </div>
                            <?php endif; ?>
                        </div>
                    <?php endif; ?>
                </div>

                <!-- Specs Bar -->
                <div class="iramo-grid-4" style="margin-top:20px;padding-top:18px;border-top:1px solid var(--iramo-border-subtle);">
                    <div style="padding:12px;border-radius:14px;background:var(--iramo-canvas);">
                        <div style="font-size:11.5px;color:var(--iramo-subtle);">ورودی (Accepts)</div>
                        <strong style="font-size:14px;"><?php echo esc_html( $input ); ?></strong>
                    </div>
                    <div style="padding:12px;border-radius:14px;background:var(--iramo-canvas);">
                        <div style="font-size:11.5px;color:var(--iramo-subtle);">خروجی (Produces)</div>
                        <strong style="font-size:14px;"><?php echo esc_html( $output ); ?></strong>
                    </div>
                    <div style="padding:12px;border-radius:14px;background:var(--iramo-canvas);">
                        <div style="font-size:11.5px;color:var(--iramo-subtle);">مدل قیمت (Pricing)</div>
                        <strong style="font-size:14px;"><?php echo esc_html( $start_price ); ?></strong>
                    </div>
                    <div style="padding:12px;border-radius:14px;background:var(--iramo-canvas);">
                        <div style="font-size:11.5px;color:var(--iramo-subtle);">دسترسی فنی و موبایل</div>
                        <strong style="font-size:14px;">
                            <?php echo $has_api ? 'API رسمی ✓' : 'بدون API'; ?> · <?php echo $has_mobile ? 'اپ موبایل ✓' : 'نسخه وب'; ?>
                        </strong>
                    </div>
                </div>
            </section>

            <!-- Content + Sidebar -->
            <div class="iramo-detail-grid">
                <div style="display:grid;gap:20px;">
                    <section class="iramo-card" style="padding:24px;">
                        <h2 style="margin:0 0 12px;font-size:19px;font-weight:800;">معرفی و بررسی کامل <?php echo esc_html( $title ); ?></h2>
                        <div style="font-size:14.5px;line-height:1.95;color:var(--iramo-muted);">
                            <?php the_content(); ?>
                        </div>
                        <?php if ( $pricing_info ) : ?>
                            <div style="margin-top:16px;padding:14px;border-radius:14px;background:var(--iramo-primary-soft);border:1px solid var(--iramo-border);font-size:13.5px;">
                                <strong>جزئیات تعرفه و نسخه رایگان:</strong> <?php echo esc_html( $pricing_info ); ?>
                            </div>
                        <?php endif; ?>
                    </section>

                    <?php if ( ! empty( $features ) ) : ?>
                        <section class="iramo-card" style="padding:24px;">
                            <h2 style="margin:0 0 14px;font-size:19px;font-weight:800;">ویژگی‌ها و قابلیت‌های کلیدی</h2>
                            <div class="iramo-grid-2">
                                <?php foreach ( $features as $feat ) : ?>
                                    <div style="padding:12px 14px;border-radius:14px;background:var(--iramo-canvas);border:1px solid var(--iramo-border-subtle);display:flex;align-items:flex-start;gap:8px;font-size:13.5px;">
                                        <span style="color:var(--iramo-primary);font-weight:900;">✓</span>
                                        <span><?php echo esc_html( $feat ); ?></span>
                                    </div>
                                <?php endforeach; ?>
                            </div>
                        </section>
                    <?php endif; ?>

                    <?php if ( ! empty( $steps ) ) : ?>
                        <section class="iramo-card" style="padding:24px;">
                            <h2 style="margin:0 0 14px;font-size:19px;font-weight:800;">مراحل شروع کار با <?php echo esc_html( $title ); ?></h2>
                            <div style="display:grid;gap:10px;">
                                <?php foreach ( $steps as $idx => $st ) : ?>
                                    <div style="display:flex;align-items:flex-start;gap:12px;padding:12px 14px;border-radius:14px;background:var(--iramo-canvas);">
                                        <span class="iramo-badge" style="flex-shrink:0;"><?php echo esc_html( iramo_fa_digits( $idx + 1 ) ); ?></span>
                                        <span style="font-size:13.5px;"><?php echo esc_html( $st ); ?></span>
                                    </div>
                                <?php endforeach; ?>
                            </div>
                        </section>
                    <?php endif; ?>

                    <?php if ( $prompt_ex ) : ?>
                        <section class="iramo-card" style="padding:24px;">
                            <div style="display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:12px;">
                                <h2 style="margin:0;font-size:18px;font-weight:800;">نمونه پرامپت آماده برای شروع</h2>
                                <button type="button" class="iramo-btn iramo-btn-accent" style="padding:6px 14px;font-size:12px;" data-iramo-copy-prompt="<?php echo esc_attr( $prompt_ex ); ?>">کپی پرامپت</button>
                            </div>
                            <div class="iramo-prompt-box"><?php echo esc_html( $prompt_ex ); ?></div>
                        </section>
                    <?php endif; ?>

                    <?php if ( ! empty( $audience ) ) : ?>
                        <section class="iramo-card" style="padding:24px;">
                            <h2 style="margin:0 0 12px;font-size:18px;font-weight:800;">این ابزار برای چه کسانی مناسب است؟</h2>
                            <div class="iramo-chips">
                                <?php foreach ( $audience as $aud ) : ?>
                                    <span class="iramo-chip is-active"><?php echo esc_html( $aud ); ?></span>
                                <?php endforeach; ?>
                            </div>
                        </section>
                    <?php endif; ?>
                </div>

                <!-- Sidebar -->
                <aside style="display:grid;gap:16px;">
                    <div class="iramo-card" style="padding:20px;">
                        <h3 style="margin:0 0 12px;font-size:16px;font-weight:800;">ابزارهای مرتبط در دسته <?php echo esc_html( $task ); ?></h3>
                        <?php
                        $related = get_posts( [
                            'post_type'      => 'iramo_ai_tool',
                            'post_status'    => 'publish',
                            'posts_per_page' => 5,
                            'post__not_in'   => [ $pid ],
                            'meta_key'       => '_iramo_task',
                            'meta_value'     => $task,
                        ] );
                        if ( empty( $related ) ) {
                            $related = get_posts( [
                                'post_type'      => 'iramo_ai_tool',
                                'post_status'    => 'publish',
                                'posts_per_page' => 5,
                                'post__not_in'   => [ $pid ],
                            ] );
                        }
                        ?>
                        <div style="display:grid;gap:10px;">
                            <?php foreach ( $related as $rel ) :
                                $rel_provider = trim( (string) get_post_meta( $rel->ID, '_iramo_provider', true ) );
                                $rel_pricing  = trim( (string) get_post_meta( $rel->ID, '_iramo_pricing', true ) );
                                $rel_meta     = implode( ' · ', array_filter( [ $rel_provider, $rel_pricing ] ) );
                            ?>
                                <a href="<?php echo esc_url( get_permalink( $rel->ID ) ); ?>" style="display:block;padding:10px 12px;border-radius:12px;background:var(--iramo-canvas);border:1px solid var(--iramo-border-subtle);">
                                    <div style="font-weight:800;font-size:14px;"><?php echo esc_html( get_the_title( $rel->ID ) ); ?></div>
                                    <?php if ( $rel_meta !== '' ) : ?>
                                        <div style="font-size:11.5px;color:var(--iramo-muted);margin-top:2px;"><?php echo esc_html( $rel_meta ); ?></div>
                                    <?php endif; ?>
                                </a>
                            <?php endforeach; ?>
                        </div>
                        <a href="<?php echo esc_url( $tools_url ); ?>" class="iramo-btn iramo-btn-outline" style="width:100%;margin-top:14px;font-size:13px;">بازگشت به همه ابزارها</a>
                    </div>
                </aside>
            </div>
        </div>
    </main>
    <?php
endwhile;

get_footer();
