import { Pipe, PipeTransform } from '@angular/core'

@Pipe({
  name: 'appPanelsAddAriaLabel',
})
export class AppPanelsAddAriaLabelPipe implements PipeTransform {
  transform(panelType: any, args?: any): string {
    if (panelType == 'employment') {
      return $localize`:@@shared.employmentAddAriaLabel:Add employment`
    } else if (panelType == 'education' || panelType == 'qualification') {
      return $localize`:@@shared.educationQualificationAddAriaLabel:Add education or qualification`
    } else if (panelType == 'distinction' || panelType == 'invited-position') {
      return $localize`:@@shared.distinctionInvitedPositionAddAriaLabel:Add invited position or distinction`
    } else if (panelType == 'membership' || panelType == 'service') {
      return $localize`:@@shared.membershipServiceAddAriaLabel:Add membership or service`
    } else if (panelType == 'funding') {
      return $localize`:@@shared.fundingServiceAddAriaLabel:Add funding`
    } else if (panelType == 'works') {
      return $localize`:@@shared.workServiceAddAriaLabel:Add a work`
    } else {
      /*else if (panelType == 'peer-review') {
      console.log("in peer-review")
      return $localize`:@@shared.peerReviewServiceCollapseAriaLabel:Collapse the Peer review section`
    }*/
      return $localize`:@@shared.add:Add`
    }
  }
}
