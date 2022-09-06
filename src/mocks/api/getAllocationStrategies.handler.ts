import { DefaultRequestBody, rest } from "msw"

import siteConfig from "~/config"
import { SampleDeals } from "~/services/mytfo/types"

const {
  api: { baseUrl },
} = siteConfig

function handler() {
  return rest.get<DefaultRequestBody, SampleDeals>(
    `${baseUrl}/portfolio/strategy/:id`,
    (req, res, ctx) => {
      let capitalGrowthDeals = [
        {
          assetClass: "Private Credit",
          assets: [
            {
              src: "https://a.storyblok.com/f/127566/3200x1000/dbb455f2d3/web-banner-invest-vs-save.jpg",
              auditor: "KPMG",
              title: "KPMG",
              description:
                "An open-ended fund that provides access to U.S. senior secured credit and high-yield bonds, diversified across sectors and top- tier managers with strong credit selection.",
              assetManager: "Multiple",
              assetClass: "Credit",
              expectedReturn: "6% Yield",
              sector: "14",
              country: "India",
              expectedExit: "2034",
              id: "1009",
            },
            {
              src: "https://a.storyblok.com/f/127566/3200x1000/9045cee8c0/web-banner-1600x500-protecting-wealth-from-inflation.jpg",
              auditor: "PWC",
              title: "PWC",
              description:
                "An open-ended fund that provides access to U.S. senior .",
              assetManager: "Multiple",
              assetClass: "Credit",
              expectedReturn: "6% Yield",
              sector: "14",
              country: "India",
              expectedExit: "2034",
              id: "1010",
            },
            {
              src: "https://a.storyblok.com/f/127566/3200x1000/dbb455f2d3/web-banner-invest-vs-save.jpg",
              auditor: "Delloite",
              title: "Delloite",
              description:
                "An open-ended fund that provides access to U.S. senior .",
              assetManager: "Multiple",
              assetClass: "Credit",
              expectedReturn: "6% Yield",
              sector: "14",
              country: "India",
              expectedExit: "2034",
              id: "1011",
            },
          ],
        },
        {
          assetClass: "Real Estate",
          assets: [
            {
              src: "https://a.storyblok.com/f/127566/3200x1000/dbb455f2d3/web-banner-invest-vs-save.jpg",
              auditor: "JLJ",
              title: "JLJ",
              description:
                "An open-ended fund that provides access to U.S. senior secured credit and high-yield bonds, diversified across sectors and top- tier managers with strong credit selection.",
              assetManager: "Multiple",
              assetClass: "Real Estate",
              expectedReturn: "6% Yield",
              sector: "14",
              country: "India",
              expectedExit: "2034",
              id: "1012",
            },
            {
              src: "https://a.storyblok.com/f/127566/3200x1000/9045cee8c0/web-banner-1600x500-protecting-wealth-from-inflation.jpg",
              auditor: "DLF",
              title: "DLF",
              description:
                "An open-ended fund that provides access to U.S. senior .",
              assetManager: "Multiple",
              assetClass: "Real Estate",
              expectedReturn: "6% Yield",
              sector: "14",
              country: "India",
              expectedExit: "2034",
              id: "1013",
            },
            {
              src: "https://a.storyblok.com/f/127566/3200x1000/dbb455f2d3/web-banner-invest-vs-save.jpg",
              auditor: "PURI",
              title: "PURI",
              description:
                "An open-ended fund that provides access to U.S. senior .",
              assetManager: "Multiple",
              assetClass: "Real Estate",
              expectedReturn: "6% Yield",
              sector: "14",
              country: "India",
              expectedExit: "2034",
              id: "1014",
            },
          ],
        },
        {
          assetClass: "Private Equity",
          assets: [
            {
              src: "https://a.storyblok.com/f/127566/3200x1000/dbb455f2d3/web-banner-invest-vs-save.jpg",
              auditor: "ICICI",
              title: "ICICI",
              description:
                "An open-ended fund that provides access to U.S. senior secured credit and high-yield bonds, diversified across sectors and top- tier managers with strong credit selection.",
              assetManager: "Multiple",
              assetClass: "Private Equity",
              expectedReturn: "6% Yield",
              sector: "14",
              country: "India",
              expectedExit: "2034",
              id: "1015",
            },
            {
              src: "https://a.storyblok.com/f/127566/3200x1000/9045cee8c0/web-banner-1600x500-protecting-wealth-from-inflation.jpg",
              auditor: "HDFC",
              title: "HDFC",
              description:
                "An open-ended fund that provides access to U.S. senior .",
              assetManager: "Multiple",
              assetClass: "Private Equity",
              expectedReturn: "6% Yield",
              sector: "14",
              country: "India",
              expectedExit: "2034",
              id: "1016",
            },
            {
              src: "https://a.storyblok.com/f/127566/3200x1000/dbb455f2d3/web-banner-invest-vs-save.jpg",
              auditor: "KOTAK",
              title: "KOTAK",
              description:
                "An open-ended fund that provides access to U.S. senior .",
              assetManager: "Multiple",
              assetClass: "Private Equity",
              expectedReturn: "6% Yield",
              sector: "14",
              country: "India",
              expectedExit: "2034",
              id: "1017",
            },
          ],
        },
      ]

      if (req.params.id === "Capital%20Growth") {
        // @ts-ignore
        return res(ctx.json(capitalGrowthDeals))
      }

      let capitalYieldDeals = [
        {
          assetClass: "Private Credit",
          assets: [
            {
              src: "https://a.storyblok.com/f/127566/3200x1000/dbb455f2d3/web-banner-invest-vs-save.jpg",
              auditor: "YesValue",
              title: "YesValue",
              description:
                "An open-ended fund that provides access to U.S. senior secured credit and high-yield bonds, diversified across sectors and top- tier managers with strong credit selection.",
              assetManager: "Multiple",
              assetClass: "Credit",
              expectedReturn: "6% Yield",
              sector: "14",
              country: "India",
              expectedExit: "2034",
              id: "1009",
            },
            {
              src: "https://a.storyblok.com/f/127566/3200x1000/9045cee8c0/web-banner-1600x500-protecting-wealth-from-inflation.jpg",
              auditor: "IPC",
              title: "IPC",
              description:
                "An open-ended fund that provides access to U.S. senior .",
              assetManager: "Multiple",
              assetClass: "Credit",
              expectedReturn: "6% Yield",
              sector: "14",
              country: "India",
              expectedExit: "2034",
              id: "1010",
            },
            {
              src: "https://a.storyblok.com/f/127566/3200x1000/dbb455f2d3/web-banner-invest-vs-save.jpg",
              auditor: "ACUITY",
              title: "ACUITY",
              description:
                "An open-ended fund that provides access to U.S. senior .",
              assetManager: "Multiple",
              assetClass: "Credit",
              expectedReturn: "6% Yield",
              sector: "14",
              country: "India",
              expectedExit: "2034",
              id: "1011",
            },
          ],
        },
        {
          assetClass: "Real Estate",
          assets: [
            {
              src: "https://a.storyblok.com/f/127566/3200x1000/dbb455f2d3/web-banner-invest-vs-save.jpg",
              auditor: "Pratham",
              title: "Pratham",
              description:
                "An open-ended fund that provides access to U.S. senior secured credit and high-yield bonds, diversified across sectors and top- tier managers with strong credit selection.",
              assetManager: "Multiple",
              assetClass: "Real Estate",
              expectedReturn: "6% Yield",
              sector: "14",
              country: "India",
              expectedExit: "2034",
              id: "1012",
            },
            {
              src: "https://a.storyblok.com/f/127566/3200x1000/9045cee8c0/web-banner-1600x500-protecting-wealth-from-inflation.jpg",
              auditor: "BPTP",
              title: "BPTP",
              description:
                "An open-ended fund that provides access to U.S. senior .",
              assetManager: "Multiple",
              assetClass: "Real Estate",
              expectedReturn: "6% Yield",
              sector: "14",
              country: "India",
              expectedExit: "2034",
              id: "1013",
            },
            {
              src: "https://a.storyblok.com/f/127566/3200x1000/dbb455f2d3/web-banner-invest-vs-save.jpg",
              auditor: "SRS",
              title: "SRS",
              description:
                "An open-ended fund that provides access to U.S. senior .",
              assetManager: "Multiple",
              assetClass: "Real Estate",
              expectedReturn: "6% Yield",
              sector: "14",
              country: "India",
              expectedExit: "2034",
              id: "1014",
            },
          ],
        },
        {
          assetClass: "Private Equity",
          assets: [
            {
              src: "https://a.storyblok.com/f/127566/3200x1000/dbb455f2d3/web-banner-invest-vs-save.jpg",
              auditor: "FEDERAL",
              title: "FEDERAL",
              description:
                "An open-ended fund that provides access to U.S. senior secured credit and high-yield bonds, diversified across sectors and top- tier managers with strong credit selection.",
              assetManager: "Multiple",
              assetClass: "Private Equity",
              expectedReturn: "6% Yield",
              sector: "14",
              country: "India",
              expectedExit: "2034",
              id: "1015",
            },
            {
              src: "https://a.storyblok.com/f/127566/3200x1000/9045cee8c0/web-banner-1600x500-protecting-wealth-from-inflation.jpg",
              auditor: "BOB",
              title: "BOB",
              description:
                "An open-ended fund that provides access to U.S. senior .",
              assetManager: "Multiple",
              assetClass: "Private Equity",
              expectedReturn: "6% Yield",
              sector: "14",
              country: "India",
              expectedExit: "2034",
              id: "1016",
            },
            {
              src: "https://a.storyblok.com/f/127566/3200x1000/dbb455f2d3/web-banner-invest-vs-save.jpg",
              auditor: "SBI",
              title: "SBI",
              description:
                "An open-ended fund that provides access to U.S. senior .",
              assetManager: "Multiple",
              assetClass: "Private Equity",
              expectedReturn: "6% Yield",
              sector: "14",
              country: "India",
              expectedExit: "2034",
              id: "1017",
            },
          ],
        },
      ]

      let Opportunistic = [
        {
          assetClass: " -",
          assets: [
            {
              id: "Fund_Underwriting Fund",
              title: "Underwriting Fund",
              assetManager: "",
              preferences: "",
              expectedExit: "N/A",
              expectedReturn: "",
              country: "Global",
              sector: "",
              bannerImage: "",
              videoLink: "",
              description:
                "Underwriting fund aims to provide short-term investment capital to fund private investments made by various funds sub advised by The Family Office, while such funds are raising additional long-term capital.",
              targetReturn:
                "Class-B (2- years maturity): 3 month LIBOR + 3% p.a. Class-C (1 year maturity): 3 month LIBOR + 2% p.a.",
              targetYield:
                "Class-B (2- years maturity): 3 month LIBOR + 3% p.a. Class-C (1 year maturity): 3 month LIBOR + 2% p.a.",
              fundTerm:
                "Immediate deployment\nClass-B: Holding / Investment Period: 2 years\nClass-C: Holding / Investment Period: 1 year",
              administrator: "Apex",
              auditor: "KPMG",
              assetClass: " -",
              shareClasses:
                "Class A: equity class reserved to TFO Share Class B and Share Class C: available for TFO clients",
              redemptions:
                "Generally, redemption will be at the end  of the term. Or the Fund may redeem at  any given time by providing 30 days  notice.",
              offeringPeriod: "Open ended",
            },
            {
              id: "Fund_Underwriting Fund",
              title: "Underwriting Fund",
              assetManager: "",
              preferences: "",
              expectedExit: "N/A",
              expectedReturn: "",
              country: "Global",
              sector: "",
              bannerImage: "",
              videoLink: "",
              description:
                "Underwriting fund aims to provide short-term investment capital to fund private investments made by various funds sub advised by The Family Office, while such funds are raising additional long-term capital.",
              targetReturn:
                "Class-B (2- years maturity): 3 month LIBOR + 3% p.a. Class-C (1 year maturity): 3 month LIBOR + 2% p.a.",
              targetYield:
                "Class-B (2- years maturity): 3 month LIBOR + 3% p.a. Class-C (1 year maturity): 3 month LIBOR + 2% p.a.",
              fundTerm:
                "Immediate deployment\nClass-B: Holding / Investment Period: 2 years\nClass-C: Holding / Investment Period: 1 year",
              administrator: "Apex",
              auditor: "KPMG",
              assetClass: " -",
              shareClasses:
                "Class A: equity class reserved to TFO Share Class B and Share Class C: available for TFO clients",
              redemptions:
                "Generally, redemption will be at the end  of the term. Or the Fund may redeem at  any given time by providing 30 days  notice.",
              offeringPeriod: "Open ended",
            },
            {
              id: "Fund_Underwriting Fund",
              title: "Underwriting Fund",
              assetManager: "",
              preferences: "",
              expectedExit: "N/A",
              expectedReturn: "",
              country: "Global",
              sector: "",
              bannerImage: "",
              videoLink: "",
              description:
                "Underwriting fund aims to provide short-term investment capital to fund private investments made by various funds sub advised by The Family Office, while such funds are raising additional long-term capital.",
              targetReturn:
                "Class-B (2- years maturity): 3 month LIBOR + 3% p.a. Class-C (1 year maturity): 3 month LIBOR + 2% p.a.",
              targetYield:
                "Class-B (2- years maturity): 3 month LIBOR + 3% p.a. Class-C (1 year maturity): 3 month LIBOR + 2% p.a.",
              fundTerm:
                "Immediate deployment\nClass-B: Holding / Investment Period: 2 years\nClass-C: Holding / Investment Period: 1 year",
              administrator: "Apex",
              auditor: "KPMG",
              assetClass: " -",
              shareClasses:
                "Class A: equity class reserved to TFO Share Class B and Share Class C: available for TFO clients",
              redemptions:
                "Generally, redemption will be at the end  of the term. Or the Fund may redeem at  any given time by providing 30 days  notice.",
              offeringPeriod: "Open ended",
            },
          ],
        },
        {
          assetClass: "Fixed Income (Sukuks)",
          assets: [
            {
              id: "Fund_SukukVest",
              title: "SukukVest",
              assetManager: "",
              preferences: "",
              expectedExit: "N/A",
              expectedReturn: "",
              country: "Global",
              sector: "",
              bannerImage: "",
              videoLink: "",
              description:
                "SukukVest is an open ended fund that aims to construct a diversified portfolio of Sukuks across sovereign, government backed and corporate entities of  investment-grade quality. The investments are diversified across the MENA region and Asia.\nThe fund is a cash preservation vehicle.",
              targetReturn: "Cash + 1% -2%",
              targetYield: "",
              fundTerm:
                "- Immediate deployment with respect to a weekly subscription schedule\n- Total investment period is open-ended\n- Suitable for use as a pre-funding / cash preservation vehicle",
              administrator: "Apex",
              auditor: "KPMG",
              assetClass: "Fixed Income (Sukuks)",
              shareClasses:
                "Investment Class: Share Class A, Share Class B Cash Class: Share Class C",
              redemptions: "Weekly redemptions",
              offeringPeriod: "Open ended",
            },
          ],
        },
        {
          assetClass: "Fixed Income",
          assets: [
            {
              id: "Fund_BondVest",
              title: "BondVest",
              assetManager: "",
              preferences: "",
              expectedExit: "N/A",
              expectedReturn: "",
              country: "Global",
              sector: "",
              bannerImage: "",
              videoLink: "",
              description:
                "BondVest is an open ended fund that aims to construct a diversified global fixed income portfolio of average investment-grade quality. The fund is a cash preservation vehicle and will maintain a shorter duration bias to minimize sensitivity to interest rates.",
              targetReturn: "Cash + 1% -2%",
              targetYield: "",
              fundTerm:
                "- Immediate deployment with respect to a weekly subscription schedule\n- Total investment period is open-ended\n- Suitable for use as a pre-funding / cash preservation vehicle",
              administrator: "Apex",
              auditor: "KPMG",
              assetClass: "Fixed Income",
              shareClasses:
                "Investment Class: Share Class  A, Share Class B Cash Class: Share Class C",
              redemptions: "Weekly redemptions",
              offeringPeriod: "Open ended",
            },
          ],
        },
      ]

      let AbsoluteReturn = [
        {
          assetClass: " -",
          assets: [
            {
              id: "Fund_Underwriting Fund",
              title: "New Fund1",
              assetManager: "",
              preferences: "",
              expectedExit: "N/A",
              expectedReturn: "",
              country: "Global",
              sector: "",
              bannerImage: "",
              videoLink: "",
              description:
                "Underwriting fund aims to provide short-term investment capital to fund private investments made by various funds sub advised by The Family Office, while such funds are raising additional long-term capital.",
              targetReturn:
                "Class-B (2- years maturity): 3 month LIBOR + 3% p.a. Class-C (1 year maturity): 3 month LIBOR + 2% p.a.",
              targetYield:
                "Class-B (2- years maturity): 3 month LIBOR + 3% p.a. Class-C (1 year maturity): 3 month LIBOR + 2% p.a.",
              fundTerm:
                "Immediate deployment\nClass-B: Holding / Investment Period: 2 years\nClass-C: Holding / Investment Period: 1 year",
              administrator: "Apex",
              auditor: "KPMG",
              assetClass: " -",
              shareClasses:
                "Class A: equity class reserved to TFO Share Class B and Share Class C: available for TFO clients",
              redemptions:
                "Generally, redemption will be at the end  of the term. Or the Fund may redeem at  any given time by providing 30 days  notice.",
              offeringPeriod: "Open ended",
            },
            {
              id: "Fund_Underwriting Fund",
              title: "New Fund2",
              assetManager: "",
              preferences: "",
              expectedExit: "N/A",
              expectedReturn: "",
              country: "Global",
              sector: "",
              bannerImage: "",
              videoLink: "",
              description:
                "Underwriting fund aims to provide short-term investment capital to fund private investments made by various funds sub advised by The Family Office, while such funds are raising additional long-term capital.",
              targetReturn:
                "Class-B (2- years maturity): 3 month LIBOR + 3% p.a. Class-C (1 year maturity): 3 month LIBOR + 2% p.a.",
              targetYield:
                "Class-B (2- years maturity): 3 month LIBOR + 3% p.a. Class-C (1 year maturity): 3 month LIBOR + 2% p.a.",
              fundTerm:
                "Immediate deployment\nClass-B: Holding / Investment Period: 2 years\nClass-C: Holding / Investment Period: 1 year",
              administrator: "Apex",
              auditor: "KPMG",
              assetClass: " -",
              shareClasses:
                "Class A: equity class reserved to TFO Share Class B and Share Class C: available for TFO clients",
              redemptions:
                "Generally, redemption will be at the end  of the term. Or the Fund may redeem at  any given time by providing 30 days  notice.",
              offeringPeriod: "Open ended",
            },
            {
              id: "Fund_Underwriting Fund",
              title: "New Fund3",
              assetManager: "",
              preferences: "",
              expectedExit: "N/A",
              expectedReturn: "",
              country: "Global",
              sector: "",
              bannerImage: "",
              videoLink: "",
              description:
                "Underwriting fund aims to provide short-term investment capital to fund private investments made by various funds sub advised by The Family Office, while such funds are raising additional long-term capital.",
              targetReturn:
                "Class-B (2- years maturity): 3 month LIBOR + 3% p.a. Class-C (1 year maturity): 3 month LIBOR + 2% p.a.",
              targetYield:
                "Class-B (2- years maturity): 3 month LIBOR + 3% p.a. Class-C (1 year maturity): 3 month LIBOR + 2% p.a.",
              fundTerm:
                "Immediate deployment\nClass-B: Holding / Investment Period: 2 years\nClass-C: Holding / Investment Period: 1 year",
              administrator: "Apex",
              auditor: "KPMG",
              assetClass: " -",
              shareClasses:
                "Class A: equity class reserved to TFO Share Class B and Share Class C: available for TFO clients",
              redemptions:
                "Generally, redemption will be at the end  of the term. Or the Fund may redeem at  any given time by providing 30 days  notice.",
              offeringPeriod: "Open ended",
            },
          ],
        },
        {
          assetClass: "Fixed Income (Sukuks)",
          assets: [
            {
              id: "Fund_SukukVest",
              title: "New Fund4",
              assetManager: "",
              preferences: "",
              expectedExit: "N/A",
              expectedReturn: "",
              country: "Global",
              sector: "",
              bannerImage: "",
              videoLink: "",
              description:
                "SukukVest is an open ended fund that aims to construct a diversified portfolio of Sukuks across sovereign, government backed and corporate entities of  investment-grade quality. The investments are diversified across the MENA region and Asia.\nThe fund is a cash preservation vehicle.",
              targetReturn: "Cash + 1% -2%",
              targetYield: "",
              fundTerm:
                "- Immediate deployment with respect to a weekly subscription schedule\n- Total investment period is open-ended\n- Suitable for use as a pre-funding / cash preservation vehicle",
              administrator: "Apex",
              auditor: "KPMG",
              assetClass: "Fixed Income (Sukuks)",
              shareClasses:
                "Investment Class: Share Class A, Share Class B Cash Class: Share Class C",
              redemptions: "Weekly redemptions",
              offeringPeriod: "Open ended",
            },
          ],
        },
        {
          assetClass: "Fixed Income",
          assets: [
            {
              id: "Fund_BondVest",
              title: "New Fund5",
              assetManager: "",
              preferences: "",
              expectedExit: "N/A",
              expectedReturn: "",
              country: "Global",
              sector: "",
              bannerImage: "",
              videoLink: "",
              description:
                "BondVest is an open ended fund that aims to construct a diversified global fixed income portfolio of average investment-grade quality. The fund is a cash preservation vehicle and will maintain a shorter duration bias to minimize sensitivity to interest rates.",
              targetReturn: "Cash + 1% -2%",
              targetYield: "",
              fundTerm:
                "- Immediate deployment with respect to a weekly subscription schedule\n- Total investment period is open-ended\n- Suitable for use as a pre-funding / cash preservation vehicle",
              administrator: "Apex",
              auditor: "KPMG",
              assetClass: "Fixed Income",
              shareClasses:
                "Investment Class: Share Class  A, Share Class B Cash Class: Share Class C",
              redemptions: "Weekly redemptions",
              offeringPeriod: "Open ended",
            },
          ],
        },
      ]

      if (req.params.id === "Absolute%20return") {
        // @ts-ignore
        return res(ctx.json(AbsoluteReturn))
      }

      if (req.params.id === "Opportunistic") {
        // @ts-ignore
        return res(ctx.json(Opportunistic))
      }

      if (req.params.id === "Capital%20Yielding") {
        // @ts-ignore
        return res(ctx.json(capitalYieldDeals))
      }
    },
  )
}

export default handler()
