// guardar o texto da busca

import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useSearchStore = defineStore('search', () => {
    const searchText = ref('')

    function updateSearchText(newText){
        searchText.value = newText
    }

    return { searchText, updateSearchText }
})