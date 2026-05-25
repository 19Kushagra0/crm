import React from 'react';
import styles from '@/style/tables.module.css';
import { Plus } from '@/lib/icons';

export default function TablesPage() {
  return (
    <main className={styles.container}>
      {/* Floor Plan Area */}
      <section className={styles.contentSection}>
        <div className={styles.cardWrapper}>
          {/* Controls Row */}
          <div className={styles.controlsRow}>
            <div className={styles.btnGroup}>
              <button className={styles.viewBtnActive}>
                Floor Map
              </button>
              <button className={styles.viewBtn}>
                List View
              </button>
              <button className={styles.viewBtn}>
                Timeline
              </button>
            </div>
            <button className={styles.newReservationBtn}>
              <Plus size={16} />
              New Reservation
            </button>
          </div>

          {/* Swipeable Scroll Container on Mobile */}
          <div className={styles.floorMapScrollWrapper}>
            <div className={styles.floorMapCard}>
              <div className={styles.mapCanvas}>
                {/* Window Row Left */}
                <div className={styles.windowRow}>
                  <div className={styles.zoneLabel}>
                    WINDOW
                  </div>
                  {/* T-1 Available */}
                  <div className={styles.tableCardRectAvailable}>
                    <span className={styles.tableName}>T-1</span>
                    <span className={styles.tableCapacity}>2p</span>
                  </div>
                  {/* T-2 Occupied */}
                  <div className={styles.tableCardRectOccupied}>
                    <span className={styles.tableName}>T-2</span>
                    <div className={styles.capacityBadge}>
                      2p
                    </div>
                  </div>
                  {/* T-3 Occupied */}
                  <div className={styles.tableCardRectOccupied}>
                    <span className={styles.tableName}>T-3</span>
                    <div className={styles.capacityBadge}>
                      4p
                    </div>
                  </div>
                  {/* T-4 Reserved */}
                  <div className={styles.tableCardRectReserved}>
                    <span className={styles.tableName}>T-4</span>
                    <span className={styles.tableTime}>
                      19:30
                    </span>
                  </div>
                </div>

                {/* Center Grid */}
                <div className={styles.centerGrid}>
                  {/* T-5 Available */}
                  <div className={styles.tableCardRoundAvailable}>
                    <span className={styles.tableName}>T-5</span>
                    <span className={styles.tableCapacity}>4p</span>
                  </div>
                  {/* T-6 Occupied */}
                  <div className={styles.tableCardRoundOccupied}>
                    <span className={styles.tableName}>T-6</span>
                    <div className={styles.capacityBadge}>
                      4p
                    </div>
                  </div>
                  {/* T-7 Reserved */}
                  <div className={styles.tableCardRoundReserved}>
                    <span className={styles.tableName}>T-7</span>
                    <span className={styles.tableTime}>
                      20:00
                    </span>
                  </div>
                  {/* T-8 Occupied */}
                  <div className={styles.tableCardRoundOccupied}>
                    <span className={styles.tableName}>T-8</span>
                    <div className={styles.capacityBadge}>
                      6p
                    </div>
                  </div>
                </div>

                {/* Private Row Back & Bar */}
                <div className={styles.privateRow}>
                  {/* Bar Area Top Right */}
                  <div className={styles.barArea}>
                    <div className={styles.zoneLabel}>
                      BAR
                    </div>
                    <div className={styles.barStoolsRow}>
                      {/* T-9 Occupied */}
                      <div className={styles.barStoolOccupied}>
                        B1
                      </div>
                      {/* T-10 Cleaning */}
                      <div className={styles.barStoolCleaning}>
                        B2
                      </div>
                      {/* T-11 Occupied */}
                      <div className={styles.barStoolOccupied}>
                        B3
                      </div>
                    </div>
                  </div>

                  <div className={styles.privateSectionWrapper}>
                    <div className={styles.zoneLabel}>
                      PRIVATE
                    </div>
                    {/* T-12 Available */}
                    <div className={styles.privateTableAvailable}>
                      <span className={styles.tableName}>T-12</span>
                      <span className={styles.tableCapacity}>8p</span>
                    </div>
                    {/* T-13 Cleaning */}
                    <div className={styles.privateTableCleaning}>
                      <span className={styles.tableName}>T-13</span>
                      <span className={styles.privateStatus}>
                        Cleaning
                      </span>
                    </div>
                    {/* T-14 Occupied */}
                    <div className={styles.privateTableOccupied}>
                      <span className={styles.tableName}>T-14</span>
                      <div className={styles.capacityBadge}>
                        10p
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Dark Band Bottom */}
        <div className={styles.darkBand}>
          <div className={styles.darkBandTimeline}>
            <h3 className={styles.darkBandLabel}>
              OCCUPANCY TIMELINE
            </h3>
            <div className={styles.timelineBar}>
              <div className={styles.timelineSegmentEmpty} />
              <div className={styles.timelineSegmentPrimary} />
              <div className={styles.timelineSegmentEmpty} />
              <div className={styles.timelineSegmentAmber} />
              <div className={styles.timelineSegmentEmpty} />
            </div>
            <div className={styles.timelineLabels}>
              <span>12pm</span>
              <span>3pm</span>
              <span>6pm</span>
              <span>9pm</span>
              <span>11pm</span>
            </div>
          </div>
          <div className={styles.darkBandStats}>
            <div>
              <div className={styles.statLabel}>
                AVG TURN
              </div>
              <div className={styles.statValue}>
                48
                <span className={styles.statUnit}>
                  min
                </span>
              </div>
            </div>
            <div>
              <div className={styles.statLabel}>
                NO-SHOWS
              </div>
              <div className={styles.statValue}>
                1
              </div>
            </div>
            <div>
              <div className={styles.statLabel}>
                WALK-INS
              </div>
              <div className={styles.statValue}>
                3
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
