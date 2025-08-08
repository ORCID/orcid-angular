import {
  Component,
  EventEmitter,
  Input,
  Optional,
  Output,
  Self,
  ViewChild,
  forwardRef,
} from '@angular/core'
import {
  MAT_MENU_DEFAULT_OPTIONS,
  MatMenuTrigger,
} from '@angular/material/menu'
import {
  AbstractControl,
  ControlValueAccessor,
  FormBuilder,
  FormControl,
  FormGroup,
  NG_VALUE_ACCESSOR,
  NgControl,
} from '@angular/forms'
import { ErrorStateMatcher } from '@angular/material/core'
import { PlatformInfoService } from '../../platform-info'
import { WorkTypes, WorkTypesLabels } from 'src/app/types/works.endpoint'

export interface DeepSelectMenu {
  isNotSelectableLabel?: boolean
  label?: string
  description?: string
  value?: string
  content?: DeepSelectMenu[]
  secondaryItem?: boolean
  divider?: boolean
}

@Component({
    selector: 'app-deep-select-input',
    templateUrl: './deep-select-input.component.html',
    styleUrls: ['./deep-select-input.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => DeepSelectInputComponent),
            multi: true,
        },
        {
            provide: MAT_MENU_DEFAULT_OPTIONS,
            useValue: { overlayPanelClass: 'menu-overlay-pane-overwrite' },
        },
    ],
    standalone: false
})
export class DeepSelectInputComponent implements ControlValueAccessor {
  formgroup
  @Input() menu: DeepSelectMenu[] = []
  @Input() formControlRef: FormControl<any>
  @ViewChild('clickHoverMenuTrigger') clickHoverMenuTrigger: MatMenuTrigger
  @ViewChild('matMenu') matMenu: MatMenuTrigger
  @Input('aria-label') ariaLabel = 'Deep select input'
  selectItemLabel = $localize`:@@works.pleaseSelectWork:Please select a work type`
  ariaLabelWorkType = $localize`:@@works.workType:Work type`

  subMenus: { [key: string]: any } = {}
  selectedItem: DeepSelectMenu

  private onChange: (value: string) => void = () => {}
  private onTouched: () => void = () => {}
  isMobile: boolean

  constructor(fb: FormBuilder, private platformService: PlatformInfoService) {
    this.formgroup = fb.group({
      formControl: [''],
    })
    this.platformService.get().subscribe((platform) => {
      this.isMobile = platform.columns4
    })
  }

  onItemSelect(item: DeepSelectMenu) {
    this.selectedItem = item

    this.onChange(item.value)
    this.onTouched()
  }

  onSpaceBar(event: KeyboardEvent) {
    if (event.code === 'Space' || event.code === 'Enter') {
      event.preventDefault()
      event.stopPropagation()
      this.clickHoverMenuTrigger.openMenu()
      this.registerOnChange(this.onChange)
      this.registerOnTouched(this.onTouched)
    }
  }

  // ControlValueAccessor implementation
  writeValue(value: string): void {
    this.formgroup.get('formControl').setValue(value)
    const findItem = (menu: DeepSelectMenu[], value: string) => {
      for (const item of menu) {
        if (item.value === value) {
          return item
        }

        if (item.content) {
          const foundItem = findItem(item.content, value)
          if (foundItem) {
            return foundItem
          }
        }
      }
    }
    if (value === WorkTypes.other) {
      this.selectedItem = {
        label: WorkTypesLabels[WorkTypes.other],
        value: WorkTypes.other,
      }
    } else {
      const foundItem = findItem(this.menu, value)
      this.selectedItem = foundItem
    }
    this.formgroup.get('formControl').setValue(this.selectedItem?.label)
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn
  }

  openMenu() {
    this.clickHoverMenuTrigger.openMenu()
  }

  setDisabledState?(isDisabled: boolean): void {
    // Implement if your component needs to handle the disabled state
  }

  ngOnInit() {}

  onMenuClose() {
    this.onTouched()
  }

  get invalid() {
    return this.formControlRef?.invalid && this.formControlRef?.touched
  }

  getMatcher(): ErrorStateMatcher {
    return {
      isErrorState: (control: AbstractControl) => {
        return this.invalid
      },
    }
  }
}
