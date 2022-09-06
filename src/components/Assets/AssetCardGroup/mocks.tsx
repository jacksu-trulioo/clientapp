import BankIcon from "~/components/Icon/BankIcon"

import { AssetCardProps } from "../AssetCard/AssetCard"

export const assets: AssetCardProps[] = [
  {
    title: "Bank Account",
    description:
      "Current accounts, checque accounts, Savings account, Term deposit account and others.",
    icon: <BankIcon opacity={0.5} h={4} w={4} />,
  },
  {
    title: "Real Estate",
    description:
      "Residential and commercial real estate as well as investments in construction projects, parking spots and land.",
    icon: <BankIcon opacity={0.5} h={4} w={4} />,
  },
  {
    title: "Commodities",
    description: "Precious stones and metals as well as jewellery",
    icon: <BankIcon opacity={0.5} h={4} w={4} />,
  },
  {
    title: "Listed Assets",
    description: "Stocks, ETF, Bond and Mutual fund investments",
    icon: <BankIcon opacity={0.5} h={4} w={4} />,
  },
  {
    title: "Startup / SME",
    description: "Investments made in companies local & global",
    icon: <BankIcon opacity={0.5} h={4} w={4} />,
  },
  {
    title: "Crypto",
    description: "Investment in a cryto currency or exchange",
    icon: <BankIcon opacity={0.5} h={4} w={4} />,
  },
  {
    title: "Insurance",
    description: "Life and health insurance cover",
    icon: <BankIcon opacity={0.5} h={4} w={4} />,
  },
  {
    title: "Others",
    description: "Uncategorized alternative investments",
    icon: <BankIcon opacity={0.5} h={4} w={4} />,
  },
]
