import { ref } from 'vue'

export interface LiteratureBook {
  id: string
  title: string
  author: string
  description?: string
}

export const useLiterature = () => {
  const books = ref<LiteratureBook[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  return {
    books,
    isLoading,
    error
  }
}
