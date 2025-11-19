Orcid UI library components live here.

- Use **standalone** Angular components.
- Expose components from `src/public-api.ts`.
- Component styles should use Orcid design tokens via CSS custom properties,
  for example:

```scss
:host {
  color: var(--orcid-color-text, #000);
}
```
