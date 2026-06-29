# DEVELOPMENT SPECIFICATION: MANGAMMA RUCHULU

This document outlines the design and development specifications for building the **Mangamma Ruchulu** website. It is designed to serve as a complete reference for building a high-end, editorial, light-themed digital dining experience.

---

## 1. DESIGN SYSTEM & TOKENS

### Spacing Tokens
- **Padding/Margin Scale**:
  - `var(--space-xxs)`: 4px
  - `var(--space-xs)`: 8px
  - `var(--space-sm)`: 16px
  - `var(--space-md)`: 24px
  - `var(--space-lg)`: 32px
  - `var(--space-xl)`: 48px
  - `var(--space-2xl)`: 64px
  - `var(--space-3xl)`: 96px
  - `var(--space-4xl)`: 128px
  - `var(--space-5xl)`: 160px
- **Layout Containers**:
  - Max Width: `1440px`
  - Inline Padding (Desktop): `var(--space-3xl)` (96px)
  - Inline Padding (Tablet/Mobile): `var(--space-md)` (24px)

### Color Tokens
```css
:root {
  /* Brand Backgrounds */
  --bg-primary: #FFFFFF;
  --bg-secondary: #FAF8F4;
  --bg-accent: #F4EEE7;

  /* Brand Colors */
  --color-maroon: #8C1023;
  --color-maroon-deep: #6B0D1B;
  --color-gold: #C6A15A;
  --color-cream: #F8F4EE;

  /* Text & Borders */
  --color-dark: #111111;
  --color-muted: #6B7280;
  --color-border: #ECECEC;
}
```

### Typography Tokens
- **Primary Font Family**: `'DM Sans', sans-serif`
- **Secondary Font Family**: `'Inter', sans-serif`
- **Font Scales**:
  - `--font-size-hero`: `clamp(4rem, 8vw, 8rem)`
  - `--font-size-h2`: `clamp(2.5rem, 5vw, 4rem)`
  - `--font-size-h3`: `clamp(1.75rem, 3.5vw, 2.5rem)`
  - `--font-size-body`: `18px`
  - `--font-size-caption`: `14px`

### Border Radius Tokens
- `var(--radius-sm)`: 4px
- `var(--radius-md)`: 8px
- `var(--radius-lg)`: 16px
- `var(--radius-full)`: 9999px

### Breakpoints
- **Mobile**: `375px`
- **Tablet**: `768px`
- **Laptop**: `1280px`
- **Desktop**: `1440px+`

---

## 2. 7-SECTION STRUCTURE & SPECS

### Section 01: Hero Experience
- **Concept**: Split editorial layout. The screen is split 50/50 on desktop.
- **Left Side**: Large editorial text, introduction, and call-to-actions.
  - Headline: "Authentic Andhra Flavours. Crafted With Tradition."
  - Subheadline: "Serving timeless South Indian recipes, rich culinary heritage, and memorable dining experiences for over a decade."
  - Buttons: "Order Now" (filled maroon button) and "View Menu" (text link with an animated maroon underline).
- **Right Side**: Full-height premium photography container.
- **Visual Micro-Interactions**:
  - Subtle spice-inspired SVG particles floating in the background.
  - Underline hover animations using CSS transitions.
  - An animated scroll indicator at the bottom left.

### Section 02: Our Story
- **Concept**: Asymmetric 60/40 layout. Left side is visual, right side is textual.
- **Left Column**: Large image displaying fresh, stone-ground ingredients or kitchen preparation.
- **Right Column**: Rich story text highlighting 11+ years of culinary journey, family recipes passed through generations, and commitment to fresh ingredients.
- **Timeline Elements**: Mini vertical list showing milestones:
  - 2015: Inception & Heritage Recipes
  - 2020: Expanding the Kitchen
  - Present: Traditional Feast Redefined

### Section 03: Signature Specialties (Sticky Scroll Showcase)
- **Concept**: A split full-screen section.
- **Left Column (45%)**: Sticky content container with text blocks for each specialty:
  - *Aritaku Bhojanam* (Traditional Banana Leaf Meal)
  - *Chicken Dum Biryani* (Aromatic slow-cooked Basmati rice with spices)
  - *Apollo Fish* (Crispy spiced fish tossed with curry leaves)
  - *Chicken Majestic* (Fried chicken strips coated in yogurt and spices)
  - *Ragi Sangati* (Rustic finger millet ball served with rich chicken curry)
