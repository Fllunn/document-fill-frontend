export const getLinks = (siteUrl: string) => ({
  termsOfUse: {
    text: `${siteUrl}/documents/terms-of-use`,
    href: '/documents/terms-of-use',
  },
  privacyPolicy: {
    text: `${siteUrl}/documents/privacy-policy`,
    href: '/documents/privacy-policy',
  },
  domen: {
    text: siteUrl.replace('https://', '').replace('http://', ''),
    href: '/',
  },
  email: {
    text: 'support@documentfill.ru',
    href: 'mailto:support@documentfill.ru',
  },
})
