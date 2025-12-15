import { ref, readonly, onMounted } from "vue"
import { normalizePaginatedCollection, type PaginatedCollection } from "~/utils/pagination"
import mockBooksData from "mockData/books.json"
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

export interface LiteratureBookUpdateData extends Partial<LiteratureBookCreateData> {}

export type LiteratureBooksResponse = PaginatedCollection<LiteratureBook>

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

// Helper function to normalize keys (for copy types, licensing, etc)
const normalizeKey = (value: string | undefined | null): string => {
  return (value || '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
}

// Helper function to map raw book to normalized format for UI
const resolveBookId = (book: LiteratureBook): number => {
  if (typeof book.id === "number" && Number.isFinite(book.id)) {
    return book.id
  }

  if (typeof book.id === "string") {
    const parsed = Number(book.id)
    if (Number.isFinite(parsed)) {
      return parsed
    }

    let hash = 0
    for (let index = 0; index < book.id.length; index += 1) {
      hash = (hash << 5) - hash + book.id.charCodeAt(index)
      hash |= 0
    }
    return Math.abs(hash)
  }

  return 0
}

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
    id: resolveBookId(book),
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

const fallbackBooks = Array.isArray(mockBooksData) ? (mockBooksData as LiteratureBook[]) : []

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

  const buildBooksQuery = (
    page: number,
    perPage: number,
    extraParams?: Record<string, unknown>
  ) => {
    const params = new URLSearchParams({
      page: String(page),
      per_page: String(perPage)
    })

    if (extraParams) {
      Object.entries(extraParams).forEach(([key, value]) => {
        if (value === undefined || value === null) {
          return
        }

        const stringValue = String(value)
        if (stringValue.trim() === "") {
          return
        }

        params.append(key, stringValue)
      })
    }

    return params.toString()
  }

  const getAllBooks = async (
    page: number = 1,
    perPage: number = 20,
    extraParams?: Record<string, unknown>
  ): Promise<LiteratureBooksResponse | null> => {
    setLoading(true)
    setError(null)

    try {
      const queryString = buildBooksQuery(page, perPage, extraParams)
      const response = await api.get<unknown>(`/literatures?${queryString}`)
      return normalizePaginatedCollection<LiteratureBook>(response)
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
      const response = await api.get<unknown>(`/books/search?${params.toString()}`)
      return normalizePaginatedCollection<LiteratureBook>(response)
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
 * Composable for lazy loading books with pagination against the Laravel backend
 *
 * @param pageSize - Number of books to load per page (default: 12)
 */
export function useLazyBooks(pageSize: number = 12) {
  const api = useApi()
  const books = ref<NormalizedBook[]>([])
  const isLoading = ref(false)
  const hasMore = ref(true)
  const currentPage = ref(0)
  const error = ref<Error | null>(null)

  const loadMore = async () => {
    if (isLoading.value || !hasMore.value) {
      return
    }

    isLoading.value = true
    error.value = null

    const nextPage = currentPage.value + 1

    try {
      const response = await api.get<unknown>(`/literatures?page=${nextPage}&per_page=${pageSize}`)
      const normalized = normalizePaginatedCollection<LiteratureBook>(response)
      const pageItems = normalized.data ?? []
      const enrichedItems = pageItems.map((book, index) => {
        const hasValidId = book.id !== undefined && book.id !== null && String(book.id).trim() !== ""
        if (hasValidId) {
          return book
        }

        const fallbackId = nextPage * 10000 + (index + 1)
        return { ...book, id: fallbackId }
      })
      const mappedBooks = enrichedItems.map(mapToNormalizedBook)

      if (nextPage === 1) {
        books.value = mappedBooks
      } else {
        books.value = [...books.value, ...mappedBooks]
      }

      currentPage.value = normalized.current_page || nextPage

      const explicitMore = normalized.current_page < normalized.last_page
      const assumeMore = !normalized.last_page && pageItems.length === pageSize
      const reachedEnd = pageItems.length === 0

      hasMore.value = !reachedEnd && (explicitMore || assumeMore)

      if (reachedEnd) {
        hasMore.value = false
      }
    } catch (err) {
      console.error("Failed to load books:", err)

      const fallbackStartIndex = (nextPage - 1) * pageSize
      const fallbackSlice = fallbackBooks.slice(fallbackStartIndex, fallbackStartIndex + pageSize)

      if (fallbackSlice.length > 0) {
        const mappedBooks = fallbackSlice.map(mapToNormalizedBook)

        if (nextPage === 1) {
          books.value = mappedBooks
        } else {
          books.value = [...books.value, ...mappedBooks]
        }

        currentPage.value = nextPage
        const consumed = fallbackStartIndex + fallbackSlice.length
        hasMore.value = consumed < fallbackBooks.length
        error.value = null
        return
      }

      error.value = err instanceof Error ? err : new Error("Failed to load books")
      hasMore.value = false
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

