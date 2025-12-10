// Composable untuk event manual berbasis localStorage
import { ref } from 'vue'

const LOCAL_KEY = 'aksara_local_events_v1'

export function useLocalEvents() {
  const localEvents = ref(readLocalEvents())

  function readLocalEvents() {
    try {
      const raw = localStorage.getItem(LOCAL_KEY)
      if (!raw) return []
      return JSON.parse(raw)
    } catch {
      return []
    }
  }

  function saveLocalEvents(events: any[]) {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(events))
    localEvents.value = events
  }

  function addLocalEvent(event: any) {
    const events = readLocalEvents()
    events.push(event)
    saveLocalEvents(events)
  }

  function clearLocalEvents() {
    saveLocalEvents([])
  }

  return {
    localEvents,
    readLocalEvents,
    saveLocalEvents,
    addLocalEvent,
    clearLocalEvents
  }
}
