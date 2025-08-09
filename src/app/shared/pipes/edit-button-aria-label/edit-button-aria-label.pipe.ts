import { Pipe, PipeTransform } from '@angular/core'
import { ModalEmailComponent } from '../../../cdk/side-bar/modals/modal-email/modal-email.component'
import { ModalCountryComponent } from '../../../cdk/side-bar/modals/modal-country/modal-country.component'
import { ModalWebsitesComponent } from 'src/app/cdk/side-bar/modals/modal-websites/modal-websites.component'
import { ModalKeywordComponent } from 'src/app/cdk/side-bar/modals/modal-keyword/modal-keyword.component'
import { ModalPersonIdentifiersComponent } from 'src/app/cdk/side-bar/modals/modal-person-identifiers/modal-person-identifiers.component'
import { ModalNameComponent } from 'src/app/record/components/top-bar/modals/modal-name/modal-name.component'
import { ModalBiographyComponent } from 'src/app/record/components/top-bar/modals/modal-biography/modal-biography.component'

@Pipe({
  name: 'editButtonAriaLabel',
  standalone: false,
})
export class EditButtonAriaLabelPipe implements PipeTransform {
  transform(modal: any, args?: any): string {
    if (modal == ModalCountryComponent) {
      return $localize`:@@shared.editAriaLabelCountries:Manage your countries`
    } else if (modal == ModalEmailComponent) {
      return $localize`:@@shared.editAriaLabelEmails:Manage your emails`
    } else if (modal == ModalWebsitesComponent) {
      return $localize`:@@shared.editAriaLabelWebsites:Manage your websites & social links`
    } else if (modal == ModalKeywordComponent) {
      return $localize`:@@shared.editAriaLabelKeywords:Manage your keywords`
    } else if (modal == ModalPersonIdentifiersComponent) {
      return $localize`:@@shared.editAriaLabelOtherIds:Manage your other IDs`
    } else if (modal == ModalBiographyComponent) {
      return $localize`:@@shared.editAriaLabelBiography:Manage your biography`
    } else if (modal == ModalNameComponent) {
      return $localize`:@@shared.editAriaLabelNames:Manage your names`
    } else {
      return $localize`:@@shared.editAriaLabel:Edit`
    }
  }
}
