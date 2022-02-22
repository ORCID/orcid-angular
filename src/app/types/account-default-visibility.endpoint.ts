export interface AccountDefaultEmailFrequenciesEndpoint {
  send_quarterly_tips: 'true' | 'false'
  send_member_update_requests: EmailFrequenciesTime
  send_change_notifications: EmailFrequenciesTime
  send_administrative_change_notifications: EmailFrequenciesTime
}

export enum EmailFrequencies {
  immediately = 'immediately',
  daily = 'daily',
  weekly = 'weekly',
  quarterly = 'quarterly',
  never = 'never',
}

export enum EmailFrequenciesTime {
  immediately = '0.0',
  daily = '1.0',
  weekly = '7.0',
  quarterly = '91.3105',
  never = '3.4028235E38',
}

export const EmailFrequenciesValues = {
  [EmailFrequencies.immediately]: EmailFrequenciesTime.immediately,
  [EmailFrequencies.daily]: EmailFrequenciesTime.daily,
  [EmailFrequencies.weekly]: EmailFrequenciesTime.weekly,
  [EmailFrequencies.quarterly]: EmailFrequenciesTime.quarterly,
  [EmailFrequencies.never]: EmailFrequenciesTime.never,
}

export const EmailFrequenciesLabels = {
  [EmailFrequencies.immediately]: $localize`:@@account.immediately:Immediately`,
  [EmailFrequencies.daily]: $localize`:@@account.daily:Daily summary`,
  [EmailFrequencies.weekly]: $localize`:@@account.weekly:Weekly summary`,
  [EmailFrequencies.quarterly]: $localize`:@@account.quarterly:Quarterly summary`,
  [EmailFrequencies.never]: $localize`:@@account.never:Never`,
}
