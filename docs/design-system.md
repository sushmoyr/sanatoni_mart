# Sanatoni Mart — UI/UX Design System (v1.0)

A modern, sleek, and culturally respectful system for a Hindu religious e-commerce platform.

---

## 1) Brand DNA

**Attributes:** serene, trustworthy, devotional, premium-craft.
**Visual motifs:** subtle mandala grids, temple-arch curves, lotus geometry, thin gold separators, soft paper textures (low opacity).
**Voice & tone:** calm, reverent, precise; avoids hype. Emphasize authenticity, care instructions, and ritual context.

---

## 2) Color System

### 2.1 Semantic tokens (design-first)

Use semantic tokens in CSS variables; Tailwind maps below.

* **Primary / Action:** `--color-primary = brand-500` (gold)

  * Hover: `brand-600`, Active: `brand-700`, Outline: `brand-200`
* **Accent / Highlight:** `--color-accent = accent-500` (royal purple)

  * Use sparingly for CTAs, badges, deal highlights.
* **Base / Surfaces:**

  * Background: `neutral-50`
  * Surface: `brand-50` (warm parchment)
  * Elevated: `#FFFFFF` on light; `neutral-800` on dark
* **Text:** Primary `neutral-900`, Secondary `neutral-700`, Muted `neutral-600`, Inverse `#FFFFFF`
* **Status:** Success `success-600`, Danger `danger-600`, Warning `#D97706` (amber-600), Info `accent-600`
* **Borders/Dividers:** `neutral-200` light, `neutral-700` dark
* **Focus ring:** `accent-500` (2px outside + 1px offset)

### 2.2 Tailwind theme (extended semantic aliases)

Add alongside your palette for cleaner usage.

```js
// tailwind.config.js (add to extend)
module.exports = {
  theme: {
    extend: {
      colors: {
        // existing palettes preserved (neutral/brand/accent/success/danger)
        semantic: {
          bg:      'var(--bg)',
          surface: 'var(--surface)',
          elevate: 'var(--elevate)',
          primary: 'var(--primary)',
          accent:  'var(--accent)',
          text:    'var(--text)',
          textSub: 'var(--text-sub)',
          border:  'var(--border)',
          ring:    'var(--ring)',
          success: '#059669',
          danger:  '#DC2626',
          warning: '#D97706',
          info:    '#6D3DE3',
        }
      }
    }
  }
}
```

**Light mode CSS variables (default):**

```css
:root {
  --bg:        #FAF9F7; /* neutral-50 */
  --surface:   #FBF8F1; /* brand-100 */
  --elevate:   #FFFFFF;
  --primary:   #C99B3F; /* brand-500 */
  --accent:    #8B5CF6; /* accent-500 */
  --text:      #1F1B18; /* neutral-900 */
  --text-sub:  #5C5144; /* neutral-700 */
  --border:    #E8E3DA; /* neutral-200 */
  --ring:      #8B5CF6; /* accent-500 */
}
```

**Dark mode (`.dark`):**

```css
.dark {
  --bg:        #1F1B18; /* neutral-900 */
  --surface:   #3D362F; /* neutral-800 */
  --elevate:   #2A241F;
  --primary:   #DDB974; /* brand-400 for better contrast */
  --accent:    #B58CE7; /* accent-400 */
  --text:      #FDFCF9;
  --text-sub:  #B8B09E;
  --border:    #5C5144;
  --ring:      #B58CE7;
}
```

**Usage rule:** Gold = action/brand; Purple = highlight/secondary action. Never mix both in the same component except small accents (e.g., dot badge).

---

## 3) Typography

* **Display (hero/section):** “Playfair Display” or “Fraunces” (serif with high contrast)

  * 700/800 weight for headings with subtle tracking `-0.01em`
* **UI & body:** “Inter” or “Manrope” (system-safe fallback stack)
* **Script support:** Ensure Devanagari fallback (“Noto Serif Devanagari”, “Noto Sans Devanagari”).
* **Scale (fluid clamp):**

  * H1: `clamp(32px, 4vw, 44px)` / 1.15
  * H2: `clamp(24px, 3vw, 32px)` / 1.2
  * H3: 22 / 1.25
  * Body L: 18 / 1.55
  * Body M: 16 / 1.6
  * Caption: 13 / 1.4
