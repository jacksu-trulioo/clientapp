import {
  exitExclusiveInsightsModal,
  exitExclusiveOppModal,
  exitHelpModal,
  exitInvestmentOppModal,
  exitPortfolioSimulatorModal,
  exitWebinarModal,
  openExclusiveInsightsModal,
  openExclusiveOppModal,
  openHelpModal,
  openInvestmentOppModal,
  openPortfolioSimulatorModal,
  openWebinarModal,
} from "~/utils/googleEvents"
import { event } from "~/utils/gtag"

const firstTimeTourNextClickEvents = [
  openExclusiveOppModal,
  openPortfolioSimulatorModal,
  openInvestmentOppModal,
  openWebinarModal,
  openExclusiveInsightsModal,
  openHelpModal,
]

const firstTimeTourModalExitEvents = [
  exitExclusiveOppModal,
  exitPortfolioSimulatorModal,
  exitInvestmentOppModal,
  exitWebinarModal,
  exitExclusiveInsightsModal,
  exitHelpModal,
]

export function triggerFirstTimeTourEvent(step: number, type?: string) {
  const eventType =
    type === "exit"
      ? firstTimeTourModalExitEvents[step]
      : firstTimeTourNextClickEvents[step]
  return event(eventType)
}
