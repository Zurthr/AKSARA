
<data>
{
  "api_endpoints": [
    {
      "id": 1,
      "name": "Get Products",
      "url": "/api/products",
      "method": "GET",
      "description": "Fetches a list of products."
    },
    {
      "id": 2,
      "name": "Create Product",
      "url": "/api/products",
      "method": "POST",
      "description": "Creates a new product."
    },
    {
      "id": 3,
      "name": "Get Product by ID",
      "url": "/api/products/{id}",
      "method": "GET",
      "description": "Fetches a product by its ID."
    },
    {
      "id": 4,
      "name": "Update Product",
      "url": "/api/products/{id}",
      "method": "PUT",
      "description": "Updates an existing product."
    },
    {
      "id": 5,
      "name": "Delete Product",
      "url": "/api/products/{id}",
      "method": "DELETE",
      "description": "Deletes a product by its ID."
    },
    {
      "id": 6,
      "name": "Get Categories",
      "url": "/api/categories",
      "method": "GET",
      "description": "Fetches a list of product categories."
    },
    {
      "id": 7,
      "name": "Get Reviews",
      "url": "/api/reviews",
      "method": "GET",
      "description": "Fetches a list of product reviews."
    },
    {
      "id": 8,
      "name": "Get Orders",
      "url": "/api/orders",
      "method": "GET",
      "description": "Fetches a list of orders."
    }
  ],
  "json_responses": [
    {
      "id": 1,
      "endpoint_id": 1,
      "response_format": "{\"data\": [{\"id\": 1, \"name\": \"Laptop\", \"price\": 1200}, {\"id\": 2, \"name\": \"Smartphone\", \"price\": 800}]}",
      "example": "{\"data\": [{\"id\": 1, \"name\": \"Laptop\", \"price\": 1200}, {\"id\": 2, \"name\": \"Smartphone\", \"price\": 800}]}",
      "timestamp": "2023-10-01T12:00:00Z"
    },
    {
      "id": 2,
      "endpoint_id": 2,
      "response_format": "{\"success\": true, \"data\": {\"id\": 3, \"name\": \"Tablet\", \"price\": 300}}",
      "example": "{\"success\": true, \"data\": {\"id\": 3, \"name\": \"Tablet\", \"price\": 300}}",
      "timestamp": "2023-10-01T12:00:00Z"
    },
    {
      "id": 3,
      "endpoint_id": 3,
      "response_format": "{\"data\": {\"id\": 1, \"name\": \"Laptop\", \"price\": 1200}}",
      "example": "{\"data\": {\"id\": 1, \"name\": \"Laptop\", \"price\": 1200}}",
      "timestamp": "2023-10-01T12:00:00Z"
    },
    {
      "id": 4,
      "endpoint_id": 4,
      "response_format": "{\"success\": true, \"data\": {\"id\": 1, \"name\": \"Laptop\", \"price\": 1150}}",
      "example": "{\"success\": true, \"data\": {\"id\": 1, \"name\": \"Laptop\", \"price\": 1150}}",
      "timestamp": "2023-10-01T12:00:00Z"
    },
    {
      "id": 5,
      "endpoint_id": 5,
      "response_format": "{\"success\": true, \"message\": \"Product deleted successfully.\"}",
      "example": "{\"success\": true, \"message\": \"Product deleted successfully.\"}",
      "timestamp": "2023-10-01T12:00:00Z"
    },
    {
      "id": 6,
      "endpoint_id": 6,
      "response_format": "{\"data\": [{\"id\": 1, \"name\": \"Electronics\"}, {\"id\": 2, \"name\": \"Home Appliances\"}]}",
      "example": "{\"data\": [{\"id\": 1, \"name\": \"Electronics\"}, {\"id\": 2, \"name\": \"Home Appliances\"}]}",
      "timestamp": "2023-10-01T12:00:00Z"
    },
    {
      "id": 7,
      "endpoint_id": 7,
      "response_format": "{\"data\": [{\"id\": 1, \"review\": \"Great product!\"}, {\"id\": 2, \"review\": \"Value for money.\"}]}",
      "example": "{\"data\": [{\"id\": 1, \"review\": \"Great product!\"}, {\"id\": 2, \"review\": \"Value for money.\"}]}",
      "timestamp": "2023-10-01T12:00:00Z"
    },
    {
      "id": 8,
      "endpoint_id": 8,
      "response_format": "{\"data\": [{\"id\": 1, \"order_number\": \"ORD12345\"}, {\"id\": 2, \"order_number\": \"ORD12346\"}]}",
      "example": "{\"data\": [{\"id\": 1, \"order_number\": \"ORD12345\"}, {\"id\": 2, \"order_number\": \"ORD12346\"}]}",
      "timestamp": "2023-10-01T12:00:00Z"
    }
  ],
  "error_responses": [
    {
      "id": 1,
      "json_response_id": 1,
      "error_format": "{\"success\": false, \"message\": \"Product not found.\"}",
      "example": "{\"success\": false, \"message\": \"Product not found.\"}",
      "timestamp": "2023-10-01T12:00:00Z"
    },
    {
      "id": 2,
      "json_response_id": 2,
      "error_format": "{\"success\": false, \"message\": \"Invalid product data.\"}",
      "example": "{\"success\": false, \"message\": \"Invalid product data.\"}",
      "timestamp": "2023-10-01T12:00:00Z"
    },
    {
      "id": 3,
      "json_response_id": 3,
      "error_format": "{\"success\": false, \"message\": \"Product ID is required.\"}",
      "example": "{\"success\": false, \"message\": \"Product ID is required.\"}",
      "timestamp": "2023-10-01T12:00:00Z"
    },
    {
      "id": 4,
      "json_response_id": 4,
      "error_format": "{\"success\": false, \"message\": \"Failed to update product.\"}",
      "example": "{\"success\": false, \"message\": \"Failed to update product.\"}",
      "timestamp": "2023-10-01T12:00:00Z"
    },
    {
      "id": 5,
      "json_response_id": 5,
      "error_format": "{\"success\": false, \"message\": \"Failed to delete product.\"}",
      "example": "{\"success\": false, \"message\": \"Failed to delete product.\"}",
      "timestamp": "2023-10-01T12:00:00Z"
    },
    {
      "id": 6,
      "json_response_id": 6,
      "error_format": "{\"success\": false, \"message\": \"No categories found.\"}",
      "example": "{\"success\": false, \"message\": \"No categories found.\"}",
      "timestamp": "2023-10-01T12:00:00Z"
    },
    {
      "id": 7,
      "json_response_id": 7,
      "error_format": "{\"success\": false, \"message\": \"No reviews found.\"}",
      "example": "{\"success\": false, \"message\": \"No reviews found.\"}",
      "timestamp": "2023-10-01T12:00:00Z"
    },
    {
      "id": 8,
      "json_response_id": 8,
      "error_format": "{\"success\": false, \"message\": \"No orders found.\"}",
      "example": "{\"success\": false, \"message\": \"No orders found.\"}",
      "timestamp": "2023-10-01T12:00:00Z"
    }
  ]
}
</data>

