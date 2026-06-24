# DPD Stock System Rules

## Language and Communication
- Always communicate with the user in Thai unless explicitly requested otherwise.
- Explain code changes clearly and concisely.

## Technology Stack
- **Frontend Only**: HTML5, Vanilla CSS, and Vanilla JavaScript.
- **Strict Rule**: DO NOT use frameworks like React, Angular, Vue, Tailwind CSS, or Bootstrap unless explicitly requested by the user.

## Code Style & Safety
- Keep modifications modular within `js/app.js` and `css/style.css`.
- Always preserve existing `i18n` translation logic when adding new text elements.
- Be extremely careful not to break the existing Google Sheets synchronization and `localStorage` caching mechanisms.
- Do not introduce server-side code (PHP, Node.js) as this project is designed to be hosted statically (e.g., GitHub Pages).
