import { useState, useCallback } from 'react';

export function useCrudModal() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [deleteItem, setDeleteItem] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const openAdd = useCallback(() => {
    setEditingItem(null);
    setIsModalOpen(true);
  }, []);

  const openEdit = useCallback((item) => {
    setEditingItem(item);
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setEditingItem(null);
  }, []);

  const promptDelete = useCallback((item) => {
    setDeleteItem(item);
  }, []);

  const cancelDelete = useCallback(() => {
    setDeleteItem(null);
    setDeleting(false);
  }, []);

  return {
    isModalOpen,
    editingItem,
    deleteItem,
    deleting,
    setDeleting,
    openAdd,
    openEdit,
    closeModal,
    promptDelete,
    cancelDelete
  };
}
