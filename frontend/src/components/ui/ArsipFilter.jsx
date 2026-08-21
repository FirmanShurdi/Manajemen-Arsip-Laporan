import React from 'react';
import CustomSelect from '../common/CustomSelect';

export default function ArsipFilter({
  selectedArsip,
  onChange,
  onClear,
  arsipOptions = [],
  selectedCategory = '',
  placeholder,
  defaultLabel = "Semua Nama Arsip",
  showIcon = true
}) {
  // Filter arsipOptions berdasarkan Kategori Utama (selectedCategory) jika dipilih
  const filteredOptions = React.useMemo(() => {
    if (!selectedCategory) return arsipOptions;
    return arsipOptions.filter(item => {
      const parentId = item.id_kategori;
      const parentName = typeof item.kategori_arsip === 'object' ? item.kategori_arsip?.nama_kategori : item.kategori_arsip;
      return String(parentId) === String(selectedCategory) || String(parentName) === String(selectedCategory);
    });
  }, [arsipOptions, selectedCategory]);

  return (
    <CustomSelect
      value={selectedArsip}
      onChange={onChange}
      onClear={onClear}
      options={filteredOptions}
      getOptionId={(item) => item.id_arsip || item.id}
      getOptionLabel={(item) => item.nama_arsip || item.nama_kategori || item.nama}
      placeholder={placeholder}
      defaultLabel={defaultLabel}
      showIcon={showIcon}
      showSearch={true}
    />
  );
}
