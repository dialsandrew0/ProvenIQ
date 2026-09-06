## Summary

This PR implements robust provider hardening, automated retry mechanisms, model fallbacks, and resilient API handling for the Visual Valuation & Estate Sale intelligence engine.

### Key Changes
- **Universal Model Resilience & Hardening**: Upgraded to the modern `@google/genai` SDK and added `generateContentWithRetry` with exponential backoff and cascading fallbacks across `gemini-3.6-flash`, `gemini-flash-latest`, and preview models to handle transient 503 / high demand spikes gracefully.
- **Multimodal Visual Intake & Extra Photos**: Supported multiple image inputs (hallmarks, maker stamps, detail shots, provenance tags) combined with zero-tagging automated niche classification.
- **Field Inspection Notes**: Enhanced endpoint support for field observations and scraped auction lot context.
- **Build & Development Tooling**: Streamlined Vite + Express server bundling with TypeScript type-checking and automated build scripts.

### Verification
- `npm run lint` (`tsc --noEmit`) passes with 0 errors.
- `npm run build` generates production client & server bundles cleanly.
