<?php
/**
 * AI Tools Archive (SSR SEO + Live Instant Filtering + Elementor Pro Override)
 */
if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

get_header();

if ( function_exists( 'elementor_theme_do_location' ) && elementor_theme_do_location( 'archive' ) ) :
    get_footer();
    return;
endif;

$q_filter       = sanitize_text_field( $_GET['q'] ?? '' );
$task_filter    = sanitize_text_field( $_GET['task'] ?? '' );
$pricing_filter = sanitize_text_field( $_GET['pricing'] ?? '' );

$all_tools = get_posts( [
    'post_type'      => 'iramo_ai_tool',
    'post_status'    => 'publish',
    'posts_per_page' => 150,
    'orderby'        => 'date',
    'order'          => 'DESC',
] );

$task_counts    = [];
$pricing_counts = [];
foreach ( $all_tools as $t ) {
    $tk = get_post_meta( $t->ID, '_iramo_task', true ) ?: 'AI Assistant';
    $pr = get_post_meta( $t->ID, '_iramo_pricing', true ) ?: 'Freemium';
    $task_counts[ $tk ]    = ( $task_counts[ $tk ] ?? 0 ) + 1;
    $pricing_counts[ $pr ] = ( $pricing_counts[ $pr ] ?? 0 ) + 1;
}
$total_tools = count( $all_tools );
?>
<main id="primary" class="iramo-main-wrap">
    <div class="iramo-container" data-iramo-tools-filter-root>
        <!-- Header & Search Strip -->
        <div class="iramo-card" style="padding:24px;margin-bottom:24px;">
            <div style="display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:12px;margin-bottom:14px;">
                <div>
                    <span class="iramo-badge">دایرکتوری تاییدشده هوش مصنوعی</span>
                    <h1 style="margin:8px 0 4px;font-size:24px;font-weight:900;">مجموعه تخصصی ابزارهای هوش مصنوعی</h1>
                    <p style="margin:0;font-size:13.5px;color:var(--iramo-muted);">
                        بررسی تخصصی، مشخصات ورودی و خروجی، دسترسی API و نمونه پرامپت‌های کاربردی هر ابزار (نمایش <strong data-filter-count><?php echo esc_html( iramo_fa_digits( $total_tools ) ); ?></strong> ابزار)
                    </p>
                </div>
            </div>

            <!-- Filter Bar -->
            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));gap:10px;margin-bottom:14px;">
                <input type="search" data-filter-search class="iramo-input" value="<?php echo esc_attr( $q_filter ); ?>" placeholder="جستجوی نام ابزار یا کاربرد..." />
                <select data-filter-task class="iramo-input">
                    <option value="">همه دسته‌بندی‌ها (Task)</option>
                    <?php foreach ( array_keys( $task_counts ) as $tk ) : ?>
                        <option value="<?php echo esc_attr( $tk ); ?>" <?php selected( $task_filter, $tk ); ?>><?php echo esc_html( $tk ); ?></option>
                    <?php endforeach; ?>
                </select>
                <select data-filter-pricing class="iramo-input">
                    <option value="">همه مدل‌های قیمت</option>
                    <?php foreach ( [ 'Free', 'Freemium', 'Free Trial', 'Paid' ] as $pr ) : ?>
                        <option value="<?php echo esc_attr( $pr ); ?>" <?php selected( $pricing_filter, $pr ); ?>><?php echo esc_html( $pr ); ?></option>
                    <?php endforeach; ?>
                </select>
                <select data-filter-input class="iramo-input">
                    <option value="">همه ورودی‌ها (Input)</option>
                    <?php foreach ( [ 'Text', 'Prompt', 'Image', 'Audio', 'Video', 'Spreadsheet', 'Document' ] as $in_opt ) : ?>
                        <option value="<?php echo esc_attr( $in_opt ); ?>"><?php echo esc_html( $in_opt ); ?></option>
                    <?php endforeach; ?>
                </select>
                <select data-filter-output class="iramo-input">
                    <option value="">همه خروجی‌ها (Output)</option>
                    <?php foreach ( [ 'Text', 'Image', 'Video', '3D Model', 'Audio', 'Code', 'Dashboard', 'Workflow', 'Presentation' ] as $out_opt ) : ?>
                        <option value="<?php echo esc_attr( $out_opt ); ?>"><?php echo esc_html( $out_opt ); ?></option>
                    <?php endforeach; ?>
                </select>
            </div>

            <!-- Quick Task Chips -->
            <div class="iramo-chips">
                <button type="button" class="iramo-chip <?php echo $task_filter === '' ? 'is-active' : ''; ?>" data-quick-task="">همه</button>
                <?php foreach ( $task_counts as $tk => $cnt ) : ?>
                    <button type="button" class="iramo-chip <?php echo $task_filter === $tk ? 'is-active' : ''; ?>" data-quick-task="<?php echo esc_attr( $tk ); ?>">
                        <?php echo esc_html( $tk ); ?> (<?php echo esc_html( iramo_fa_digits( $cnt ) ); ?>)
                    </button>
                <?php endforeach; ?>
            </div>
        </div>

        <!-- Main Layout: Grid + Right Analytics Sidebar -->
        <div class="iramo-tools-layout">
            <div>
                <div class="iramo-grid-3">
                    <?php
                    foreach ( $all_tools as $tool_post ) :
                        iramo_render_tool_card( $tool_post->ID );
                    endforeach;
                    ?>
                </div>
                <div data-filter-empty class="iramo-card iramo-hidden" style="padding:36px;text-align:center;">
                    <h3 style="margin:0 0 8px;">ابزاری با این فیلتر یافت نشد</h3>
                    <p style="margin:0;color:var(--iramo-muted);font-size:13.5px;">لطفاً عبارت جستجو را تغییر دهید یا فیلترها را به حالت «همه» برگردانید.</p>
                </div>
            </div>

            <!-- Slim Analytics Sidebar -->
            <aside style="display:grid;gap:16px;">
                <div class="iramo-card" style="padding:18px;">
                    <h3 style="margin:0 0 10px;font-size:15px;font-weight:800;">نمای کلی دایرکتوری</h3>
                    <div style="display:grid;gap:8px;font-size:13px;">
                        <div style="display:flex;justify-content:space-between;">
                            <span style="color:var(--iramo-muted);">کل ابزارهای ثبت‌شده</span>
                            <strong><?php echo esc_html( iramo_fa_digits( $total_tools ) ); ?> ابزار</strong>
                        </div>
                        <?php foreach ( $pricing_counts as $pr_name => $cnt ) : ?>
                            <div style="display:flex;justify-content:space-between;">
                                <span style="color:var(--iramo-muted);"><?php echo esc_html( $pr_name ); ?></span>
                                <strong><?php echo esc_html( iramo_fa_digits( $cnt ) ); ?></strong>
                            </div>
                        <?php endforeach; ?>
                    </div>
                </div>

                <div class="iramo-card" style="padding:18px;">
                    <h3 style="margin:0 0 10px;font-size:15px;font-weight:800;">پربازدیدترین ابزارها</h3>
                    <div style="display:grid;gap:10px;">
                        <?php foreach ( array_slice( $all_tools, 0, 5 ) as $pop_tool ) : ?>
                            <a href="<?php echo esc_url( get_permalink( $pop_tool->ID ) ); ?>" style="display:flex;align-items:center;justify-content:space-between;gap:8px;font-size:13px;padding:6px 0;border-bottom:1px solid var(--iramo-border-subtle);">
                                <span style="font-weight:700;"><?php echo esc_html( get_the_title( $pop_tool->ID ) ); ?></span>
                                <span style="font-size:11.5px;color:var(--iramo-primary);"><?php echo esc_html( get_post_meta( $pop_tool->ID, '_iramo_pricing', true ) ?: 'Freemium' ); ?></span>
                            </a>
                        <?php endforeach; ?>
                    </div>
                </div>
            </aside>
        </div>
    </div>
</main>
<?php
get_footer();
