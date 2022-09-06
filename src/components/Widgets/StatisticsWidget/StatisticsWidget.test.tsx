import React from "react"

import PieChart from "~/components/PieChart/PieChart"
import { render } from "~/utils/testHelpers"

import { fakePortfolioData } from "./mocks"
import StatisticsWidgetPercentages from "./StatisticsWidgetPercentages"

describe("StatisticsWidget", () => {
  test("it renders correctly", async () => {
    render(
      <>
        <PieChart data={fakePortfolioData} />
        <StatisticsWidgetPercentages items={fakePortfolioData} />
      </>,
    )
  })
})
