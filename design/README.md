# Design Theme Import Guide

This folder stores reference design files copied from `awesome_design_md` and notes about turning them into site themes.

## Naming

- Keep raw references as Markdown files, for example `DESIGN_Resend.md` or `DESIGN_claude.md`.
- Use kebab-case for actual theme ids in code, for example `dark-academic`, `minimal-light`, or `resend-dark`.
- A theme id must match the `data-design` value used in CSS.

## What To Extract

Do not copy an external design over the current React structure. Keep the site's information architecture intact and extract only the reusable visual language:

- background and page atmosphere
- color variables
- card surfaces and borders
- button styles
- title and body font direction
- radius and shadow vocabulary
- light decorative effects

If a design contains HTML or React structure, translate it into this project's existing classes and CSS variables instead of replacing pages.

## Registering A Theme

1. Add the new id to `DesignId` in `lib/designs.ts`.
2. Add a metadata entry to `registeredDesigns` with:
   - `id`
   - `nameZh`
   - `nameEn`
   - `descriptionZh`
   - `descriptionEn`
   - `recommendedZh`
   - `recommendedEn`
   - optional `previewPath`
3. Add CSS overrides in `styles.css` using:

```css
html[data-design="your-theme-id"] {
  --canvas: #...;
  --surface-soft: #...;
  --surface-card: #...;
  --surface-dark: #...;
  --ink: #...;
  --body: #...;
  --muted: #...;
  --primary: #...;
  --primary-active: #...;
  --hairline: #...;
  --shadow: ...;
  --radius: ...;
  --display-font: ...;
  --body-font: ...;
}
```

The site also exposes aliases requested by the settings system: `--bg`, `--panel`, `--panel-strong`, `--text`, `--accent`, `--accent-2`, `--border`, `--font-display`, and `--font-body`.

## Pure CSS Designs

If the imported design is mostly CSS, map its tokens to the variables above. Prefer variable overrides first. Add class-specific overrides only when a theme needs a special treatment for existing elements such as `.site-header`, `.feature-card`, `.project-card`, or `.settings-panel`.

## Designs With HTML Or React

If the design includes components, identify the intent rather than copying markup:

- hero layout -> current `.page-hero` or `.darkness-hero`
- feature tiles -> current `.feature-card`
- content cards -> current `.project-card`, `.blog-card`, `.life-item`
- dialogs or panels -> current modal/settings classes

Only create new components when the current site genuinely has no matching structure.

## Preview Images

Optional preview images should live in:

```text
public/design-previews/
```

Use a stable path such as `/design-previews/resend-dark.png`, then set `previewPath` in `lib/designs.ts`. The current settings panel uses CSS-generated swatches, so image previews can be added later without blocking the theme system.

## Defaults

The default settings are:

- design: `default`
- color mode: `system`
- motion: `on`
- reading density: `comfortable`

These are initialized before React hydration in `app/layout.tsx` and stored in `localStorage` by `components/SettingsPanel.tsx`.
