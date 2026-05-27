"use client";

import React, { useState } from "react";
import styles from "@/style/menu.module.css";
import { Pencil, Trash2, Plus } from "@/lib/icons";
import MenuService from "@/services/MenuService";

const categories = [
  "All",
  "Starters",
  "Mains",
  "Breads",
  "Drinks",
  "Desserts",
  "Specials",
];

export default function Page() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const menuItemsQueryResult = MenuService.useMenuItems();
  const menuItems = menuItemsQueryResult.data || [];
  const isLoading = menuItemsQueryResult.isLoading;
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [itemToEdit, setItemToEdit] = useState(null);
  const [editForm, setEditForm] = useState({
    name: "",
    category: "",
    description: "",
    price: "",
    allergens: "",
  });
  const [addForm, setAddForm] = useState({
    name: "",
    category: "Starters",
    description: "",
    price: "",
    allergens: "",
  });

  const toggleActive = (id) => {
    MenuService.toggleActive(id);
  };

  const deleteItem = (id) => {
    MenuService.deleteItem(id);
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
      price: String(item.price),
      allergens: item.allergens.join(", "),
    });
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!itemToEdit) return;
    const numericPrice =
      parseFloat(editForm.price.replace(/[^\d.-]/g, "")) || 0;
    MenuService.updateItem(itemToEdit?.id, {
      name: editForm.name,
      category: editForm.category,
      description: editForm.description,
      price: numericPrice,
      allergens: editForm.allergens
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    });
    setItemToEdit(null);
  };

  const handleSaveNew = (e) => {
    e.preventDefault();
    const numericPrice = parseFloat(addForm.price.replace(/[^\d.-]/g, "")) || 0;
    MenuService.addItem({
      name: addForm.name,
      category: addForm.category,
      description: addForm.description,
      price: numericPrice,
      allergens: addForm.allergens
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    });
    setAddForm({
      name: "",
      category: "Starters",
      description: "",
      price: "",
      allergens: "",
    });
    setIsAddModalOpen(false);
  };

  const filteredItems =
    selectedCategory === "All"
      ? menuItems
      : menuItems.filter((item) => item.category === selectedCategory);

  return (
    <>
      {/* Main Content Wrapper */}
      <div className={styles.container}>
        {/* Page Canvas */}
        <main className={styles.content}>
          {/* Sub-nav */}
          <div className={styles.subNavContainer}>
            <div className={styles.subNavFlexWrapper}>
              <ul className={styles.subNavList}>
                {categories.map((cat) => {
                  const isActive = selectedCategory === cat;
                  return (
                    <li
                      key={cat}
                      className={
                        isActive ? styles.subNavItemActive : styles.subNavItem
                      }
                    >
                      <a
                        className={
                          isActive ? styles.subNavLinkActive : styles.subNavLink
                        }
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
              <button
                className={styles.addFoodBtn}
                onClick={() => setIsAddModalOpen(true)}
              >
                <Plus size={16} />
                <span>Create</span>
              </button>
            </div>
          </div>
          {/* Main Grid Area */}
          <div className={styles.gridArea}>
            {isLoading
              ? Array.from({ length: 6 }).map((_, idx) => (
                  <div key={idx} className={styles.cardLoading} />
                ))
              : filteredItems.map((item) => (
                  <div key={item.id} className={styles.card}>
                    <div className={styles.cardHeader}>
                      <span className={styles.categoryBadge}>
                        {item.category}
                      </span>
                      <div
                        className={`${styles.toggleSwitch} ${item.isActive ? styles.toggleActive : styles.toggleInactive}`}
                        onClick={() => toggleActive(item.id)}
                        style={{ cursor: "pointer" }}
                      >
                        <div
                          className={`${styles.toggleThumb} ${item.isActive ? styles.toggleThumbActive : styles.toggleThumbInactive}`}
                        />
                      </div>
                    </div>
                    <h3 className={styles.cardTitle}>{item.name}</h3>
                    <p className={styles.cardDescription}>{item.description}</p>
                    <div className={styles.allergenList}>
                      {item.allergens.map((allergen) => (
                        <span key={allergen} className={styles.allergenBadge}>
                          {allergen}
                        </span>
                      ))}
                    </div>
                    <div className={styles.cardFooter}>
                      <span className={styles.cardPrice}>₹{item.price}</span>
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
            {!isLoading && filteredItems.length === 0 && (
              <div
                style={{
                  gridColumn: "1 / -1",
                  textAlign: "center",
                  padding: "40px",
                  color: "#888",
                }}
              >
                No items found in this category.
              </div>
            )}
          </div>
          {/* Bottom Band */}
          <div className={styles.bottomBand}>
            {/* Left Column: Chart */}
            <div>
              <h4 className={styles.bandTitle}>Category Performance</h4>
              <div className={styles.chartContainer}>
                <div className={styles.chartRow}>
                  <span className={styles.chartLabel}>Mains</span>
                  <div className={styles.chartBarWrapper}>
                    <div
                      className={styles.chartBarFill}
                      style={{ width: "75%" }}
                    />
                  </div>
                  <span className={styles.chartValue}>75%</span>
                </div>
                <div className={styles.chartRow}>
                  <span className={styles.chartLabel}>Starters</span>
                  <div className={styles.chartBarWrapper}>
                    <div
                      className={styles.chartBarFill}
                      style={{ width: "50%" }}
                    />
                  </div>
                  <span className={styles.chartValue}>50%</span>
                </div>
                <div className={styles.chartRow}>
                  <span className={styles.chartLabel}>Desserts</span>
                  <div className={styles.chartBarWrapper}>
                    <div
                      className={styles.chartBarFill}
                      style={{ width: "33%" }}
                    />
                  </div>
                  <span className={styles.chartValue}>33%</span>
                </div>
              </div>
            </div>
            {/* Right Column: Review List */}
            <div>
              <h4 className={styles.bandTitle}>Items to Review</h4>
              <ul className={styles.reviewList}>
                <li className={styles.reviewItem}>
                  <span className={styles.reviewName}>Artichoke Dip</span>
                  <span className={styles.reviewBadge}>Consider Removing</span>
                </li>
                <li className={styles.reviewItem}>
                  <span className={styles.reviewName}>Mushroom Soup</span>
                  <span className={styles.reviewBadge}>Low Margin</span>
                </li>
              </ul>
            </div>
          </div>
        </main>
      </div>

      {/* Confirmation Modal */}
      {itemToDelete && (
        <div
          className={styles.modalOverlay}
          onClick={() => setItemToDelete(null)}
        >
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className={styles.modalTitle}>Delete Menu Item</h3>
            <p className={styles.modalDescription}>
              Are you sure you want to delete{" "}
              <strong>{itemToDelete.name}</strong> from the menu? This action
              cannot be undone.
            </p>
            <div className={styles.modalActions}>
              <button
                className={styles.modalCancelBtn}
                onClick={() => setItemToDelete(null)}
              >
                Cancel
              </button>
              <button className={styles.modalDeleteBtn} onClick={confirmDelete}>
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {itemToEdit && (
        <div
          className={styles.modalOverlay}
          onClick={() => setItemToEdit(null)}
        >
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className={styles.modalTitle}>Edit Menu Item</h3>
            <form onSubmit={handleSaveEdit}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Item Name</label>
                <input
                  type="text"
                  required
                  className={styles.formInput}
                  value={editForm.name}
                  onChange={(e) =>
                    setEditForm({ ...editForm, name: e.target.value })
                  }
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Category</label>
                <select
                  required
                  className={styles.formSelect}
                  value={editForm.category}
                  onChange={(e) =>
                    setEditForm({ ...editForm, category: e.target.value })
                  }
                >
                  {categories
                    .filter((c) => c !== "All")
                    .map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
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
                  onChange={(e) =>
                    setEditForm({ ...editForm, price: e.target.value })
                  }
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Description</label>
                <textarea
                  required
                  className={styles.formTextarea}
                  value={editForm.description}
                  onChange={(e) =>
                    setEditForm({ ...editForm, description: e.target.value })
                  }
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>
                  Allergens (comma separated)
                </label>
                <input
                  type="text"
                  className={styles.formInput}
                  value={editForm.allergens}
                  onChange={(e) =>
                    setEditForm({ ...editForm, allergens: e.target.value })
                  }
                  placeholder="e.g. Dairy, Gluten, Nuts"
                />
              </div>
              <div
                className={styles.modalActions}
                style={{ marginTop: "24px" }}
              >
                <button
                  type="button"
                  className={styles.modalCancelBtn}
                  onClick={() => setItemToEdit(null)}
                >
                  Cancel
                </button>
                <button type="submit" className={styles.modalSaveBtn}>
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Modal */}
      {isAddModalOpen && (
        <div
          className={styles.modalOverlay}
          onClick={() => setIsAddModalOpen(false)}
        >
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className={styles.modalTitle}>Add Menu Item</h3>
            <form onSubmit={handleSaveNew}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Item Name</label>
                <input
                  type="text"
                  required
                  className={styles.formInput}
                  value={addForm.name}
                  onChange={(e) =>
                    setAddForm({ ...addForm, name: e.target.value })
                  }
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Category</label>
                <select
                  required
                  className={styles.formSelect}
                  value={addForm.category}
                  onChange={(e) =>
                    setAddForm({ ...addForm, category: e.target.value })
                  }
                >
                  {categories
                    .filter((c) => c !== "All")
                    .map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                </select>
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Price</label>
                <input
                  type="text"
                  required
                  className={styles.formInput}
                  value={addForm.price}
                  onChange={(e) =>
                    setAddForm({ ...addForm, price: e.target.value })
                  }
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Description</label>
                <textarea
                  required
                  className={styles.formTextarea}
                  value={addForm.description}
                  onChange={(e) =>
                    setAddForm({ ...addForm, description: e.target.value })
                  }
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>
                  Allergens (comma separated)
                </label>
                <input
                  type="text"
                  className={styles.formInput}
                  value={addForm.allergens}
                  onChange={(e) =>
                    setAddForm({ ...addForm, allergens: e.target.value })
                  }
                  placeholder="e.g. Dairy, Gluten, Nuts"
                />
              </div>
              <div
                className={styles.modalActions}
                style={{ marginTop: "24px" }}
              >
                <button
                  type="button"
                  className={styles.modalCancelBtn}
                  onClick={() => setIsAddModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className={styles.modalSaveBtn}>
                  Add Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
