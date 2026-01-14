/**
 * Click Events Tracking Composable
 * Tracks user interactions for curation algorithm (local storage only).
 */

export interface ClickEvent {
    id?: number
    event_type: 'book_click' | 'post_click' | 'community_click' | 'event_click' | 'search_query' | 'community_join'
    item_id: number | string
    item_title: string
    item_tags?: string[]
    user_id: string
    timestamp: string
    source_page: string
    metadata?: Record<string, unknown>
}

// Session ID key in localStorage
const SESSION_ID_KEY = 'aksara_session_id'
const RECENT_EVENTS_KEY = 'aksara_recent_events'
const MAX_RECENT_EVENTS = 25

/**
 * Generate or retrieve anonymous session ID
 */
function getSessionId(): string {
    if (typeof window === 'undefined') {
        return 'ssr_' + Date.now()
    }

    let sessionId = localStorage.getItem(SESSION_ID_KEY)

    if (!sessionId) {
        // Generate new anonymous session ID
        sessionId = 'anon_' + Date.now() + '_' + Math.random().toString(36).substring(2, 11)
        localStorage.setItem(SESSION_ID_KEY, sessionId)
    }

    return sessionId
}

/**
 * Get current page path
 */
function getCurrentPage(): string {
    if (typeof window === 'undefined') {
        return '/'
    }
    return window.location.pathname
}

type RecommendationEvent = {
    event_type: string
    item_id: string | number
    item_type: 'post' | 'book' | 'event' | 'community'
    timestamp: string
}

const storeRecentEvent = (eventType: RecommendationEvent['event_type'], itemId: string | number, itemType: RecommendationEvent['item_type']) => {
    if (typeof window === 'undefined') return

    const recentRaw = localStorage.getItem(RECENT_EVENTS_KEY)
    const recent = recentRaw ? JSON.parse(recentRaw) as RecommendationEvent[] : []
    const entry: RecommendationEvent = {
        event_type: eventType,
        item_id: itemId,
        item_type: itemType,
        timestamp: new Date().toISOString()
    }

    const next = [entry, ...recent].slice(0, MAX_RECENT_EVENTS)
    localStorage.setItem(RECENT_EVENTS_KEY, JSON.stringify(next))
}

/**
 * Store event locally for unauthenticated recommendation requests.
 */
/**
 * Create a click event object
 */
function createEvent(
    eventType: ClickEvent['event_type'],
    itemId: number | string,
    itemTitle: string,
    itemTags?: string[],
    metadata?: Record<string, unknown>
): ClickEvent {
    return {
        event_type: eventType,
        item_id: itemId,
        item_title: itemTitle,
        item_tags: itemTags,
        user_id: getSessionId(),
        timestamp: new Date().toISOString(),
        source_page: getCurrentPage(),
        metadata
    }
}

export function useClickTracking() {

    /**
     * Track book click
     */
    const trackBookClick = (book: {
        id: number | string
        title: string
        tags?: string[]
        author?: string
        rating?: number
    }) => {
        const event = createEvent(
            'book_click',
            book.id,
            book.title,
            book.tags,
            { author: book.author, rating: book.rating }
        )
        storeRecentEvent('book_click', book.id, 'book')
    }

    /**
     * Track forum post click
     */
    const trackPostClick = (post: {
        id: number | string
        title: string
        tags?: Array<{ label: string }> | string[]
        author?: { name: string }
        stars?: number
    }) => {
        const tags = post.tags?.map(t => typeof t === 'string' ? t : t.label) || []
        const event = createEvent(
            'post_click',
            post.id,
            post.title,
            tags,
            { author: post.author?.name, stars: post.stars }
        )
        storeRecentEvent('post_click', post.id, 'post')
    }

    /**
     * Track community click
     */
    const trackCommunityClick = (community: {
        id: number | string
        name: string
        tags?: string[]
        members?: number
    }) => {
        const event = createEvent(
            'community_click',
            community.id,
            community.name,
            community.tags,
            { members: community.members }
        )
        storeRecentEvent('community_click', community.id, 'community')
    }

    /**
     * Track event click
     */
    const trackEventClick = (eventItem: {
        id: number | string
        title: string
        tags?: string[]
        date?: string
        community_id?: string
    }) => {
        const event = createEvent(
            'event_click',
            eventItem.id,
            eventItem.title,
            eventItem.tags,
            { date: eventItem.date, community_id: eventItem.community_id }
        )
        storeRecentEvent('event_click', eventItem.id, 'event')
    }

    /**
     * Track search query
     */
    const trackSearch = (search: {
        query: string
        source_page?: string
        filters?: Record<string, unknown>
    }) => {
        const event = createEvent(
            'search_query',
            search.query,
            search.query,
            undefined,
            { filters: search.filters }
        )
        // Override source_page if provided
        if (search.source_page) {
            event.source_page = search.source_page
        }
    }

    /**
     * Track community join
     */
    const trackCommunityJoin = (community: {
        id: number | string
        name: string
        tags?: string[]
        members?: string | number
    }) => {
        const event = createEvent(
            'community_join',
            community.id,
            community.name,
            community.tags,
            { members: community.members }
        )
        storeRecentEvent('community_join', community.id, 'community')
    }

    return {
        trackBookClick,
        trackPostClick,
        trackCommunityClick,
        trackEventClick,
        trackSearch,
        trackCommunityJoin
    }
}

export const getRecentRecommendationEvents = (): RecommendationEvent[] => {
    if (typeof window === 'undefined') return []

    const recentRaw = localStorage.getItem(RECENT_EVENTS_KEY)
    if (!recentRaw) return []

    try {
        const parsed = JSON.parse(recentRaw)
        return Array.isArray(parsed) ? parsed : []
    } catch (err) {
        console.error('Failed to parse recent events:', err)
        return []
    }
}
