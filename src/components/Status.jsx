import React from 'react';
import { TrendingUp, ArrowUp } from '@/lib/icons';

export default function Status() {
  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* KPI 1 */}
      <div className="bg-surface-card p-6 border border-border-hairline rounded-xl">
        <p className="font-label-caps text-label-caps text-muted mb-4">
          TODAY'S REVENUE
        </p>
        <div className="flex items-end justify-between">
          <h3 className="font-headline-md text-headline-md text-ink">
            $14,280
          </h3>
          <span className="font-data-mono text-tertiary flex items-center gap-1 text-[12px]">
            <TrendingUp size={14} /> +12%
          </span>
        </div>
        <div className="mt-4 w-full bg-surface-container h-1 rounded-full overflow-hidden">
          <div className="bg-tertiary h-full w-[78%]" />
        </div>
      </div>
      {/* KPI 2 */}
      <div className="bg-surface-card p-6 border border-border-hairline rounded-xl">
        <p className="font-label-caps text-label-caps text-muted mb-4">
          ACTIVE ORDERS
        </p>
        <div className="flex items-end justify-between">
          <h3 className="font-headline-md text-headline-md text-ink">18</h3>
          <span className="font-data-mono text-muted text-[12px]">
            Avg 42m/table
          </span>
        </div>
        <div className="mt-4 flex gap-1">
          <div className="h-1 flex-1 bg-primary" />
          <div className="h-1 flex-1 bg-primary" />
          <div className="h-1 flex-1 bg-primary" />
          <div className="h-1 flex-1 bg-outline-variant" />
          <div className="h-1 flex-1 bg-outline-variant" />
        </div>
      </div>
      {/* KPI 3 */}
      <div className="bg-surface-card p-6 border border-border-hairline rounded-xl">
        <p className="font-label-caps text-label-caps text-muted mb-4">
          TABLES OCCUPIED
        </p>
        <div className="flex items-end justify-between">
          <h3 className="font-headline-md text-headline-md text-ink">
            24/32
          </h3>
          <span className="font-data-mono text-accent-amber text-[12px]">
            75% Capacity
          </span>
        </div>
        <div className="mt-4 w-full bg-surface-container h-1 rounded-full overflow-hidden">
          <div className="bg-accent-amber h-full w-[75%]" />
        </div>
      </div>
      {/* KPI 4 */}
      <div className="bg-surface-card p-6 border border-border-hairline rounded-xl">
        <p className="font-label-caps text-label-caps text-muted mb-4">
          AVG ORDER VALUE
        </p>
        <div className="flex items-end justify-between">
          <h3 className="font-headline-md text-headline-md text-ink">
            $185.50
          </h3>
          <span className="font-data-mono text-tertiary flex items-center gap-1 text-[12px]">
            <ArrowUp size={14} /> $12
          </span>
        </div>
        <div className="mt-4 grid grid-cols-7 gap-1 h-1">
          <div className="bg-surface-container-highest" />
          <div className="bg-surface-container-highest" />
          <div className="bg-surface-container-highest" />
          <div className="bg-primary-container" />
          <div className="bg-primary" />
          <div className="bg-primary" />
          <div className="bg-primary" />
        </div>
      </div>
    </section>
  );
}
