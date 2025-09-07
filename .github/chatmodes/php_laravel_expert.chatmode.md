---
description: 'Description of the custom chat mode.'
tools: ['codebase', 'usages', 'vscodeAPI', 'problems', 'changes', 'testFailure', 'terminalSelection', 'terminalLastCommand', 'openSimpleBrowser', 'fetch', 'findTestFiles', 'searchResults', 'githubRepo', 'extensions', 'editFiles', 'runNotebooks', 'search', 'new', 'runCommands', 'runTasks', 'playwright', 'sequentialthinking', 'memory', 'markitdown']
---
# PHP 8.2 + Laravel 11 Web Development Guide (with Vue 3 + Vite)

## What’s new / Updated at a glance

* **Runtime:** PHP **8.2** (use `declare(strict_types=1);`, readonly classes for DTOs, enums for state, no dynamic props).
* **Framework:** Laravel **11+** (streamlined skeleton, Vite by default, Pest tests, native prompt tooling, improved queue & caching defaults).
* **Frontend:** **Vue 3**, **Vite**, **Pinia**, **Vue Router**, optional TypeScript.
* **Auth:** **Sanctum** SPA auth flow with proper CORS & stateful domains.
* **Testing:** **Pest** (backend), **Vitest** (frontend), optional **Playwright** for e2e.
* **Build:** Vite dev server (`npm run dev`) and production build (`npm run build`).
* **Deployment:** PHP-FPM 8.2, `php artisan config:cache route:cache view:cache event:cache`, `npm ci && npm run build`.

> This revision replaces Laravel Mix and Blade-only focus with **Vite** and a **Vue SPA** while keeping API-first patterns and SOLID best practices from your original.&#x20;

---

## Tech Stack

**Backend**

* Laravel **11+**
* PHP **8.2**
* MySQL 8 / PostgreSQL 14+
* Redis 7 (cache, queues)
* HTTP layer: API-first (JSON), Policies, Form Requests
* Auth: **Sanctum** (SPA cookies)
* Queues: Redis (horizon optional)

**Frontend**

* **Vue 3** (Composition API)
* **Vite**
* **Vue Router**, **Pinia**
* **Axios** (or `fetch`) with CSRF + credentials
* Optional: TypeScript, Tailwind CSS

**Testing**

* **Pest** (backend unit/feature)
* **Vitest** + Vue Test Utils
* **Playwright** (or Cypress) for e2e

(Your original guide referenced Laravel 10+, Mix, and Dusk; these are updated here.)&#x20;

---

## Project Structure (Laravel 11 + Vue SPA)

```
laravel-app/
├── app/
│   ├── Console/Commands/
│   ├── Exceptions/Handler.php
│   ├── Http/
│   │   ├── Controllers/
│   │   ├── Middleware/
│   │   ├── Requests/
│   │   └── Resources/
│   ├── Models/
│   ├── Policies/
│   ├── Services/
│   └── Providers/
├── bootstrap/
├── config/
├── database/
│   ├── factories/
│   ├── migrations/
│   └── seeders/
├── public/
├── resources/
│   ├── js/
│   │   ├── main.ts         # or main.js
│   │   ├── app.vue
│   │   ├── router/index.ts
│   │   ├── stores/index.ts
│   │   └── components/
│   ├── css/
│   └── views/              # optional (emails, minimal blade shell)
├── routes/
│   ├── api.php
│   └── web.php             # serves SPA index + fallback
├── tests/                  # Pest by default
│   ├── Feature/
│   └── Unit/
├── vite.config.ts
├── package.json
├── composer.json
└── phpunit.xml / pest.php
```

---

## Environment & Setup

**Requirements**

* PHP **8.2**
* Composer **2.6+**
* Node.js **18+** (prefer LTS 20)
* MySQL 8+ or PostgreSQL 14+
* Redis 7+

**Install**

```bash
composer create-project laravel/laravel:^11 laravel-app
cd laravel-app

cp .env.example .env
php artisan key:generate
php artisan migrate
npm install
npm run dev   # Vite dev server
php artisan serve
```

**.env essentials (SPA with Sanctum)**

```env
APP_URL=http://localhost
FRONTEND_URL=http://localhost:5173

SANCTUM_STATEFUL_DOMAINS=localhost:5173
SESSION_DOMAIN=localhost
SESSION_DRIVER=cookie
SESSION_SECURE_COOKIE=false   # true in HTTPS

# CORS
# In config/cors.php ensure allowed origins include FRONTEND_URL
```

*(Your original guide had Laravel Mix and older Node targets; Vite + modern Node are now default.)*&#x20;

---

## Backend Guidelines (Laravel 11 + PHP 8.2)

### Modern PHP 8.2 patterns

* `readonly` classes for DTOs/configs.
* Enums for statuses (orders, posts, etc.).
* Disallow dynamic properties (default in 8.2).
* Narrow types; use `true`, `false`, and `null` stand-alone types where meaningful.

**Enum + Model cast example**

```php
<?php
declare(strict_types=1);

namespace App\Enums;

enum ArticleStatus: string
{
    case Draft = 'draft';
    case Published = 'published';
}
```

```php
<?php
declare(strict_types=1);

namespace App\Models;

use App\Enums\ArticleStatus;
use Illuminate\Database\Eloquent\Model;

class Article extends Model
{
    protected $fillable = ['title','slug','content','excerpt','status','published_at','user_id','category_id'];

    protected $casts = [
        'status' => ArticleStatus::class,
        'published_at' => 'datetime',
    ];
}
```

### Controllers & Requests (concise, API-first)

Your patterns remain valid—use Form Requests, Resources, Policies, DI Services as in your original.&#x20;