- **Right Column (55%)**: Fixed visual container that updates the image as the user scrolls past the respective text blocks. Uses GSAP ScrollTrigger to pin the section and fade/scale images.

### Section 04: Menu Experience
- **Concept**: Modern category tabs leading to clean grids.
- **Navigation Categories**: Meals, Starters, Curries, Biryanis, Tandoor, Seafood.
- **Cards/List Layout**: Instead of generic food cards, we use an editorial grid. Each category item consists of the item name, description, price, and a minimal image thumbnail on hover.
- **CTA**: A centered "View Full Menu" button with gold border.

### Section 05: Why People Love Us
- **Concept**: Large luxury metrics with animated counters.
- **Metrics**:
  - `11+ Years` of Traditional Legacy
  - `100%` Fresh Spices & Ingredients
  - `50+` Authentically Curated Recipes
  - `4.8` Customer Rating
- **Aesthetic**: Minimalist layout with light sand background (`#FAF8F4`) and large, high-contrast numbers in `#8C1023`.

### Section 06: Gallery Experience
- **Concept**: Horizontal gallery scroll representing raw, authentic moments of dining and food prep.
- **Mechanism**: The container is pinned. As the user scrolls vertically, the masonry grid slides horizontally across the viewport.
- **Imagery**: Wide shots of family dining, steam rising from biryani handis, and traditional brass coffee filters.

### Section 07: Final CTA + Contact
- **Concept**: Rich closing experience with a deep maroon background (`#8C1023`).
- **Typography**: Large white headline: "Ready For Your Next Feast?"
- **Content**:
  - Contact: Phone numbers, physical address, operating hours.
  - UI Details: Form to Reserve a Table, visual placeholder for a premium minimal Google Map.
  - Buttons: "Call Now", "Order Online", "Reserve Table".

---

## 3. LENIS & GSAP INTEGRATION ARCHITECTURE

### Lenis Smooth Scroll Configuration
```javascript
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  direction: 'vertical',
  gestureDirection: 'vertical',
  smooth: true,
  mouseMultiplier: 1,
  smoothTouch: false,
  touchMultiplier: 2,
  infinite: false,
});

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// Sync ScrollTrigger
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0);
```

### GSAP Animation Triggers & Durations
1. **Hero Animations**:
   - Initial load: Fade-up and stagger text elements. Duration: `1.2s`, Ease: `power4.out`.
   - Hero Image Scale: Scale down from `1.15` to `1.0` and fade in. Duration: `1.6s`, Ease: `power3.out`.
2. **Sticky Scroll Specialties**:
   - Trigger: `.specialties-section`
   - ScrollTrigger settings: `pin: true`, `scrub: true`, `start: "top top"`, `end: "+=400%"`
3. **Metrics Counter**:
   - Trigger: `.why-us-section`
   - Animation: Count up numbers using GSAP `Snap` plugin from 0. Duration: `2s`.
4. **Horizontal Gallery**:
   - Trigger: `.gallery-section`
   - ScrollTrigger settings: `pin: true`, `scrub: 1`, `start: "top top"`, `end: "+=300%"`
   - Animation: Translate the horizontal track `-X%`.

---

## 4. RESPONSIVE DESIGN SPECIFICATIONS
- **Layouts**: Use Flexbox and CSS Grid with percentage/fr values.
- **Media Queries**:
  - `max-width: 1024px`: Split sections (Hero, Story, Specialties) stack vertically. Sticky scroll collapses into a standard vertical flow.
  - `max-width: 768px`: Menu navigation shifts to horizontal swipe list. Grid columns reduce to 1.
  - `max-width: 480px`: Font sizing drops slightly to fit screen sizes.

---

## 5. SEO & PERFORMANCE RECOMMENDATIONS

### Meta Tags
- **Meta Title**: `Mangamma Ruchulu | Premium South Indian & Authentic Andhra Fine Dining`
- **Meta Description**: `Indulge in authentic Andhra and Telangana culinary traditions. Experience Aritaku Bhojanam, aromatic Biryanis, and premium family dining at Mangamma Ruchulu.`

### Structured Data (JSON-LD)
- LocalBusiness Schema including business location, opening hours, cuisine category, menu URL, and telephone numbers.

### Accessibility
- Complete semantic markup using `<header>`, `<main>`, `<section>`, `<footer>`, and `<nav>`.
- Fully accessible keyboard navigation for tabs.
- ARIA attributes on buttons and tabs.
