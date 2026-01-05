# Recommendations Frontend Guide

This guide documents how to call the recommendations API and render results.

## Endpoint

`POST /api/recommendations?limit=5&type=post`

Query params:
- `limit` (number, optional): max items to return, default 5, max 50.
- `type` (string, optional): `book`, `event`, `post`, `community`.
- `tag` (string, optional): single tag to filter/boost results.
- `tags` (string, optional): comma-separated tags (e.g. `tags=typescript,javascript`).

Auth:
- If the request is authenticated, the backend uses recent activity logs.
- If unauthenticated, include `events` in the body (required).

## Request Body (Unauthenticated)

```json
{
  "events": [
    { "event_type": "view", "item_id": "<id>", "item_type": "post" }
  ]
}
```

Event fields:
- `event_type`: string like `view`, `post_click`, `book_click`, `community_click`, `join_event`
- `item_id`: target id (thread/resource/event/community)
- `item_type`: `post`, `book`, `event`, `community`
- `timestamp`: optional ISO string

## Response Shape

```json
{
  "success": true,
  "data": [
    {
      "id": "string",
      "title": "string",
      "type": "post | book | event | community",
      "score": 0.123
    }
  ]
}
```

## Rendering by Type

Use the `type` field to decide which detail endpoint to call:

- `post` → `GET /api/threads/:id`
- `book` → `GET /api/resources/:id`
- `event` → `GET /api/events/:id`
- `community` → `GET /api/communities/:id`

## Engine Health (Optional)

`GET /api/recommendations/health`

Use this for health checks or UI fallbacks.

## Tag Suggestions (Personalized)

`GET /api/recommendations/tags?limit=6`

Returns a list of tags based on the user profile interest scores. If scores are empty,
it falls back to recent activity + engine tags.