* **Emphasis:** use color (`text-semantic-text` vs `text-semantic-textSub`), not many weights.
* **Numerals:** tabular nums for prices `font-feature-settings: "tnum" 1;`.

---

## 4) Spacing, Radii, Shadows

* **Spacing scale:** 4, 8, 12, 16, 20, 24, 28, 32, 40, 48, 64 (Tailwind `1,2,3,4,5,6,7,8,10,12,16`)
* **Radii:** `sm:6px`, `md:10px`, `lg:16px`, `pill:9999px`, `arch: clamp(12px,1.5vw,20px)`
* **Shadows (elevation):**

  * `e1`: subtle card `0 1px 1px rgba(0,0,0,.04)`
  * `e2`: hover `0 4px 12px rgba(0,0,0,.08)`
  * `e3`: popover/modal `0 12px 32px rgba(0,0,0,.18)`

---

## 5) Grid & Layout

* **Container:** `max-w-[1200px]` with `px-4 sm:px-6 lg:px-8`
* **Columns:** 12-col; product shelves use responsive cards:

  * `grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5`
* **Section rhythm:** top/bottom `py-10` (mobile) → `py-16` (desktop)
* **Sacred geometry hint:** optional faint 8-spoke radial background at 2% opacity for hero or footer.

---

## 6) Motion

* **Durations:** 120ms micro, 200ms default, 320ms complex
* **Easings:** `cubic-bezier(.2,.7,.2,1)` for enter; `cubic-bezier(.4,0,.2,1)` for exit
* **Reductions:** respect `prefers-reduced-motion`; disable parallax/shimmer.

---

## 7) Accessibility

* All text/background ≥ 4.5:1; buttons ≥ 3:1
* **Focus:** 2px outside ring `ring-semantic-ring ring-offset-2 ring-offset-semantic-surface`
* **Touch targets:** ≥ 44×44px
* **Keyboard:** trap focus in modals; visible skip-to-content
* **Localization:** support English + Hindi + Bengali — keep labels short; price format ₹/৳ as region.

---

## 8) Core Components (specs + Tailwind recipes)

### 8.1 Buttons

**Primary (Gold):**

* Base: `bg-brand-500 text-white hover:bg-brand-600 active:bg-brand-700`
* Shape: `rounded-md` (arch if using brand motif)
* Padding: `px-4 py-2`
* Focus: `focus:outline-none focus:ring-2 focus:ring-semantic-ring focus:ring-offset-2`

**Secondary (Outline):**

* `border border-brand-300 text-brand-700 hover:bg-brand-100`

**Tertiary (Text):**

* `text-brand-700 hover:text-brand-800 hover:underline underline-offset-4`

**Destructive:**

* `bg-danger-600 text-white hover:bg-danger-500`

**Loading state:** left spinner 16px, button becomes `cursor-wait`, label opacity 80%.

### 8.2 Inputs & Selects

* Field wrapper with label (caption) + help/error
* Input:
  `bg-white dark:bg-semantic-elevate border border-semantic-border rounded-md px-3 py-2 text-semantic-text placeholder:text-semantic-textSub focus:ring-2 focus:ring-semantic-ring focus:border-semantic-ring`
* Error: border `danger-600`, help text `text-danger-600`

### 8.3 Top App Bar / Navigation

* Height 64 (desktop), 56 (mobile)
* Composition: slim utility bar (language/currency), main bar (logo, search, actions), mega nav (categories: Deities, Pooja Samagri, Scriptures, Beads, Decor, Gifts)
* Sticky with backdrop blur: `backdrop-blur supports-[backdrop-filter]:bg-white/80`
* Icons: “puja thali”/lotus pictograms are fine; otherwise Lucide/Material defaults.

### 8.4 Search

* Prominent, center in desktop nav:
  `rounded-md border border-semantic-border bg-white px-4 py-2 w-full md:w-[560px] shadow-e1 focus-within:shadow-e2`
* Typeahead with recent searches, categories, and top matches.

### 8.5 Product Card

**Spec:** 1:1 image, name (2 lines clamp), rating, price, optional ribbon (e.g., “Handmade”).
**Recipe:**

