import { defineStore } from 'pinia'
import { ref } from "vue";

export const useMenuStore = defineStore('menu', () => {
  const selectedCategory = ref('')
  const isImportExportActive = ref(false)

  function setSelectedCategory(val = '') {
    isImportExportActive.value = false
    if (val == 'export/import') { isImportExportActive.value = true }

    selectedCategory.value = val;
  }


  return { setSelectedCategory, selectedCategory, isImportExportActive }
}, { persist: true })
