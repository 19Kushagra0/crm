"use client";

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import styles from '@/style/tables.module.css';
import canvasStyles from '@/style/floorCanvas.module.css';
import { Plus, Pencil, Lock, Unlock, Trash2 } from '@/lib/icons';
import TablesService from '@/services/TablesService';
import ReservationService from '@/services/ReservationService';
import UIService from '@/services/UIService';
import CustomerService from '@/services/CustomerService';
import Modal from '@/components/Modal';
import modalStyles from '@/style/modal.module.css';

// Dynamically import FloorCanvas with SSR disabled to prevent Konva server bundling errors
const FloorCanvas = dynamic(() => import('@/components/FloorCanvas'), { ssr: false });

const formatTimeTo12Hour = (timeStr) => {
  if (!timeStr) return '';
  if (timeStr.toLowerCase().includes('am') || timeStr.toLowerCase().includes('pm')) {
    return timeStr;
  }
  const parts = timeStr.split(':');
  if (parts.length < 2) return timeStr;
  const hour = parseInt(parts[0], 10);
  const min = parts[1];
  if (isNaN(hour)) return timeStr;
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 === 0 ? 12 : hour % 12;
  return `${hour12}:${min} ${ampm}`;
};

export default function TablesPage() {
  const [activeTab, setActiveTab] = useState("MAP"); // "MAP" | "LIST" | "TIMELINE"
  const [isEditMode, setIsEditMode] = useState(false);
  const [newFloorName, setNewFloorName] = useState('');
  
  // New Table Form States
  const [newTableId, setNewTableId] = useState('');
  const [newTableZone, setNewTableZone] = useState('WINDOW');
  const [newTableShape, setNewTableShape] = useState('rect');
  const [newTableSeats, setNewTableSeats] = useState(4);

  // Timeline & Reservation States
  const reservations = ReservationService.useReservations();
  const [selectedRes, setSelectedRes] = useState(null);
  const [prefilledTableId, setPrefilledTableId] = useState('');
  const [prefilledTime, setPrefilledTime] = useState('19:00');
  const [newResGuest, setNewResGuest] = useState('');
  const [newResDetails, setNewResDetails] = useState('');
  const [newResStatus, setNewResStatus] = useState('CONFIRMED');
  const [localResCustomerId, setLocalResCustomerId] = useState('');
  const [localResSearchQuery, setLocalResSearchQuery] = useState('');
  const [showLocalResSearchResults, setShowLocalResSearchResults] = useState(false);

  const [seatingTableId, setSeatingTableId] = useState(null);
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [seatSearchQuery, setSeatSearchQuery] = useState('');
  const customers = CustomerService.useCustomers();

  const [resTimeTableId, setResTimeTableId] = useState(null);
  const [inputtedResTime, setInputtedResTime] = useState('19:30');

  // Parse inputtedResTime ("19:30") to 12-hour components
  const parseResTime = () => {
    if (!inputtedResTime) return { hour: 7, minute: "30", ampm: "PM" };
    const [hour24Str, minuteStr] = inputtedResTime.split(':');
    const hour24 = parseInt(hour24Str, 10) || 0;
    const ampm = hour24 >= 12 ? "PM" : "AM";
    let hour12 = hour24 % 12;
    if (hour12 === 0) hour12 = 12;
    return {
      hour: hour12,
      minute: minuteStr || "00",
      ampm
    };
  };

  const { hour: selectedHour, minute: selectedMinute, ampm: selectedAmPm } = parseResTime();

  const handleTimeChange = (h, m, ampm) => {
    let hour24 = parseInt(h, 10);
    if (ampm === "PM" && hour24 < 12) hour24 += 12;
    if (ampm === "AM" && hour24 === 12) hour24 = 0;
    const hourStr = hour24.toString().padStart(2, '0');
    setInputtedResTime(`${hourStr}:${m}`);
  };

  // Parse prefilledTime ("19:00") to 12-hour components
  const parsePrefilledTime = () => {
    if (!prefilledTime) return { hour: 7, minute: "00", ampm: "PM" };
    const [hour24Str, minuteStr] = prefilledTime.split(':');
    const hour24 = parseInt(hour24Str, 10) || 0;
    const ampm = hour24 >= 12 ? "PM" : "AM";
    let hour12 = hour24 % 12;
    if (hour12 === 0) hour12 = 12;
    return {
      hour: hour12,
      minute: minuteStr || "00",
      ampm
    };
  };

  const { hour: prefHour, minute: prefMinute, ampm: prefAmPm } = parsePrefilledTime();

  const handlePrefilledTimeChange = (h, m, ampm) => {
    let hour24 = parseInt(h, 10);
    if (ampm === "PM" && hour24 < 12) hour24 += 12;
    if (ampm === "AM" && hour24 === 12) hour24 = 0;
    const hourStr = hour24.toString().padStart(2, '0');
    setPrefilledTime(`${hourStr}:${m}`);
  };

  const filteredCustomers = customers.filter(c =>
    c.name.toLowerCase().includes(seatSearchQuery.toLowerCase()) ||
    c.phone.includes(seatSearchQuery)
  ).slice(0, 10);

  const activeModal = UIService.useActiveModal();

  const floors = TablesService.useFloors();
  const selectedFloorId = TablesService.useSelectedFloorId();
  const activeFloor = floors.find(f => f.id === selectedFloorId) || floors[0];
  const allTables = TablesService.useTables();
  const currentFloorTables = TablesService.useTablesByFloor(selectedFloorId);

  // Next Table ID Helper
  const getNextTableId = (zone) => {
    const prefix = zone === 'BAR' ? 'B-' : 'T-';
    const numbers = allTables
      .filter(t => t.id.startsWith(prefix))
      .map(t => parseInt(t.id.slice(prefix.length), 10))
      .filter(n => !isNaN(n));
    const max = numbers.length > 0 ? Math.max(...numbers) : 0;
    return `${prefix}${max + 1}`;
  };

  // Sync newTableId when zone changes or modal opens
  useEffect(() => {
    if (activeModal === 'NEW_TABLE') {
      setNewTableId(getNextTableId(newTableZone));
      // Default shapes/seats based on zone for high utility UX
      if (newTableZone === 'BAR') {
        setNewTableShape('round');
        setNewTableSeats(2);
      } else if (newTableZone === 'PRIVATE') {
        setNewTableShape('rect');
        setNewTableSeats(8);
      } else if (newTableZone === 'CENTER') {
        setNewTableShape('round');
        setNewTableSeats(4);
      } else {
        setNewTableShape('rect');
        setNewTableSeats(4);
      }
    }
  }, [activeModal, newTableZone, allTables]);

  // Query parameter listener for Seat Customer shortcut from CRM profile
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const seatCustomerId = params.get('seatCustomerId');
      if (seatCustomerId) {
        // Find first available table
        const available = allTables.find(t => t.status === 'available');
        if (available) {
          setSeatingTableId(available.id);
          setSelectedCustomerId(seatCustomerId);
          setSeatSearchQuery('');
          
          // Open Seat Customer modal
          UIService.openModal('SEAT_CUSTOMER');
          
          // Clear query params so it doesn't trigger again on reload
          window.history.replaceState({}, '', window.location.pathname);
        }
      }
    }
  }, [allTables]);

  const handleCreateTable = (e) => {
    e.preventDefault();
    if (!newTableId.trim()) return;

    // Check if table ID already exists
    if (allTables.some(t => t.id.toLowerCase() === newTableId.trim().toLowerCase())) {
      alert(`Table ID "${newTableId.trim()}" already exists. Please choose a unique ID.`);
      return;
    }

    // Determine dimensions based on selected presets
    let width = 80;
    let height = 80;

    if (newTableZone === 'BAR') {
      width = 45;
      height = 45;
    } else {
      if (newTableSeats <= 2) {
        width = 70;
        height = 70;
      } else if (newTableSeats <= 4) {
        width = newTableShape === 'round' ? 100 : 80;
        height = newTableShape === 'round' ? 100 : 100;
      } else if (newTableSeats <= 6) {
        width = newTableShape === 'round' ? 120 : 120;
        height = newTableShape === 'round' ? 120 : 80;
      } else if (newTableSeats <= 8) {
        width = 160;
        height = 80;
      } else {
        width = 180;
        height = 90;
      }
    }

    // Place near center of canvas with a small random offset so multiple additions don't overlap perfectly
    const randomOffset = () => Math.floor(Math.random() * 4) * 20 - 40; // snaps cleanly to 20px grid
    const x = 400 + randomOffset();
    const y = 240 + randomOffset();

    const newTable = {
      id: newTableId.trim().toUpperCase(),
      zone: newTableZone,
      seats: Number(newTableSeats),
      status: 'available',
      x,
      y,
      width,
      height,
      rotation: 0,
      shape: newTableShape,
      floorId: selectedFloorId
    };

    TablesService.addTable(newTable);
    UIService.closeModal();
  };

  const handleCreateLocalReservation = (e) => {
    e.preventDefault();
    if (!newResGuest.trim()) return;

    ReservationService.addReservation({
      guest: newResGuest.trim(),
      details: newResDetails.trim() || "Party of 2",
      time: prefilledTime,
      status: newResStatus,
      tableId: prefilledTableId,
      customerId: localResCustomerId || undefined
    });

    // Clear and close
    setNewResGuest('');
    setNewResDetails('');
    setPrefilledTableId('');
    setLocalResCustomerId('');
    setLocalResSearchQuery('');
    UIService.closeModal();
  };

  const handleTableClick = (table) => {
    // Cycling through states is only allowed when not in Edit Mode
    if (isEditMode) return;

    const statuses = ["available", "occupied", "reserved", "cleaning"];
    const currentIndex = statuses.indexOf(table.status);
    const nextStatus = statuses[(currentIndex + 1) % statuses.length];
    
    if (nextStatus === 'occupied') {
      // Open seat assignment modal instead of immediately cycling
      setSeatingTableId(table.id);
      setSelectedCustomerId('');
      setSeatSearchQuery('');
      UIService.openModal('SEAT_CUSTOMER');
    } else if (nextStatus === 'reserved') {
      // Open custom reservation time setter modal instead of blindly cycling
      setResTimeTableId(table.id);
      setInputtedResTime(table.reservedAt || '19:30');
      UIService.openModal('SET_RESERVATION_TIME');
    } else {
      if (table.status === 'occupied') {
        // Table is LEAVING occupied — clear the seat and record visit
        TablesService.clearSeat(table.id);
      }
      TablesService.setTableStatus(table.id, nextStatus, undefined);
    }
  };

  const handleConfirmSeat = () => {
    if (!seatingTableId) return;
    if (selectedCustomerId) {
      TablesService.seatCustomer(seatingTableId, selectedCustomerId);
    } else {
      // Walk-in: set table status to occupied with no customer ID link
      TablesService.setTableStatus(seatingTableId, 'occupied');
    }
    setSeatingTableId(null);
    setSelectedCustomerId('');
    setSeatSearchQuery('');
    UIService.closeModal();
  };

  const handleToggleEditMode = () => {
    setIsEditMode(!isEditMode);
  };

  const handleCreateFloor = (e) => {
    e.preventDefault();
    if (!newFloorName.trim()) return;
    
    TablesService.addFloor(newFloorName.trim());
    setNewFloorName('');
    UIService.closeModal();
    setIsEditMode(true); // Automatically turn on edit mode for the empty floor
  };

  const handleDeleteFloor = () => {
    if (!window.confirm(`Are you sure you want to delete the floor "${activeFloor?.name || ''}" and all its tables? This action cannot be undone.`)) {
      return;
    }

    const remainingFloors = floors.filter(f => f.id !== selectedFloorId);
    
    // Call service to delete the floor
    TablesService.deleteFloor(selectedFloorId);

    if (remainingFloors.length > 0) {
      TablesService.setSelectedFloorId(remainingFloors[0].id);
    } else {
      TablesService.setSelectedFloorId("floor-1");
    }

    setIsEditMode(false);
  };

  return (
    <>
      <main className={styles.container}>
        <section className={styles.contentSection}>
        <div className={styles.cardWrapper}>
          
          {/* Controls / View Tabs Row */}
          <div className={styles.controlsRow}>
            <div className={styles.btnGroup}>
              <button 
                className={activeTab === "MAP" ? styles.viewBtnActive : styles.viewBtn}
                onClick={() => setActiveTab("MAP")}
              >
                Floor Map
              </button>
              <button 
                className={activeTab === "LIST" ? styles.viewBtnActive : styles.viewBtn}
                onClick={() => {
                  setActiveTab("LIST");
                  setIsEditMode(false); // Turn off edit mode when switching tabs
                }}
              >
                List View
              </button>
              <button 
                className={activeTab === "TIMELINE" ? styles.viewBtnActive : styles.viewBtn}
                onClick={() => {
                  setActiveTab("TIMELINE");
                  setIsEditMode(false); // Turn off edit mode when switching tabs
                }}
              >
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

          {/* Conditional View Rendering */}
          {activeTab === "MAP" && (
            <>
              {/* Floor Switcher & Canvas Controls Row */}
              <div className={canvasStyles.floorSwitcherRow}>
                {/* Floor Tabs Selector */}
                <div className={canvasStyles.floorTabs}>
                  {floors.map((floor) => (
                    <button
                      key={floor.id}
                      className={selectedFloorId === floor.id ? canvasStyles.floorTabActive : canvasStyles.floorTab}
                      onClick={() => {
                        TablesService.setSelectedFloorId(floor.id);
                        setIsEditMode(false); // Turn off edit mode when switching floors
                      }}
                    >
                      {floor.name}
                    </button>
                  ))}
                  <button 
                    className={canvasStyles.floorTabAdd}
                    onClick={() => UIService.openModal('NEW_FLOOR')}
                    title="Add new floor"
                  >
                    <Plus size={14} />
                  </button>
                </div>

                {/* Edit Mode Toggle Action */}
                <div className={canvasStyles.actionToolbar}>
                  {isEditMode && (
                    <button
                      className={canvasStyles.deleteFloorBtn}
                      onClick={handleDeleteFloor}
                    >
                      <Trash2 size={12} />
                      Delete Floor
                    </button>
                  )}
                  <button
                    className={isEditMode ? canvasStyles.editToggleBtnActive : canvasStyles.editToggleBtn}
                    onClick={handleToggleEditMode}
                  >
                    {isEditMode ? <Unlock size={12} /> : <Lock size={12} />}
                    {isEditMode ? "Lock Layout" : "Edit Layout"}
                  </button>
                </div>
              </div>

              {/* Scroll wrapper for responsive support */}
              <div className={styles.floorMapScrollWrapper}>
                <div className={`${styles.floorMapCard} ${styles.mapCardCanvasOverride}`}>
                  <FloorCanvas 
                    floorId={selectedFloorId}
                    isEditMode={isEditMode}
                    onToggleEditMode={handleToggleEditMode}
                    onTableClick={handleTableClick}
                  />
                </div>
              </div>
            </>
          )}

          {activeTab === "LIST" && (
            <div className={`${styles.floorMapCard} ${styles.directoryCard}`}>
              <div className={styles.directoryHeader}>
                <h2 className={styles.directoryTitle}>
                  TABLE DIRECTORY — {activeFloor.name.toUpperCase()}
                </h2>
                <span className={styles.directorySubtitle}>
                  {currentFloorTables.length} Active Stations
                </span>
              </div>
              
              <div className={styles.tableScrollWrapper}>
                <table className={styles.directoryTable}>
                  <thead>
                    <tr className={styles.tableHeaderRow}>
                      <th className={styles.tableHeaderCell}>TABLE ID</th>
                      <th className={styles.tableHeaderCell}>ZONE</th>
                      <th className={styles.tableHeaderCell}>CAPACITY</th>
                      <th className={styles.tableHeaderCell}>STATUS</th>
                      <th className={styles.tableHeaderCell}>SCHEDULE / META</th>
                      <th className={styles.tableHeaderCellRight}>ACTION</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentFloorTables.map((t) => (
                      <tr key={t.id} className={styles.tableRow}>
                        <td className={styles.tableCellBoldMono}>{t.id}</td>
                        <td className={styles.tableCellMuted}>{t.zone}</td>
                        <td className={styles.tableCell}>{t.seats} Guests</td>
                        <td className={styles.tableCell}>
                          <span className={`${styles.statusBadge} ${
                            t.status === 'occupied' ? styles.statusBadgeOccupied :
                            t.status === 'reserved' ? styles.statusBadgeReserved :
                            t.status === 'cleaning' ? styles.statusBadgeCleaning :
                            styles.statusBadgeAvailable
                          }`}>
                            {t.status}
                          </span>
                        </td>
                        <td className={styles.tableCellMuted} suppressHydrationWarning>
                          {t.status === 'reserved' ? (
                            `Reservation at ${formatTimeTo12Hour(t.reservedAt || '19:30')}`
                          ) : t.status === 'occupied' ? (
                            t.currentCustomerId ? (
                              customers.find((c) => c.id === t.currentCustomerId)?.name || 'Seated Customer'
                            ) : (
                              'Walk-in'
                            )
                          ) : (
                            '—'
                          )}
                        </td>
                        <td className={styles.tableCellRight}>
                          <button 
                            className={styles.cycleStatusBtn}
                            onClick={() => handleTableClick(t)}
                          >
                            Cycle Status
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "TIMELINE" && (
            <div className={styles.timelineGridContainer}>
              {/* GANTT TIMELINE BOARD */}
              <div className={styles.ganttBoardCard}>
                <div className={styles.directoryHeader}>
                  <h2 className={styles.directoryTitle}>
                    RESERVATION SCHEDULE — {activeFloor.name.toUpperCase()}
                  </h2>
                  <span className={styles.directorySubtitle}>
                    5:00 PM — 11:00 PM
                  </span>
                </div>
                
                <div className={styles.ganttScrollArea}>
                  <div className={styles.ganttGridContent}>
                    {/* Top Hours Header */}
                    <div className={styles.timeHeaderRow}>
                      <div className={styles.timeHeaderCellSpacer} />
                      <div className={styles.timeGridHours}>
                        <span className={styles.hourLabel}>5 PM</span>
                        <span className={styles.hourLabel}>6 PM</span>
                        <span className={styles.hourLabel}>7 PM</span>
                        <span className={styles.hourLabel}>8 PM</span>
                        <span className={styles.hourLabel}>9 PM</span>
                        <span className={styles.hourLabel}>10 PM</span>
                        <span className={styles.hourLabel}>11 PM</span>
                      </div>
                    </div>
                    
                    {/* Table Rows */}
                    {currentFloorTables.map((t) => {
                      // Find reservations assigned to this table
                      const tableRes = reservations.filter(r => r.tableId === t.id);
                      
                      const getLeftOffset = (timeStr) => {
                        if (!timeStr) return 0;
                        const [h, m] = timeStr.split(':').map(Number);
                        const minSinceStart = (h - 17) * 60 + m;
                        const pct = (minSinceStart / 360) * 100;
                        return Math.max(0, Math.min(pct, 100));
                      };

                      const getWidthPercent = (durationMins = 120) => {
                        const pct = (durationMins / 360) * 100;
                        return Math.max(0, Math.min(pct, 100));
                      };

                      return (
                        <div key={t.id} className={styles.tableRowGantt}>
                          {/* Left Meta Info */}
                          <div className={styles.tableMetaCol}>
                            <span className={styles.tableNameGantt}>{t.id}</span>
                            <span className={styles.tableDescGantt}>{t.seats} Seats • {t.zone}</span>
                          </div>
                          
                          {/* Right Time Slots Area */}
                          <div className={styles.timeGridCol}>
                            {/* Vertical Hour lines overlay */}
                            <div className={styles.hourLinesOverlay}>
                              <div className={styles.hourLine} />
                              <div className={styles.hourLine} />
                              <div className={styles.hourLine} />
                              <div className={styles.hourLine} />
                              <div className={styles.hourLine} />
                              <div className={styles.hourLine} />
                              <div className={styles.hourLine} />
                            </div>
                            
                            {/* Empty Slot Click Trigger Area (Rendered as transparent background clicks) */}
                            <div 
                              className={styles.timelineClickOverlay}
                              onClick={(e) => {
                                // Detect which hour they clicked based on click coordinates relative to timeGridCol
                                const rect = e.currentTarget.getBoundingClientRect();
                                const clickX = e.clientX - rect.left;
                                const ratio = clickX / rect.width;
                                const totalMins = Math.round(ratio * 360);
                                const hourClicked = 17 + Math.floor(totalMins / 60);
                                const minClicked = Math.floor((totalMins % 60) / 15) * 15; // snap to nearest 15 mins
                                const timeStr = `${hourClicked}:${minClicked.toString().padStart(2, '0')}`;
                                
                                setPrefilledTableId(t.id);
                                setPrefilledTime(timeStr);
                                UIService.openModal('LOCAL_RESERVATION');
                              }}
                            />
                            
                            {/* Render Reservation Pills */}
                            {tableRes.map((res) => {
                              const left = getLeftOffset(res.time);
                              const width = getWidthPercent(120); // standard 2 hours
                              
                              let pillClass = styles.pillLater;
                              if (res.status === 'SEATED') pillClass = styles.pillSeated;
                              else if (res.status === 'CONFIRMED') pillClass = styles.pillConfirmed;
                              else if (res.status === 'PENDING') pillClass = styles.pillPending;
                              
                              return (
                                <div
                                  key={res.id}
                                  className={`${styles.reservationPill} ${pillClass}`}
                                  style={{
                                    left: `${left}%`,
                                    width: `${width}%`,
                                    zIndex: 5
                                  }}
                                  onClick={(e) => {
                                    e.stopPropagation(); // prevent triggering parent row click!
                                    setSelectedRes(res);
                                    UIService.openModal('RESERVATION_DETAIL');
                                  }}
                                >
                                  <span className={styles.pillGuest}>{res.guest}</span>
                                  <span className={styles.pillMeta} suppressHydrationWarning>{res.details.split('•')[0]} • {formatTimeTo12Hour(res.time)}</span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
              
              {/* RIGHT UNASSIGNED / UPCOMING RESERVATIONS SIDEBAR */}
              <div className={styles.sidebarPanel}>
                <h3 className={styles.sidebarTitle}>UPCOMING TODAY</h3>
                <div className={styles.unassignedList}>
                  {reservations.map((res) => {
                    const badgeClass = res.status === 'SEATED' ? styles.statusBadgeOccupied :
                                       res.status === 'CONFIRMED' ? styles.statusBadgeReserved :
                                       res.status === 'PENDING' ? styles.statusBadgeCleaning :
                                       styles.statusBadgeAvailable;
                                       
                    return (
                      <div key={res.id} className={styles.unassignedCard}>
                        <div className={styles.unassignedCardHeader}>
                          <span className={styles.unassignedGuest}>{res.guest}</span>
                          <span className={`${styles.statusBadge} ${badgeClass} ${styles.unassignedBadgeSmall}`}>
                            {res.status}
                          </span>
                        </div>
                        <p className={styles.unassignedDetails}>{res.details}</p>
                        
                        <div className={styles.unassignedStatusRow}>
                          <span className={styles.unassignedTime} suppressHydrationWarning>
                            {formatTimeTo12Hour(res.time)}
                          </span>
                          
                          <select
                            className={styles.assignSelect}
                            value={res.tableId || ''}
                            onChange={(e) => {
                              const tableId = e.target.value || null;
                              ReservationService.assignTableToReservation(res.id, tableId);
                            }}
                          >
                            <option value="">-- Unassigned --</option>
                            {allTables.map(tb => (
                              <option key={tb.id} value={tb.id}>
                                {tb.id} ({tb.seats}p - {tb.zone})
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    );
                  })}
                  {reservations.length === 0 && (
                    <div className={styles.unassignedEmpty}>
                      No reservations scheduled for today.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
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

      {/* NEW FLOOR MODAL */}
      <Modal 
        isOpen={activeModal === 'NEW_FLOOR'} 
        onClose={() => {
          UIService.closeModal();
          setNewFloorName('');
        }} 
        title="Create New Floor"
      >
        <form onSubmit={handleCreateFloor} className={modalStyles.form} id="new-floor-form">
          <div className={modalStyles.formGroup}>
            <label className={modalStyles.label} htmlFor="floor-name">Floor Name</label>
            <input 
              type="text" 
              id="floor-name" 
              className={modalStyles.input} 
              placeholder="e.g. Patio, Private Dining Room"
              value={newFloorName}
              onChange={(e) => setNewFloorName(e.target.value)}
              required
              autoFocus
            />
          </div>
          <div className={modalStyles.footer}>
            <button 
              type="button" 
              className={modalStyles.cancelBtn} 
              onClick={() => {
                UIService.closeModal();
                setNewFloorName('');
              }}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className={modalStyles.submitBtn}
            >
              Create Floor
            </button>
          </div>
        </form>
      </Modal>

      {/* NEW TABLE MODAL */}
      <Modal 
        isOpen={activeModal === 'NEW_TABLE'} 
        onClose={() => {
          UIService.closeModal();
        }} 
        title="Create New Table"
      >
        <form onSubmit={handleCreateTable} className={modalStyles.form} id="new-table-form">
          <div className={modalStyles.formGroup}>
            <label className={modalStyles.label} htmlFor="table-zone">Zone</label>
            <select 
              id="table-zone" 
              className={modalStyles.select}
              value={newTableZone}
              onChange={(e) => setNewTableZone(e.target.value)}
              required
            >
              <option value="WINDOW">Window (Left)</option>
              <option value="CENTER">Center (Middle)</option>
              <option value="PRIVATE">Private (Right)</option>
              <option value="BAR">Bar Stool (Top Right)</option>
            </select>
          </div>

          <div className={modalStyles.formGroup}>
            <label className={modalStyles.label} htmlFor="table-id">Table ID</label>
            <input 
              type="text" 
              id="table-id" 
              className={modalStyles.input} 
              placeholder="e.g. T-15, B-4"
              value={newTableId}
              onChange={(e) => setNewTableId(e.target.value)}
              required
            />
          </div>

          {newTableZone !== 'BAR' && (
            <div className={modalStyles.formGroup}>
              <label className={modalStyles.label} htmlFor="table-shape">Shape</label>
              <select 
                id="table-shape" 
                className={modalStyles.select}
                value={newTableShape}
                onChange={(e) => setNewTableShape(e.target.value)}
                required
              >
                <option value="rect">Rectangular</option>
                <option value="round">Round</option>
              </select>
            </div>
          )}

          <div className={modalStyles.formGroup}>
            <label className={modalStyles.label} htmlFor="table-seats">Capacity (Seats)</label>
            <input 
              type="number" 
              id="table-seats" 
              className={modalStyles.input} 
              min="1" 
              max="20"
              value={newTableSeats}
              onChange={(e) => setNewTableSeats(e.target.value)}
              required
            />
          </div>

          <div className={modalStyles.footer}>
            <button 
              type="button" 
              className={modalStyles.cancelBtn} 
              onClick={() => {
                UIService.closeModal();
              }}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className={modalStyles.submitBtn}
            >
              Create Table
            </button>
          </div>
        </form>
      </Modal>

      {/* LOCAL RESERVATION MODAL (Clicking slot on timeline grid) */}
      <Modal
        isOpen={activeModal === 'LOCAL_RESERVATION'}
        onClose={() => {
          setNewResGuest('');
          setNewResDetails('');
          setLocalResCustomerId('');
          setLocalResSearchQuery('');
          UIService.closeModal();
        }}
        title={`New Reservation for Table ${prefilledTableId}`}
      >
        <form onSubmit={handleCreateLocalReservation} className={modalStyles.form}>
          <div className={modalStyles.formGroup}>
            <label className={modalStyles.label} htmlFor="local-guest">Guest Name</label>
            {localResCustomerId ? (
              <div className={styles.linkedBadge}>
                <div className={styles.linkedInfo}>
                  <span className={styles.linkedGuestName}>{newResGuest}</span>
                  <span className={styles.linkedGuestMeta}>
                    {customers.find(c => c.id === localResCustomerId)?.phone} • {customers.find(c => c.id === localResCustomerId)?.tier} Segment
                  </span>
                </div>
                <button
                  type="button"
                  className={styles.unlinkBtn}
                  onClick={() => {
                    setLocalResCustomerId('');
                    setNewResGuest('');
                    setLocalResSearchQuery('');
                  }}
                >
                  Unlink
                </button>
              </div>
            ) : (
              <>
                <input
                  type="text"
                  id="local-guest"
                  className={modalStyles.input}
                  placeholder="e.g. Lady Ada Lovelace"
                  value={newResGuest}
                  onChange={(e) => setNewResGuest(e.target.value)}
                  required
                  autoFocus
                />
                
                <div className={styles.searchGroup} style={{ marginTop: '8px' }}>
                  <label className={modalStyles.label} style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Or Search CRM Guest to Link
                  </label>
                  <input
                    type="text"
                    className={modalStyles.input}
                    placeholder="Search by name or phone..."
                    value={localResSearchQuery}
                    onChange={(e) => {
                      setLocalResSearchQuery(e.target.value);
                      setShowLocalResSearchResults(true);
                    }}
                    onFocus={() => setShowLocalResSearchResults(true)}
                  />
                  {showLocalResSearchResults && localResSearchQuery.trim() && (
                    <div className={styles.searchResultsList}>
                      {customers
                        .filter(c => 
                          c.name.toLowerCase().includes(localResSearchQuery.toLowerCase()) || 
                          c.phone.includes(localResSearchQuery)
                        )
                        .slice(0, 5)
                        .map(c => (
                          <button
                            key={c.id}
                            type="button"
                            className={styles.searchResultItem}
                            onClick={() => {
                              setLocalResCustomerId(c.id);
                              setNewResGuest(c.name);
                              setShowLocalResSearchResults(false);
                            }}
                          >
                            <div>
                              <div className={styles.searchResultName}>{c.name}</div>
                              <div className={styles.searchResultPhone}>{c.phone}</div>
                            </div>
                            <span className={`${styles.searchResultTier} ${
                              c.tier === 'Platinum' ? styles.tierPlatinum :
                              c.tier === 'VIP' ? styles.tierVip :
                              styles.tierStandard
                            }`}>
                              {c.tier}
                            </span>
                          </button>
                        ))}
                      {customers.filter(c => 
                        c.name.toLowerCase().includes(localResSearchQuery.toLowerCase()) || 
                        c.phone.includes(localResSearchQuery)
                      ).length === 0 && (
                        <div style={{ padding: '8px', fontSize: '12px', color: '#888', textAlign: 'center' }}>
                          No guests found
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          <div className={modalStyles.formGroup}>
            <label className={modalStyles.label} htmlFor="local-details">Party Details / Notes</label>
            <input
              type="text"
              id="local-details"
              className={modalStyles.input}
              placeholder="e.g. Party of 4 • Gluten Free"
              value={newResDetails}
              onChange={(e) => setNewResDetails(e.target.value)}
            />
          </div>

          <div className={modalStyles.formGroup}>
            <label className={modalStyles.label}>Schedule Time</label>
            <div className={styles.timeSelectorRow}>
              <select
                className={styles.timeDropdown}
                value={prefHour.toString().padStart(2, '0')}
                onChange={(e) => handlePrefilledTimeChange(e.target.value, prefMinute, prefAmPm)}
              >
                {Array.from({ length: 12 }, (_, i) => i + 1).map(h => (
                  <option key={h} value={h.toString().padStart(2, '0')}>{h}</option>
                ))}
              </select>
              <span className={styles.timeColon}>:</span>
              <select
                className={styles.timeDropdown}
                value={prefMinute}
                onChange={(e) => handlePrefilledTimeChange(prefHour, e.target.value, prefAmPm)}
              >
                {Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0')).map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
              <select
                className={styles.timeAmPmDropdown}
                value={prefAmPm}
                onChange={(e) => handlePrefilledTimeChange(prefHour, prefMinute, e.target.value)}
              >
                <option value="AM">AM</option>
                <option value="PM">PM</option>
              </select>
            </div>
          </div>

          <div className={modalStyles.formGroup}>
            <label className={modalStyles.label} htmlFor="local-status">Status</label>
            <select
              id="local-status"
              className={modalStyles.select}
              value={newResStatus}
              onChange={(e) => setNewResStatus(e.target.value)}
              required
            >
              <option value="CONFIRMED">Confirmed</option>
              <option value="PENDING">Pending</option>
              <option value="SEATED">Seated</option>
              <option value="LATER">Later</option>
            </select>
          </div>

          <div className={modalStyles.footer}>
            <button
              type="button"
              className={modalStyles.cancelBtn}
              onClick={() => {
                UIService.closeModal();
                setNewResGuest('');
                setNewResDetails('');
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={modalStyles.submitBtn}
            >
              Book Table
            </button>
          </div>
        </form>
      </Modal>

      {/* RESERVATION DETAIL MODAL (Clicking active Gantt pill) */}
      <Modal
        isOpen={activeModal === 'RESERVATION_DETAIL' && !!selectedRes}
        onClose={() => {
          UIService.closeModal();
          setSelectedRes(null);
        }}
        title="Reservation Details"
      >
        {selectedRes && (
          <div className={modalStyles.form}>
            <div className={styles.timelineDetailCard}>
              <div className={styles.timelineDetailRow}>
                <span className={styles.timelineDetailLabel}>Guest Name</span>
                <span className={styles.timelineDetailVal}>{selectedRes.guest}</span>
              </div>
              <div className={styles.timelineDetailRow}>
                <span className={styles.timelineDetailLabel}>Assigned Table</span>
                <span className={styles.timelineDetailVal}>{selectedRes.tableId || 'Unassigned'}</span>
              </div>
              <div className={styles.timelineDetailRow}>
                <span className={styles.timelineDetailLabel}>Details / Notes</span>
                <span className={styles.timelineDetailVal}>{selectedRes.details}</span>
              </div>
              <div className={styles.timelineDetailRow}>
                <span className={styles.timelineDetailLabel}>Arrival Schedule</span>
                <span className={styles.timelineDetailTime} suppressHydrationWarning>{formatTimeTo12Hour(selectedRes.time)}</span>
              </div>
              <div className={styles.timelineDetailRow}>
                <span className={styles.timelineDetailLabel}>Current Status</span>
                <span className={styles.timelineDetailVal}>{selectedRes.status}</span>
              </div>
              
              <div className={styles.modalActionRow}>
                <button
                  type="button"
                  className={`${modalStyles.submitBtn} ${styles.flexButton}`}
                  onClick={() => {
                    const statuses = ["PENDING", "CONFIRMED", "SEATED", "LATER"];
                    const nextIdx = (statuses.indexOf(selectedRes.status) + 1) % statuses.length;
                    const nextStatus = statuses[nextIdx];
                    ReservationService.updateReservationStatus(selectedRes.id, nextStatus);
                    setSelectedRes({ ...selectedRes, status: nextStatus });
                  }}
                >
                  Cycle Status
                </button>
                <button
                  type="button"
                  className={`${styles.unassignBtn} ${styles.unassignBtnFlex}`}
                  onClick={() => {
                    ReservationService.assignTableToReservation(selectedRes.id, null);
                    UIService.closeModal();
                    setSelectedRes(null);
                  }}
                >
                  Unassign Table
                </button>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* SEAT CUSTOMER MODAL */}
      <Modal
        isOpen={activeModal === 'SEAT_CUSTOMER'}
        onClose={() => {
          UIService.closeModal();
          setSeatingTableId(null);
          setSelectedCustomerId('');
          setSeatSearchQuery('');
        }}
        title={`Seat Customer at Table ${seatingTableId || ''}`}
      >
        <div className={modalStyles.form}>
          <div className={modalStyles.formGroup}>
            <label className={modalStyles.label} htmlFor="customer-search">Search CRM Customer</label>
            <input
              type="text"
              id="customer-search"
              className={modalStyles.input}
              placeholder="Search by name or phone..."
              value={seatSearchQuery}
              onChange={(e) => {
                setSeatSearchQuery(e.target.value);
                setSelectedCustomerId(''); // Reset selection when searching
              }}
              autoFocus
            />
          </div>

          <div className={modalStyles.formGroup}>
            <label className={modalStyles.label}>Select Profile</label>
            <div className={styles.seatCustomerList}>
              {filteredCustomers.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  className={`${styles.seatCustomerItem} ${selectedCustomerId === c.id ? styles.seatCustomerItemActive : ''}`}
                  onClick={() => setSelectedCustomerId(c.id)}
                >
                  <div className={styles.customerSeatMeta}>
                    <span className={styles.customerSeatName}>{c.name}</span>
                    <span className={styles.customerSeatPhone}>{c.phone}</span>
                  </div>
                  <span className={`${styles.tierBadge} ${
                    c.tier === 'Platinum' ? styles.tierBadgePlatinum :
                    c.tier === 'VIP' ? styles.tierBadgeVip :
                    styles.tierBadgeStandard
                  }`}>
                    {c.tier}
                  </span>
                </button>
              ))}
              {filteredCustomers.length === 0 && (
                <div className={styles.emptySearch}>
                  No profiles match "{seatSearchQuery}"
                </div>
              )}
            </div>
          </div>

          <div className={styles.walkInWrapper}>
            <button
              type="button"
              className={`${styles.walkInBtn} ${selectedCustomerId === 'WALK-IN' ? styles.walkInBtnActive : ''}`}
              onClick={() => setSelectedCustomerId('WALK-IN')}
            >
              <span>Walk-in Guest</span>
              <span className={styles.walkInSubtitle}>(No CRM account link)</span>
            </button>
          </div>

          <div className={modalStyles.footer}>
            <button
              type="button"
              className={modalStyles.cancelBtn}
              onClick={() => {
                UIService.closeModal();
                setSeatingTableId(null);
                setSelectedCustomerId('');
                setSeatSearchQuery('');
              }}
            >
              Cancel
            </button>
            <button
              type="button"
              className={modalStyles.submitBtn}
              onClick={() => {
                if (selectedCustomerId && selectedCustomerId !== 'WALK-IN') {
                  TablesService.seatCustomer(seatingTableId, selectedCustomerId);
                } else {
                  TablesService.setTableStatus(seatingTableId, 'occupied');
                }
                setSeatingTableId(null);
                setSelectedCustomerId('');
                setSeatSearchQuery('');
                UIService.closeModal();
              }}
            >
              Seat Guest
            </button>
          </div>
        </div>
      </Modal>

      {/* SET RESERVATION TIME MODAL */}
      <Modal
        isOpen={activeModal === 'SET_RESERVATION_TIME'}
        onClose={() => {
          UIService.closeModal();
          setResTimeTableId(null);
        }}
        title={`Set Reservation Time — Table ${resTimeTableId || ''}`}
      >
        <div className={modalStyles.form}>
          <div className={modalStyles.formGroup}>
            <label className={modalStyles.label}>Select Time</label>
            <div className={styles.timeSelectorRow}>
              <select
                className={styles.timeDropdown}
                value={selectedHour.toString().padStart(2, '0')}
                onChange={(e) => handleTimeChange(e.target.value, selectedMinute, selectedAmPm)}
              >
                {Array.from({ length: 12 }, (_, i) => i + 1).map(h => (
                  <option key={h} value={h.toString().padStart(2, '0')}>{h}</option>
                ))}
              </select>
              <span className={styles.timeColon}>:</span>
              <select
                className={styles.timeDropdown}
                value={selectedMinute}
                onChange={(e) => handleTimeChange(selectedHour, e.target.value, selectedAmPm)}
              >
                {Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0')).map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
              <select
                className={styles.timeAmPmDropdown}
                value={selectedAmPm}
                onChange={(e) => handleTimeChange(selectedHour, selectedMinute, e.target.value)}
              >
                <option value="AM">AM</option>
                <option value="PM">PM</option>
              </select>
            </div>
          </div>

          <div className={modalStyles.formGroup}>
            <label className={modalStyles.label}>Quick Presets</label>
            <div className={styles.presetTimeGrid}>
              {[
                { value: "18:00", label: "6:00 PM" },
                { value: "18:30", label: "6:30 PM" },
                { value: "19:00", label: "7:00 PM" },
                { value: "19:30", label: "7:30 PM" },
                { value: "20:00", label: "8:00 PM" },
                { value: "20:30", label: "8:30 PM" },
                { value: "21:00", label: "9:00 PM" },
                { value: "21:30", label: "9:30 PM" }
              ].map((preset) => (
                <button
                  key={preset.value}
                  type="button"
                  className={`${styles.presetTimeBtn} ${inputtedResTime === preset.value ? styles.presetTimeBtnActive : ''}`}
                  onClick={() => setInputtedResTime(preset.value)}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          <div className={modalStyles.footer}>
            <button
              type="button"
              className={modalStyles.cancelBtn}
              onClick={() => {
                UIService.closeModal();
                setResTimeTableId(null);
              }}
            >
              Cancel
            </button>
            <button
              type="button"
              className={modalStyles.submitBtn}
              onClick={() => {
                if (resTimeTableId) {
                  TablesService.setTableStatus(resTimeTableId, 'reserved', inputtedResTime);
                }
                setResTimeTableId(null);
                UIService.closeModal();
              }}
            >
              Confirm
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
