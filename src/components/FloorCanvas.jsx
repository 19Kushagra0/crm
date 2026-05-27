"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Stage, Layer, Rect, Circle, Text, Group } from 'react-konva';
import styles from '@/style/floorCanvas.module.css';
import TablesService from '@/services/TablesService';
import UIService from '@/services/UIService';
import { Pencil, Save, X, Lock, Unlock, Plus, Trash2 } from '@/lib/icons';

export default function FloorCanvas({ 
  floorId, 
  isEditMode, 
  onToggleEditMode,
  onTableClick 
}) {
  const tables = TablesService.useTablesByFloor(floorId);
  const [snapToGrid, setSnapToGrid] = useState(true);
  const [hoveredTableId, setHoveredTableId] = useState(null);
  const [selectedTableId, setSelectedTableId] = useState(null);
  
  // Track initial positions to allow Discard
  const initialPositionsRef = useRef(null);

  useEffect(() => {
    // When edit mode is entered, take a snapshot of positions
    if (isEditMode && !initialPositionsRef.current) {
      initialPositionsRef.current = tables.map(t => ({ id: t.id, x: t.x, y: t.y }));
    } else if (!isEditMode) {
      initialPositionsRef.current = null;
    }
    // Reset selection when toggling edit mode or floor
    setSelectedTableId(null);
  }, [isEditMode, tables, floorId]);

  const handleDiscard = () => {
    if (initialPositionsRef.current) {
      initialPositionsRef.current.forEach(snap => {
        TablesService.updateTablePosition(snap.id, snap.x, snap.y);
      });
    }
    setSelectedTableId(null);
    onToggleEditMode();
  };

  const handleDeleteSelected = () => {
    if (selectedTableId) {
      TablesService.deleteTable(selectedTableId);
      setSelectedTableId(null);
    }
  };

  const handleSave = () => {
    // Current positions are already updated in the store in real time,
    // so we just turn off edit mode and save.
    onToggleEditMode();
  };

  const handleDragMove = (e, t) => {
    const node = e.target;
    let newX = node.x();
    let newY = node.y();

    // Grid snapping (20px increments)
    if (snapToGrid) {
      newX = Math.round(newX / 20) * 20;
      newY = Math.round(newY / 20) * 20;
    }

    // Boundary constraints: canvas is 960x570
    newX = Math.max(0, Math.min(newX, 960 - t.width));
    newY = Math.max(0, Math.min(newY, 570 - t.height));

    node.x(newX);
    node.y(newY);
  };

  const handleDragEnd = (e, t) => {
    const node = e.target;
    TablesService.updateTablePosition(t.id, node.x(), node.y());
  };

  // Helper to determine style properties based on table status
  const getTableStyle = (t, isHovered) => {
    const isRound = t.shape === "round";
    
    // Status colors
    const colors = {
      available: {
        fill: "#fbf8f3", // Canvas cream
        stroke: "#e6dfd8",
        strokeWidth: 1,
        dash: null,
        textColor: "#141413",
        subColor: "#6c6a64",
        label: `${t.seats}p`
      },
      occupied: {
        fill: "#8f482f", // DineFlow Burgundy
        stroke: "#8f482f",
        strokeWidth: 0,
        dash: null,
        textColor: "#ffffff",
        subColor: "#fbf8f3",
        label: `${t.seats}p`
      },
      reserved: {
        fill: "#d99a26", // DineFlow Amber
        stroke: "#d99a26",
        strokeWidth: 0,
        dash: null,
        textColor: "#141413",
        subColor: "#141413",
        label: t.reservedAt || "19:30"
      },
      cleaning: {
        fill: "#efe9de", // Card background
        stroke: "#6c6a64", // Muted border
        strokeWidth: 1,
        dash: [4, 4],
        textColor: "#6c6a64",
        subColor: "#6c6a64",
        label: "Clean"
      }
    };

    const style = colors[t.status] || colors.available;

    // Hover glow effect
    const shadow = isHovered
      ? {
          shadowColor: "rgba(143, 72, 47, 0.4)",
          shadowBlur: 14,
          shadowOffset: { x: 0, y: 6 },
          shadowOpacity: 0.85
        }
      : {
          shadowColor: "rgba(20, 20, 19, 0.08)",
          shadowBlur: 6,
          shadowOffset: { x: 0, y: 3 },
          shadowOpacity: 0.5
        };

    return { ...style, ...shadow };
  };

  return (
    <div className={isEditMode ? styles.canvasContainerEditing : styles.canvasContainer}>
      
      {/* Floating Canvas Badges / Controls */}
      <div className={styles.canvasOverlay}>
        {isEditMode ? (
          <div className={styles.editingBadge}>
            <div className={styles.badgeDot} />
            <span>Layout Edit Mode</span>
          </div>
        ) : (
          <div /> // Spacer
        )}

        {isEditMode && (
          <div className={styles.floatingToolbar}>
            <button 
              className={snapToGrid ? styles.toolbarBtnActive : styles.toolbarBtn}
              onClick={() => setSnapToGrid(!snapToGrid)}
              title="Align elements to a 20px grid"
            >
              Snap to Grid
            </button>
            <div className={styles.toolbarSeparator} />
            <button 
              className={styles.btnAddTable} 
              onClick={() => UIService.openModal('NEW_TABLE')}
              title="Create a new table"
            >
              <Plus size={12} />
              Add Table
            </button>
            {selectedTableId && (
              <button 
                className={styles.btnDelete} 
                onClick={handleDeleteSelected}
                title="Delete selected table"
              >
                <Trash2 size={12} />
                Delete
              </button>
            )}
            <div className={styles.toolbarSeparator} />
            <button className={styles.btnSave} onClick={handleSave}>
              <Save size={12} />
              Save
            </button>
            <button className={styles.btnDiscard} onClick={handleDiscard}>
              <X size={12} />
              Discard
            </button>
          </div>
        )}
      </div>

      {/* Konva Stage */}
      <Stage 
        width={960} 
        height={570}
        onClick={(e) => {
          // If clicking Stage background, deselect
          if (isEditMode && e.target === e.target.getStage()) {
            setSelectedTableId(null);
          }
        }}
        onTap={(e) => {
          if (isEditMode && e.target === e.target.getStage()) {
            setSelectedTableId(null);
          }
        }}
      >
        <Layer>
          {tables.map((t) => {
            const isHovered = hoveredTableId === t.id;
            const s = getTableStyle(t, isHovered);
            const isRound = t.shape === "round";
            const isStool = t.zone === "BAR";

            return (
              <Group
                key={t.id}
                x={t.x}
                y={t.y}
                draggable={isEditMode}
                onDragMove={(e) => handleDragMove(e, t)}
                onDragEnd={(e) => handleDragEnd(e, t)}
                onMouseEnter={() => {
                  setHoveredTableId(t.id);
                  if (document) document.body.style.cursor = isEditMode ? 'move' : 'pointer';
                }}
                onMouseLeave={() => {
                  setHoveredTableId(null);
                  if (document) document.body.style.cursor = 'default';
                }}
                onClick={(e) => {
                  if (isEditMode) {
                    setSelectedTableId(t.id);
                  } else {
                    onTableClick(t);
                  }
                }}
                onTap={(e) => {
                  if (isEditMode) {
                    setSelectedTableId(t.id);
                  } else {
                    onTableClick(t);
                  }
                }}
              >
                {/* Visual Shape */}
                {isRound ? (
                  <Circle
                    x={t.width / 2}
                    y={t.height / 2}
                    radius={t.width / 2}
                    fill={s.fill}
                    stroke={s.stroke}
                    strokeWidth={s.strokeWidth}
                    dash={s.dash}
                    shadowColor={s.shadowColor}
                    shadowBlur={s.shadowBlur}
                    shadowOffset={s.shadowOffset}
                    shadowOpacity={s.shadowOpacity}
                  />
                ) : (
                  <Rect
                    x={0}
                    y={0}
                    width={t.width}
                    height={t.height}
                    cornerRadius={8}
                    fill={s.fill}
                    stroke={s.stroke}
                    strokeWidth={s.strokeWidth}
                    dash={s.dash}
                    shadowColor={s.shadowColor}
                    shadowBlur={s.shadowBlur}
                    shadowOffset={s.shadowOffset}
                    shadowOpacity={s.shadowOpacity}
                  />
                )}

                {/* Edit Mode Selection Ring */}
                {isEditMode && selectedTableId === t.id && (
                  isRound ? (
                    <Circle
                      x={t.width / 2}
                      y={t.height / 2}
                      radius={t.width / 2 + 5}
                      stroke="#8f482f"
                      strokeWidth={2}
                      dash={[4, 4]}
                    />
                  ) : (
                    <Rect
                      x={-5}
                      y={-5}
                      width={t.width + 10}
                      height={t.height + 10}
                      cornerRadius={12}
                      stroke="#8f482f"
                      strokeWidth={2}
                      dash={[4, 4]}
                    />
                  )
                )}

                {/* Table ID Label */}
                <Text
                  x={0}
                  y={t.height / 2 - (isStool ? 6 : 12)}
                  width={t.width}
                  align="center"
                  text={t.id.replace("T-", "T").replace("B-", "B")}
                  fontFamily="Inter, system-ui, -apple-system, sans-serif"
                  fontSize={isStool ? 10 : 13}
                  fontStyle={isStool ? "normal" : "500"}
                  fill={s.textColor}
                />

                {/* Seats / Capacity / Status Label (Only if not a Bar Stool) */}
                {!isStool && (
                  <Text
                    x={0}
                    y={t.height / 2 + 5}
                    width={t.width}
                    align="center"
                    text={s.label}
                    fontFamily="'JetBrains Mono', monospace"
                    fontSize={10}
                    fontStyle={t.status === "cleaning" ? "italic" : "normal"}
                    fill={s.subColor}
                  />
                )}
              </Group>
            );
          })}
        </Layer>
      </Stage>
    </div>
  );
}