```php
<?php
declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Requests\Article\StoreRequest;
use App\Http\Requests\Article\UpdateRequest;
use App\Http\Resources\ArticleResource;
use App\Models\Article;
use App\Services\ArticleService;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

final class ArticleController extends Controller
{
    public function __construct(private readonly ArticleService $service)
    {
        $this->middleware('auth:sanctum')->except(['index','show']);
    }

    public function index(): AnonymousResourceCollection
    {
        $articles = Article::query()
            ->with(['user','category'])
            ->where('status', 'published')
            ->latest('published_at')
            ->paginate(15);

        return ArticleResource::collection($articles);
    }

    public function store(StoreRequest $request)
    {
        $article = $this->service->create($request->validated());
        return new ArticleResource($article);
    }
}
```

*(This keeps your service/repository layering and resource output style.)*&#x20;

### Security & Middleware

* Keep/adjust your **rate limit** middleware and **security headers** middleware.
* Ensure `\Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful::class` is enabled for SPA cookie auth.
* Continue NFR practices from original (HTTPS, strong hashing, minimal PII).&#x20;

---

## Vue 3 + Vite SPA Guide

### 1) Vite config

`vite.config.ts`

```ts
import { defineConfig } from 'vite'
import laravel from 'laravel-vite-plugin'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [
    laravel({
      input: ['resources/js/main.ts', 'resources/css/app.css'],
      refresh: true,
    }),
    vue(),
  ],
  server: {
    host: 'localhost',
    port: 5173,
    cors: true,
  },
  resolve: {
    alias: { '@': '/resources/js' }
  }
})
```

### 2) SPA entry

`resources/js/main.ts`

```ts
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import App from './app.vue'

createApp(App)
  .use(createPinia())
  .use(router)
  .mount('#app')
```

`resources/js/app.vue`

```vue
<script setup lang="ts">
</script>

<template>
  <router-view />
</template>
```

### 3) Router

`resources/js/router/index.ts`

```ts
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  { path: '/', component: () => import('@/pages/Home.vue') },
  { path: '/articles/:slug', component: () => import('@/pages/ArticleShow.vue') },
  { path: '/login', component: () => import('@/pages/Login.vue') },
  { path: '/me', component: () => import('@/pages/Me.vue'), meta: { auth: true } },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach(async (to) => {
  if (to.meta.auth && !localStorage.getItem('auth')) {
    return { path: '/login', query: { redirect: to.fullPath } }
  }
})

export default router
```

### 4) Pinia store

`resources/js/stores/auth.ts`

```ts
import { defineStore } from 'pinia'
import api from '@/utils/api'

export const useAuthStore = defineStore('auth', {
  state: () => ({ user: null as null | { id: number; name: string } }),
  actions: {
    async login(email: string, password: string) {
      await api.get('/sanctum/csrf-cookie') // important for SPA auth
      await api.post('/login', { email, password })
      const { data } = await api.get('/api/me')
      this.user = data.user
      localStorage.setItem('auth', '1')
    },
    async logout() {
      await api.post('/logout')
      this.user = null
      localStorage.removeItem('auth')
    },
    async fetchMe() {
      const { data } = await api.get('/api/me')
      this.user = data.user
    }
  },
})
```

### 5) Axios helper (CSRF + credentials)

`resources/js/utils/api.ts`

```ts
import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/',
  withCredentials: true, // allow sanctum cookie
  headers: { 'X-Requested-With': 'XMLHttpRequest' },
})

export default api
```

### 6) Blade SPA shell (serve Vue, handle fallback)

`routes/web.php`

```php
use Illuminate\Support\Facades\Route;

Route::view('/{any}', 'spa')->where('any', '.*'); // SPA catch-all
```

`resources/views/spa.blade.php`

```blade
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="csrf-token" content="{{ csrf_token() }}">
  @vite(['resources/js/main.ts','resources/css/app.css'])
</head>
<body>
  <div id="app"></div>
</body>
</html>
```

---

## API & Auth (Sanctum SPA)

* `config/cors.php` → allow `FRONTEND_URL`.
* `.env` → `SANCTUM_STATEFUL_DOMAINS=localhost:5173`, `SESSION_DOMAIN=localhost`.
* Routes:

  * `routes/api.php` for JSON endpoints.
  * `routes/web.php` serves SPA and auth endpoints (`/login`, `/logout`) guarded by Sanctum.
* Controllers return JSON Resources (pattern preserved from your original).&#x20;

---

## Validation, Policies, Services (kept & modernized)

Your Form Request, Policy, Resource, and Service/Repository samples stay relevant. Keep:

* Form Requests for validation & `prepareForValidation`.
* Policies for granular auth.
* Resources for clean payloads.
* Services/Repositories for business logic & testability.&#x20;

*(Use PHP 8.2 `readonly` DTOs for inputs to services when helpful.)*

---

## Testing

**Backend (Pest)**

```bash
composer require pestphp/pest --dev
php artisan pest:install
php artisan test
```

Basic feature test remains nearly identical to your original examples; convert to Pest style if desired.&#x20;

**Frontend (Vitest)**

```bash
npm i -D vitest @vue/test-utils jsdom
npm run test
```

**E2E (Playwright)**

```bash
npm i -D @playwright/test
npx playwright install
npm run test:e2e
```

---

## Performance & Security

* Eager load relationships; use `withCount`, `fullText` where supported (as your optimized examples show).&#x20;
* Cache with tags & invalidation strategies; continue Redis batching approach.&#x20;
* Keep custom **SecurityHeaders** middleware; ensure **HTTPS** in production.&#x20;

---

## Final Notes
- Use playwright mcp tools for e2e testing
