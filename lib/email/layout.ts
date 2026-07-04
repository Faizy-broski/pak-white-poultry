const BRAND = {
  ivory: "#fdf6e3",
  navy: "#171d33",
  brass: "#c2650c",
  muted: "#4b5470",
  border: "#ecdfb8",
}

export function emailLayout({
  preheader,
  heading,
  bodyHtml,
  ctaLabel,
  ctaUrl,
  footerNote,
}: {
  preheader: string
  heading: string
  bodyHtml: string
  ctaLabel: string
  ctaUrl: string
  footerNote?: string
}) {
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${heading}</title>
  </head>
  <body style="margin:0;padding:0;background-color:${BRAND.ivory};font-family:Arial,Helvetica,sans-serif;">
    <span style="display:none;visibility:hidden;opacity:0;height:0;width:0;overflow:hidden;">
      ${preheader}
    </span>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${BRAND.ivory};padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="480" cellpadding="0" cellspacing="0" style="max-width:480px;width:100%;background-color:#ffffff;border-radius:16px;border:1px solid ${BRAND.border};overflow:hidden;">
            <tr>
              <td style="padding:28px 32px 0 32px;">
                <table role="presentation" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="width:32px;height:32px;background-color:${BRAND.brass};border-radius:8px;text-align:center;vertical-align:middle;">
                      <span style="color:#ffffff;font-size:16px;line-height:32px;">🥚</span>
                    </td>
                    <td style="padding-left:10px;font-size:16px;font-weight:700;color:${BRAND.navy};font-family:Georgia,'Times New Roman',serif;">
                      Pak White Poultry
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <tr>
              <td style="padding:24px 32px 8px 32px;">
                <h1 style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:22px;font-weight:700;color:${BRAND.navy};">
                  ${heading}
                </h1>
              </td>
            </tr>

            <tr>
              <td style="padding:0 32px 8px 32px;font-size:14px;line-height:22px;color:${BRAND.muted};">
                ${bodyHtml}
              </td>
            </tr>

            <tr>
              <td style="padding:20px 32px 32px 32px;">
                <table role="presentation" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="border-radius:9999px;background-color:${BRAND.brass};">
                      <a
                        href="${ctaUrl}"
                        style="display:inline-block;padding:12px 28px;font-size:14px;font-weight:700;color:#ffffff;text-decoration:none;border-radius:9999px;"
                      >
                        ${ctaLabel}
                      </a>
                    </td>
                  </tr>
                </table>
                <p style="margin:16px 0 0 0;font-size:12px;line-height:18px;color:${BRAND.muted};word-break:break-all;">
                  Or paste this link into your browser:<br />
                  <a href="${ctaUrl}" style="color:${BRAND.brass};">${ctaUrl}</a>
                </p>
              </td>
            </tr>

            <tr>
              <td style="padding:16px 32px 28px 32px;border-top:1px solid ${BRAND.border};">
                <p style="margin:0;font-size:12px;line-height:18px;color:${BRAND.muted};">
                  ${footerNote ?? "If you didn't request this, you can safely ignore this email."}
                </p>
              </td>
            </tr>
          </table>

          <p style="margin:20px 0 0 0;font-size:11px;color:${BRAND.muted};">
            © ${new Date().getFullYear()} Pak White Poultry. All rights reserved.
          </p>
        </td>
      </tr>
    </table>
  </body>
</html>`
}