'use client';

import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import styles from '@/style/login.module.css';

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState('19kushagra0@gmail.com');
  const [password, setPassword] = useState('asdasdasd');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        setError('Invalid email or password. Please try again.');
        setLoading(false);
      } else {
        router.refresh();
        router.push('/dashboard');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className={styles.pageContainer}>
      {/* Elegant Left Brand Panel */}
      <div className={styles.brandPanel}>
        <div className={styles.brandLogoSection}>
          <span className={styles.brandLogoText}>DineFlow</span>
          <span className={styles.brandTagline}>Michelin Operations</span>
        </div>
        
        <div className={styles.brandHeroSection}>
          <h2 className={styles.brandQuote}>
            "Service is not a transaction, it is a choreography."
          </h2>
          <p className={styles.brandParagraph}>
            Welcome to DineFlow. Powering high-performance kitchens, premium guest relations, 
            and seamless dining choreographies worldwide.
          </p>
        </div>

        <div className={styles.brandFooter}>
          &copy; {new Date().getFullYear()} DineFlow CRM. All rights reserved.
        </div>
      </div>

      {/* Right Form Panel */}
      <div className={styles.formPanel}>
        <div className={styles.formCard}>
          <div className={styles.cardHeader}>
            <h1 className={styles.cardTitle}>Sign In</h1>
            <p className={styles.cardSubtitle}>Access your operational suite</p>
          </div>

          <div className={styles.testCredentialsBox}>
            <div className={styles.testCredentialsTitle}>Test Credentials</div>
            <div className={styles.testCredentialsText}>Email: 19kushagra0@gmail.com</div>
            <div className={styles.testCredentialsText}>Pass: asdasdasd</div>
          </div>

          {error && (
            <div className={styles.errorBanner}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="6" x2="12.01" y2="6"></line>
              </svg>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className={styles.inputGroup}>
              <label htmlFor="email" className={styles.label}>Email Address</label>
              <div className={styles.inputWrapper}>
                <input
                  id="email"
                  type="email"
                  required
                  autoComplete="email"
                  className={styles.input}
                  placeholder="name@restaurant.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="password" className={styles.label}>Password</label>
              <div className={styles.inputWrapper}>
                <input
                  id="password"
                  type="password"
                  required
                  autoComplete="current-password"
                  className={styles.input}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>

            <button 
              type="submit" 
              className={`${styles.signInBtn} ${loading ? styles.signInBtnLoading : ''}`}
              disabled={loading}
            >
              {loading ? 'Verifying...' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
