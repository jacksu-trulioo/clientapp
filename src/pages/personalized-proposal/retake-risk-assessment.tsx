import React from "react"

import withPageAuthRequired from "~/utils/withPageAuthRequired"

import RiskAssessmentScreen from "../proposal/risk-assessment"

function RiskAssessment() {
  return <RiskAssessmentScreen />
}

export default withPageAuthRequired(RiskAssessment)
