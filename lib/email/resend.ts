import { Resend } from "resend"

export const resend = new Resend(process.env.RESEND_API_KEY)

// e.g. "Pak White Poultry <noreply@pakwhitepoultry.pk>" — the domain must be
// verified in your Resend account before this will send from it.
export const EMAIL_FROM = process.env.EMAIL_FROM ?? "Pak White Poultry <onboarding@resend.dev>"