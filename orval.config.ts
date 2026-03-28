import { defineConfig } from 'orval'

export default defineConfig({
  backend: {
    input: {
      target: './openapi/openapi.json',
    },
    output: {
      client: 'react-query',
      httpClient: 'axios',
      mode: 'tags-split',
      override: {
        mutator: {
          name: 'axiosInstance',
          path: './src/lib/api/axios.ts',
        },
      },
      schemas: './src/lib/api/generated/models',
      target: './src/lib/api/generated',
    },
  },
})
