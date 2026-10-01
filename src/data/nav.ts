export interface NavItem {
  id: string;
  label: string;
  /** Source repo for this page, when it differs from its group's. */
  repo?: string;
}

export interface NavGroup {
  id: string;
  label: string;
  pkg?: string;
  repo: string;
  items: NavItem[];
}

export interface NavSection {
  id: "tutorial" | "packages" | "integrations";
  label: string;
  groups: NavGroup[];
}

export const sections: NavSection[] = [
  {
    id: "tutorial",
    label: "Tutorial",
    groups: [
      {
        id: "start",
        label: "Get started",
        repo: "https://github.com/rhythmjs/rhythm",
        items: [{ id: "getting-started", label: "Quick start" }],
      },
      {
        id: "tutorial",
        label: "Tutorial",
        repo: "https://github.com/rhythmjs/rhythm",
        items: [
          { id: "tutorial/index", label: "1. First steps" },
          { id: "tutorial/controllers", label: "2. Controllers & routing" },
          { id: "tutorial/services", label: "3. Services & providers" },
          { id: "tutorial/modules", label: "4. Modules" },
          { id: "tutorial/custom-modules", label: "5. Custom modules" },
          { id: "tutorial/validation", label: "6. Validation & errors" },
          { id: "tutorial/configuration", label: "7. Configuration" },
          { id: "tutorial/persistence", label: "8. Persistence" },
          { id: "tutorial/security", label: "9. Security" },
          { id: "tutorial/websockets", label: "10. WebSockets" },
          { id: "tutorial/background-jobs", label: "11. Background jobs" },
          { id: "tutorial/openapi", label: "12. OpenAPI" },
          { id: "tutorial/observability", label: "13. Observability" },
          { id: "tutorial/testing", label: "14. Testing" },
        ],
      },
    ],
  },
  {
    id: "packages",
    label: "Packages",
    groups: [
      {
        id: "rhythm",
        label: "Core",
        pkg: "@rhythmjs/rhythm",
        repo: "https://github.com/rhythmjs/rhythm",
        items: [
          { id: "rhythm/index", label: "Overview" },
          { id: "rhythm/middleware", label: "Middleware & context" },
          { id: "rhythm/providers", label: "Providers & lifecycle" },
          { id: "rhythm/modules", label: "Encapsulated modules" },
          { id: "rhythm/api", label: "API reference" },
        ],
      },
      {
        id: "router",
        label: "Router",
        pkg: "@rhythmjs/router",
        repo: "https://github.com/rhythmjs/rhythm",
        items: [
          { id: "router/index", label: "Routing" },
          { id: "router/static", label: "Serving files" },
          { id: "router/api", label: "API reference" },
        ],
      },
      {
        id: "http",
        label: "HTTP",
        pkg: "@rhythmjs/http",
        repo: "https://github.com/rhythmjs/http",
        items: [
          { id: "http/index", label: "Cookies & sessions" },
          { id: "http/bodies", label: "Bodies & uploads" },
          { id: "http/caching", label: "Caching & compression" },
          { id: "http/streaming", label: "Streaming & timeouts" },
          { id: "http/i18n", label: "i18n" },
          { id: "http/api", label: "API reference" },
        ],
      },
      {
        id: "middleware",
        label: "Middleware",
        pkg: "@rhythmjs/middleware",
        repo: "https://github.com/rhythmjs/middleware",
        items: [
          { id: "middleware/index", label: "Validate" },
          { id: "middleware/intercept", label: "Intercept" },
          { id: "middleware/filter", label: "Filter" },
          { id: "middleware/api", label: "API reference" },
        ],
      },
      {
        id: "config",
        label: "Config",
        pkg: "@rhythmjs/config",
        repo: "https://github.com/rhythmjs/config",
        items: [
          { id: "config/index", label: "Defining configuration" },
          { id: "config/service", label: "The config service" },
          { id: "config/api", label: "API reference" },
        ],
      },
      {
        id: "data",
        label: "Data",
        repo: "https://github.com/rhythmjs/examples",
        items: [
          { id: "data/index", label: "Overview" },
          { id: "data/drizzle", label: "Drizzle" },
          { id: "data/prisma", label: "Prisma" },
          { id: "data/mikro-orm", label: "MikroORM" },
          { id: "data/mongodb", label: "MongoDB" },
        ],
      },
      {
        id: "security",
        label: "Security",
        pkg: "@rhythmjs/security",
        repo: "https://github.com/rhythmjs/security",
        items: [
          { id: "security/index", label: "Authentication & authorization" },
          { id: "security/protection", label: "CORS & CSRF" },
          { id: "security/hardening", label: "Rate limiting & headers" },
          { id: "security/api", label: "API reference" },
        ],
      },
      {
        id: "openapi",
        label: "OpenAPI",
        pkg: "@rhythmjs/openapi",
        repo: "https://github.com/rhythmjs/openapi",
        items: [
          { id: "openapi/index", label: "Describing routes" },
          { id: "openapi/document", label: "Documents & UIs" },
          { id: "openapi/api", label: "API reference" },
        ],
      },
      {
        id: "observability",
        label: "Observability",
        pkg: "@rhythmjs/observability",
        repo: "https://github.com/rhythmjs/observability",
        items: [
          { id: "observability/index", label: "Logging & timing" },
          { id: "observability/health", label: "Health & shutdown" },
          { id: "observability/api", label: "API reference" },
        ],
      },
      {
        id: "testing",
        label: "Testing",
        pkg: "@rhythmjs/testing",
        repo: "https://github.com/rhythmjs/testing",
        items: [
          { id: "testing/index", label: "Kernel & modules" },
          { id: "testing/router", label: "The router client" },
          { id: "testing/cli", label: "The CLI runner" },
          { id: "testing/ws", label: "The WebSocket harness" },
          { id: "testing/api", label: "API reference" },
        ],
      },
      {
        id: "ws",
        label: "WebSockets",
        pkg: "@rhythmjs/ws",
        repo: "https://github.com/rhythmjs/ws",
        items: [
          { id: "ws/index", label: "Connection routing" },
          { id: "ws/serving", label: "Serving & pub/sub" },
          { id: "ws/api", label: "API reference" },
        ],
      },
      {
        id: "events",
        label: "Events",
        pkg: "@rhythmjs/events",
        repo: "https://github.com/rhythmjs/tasks",
        items: [
          { id: "events/index", label: "Subscribing" },
          { id: "events/emitting", label: "Emitting & errors" },
          { id: "events/api", label: "API reference" },
        ],
      },
      {
        id: "schedule",
        label: "Schedule",
        pkg: "@rhythmjs/schedule",
        repo: "https://github.com/rhythmjs/tasks",
        items: [
          { id: "schedule/index", label: "Jobs & scheduling" },
          { id: "schedule/cron", label: "The cron engine" },
          { id: "schedule/api", label: "API reference" },
        ],
      },
      {
        id: "queue",
        label: "Queue",
        pkg: "@rhythmjs/queue",
        repo: "https://github.com/rhythmjs/tasks",
        items: [
          { id: "queue/index", label: "Producing & processing" },
          { id: "queue/engines", label: "Engines & repeats" },
          { id: "queue/api", label: "API reference" },
        ],
      },
      {
        id: "bullmq",
        label: "BullMQ",
        pkg: "@rhythmjs/bullmq",
        repo: "https://github.com/rhythmjs/tasks",
        items: [
          { id: "bullmq/index", label: "The BullMQ module" },
          { id: "bullmq/schedulers", label: "Schedulers & queue access" },
          { id: "bullmq/api", label: "API reference" },
        ],
      },
      {
        id: "cli",
        label: "CLI",
        pkg: "@rhythmjs/cli",
        repo: "https://github.com/rhythmjs/rhythm",
        items: [
          { id: "cli/index", label: "Commands" },
          { id: "cli/prompts", label: "Interactive prompts" },
          { id: "cli/run", label: "Running on Bun" },
          { id: "cli/api", label: "API reference" },
        ],
      },
    ],
  },
  {
    id: "integrations",
    label: "Integrations",
    groups: [
      {
        id: "integrations",
        label: "Integrations",
        repo: "https://github.com/rhythmjs/rhythm",
        items: [
          { id: "integrations/ai-sdk", label: "AI SDK", repo: "https://github.com/rhythmjs/router" },
          { id: "integrations/better-auth", label: "Better Auth", repo: "https://github.com/rhythmjs/security" },
          { id: "integrations/file-upload", label: "File upload", repo: "https://github.com/rhythmjs/http" },
          { id: "integrations/nodemailer", label: "Nodemailer" },
          { id: "integrations/redis", label: "Redis", repo: "https://github.com/rhythmjs/http" },
          { id: "integrations/resend", label: "Resend" },
          { id: "integrations/scalar", label: "Scalar", repo: "https://github.com/rhythmjs/openapi" },
          { id: "integrations/swagger-ui", label: "Swagger UI", repo: "https://github.com/rhythmjs/openapi" },
        ],
      },
    ],
  },
];
