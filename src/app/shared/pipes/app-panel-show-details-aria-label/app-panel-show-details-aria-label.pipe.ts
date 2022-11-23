import { Pipe, PipeTransform } from '@angular/core'
import { ModalEmailComponent } from '../../../cdk/side-bar/modals/modal-email/modal-email.component'
import { ModalCountryComponent } from '../../../cdk/side-bar/modals/modal-country/modal-country.component'
import { ModalWebsitesComponent } from 'src/app/cdk/side-bar/modals/modal-websites/modal-websites.component'
import { ModalKeywordComponent } from 'src/app/cdk/side-bar/modals/modal-keyword/modal-keyword.component'
import { ModalPersonIdentifiersComponent } from 'src/app/cdk/side-bar/modals/modal-person-identifiers/modal-person-identifiers.component'
import { ModalNameComponent } from 'src/app/record/components/top-bar/modals/modal-name/modal-name.component'
import { ModalBiographyComponent } from 'src/app/record/components/top-bar/modals/modal-biography/modal-biography.component'
import {
  PANEL_TYPE_PLACEHOLDER,
  PANEL_TITLE_PLACEHOLDER,
} from 'src/app/constants'

@Pipe({
  name: 'appPanelShowDetailsAriaLabel',
})
export class AppPanelShowDetailsAriaLabelPipe implements PipeTransform {
  transform(panelType: string, title: string): string {
    let translationWithPlaceholders = $localize`:@@shared.activityShowDetailsAriaLabel:Show more details for %TYPE% %TITLE%`.replace(
      PANEL_TITLE_PLACEHOLDER,
      title
    )
    if (panelType == 'employment') {
      return translationWithPlaceholders.replace(
        PANEL_TYPE_PLACEHOLDER,
        $localize`:@@shared.employmentAriaLabel:employment`
      )
    } else if (panelType == 'education') {
      return translationWithPlaceholders.replace(
        PANEL_TYPE_PLACEHOLDER,
        $localize`:@@shared.educationAriaLabel:education`
      )
    } else if (panelType == 'qualification') {
      return translationWithPlaceholders.replace(
        PANEL_TYPE_PLACEHOLDER,
        $localize`:@@shared.qualificationAriaLabel:qualification`
      )
    } else if (panelType == 'distinction') {
      return translationWithPlaceholders.replace(
        PANEL_TYPE_PLACEHOLDER,
        $localize`:@@shared.distinctionAriaLabel:distinction`
      )
    } else if (panelType == 'invited-position') {
      return translationWithPlaceholders.replace(
        PANEL_TYPE_PLACEHOLDER,
        $localize`:@@shared.invitedPositionAriaLabel:invited position`
      )
    } else if (panelType == 'membership') {
      return translationWithPlaceholders.replace(
        PANEL_TYPE_PLACEHOLDER,
        $localize`:@@shared.membershipAriaLabel:membership`
      )
    } else if (panelType == 'service') {
      return translationWithPlaceholders.replace(
        PANEL_TYPE_PLACEHOLDER,
        $localize`:@@shared.serviceAriaLabel:service`
      )
    } else if (panelType == 'funding') {
      return translationWithPlaceholders.replace(
        PANEL_TYPE_PLACEHOLDER,
        $localize`:@@shared.fundingAriaLabel:funding`
      )
    } else if (panelType == 'works') {
      return translationWithPlaceholders.replace(
        PANEL_TYPE_PLACEHOLDER,
        $localize`:@@shared.worksAriaLabel:works`
      )
    } else if (panelType == 'work') {
      return translationWithPlaceholders.replace(
        PANEL_TYPE_PLACEHOLDER,
        $localize`:@@shared.workAriaLabel:work`
      )
    } else if (panelType == 'peer-review' || panelType == 'sub-peer-review') {
      return translationWithPlaceholders.replace(
        PANEL_TYPE_PLACEHOLDER,
        $localize`:@@shared.peerReviewAriaLabel:peer review`
      )
    } else {
      return $localize`:@@shared.hideDetails:Hide details`
    }
  }
}
