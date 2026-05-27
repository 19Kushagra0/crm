"use client";

import React from 'react';
import styles from '@/style/tables.module.css';
import { Plus } from '@/lib/icons';
import TablesService from '@/services/TablesService';
import UIService from '@/services/UIService';

export default function TablesPage() {
  const tables = TablesService.useTables();

  const handleTableClick = (table) => {
    const statuses = ["available", "occupied", "reserved", "cleaning"];
    const currentIndex = statuses.indexOf(table.status);
    const nextStatus = statuses[(currentIndex + 1) % statuses.length];
    
    let reservedAt = undefined;
    if (nextStatus === "reserved") {
      reservedAt = table.reservedAt || (table.id === "T-4" ? "19:30" : "20:00");
    }
    
    TablesService.setTableStatus(table.id, nextStatus, reservedAt);
  };

  const renderTable = (t) => {
    const isWindow = t.zone === 'WINDOW';
    const isCenter = t.zone === 'CENTER';
    const isBar = t.zone === 'BAR';
    const isPrivate = t.zone === 'PRIVATE';

    if (isWindow) {
      if (t.status === 'available') {
        return (
          <div key={t.id} className={styles.tableCardRectAvailable} onClick={() => handleTableClick(t)}>
            <span className={styles.tableName}>{t.id}</span>
            <span className={styles.tableCapacity}>{t.seats}p</span>
          </div>
        );
      } else if (t.status === 'occupied') {
        return (
          <div key={t.id} className={styles.tableCardRectOccupied} onClick={() => handleTableClick(t)}>
            <span className={styles.tableName}>{t.id}</span>
            <div className={styles.capacityBadge}>{t.seats}p</div>
          </div>
        );
      } else if (t.status === 'reserved') {
        return (
          <div key={t.id} className={styles.tableCardRectReserved} onClick={() => handleTableClick(t)}>
            <span className={styles.tableName}>{t.id}</span>
            <span className={styles.tableTime}>{t.reservedAt || '19:30'}</span>
          </div>
        );
      } else { // cleaning
        return (
          <div key={t.id} className={styles.tableCardRectAvailable} style={{ opacity: 0.6 }} onClick={() => handleTableClick(t)}>
            <span className={styles.tableName}>{t.id}</span>
            <span className={styles.tableCapacity} style={{ fontStyle: 'italic' }}>Clean</span>
          </div>
        );
      }
    }

    if (isCenter) {
      if (t.status === 'available') {
        return (
          <div key={t.id} className={styles.tableCardRoundAvailable} onClick={() => handleTableClick(t)}>
            <span className={styles.tableName}>{t.id}</span>
            <span className={styles.tableCapacity}>{t.seats}p</span>
          </div>
        );
      } else if (t.status === 'occupied') {
        return (
          <div key={t.id} className={styles.tableCardRoundOccupied} onClick={() => handleTableClick(t)}>
            <span className={styles.tableName}>{t.id}</span>
            <div className={styles.capacityBadge}>{t.seats}p</div>
          </div>
        );
      } else if (t.status === 'reserved') {
        return (
          <div key={t.id} className={styles.tableCardRoundReserved} onClick={() => handleTableClick(t)}>
            <span className={styles.tableName}>{t.id}</span>
            <span className={styles.tableTime}>{t.reservedAt || '20:00'}</span>
          </div>
        );
      } else { // cleaning
        return (
          <div key={t.id} className={styles.tableCardRoundAvailable} style={{ opacity: 0.6 }} onClick={() => handleTableClick(t)}>
            <span className={styles.tableName}>{t.id}</span>
            <span className={styles.tableCapacity} style={{ fontStyle: 'italic' }}>Clean</span>
          </div>
        );
      }
    }

    if (isBar) {
      const label = t.id.replace('T-', 'B').replace('B-', 'B');
      if (t.status === 'occupied') {
        return (
          <div key={t.id} className={styles.barStoolOccupied} onClick={() => handleTableClick(t)}>
            {label}
          </div>
        );
      } else {
        return (
          <div key={t.id} className={styles.barStoolCleaning} onClick={() => handleTableClick(t)}>
            {label}
          </div>
        );
      }
    }

    if (isPrivate) {
      if (t.status === 'available') {
        return (
          <div key={t.id} className={styles.privateTableAvailable} onClick={() => handleTableClick(t)}>
            <span className={styles.tableName}>{t.id}</span>
            <span className={styles.tableCapacity}>{t.seats}p</span>
          </div>
        );
      } else if (t.status === 'occupied') {
        return (
          <div key={t.id} className={styles.privateTableOccupied} onClick={() => handleTableClick(t)}>
            <span className={styles.tableName}>{t.id}</span>
            <div className={styles.capacityBadge}>{t.seats}p</div>
          </div>
        );
      } else { // cleaning or reserved fallback
        return (
          <div key={t.id} className={styles.privateTableCleaning} onClick={() => handleTableClick(t)}>
            <span className={styles.tableName}>{t.id}</span>
            <span className={styles.privateStatus}>Cleaning</span>
          </div>
        );
      }
    }

    return null;
  };

  const windowTables = tables.filter(t => t.zone === 'WINDOW');
  const centerTables = tables.filter(t => t.zone === 'CENTER');
  const barTables = tables.filter(t => t.zone === 'BAR');
  const privateTables = tables.filter(t => t.zone === 'PRIVATE');

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
            <button 
              className={styles.newReservationBtn}
              onClick={() => UIService.openModal('RESERVATION')}
            >
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
                  {windowTables.map(renderTable)}
                </div>

                {/* Center Grid */}
                <div className={styles.centerGrid}>
                  {centerTables.map(renderTable)}
                </div>

                {/* Private Row Back & Bar */}
                <div className={styles.privateRow}>
                  {/* Bar Area Top Right */}
                  <div className={styles.barArea}>
                    <div className={styles.zoneLabel}>
                      BAR
                    </div>
                    <div className={styles.barStoolsRow}>
                      {barTables.map(renderTable)}
                    </div>
                  </div>

                  <div className={styles.privateSectionWrapper}>
                    <div className={styles.zoneLabel}>
                      PRIVATE
                    </div>
                    {privateTables.map(renderTable)}
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

