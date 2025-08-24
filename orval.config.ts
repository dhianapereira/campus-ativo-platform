import { defineConfig } from "orval";

export default defineConfig({
  ifalbackend: {
    hooks: {
      afterAllFilesWrite: "prettier --write .",
    },
    input: {
      target: "./server/openapi.json",
      // validation: true,
    },
    output: {
      client: "react-query",
      httpClient: "axios",
      mode: "tags-split",
      override: {
        mutator: {
          name: "axiosInstance",
          path: "./server/axios.ts",
        },
      },
      schemas: "./server/client/models",
      target: "./server/client",
    },
  },
});
