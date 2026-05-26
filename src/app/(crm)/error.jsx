"use client";

import React, { useEffect } from 'react';
import styles from '@/style/error.module.css';
import { AlertTriangle } from '@/lib/icons';

export default function Error({ error, reset }) {
  useEffect(() => {
    // Log the error to an analytics service
    console.error('DineFlow caught boundary error:', error);
  }, [error]);

  return (
    <div className={styles.container}>
      <div className={styles.errorCard}>
        <div className={styles.iconWrapper}>
          <AlertTriangle size={48} />
        </div>
        <h2 className={styles.title}>Something went wrong</h2>
        <p className={styles.description}>
          An error occurred while loading this section of the restaurant CRM. Please try refreshing or retrying.
        </p>
        <button
          className={styles.retryBtn}
          onClick={() => reset()}
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
