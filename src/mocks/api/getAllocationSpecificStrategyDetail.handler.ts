import { rest } from "msw"

import siteConfig from "~/config"

const {
  api: { baseUrl },
} = siteConfig

function handler() {
  return rest.get(`${baseUrl}/portfolio/opportunities/:id`, (req, res, ctx) => {
    const createSpecificDealDetail = () => ({
      id: req.params.id,
      title: "Global Credit Fund",
      description:
        "An open-ended fund that provides access to U.S. senior secured credit and high-yield bonds, diversified across sectors and top- tier managers with strong credit selection.",
      image:
        "https://a.storyblok.com/f/127566/1920x481/c80e081298/global-credit-fund_banner-image.jpg",
      assetClass: "Credit",
      country: "Global",
      sector: "Diversified",
      isShariahCompliant: true,
      sponsor: "Multiple",
      expectedExit: "90 day notice",
      expectedReturn: "6% Yield",
      videoLink:
        "https://clientappmedia.s3-eu-west-1.amazonaws.com/Video/Global+Credit+Fund+by+Naji+TFO+ver.mp4",
      otherInfo: [
        {
          title: "New issuance",
          substances: [
            {
              description:
                "Taking advantage of new bond issuance, with stronger covenants and more attractive pricing.",
            },
          ],
        },
        {
          title: "Diversification",
          substances: [
            {
              description:
                "Diversified across multiple sectors, credit rating profiles, and maturities.",
            },
          ],
        },
        {
          title: "Yield distribution",
          substances: [
            {
              description:
                "Targeted cash yield between 5 and 6% paid quarterly",
            },
          ],
        },
      ],
    })

    return res(ctx.json(createSpecificDealDetail()))
  })
}

export default handler()
