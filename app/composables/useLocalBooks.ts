// Composable untuk book/literature manual berbasis localStorage
import { ref } from 'vue'

export const LOCAL_BOOKS_STORAGE_KEY = 'aksara_local_books_v1'

export function useLocalBooks() {
  const localBooks = ref(readLocalBooks())

  function readLocalBooks() {
    try {
      const raw = localStorage.getItem(LOCAL_BOOKS_STORAGE_KEY)
      if (!raw) return []
      return JSON.parse(raw)
    } catch {
      return []
    }
  }

  function saveLocalBooks(books: any[]) {
    localStorage.setItem(LOCAL_BOOKS_STORAGE_KEY, JSON.stringify(books))
    localBooks.value = books
  }

  function addLocalBook(book: any) {
    const books = readLocalBooks()
    books.push(book)
    saveLocalBooks(books)
  }

  function clearLocalBooks() {
    saveLocalBooks([])
  }

  return {
    localBooks,
    readLocalBooks,
    saveLocalBooks,
    addLocalBook,
    clearLocalBooks
  }
}