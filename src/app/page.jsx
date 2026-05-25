import React from 'react';

export default function DashboardPage() {
  return (
    <div>
        <meta charSet="utf-8" />
        <meta content="width=device-width, initial-scale=1.0" name="viewport" />
        <title>DineFlow Dashboard</title>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500&family=JetBrains+Mono:wght@400;500&family=Newsreader:opsz,wght@6..72,400&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
        {/* SideNavBar */}
        <aside className="w-[220px] h-screen fixed left-0 top-0 bg-surface-card border-r border-border-hairline flex flex-col py-gutter z-50">
          <div className="px-6 mb-8 flex items-center gap-3">
            <div>
              <h1 className="font-headline-md text-title-lg text-primary leading-tight">DineFlow</h1>
              <p className="font-label-caps text-[10px] text-muted uppercase tracking-widest mt-1">Michelin Service</p>
            </div>
          </div>
          <nav className="flex-1 overflow-y-auto px-4 space-y-6">
            {/* Operations */}
            <div>
              <h2 className="font-label-caps text-label-caps text-muted px-2 mb-3 uppercase">Operations</h2>
              <ul className="space-y-1">
                <li>
                  <a className="flex items-center gap-3 px-3 py-2 text-primary border-l-2 border-primary bg-surface-container-high rounded-r font-body-sm text-body-sm" href="#">
                    <span className="material-symbols-outlined text-[20px]">dashboard</span>
                    Dashboard
                  </a>
                </li>
                <li>
                  <a className="flex items-center gap-3 px-3 py-2 text-secondary hover:text-primary hover:bg-surface-container-low transition-colors duration-200 rounded font-body-sm text-body-sm border-l-2 border-transparent" href="#">
                    <span className="material-symbols-outlined text-[20px]">receipt_long</span>
                    Orders
                  </a>
                </li>
                <li>
                  <a className="flex items-center gap-3 px-3 py-2 text-secondary hover:text-primary hover:bg-surface-container-low transition-colors duration-200 rounded font-body-sm text-body-sm border-l-2 border-transparent" href="#">
                    <span className="material-symbols-outlined text-[20px]">restaurant_menu</span>
                    Menu
                  </a>
                </li>
                <li>
                  <a className="flex items-center gap-3 px-3 py-2 text-secondary hover:text-primary hover:bg-surface-container-low transition-colors duration-200 rounded font-body-sm text-body-sm border-l-2 border-transparent" href="#">
                    <span className="material-symbols-outlined text-[20px]">table_restaurant</span>
                    Tables
                  </a>
                </li>
                <li>
                  <a className="flex items-center gap-3 px-3 py-2 text-secondary hover:text-primary hover:bg-surface-container-low transition-colors duration-200 rounded font-body-sm text-body-sm border-l-2 border-transparent" href="#">
                    <span className="material-symbols-outlined text-[20px]">monitor</span>
                    Kitchen Display
                  </a>
                </li>
              </ul>
            </div>
            {/* CRM */}
            <div>
              <h2 className="font-label-caps text-label-caps text-muted px-2 mb-3 uppercase">CRM</h2>
              <ul className="space-y-1">
                <li>
                  <a className="flex items-center gap-3 px-3 py-2 text-secondary hover:text-primary hover:bg-surface-container-low transition-colors duration-200 rounded font-body-sm text-body-sm border-l-2 border-transparent" href="#">
                    <span className="material-symbols-outlined text-[20px]">groups</span>
                    Customers
                  </a>
                </li>
                <li>
                  <a className="flex items-center gap-3 px-3 py-2 text-secondary hover:text-primary hover:bg-surface-container-low transition-colors duration-200 rounded font-body-sm text-body-sm border-l-2 border-transparent" href="#">
                    <span className="material-symbols-outlined text-[20px]">loyalty</span>
                    Loyalty
                  </a>
                </li>
                <li>
                  <a className="flex items-center gap-3 px-3 py-2 text-secondary hover:text-primary hover:bg-surface-container-low transition-colors duration-200 rounded font-body-sm text-body-sm border-l-2 border-transparent" href="#">
                    <span className="material-symbols-outlined text-[20px]">campaign</span>
                    Campaigns
                  </a>
                </li>
              </ul>
            </div>
            {/* Business */}
            <div>
              <h2 className="font-label-caps text-label-caps text-muted px-2 mb-3 uppercase">Business</h2>
              <ul className="space-y-1">
                <li>
                  <a className="flex items-center gap-3 px-3 py-2 text-secondary hover:text-primary hover:bg-surface-container-low transition-colors duration-200 rounded font-body-sm text-body-sm border-l-2 border-transparent" href="#">
                    <span className="material-symbols-outlined text-[20px]">analytics</span>
                    Analytics
                  </a>
                </li>
                <li>
                  <a className="flex items-center gap-3 px-3 py-2 text-secondary hover:text-primary hover:bg-surface-container-low transition-colors duration-200 rounded font-body-sm text-body-sm border-l-2 border-transparent" href="#">
                    <span className="material-symbols-outlined text-[20px]">badge</span>
                    Staff
                  </a>
                </li>
                <li>
                  <a className="flex items-center gap-3 px-3 py-2 text-secondary hover:text-primary hover:bg-surface-container-low transition-colors duration-200 rounded font-body-sm text-body-sm border-l-2 border-transparent" href="#">
                    <span className="material-symbols-outlined text-[20px]">settings</span>
                    Settings
                  </a>
                </li>
              </ul>
            </div>
          </nav>
          <div className="mt-auto px-4 pt-6 border-t border-border-hairline">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-full overflow-hidden border border-border-hairline bg-surface-container">
                <div className="absolute inset-0 flex items-center justify-center text-muted font-title-sm">MC</div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-title-sm text-body-sm text-ink truncate">Marie Curie</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary block" />
                  <p className="font-body-sm text-[12px] text-muted truncate">Maitre D'</p>
                </div>
              </div>
            </div>
          </div>
        </aside>
        {/* Main Content */}
        <main className="ml-[220px] flex-1 flex flex-col min-h-screen">
          {/* TopAppBar equivalent (Custom for main header) */}
          <header className="h-24 px-margin-page flex justify-between items-end pb-6 border-b border-border-hairline bg-canvas/90 backdrop-blur sticky top-0 z-40">
            <div>
              <h1 className="font-headline-md text-headline-md text-ink">Dashboard</h1>
              <p className="font-body-md text-body-md text-muted mt-1">Saturday, 24 May 2026 · Dinner service</p>
            </div>
            <div className="flex items-center gap-4">
              <button className="w-10 h-10 flex items-center justify-center rounded-full border border-border-hairline text-secondary hover:bg-surface-container transition-colors">
                <span className="material-symbols-outlined text-[20px]">notifications</span>
              </button>
              <button className="bg-primary text-on-primary px-5 py-2.5 rounded hover:bg-surface-tint transition-colors font-title-sm text-body-sm">
                New Order
              </button>
            </div>
          </header>
          <div className="px-margin-page py-12 space-y-section-v-rhythm">
            {/* Row 1: KPI Cards */}
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-internal-gap">
              {/* Revenue */}
              <div className="bg-surface-card border border-border-hairline rounded p-6 flex flex-col justify-between h-32">
                <div className="flex justify-between items-start">
                  <span className="font-label-caps text-label-caps text-muted uppercase">Today's Revenue</span>
                  <span className="bg-tertiary-container/10 text-tertiary px-2 py-0.5 rounded font-data-mono text-[12px]">+12%</span>
                </div>
                <div className="font-headline-md text-[28px] text-ink mt-auto">₹18,420</div>
              </div>
              {/* Active Orders */}
              <div className="bg-surface-card border border-border-hairline rounded p-6 flex flex-col justify-between h-32">
                <div className="flex justify-between items-start">
                  <span className="font-label-caps text-label-caps text-muted uppercase">Active Orders</span>
                  <span className="bg-primary-container/10 text-primary px-2 py-0.5 rounded font-data-mono text-[12px]">3 New</span>
                </div>
                <div className="font-headline-md text-[28px] text-ink mt-auto">14</div>
              </div>
              {/* Tables */}
              <div className="bg-surface-card border border-border-hairline rounded p-6 flex flex-col justify-between h-32">
                <div className="flex justify-between items-start mb-4">
                  <span className="font-label-caps text-label-caps text-muted uppercase">Tables Occupied</span>
                  <span className="font-data-mono text-body-sm text-ink">9 / 14</span>
                </div>
                <div className="w-full h-1 bg-surface-container rounded-full overflow-hidden mt-auto">
                  <div className="h-full bg-primary" style={{width: '64%'}} />
                </div>
              </div>
              {/* Avg Order Value */}
              <div className="bg-surface-card border border-border-hairline rounded p-6 flex flex-col justify-between h-32">
                <div className="flex justify-between items-start">
                  <span className="font-label-caps text-label-caps text-muted uppercase">Avg Order Value</span>
                  <span className="text-secondary font-data-mono text-[12px]">-₹40</span>
                </div>
                <div className="font-headline-md text-[28px] text-ink mt-auto">₹680</div>
              </div>
            </section>
            {/* Row 2: Live Pipeline & Reservations */}
            <section className="grid grid-cols-1 xl:grid-cols-12 gap-gutter">
              {/* Live Orders Pipeline (60%) */}
              <div className="xl:col-span-7 bg-surface-card border border-border-hairline rounded p-card-padding">
                <div className="flex justify-between items-end mb-8">
                  <h2 className="font-headline-md text-title-lg text-ink">Live Orders</h2>
                  <a className="font-label-caps text-label-caps text-primary hover:underline" href="#">View All</a>
                </div>
                <div className="grid grid-cols-3 gap-internal-gap">
                  {/* Incoming */}
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="w-2 h-2 rounded-full bg-accent-amber" />
                      <span className="font-label-caps text-label-caps text-muted">Incoming (4)</span>
                    </div>
                    {/* Order Card */}
                    <div className="bg-canvas border border-border-hairline rounded p-4">
                      <div className="flex justify-between items-start mb-3">
                        <span className="font-data-mono text-[12px] text-muted">#ORD-892</span>
                        <span className="bg-primary/10 text-primary font-data-mono text-[12px] px-2 py-0.5 rounded">T-12</span>
                      </div>
                      <p className="font-body-sm text-body-sm text-ink mb-3 line-clamp-2">2x Truffle Risotto, 1x Wagyu Steak, 1x Sparkling Water</p>
                      <div className="flex items-center gap-1.5 text-accent-amber">
                        <span className="material-symbols-outlined text-[14px]">timer</span>
                        <span className="font-data-mono text-[12px]">12m</span>
                      </div>
                    </div>
                  </div>
                  {/* Preparing */}
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="w-2 h-2 rounded-full bg-tertiary" />
                      <span className="font-label-caps text-label-caps text-muted">Preparing (6)</span>
                    </div>
                    {/* Order Card */}
                    <div className="bg-canvas border border-border-hairline rounded p-4">
                      <div className="flex justify-between items-start mb-3">
                        <span className="font-data-mono text-[12px] text-muted">#ORD-890</span>
                        <span className="bg-primary/10 text-primary font-data-mono text-[12px] px-2 py-0.5 rounded">T-04</span>
                      </div>
                      <p className="font-body-sm text-body-sm text-ink mb-3 line-clamp-2">1x Seafood Platter, 2x White Wine, 1x Oysters</p>
                      <div className="flex items-center gap-1.5 text-secondary">
                        <span className="material-symbols-outlined text-[14px]">timer</span>
                        <span className="font-data-mono text-[12px]">24m</span>
                      </div>
                    </div>
                  </div>
                  {/* Ready */}
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="w-2 h-2 rounded-full bg-primary" />
                      <span className="font-label-caps text-label-caps text-muted">Ready (4)</span>
                    </div>
                    {/* Order Card */}
                    <div className="bg-canvas border border-border-hairline rounded p-4">
                      <div className="flex justify-between items-start mb-3">
                        <span className="font-data-mono text-[12px] text-muted">#ORD-885</span>
                        <span className="bg-primary/10 text-primary font-data-mono text-[12px] px-2 py-0.5 rounded">T-08</span>
                      </div>
                      <p className="font-body-sm text-body-sm text-ink mb-3 line-clamp-2">3x Chocolate Souffle, 3x Espresso</p>
                      <div className="flex items-center gap-1.5 text-secondary">
                        <span className="material-symbols-outlined text-[14px]">timer</span>
                        <span className="font-data-mono text-[12px]">2m</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Today's Reservations (40%) */}
              <div className="xl:col-span-5 bg-surface-card border border-border-hairline rounded p-card-padding flex flex-col">
                <div className="flex justify-between items-end mb-8">
                  <h2 className="font-headline-md text-title-lg text-ink">Reservations</h2>
                  <span className="font-data-mono text-body-sm text-muted">Next 2 Hrs</span>
                </div>
                <div className="flex-1 flex flex-col gap-0 border-t border-border-hairline">
                  <div className="flex items-center py-4 border-b border-border-hairline">
                    <div className="w-20 font-data-mono text-body-sm font-medium text-ink">19:30</div>
                    <div className="flex-1">
                      <p className="font-title-sm text-body-sm text-ink">Elara Vance</p>
                      <p className="font-body-sm text-[12px] text-muted">Party of 4</p>
                    </div>
                    <div className="bg-tertiary-container/10 text-tertiary border border-tertiary/20 px-3 py-1 rounded-full font-label-caps text-[10px] uppercase">Seated</div>
                  </div>
                  <div className="flex items-center py-4 border-b border-border-hairline">
                    <div className="w-20 font-data-mono text-body-sm font-medium text-ink">19:45</div>
                    <div className="flex-1">
                      <p className="font-title-sm text-body-sm text-ink">Dr. Sterling</p>
                      <p className="font-body-sm text-[12px] text-muted">Party of 2 · VIP</p>
                    </div>
                    <div className="bg-surface-container text-ink border border-border-hairline px-3 py-1 rounded-full font-label-caps text-[10px] uppercase">Confirmed</div>
                  </div>
                  <div className="flex items-center py-4 border-b border-border-hairline">
                    <div className="w-20 font-data-mono text-body-sm font-medium text-ink">20:00</div>
                    <div className="flex-1">
                      <p className="font-title-sm text-body-sm text-ink">Otsuka Group</p>
                      <p className="font-body-sm text-[12px] text-muted">Party of 8</p>
                    </div>
                    <div className="bg-accent-amber/10 text-on-surface-variant border border-accent-amber/20 px-3 py-1 rounded-full font-label-caps text-[10px] uppercase">Pending</div>
                  </div>
                  <div className="flex items-center py-4">
                    <div className="w-20 font-data-mono text-body-sm font-medium text-ink">20:15</div>
                    <div className="flex-1">
                      <p className="font-title-sm text-body-sm text-ink">J. Reynolds</p>
                      <p className="font-body-sm text-[12px] text-muted">Party of 2</p>
                    </div>
                    <div className="bg-surface-container text-ink border border-border-hairline px-3 py-1 rounded-full font-label-caps text-[10px] uppercase">Confirmed</div>
                  </div>
                </div>
              </div>
            </section>
            {/* Row 3: Dark Band Data */}
            <section className="bg-surface-dark rounded border border-inverse-surface p-card-padding grid grid-cols-1 lg:grid-cols-2 gap-margin-page text-on-surface-variant">
              {/* Top Sellers */}
              <div>
                <h2 className="font-headline-md text-title-lg text-canvas mb-8">Top Sellers (Today)</h2>
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between items-end mb-2">
                      <span className="font-data-mono text-[12px] text-muted w-6">01</span>
                      <span className="font-title-sm text-body-sm text-surface-container-high flex-1">Truffle Risotto</span>
                      <span className="font-data-mono text-[12px] text-canvas">24 Ord</span>
                    </div>
                    <div className="w-full h-1 bg-inverse-surface rounded-full overflow-hidden">
                      <div className="h-full bg-primary" style={{width: '85%'}} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between items-end mb-2">
                      <span className="font-data-mono text-[12px] text-muted w-6">02</span>
                      <span className="font-title-sm text-body-sm text-surface-container-high flex-1">Wagyu A5</span>
                      <span className="font-data-mono text-[12px] text-canvas">18 Ord</span>
                    </div>
                    <div className="w-full h-1 bg-inverse-surface rounded-full overflow-hidden">
                      <div className="h-full bg-primary" style={{width: '65%'}} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between items-end mb-2">
                      <span className="font-data-mono text-[12px] text-muted w-6">03</span>
                      <span className="font-title-sm text-body-sm text-surface-container-high flex-1">Oyster Dozen</span>
                      <span className="font-data-mono text-[12px] text-canvas">15 Ord</span>
                    </div>
                    <div className="w-full h-1 bg-inverse-surface rounded-full overflow-hidden">
                      <div className="h-full bg-primary" style={{width: '50%'}} />
                    </div>
                  </div>
                </div>
              </div>
              {/* Recent VIP Guests */}
              <div>
                <h2 className="font-headline-md text-title-lg text-canvas mb-8">Recent VIP Activity</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded bg-inverse-surface flex items-center justify-center font-title-sm text-canvas">AS</div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-title-sm text-body-sm text-surface-container-high">A. Sterling</p>
                        <span className="material-symbols-outlined text-[14px] text-accent-amber" data-weight="fill">star</span>
                      </div>
                      <p className="font-body-sm text-[12px] text-muted mt-0.5">Checked in 15m ago</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded bg-inverse-surface flex items-center justify-center font-title-sm text-canvas">MW</div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-title-sm text-body-sm text-surface-container-high">M. Wallace</p>
                        <span className="material-symbols-outlined text-[14px] text-accent-amber" data-weight="fill">star</span>
                      </div>
                      <p className="font-body-sm text-[12px] text-muted mt-0.5">Reserved for Tmrw</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded bg-inverse-surface flex items-center justify-center font-title-sm text-canvas">KL</div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-title-sm text-body-sm text-surface-container-high">K. Laurent</p>
                        <span className="material-symbols-outlined text-[14px] text-accent-amber" data-weight="fill">star</span>
                      </div>
                      <p className="font-body-sm text-[12px] text-muted mt-0.5">Paid Bill 2h ago</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
            {/* Row 4: Quick Actions */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-internal-gap pb-12">
              <div className="bg-surface-card border border-border-hairline rounded p-6 flex items-center gap-4 hover:bg-surface-container-high transition-colors cursor-pointer group">
                <div className="w-12 h-12 rounded-full border border-primary/20 bg-primary-container/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-on-primary transition-colors">
                  <span className="material-symbols-outlined">event_seat</span>
                </div>
                <div>
                  <h3 className="font-title-sm text-body-md text-ink">Take Reservation</h3>
                  <p className="font-body-sm text-[12px] text-muted mt-1">Manual booking entry</p>
                </div>
              </div>
              <div className="bg-surface-card border border-border-hairline rounded p-6 flex items-center gap-4 hover:bg-surface-container-high transition-colors cursor-pointer group">
                <div className="w-12 h-12 rounded-full border border-border-hairline bg-surface-container flex items-center justify-center text-ink group-hover:border-ink transition-colors">
                  <span className="material-symbols-outlined">campaign</span>
                </div>
                <div>
                  <h3 className="font-title-sm text-body-md text-ink">Guest Campaign</h3>
                  <p className="font-body-sm text-[12px] text-muted mt-1">Send SMS/Email</p>
                </div>
              </div>
              <div className="bg-surface-card border border-border-hairline rounded p-6 flex items-center gap-4 hover:bg-surface-container-high transition-colors cursor-pointer group">
                <div className="w-12 h-12 rounded-full border border-border-hairline bg-surface-container flex items-center justify-center text-ink group-hover:border-ink transition-colors">
                  <span className="material-symbols-outlined">bar_chart</span>
                </div>
                <div>
                  <h3 className="font-title-sm text-body-md text-ink">End of Day Report</h3>
                  <p className="font-body-sm text-[12px] text-muted mt-1">Generate summaries</p>
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>
    );
}