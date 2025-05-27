import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true, // <-- enables global test functions like describe, it, expect
    environment: 'node', // or 'jsdom' if testing browser code
    include: ['test/**/*.test.ts'], // or your actual test folder pattern
  },
});
