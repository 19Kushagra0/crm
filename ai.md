# Repetitive Task Instructions

When the user enters "1", the AI should:
1. Inspect the root `src/app/page.jsx` for syntax, structure, or missing component wrappers.
2. Fix `src/app/page.jsx` by wrapping any raw JSX fragments inside a default functional component export (`export default function Page() { return ( ... ); }`).
3. Verify that the project compiles cleanly using `npm run build` or by running Next.js build checks.
4. Provide a clear and concise summary of the fix.
