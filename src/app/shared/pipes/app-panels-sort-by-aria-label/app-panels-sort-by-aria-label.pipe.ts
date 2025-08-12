import { Pipe, PipeTransform } from '@angular/core'
import { SortOrderType } from '../../../types/sort'

@Pipe({
  name: 'appPanelsSortByAriaLabel',
  standalone: false,
})
export class AppPanelsSortByAriaLabelPipe implements PipeTransform {
  transform(sortBy: SortOrderType, type: string): string {
    switch (sortBy) {
      case 'title':
        return getTitleLabelByType(type)
      case 'start':
        return getStartDateLabelByType(type)
      case 'end':
        return getEndDateLabelByType(type)
      case 'date':
        return getDateLabelByType(type)
      case 'type':
        return getTypeLabelByType(type)
      case 'source':
        return getSourceLabelByType(type)
      case 'order':
        return $localize`:@@shared.peerReviewsSortOrderv2:Sort peer review by Publication/Grant title`
    }
  }
}

const getTitleLabelByType = (type: string): string => {
  switch (type) {
    case 'employment':
      return $localize`:@@shared.employmentSortTitle:Sort employment by title`
    case 'professional-activities':
      return $localize`:@@shared.professionalActivitiesSortTitle:Sort professional activities by title`
    case 'education':
    case 'qualification':
      return $localize`:@@shared.educationSortTitle:Sort education and qualifications by title`
    case 'distinction':
    case 'invited-position':
      return $localize`:@@shared.distinctionSortTitle:Sort invited positions and distinction by title`
    case 'membership':
    case 'service':
      return $localize`:@@shared.membershipSortTitle:Sort membership and service by title`
    case 'funding':
      return $localize`:@@shared.fundingSortTitle:Sort funding by title`
    case 'works':
      return $localize`:@@shared.worksSortTitle:Sort works by title`
    case 'research-resources':
      return $localize`:@@shared.researchSortTitle:Sort research resources by title`
  }
}

const getStartDateLabelByType = (type: string): string => {
  switch (type) {
    case 'employment':
      return $localize`:@@shared.employmentSortStart:Sort employment by start date`
    case 'professional-activities':
      return $localize`:@@shared.professionalActivitiesSortStart:Sort professional activities by start date`
    case 'education':
    case 'qualification':
      return $localize`:@@shared.educationSortStart:Sort education and qualifications by start date`
    case 'distinction':
    case 'invited-position':
      return $localize`:@@shared.distinctionSortStart:Sort invited positions and distinction by start date`
    case 'membership':
    case 'service':
      return $localize`:@@shared.membershipSortStart:Sort membership and service by start date`
  }
}

const getEndDateLabelByType = (type: string): string => {
  switch (type) {
    case 'employment':
      return $localize`:@@shared.employmentSortEnd:Sort employment by end date`
    case 'professional-activities':
      return $localize`:@@shared.professionalActivitiesSortEnd:Sort professional activities by end date`
    case 'education':
    case 'qualification':
      return $localize`:@@shared.educationSortEnd:Sort education and qualifications by end date`
    case 'distinction':
    case 'invited-position':
      return $localize`:@@shared.distinctionSortEnd:Sort invited positions and distinction by end date`
    case 'membership':
    case 'service':
      return $localize`:@@shared.membershipSortEnd:Sort membership and service by end date`
  }
}

const getTypeLabelByType = (type: string): string => {
  switch (type) {
    case 'professional-activities':
      return $localize`:@@shared.professionalActivitiesSortType:Sort professional activities by type`
    case 'funding':
      return $localize`:@@shared.fundingSortType:Sort funding by type`
    case 'works':
      return $localize`:@@shared.worksSortType:Sort works by type`
  }
}

const getDateLabelByType = (type: string): string => {
  switch (type) {
    case 'funding':
      return $localize`:@@shared.fundingSortDate:Sort funding by date`
    case 'works':
      return $localize`:@@shared.worksSortDate:Sort works by date`
    case 'research-resources':
      return $localize`:@@shared.researchSortDate:Sort research resources by date`
  }
}

const getSourceLabelByType = (type: string): string => {
  switch (type) {
    case 'employment':
      return $localize`:@@shared.employmentSortSource:Sort employment by source`
    case 'education':
    case 'qualification':
      return $localize`:@@shared.educationSortSource:Sort education and qualifications by source`
    case 'professional-activities':
      return $localize`:@@shared.professionalActivitiesSortSource:Sort professional activities by source`
    case 'funding':
      return $localize`:@@shared.fundingSortSource:Sort funding by source`
    case 'works':
      return $localize`:@@shared.worksSortSource:Sort works by source`
  }
}
