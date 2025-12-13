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
