import { Pipe, PipeTransform } from '@angular/core'

@Pipe({
    name: 'appPanelsCollapseAriaLabel',
    standalone: false
})
export class AppPanelsCollapseAriaLabelPipe implements PipeTransform {
  transform(panelType: any, args?: any, panelTitle?: any): string {
    if (panelType === 'employment') {
      return $localize`:@@shared.employmentCollapseAriaLabel:Collapse the Employment section`
    } else if (panelType === 'professional-activities') {
      return $localize`:@@shared.professionalActivitiesCollapseAriaLabel:Collapse the professional activities section`
    } else if (panelType === 'education' || panelType === 'qualification') {
      return $localize`:@@shared.educationQualificationCollapseAriaLabel:Collapse the Education and qualifications section`
    } else if (
      panelType === 'distinction' ||
      panelType === 'invited-position'
    ) {
      return $localize`:@@shared.distinctionInvitedPositionCollapseAriaLabel:Collapse the Invited positions and distinction section`
    } else if (panelType === 'membership' || panelType === 'service') {
      return $localize`:@@shared.membershipServiceCollapseAriaLabel:Collapse the Membership and service section`
    } else if (panelType === 'funding') {
      return $localize`:@@shared.fundingServiceCollapseAriaLabel:Collapse the Funding section`
    } else if (panelType === 'works') {
      return $localize`:@@shared.workServiceCollapseAriaLabel:Collapse the Works section`
    } else if (panelType === 'peer-review' || panelType === 'sub-peer-review') {
      if (panelTitle) {
        return (
          $localize`:@@shared.peerReviewCollapseAriaLabel:Collapse review activity for` +
          ' ' +
          panelTitle
        )
      } else {
        return $localize`:@@shared.peerReviewServiceCollapseAriaLabel:Collapse the Peer review section`
      }
    } else if (panelType === 'research-resources') {
      if (panelTitle) {
        return (
          $localize`:@@shared.researchResourceCollapseAriaLabel:Collapse the research resource` +
          ' ' +
          panelTitle
        )
      } else {
        return $localize`:@@shared.researchResourcesCollapseAriaLabel:Collapse the Research resources section`
      }
    } else if (panelType === 'top-bar' && args) {
      if (args === 'also-know-as') {
        return $localize`:@@shared.countriesCollapseOtherName:Collapse Other names`
      }
    } else if (panelType === 'side-bar' && args) {
      // emails-panel, websites-panel, personal-identifiers-panel, keywords-panel, countries-panel
      if (args === 'emails-panel') {
        return $localize`:@@shared.hideEmailDetailsAriaLabel:Hide email details`
      } else if (args === 'websites-panel') {
        return $localize`:@@shared.websiteCollapseAriaLabel:Collapse Website & Social links`
      } else if (args === 'personal-identifiers-panel') {
        return $localize`:@@shared.personalIdsCollapseAriaLabel:Collapse Personal identifiers`
      } else if (args === 'keywords-panel') {
        return $localize`:@@shared.keywordsCollapseAriaLabel:Collapse Keywords`
      } else if (args === 'countries-panel') {
        return $localize`:@@shared.countriesCollapseAriaLabel:Collapse Countries`
      }
    } else {
      return $localize`:@@shared.hideDetails:Hide details`
    }
  }
}
