# Seater Project Helper

## Commands

- **Dev Server**: `bun run dev` (runs SST dev server)
- **Frontend Dev**: `cd packages/frontend && bun run start` (Expo)
- **Frontend Tests**: `cd packages/frontend && bun test`
- **Frontend Single Test**: `cd packages/frontend && bun test -- -t "test name"`
- **Core Tests**: `cd packages/core && bun test`
- **Frontend Lint**: `cd packages/frontend && bun run lint`

## Code Style

- **Types**: Strict TypeScript with noUncheckedIndexedAccess and noImplicitOverride
- **Styling**: React Native with theme hooks for consistent styling
- **API**: Hono with valibot for validation
- **Database**: DynamoDB with ElectroDB
- **State Management**: TanStack Query
- **Form Handling**: TanStack Form with valibot
- **Naming**: PascalCase for components, camelCase for functions/variables
- **Imports**: Group imports by external packages first, then internal modules
- **Component Structure**: Functional components with hooks for state/effects

## Notes

- Built on SST (Serverless Stack) infrastructure with Expo frontend