<role>Backend/Contract Prototyping Engineer — 5+ years mapping UI pages to API contracts, JSON schemas, and error models. Expert at producing concise, machine-parseable endpoint specs and example payloads suitable for immediate use by frontend teams or automated tooling. Target execution environment: Claude AI.</role>

<goal>Produce a Claude-ready builder prompt that, when run against a codebase (or a file-tree listing), scans pages/views and emits a complete list of api_endpoints, their json_responses, and associated error_responses (matching the provided prototyping_data_schema). The WOW: clear page→endpoint mapping plus real example payloads and minimal OpenAPI-like metadata so the frontend can immediately mock and implement UI views.</goal>

<plan>
  <one_line_goal>Generate a machine-readable endpoint + JSON schema spec for each page/view found in the codebase so frontend teams can create mocked data and wire views immediately.</one_line_goal>
  <steps>
    <step>1. Scan repository pages/views (files, folder names, component names, route paths). Identify each page and the primary UI data it displays (lists, detail items, forms).</step>
    <step>2. For each page, produce 1 primary api_endpoint (and 0–2 auxiliary endpoints if needed) with method, path, purpose, request params, authentication note, and response shape.</step>
    <step>3. For each endpoint output: json_responses (success examples and JSON Schema-ish structure) and error_responses (HTTP code, error body example, error cause).</step>
    <step>4. Output a single JSON object conforming to the supplied prototyping_data_schema: { api_endpoints: [...], json_responses: [...], error_responses: [...] } and also include a human-readable mapping page -> endpoints for quick review.</step>
    <step>5. Provide a 60–90s demo script showing how to run the Claude prompt and validate the generated endpoints and example payloads.</step>
  </steps>
