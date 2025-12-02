import { Pipe, PipeTransform } from '@angular/core'

@Pipe({
  name: 'appPanelsSortAriaLabel',
  standalone: false,
})
export class AppPanelsSortAriaLabelPipe implements PipeTransform {
  transform(panelType: any, disabled: boolean): string {
    let disabledStr = ''
    if (disabled) {
      disabledStr = ' ' + $localize`:@@shared.disabled:(Disabled)`
    }
    if (panelType === 'employment') {
      return (
        $localize`:@@shared.employmentSortAriaLabel:Sort your employment` +
        disabledStr
      )
    } else if (panelType === 'professional-activities') {
      return (
        $localize`:@@shared.sortProfessionalActivities:Sort your professional activities` +
        disabledStr
      )
    } else if (panelType === 'education' || panelType === 'qualification') {
      return (
        $localize`:@@shared.educationQualificationSortAriaLabel:Sort your education and qualifications` +
        disabledStr
      )
    } else if (
      panelType === 'distinction' ||
      panelType === 'invited-position'
    ) {
      return (
        $localize`:@@shared.distinctionInvitedPositionSortAriaLabel:Sort your invited positions and distinctions` +
        disabledStr
      )
    } else if (
      panelType === 'membership' ||
      panelType === 'service' ||
      panelType === 'editorial-service'
    ) {
      return (
        $localize`:@@shared.membershipServiceSortAriaLabel:Sort your membership and services` +
        disabledStr
      )
    } else if (panelType === 'funding') {
      return (
        $localize`:@@shared.fundingServiceSortAriaLabel:Sort your funding` +
        disabledStr
      )
    } else if (panelType === 'works') {
      return (
        $localize`:@@shared.workServiceSortAriaLabel:Sort your works` +
        disabledStr
      )
    } else if (panelType === 'peer-review') {
      return (
        $localize`:@@shared.peerReviewSortAriaLabel:Sort your peer reviews` +
        disabledStr
      )
    } else if (panelType === 'research-resources') {
      return (
        $localize`:@@shared.researchResourcesSortAriaLabel:Sort your research resources` +
        disabledStr
      )
    } else {
      return $localize`:@@shared.sort:Sort` + disabledStr
    }
  }
}