```html
<article class="group rounded-lg bg-semantic-elevate shadow-[var(--e1)] border border-semantic-border overflow-hidden">
  <div class="aspect-square overflow-hidden bg-neutral-100">
    <img class="h-full w-full object-cover transition-transform duration-200 group-hover:scale-[1.03]" src="..." alt="Rudraksha Mala">
  </div>
  <div class="p-4">
    <h3 class="text-sm font-medium text-semantic-text line-clamp-2">Rudraksha Japa Mala (108 Beads)</h3>
    <div class="mt-1 flex items-center gap-2">
      <div class="text-amber-500">★★★★★</div>
      <span class="text-xs text-semantic-textSub">(128)</span>
    </div>
    <div class="mt-2 flex items-center justify-between">
      <div class="text-lg font-semibold tracking-tight">₹799</div>
      <button class="px-3 py-1.5 text-sm bg-brand-500 text-white rounded-md hover:bg-brand-600 focus:outline-none focus:ring-2 focus:ring-semantic-ring">Add</button>
    </div>
  </div>
  <div class="absolute left-3 top-3 rounded-md bg-brand-500/90 text-white text-xs px-2 py-1">Handcrafted</div>
</article>
```

### 8.6 Product Detail

* **Gallery:** 1 large + thumbnails; on mobile use swipe gallery.
* **Info blocks:** (a) Title + rating, (b) Price + availability, (c) “Ritual significance” collapsible, (d) “Care & authenticity”, (e) Delivery & returns
* **Puja Context card:** short paragraph describing spiritual usage.
* **CTA bar (mobile sticky):** price + “Add to Cart”
* **Options (size/weight):** buttons with check/selected states.

### 8.7 Badges & Chips

* **Status:**

  * In stock: `bg-success-500/10 text-success-600 border border-success-600/20`
  * Limited: `bg-warning-500/10 text-warning-600`
  * Out of stock: `bg-neutral-200 text-neutral-600`
* **Category chips:** `bg-brand-100 text-brand-800 hover:bg-brand-200`

### 8.8 Cart Drawer

* Right sheet `w-full sm:w-[420px]`, overlay `bg-black/40`
* Item rows with qty stepper; totals box with subtle divider.
* **Checkout CTA:** full width primary button; show trust badges (COD, Secure, Easy Returns).

### 8.9 Checkout Stepper

* Steps: Address → Delivery → Payment → Review
* Horizontal on desktop, vertical on mobile; current step in gold, completed in purple.
* Progress line thin with rounded ends.

### 8.10 Tables (Management suites)

* Compact density, sticky header, zebra rows `odd:bg-semantic-surface`
* Bulk actions toolbar appears when items selected.
* Status pills:

  * **Order:** Placed → Packed → Shipped → Delivered → Returned/Cancelled
  * Colors: neutral → accent → accent → success → danger (for negative)

### 8.11 Modals, Popovers, Toasts

* Modal max width 560/720; shadow `e3`; close icon top-right.
* Popover: border `semantic-border`, shadow `e2`
* Toast (bottom): neutral surface, left icon, auto-dismiss 4s.

### 8.12 Empty States

* Soft lotus/mandala line illustration + one-sentence guidance + single CTA.
* Example: “No orders yet — when you place an order, it will appear here.”

---

## 9) Imagery & Iconography

* **Photography:** warm daylight, natural materials (wood, brass, cloth), neutral backdrops; avoid harsh saturation.
* **Illustration:** thin-stroke, geometric lotus, diya, conch; opacity ≤ 8% as background textures.
* **Icon set:** Lucide or Material Symbols Rounded, 24px grid; filled for primary actions, outline for secondary.

---

## 10) Content Strategy

* **Product titles:** “\[Material] \[Item] (\[Count/Size]) — \[Deity/Use]”

  * e.g., “Copper Kalash (1L) — Lakshmi Pooja”
* **Attributes:** Ritual use, Material & origin, Dimensions, Care, In the box.
* **Assurance copy:** “Ethically sourced • Certified materials • Packed with sanctity”
* **Microcopy:** respectful, no exclamation marks; use “Add to Cart” > “Buy Now.”

---

## 11) Internationalization & Currency

* Language switcher: EN / HI / BN
* Currency: ₹ by default; if user locale BD, show ৳ and appropriate formatting
* Calendar & festivals: optional seasonal theming (e.g., Diwali banner with purple highlight, not changing core brand).

