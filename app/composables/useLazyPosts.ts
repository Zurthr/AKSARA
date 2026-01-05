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
    id: number | string
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

type PostsListItem = Post & {
    author?: {
        name?: string
        avatar?: string
        tagline?: string
        badge?: string
    }
    tags?: Array<{ label?: string; type?: 'category' | 'topic' }> | Array<string>
}

const ensureString = (value: unknown, fallback: string = '') => {
    return typeof value === 'string' ? value : fallback
}

const normalizeListPost = (item: PostsListItem): Post => {
    const authorName = ensureString(item.author?.name, 'Unknown')
    const authorAvatar = ensureString(item.author?.avatar, 'https://i.pravatar.cc/150?u=aksara')
    const authorTagline = ensureString(item.author?.tagline, 'Community')
    const tagList = Array.isArray(item.tags)
        ? item.tags.map((tag) => {
            if (typeof tag === 'string') {
                return { label: tag, type: 'topic' as const }
            }
            return {
                label: ensureString(tag.label, 'general'),
                type: tag.type || 'topic'
            }
        })
        : []

    return {
        id: item.id,
        author: {
            name: authorName,
            avatar: authorAvatar,
            tagline: authorTagline,
            badge: item.author?.badge
        },
        timeAgo: ensureString(item.timeAgo, ''),
        title: ensureString(item.title, ''),
        content: ensureString(item.content, ''),
        tags: tagList,
        stars: typeof item.stars === 'number' ? item.stars : 0,
        community_id: item.community_id,
        created_at: item.created_at,
        updated_at: item.updated_at
    }
}

export function useLazyPosts(pageSize: number = 10) {
    const posts = ref<Post[]>([])
    const isLoading = ref(false)
    const hasMore = ref(true)
    const currentPage = ref(0)
    const error = ref<Error | null>(null)
    const currentSearchQuery = ref('')
    const contentApiBase = useContentApiBase()
    const { fetchRecommendations } = useRecommendations()
    const runtimeConfig = useRuntimeConfig()
    const recommendationsLoaded = ref(false)

    type ThreadResponse = {
        success?: boolean
        data: {
            id: string
            title: string
            content: string
            communityId?: string
            createdAt?: string
            updatedAt?: string
            stars?: number
            community?: {
                id: string
                name: string
            }
            author?: {
                id: string
                email?: string
                profile?: {
                    displayName?: string
                    avatarUrl?: string | null
                }
            }
        }
    }

    const formatTimeAgo = (value?: string) => {
        if (!value) return 'just now'
        const date = new Date(value)
        if (Number.isNaN(date.getTime())) return 'just now'

        const diffMs = Date.now() - date.getTime()
        const diffMinutes = Math.floor(diffMs / 60000)
        const diffHours = Math.floor(diffMinutes / 60)
        const diffDays = Math.floor(diffHours / 24)

        if (diffMinutes < 1) return 'just now'
        if (diffMinutes < 60) return `${diffMinutes} min ago`
        if (diffHours < 24) return `${diffHours} hr ago`
        return `${diffDays} d ago`
    }

    const resolveAuthorName = (author?: ThreadResponse['data']['author']) => {
        return author?.profile?.displayName || author?.email || 'Unknown'
    }

    const resolveAvatar = (author?: ThreadResponse['data']['author']) => {
        if (author?.profile?.avatarUrl) return author.profile.avatarUrl
        return `https://i.pravatar.cc/150?u=${author?.id || 'aksara'}`
    }

    const mapThreadToPost = (thread: ThreadResponse['data']): Post => {
        return {
            id: thread.id,
            author: {
                name: resolveAuthorName(thread.author),
                avatar: resolveAvatar(thread.author),
                tagline: thread.community?.name || 'Community'
            },
            timeAgo: formatTimeAgo(thread.createdAt),
            title: thread.title,
            content: thread.content,
            tags: thread.community?.name
                ? [{ label: thread.community.name, type: 'topic' }]
                : [],
            stars: thread.stars || 0,
            community_id: thread.communityId,
            created_at: thread.createdAt,
            updated_at: thread.updatedAt
        }
    }

    const fetchRecommendedPosts = async () => {
        if (recommendationsLoaded.value) return []
        recommendationsLoaded.value = true
        const baseUrl = runtimeConfig.public.apiBaseUrl

        try {
            const items = await fetchRecommendations('post', 6)
            if (!items.length) return []

            const details = await Promise.all(
                items.map(item =>
                    $fetch<ThreadResponse>(`${baseUrl}/threads/${item.id}`)
                        .then(detail => detail?.data ? mapThreadToPost(detail.data) : null)
                        .catch(() => null)
                )
            )

            return details.filter(Boolean) as Post[]
        } catch (err) {
            console.error('Failed to load recommended posts:', err)
            return []
        }
    }

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

            if (currentPage.value === 1) {
                const recommended = await fetchRecommendedPosts()
                if (recommended.length) {
                    posts.value = [...recommended]
                }
            }

            const response = await $fetch<Post[] | { data?: Post[] }>(`${contentApiBase}/posts`, {
                params
            })

            const responseItems = Array.isArray(response)
                ? response
                : Array.isArray(response.data)
                    ? response.data
                    : []

            const normalizedItems = responseItems.map((item) => normalizeListPost(item as PostsListItem))

            const filteredResponse = normalizedItems.filter((item) => {
                return !posts.value.some(existing => String(existing.id) === String(item.id))
            })

            if (filteredResponse.length < pageSize) {
                hasMore.value = false
            }

            if (filteredResponse.length === 0) {
                // If it's the first page and no results, we still want to indicate "no more"
                if (currentPage.value === 1) {
                    if (!posts.value.length) {
                        posts.value = []
                    }
                }
                hasMore.value = false
            } else {
                if (currentPage.value === 1) {
                    if (posts.value.length) {
                        posts.value = [...posts.value, ...filteredResponse]
                    } else {
                        posts.value = filteredResponse
                    }
                } else {
                    posts.value = [...posts.value, ...filteredResponse]
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
