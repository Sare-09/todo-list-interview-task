import { defineConfig, devices } from '@playwright/test';
import path from 'path';

const allureResultsPath = path.resolve(__dirname, 'todolist-automationtask/allure-results');
process.env.ALLURE_RESULTS_DIR = allureResultsPath;

export default defineConfig({
  // Point explicitly to tests inside the subfolder
  testDir: './todolist-automationtask/tests',
  timeout: 30 * 1000,
  expect: {
    timeout: 5000,
  },
  fullyParallel: false,
  workers: 1,

  reporter: [
    ['line'],
    ['html', { open: 'never' }],
    [
      'allure-playwright',
      {
        resultsDir: allureResultsPath,
        detail: true,
        suiteTitle: false,
      },
    ],
  ],

  use: {
    actionTimeout: 10000,
    baseURL: 'http://localhost:8080/todo',
    headless: false,
    launchOptions: {
      slowMo: 300,
    },
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
      },
    },
  ],
});