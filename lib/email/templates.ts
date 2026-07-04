import { emailLayout } from "./layout"

export function confirmSignupEmail(confirmUrl: string) {
  return {
    subject: "Confirm your Pak White Poultry account",
    html: emailLayout({
      preheader: "Confirm your email to start ordering fresh eggs.",
      heading: "Confirm your email",
      bodyHtml: `
        <p style="margin:0 0 12px 0;">Welcome to Pak White Poultry! Confirm your email address to
        finish setting up your account.</p>
      `,
      ctaLabel: "Confirm email",
      ctaUrl: confirmUrl,
      footerNote: "If you didn't create this account, you can safely ignore this email.",
    }),
  }
}

export function resetPasswordEmail(resetUrl: string) {
  return {
    subject: "Reset your Pak White Poultry password",
    html: emailLayout({
      preheader: "Reset your password — this link expires in 30 minutes.",
      heading: "Reset your password",
      bodyHtml: `
        <p style="margin:0 0 12px 0;">We got a request to reset the password on your account.
        Click below to choose a new one. This link expires in 30 minutes.</p>
      `,
      ctaLabel: "Reset password",
      ctaUrl: resetUrl,
      footerNote: "If you didn't request a password reset, you can safely ignore this email — your password won't change.",
    }),
  }
}

export function magicLinkEmail(loginUrl: string) {
  return {
    subject: "Your Pak White Poultry login link",
    html: emailLayout({
      preheader: "Click to log in — no password needed.",
      heading: "Log in to Pak White Poultry",
      bodyHtml: `
        <p style="margin:0 0 12px 0;">Click below to log in. This link expires shortly and can
        only be used once.</p>
      `,
      ctaLabel: "Log in",
      ctaUrl: loginUrl,
    }),
  }
}

export function emailChangeEmail(confirmUrl: string) {
  return {
    subject: "Confirm your new email address",
    html: emailLayout({
      preheader: "Confirm your new email address.",
      heading: "Confirm your new email",
      bodyHtml: `
        <p style="margin:0 0 12px 0;">Click below to confirm this is your new email address for
        your Pak White Poultry account.</p>
      `,
      ctaLabel: "Confirm new email",
      ctaUrl: confirmUrl,
      footerNote: "If you didn't request this change, contact support immediately.",
    }),
  }
}

export function inviteEmail(inviteUrl: string) {
  return {
    subject: "You've been invited to Pak White Poultry",
    html: emailLayout({
      preheader: "You've been invited to join Pak White Poultry.",
      heading: "You're invited",
      bodyHtml: `
        <p style="margin:0 0 12px 0;">You've been invited to join Pak White Poultry. Click below
        to accept and set up your account.</p>
      `,
      ctaLabel: "Accept invite",
      ctaUrl: inviteUrl,
    }),
  }
}