# Copilot Instructions for sanatoni_mart

## Project Overview
**Laravel 12 + React/Inertia.js SPA** - E-commerce platform with modern stack:
- **Backend:** Laravel 12, PHP 8.2+, Pest testing, Laravel Pint formatting, Ziggy for route sharing
- **Frontend:** React + TypeScript, Inertia.js SPA, Tailwind CSS, Headless UI
- **Tooling:** Vite (SSR enabled), Concurrently for dev workflows

## Architecture Patterns
- **Inertia SPA:** Pages are React components; controllers return `Inertia::render()` instead of JSON APIs
- **Shared props:** User auth & Ziggy routes automatically available in all pages via `HandleInertiaRequests`
- **Route bridging:** Ziggy generates JS route helpers; use `route('profile.edit')` in React like in PHP
- **SSR enabled:** Both client and server rendering configured in `vite.config.js`

## Developer Workflows
**Unified dev command:** `composer dev` runs all services concurrently:
- Laravel server, queue worker, log viewer (Pail), and Vite dev server
- Alternative: `php artisan serve` + `npm run dev` separately

**Testing with Pest:**
- Run: `composer test` (clears config + runs Pest)
- Uses `RefreshDatabase` trait automatically for Feature tests
- Custom expectation: `expect($value)->toBeOne()`

**Production build:** `npm run build` (includes TypeScript compilation + SSR bundle)

## Project-Specific Conventions
- **Controllers:** Return Inertia responses, not JSON. Group by domain (`Auth/`, `ProfileController`)
- **Frontend routing:** Define in `routes/web.php`; access via Ziggy in React components
- **Types:** Shared TS interfaces in `resources/js/types/index.d.ts` (User, PageProps with auth/ziggy)
- **Pages:** Auto-resolved from `./Pages/${name}.tsx` glob pattern
- **Layouts:** Use `AuthenticatedLayout`/`GuestLayout` for consistent structure

## Integration Details
- **Auth flow:** Session-based via `web` guard; Sanctum available but not primary
- **Shared data:** `auth.user` and `ziggy` routes available in all Inertia pages
- **Asset handling:** Vite processes `resources/js/app.tsx` entry point with React plugin
- **DB sessions:** Default session driver (see `config/session.php`)

## Key Files to Reference
- `app/Http/Middleware/HandleInertiaRequests.php` - Defines shared props pattern
- `resources/js/app.tsx` - Inertia app setup with page resolution
- `routes/web.php` - Web routes returning Inertia responses
- `resources/js/types/index.d.ts` - Core TypeScript interfaces
- `composer.json` scripts - Custom dev workflow commands

## Tips for AI Agents
- Use `Inertia::render('PageName', $data)` not JSON responses
- Import `PageProps<T>` type for component props with auth/ziggy
- Access routes in React via `route()` function (Ziggy)
- Test with Pest syntax: `it('description', function() { ... })`
- Check `HandleInertiaRequests::share()` for globally available data

## Validating implementations
- Ensure new controllers follow Inertia response pattern
- Verify TypeScript types for new props in `PageProps`
- Run the playwright tools from the playwright mcp server to validate end to end functionality after every changes