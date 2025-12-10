import { ref, readonly } from 'vue'
import { useApi } from './useApi'

// TypeScript interfaces for Books API
export interface Book {
  id: number
  title: string
  author?: string
  cover: string
  rating?: number
  description?: string
  year_edition?: string
  total_bookmarked?: number
  tags?: BookTag[]
  copy_types?: Record<string, CopyType>
  licensing_type?: string
  sources?: BookSource[]
  created_at?: string
  updated_at?: string
}

export interface BookTag {
  name: string
  type?: string
}

export interface BookSource {
  name: string
  url: string
}

export interface CopyTypeSource {
  name: string
  url: string
  type?: string
  shipping_available?: boolean
}

export interface CopyType {
  description: string
  sources?: CopyTypeSource[]
}

export interface BooksResponse {
  data: Book[]
  current_page?: number
  last_page?: number
  per_page?: number
  total?: number
}

export interface BookCreateData {
  title: string
  author?: string
  cover: string
  rating?: number
  description?: string
  year_edition?: string
  total_bookmarked?: number
  tags?: BookTag[]
  copy_types?: Record<string, CopyType>
  licensing_type?: string
  sources?: BookSource[]
}

export interface BookUpdateData extends Partial<BookCreateData> {}

// Books API composable
export const useBooks = () => {
  const api = useApi()
  const loading = ref(false)
  const error = ref<string | null>(null)
  
  const setLoading = (value: boolean) => {
    loading.value = value
  }
  
  const setError = (err: string | null) => {
    error.value = err
  }
  
  const getAllBooks = async (page: number = 1, perPage: number = 50): Promise<BooksResponse | null> => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await api.get<BooksResponse>(`/literatures?page=${page}&per_page=${perPage}`)
      return response
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch books')
      return null
    } finally {
      setLoading(false)
    }
  }
  
  const getBookById = async (id: number): Promise<Book | null> => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await api.get<unknown>(`/literatures/${id}`)

      if (!response) {
        return null
      }

      if (typeof response === 'object') {
        const payload = response as Record<string, unknown>

        if (payload.data && typeof payload.data === 'object') {
          return payload.data as Book
        }

        if (payload.book && typeof payload.book === 'object') {
          return payload.book as Book
        }
      }

      return response as Book
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch book')
      return null
    } finally {
      setLoading(false)
    }
  }
  
  const createBook = async (bookData: BookCreateData): Promise<Book | null> => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await api.post<{ data: Book }>('/literatures', bookData)
      return response.data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create book')
      return null
    } finally {
      setLoading(false)
    }
  }
  
  const updateBook = async (id: number, bookData: BookUpdateData): Promise<Book | null> => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await api.put<{ data: Book }>(`/literatures/${id}`, bookData)
      return response.data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update book')
      return null
    } finally {
      setLoading(false)
    }
  }
  
  const deleteBook = async (id: number): Promise<boolean> => {
    setLoading(true)
    setError(null)
    
    try {
      await api.delete(`/literatures/${id}`)
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete book')
      return false
    } finally {
      setLoading(false)
    }
  }
  
  return {
    loading: readonly(loading),
    error: readonly(error),
    getAllBooks,
    getBookById,
    createBook,
    updateBook,
    deleteBook
  }
}