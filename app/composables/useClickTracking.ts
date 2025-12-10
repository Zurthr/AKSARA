/**
 * Click Events Tracking Composable
 * Tracks user interactions for curation algorithm
 * 
 * Features:
 * - Anonymous session ID (stored in localStorage)
 * - Batching (sends multiple events together to reduce API calls)
 * - Supports: book_click, post_click, community_click, event_click, page_view
 */

export interface ClickEvent {
    id?: number
    event_type: 'book_click' | 'post_click' | 'community_click' | 'event_click' | 'page_view'
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

// Batch configuration
const BATCH_SIZE = 5 // Send after 5 events
const BATCH_TIMEOUT = 30000 // Or after 30 seconds

// Event queue for batching
let eventQueue: ClickEvent[] = []
let batchTimeout: ReturnType<typeof setTimeout> | null = null

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
 * Send events batch to API
 */
async function flushEventQueue(): Promise<void> {
    if (eventQueue.length === 0) return

    const eventsToSend = [...eventQueue]
    eventQueue = []

    if (batchTimeout) {
        clearTimeout(batchTimeout)
        batchTimeout = null
    }

    try {
        // Send events one by one (json-server doesn't support batch POST natively)
        // In production, you'd send as array to a batch endpoint
        for (const event of eventsToSend) {
            await $fetch('http://localhost:3002/click_events', {
                method: 'POST',
                body: event
            })
        }
        console.log(`[ClickTracking] Sent ${eventsToSend.length} events`)
    } catch (error) {
        console.error('[ClickTracking] Failed to send events:', error)
        // Put events back in queue on failure
        eventQueue = [...eventsToSend, ...eventQueue]
    }
}

/**
 * Add event to queue and schedule batch send
 */
function queueEvent(event: ClickEvent): void {
    eventQueue.push(event)

    // Send immediately if batch size reached
    if (eventQueue.length >= BATCH_SIZE) {
        flushEventQueue()
        return
    }

    // Otherwise, set timeout to send later
    if (!batchTimeout) {
        batchTimeout = setTimeout(() => {
            flushEventQueue()
        }, BATCH_TIMEOUT)
    }
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
        queueEvent(event)
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
        queueEvent(event)
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
        queueEvent(event)
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
        queueEvent(event)
    }

    /**
     * Track page view (for detail pages opened directly)
     */
    const trackPageView = (page: {
        type: 'book' | 'post' | 'community' | 'event'
        id: number | string
        title: string
        tags?: string[]
    }) => {
        const event = createEvent(
            'page_view',
            page.id,
            `${page.type}: ${page.title}`,
            page.tags,
            { page_type: page.type }
        )
        queueEvent(event)
    }

    /**
     * Force flush all queued events (call on page unload or route change)
     */
    const flush = () => {
        flushEventQueue()
    }

    // Flush on page unload
    if (typeof window !== 'undefined') {
        window.addEventListener('beforeunload', flush)
    }

    return {
        trackBookClick,
        trackPostClick,
        trackCommunityClick,
        trackEventClick,
        trackPageView,
        flush
    }
}
