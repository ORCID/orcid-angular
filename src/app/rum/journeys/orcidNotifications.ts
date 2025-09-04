/**
 * Merged journey for notifications. Replaces `orcid_with_notifications` and `orcid_without_notifications`.
 * Differentiate by `notificationsEnabled` in context.
 */
export interface OrcidNotificationsContext {
  notificationsEnabled: boolean
  inboxUnread: number
}

export interface OrcidNotificationsEventAttributes {
  // No specific event attributes currently used
}


