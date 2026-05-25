import React from 'react';
import styles from '@/style/menu.module.css';

export default function Page() {
  return (
    <>
      <meta charSet="utf-8" />
      <meta content="width=device-width, initial-scale=1.0" name="viewport" />
      <title>DineFlow - Menu Management</title>
      <link
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
        rel="stylesheet"
      />
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500&family=JetBrains+Mono:wght@400&family=Newsreader:opsz,wght@6..72,400&display=swap"
        rel="stylesheet"
      />
      <link
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
        rel="stylesheet"
      />
      <style
        dangerouslySetInnerHTML={{
          __html:
            "\n        body { font-family: 'Inter', sans-serif; }\n        .material-symbols-outlined { font-variation-settings: 'FILL' 0; }\n        .material-symbols-outlined.fill { font-variation-settings: 'FILL' 1; }\n    "
        }}
      />
      
      {/* Main Content Wrapper */}
      <div className={styles.container}>
        {/* Page Canvas */}
        <main className={styles.content}>
          {/* Header Section */}
          <div className={styles.headerSection}>
            <div>
              <h2 className={styles.title}>
                Menu
              </h2>
              <p className={styles.subtitle}>
                48 items across 6 categories
              </p>
            </div>
          </div>
          {/* Sub-nav */}
          <div className={styles.subNavContainer}>
            <ul className={styles.subNavList}>
              <li className={styles.subNavItemActive}>
                <a className={styles.subNavLinkActive} href="#">
                  All
                </a>
              </li>
              <li className={styles.subNavItem}>
                <a className={styles.subNavLink} href="#">
                  Starters
                </a>
              </li>
              <li className={styles.subNavItem}>
                <a className={styles.subNavLink} href="#">
                  Mains
                </a>
              </li>
              <li className={styles.subNavItem}>
                <a className={styles.subNavLink} href="#">
                  Breads
                </a>
              </li>
              <li className={styles.subNavItem}>
                <a className={styles.subNavLink} href="#">
                  Drinks
                </a>
              </li>
              <li className={styles.subNavItem}>
                <a className={styles.subNavLink} href="#">
                  Desserts
                </a>
              </li>
              <li className={styles.subNavItem}>
                <a className={styles.subNavLink} href="#">
                  Specials
                </a>
              </li>
            </ul>
          </div>
          {/* Main Grid Area */}
          <div className={styles.gridArea}>
            {/* Card 1 */}
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <span className={styles.categoryBadge}>
                  Mains
                </span>
                <div className={`${styles.toggleSwitch} ${styles.toggleActive}`}>
                  <div className={`${styles.toggleThumb} ${styles.toggleThumbActive}`} />
                </div>
              </div>
              <h3 className={styles.cardTitle}>
                Truffle Risotto
              </h3>
              <p className={styles.cardDescription}>
                Arborio rice slow-cooked in wild mushroom broth, finished with aged
                parmesan and shaved black truffle.
              </p>
              <div className={styles.allergenList}>
                <span className={styles.allergenBadge}>
                  Dairy
                </span>
                <span className={styles.allergenBadge}>
                  Gluten
                </span>
              </div>
              <div className={styles.cardFooter}>
                <span className={styles.cardPrice}>₹850</span>
                <div className={styles.cardActions}>
                  <button className={styles.actionBtn}>
                    <span className="material-symbols-outlined text-[16px]">
                      edit
                    </span>
                  </button>
                  <button className={`${styles.actionBtn} ${styles.deleteBtn}`}>
                    <span className="material-symbols-outlined text-[16px]">
                      delete
                    </span>
                  </button>
                </div>
              </div>
            </div>
            {/* Card 2 */}
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <span className={styles.categoryBadge}>
                  Starters
                </span>
                <div className={`${styles.toggleSwitch} ${styles.toggleInactive}`}>
                  <div className={`${styles.toggleThumb} ${styles.toggleThumbInactive}`} />
                </div>
              </div>
              <h3 className={styles.cardTitle}>
                Burrata Heirloom
              </h3>
              <p className={styles.cardDescription}>
                Fresh Puglia burrata served with heritage tomatoes, basil oil, and
                aged balsamic reduction.
              </p>
              <div className={styles.allergenList}>
                <span className={styles.allergenBadge}>
                  Dairy
                </span>
              </div>
              <div className={styles.cardFooter}>
                <span className={styles.cardPrice}>
                  ₹650
                </span>
                <div className={styles.cardActions}>
                  <button className={styles.actionBtn}>
                    <span className="material-symbols-outlined text-[16px]">
                      edit
                    </span>
                  </button>
                  <button className={`${styles.actionBtn} ${styles.deleteBtn}`}>
                    <span className="material-symbols-outlined text-[16px]">
                      delete
                    </span>
                  </button>
                </div>
              </div>
            </div>
            {/* Card 3 */}
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <span className={styles.categoryBadge}>
                  Mains
                </span>
                <div className={`${styles.toggleSwitch} ${styles.toggleActive}`}>
                  <div className={`${styles.toggleThumb} ${styles.toggleThumbActive}`} />
                </div>
              </div>
              <h3 className={styles.cardTitle}>
                Seared Scallops
              </h3>
              <p className={styles.cardDescription}>
                Hokkaido scallops pan-seared, served atop cauliflower purée with
                caper and raisin dressing.
              </p>
              <div className={styles.allergenList}>
                <span className={styles.allergenBadge}>
                  Shellfish
                </span>
              </div>
              <div className={styles.cardFooter}>
                <span className={styles.cardPrice}>₹1200</span>
                <div className={styles.cardActions}>
                  <button className={styles.actionBtn}>
                    <span className="material-symbols-outlined text-[16px]">
                      edit
                    </span>
                  </button>
                  <button className={`${styles.actionBtn} ${styles.deleteBtn}`}>
                    <span className="material-symbols-outlined text-[16px]">
                      delete
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
          {/* Bottom Band */}
          <div className={styles.bottomBand}>
            {/* Left Column: Chart */}
            <div>
              <h4 className={styles.bandTitle}>
                Category Performance
              </h4>
              <div className={styles.chartContainer}>
                <div className={styles.chartRow}>
                  <span className={styles.chartLabel}>Mains</span>
                  <div className={styles.chartBarWrapper}>
                    <div className={styles.chartBarFill} style={{ width: '75%' }} />
                  </div>
                  <span className={styles.chartValue}>75%</span>
                </div>
                <div className={styles.chartRow}>
                  <span className={styles.chartLabel}>Starters</span>
                  <div className={styles.chartBarWrapper}>
                    <div className={styles.chartBarFill} style={{ width: '50%' }} />
                  </div>
                  <span className={styles.chartValue}>50%</span>
                </div>
                <div className={styles.chartRow}>
                  <span className={styles.chartLabel}>Desserts</span>
                  <div className={styles.chartBarWrapper}>
                    <div className={styles.chartBarFill} style={{ width: '33%' }} />
                  </div>
                  <span className={styles.chartValue}>33%</span>
                </div>
              </div>
            </div>
            {/* Right Column: Review List */}
            <div>
              <h4 className={styles.bandTitle}>
                Items to Review
              </h4>
              <ul className={styles.reviewList}>
                <li className={styles.reviewItem}>
                  <span className={styles.reviewName}>
                    Artichoke Dip
                  </span>
                  <span className={styles.reviewBadge}>
                    Consider Removing
                  </span>
                </li>
                <li className={styles.reviewItem}>
                  <span className={styles.reviewName}>
                    Mushroom Soup
                  </span>
                  <span className={styles.reviewBadge}>
                    Low Margin
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
