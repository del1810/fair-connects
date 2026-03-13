# Fair Connects India (FCI) - Corporate Website

This repository contains the source code for the corporate website of **Fair Connects India LLP (FCI)**, a professionally managed B2B exhibition organizing company based in Chennai.

## 🏢 About the Project

The website showcases FCI's services, industry sectors covered, upcoming exhibitions, gallery, and contact information. It is designed to be fully responsive, performance-optimized, and integrates dynamic content loading using vanilla JavaScript and JSON. 

## 🚀 Features

- **Dynamic Content Loading:** Data for Features, Gallery, Sectors, Services, and Exhibitions are fetched asynchronously from JSON files (`data/` directory) and injected dynamically into the DOM.
- **Responsive Layout:** A mobile-first design system utilizing Flexbox and CSS Grid.
- **Custom UI Components:** 
  - Interactive hero slider
  - Dynamic image lightbox/gallery modal
  - Mobile hamburger navigation menu
  - Smooth scrolling effects and fade-up view animations (`IntersectionObserver`).
- **SEO Optimized:** Full meta tags, Open Graph tags (Facebook/LinkedIn), Twitter Cards, and comprehensive JSON-LD structured data (Organization, LocalBusiness, WebSite, BreadcrumbList, FAQPage) for enhanced search engine visibility.
- **No External Frameworks:** Built purely with HTML5, CSS3, and Vanilla JavaScript, ensuring fast load times and minimal dependencies. FontAwesome is used for iconography.

## 🛠️ Technology Stack

- **HTML5:** Semantic HTML structure.
- **CSS3:** Custom styles (`css/style.css`), CSS variables for consistent theming.
- **JavaScript (ES6):** Vanilla JS (`js/main.js`, `js/heroslider.js`) handling dynamic state, navigation, API fetching, gallery grids, and IntersectionObservers.
- **JSON:** Used as a pseudo-database for decoupled dynamic content delivery (`data/` folder).

## 📂 Project Structure

```text
├── assets/                  # Images, icons, logos, and UI assets
├── css/
│   └── style.css            # Global stylesheet mapping theme and layouts
├── data/                    # JSON data sources for dynamic content injection
│   ├── exhibitions.json
│   ├── features.json
│   ├── gallery.json
│   ├── heroslider.json
│   ├── sectors.json
│   ├── services.json
│   └── whyfci.json
├── js/
│   ├── heroslider.js        # Logic for the hero carousel sequence
│   └── main.js              # Core scripts (fetch JSON, navigation, lightbox, animations)
├── index.html               # Main Entry / Home Page
├── about.html               # About Us Page
├── contact.html             # Contact Page
├── exhibitions.html         # Upcoming Events Page
├── gallery.html             # Interactive Gallery Page
├── sectors.html             # Sectors Overview
├── services.html            # Services List
└── whyfci.html              # Why Choose FCI
```

