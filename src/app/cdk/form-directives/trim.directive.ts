import { Directive, OnInit } from '@angular/core'
import { NgControl } from '@angular/forms'

@Directive({
  selector: 'input[appTrim]',
})
export class TrimDirective implements OnInit {
  constructor(private ngControl: NgControl) {}

  ngOnInit() {
    this.ngControl.valueChanges.subscribe((value: string) => {
      console.log('have____ ', value, '.')
      if (value && value !== value.trim()) {
        this.ngControl.control.setValue(value.trim())
        console.log('update to ', value)
      }
    })
  }
}
