import { defineStore } from 'pinia'
import { ref } from "vue";

export const useMenuStore = defineStore('menu', () => {
  const selectedCategory = ref('')

  function setSelectedCategory(val = '') {
    selectedCategory.value = val;
  }


  return { setSelectedCategory, selectedCategory }
}, { persist: true })