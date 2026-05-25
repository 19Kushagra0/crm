"use client";

import React, { useState } from 'react';
import styles from '@/style/menu.module.css';
import { Pencil, Trash2 } from '@/lib/icons';

const initialMenuItems = [
  {
    id: 1,
    name: "Truffle Risotto",
    category: "Mains",
    description: "Arborio rice slow-cooked in wild mushroom broth, finished with aged parmesan and shaved black truffle.",
    allergens: ["Dairy", "Gluten"],
    price: "₹850",
    isActive: true,
  },
  {
    id: 2,
    name: "Burrata Heirloom",
    category: "Starters",
    description: "Fresh Puglia burrata served with heritage tomatoes, basil oil, and aged balsamic reduction.",
    allergens: ["Dairy"],
    price: "₹650",
    isActive: false,
  },
  {
    id: 3,
    name: "Seared Scallops",
    category: "Mains",
    description: "Hokkaido scallops pan-seared, served atop cauliflower purée with caper and raisin dressing.",
    allergens: ["Shellfish"],
    price: "₹1200",
    isActive: true,
  }
];

const categories = ['All', 'Starters', 'Mains', 'Breads', 'Drinks', 'Desserts', 'Specials'];

export default function Page() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [menuItems, setMenuItems] = useState(initialMenuItems);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [itemToEdit, setItemToEdit] = useState(null);
  const [editForm, setEditForm] = useState({
    name: '',
    category: '',
    description: '',
    price: '',
    allergens: ''
  });

  const toggleActive = (id) => {
    setMenuItems(prev =>
      prev.map(item => item.id === id ? { ...item, isActive: !item.isActive } : item)
    );
  };

  const deleteItem = (id) => {
    setMenuItems(prev => prev.filter(item => item.id !== id));
  };

  const confirmDelete = () => {
    if (itemToDelete) {
      deleteItem(itemToDelete.id);
      setItemToDelete(null);
    }
  };

  const handleOpenEditModal = (item) => {
    setItemToEdit(item);
    setEditForm({
      name: item.name,
      category: item.category,
      description: item.description,
      price: item.price,
      allergens: item.allergens.join(', '),
    });
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    setMenuItems(prev =>
      prev.map(item =>
        item.id === itemToEdit.id
          ? {
              ...item,
              name: editForm.name,
              category: editForm.category,
              description: editForm.description,
              price: editForm.price,
              allergens: editForm.allergens.split(',').map(s => s.trim()).filter(Boolean),
            }
          : item
      )
    );
    setItemToEdit(null);
  };

  const filteredItems = selectedCategory === 'All'
    ? menuItems
    : menuItems.filter(item => item.category === selectedCategory);

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

          {/* Sub-nav */}
          <div className={styles.subNavContainer}>
            <ul className={styles.subNavList}>
              {categories.map((cat) => {
                const isActive = selectedCategory === cat;
                return (
                  <li
                    key={cat}
                    className={isActive ? styles.subNavItemActive : styles.subNavItem}
                  >
                    <a
                      className={isActive ? styles.subNavLinkActive : styles.subNavLink}
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        setSelectedCategory(cat);
                      }}
                    >
                      {cat}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
          {/* Main Grid Area */}
          <div className={styles.gridArea}>
            {filteredItems.map((item) => (
              <div key={item.id} className={styles.card}>
                <div className={styles.cardHeader}>
                  <span className={styles.categoryBadge}>
                    {item.category}
                  </span>
                  <div
                    className={`${styles.toggleSwitch} ${item.isActive ? styles.toggleActive : styles.toggleInactive}`}
                    onClick={() => toggleActive(item.id)}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className={`${styles.toggleThumb} ${item.isActive ? styles.toggleThumbActive : styles.toggleThumbInactive}`} />
                  </div>
                </div>
                <h3 className={styles.cardTitle}>
                  {item.name}
                </h3>
                <p className={styles.cardDescription}>
                  {item.description}
                </p>
                <div className={styles.allergenList}>
                  {item.allergens.map((allergen) => (
                    <span key={allergen} className={styles.allergenBadge}>
                      {allergen}
                    </span>
                  ))}
                </div>
                <div className={styles.cardFooter}>
                  <span className={styles.cardPrice}>{item.price}</span>
                  <div className={styles.cardActions}>
                    <button 
                      className={styles.actionBtn}
                      onClick={() => handleOpenEditModal(item)}
                      aria-label="Edit Menu Item"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      className={`${styles.actionBtn} ${styles.deleteBtn}`}
                      onClick={() => setItemToDelete(item)}
                      aria-label="Delete Menu Item"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {filteredItems.length === 0 && (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', color: '#888' }}>
                No items found in this category.
              </div>
            )}
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

      {/* Confirmation Modal */}
      {itemToDelete && (
        <div className={styles.modalOverlay} onClick={() => setItemToDelete(null)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h3 className={styles.modalTitle}>Delete Menu Item</h3>
            <p className={styles.modalDescription}>
              Are you sure you want to delete <strong>{itemToDelete.name}</strong> from the menu? This action cannot be undone.
            </p>
            <div className={styles.modalActions}>
              <button 
                className={styles.modalCancelBtn} 
                onClick={() => setItemToDelete(null)}
              >
                Cancel
              </button>
              <button 
                className={styles.modalDeleteBtn} 
                onClick={confirmDelete}
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {itemToEdit && (
        <div className={styles.modalOverlay} onClick={() => setItemToEdit(null)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h3 className={styles.modalTitle}>Edit Menu Item</h3>
            <form onSubmit={handleSaveEdit}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Item Name</label>
                <input
                  type="text"
                  required
                  className={styles.formInput}
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Category</label>
                <select
                  required
                  className={styles.formSelect}
                  value={editForm.category}
                  onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                >
                  {categories.filter(c => c !== 'All').map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Price</label>
                <input
                  type="text"
                  required
                  className={styles.formInput}
                  value={editForm.price}
                  onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Description</label>
                <textarea
                  required
                  className={styles.formTextarea}
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Allergens (comma separated)</label>
                <input
                  type="text"
                  className={styles.formInput}
                  value={editForm.allergens}
                  onChange={(e) => setEditForm({ ...editForm, allergens: e.target.value })}
                  placeholder="e.g. Dairy, Gluten, Nuts"
                />
              </div>
              <div className={styles.modalActions} style={{ marginTop: '24px' }}>
                <button 
                  type="button"
                  className={styles.modalCancelBtn} 
                  onClick={() => setItemToEdit(null)}
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className={styles.modalSaveBtn}
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
