import { Pipe, PipeTransform } from '@angular/core'

@Pipe({
  name: 'appPanelsExpandAriaLabel',
})
export class AppPanelsExpandAriaLabelPipe implements PipeTransform {
  transform(appType: any, args?: any): string {
    if (appType == 'employment') {
      return $localize`:@@shared.employmentExpandAriaLabel:Expand the Employment section`
    } else if (appType == 'education' || appType == 'qualification') {
      return $localize`:@@shared.educationQualificationExpandAriaLabel:Expand the Education and qualifications section`
    } else if (appType == 'distinction' || appType == 'invited-position') {
      return $localize`:@@shared.distinctionInvitedPositionExpandAriaLabel:Expand the Invited positions and distinction section`
    } else if (appType == 'membership' || appType == 'service') {
      return $localize`:@@shared.membershipServiceExpandAriaLabel:Expand the Membership and service section`
    } else if (appType == 'funding') {
      return $localize`:@@shared.fundingServiceExpandAriaLabel:Expand the Funding section`
    } else if (appType == 'works') {
      return $localize`:@@shared.workServiceExpandAriaLabel:Expand the Works section`
    } else if (appType == 'peer-review' || appType == 'sub-peer-review') {
      return $localize`:@@shared.peerReviewServiceExpandAriaLabel:Expand the Peer review section`
    } else {
      return $localize`:@@shared.showDetails:Show details`
    }
  }
}