---

## 12) Example Tailwind Recipes (snippets)

### 12.1 Primary CTA

```html
<button class="inline-flex items-center justify-center rounded-md px-4 py-2 bg-brand-500 text-white hover:bg-brand-600 active:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-semantic-ring focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed">
  Add to Cart
</button>
```

### 12.2 Input with label

```html
<label class="block text-sm font-medium text-semantic-text mb-1">Full name</label>
<input class="w-full rounded-md border border-semantic-border bg-white px-3 py-2 text-semantic-text placeholder:text-semantic-textSub focus:border-semantic-ring focus:ring-2 focus:ring-semantic-ring" placeholder="e.g., Arjun Mehta">
<p class="mt-1 text-xs text-semantic-textSub">As shown on your ID for deliveries.</p>
```

### 12.3 Stepper (checkout)

```html
<ol class="flex items-center gap-3 text-sm">
  <li class="flex items-center gap-2 text-brand-700">
    <span class="h-6 w-6 grid place-content-center rounded-full bg-brand-100">1</span> Address
  </li>
  <div class="h-px flex-1 bg-neutral-200"></div>
  <li class="flex items-center gap-2 text-neutral-500">
    <span class="h-6 w-6 grid place-content-center rounded-full bg-neutral-100">2</span> Delivery
  </li>
</ol>
```

### 12.4 Admin Table Cell – Status Pill

```html
<span class="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs border
  bg-success-500/10 text-success-600 border-success-600/20">
  <svg class="h-3 w-3" viewBox="0 0 20 20" fill="currentColor"><path d="M16.7 5.3l-8 8-3.4-3.3-1.4 1.4 4.8 4.6 9.4-9.4z"/></svg>
  Delivered
</span>
```

---

## 13) States & Interactions

* **Hover:** lift + scale 1.02 for cards; background subtle tint for rows
* **Active/Pressed:** reduce elevation; darken fill by one step
* **Disabled:** 50% opacity, remove shadows
* **Skeletons:** soft rounded bars, shimmer disabled if reduced-motion

---

## 14) Forms & Validation

* Inline validation on blur; summary at submit
* Error pattern: icon + short message under field; never red placeholders
* OTP/2FA input for admin & high-value orders (4 or 6 boxes, auto-advance)

---

## 15) Search & Discovery

* **Filters:** deity, material, ritual, price, availability, rating
* **Chips:** removable with `×`
* **Sort:** relevance, newest, price, rating
* **Breadcrumbs:** Home / Category / Subcategory / Item

---

## 16) Trust & Compliance

* Footer trust row: SSL, COD, Easy returns, Verified sellers
* Policy pages clean, serif headings; readable widths
* Sensitive imagery (deity portraits) shown respectfully; no overlays or playful stickers.

---

## 17) Theming Hooks (developer-ready)

**Data attributes for density & corner style:**

```css
/* density */
:root[data-density="compact"] { --space: 12px; }
:root[data-density="cozy"]    { --space: 16px; } /* default */
:root[data-density="comfortable"] { --space: 20px; }

/* radius style */
:root[data-corner="arch"] {
  --radius-md: 12px;
  --radius-lg: 18px;
}
```

Use with Tailwind plugin or inline classes (`rounded-[var(--radius-md)]`).

---

## 18) Management Suites (Product/Order/Customer)

* **Product Management:** table + side panel edit; image uploader with reorder; “Ritual tags” multiselect.
* **Order Management:** timeline with stamped dates; quick actions (refund, invoice, label)
* **Customer Management:** profile with devotion interests (optional), purchase history, addresses.

---

## 19) Dark Mode Style Notes

* Maintain warmth: use `brand-400` for primary to preserve contrast.
* Images: add subtle `bg-neutral-800` behind transparent PNGs.
* Dividers lighten: use `border-neutral-700`, reduce shadows, increase ring prominence.

---

## 20) QA Checklist (pre-launch)

* Contrast passes on all CTAs and small text
* Keyboard reachable: search, cart drawer, checkout flow
* Locale flip: English/Hindi/Bengali strings fit buttons
* Error handling for out-of-stock at add-to-cart
* Loading states for gallery and checkout API steps

---