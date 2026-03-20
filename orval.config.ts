import { defineConfig } from 'orval'

export default defineConfig({
  ifalbackend: {
    input: {
      target: './src/server/openapi.json',
    },
    output: {
      client: 'react-query',
      httpClient: 'axios',
      mode: 'tags-split',
      override: {
        mutator: {
          name: 'axiosInstance',
          path: './src/server/axios.ts',
        },
      },
      schemas: './src/server/client/models',
      target: './src/server/client',
    },
  },
})
