import React from 'react';
import styles from '@/style/kds.module.css';
import { Award, Utensils, FileText } from '@/lib/icons';

export default function KitchenDisplayPage() {
  return (
    <main className={styles.container}>
      {/* Controls Row */}
      <div className={styles.controlsRow}>
        <div className={styles.stationsWrapper}>
          <button className={styles.stationBtnActive}>
            ALL STATIONS
          </button>
          <button className={styles.stationBtn}>
            GRILL
          </button>
          <button className={styles.stationBtn}>
            COLD
          </button>
        </div>
        <div className={styles.quickActions}>
          <button className={styles.quickActionBtn}>
            <Award size={15} />
            Create Reward
          </button>
          <button className={styles.quickActionBtn}>
            <Utensils size={15} />
            New Service
          </button>
          <button className={styles.quickActionBtnPrimary}>
            <FileText size={15} />
            Shift Report
          </button>
        </div>
        <div className={styles.timeDisplay}>
          19:42:05
        </div>
      </div>
      {/* Ticket Grid */}
      <div className={styles.ticketGridContainer}>
        <div className={styles.ticketGridRow}>
          {/* Ticket 1: Urgent (18 min) */}
          <article className={styles.ticketCardUrgent}>
            <header className={styles.ticketHeader}>
              <div className={styles.ticketHeaderGroup}>
                <span className={styles.ticketNum}>
                  #1042
                </span>
                <span className={styles.tableBadgeUrgent}>
                  T-4
                </span>
              </div>
              <span className={styles.ticketDurationUrgent}>
                18:45
              </span>
            </header>
            <div className={styles.ticketBody}>
              <div className={styles.itemRow}>
                <span className={styles.itemQty}>
                  2x
                </span>
                <div className={styles.itemDetails}>
                  <p className={styles.itemName}>
                    Bone-in Ribeye
                  </p>
                  <p className={styles.itemNotes}>
                    Medium Rare, No compound butter
                  </p>
                  <span className={styles.stationTag}>
                    GRILL
                  </span>
                </div>
              </div>
              <div className={styles.itemDivider} />
              <div className={styles.itemRow}>
                <span className={styles.itemQty}>
                  1x
                </span>
                <div className={styles.itemDetails}>
                  <p className={styles.itemName}>
                    Charred Asparagus
                  </p>
                  <span className={styles.stationTag}>
                    GRILL
                  </span>
                </div>
              </div>
              <div className={styles.itemDivider} />
              <div className={styles.itemRow}>
                <span className={styles.itemQty}>
                  1x
                </span>
                <div className={styles.itemDetails}>
                  <p className={styles.itemName}>
                    Pommes Purée
                  </p>
                  <span className={styles.stationTag}>
                    HOT
                  </span>
                </div>
              </div>
            </div>
            <footer className={styles.ticketFooter}>
              <button className={styles.bumpBtn}>
                Bump Ticket
              </button>
            </footer>
            {/* Timer Bar */}
            <div className={styles.indicatorBarUrgent} />
          </article>

          {/* Ticket 2: Warning (12 min) */}
          <article className={styles.ticketCard}>
            <header className={styles.ticketHeader}>
              <div className={styles.ticketHeaderGroup}>
                <span className={styles.ticketNum}>
                  #1045
                </span>
                <span className={styles.tableBadge}>
                  T-12
                </span>
              </div>
              <span className={styles.ticketDurationWarning}>
                12:10
              </span>
            </header>
            <div className={styles.ticketBody}>
              <div className={styles.itemRow}>
                <span className={styles.itemQty}>
                  1x
                </span>
                <div className={styles.itemDetails}>
                  <p className={styles.itemName}>
                    Diver Scallops
                  </p>
                  <p className={styles.itemNotes}>
                    Allergy: Dairy (Use oil prep)
                  </p>
                  <span className={styles.stationTag}>
                    HOT
                  </span>
                </div>
              </div>
              <div className={styles.itemDivider} />
              <div className={styles.itemRow}>
                <span className={styles.itemQty}>
                  2x
                </span>
                <div className={styles.itemDetails}>
                  <p className={styles.itemName}>
                    Heirloom Tomato Salad
                  </p>
                  <span className={styles.stationTag}>
                    COLD
                  </span>
                </div>
              </div>
            </div>
            <footer className={styles.ticketFooter}>
              <button className={styles.startBtn}>
                Start
              </button>
            </footer>
            {/* Timer Bar */}
            <div className={styles.indicatorBarWarning} />
          </article>

          {/* Ticket 3: New (4 min) */}
          <article className={styles.ticketCard}>
            <header className={styles.ticketHeader}>
              <div className={styles.ticketHeaderGroup}>
                <span className={styles.ticketNum}>
                  #1048
                </span>
                <span className={styles.tableBadge}>
                  Bar
                </span>
              </div>
              <span className={styles.ticketDurationNew}>
                04:30
              </span>
            </header>
            <div className={styles.ticketBody}>
              <div className={styles.itemRow}>
                <span className={styles.itemQty}>
                  1x
                </span>
                <div className={styles.itemDetails}>
                  <p className={styles.itemName}>
                    Truffle Fries
                  </p>
                  <span className={styles.stationTag}>
                    FRYER
                  </span>
                </div>
              </div>
              <div className={styles.itemDivider} />
              <div className={styles.itemRow}>
                <span className={styles.itemQty}>
                  1x
                </span>
                <div className={styles.itemDetails}>
                  <p className={styles.itemName}>
                    Wagyu Sliders
                  </p>
                  <p className={styles.itemNotes}>
                    Medium, no pickles
                  </p>
                  <span className={styles.stationTag}>
                    GRILL
                  </span>
                </div>
              </div>
            </div>
            <footer className={styles.ticketFooter}>
              <button className={styles.startBtn}>
                Start
              </button>
            </footer>
            {/* Timer Bar */}
            <div className={styles.indicatorBarNew} />
          </article>
        </div>
      </div>
      {/* Bottom Status Bar */}
      <footer className={styles.statusBar}>
        <div className={styles.statusBarStats}>
          <div className={styles.statusBarGroup}>
            <span className={styles.statusBarLabel}>
              OPEN TICKETS:
            </span>
            <span className={styles.statusBarValue}>
              9
            </span>
          </div>
          <div className={styles.statusBarDivider} />
          <div className={styles.statusBarGroup}>
            <span className={styles.statusBarLabel}>
              AVG TIME:
            </span>
            <span className={styles.statusBarValue}>
              14 min
            </span>
          </div>
          <div className={styles.statusBarDivider} />
          <div className={styles.statusBarGroup}>
            <span className={styles.statusBarLabel}>
              LONGEST WAITING:
            </span>
            <span className={styles.statusBarValue} style={{ color: '#e8a55a' }}>
              22 min
            </span>
          </div>
          <div className={styles.statusBarDivider} />
          <div className={styles.statusBarGroup}>
            <span className={styles.statusBarLabel}>
              COMPLETED TODAY:
            </span>
            <span className={styles.statusBarValue}>
              38
            </span>
          </div>
        </div>
      </footer>
    </main>
  );
}
