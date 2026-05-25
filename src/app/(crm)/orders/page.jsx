import React from 'react';
import styles from '@/style/orders.module.css';
import { Clock } from '@/lib/icons';

export default function Page() {
  return (
    <>
      <meta charSet="utf-8" />
      <meta content="width=device-width, initial-scale=1.0" name="viewport" />
      <title>DineFlow - Orders</title>
      {/* Google Fonts */}
      <link href="https://fonts.googleapis.com" rel="preconnect" />
      <link crossOrigin="" href="https://fonts.gstatic.com" rel="preconnect" />
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500&family=JetBrains+Mono:wght@400;500&family=Newsreader:opsz,wght@6..72,400;6..72,500;6..72,600&display=swap"
        rel="stylesheet"
      />
      {/* Material Symbols */}
      <link
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
        rel="stylesheet"
      />
      <link
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
        rel="stylesheet"
      />
      <style
        dangerouslySetInnerHTML={{
          __html:
            "\n        body { background-color: theme('colors.canvas'); color: theme('colors.on-background'); }\n    "
        }}
      />
      {/* Main Canvas Area */}
      <main className={styles.main}>
        {/* Kanban Board */}
        <div className={styles.boardContainer}>
          {/* Filters */}
          <div className={styles.filtersContainer}>
            <button className={styles.activeFilterBtn}>
              All (14)
            </button>
            <button className={styles.filterBtn}>
              Incoming (4)
            </button>
            <button className={styles.filterBtn}>
              Preparing (6)
            </button>
            <button className={styles.filterBtn}>
              Ready (4)
            </button>
            <button className={styles.filterBtn}>
              Completed
            </button>
          </div>
          <div className={styles.kanbanBoard}>
            {/* Incoming Column */}
            <div className={styles.kanbanColumn}>
              <div className={styles.columnHeader}>
                <div className={styles.columnHeaderTitle}>
                  <span className={`${styles.columnDot} ${styles.bgAmber}`} />
                  <h3 className={styles.columnTitleText}>
                    INCOMING
                  </h3>
                </div>
                <span className={styles.columnCount}>
                  4
                </span>
              </div>
              <div className={styles.cardsList}>
                {/* Card 1 */}
                <div className={styles.orderCard}>
                  <div className={styles.cardHeader}>
                    <span className={styles.orderId}>
                      #ORD-9012
                    </span>
                    <span className={styles.tableBadge}>
                      T-12
                    </span>
                  </div>
                  <div className={styles.cardBody}>
                    <ul className={styles.itemsList}>
                      <li className={styles.itemsRow}>
                        <span>2x Wagyu Tartare</span>
                      </li>
                      <li className={styles.itemsRow}>
                        <span>1x Scallop Crudo</span>
                      </li>
                    </ul>
                  </div>
                  <div className={styles.cardFooter}>
                    <div className={styles.cardTimerRow}>
                      <Clock size={14} className={styles.timerIcon} />
                      <span className={styles.cardTimer}>
                        2m ago
                      </span>
                    </div>
                    <span className={styles.cardPrice}>
                      $64.00
                    </span>
                  </div>
                  <button className={styles.primaryActionBtn}>
                    Start Preparing
                  </button>
                </div>
                {/* Card 2 */}
                <div className={styles.orderCard}>
                  <div className={styles.cardHeader}>
                    <span className={styles.orderId}>
                      #ORD-9013
                    </span>
                    <span className={styles.tableBadge}>
                      Bar-2
                    </span>
                  </div>
                  <div className={styles.cardBody}>
                    <ul className={styles.itemsList}>
                      <li className={styles.itemsRow}>
                        <span>1x Truffle Fries</span>
                      </li>
                      <li className={styles.itemsRow}>
                        <span>2x Negroni</span>
                      </li>
                    </ul>
                  </div>
                  <div className={styles.cardFooter}>
                    <div className={styles.cardTimerRow}>
                      <Clock size={14} className={styles.timerIcon} />
                      <span className={styles.cardTimer}>
                        4m ago
                      </span>
                    </div>
                    <span className={styles.cardPrice}>
                      $48.00
                    </span>
                  </div>
                  <button className={styles.primaryActionBtn}>
                    Start Preparing
                  </button>
                </div>
              </div>
            </div>
            {/* Preparing Column */}
            <div className={styles.kanbanColumn}>
              <div className={styles.columnHeader}>
                <div className={styles.columnHeaderTitle}>
                  <span className={`${styles.columnDot} ${styles.bgTeal}`} />
                  <h3 className={styles.columnTitleText}>
                    PREPARING
                  </h3>
                </div>
                <span className={styles.columnCount}>
                  6
                </span>
              </div>
              <div className={styles.cardsList}>
                {/* Card 3 - Delayed */}
                <div className={styles.orderCard}>
                  <div className={styles.cardHeader}>
                    <span className={styles.orderId}>
                      #ORD-8998
                    </span>
                    <span className={styles.tableBadge}>
                      T-4
                    </span>
                  </div>
                  <div className={styles.cardBody}>
                    <ul className={styles.itemsList}>
                      <li className={styles.itemsRow}>
                        <span>1x Tomahawk Ribeye</span>{" "}
                        <span style={{ fontSize: '12px', color: 'var(--color-secondary, #605e5b)' }}>Med Rare</span>
                      </li>
                      <li className={styles.itemsRow}>
                        <span>2x Lobster Mac</span>
                      </li>
                      <li className={styles.itemsRow}>
                        <span>1x Grilled Asparagus</span>
                      </li>
                    </ul>
                  </div>
                  <div className={styles.cardFooter}>
                    <div className={styles.cardTimerRow}>
                      <Clock size={14} className={styles.timerIconDelayed} />
                      <span className={styles.cardTimerDelayed}>
                        18m elapsed
                      </span>
                    </div>
                    <span className={styles.cardPrice}>
                      $215.00
                    </span>
                  </div>
                  <button className={styles.secondaryActionBtn}>
                    Mark Ready
                  </button>
                </div>
                {/* Card 4 */}
                <div className={styles.orderCard}>
                  <div className={styles.cardHeader}>
                    <span className={styles.orderId}>
                      #ORD-9005
                    </span>
                    <span className={styles.tableBadge}>
                      T-8
                    </span>
                  </div>
                  <div className={styles.cardBody}>
                    <ul className={styles.itemsList}>
                      <li className={styles.itemsRow}>
                        <span>2x Duck Breast</span>
                      </li>
                      <li className={styles.itemsRow}>
                        <span>1x Pommes Purée</span>
                      </li>
                    </ul>
                  </div>
                  <div className={styles.cardFooter}>
                    <div className={styles.cardTimerRow}>
                      <Clock size={14} className={styles.timerIcon} />
                      <span className={styles.cardTimer}>
                        12m elapsed
                      </span>
                    </div>
                    <span className={styles.cardPrice}>
                      $88.00
                    </span>
                  </div>
                  <button className={styles.secondaryActionBtn}>
                    Mark Ready
                  </button>
                </div>
              </div>
            </div>
            {/* Ready Column */}
            <div className={styles.kanbanColumn}>
              <div className={styles.columnHeader}>
                <div className={styles.columnHeaderTitle}>
                  <span className={`${styles.columnDot} ${styles.bgTertiary}`} />
                  <h3 className={styles.columnTitleText}>
                    READY
                  </h3>
                </div>
                <span className={styles.columnCount}>
                  4
                </span>
              </div>
              <div className={styles.cardsList}>
                {/* Card 5 */}
                <div className={styles.orderCard}>
                  <div className={styles.cardHeader}>
                    <span className={styles.orderId}>
                      #ORD-8990
                    </span>
                    <span className={styles.tableBadge}>
                      T-1
                    </span>
                  </div>
                  <div className={styles.cardBody}>
                    <ul className={styles.itemsList}>
                      <li className={styles.itemsRow}>
                        <span>1x Châteaubriand</span>
                      </li>
                      <li className={styles.itemsRow}>
                        <span>2x Caesar Salad</span>
                      </li>
                    </ul>
                  </div>
                  <div className={styles.cardFooter}>
                    <div className={styles.cardTimerRow}>
                      <Clock size={14} className={styles.timerIcon} />
                      <span className={styles.cardTimer}>
                        Waiting: 3m
                      </span>
                    </div>
                    <span className={styles.cardPrice}>
                      $145.00
                    </span>
                  </div>
                  <button className={styles.readyActionBtn}>
                    Serve &amp; Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Dark Band Bottom Summary */}
        <div className={styles.summaryBar}>
          <div className={styles.metricsCol}>
            <h4 className={styles.summarySectionTitle}>
              TODAY'S METRICS
            </h4>
            <div className={styles.metricsGrid}>
              <div>
                <span className={styles.metricLabel}>
                  Total Orders
                </span>
                <span className={styles.metricValue}>142</span>
              </div>
              <div>
                <span className={styles.metricLabel}>
                  Avg Ticket Time
                </span>
                <span className={styles.metricValue}>22m</span>
              </div>
            </div>
          </div>
          <div className={styles.completedSection}>
            <div className={styles.completedHeader}>
              <h4 className={styles.summarySectionTitle}>
                RECENTLY COMPLETED
              </h4>
              <a className={styles.viewAllLink} href="#">
                View All
              </a>
            </div>
            <div className={styles.miniCardsList}>
              {/* Mini closed order */}
              <div className={styles.miniCard}>
                <div className={styles.miniCardHeader}>
                  <span className={styles.miniCardId}>
                    #ORD-8985
                  </span>
                  <span className={styles.miniCardTable}>
                    T-6
                  </span>
                </div>
                <div className={styles.miniCardPrice}>
                  $320.00
                </div>
              </div>
              {/* Mini closed order */}
              <div className={styles.miniCard}>
                <div className={styles.miniCardHeader}>
                  <span className={styles.miniCardId}>
                    #ORD-8984
                  </span>
                  <span className={styles.miniCardTable}>
                    Bar-1
                  </span>
                </div>
                <div className={styles.miniCardPrice}>
                  $45.00
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
