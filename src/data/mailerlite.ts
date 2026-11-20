/**
 * MailerLite embedded signup.
 *
 * Domain authentication for readygearhub.com is cleared. Embedded forms
 * go live once this flag is on and the embed is on the page; there is
 * no separate MailerLite publish switch.
 *
 * Account 2802221.
 * form / forms.default / forms.stormReminders = ReadyGearHub signup
 *   (Storm Readiness Reminder), slug PTvH32.
 * forms.communityUpdates = Local & Community Safety Updates signup, slug auxhRm.
 * Leave a slot as '' to hide that embed until the slug is ready.
 */
export const mailerlite = {
  enabled: true,
  account: '2802221',
  form: 'PTvH32',
  forms: {
    default: 'PTvH32',
    stormReminders: 'PTvH32',
    communityUpdates: 'auxhRm',
  },
} as const;

export type MailerLiteFormSlot = keyof typeof mailerlite.forms;
