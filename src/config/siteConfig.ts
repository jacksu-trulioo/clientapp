const title = "my-tfoco-com"
const domain = "my-tfoco-com"
const tagline = "Tagline"

const siteConfig = {
  title,
  tagline,
  url: `https://${domain}.com`,
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
  },
  whatsAppUrl: "https://api.whatsapp.com/send?phone=966534097700",
  inquiryEmail: "business.support@tfoco.com",
  tfoBahrainNumber: "+973 1757 8000",
  tfoKsaNumber: "+966 11 250 7720",
  customerServiceEmail: "n.albasri@tfoco.com",
  kycCustomerServiceEmail: "client.service@tfoco.com",
  kycCustomerServiceEmailKSA: "Onboarding-ksa@tfoco.com",
  kycCustomerServiceEmailOther: "Onboarding-bh@tfoco.com",
  supportEmail: "onboarding@tfoco.com",
  seo: {
    title,
    titleTemplate: `%s`,
    description: tagline,
    siteUrl: `https://${domain}.com`,
    openGraph: {
      type: "website",
      locale: "en_US",
      url: `https://${domain}.com`,
      title,
      description: tagline,
      site_name: `${title}: ${tagline}`,
      images: [
        {
          url: `https://${domain}.com/og-image.png`,
          width: 1240,
          height: 480,
          alt: `${title}: ${tagline}`,
        },
      ],
    },
  },
  featureFlags: {
    personalizedProposalEnabled:
      process.env.NEXT_PUBLIC_PERSONALIZED_PROPOSAL_ENABLED === "true",
    kycEnabled: process.env.NEXT_PUBLIC_KYC_ENABLED === "true",
    clientPortfolioActivityEnabled:
      process.env.NEXT_PUBLIC_CLIENT_PORTFOLIO_ACTIVITY_RNABLED === "true",
  },
  tfoWebsite: "https://www.tfoco.com/",
  tfoInfoVideoLinkEn:
    "https://a.storyblok.com/f/127566/x/4770bdc9ca/tfo-mvp-walk-through-english-no-logo_1108.mp4",
  tfoInfoVideoLinkAr:
    "https://a.storyblok.com/f/127566/x/fad761400a/tfo_mvp_walk-through_arabic_no_logos_1108.mp4",
  clientFeedbackSessionVariableName: "clientShowFeedbackBox",
  clientFeedbackSessionExpireDays: 7,
}

export default siteConfig
