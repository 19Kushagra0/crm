import React from 'react';
import styles from '@/style/customers.module.css';
import { Star, Medal, UserPlus, AlertTriangle } from '@/lib/icons';

export default function Page() {
  return (
    <main className={styles.container}>
      <meta charSet="utf-8" />
      <meta content="width=device-width, initial-scale=1.0" name="viewport" />
      <title>DineFlow - Customers</title>
      <link
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
        rel="stylesheet"
      />
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500&family=JetBrains+Mono:wght@400&family=Newsreader:wght@400&display=swap"
        rel="stylesheet"
      />
      <style
        dangerouslySetInnerHTML={{
          __html:
            "\n        .material-symbols-outlined {\n            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;\n        }\n        .material-symbols-outlined[data-weight=\"fill\"] {\n            font-variation-settings: 'FILL' 1;\n        }\n    "
        }}
      />

      <div className={styles.contentWrapper}>
        {/* Page Header */}
        <section className={styles.pageHeader}>
          <div className={styles.titleSection}>
            <h2 className={styles.title}>Customers</h2>
            <p className={styles.subtitle}>1,247 guests · 84 active this month</p>
          </div>
          <button className={styles.addBtn}>+ Add Customer</button>
        </section>

        {/* Search & Filters */}
        <section className={styles.controlsRow}>
          <div className={styles.searchWrapper}>
            <span className={`material-symbols-outlined ${styles.searchIcon}`}>
              search
            </span>
            <input
              className={styles.searchInput}
              placeholder="Search by name, phone, email…"
              type="text"
            />
          </div>
          
          <div className={styles.filtersWrapper}>
            <button className={`${styles.filterBadge} ${styles.filterBadgeActive}`}>
              All
            </button>
            <button className={styles.filterBadge}>
              <Star size={16} /> Gold
            </button>
            <button className={styles.filterBadge}>
              <Medal size={16} /> Silver
            </button>
            <button className={styles.filterBadge}>
              <Medal size={16} /> Bronze
            </button>
            <button className={styles.filterBadge}>
              <UserPlus size={16} /> New
            </button>
            <button className={styles.filterBadge}>
              <AlertTriangle size={16} /> At Risk
            </button>
          </div>
        </section>

        {/* Customers Table container */}
        <section className={styles.tableContainer}>
          <div className={styles.tableInner}>
            {/* Table Header */}
            <div className={styles.tableHeader}>
              <div className={styles.headerCell}>Guest</div>
              <div className={styles.headerCell}>Tier</div>
              <div className={styles.headerCell}>Visits</div>
              <div className={styles.headerCell}>Total Spent</div>
              <div className={styles.headerCell}>Last Visit</div>
              <div className={styles.headerCell}>Action</div>
            </div>

            {/* Table Body */}
            <div className={styles.tableBody}>
              {/* Row 1 */}
              <div className={styles.tableRow}>
                <div className={styles.guestCell}>
                  <div className={styles.avatar}>AR</div>
                  <div className={styles.guestInfo}>
                    <div className={styles.guestName}>Aisha Rahman</div>
                    <div className={styles.guestContact}>+91 98765 43210</div>
                  </div>
                </div>
                <div className={styles.tierCell}>
                  <span className={styles.badgeGold}>Gold</span>
                </div>
                <div className={styles.visitsCell}>
                  <span className={styles.visitsValue}>42</span>
                </div>
                <div className={styles.spentCell}>
                  <span className={styles.spentValue}>₹1,24,000</span>
                </div>
                <div className={styles.lastVisitCell}>
                  <span className={styles.lastVisitValue}>2 days ago</span>
                </div>
                <div className={styles.actionCell}>
                  <button className={styles.actionBtn}>View Profile</button>
                </div>
              </div>

              {/* Row 2 */}
              <div className={styles.tableRowAlt}>
                <div className={styles.guestCell}>
                  <img
                    alt="Customer Avatar"
                    className={styles.avatarImage}
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDWl_UrByzEEFa5krYteX3iFyvF5Eux-jK_Y0uF0IVp1gDCwDfyJWnNZorq0ej4LX-iSRnDz43PczNx9Z3w20VURDkL20St9JTQme_OmssrIYFH_CGsnCNIvqIESKszDMnwa7HiQM3YcYgbI95Dl265gV8lIBFGQqpp6paLrpShgPPpDA5fH9UGJVwmvbnyR5VgqRaKRvc3OflqCPLrN-034u5MQuiYq8MF9MxIc1DLR4k5VEzHle2m2ZZRm6pcmq1j4vhFmQUpu8w"
                  />
                  <div className={styles.guestInfo}>
                    <div className={styles.guestName}>Vikram Singh</div>
                    <div className={styles.guestContact}>+91 99887 76655</div>
                  </div>
                </div>
                <div className={styles.tierCell}>
                  <span className={styles.badgeSilver}>Silver</span>
                </div>
                <div className={styles.visitsCell}>
                  <span className={styles.visitsValue}>18</span>
                </div>
                <div className={styles.spentCell}>
                  <span className={styles.spentValue}>₹48,000</span>
                </div>
                <div className={styles.lastVisitCell}>
                  <span className={styles.lastVisitValue}>3 days ago</span>
                </div>
                <div className={styles.actionCell}>
                  <button className={styles.actionBtn}>View Profile</button>
                </div>
              </div>

              {/* Row 3 */}
              <div className={styles.tableRow}>
                <div className={styles.guestCell}>
                  <div className={styles.avatar}>MN</div>
                  <div className={styles.guestInfo}>
                    <div className={styles.guestName}>Maya Nambiar</div>
                    <div className={styles.guestContact}>+91 91234 56789</div>
                  </div>
                </div>
                <div className={styles.tierCell}>
                  <span className={styles.badgeAtRisk}>At Risk</span>
                </div>
                <div className={styles.visitsCell}>
                  <span className={styles.visitsValue}>2</span>
                </div>
                <div className={styles.spentCell}>
                  <span className={styles.spentValue}>₹8,500</span>
                </div>
                <div className={styles.lastVisitCell}>
                  <span className={styles.lastVisitValue}>4 months ago</span>
                </div>
                <div className={styles.actionCell}>
                  <button className={styles.actionBtn}>View Profile</button>
                </div>
              </div>

              {/* Row 4 */}
              <div className={styles.tableRowAlt}>
                <div className={styles.guestCell}>
                  <img
                    alt="Customer Avatar"
                    className={styles.avatarImage}
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuB91iaVNd-RmdcS99OkJDf1Nxh5VvhceiOqq17ZucjQ-OQU1ZVFKBssnVYfW0T5-Uyix4LTxXTC3nnrJgJJOkiZlWgNfgIu8B5wUsFP1P1rfyCeuJp975qVfeQbyG8omNCGmUjsOmR-mCo7UjPktGF2OXipmmpycJWHbwz6qZ5mEmAa6_0bZASM56NUGdanya4fiKDqYjJuB1PEvh77aZX7we0X_YPIJ83WcM5m7pUR_WOfP0upSYfU9rwPaaVwy8X6pMf5H54JKrA"
                  />
                  <div className={styles.guestInfo}>
                    <div className={styles.guestName}>Priya Desai</div>
                    <div className={styles.guestContact}>priya.d@example.com</div>
                  </div>
                </div>
                <div className={styles.tierCell}>
                  <span className={styles.badgeNew}>New</span>
                </div>
                <div className={styles.visitsCell}>
                  <span className={styles.visitsValue}>1</span>
                </div>
                <div className={styles.spentCell}>
                  <span className={styles.spentValue}>₹12,000</span>
                </div>
                <div className={styles.lastVisitCell}>
                  <span className={styles.lastVisitValue}>Yesterday</span>
                </div>
                <div className={styles.actionCell}>
                  <button className={styles.actionBtn}>View Profile</button>
                </div>
              </div>

              {/* Row 5 */}
              <div className={styles.tableRow}>
                <div className={styles.guestCell}>
                  <div className={styles.avatar}>RJ</div>
                  <div className={styles.guestInfo}>
                    <div className={styles.guestName}>Rahul Joshi</div>
                    <div className={styles.guestContact}>+91 98888 11111</div>
                  </div>
                </div>
                <div className={styles.tierCell}>
                  <span className={styles.badgeBronze}>Bronze</span>
                </div>
                <div className={styles.visitsCell}>
                  <span className={styles.visitsValue}>5</span>
                </div>
                <div className={styles.spentCell}>
                  <span className={styles.spentValue}>₹15,200</span>
                </div>
                <div className={styles.lastVisitCell}>
                  <span className={styles.lastVisitValue}>2 weeks ago</span>
                </div>
                <div className={styles.actionCell}>
                  <button className={styles.actionBtn}>View Profile</button>
                </div>
              </div>
            </div>

            {/* Pagination */}
            <div className={styles.pagination}>
              <button className={styles.paginationBtn}>
                <span className="material-symbols-outlined">chevron_left</span>
                Previous
              </button>
              <div className={styles.pageNumbers}>
                <button className={`${styles.pageBtn} ${styles.pageBtnActive}`}>1</button>
                <button className={styles.pageBtn}>2</button>
                <button className={styles.pageBtn}>3</button>
                <span className={styles.ellipsis}>…</span>
                <button className={styles.pageBtn}>42</button>
              </div>
              <button className={styles.paginationBtn}>
                Next
                <span className="material-symbols-outlined">chevron_right</span>
              </button>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
