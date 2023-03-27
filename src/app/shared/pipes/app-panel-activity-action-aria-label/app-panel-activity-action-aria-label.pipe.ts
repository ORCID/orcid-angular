import { Pipe, PipeTransform } from '@angular/core'
import {
  ITEM_ACTION_DELETE,
  ITEM_ACTION_EDIT,
  ITEM_ACTION_HIDE,
  ITEM_ACTION_SHOW,
  ITEM_ACTION_SELECT,
  ITEM_ACTION_EXPAND,
  ITEM_ACTION_COLLAPSE,
} from 'src/app/constants'

@Pipe({
  name: 'appPanelActivityActionAriaLabel',
})
export class AppPanelActivityActionAriaLabelPipe implements PipeTransform {
  transform(panelType: string, activity: string, title: string): string {
    let translationForAction = ''
    if (activity === ITEM_ACTION_DELETE) {
      translationForAction = $localize`:@@shared.deleteActivityAriaLabel:Delete`
    } else if (activity === ITEM_ACTION_EDIT) {
      translationForAction = $localize`:@@shared.editActivityAriaLabel:Edit`
    } else if (activity === ITEM_ACTION_SHOW) {
      translationForAction = $localize`:@@shared.activityShowDetailsAriaLabel:Show more details for`
    } else if (activity === ITEM_ACTION_HIDE) {
      translationForAction = $localize`:@@shared.activityHideDetailsAriaLabel:Hide details for`
    } else if (activity === ITEM_ACTION_SELECT) {
      translationForAction = $localize`:@@shared.activitySelectAriaLabel:Select`
    } else if (activity === ITEM_ACTION_EXPAND) {
      translationForAction = $localize`:@@shared.activityExpandAriaLabel:Expand`
    } else if (activity === ITEM_ACTION_COLLAPSE) {
      translationForAction = $localize`:@@shared.activityCollapseAriaLabel:Collapse`
    }

    if (panelType === 'employment') {
      translationForAction +=
        ' ' + $localize`:@@shared.employmentAriaLabel:employment`
    } else if (panelType === 'education') {
      translationForAction +=
        ' ' + $localize`:@@shared.educationAriaLabel:education`
    } else if (panelType === 'qualification') {
      translationForAction +=
        ' ' + $localize`:@@shared.qualificationAriaLabel:qualification`
    } else if (panelType === 'distinction') {
      translationForAction +=
        ' ' + $localize`:@@shared.distinctionAriaLabel:distinction`
    } else if (panelType === 'invited-position') {
      translationForAction +=
        ' ' + $localize`:@@shared.invitedPositionAriaLabel:invited position`
    } else if (panelType === 'membership') {
      translationForAction +=
        ' ' + $localize`:@@shared.membershipAriaLabel:membership`
    } else if (panelType === 'service') {
      translationForAction +=
        ' ' + $localize`:@@shared.serviceAriaLabel:service`
    } else if (panelType === 'funding') {
      translationForAction +=
        ' ' + $localize`:@@shared.fundingAriaLabel:funding`
    } else if (panelType === 'works') {
      translationForAction += ' ' + $localize`:@@shared.worksAriaLabel:work`
    } else if (panelType === 'work') {
      translationForAction += ' ' + $localize`:@@shared.workAriaLabel:work`
    } else if (panelType === 'peer-review' || panelType === 'sub-peer-review') {
      translationForAction +=
        ' ' + $localize`:@@shared.peerReviewAriaLabel:peer review`
    } else if (panelType === 'research-resources') {
      translationForAction +=
        ' ' +
        $localize`:@@shared.researchResourcesAriaLabel: research resources`
    }
    return title ? translationForAction + ' ' + title : translationForAction
  }
}
