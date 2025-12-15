
import type { DefineComponent, SlotsType } from 'vue'
type IslandComponent<T> = DefineComponent<{}, {refresh: () => Promise<void>}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, SlotsType<{ fallback: { error: unknown } }>> & T

type HydrationStrategies = {
  hydrateOnVisible?: IntersectionObserverInit | true
  hydrateOnIdle?: number | true
  hydrateOnInteraction?: keyof HTMLElementEventMap | Array<keyof HTMLElementEventMap> | true
  hydrateOnMediaQuery?: string
  hydrateAfter?: number
  hydrateWhen?: boolean
  hydrateNever?: true
}
type LazyComponent<T> = DefineComponent<HydrationStrategies, {}, {}, {}, {}, {}, {}, { hydrated: () => void }> & T

interface _GlobalComponents {
  'CommunitySidebar': typeof import("../../app/components/CommunitySidebar.vue")['default']
  'CreateEmbedCTA': typeof import("../../app/components/CreateEmbedCTA.vue")['default']
  'CreateEmbedModal': typeof import("../../app/components/CreateEmbedModal.vue")['default']
  'CreateThreadSidebar': typeof import("../../app/components/CreateThreadSidebar.vue")['default']
  'EmbedCard': typeof import("../../app/components/EmbedCard.vue")['default']
  'EmbedOverviewStats': typeof import("../../app/components/EmbedOverviewStats.vue")['default']
  'EventsSection': typeof import("../../app/components/Events/EventsSection.vue")['default']
  'EventsSidebar': typeof import("../../app/components/EventsSidebar.vue")['default']
  'FileUploader': typeof import("../../app/components/FileUploader.vue")['default']
  'ForumCard': typeof import("../../app/components/Forum/ForumCard.vue")['default']
  'ForumPost': typeof import("../../app/components/Forum/ForumPost.vue")['default']
  'ForumRightSidebar': typeof import("../../app/components/Forum/ForumRightSidebar.vue")['default']
  'GeneralRightSideBar': typeof import("../../app/components/General/RightSideBar.vue")['default']
  'LiteratureBookCard': typeof import("../../app/components/Literature/BookCard.vue")['default']
  'LiteratureBookGrid': typeof import("../../app/components/Literature/BookGrid.vue")['default']
  'LiteratureBookSection': typeof import("../../app/components/Literature/BookSection.vue")['default']
  'LiteratureFilterSidebar': typeof import("../../app/components/Literature/LiteratureFilterSidebar.vue")['default']
  'LiteratureReadsSection': typeof import("../../app/components/Literature/ReadsSection.vue")['default']
  'LiteratureSourcingOptions': typeof import("../../app/components/Literature/SourcingOptions.vue")['default']
  'Navbar': typeof import("../../app/components/Navbar.vue")['default']
  'NotFoundContent': typeof import("../../app/components/NotFoundContent.vue")['default']
  'NotificationModal': typeof import("../../app/components/NotificationModal.vue")['default']
  'Pagination': typeof import("../../app/components/Pagination.vue")['default']
  'ProfileDropdown': typeof import("../../app/components/ProfileDropdown.vue")['default']
  'RichTextEditor': typeof import("../../app/components/RichTextEditor.vue")['default']
  'Sidebar': typeof import("../../app/components/Sidebar.vue")['default']
  'Slug': typeof import("../../app/components/Slug.vue")['default']
  'TrendingSidebar': typeof import("../../app/components/TrendingSidebar.vue")['default']
  'WorkInProgress': typeof import("../../app/components/WorkInProgress.vue")['default']
  'NuxtWelcome': typeof import("../../node_modules/nuxt/dist/app/components/welcome.vue")['default']
  'NuxtLayout': typeof import("../../node_modules/nuxt/dist/app/components/nuxt-layout")['default']
  'NuxtErrorBoundary': typeof import("../../node_modules/nuxt/dist/app/components/nuxt-error-boundary.vue")['default']
  'ClientOnly': typeof import("../../node_modules/nuxt/dist/app/components/client-only")['default']
  'DevOnly': typeof import("../../node_modules/nuxt/dist/app/components/dev-only")['default']
  'ServerPlaceholder': typeof import("../../node_modules/nuxt/dist/app/components/server-placeholder")['default']
  'NuxtLink': typeof import("../../node_modules/nuxt/dist/app/components/nuxt-link")['default']
  'NuxtLoadingIndicator': typeof import("../../node_modules/nuxt/dist/app/components/nuxt-loading-indicator")['default']
  'NuxtTime': typeof import("../../node_modules/nuxt/dist/app/components/nuxt-time.vue")['default']
  'NuxtRouteAnnouncer': typeof import("../../node_modules/nuxt/dist/app/components/nuxt-route-announcer")['default']
  'NuxtImg': typeof import("../../node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtImg']
  'NuxtPicture': typeof import("../../node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtPicture']
  'NuxtPage': typeof import("../../node_modules/nuxt/dist/pages/runtime/page")['default']
  'NoScript': typeof import("../../node_modules/nuxt/dist/head/runtime/components")['NoScript']
  'Link': typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Link']
  'Base': typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Base']
  'Title': typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Title']
  'Meta': typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Meta']
  'Style': typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Style']
  'Head': typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Head']
  'Html': typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Html']
  'Body': typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Body']
  'NuxtIsland': typeof import("../../node_modules/nuxt/dist/app/components/nuxt-island")['default']
  'LazyCommunitySidebar': LazyComponent<typeof import("../../app/components/CommunitySidebar.vue")['default']>
  'LazyCreateEmbedCTA': LazyComponent<typeof import("../../app/components/CreateEmbedCTA.vue")['default']>
  'LazyCreateEmbedModal': LazyComponent<typeof import("../../app/components/CreateEmbedModal.vue")['default']>
  'LazyCreateThreadSidebar': LazyComponent<typeof import("../../app/components/CreateThreadSidebar.vue")['default']>
  'LazyEmbedCard': LazyComponent<typeof import("../../app/components/EmbedCard.vue")['default']>
  'LazyEmbedOverviewStats': LazyComponent<typeof import("../../app/components/EmbedOverviewStats.vue")['default']>
  'LazyEventsSection': LazyComponent<typeof import("../../app/components/Events/EventsSection.vue")['default']>
  'LazyEventsSidebar': LazyComponent<typeof import("../../app/components/EventsSidebar.vue")['default']>
  'LazyFileUploader': LazyComponent<typeof import("../../app/components/FileUploader.vue")['default']>
  'LazyForumCard': LazyComponent<typeof import("../../app/components/Forum/ForumCard.vue")['default']>
  'LazyForumPost': LazyComponent<typeof import("../../app/components/Forum/ForumPost.vue")['default']>
  'LazyForumRightSidebar': LazyComponent<typeof import("../../app/components/Forum/ForumRightSidebar.vue")['default']>
  'LazyGeneralRightSideBar': LazyComponent<typeof import("../../app/components/General/RightSideBar.vue")['default']>
  'LazyLiteratureBookCard': LazyComponent<typeof import("../../app/components/Literature/BookCard.vue")['default']>
  'LazyLiteratureBookGrid': LazyComponent<typeof import("../../app/components/Literature/BookGrid.vue")['default']>
  'LazyLiteratureBookSection': LazyComponent<typeof import("../../app/components/Literature/BookSection.vue")['default']>
  'LazyLiteratureFilterSidebar': LazyComponent<typeof import("../../app/components/Literature/LiteratureFilterSidebar.vue")['default']>
  'LazyLiteratureReadsSection': LazyComponent<typeof import("../../app/components/Literature/ReadsSection.vue")['default']>
  'LazyLiteratureSourcingOptions': LazyComponent<typeof import("../../app/components/Literature/SourcingOptions.vue")['default']>
  'LazyNavbar': LazyComponent<typeof import("../../app/components/Navbar.vue")['default']>
  'LazyNotFoundContent': LazyComponent<typeof import("../../app/components/NotFoundContent.vue")['default']>
  'LazyNotificationModal': LazyComponent<typeof import("../../app/components/NotificationModal.vue")['default']>
  'LazyPagination': LazyComponent<typeof import("../../app/components/Pagination.vue")['default']>
  'LazyProfileDropdown': LazyComponent<typeof import("../../app/components/ProfileDropdown.vue")['default']>
  'LazyRichTextEditor': LazyComponent<typeof import("../../app/components/RichTextEditor.vue")['default']>
  'LazySidebar': LazyComponent<typeof import("../../app/components/Sidebar.vue")['default']>
  'LazySlug': LazyComponent<typeof import("../../app/components/Slug.vue")['default']>
  'LazyTrendingSidebar': LazyComponent<typeof import("../../app/components/TrendingSidebar.vue")['default']>
  'LazyWorkInProgress': LazyComponent<typeof import("../../app/components/WorkInProgress.vue")['default']>
  'LazyNuxtWelcome': LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/welcome.vue")['default']>
  'LazyNuxtLayout': LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/nuxt-layout")['default']>
  'LazyNuxtErrorBoundary': LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/nuxt-error-boundary.vue")['default']>
  'LazyClientOnly': LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/client-only")['default']>
  'LazyDevOnly': LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/dev-only")['default']>
  'LazyServerPlaceholder': LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/server-placeholder")['default']>
  'LazyNuxtLink': LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/nuxt-link")['default']>
  'LazyNuxtLoadingIndicator': LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/nuxt-loading-indicator")['default']>
  'LazyNuxtTime': LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/nuxt-time.vue")['default']>
  'LazyNuxtRouteAnnouncer': LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/nuxt-route-announcer")['default']>
  'LazyNuxtImg': LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtImg']>
  'LazyNuxtPicture': LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtPicture']>
  'LazyNuxtPage': LazyComponent<typeof import("../../node_modules/nuxt/dist/pages/runtime/page")['default']>
  'LazyNoScript': LazyComponent<typeof import("../../node_modules/nuxt/dist/head/runtime/components")['NoScript']>
  'LazyLink': LazyComponent<typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Link']>
  'LazyBase': LazyComponent<typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Base']>
  'LazyTitle': LazyComponent<typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Title']>
  'LazyMeta': LazyComponent<typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Meta']>
  'LazyStyle': LazyComponent<typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Style']>
  'LazyHead': LazyComponent<typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Head']>
  'LazyHtml': LazyComponent<typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Html']>
  'LazyBody': LazyComponent<typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Body']>
  'LazyNuxtIsland': LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/nuxt-island")['default']>
}

declare module 'vue' {
  export interface GlobalComponents extends _GlobalComponents { }
}

export {}
