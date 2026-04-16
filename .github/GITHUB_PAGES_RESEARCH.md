# GitHub Pages Research Notes

This is a temporary planning file for exploring a GitHub Pages site for this repository.

## Goal

Build a public website from this repository **without** disrupting the current repo structure, content organization, or existing `README.md` experience.

## Constraints

- Do **not** create a new repository.
- Do **not** make the current biography/content structure messy.
- Keep the website isolated so the repository remains clean and maintainable.

## Recommended Approach

### Best balance: site source in a dedicated folder + deploy to `gh-pages`

Recommended setup later:

- Keep the current repo as-is on `main`
- Add website source code in a single isolated folder such as `site/`
- Use GitHub Actions to build/deploy that folder to a separate `gh-pages` branch
- Leave the existing profile folders and root content untouched except for the isolated site folder and deployment workflow

Why this is the best option:

- The current repository structure stays readable
- Website code is isolated in one place
- GitHub Pages output lives on `gh-pages`, not mixed into `main`
- Future edits to the website are easy to manage

## Alternative Options

### Option A: `docs/` folder publishing

GitHub Pages can publish directly from `/docs` on `main`.

Pros:

- Simple setup
- No build pipeline required for a static site

Cons:

- Website files live directly on `main`
- Less isolated from the current repo structure

### Option B: dedicated site branch only

Keep website source on a dedicated branch like `site` or `gh-pages`.

Pros:

- Very isolated from `main`

Cons:

- Harder to maintain
- Easier to forget syncing content from the main branch
- Less convenient during development

## Recommendation Summary

If you want the cleanest long-term setup **without a new repo**, use:

- `main` for the current project content
- `site/` for website source
- `gh-pages` for deployed output

## What You Should Share Next

To design the landing page properly, please share one of the following:

### Best option: a single design brief

Create or paste a brief with these sections:

1. **Page sections**
   - Hero
   - Featured legends
   - Category overview
   - Timeline or no timeline
   - Search/filter
   - Footer

2. **Visual style**
   - Background style
   - Color palette
   - Fonts
   - Border radius
   - Shadows / depth
   - Light or dark preference

3. **Component style**
   - Buttons
   - Cards
   - Navigation bar
   - Tags / badges
   - Tables vs cards for legends

4. **Responsive behavior**
   - Mobile-first or desktop-first
   - How the grid should collapse
   - Whether tables should become cards on small screens

5. **Content priorities**
   - What should be visible above the fold
   - Whether portraits should dominate
   - Whether the site should feel museum-like, editorial, academic, or modern-tech

6. **Reference links**
   - Sites you like
   - Screenshots
   - Figma links
   - Moodboards

### If using Google Stitch

You can share any of these:

- exported HTML/CSS
- screenshots of the generated layout
- a prompt you used in Stitch
- design tokens (colors, spacing, typography)
- component screenshots with notes

## Suggested Share Format

You can paste something like this in chat:

```md
# Landing Page Design Brief

## Style Direction
- Modern editorial
- Dark theme
- Clean typography
- Subtle gold accents

## Sections
- Hero banner
- Intro paragraph
- Featured legends grid
- Browse by category
- Search/filter legends
- Footer with repo links

## Colors
- Background: #0b1020
- Surface: #121a2b
- Accent: #d4af37
- Text: #f5f7fb
- Muted: #94a3b8

## Typography
- Headings: Playfair Display
- Body: Inter

## Components
- Rounded cards
- Soft shadows
- Gold badge for Turing winners
- Portrait-first cards on mobile

## References
- [link 1]
- [link 2]
```

## Good Next Step

Next, we should produce a temporary design brief file or paste your design system into chat.

Once you share that, we can:

1. define the exact Pages architecture,
2. scaffold the website in an isolated folder,
3. keep the current repository structure clean,
4. deploy safely to GitHub Pages.

## Temporary Note

This file is intended for planning only and can be deleted later.