import { ref, readonly } from "vue"
import { useApi } from "./useApi"

export interface LiteratureBook {
  id: number | string
  title: string
  author?: string
  description?: string
  cover?: string
  image_url?: string
  rating?: number
  year_edition?: string | number
  total_bookmarked?: number
  tags?: Array<{ name: string; type?: string }> | string[]
  copy_types?: Record<string, unknown>
  licensing_type?: string
  sources?: Array<{ name: string; url: string }>
  access_links?: Array<{ platform: string; url: string; type: string }>
  created_at?: string
  updated_at?: string
  [key: string]: unknown
}

// Normalized book interface for UI consumption (used by lazy loading)
export interface NormalizedBook {
  id: number
  title: string
  author?: string
  image: string
  tags: string[]
  rating?: number
  bookmarks?: number
  copyType?: string[]
  licensingType?: string[]
  sources?: string[]
}

export interface LiteratureBookCreateData {
  title: string
  author?: string
  description?: string
  cover?: string
  rating?: number
  year_edition?: string | number
  tags?: Array<{ name: string; type?: string }> | string[]
  copy_types?: Record<string, unknown>
  licensing_type?: string
  sources?: Array<{ name: string; url: string }>
}

export interface LiteratureBookUpdateData extends Partial<LiteratureBookCreateData> { }

export interface LiteratureBooksResponse {
  status?: boolean
  message?: string
  data: {
    data: LiteratureBook[]
    current_page?: number
    last_page?: number
    per_page?: number
    total?: number
    links?: {
      first?: string
      last?: string
      prev?: string | null
      next?: string | null
    }
    meta?: {
      current_page?: number
      from?: number
      last_page?: number
      path?: string
      per_page?: number
      to?: number
      total?: number
    }
  }
}

// Helper function to normalize keys (for copy types, licensing, etc)
const normalizeKey = (value: string | undefined | null): string => {
  return (value || '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
}

// Helper function to map raw book to normalized format for UI
export const mapToNormalizedBook = (book: LiteratureBook): NormalizedBook => {
  // Handle tags - can be string[] or Array<{name: string}>
  const tags: string[] = (book.tags || []).map((tag) =>
    typeof tag === 'string' ? tag : tag.name
  )

  // Handle copy_types
  const copyType = book.copy_types
    ? Object.keys(book.copy_types).map((key) => normalizeKey(key)).filter(Boolean)
    : []

  const licensingType = book.licensing_type
    ? [normalizeKey(book.licensing_type)]
    : []

  const sourceNames: string[] = []

  if (book.sources) {
    sourceNames.push(...book.sources.map((source) => source.name))
  }

  // Handle copy_types sources with proper type checking
  if (book.copy_types) {
    Object.values(book.copy_types).forEach((copyTypeEntry) => {
      const entry = copyTypeEntry as { sources?: Array<{ name: string }> }
      if (entry.sources) {
        sourceNames.push(...entry.sources.map((source) => source.name))
      }
    })
  }

  return {
    id: typeof book.id === 'string' ? parseInt(book.id) || 0 : (book.id as number),
    title: book.title,
    author: book.author,
    image: book.cover || book.image_url || '',
    tags,
    rating: book.rating,
    bookmarks: book.total_bookmarked,
    copyType,
    licensingType,
    sources: Array.from(new Set(sourceNames))
  }
}

// Main composable for literature/books API operations
export const useLiterature = () => {
  const api = useApi()
  const loading = ref(false)
  const error = ref<string | null>(null)

  const setLoading = (value: boolean) => {
    loading.value = value
  }

  const setError = (err: string | null) => {
    error.value = err
  }

  const getAllBooks = async (page: number = 1, perPage: number = 20): Promise<LiteratureBooksResponse | null> => {
    setLoading(true)
    setError(null)

    try {
      const response = await api.get<LiteratureBooksResponse>(`/literatures?page=${page}&per_page=${perPage}`)
      return response
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Failed to fetch books"
      setError(errorMsg)
      return null
    } finally {
      setLoading(false)
    }
  }

  const getBookById = async (id: number | string): Promise<LiteratureBook | null> => {
    setLoading(true)
    setError(null)

    try {
      const encodedId = encodeURIComponent(String(id))
      const response = await api.get<{ data: LiteratureBook }>(`/literatures/${encodedId}`)
      return response.data
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Failed to fetch book"
      setError(errorMsg)
      return null
    } finally {
      setLoading(false)
    }
  }

  const searchBooks = async (query: string, filters?: Record<string, unknown>): Promise<LiteratureBooksResponse | null> => {
    setLoading(true)
    setError(null)

    try {
      const params = new URLSearchParams({ q: query })
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== null && value !== undefined && value !== "") {
            params.append(key, String(value))
          }
        })
      }
      const response = await api.get<LiteratureBooksResponse>(`/books/search?${params.toString()}`)
      return response
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to search books")
      return null
    } finally {
      setLoading(false)
    }
  }

  const createBook = async (bookData: LiteratureBookCreateData): Promise<LiteratureBook | null> => {
    setLoading(true)
    setError(null)

    try {
      const response = await api.post<{ data: LiteratureBook }>("/books", bookData)
      return response.data
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create book")
      return null
    } finally {
      setLoading(false)
    }
  }

  const updateBook = async (id: number | string, bookData: LiteratureBookUpdateData): Promise<LiteratureBook | null> => {
    setLoading(true)
    setError(null)

    try {
      const encodedId = encodeURIComponent(String(id))
      const response = await api.put<{ data: LiteratureBook }>(`/books/${encodedId}`, bookData)
      return response.data
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update book")
      return null
    } finally {
      setLoading(false)
    }
  }

  const deleteBook = async (id: number | string): Promise<boolean> => {
    setLoading(true)
    setError(null)

    try {
      const encodedId = encodeURIComponent(String(id))
      await api.delete(`/books/${encodedId}`)
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete book")
      return false
    } finally {
      setLoading(false)
    }
  }

  const clearError = () => {
    setError(null)
  }

  return {
    loading: readonly(loading),
    error: readonly(error),
    getAllBooks,
    getBookById,
    searchBooks,
    createBook,
    updateBook,
    deleteBook,
    clearError
  }
}

/**
 * Composable for lazy loading books with pagination
 * Uses json-server pagination with _page and _limit params
 * 
 * @param pageSize - Number of books to load per page (default: 12)
 */
export function useLazyBooks(pageSize: number = 12) {
  const books = ref<NormalizedBook[]>([])
  const isLoading = ref(false)
  const hasMore = ref(true)
  const currentPage = ref(0)
  const error = ref<Error | null>(null)

  const loadMore = async () => {
    if (isLoading.value || !hasMore.value) return

    isLoading.value = true
    error.value = null
    currentPage.value++

    try {
      const response = await $fetch<LiteratureBook[]>(`http://localhost:3002/books`, {
        params: {
          _page: currentPage.value,
          _limit: pageSize
        }
      })

      if (response.length < pageSize) {
        hasMore.value = false
      }

      if (response.length === 0) {
        hasMore.value = false
      } else {
        const mappedBooks = response.map(mapToNormalizedBook)
        books.value = [...books.value, ...mappedBooks]
      }
    } catch (e) {
      error.value = e as Error
      console.error('Error loading books:', e)
    } finally {
      isLoading.value = false
    }
  }

  const reset = () => {
    books.value = []
    currentPage.value = 0
    hasMore.value = true
    error.value = null
  }

  // Load initial batch on mount
  onMounted(() => {
    loadMore()
  })

  return {
    books,
    isLoading,
    hasMore,
    error,
    loadMore,
    reset
  }
}

