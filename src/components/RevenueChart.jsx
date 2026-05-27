"use client";

import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import styles from '@/style/dashboard.module.css';

export default function RevenueChart({ data }) {
  const [isMounted, setIsMounted] = useState(false);
  const [activeMetric, setActiveMetric] = useState('revenue');

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className={styles.chartPlaceholder}>
        <div className={styles.loadingSpinner} />
        <span>Loading Revenue Analysis...</span>
      </div>
    );
  }

  const metricConfigs = {
    revenue: {
      label: 'Revenue',
      dataKey: 'revenue',
      stroke: 'var(--color-primary, #8f482f)',
      fillId: 'colorRevenue',
      stopColor: 'var(--color-primary, #8f482f)',
      formatY: (val) => {
        if (val >= 100000) return `₹${(val / 100000).toFixed(1)}L`;
        if (val >= 1000) return `₹${(val / 1000).toFixed(0)}k`;
        return `₹${val}`;
      },
      formatTooltip: (val) => [`₹${val.toLocaleString('en-IN')}`, 'Revenue']
    },
    orders: {
      label: 'Orders',
      dataKey: 'orders',
      stroke: 'var(--color-accent-amber, #e8a55a)',
      fillId: 'colorOrders',
      stopColor: 'var(--color-accent-amber, #e8a55a)',
      formatY: (val) => `${val}`,
      formatTooltip: (val) => [`${val} Orders`, 'Order Volume']
    },
    occupancy: {
      label: 'Occupancy',
      dataKey: 'occupancy',
      stroke: 'var(--color-tertiary, #00685a)',
      fillId: 'colorOccupancy',
      stopColor: 'var(--color-tertiary, #00685a)',
      formatY: (val) => `${val}%`,
      formatTooltip: (val) => [`${val}%`, 'Table Occupancy']
    },
    avgValue: {
      label: 'Avg Spend',
      dataKey: 'avgValue',
      stroke: 'var(--color-secondary, #605e5b)',
      fillId: 'colorAvgValue',
      stopColor: 'var(--color-secondary, #605e5b)',
      formatY: (val) => `₹${val}`,
      formatTooltip: (val) => [`₹${val.toLocaleString('en-IN')}`, 'Average Ticket']
    }
  };

  const config = metricConfigs[activeMetric];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div className={styles.chartTabs}>
        {Object.keys(metricConfigs).map((key) => {
          const cfg = metricConfigs[key];
          const isActive = activeMetric === key;
          return (
            <button
              key={key}
              className={`${styles.chartTab} ${isActive ? styles[`tabActive_${key}`] : ''}`}
              onClick={() => setActiveMetric(key)}
            >
              {cfg.label}
            </button>
          );
        })}
      </div>

      <div className={styles.chartContainer}>
        <ResponsiveContainer width="100%" height={320}>
          <AreaChart
            data={data}
            margin={{ top: 20, right: 20, left: 10, bottom: 0 }}
          >
            <defs>
              <linearGradient id={config.fillId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={config.stopColor} stopOpacity={0.25}/>
                <stop offset="95%" stopColor={config.stopColor} stopOpacity={0.0}/>
              </linearGradient>
            </defs>
            <CartesianGrid 
              stroke="var(--color-border-hairline, #e6dfd8)" 
              strokeDasharray="3 3" 
              vertical={false}
            />
            <XAxis 
              dataKey="day" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'var(--color-muted, #6c6a64)', fontSize: 12, fontFamily: 'Inter, sans-serif' }}
            />
            <YAxis 
              tickFormatter={config.formatY}
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'var(--color-muted, #6c6a64)', fontSize: 12, fontFamily: 'JetBrains Mono, monospace' }}
            />
            <Tooltip 
              formatter={config.formatTooltip}
              contentStyle={{
                backgroundColor: 'var(--color-canvas, #faf9f5)',
                borderColor: 'var(--color-border-hairline, #e6dfd8)',
                borderRadius: '0.25rem',
                color: 'var(--color-ink, #141413)',
                fontFamily: 'Inter, sans-serif',
                fontSize: '13px',
                padding: '10px 14px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)'
              }}
              labelStyle={{
                fontFamily: 'Inter, sans-serif',
                fontWeight: 600,
                marginBottom: '4px',
                color: 'var(--color-ink, #141413)'
              }}
            />
            <Area 
              type="monotone" 
              dataKey={config.dataKey} 
              stroke={config.stroke} 
              strokeWidth={2}
              fillOpacity={1} 
              fill={`url(#${config.fillId})`} 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
