##  install everything
`npm i`

## run the mock server

`npm run mock:api`

## files and where to do things

db.json -> databes
routes.json -> endpoints

## testing endpoints 

lets say kmu mau ngambil data buat buku, jadinya tinggal hit endpoint /api/books

contoh 

```javascript
export const useApi = () => {
  const config = useRuntimeConfig()

  const apiCall = async (endpoint, options = {}) => {
    const url = `${config.public.apiBase}${endpoint}`

    const defaultOptions = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.public.apiToken}`
      }
    }

    return $fetch(url, { ...defaultOptions, ...options })
  }

  return { apiCall }
}

// Usage in components
const { apiCall } = useApi()

// Get books 
const books = await apiCall('/api/books')

```

udah gitu ajah yaaay
