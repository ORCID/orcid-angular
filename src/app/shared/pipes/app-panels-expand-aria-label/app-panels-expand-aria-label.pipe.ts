import { Pipe, PipeTransform } from '@angular/core'

@Pipe({
    name: 'appPanelsExpandAriaLabel',
    standalone: false
})
export class AppPanelsExpandAriaLabelPipe implements PipeTransform {
  transform(panelType: any, args?: any, panelTitle?: any): string {
    if (panelType === 'employment') {
      return $localize`:@@shared.employmentExpandAriaLabel:Expand the Employment section`
    } else if (panelType === 'professional-activities') {
      return $localize`:@@shared.professionalActivitiesExpandAriaLabel:Expand the professional activities section`
    } else if (panelType === 'education' || panelType === 'qualification') {
      return $localize`:@@shared.educationQualificationExpandAriaLabel:Expand the Education and qualifications section`
    } else if (
      panelType === 'distinction' ||
      panelType === 'invited-position'
    ) {
      return $localize`:@@shared.distinctionInvitedPositionExpandAriaLabel:Expand the Invited positions and distinction section`
    } else if (panelType === 'membership' || panelType === 'service') {
      return $localize`:@@shared.membershipServiceExpandAriaLabel:Expand the Membership and service section`
    } else if (panelType === 'funding') {
      return $localize`:@@shared.fundingServiceExpandAriaLabel:Expand the Funding section`
    } else if (panelType === 'works') {
      return $localize`:@@shared.workServiceExpandAriaLabel:Expand the Works section`
    } else if (panelType === 'peer-review' || panelType === 'sub-peer-review') {
      if (panelTitle) {
        return (
          $localize`:@@shared.peerReviewExpandAriaLabel:Expand review activity for` +
          ' ' +
          panelTitle
        )
      } else {
        return $localize`:@@shared.peerReviewServiceExpandAriaLabel:Expand the Peer review section`
      }
    } else if (panelType === 'research-resources') {
      if (panelTitle) {
        return (
          $localize`:@@shared.researchResourceExpandAriaLabel:Expand the research resource` +
          ' ' +
          panelTitle
        )
      } else {
        return $localize`:@@shared.researchResourcesExpandAriaLabel:Expand the Research resources section`
      }
    } else if (panelType === 'top-bar' && args) {
      if (args === 'also-know-as') {
        return $localize`:@@shared.countriesExpandOtherNames:Expand Other names`
      }
    } else if (panelType === 'side-bar' && args) {
      if (args === 'emails-panel') {
        return $localize`:@@shared.showEmailDetailsAriaLabel:Show email details`
      } else if (args === 'websites-panel') {
        return $localize`:@@shared.websiteExpandAriaLabel:Expand Website & Social links`
      } else if (args === 'personal-identifiers-panel') {
        return $localize`:@@shared.personalIdsExpandAriaLabel:Expand Personal identifiers`
      } else if (args === 'keywords-panel') {
        return $localize`:@@shared.keywordsExpandAriaLabel:Expand Keywords`
      } else if (args === 'countries-panel') {
        return $localize`:@@shared.countriesExpandAriaLabel:Expand Countries`
      }
    } else {
      return $localize`:@@shared.showDetails:Show details`
    }
  }
}
