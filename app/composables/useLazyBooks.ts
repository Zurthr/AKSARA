/**
 * Composable for lazy loading books with pagination
 * Uses json-server pagination with _page and _limit params
 */
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

export interface RawBook {
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
}

export interface Book {
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

const normalizeKey = (value: string | undefined | null): string => {
    return (value || '')
        .trim()
        .toLowerCase()
        .replace(/\s+/g, '-')
}

const mapRawBook = (book: RawBook): Book => {
    const tags = (book.tags || []).map((tag) => tag.name)

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

    if (book.copy_types) {
        Object.values(book.copy_types).forEach((copyTypeEntry) => {
            if (copyTypeEntry.sources) {
                sourceNames.push(...copyTypeEntry.sources.map((source) => source.name))
            }
        })
    }

    return {
        id: book.id,
        title: book.title,
        author: book.author,
        image: book.cover,
        tags,
        rating: book.rating,
        bookmarks: book.total_bookmarked,
        copyType,
        licensingType,
        sources: Array.from(new Set(sourceNames))
    }
}

export function useLazyBooks(pageSize: number = 12) {
    const books = ref<Book[]>([])
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
            const response = await $fetch<RawBook[]>(`http://localhost:3002/books`, {
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
                const mappedBooks = response.map(mapRawBook)
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
