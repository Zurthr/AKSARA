/**
 * Click Events Tracking Composable
 * Tracks user interactions for curation algorithm
 * 
 * Features:
 * - Anonymous session ID (stored in localStorage)
 * - Immediate sending using sendBeacon (works during navigation)
 * - Supports: book_click, post_click, community_click, event_click
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

// API endpoint
const API_ENDPOINT = 'http://localhost:3002/click_events'

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

/**
 * Send event immediately using sendBeacon (works during navigation) or fetch as fallback
 */
function sendEvent(event: ClickEvent): void {
    if (typeof window === 'undefined') return

    const payload = JSON.stringify(event)

    // Try sendBeacon first (works even during page navigation)
    if (navigator.sendBeacon) {
        const blob = new Blob([payload], { type: 'application/json' })
        const sent = navigator.sendBeacon(API_ENDPOINT, blob)
        if (sent) {
            console.log(`[ClickTracking] Sent via beacon: ${event.event_type}`, event.item_title)
            return
        }
    }

    // Fallback to fetch (fire and forget)
    fetch(API_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: payload,
        keepalive: true // Helps with navigation
    })
        .then(() => console.log(`[ClickTracking] Sent via fetch: ${event.event_type}`, event.item_title))
        .catch(err => console.error('[ClickTracking] Failed:', err))
}

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
        sendEvent(event)
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
        sendEvent(event)
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
        sendEvent(event)
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
        sendEvent(event)
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
        sendEvent(event)
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
        sendEvent(event)
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
