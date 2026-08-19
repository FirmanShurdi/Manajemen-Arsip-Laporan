import React from 'react';
import CustomSelect from '../common/CustomSelect';

export default function CategoryFilter({
  selectedCategory,
  onChange,
  onClear,
  categoryOptions = [],
  placeholder,
  defaultLabel = "Semua Kategori Utama",
  showIcon = true
}) {
  return (
    <CustomSelect
      value={selectedCategory}
      onChange={onChange}
      onClear={onClear}
      options={categoryOptions}
      getOptionId={(item) => item.id_kategori || item.id_arsip || item.id}
      getOptionLabel={(item) => item.nama_kategori || item.nama_arsip || item.nama}
      placeholder={placeholder}
      defaultLabel={defaultLabel}
      showIcon={showIcon}
      showSearch={true}
    />
  );
}
