import React from 'react';
import styles from '@/style/loading.module.css';

export default function Loading() {
  return (
    <div className={styles.container}>
      <div className={styles.spinnerWrapper}>
        <div className={styles.spinner} />
        <span className={styles.text}>Loading DineFlow...</span>
      </div>
    </div>
  );
}
