/**
 * Composable for lazy loading forum posts with pagination
 * Uses json-server pagination with _page and _limit params
 */
export interface PostAuthor {
    name: string
    avatar: string
    tagline: string
    badge?: string
}

export interface PostTag {
    label: string
    type: 'category' | 'topic'
}

export interface Post {
    id: number
    author: PostAuthor
    timeAgo: string
    title: string
    content: string
    tags: PostTag[]
    stars: number
    community_id?: string
    created_at?: string
    updated_at?: string
}

export function useLazyPosts(pageSize: number = 10) {
    const posts = ref<Post[]>([])
    const isLoading = ref(false)
    const hasMore = ref(true)
    const currentPage = ref(0)
    const error = ref<Error | null>(null)
    const currentSearchQuery = ref('')
    const contentApiBase = useContentApiBase()

    const loadMore = async () => {
        if (isLoading.value || !hasMore.value) return

        isLoading.value = true
        error.value = null
        currentPage.value++

        try {
            const params: any = {
                _page: currentPage.value,
                _limit: pageSize
            }

            if (currentSearchQuery.value) {
                params.q = currentSearchQuery.value
            }

            const response = await $fetch<Post[]>(`${contentApiBase}/posts`, {
                params
            })

            if (response.length < pageSize) {
                hasMore.value = false
            }

            if (response.length === 0) {
                // If it's the first page and no results, we still want to indicate "no more"
                if (currentPage.value === 1) {
                    posts.value = []
                }
                hasMore.value = false
            } else {
                if (currentPage.value === 1) {
                    posts.value = response
                } else {
                    posts.value = [...posts.value, ...response]
                }
            }
        } catch (e) {
            error.value = e as Error
            console.error('Error loading posts:', e)
        } finally {
            isLoading.value = false
        }
    }

    const reset = () => {
        posts.value = []
        currentPage.value = 0
        hasMore.value = true
        error.value = null
    }

    const search = (query: string) => {
        currentSearchQuery.value = query
        reset()
        loadMore()
    }



    return {
        posts,
        isLoading,
        hasMore,
        error,
        loadMore,
        reset,
        search,
        currentSearchQuery
    }
}
