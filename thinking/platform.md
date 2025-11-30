# Platform Information

## Current Setup

### Hosting

- **Platform**: GitHub Pages
- **Site URL**: http://diogoneves.github.io
- **Repository**: diogoneves.github.io (User repository)

### Static Site Generator

- **Engine**: Jekyll 3.9.5
- **Theme**: Jekyll Now (v3.0.0)
- **Markdown Processor**: Kramdown
- **Syntax Highlighter**: Rouge
- **Sass**: Enabled with expanded output

### Build Configuration

- **GitHub Pages Gem**: github-pages (group: jekyll_plugins)
- **Plugins Enabled**:
  - jemoji (Emoji support)
  - jekyll-sitemap (Sitemap generation)

### Constraints for Text Adventure Implementation

- **Client-Side Only**: All game logic, parser, and UI must run in the browser
- **Static Hosting**: No server-side processing available
- **No Database**: Game state must be managed entirely in JavaScript
- **File Structure**: Must work within Jekyll's static file serving
- **Build Process**: Files in `_site/` are generated; source files in root and `_includes/`, `_layouts/`, `_scss/` are processed

### Excluded from Jekyll Processing

The following are excluded from Jekyll build (see `_config.yml`):

- Gemfile, Gemfile.lock
- LICENSE, README.md
- vendor/
- **thinking/**

### File Organization

- **Layouts**: `_layouts/` (default.html, page.html, tag_index.html)
- **Includes**: `_includes/` (analytics, disqus, svg-icons)
- **Styles**: `_scss/` (SCSS partials)
- **Assets**: Static files served from root (favicon.ico, etc.)
- **Generated Site**: `_site/` (not committed, generated on build)

### Browser Compatibility

- Must work in modern browsers (GitHub Pages serves static files)
- No assumptions about specific JavaScript features beyond ES6+
- Must handle various screen sizes and input methods (keyboard, mouse, touch)
