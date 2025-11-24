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

## Alert Message

Displays contextual feedback with an icon, title line, and optional supporting content.

### Selector
`app-alert-message`

### Input
`type`: `'notice' | 'info' | 'warning' | 'success'` (default: `'notice'`)

### Slots (content projection)
- `[title]`: Bold heading line (margins stripped).
- `[content]`: Body content below the title (first element gets `margin-top: 8px` if a title is present).

### Example
```html
<app-alert-message type="warning">
  <h2 title>API limit approaching</h2>
  <p content>You have used 85% of your monthly allocation.</p>
</app-alert-message>
```

### Accessibility
Icons are decorative. Provide semantic structure (headings, paragraphs, lists) inside projected content.

### Migration Notes
Legacy path `src/app/cdk/alert-message` was replaced by this standalone component. Update imports to:
```ts
import { AlertMessageComponent } from '@orcid/ui'
// Then add to your NgModule imports:
@NgModule({
  imports: [AlertMessageComponent]
})
```
