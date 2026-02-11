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

## Action Surface

Displays a compact surface with projected message text and actions.

### Selector

`orcid-action-surface`

### Inputs

- `icon`: Material icon name (optional).
- `iconColor`: CSS color value for the icon (optional).

### Slots (content projection)

- `[text]`: Message text (inline/heading elements allowed).
- `[actions]`: Material buttons (mat-button, mat-flat-button, etc).

### Example

All user-facing strings must be provided by the parent (e.g. from `$localize` in the app).

```html
<orcid-action-surface icon="work_outline">
  <span text>
    <strong>Org name</strong> message text from parent...
  </span>
  <div actions>
    <button mat-button>Action 1</button>
    <button mat-flat-button color="primary">Action 2</button>
  </div>
</orcid-action-surface>
```

## Action Surface Container

Provides a container with optional title/subtitle and projected content.

### Selector

`orcid-action-surface-container`

### Inputs

- `title`: Optional title string.
- `subtitle`: Optional subtitle string.

### Slots (content projection)

- Default slot: Action surfaces or other content blocks.

### Example

All user-facing strings (title, subtitle, content) must be provided by the parent.

```html
<orcid-action-surface-container
  title="Title from parent"
  subtitle="Subtitle from parent"
>
  <orcid-action-surface icon="work_outline">
    <span text>Message text from parent.</span>
    <div actions>
      <button mat-button>Action 1</button>
      <button mat-flat-button color="primary">Action 2</button>
    </div>
  </orcid-action-surface>
</orcid-action-surface-container>
```

### Migration Notes

Legacy path `src/app/cdk/alert-message` was replaced by this standalone component. Update imports to:

```ts
import { AlertMessageComponent } from '@orcid/ui'
// Then add to your NgModule imports:
@NgModule({
  imports: [AlertMessageComponent]
})
```