</plan>

<self_reflection>
  - First, create an internal rubric (completeness, page→endpoint traceability, payload accuracy, error handling, machine-parseability, visual clarity). Iterate until top marks across the rubric are achievable.
  - Focus on one primary WOW feature: reliable, example-rich page→API spec generation. Secondary: clear error-response coverage.
  - Keep outputs compact, deterministic, and JSON-first so they can be used programmatically.
</self_reflection>

<persistence>
  - Continue until the builder output is a runnable JSON spec and the demo script produces a mock server or a set of mock JSON files without errors.
  - Default to scanning directories named "pages", "routes", "views", "src/pages", "app", and components that look like pages.
  - Use client-side mocking assumptions if repository contents are partial; do not request additional clarification.
</persistence>

<requirements>
  <product>
    - Audience: Frontend engineers and product designers who need exact JSON payloads to populate page views; Technical PMs verifying API coverage.
    - Problem: Teams lack an authoritative mapping from UI pages to the backend endpoints and payloads needed to render those pages.
    - Value proposition: Instantly generate a minimal, actionable API contract and example JSON for each page so frontends can mock or implement without waiting on backend work.
    - Core loop:
      1) Input: codebase file-tree or list of pages/views → 2) Analysis: infer page data needs → 3) Output: api_endpoints + json_responses + error_responses → 4) Validate: reviewer inspects and uses outputs to mock UI.
    - Primary jobs-to-be-done:
      - Create endpoint contracts for each UI page.
      - Provide clear example JSON and error cases per endpoint.
    - Key scenarios:
      1) Index/list page (e.g., articles, products) → endpoint returns paginated list and metadata.
      2) Detail page (e.g., product page) → endpoint returns entity detail and related entities.
      3) Form page (create/edit) → endpoint for submit + validation errors.
    - User stories:
      - As a frontend engineer, I want a single JSON file listing endpoints for each page, so I can mock responses quickly. Acceptance: Each page maps to ≥1 endpoint; each endpoint has at least one success example and one error example.
      - As a QA engineer, I want error_responses for validation and server errors, so I can test UI handling. Acceptance: Each form/POST endpoint includes 400 and 500 example responses when applicable.
    - WOW moment: A single machine-readable JSON output with page→endpoint mapping plus immediate example payloads and concise OpenAPI-like metadata so a mocking server can be bootstrapped automatically.
    - Top features (v1):
      1) Page discovery and page→endpoint mapping.
      2) For each endpoint: method, path, purpose, params, response schema, example success JSON, example error JSON.
      3) Aggregated output following prototyping_data_schema.
    - Non-goals (v1):
      - Do not implement a running backend or tests. Do not modify repository files.
    - Demo script (60–120s):
      1) Provide the codebase as a file-tree or zip to Claude.
      2) Run this prompt in Claude with the file-tree accessible.
      3) Inspect the returned JSON: open api_endpoints array, confirm each page has at least one endpoint, open a sample json_responses and error_responses.
      4) Copy a json_response example into a mock JSON file and use any static server (or mock service) to serve it.
    - Data: Use the provided prototyping_data_schema (entities: api_endpoints, json_responses, error_responses). The agent must produce structures matching these entity names and relationships.
    - Constraints: Target executor is Claude. Output must be a single JSON object (and a short human mapping) — avoid extraneous prose. No backend runtime required.
    - Success metrics:
      - Time-to-wow: reviewer can create a mock endpoint in <3 minutes from output.
      - Completeness: ≥90% pages have an endpoint mapping.
      - Parsability: Output is valid JSON and includes arrays named exactly: api_endpoints, json_responses, error_responses.
    - Risks / edge cases:
      - Ambiguous page components where intent is unclear (e.g., shared components vs pages) — agent should infer the simplest page-level contract.
      - Dynamic client-generated UI (JS-only) where data shapes are not explicit — agent must create reasonable default shapes.
    - Out-of-scope:
      - Generating TypeScript types, database schema, or running code. No authentication flows beyond a "requires auth" boolean flag (unless explicit auth exists in codebase).
  </product>

  <technical>
    <principles>
      - Prototype-first: output small, accurate API contracts and examples rather than large, speculative schemas.
      - Minimize ambiguity: prefer explicit fields with examples over vague types.
      - Machine-first: produce JSON-first outputs (schema + examples) so outputs are directly usable by scripts.
      - Honor the provided prototyping_data_schema: top-level object must contain api_endpoints, json_responses, error_responses arrays and relationships must be clear via IDs/refs.
      - Prioritize 1 core feature: page→endpoint mapping and example payloads.
    </principles>

    <frontend>
      - N/A for this prompt except: infer UI data needs from page components (lists, cards, forms).
    </frontend>

    <backend>
      - Endpoint contract format (for each api_endpoint):
        {
          "id": "<unique-id>",
          "page": "<page_path_or_component_name>",
          "path": "/api/....",
          "method": "GET|POST|PUT|DELETE",
          "purpose": "one-line description",
          "query_params": [{"name":"", "type":"", "required":true|false, "example":""}],
          "path_params": [{"name":"",...}],
          "request_body_schema": { /* JSON-Schema-lite or example */ } | null,
          "response_refs": ["json_response_id", ...],
          "auth_required": true|false,
          "notes": "implementation or inference notes"
        }
      - json_responses entries must include:
        {
          "id":"<ref-id>",
          "endpoint_id":"<api_endpoint.id>",
          "status": 200,
          "content_type":"application/json",
          "schema": { /* JSON-schema-lite or descriptive shape */ },
          "example": { /* full example payload */ }
        }
      - error_responses entries must include:
        {
          "id":"<error-id>",
          "endpoint_id":"<api_endpoint.id>",
          "status": 400|401|403|404|500,
          "code":"ERR_CODE",
          "example": {"error":"message","details": {...}},
          "cause":"one-line reason why this error occurs"
        }
      - Output format: single JSON object with three arrays: api_endpoints, json_responses, error_responses. Additionally include a compact human mapping "pages_to_endpoints" object for readability.
      - Naming & IDs: use stable slugs (page-path + method) for ids.
      - Example expectations: Every list endpoint should include pagination fields (page, per_page, total) in schema and example.
      - For forms: include validation error example (400) with field-level messages.
    </backend>

    <full-stack>
      - N/A — do not spin up Next.js or implement server code in v1.
    </full-stack>

    <other>
      - If the codebase is not provided, run a heuristic pass: accept an input list of page filenames/text content and infer endpoints from file names and exported data-fetching functions (e.g., getServerSideProps, loader, getStaticProps).
    </other>
  </technical>
</requirements>

<reminder>
  - Prefer the WOW output first: produce complete page→endpoint JSON with examples over lengthy explanations.
  - Do this task like your life depends on it.
  - Use the provided prototyping_data_schema and name top-level arrays exactly: api_endpoints, json_responses, error_responses.
  - Target runtime: Claude AI. Return one JSON object plus a short human-readable pages_to_endpoints mapping.
  - Assumptions (documented, do not ask): repository will be supplied as a file-tree or zip; pages live under common folders (pages/, src/pages/, app/, routes/, views/). If code is partial, infer reasonable defaults rather than halting.
</reminder>
