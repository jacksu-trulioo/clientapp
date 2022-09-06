export const PerformanceDetailsSchema = {
  definitions: {
    PerformanceCumulativeChange: {
      properties: {
        change: {
          type: "number",
        },
        timeperiod: {
          properties: {
            toDate: {
              type: "string",
            },
          },
          required: ["toDate"],
          type: "object",
        },
      },
      required: ["change", "timeperiod"],
      type: "object",
    },
  },
  properties: {
    dataForPeriods: {
      items: {
        properties: {
          additions: {
            type: "number",
          },
          annualizedIlliquidPerformance: {
            properties: {
              direction: {
                type: "string",
              },
              percent: {
                type: "number",
              },
            },
            required: ["direction", "percent"],
            type: "object",
          },
          annualizedPerformance: {
            type: "number",
          },
          avgHoldingPeriod: {
            type: "number",
          },
          chartPerformance: {
            properties: {
              cumulativeChanges: {
                items: {
                  $ref: "#/definitions/PerformanceCumulativeChange",
                },
                type: "array",
              },
              end: {
                properties: {
                  month: {
                    type: ["number", "null"],
                  },
                  year: {
                    type: "number",
                  },
                },
                required: ["month", "year"],
                type: "object",
              },
              percentChanges: {
                items: {
                  properties: {
                    change: {
                      type: "number",
                    },
                    timeperiod: {
                      properties: {
                        month: {
                          type: "number",
                        },
                        year: {
                          type: "number",
                        },
                      },
                      required: ["month", "year"],
                      type: "object",
                    },
                  },
                  required: ["change", "timeperiod"],
                  type: "object",
                },
                type: "array",
              },
              start: {
                properties: {
                  month: {
                    type: ["number", "null"],
                  },
                  year: {
                    type: "number",
                  },
                },
                required: ["month", "year"],
                type: "object",
              },
            },
            required: ["cumulativeChanges", "end", "percentChanges", "start"],
            type: "object",
          },
          cumulativePerformanceStart: {
            properties: {
              timeperiod: {
                properties: {
                  quarter: {
                    type: ["number", "null"],
                  },
                  year: {
                    type: "number",
                  },
                },
                required: ["quarter", "year"],
                type: "object",
              },
              value: {
                type: "number",
              },
            },
            required: ["timeperiod", "value"],
            type: "object",
          },
          illiquidValue: {
            properties: {
              direction: {
                type: "string",
              },
              percent: {
                type: "number",
              },
            },
            required: ["direction", "percent"],
            type: "object",
          },
          illiquidValuePerAnnum: {
            type: "number",
          },
          illiquidVintage: {
            properties: {
              direction: {
                type: "string",
              },
              percent: {
                type: "number",
              },
            },
            required: ["direction", "percent"],
            type: "object",
          },
          illiquidVintagePerAnnum: {
            type: "number",
          },
          itdAnnualizedPercent: {
            properties: {
              direction: {
                type: "string",
              },
              percent: {
                type: "number",
              },
            },
            required: ["direction", "percent"],
            type: "object",
          },
          itdAnnualizedPercentPerAnnum: {
            type: "number",
          },
          itdIlliquidPerformance: {
            properties: {
              direction: {
                type: "string",
              },
              percent: {
                type: "number",
              },
            },
            required: ["direction", "percent"],
            type: "object",
          },
          last12MonthsValue: {
            properties: {
              direction: {
                type: "string",
              },
              percent: {
                type: "number",
              },
            },
            required: ["direction", "percent"],
            type: "object",
          },
          liquidValue: {
            properties: {
              direction: {
                type: "string",
              },
              percent: {
                type: "number",
              },
            },
            required: ["direction", "percent"],
            type: "object",
          },
          liquidValuePerAnnum: {
            type: "number",
          },
          netChangePercent: {
            properties: {
              direction: {
                type: "string",
              },
              percent: {
                type: "number",
              },
            },
            required: ["direction", "percent"],
            type: "object",
          },
          netChangeValue: {
            properties: {
              direction: {
                type: "string",
              },
              money: {
                type: "number",
              },
            },
            required: ["direction", "money"],
            type: "object",
          },
          periodicPerformance: {
            items: {
              properties: {
                additionsOrWithdrawels: {
                  type: "number",
                },
                cumulativePerformancePercent: {
                  type: "number",
                },
                cumulativePerformanceValue: {
                  type: "number",
                },
                netChange: {
                  type: "number",
                },
                performance: {
                  type: "number",
                },
                period: {
                  properties: {
                    month: {
                      type: ["number", "null"],
                    },
                    year: {
                      type: "number",
                    },
                  },
                  required: ["month", "year"],
                  type: "object",
                },
              },
              required: [
                "additionsOrWithdrawels",
                "cumulativePerformancePercent",
                "cumulativePerformanceValue",
                "netChange",
                "performance",
                "period",
              ],
              type: "object",
            },
            type: "array",
          },
          riskVolatility: {
            type: "number",
          },
          sharpeRatio: {
            type: "number",
          },
          timeperiod: {
            properties: {
              quarter: {
                type: ["number", "null"],
              },
              year: {
                type: ["number", "null"],
              },
            },
            required: ["quarter", "year"],
            type: "object",
          },
          valuationProgress: {
            type: "number",
          },
          valueEnd: {
            type: "number",
          },
          valueStart: {
            type: "number",
          },
        },
        required: [
          "additions",
          "annualizedIlliquidPerformance",
          "annualizedPerformance",
          "avgHoldingPeriod",
          "chartPerformance",
          "cumulativePerformanceStart",
          "illiquidValue",
          "illiquidValuePerAnnum",
          "illiquidVintage",
          "illiquidVintagePerAnnum",
          "itdAnnualizedPercent",
          "itdAnnualizedPercentPerAnnum",
          "itdIlliquidPerformance",
          "last12MonthsValue",
          "liquidValue",
          "liquidValuePerAnnum",
          "netChangePercent",
          "netChangeValue",
          "periodicPerformance",
          "riskVolatility",
          "sharpeRatio",
          "timeperiod",
          "valuationProgress",
          "valueEnd",
          "valueStart",
        ],
        type: "object",
      },
      type: "array",
    },
    inception: {
      properties: {
        quarter: {
          type: "number",
        },
        year: {
          type: "number",
        },
      },
      required: ["quarter", "year"],
      type: "object",
    },
  },
  required: ["dataForPeriods", "inception"],
  type: "object",
}
export const AccountSummariesSchema = {
  properties: {
    accountCreationDate: {
      type: "string",
    },
    annualizedGrowth: {
      properties: {
        direction: {
          type: "string",
        },
        percent: {
          type: "number",
        },
      },
      required: ["direction", "percent"],
      type: "object",
    },
    cashFlowProjections: {
      type: "number",
    },
    cashflowChartValues: {
      items: {
        type: "number",
      },
      type: "array",
    },
    cashflowChartValuesCapitalCall: {
      items: {
        type: "number",
      },
      type: "array",
    },
    commitmentChartValues: {
      items: {
        type: "number",
      },
      type: "array",
    },
    commitments: {
      type: "number",
    },
    deals: {
      type: "number",
    },
    holdings: {
      properties: {
        cash: {
          type: "number",
        },
        cashInTransit: {
          type: "number",
        },
        illiquid: {
          type: "number",
        },
        liquid: {
          type: "number",
        },
        percentages: {
          items: {
            properties: {
              percent: {
                type: "number",
              },
              type: {
                type: "string",
              },
            },
            required: ["percent", "type"],
            type: "object",
          },
          type: "array",
        },
      },
      required: ["cash", "cashInTransit", "illiquid", "liquid", "percentages"],
      type: "object",
    },
    irrGrowth: {
      properties: {
        direction: {
          type: "string",
        },
        percent: {
          type: "number",
        },
      },
      required: ["direction", "percent"],
      type: "object",
    },
    itdGrowth: {
      properties: {
        direction: {
          type: "string",
        },
        percent: {
          type: "number",
        },
      },
      required: ["direction", "percent"],
      type: "object",
    },
    lastValuationDate: {
      type: "string",
    },
    marketSpectrumData: {
      properties: {
        end: {
          properties: {
            date: {
              type: "string",
            },
            value: {
              type: "number",
            },
          },
          required: ["date", "value"],
          type: "object",
        },
        start: {
          properties: {
            date: {
              type: "string",
            },
            value: {
              type: "number",
            },
          },
          required: ["date", "value"],
          type: "object",
        },
      },
      required: ["end", "start"],
      type: "object",
    },
    mwrGrowth: {
      properties: {
        direction: {
          type: "string",
        },
        percent: {
          type: "number",
        },
      },
      required: ["direction", "percent"],
      type: "object",
    },
    performanceChartValues: {
      items: {
        type: "number",
      },
      type: "array",
    },
    profitLoss: {
      properties: {
        direction: {
          type: "string",
        },
        money: {
          type: "number",
        },
      },
      required: ["direction", "money"],
      type: "object",
    },
    profitLossChartValues: {
      items: {
        type: "number",
      },
      type: "array",
    },
    totalValue: {
      type: "number",
    },
    ytdGrowth: {
      properties: {
        direction: {
          type: "string",
        },
        percent: {
          type: "number",
        },
      },
      required: ["direction", "percent"],
      type: "object",
    },
  },
  required: [
    "accountCreationDate",
    "annualizedGrowth",
    "cashFlowProjections",
    "cashflowChartValues",
    "cashflowChartValuesCapitalCall",
    "commitmentChartValues",
    "commitments",
    "deals",
    "holdings",
    "irrGrowth",
    "itdGrowth",
    "lastValuationDate",
    "marketSpectrumData",
    "mwrGrowth",
    "performanceChartValues",
    "profitLoss",
    "profitLossChartValues",
    "totalValue",
    "ytdGrowth",
  ],
  type: "object",
}
export const clientOpportunitiesArraySchema = {
  $schema: "http://json-schema.org/draft-07/schema#",
  items: {
    properties: {
      assetClass: {
        type: "string",
      },
      assetClassAr: {
        type: "string",
      },
      associatedConventionalDealId: {
        type: ["number", "null"],
      },
      clientOpportunityId: {
        type: "number",
      },
      closingDate: {
        type: ["string", "null"],
      },
      country: {
        type: "string",
      },
      countryAr: {
        type: "string",
      },
      countryImageUrl: {
        type: "string",
      },
      expectedExitYear: {
        type: "string",
      },
      expectedReturn: {
        type: "string",
      },
      isAddedToCart: {
        type: "boolean",
      },
      isInterested: {
        type: "string",
      },
      isProgram: {
        type: "boolean",
      },
      isScheduled: {
        type: "boolean",
      },
      isSeen: {
        type: "boolean",
      },
      isShariah: {
        type: "number",
      },
      isValid: {
        type: "boolean",
      },
      maximumAmount: {
        type: "number",
      },
      media: {
        items: {
          properties: {
            thumbnail: {
              type: ["string", "null"],
            },
            thumbnail_ar: {
              type: ["string", "null"],
            },
            type: {
              type: "string",
            },
            url: {
              type: "string",
            },
            url_ar: {
              type: "string",
            },
          },
          required: ["type", "url", "url_ar"],
          type: "object",
        },
        type: "array",
      },
      minimumAmount: {
        type: "number",
      },
      nativeDeal: {
        properties: {
          about: {
            type: "string",
          },
          aboutAr: {
            type: "string",
          },
          breakdown: {
            items: {
              properties: {
                title: {
                  type: "string",
                },
                titleAr: {
                  type: "string",
                },
                value: {
                  type: ["string", "null"],
                },
                valueAr: {
                  type: ["string", "null"],
                },
              },
              required: ["title", "titleAr", "value", "valueAr"],
              type: "object",
            },
            type: "array",
          },
          disclaimer: {
            type: ["string", "null"],
          },
          disclaimerAr: {
            type: "string",
          },
          gallery: {
            items: {
              properties: {
                thumbnail: {
                  type: "string",
                },
                thumbnail_ar: {
                  type: "string",
                },
                type: {
                  type: "string",
                },
                url: {
                  type: "string",
                },
                url_ar: {
                  type: "string",
                },
              },
              required: ["thumbnail", "thumbnail_ar", "type", "url", "url_ar"],
              type: "object",
            },
            type: "array",
          },
          info: {
            items: {
              properties: {
                text: {
                  items: {
                    properties: {
                      type: {
                        type: ["string", "null"],
                      },
                      value: {
                        type: ["string", "null"],
                      },
                      valueAr: {
                        type: ["string", "null"],
                      },
                    },
                    required: ["type", "value", "valueAr"],
                    type: "object",
                  },
                  type: "array",
                },
                title: {
                  type: "string",
                },
                titleAr: {
                  type: "string",
                },
              },
              required: ["text", "title", "titleAr"],
              type: "object",
            },
            type: "array",
          },
          location: {
            type: ["string", "null"],
          },
          locationAr: {
            type: "string",
          },
          message: {
            type: "string",
          },
          messageAr: {
            type: "string",
          },
        },
        required: [
          "about",
          "aboutAr",
          "breakdown",
          "disclaimer",
          "disclaimerAr",
          "gallery",
          "info",
          "location",
          "locationAr",
          "message",
          "messageAr",
        ],
        type: "object",
      },
      opportunityId: {
        type: "number",
      },
      opportunityName: {
        type: "string",
      },
      pdfUrl: {
        type: "string",
      },
      sector: {
        type: "string",
      },
      sectorAr: {
        type: "string",
      },
      sponsor: {
        type: "string",
      },
      startDate: {
        type: ["string", "null"],
      },
    },
    required: [
      "assetClass",
      "assetClassAr",
      "clientOpportunityId",
      "country",
      "countryAr",
      "countryImageUrl",
      "expectedExitYear",
      "expectedReturn",
      "isAddedToCart",
      "isInterested",
      "isProgram",
      "isScheduled",
      "isSeen",
      "isShariah",
      "isValid",
      "maximumAmount",
      "media",
      "minimumAmount",
      "nativeDeal",
      "opportunityId",
      "opportunityName",
      "pdfUrl",
      "sector",
      "sectorAr",
      "sponsor",
    ],
    type: "object",
  },
  type: "array",
}
export const profileDataSchema = {
  $schema: "http://json-schema.org/draft-07/schema#",

  properties: {
    aboutURL: {
      type: "string",
    },
    account: {
      type: "number",
    },
    contactPreference: {
      type: ["null", "string"],
    },
    email: {
      type: "string",
    },
    helpURL: {
      type: "string",
    },
    manager: {
      properties: {
        email: {
          type: ["string", "null"],
        },
        name: {
          type: "string",
        },
        phone: {
          type: "string",
        },
      },
      required: ["email", "name", "phone"],
      type: "object",
    },
  },
  required: [
    "aboutURL",
    "account",
    "contactPreference",
    "email",
    "helpURL",
    "manager",
  ],
  type: "object",
}
export const appointmentResponseSchema = {
  $schema: "http://json-schema.org/draft-07/schema#",

  properties: {
    appointmentId: {
      type: "null",
    },
    clientEventId: {
      type: "string",
    },
    onlineMeetingUrl: {
      type: "null",
    },
    rmEventId: {
      type: "string",
    },
  },
  required: ["clientEventId", "rmEventId"],
  type: "object",
}
export const schedulesRootSchema = {
  $schema: "http://json-schema.org/draft-07/schema#",
  items: {
    properties: {
      availabilityData: {
        items: {
          properties: {
            availabilityStatus: {
              type: "string",
            },
            endTime: {
              type: "string",
            },
            label: {
              type: "string",
            },
            startTime: {
              type: "string",
            },
          },
          required: ["availabilityStatus", "endTime", "label", "startTime"],
          type: "object",
        },
        type: "array",
      },
      date: {
        type: "string",
      },
    },
    required: ["availabilityData", "date"],
    type: "object",
  },
  type: "array",
}
export const crrRootSchema = {
  $schema: "http://json-schema.org/draft-07/schema#",
  anyOf: [
    {
      defaultProperties: [],
      properties: {
        finalData: {
          defaultProperties: [],
          properties: {
            assetAllocationOverYears: {
              defaultProperties: [],
              properties: {
                assetClassValues: {
                  items: {
                    defaultProperties: [],
                    properties: {
                      type: {
                        type: "string",
                      },
                      values: {
                        items: {
                          type: "number",
                        },
                        type: "array",
                      },
                      years: {
                        items: {
                          type: "number",
                        },
                        type: "array",
                      },
                    },
                    required: ["type", "values", "years"],
                    type: "object",
                  },
                  type: "array",
                },
                illiquidAfterCommitments: {
                  type: "number",
                },
                illiquidAtBeginning: {
                  type: "number",
                },
                liquidAfterCommitments: {
                  type: "number",
                },
                liquidAtBeginning: {
                  type: "number",
                },
                years: {
                  items: {
                    type: "number",
                  },
                  type: "array",
                },
              },
              required: [
                "assetClassValues",
                "illiquidAfterCommitments",
                "illiquidAtBeginning",
                "liquidAfterCommitments",
                "liquidAtBeginning",
                "years",
              ],
              type: "object",
            },
            detailedPerformance: {
              defaultProperties: [],
              properties: {
                annualizedReturnPercentage: {
                  type: "number",
                },
                illiquidPercentage: {
                  type: "number",
                },
                illiquidPercentagePerAnnum: {
                  type: "number",
                },
                illiquidVintagePerAnnum: {
                  type: "number",
                },
                illiquidVintagePercentage: {
                  type: "number",
                },
                liquidPercentage: {
                  type: "number",
                },
                liquidPercentagePerAnnum: {
                  type: "number",
                },
                riskVoaltility: {
                  type: "number",
                },
                sharpeRatio: {
                  type: "number",
                },
                totalReturnAmount: {
                  type: "number",
                },
                totalReturnPercentage: {
                  type: "number",
                },
              },
              required: [
                "annualizedReturnPercentage",
                "illiquidPercentage",
                "illiquidPercentagePerAnnum",
                "illiquidVintagePerAnnum",
                "illiquidVintagePercentage",
                "liquidPercentage",
                "liquidPercentagePerAnnum",
                "riskVoaltility",
                "sharpeRatio",
                "totalReturnAmount",
                "totalReturnPercentage",
              ],
              type: "object",
            },
            maximumDrawDown: {
              defaultProperties: [],
              properties: {
                illiquidMaximumDrawdown: {
                  type: "number",
                },
                msciWorldIndexDrawdown: {
                  type: "number",
                },
              },
              required: ["illiquidMaximumDrawdown", "msciWorldIndexDrawdown"],
              type: "object",
            },
            metaData: {
              defaultProperties: [],
              properties: {
                classification: {
                  type: "string",
                },
                jsonFileCreatedDate: {
                  type: "string",
                },
                mandateId: {
                  type: "string",
                },
                portfolioType: {
                  type: "string",
                },
                reconciliationDate: {
                  type: "string",
                },
              },
              required: [
                "classification",
                "jsonFileCreatedDate",
                "mandateId",
                "portfolioType",
                "reconciliationDate",
              ],
              type: "object",
            },
            overallPerformance: {
              defaultProperties: [],
              properties: {
                performanceValues: {
                  items: {
                    defaultProperties: [],
                    properties: {
                      name: {
                        type: "string",
                      },
                      values: {
                        items: {
                          type: "number",
                        },
                        type: "array",
                      },
                    },
                    required: ["name", "values"],
                    type: "object",
                  },
                  type: "array",
                },
                years: {
                  items: {
                    type: "number",
                  },
                  type: "array",
                },
              },
              required: ["performanceValues", "years"],
              type: "object",
            },
            targetAssetAllocation: {
              defaultProperties: [],
              properties: {
                illiquid: {
                  defaultProperties: [],
                  properties: {
                    data: {
                      items: {
                        defaultProperties: [],
                        properties: {
                          currentAssetAllocationPercent: {
                            type: "number",
                          },
                          deviation: {
                            type: "number",
                          },
                          strategy: {
                            type: "string",
                          },
                          subStrategy: {
                            type: "string",
                          },
                          targetAssetAllocationPercent: {
                            type: "number",
                          },
                        },
                        required: [
                          "currentAssetAllocationPercent",
                          "deviation",
                          "strategy",
                          "subStrategy",
                          "targetAssetAllocationPercent",
                        ],
                        type: "object",
                      },
                      type: "array",
                    },
                    illiquidPercentage: {
                      type: "number",
                    },
                    strategyPerc: {
                      type: "number",
                    },
                  },
                  required: ["data", "illiquidPercentage", "strategyPerc"],
                  type: "object",
                },
                liquid: {
                  defaultProperties: [],
                  properties: {
                    data: {
                      items: {
                        defaultProperties: [],
                        properties: {
                          currentAssetAllocationPercent: {
                            type: "number",
                          },
                          deviation: {
                            type: "number",
                          },
                          strategy: {
                            type: "string",
                          },
                          subStrategy: {
                            type: "string",
                          },
                          targetAssetAllocationPercent: {
                            type: "number",
                          },
                        },
                        required: [
                          "currentAssetAllocationPercent",
                          "deviation",
                          "strategy",
                          "subStrategy",
                          "targetAssetAllocationPercent",
                        ],
                        type: "object",
                      },
                      type: "array",
                    },
                    liquidPercentage: {
                      type: "number",
                    },
                    strategyPerc: {
                      type: "number",
                    },
                  },
                  required: ["data", "liquidPercentage", "strategyPerc"],
                  type: "object",
                },
              },
              required: ["illiquid", "liquid"],
              type: "object",
            },
          },
          required: [
            "assetAllocationOverYears",
            "detailedPerformance",
            "maximumDrawDown",
            "metaData",
            "overallPerformance",
            "targetAssetAllocation",
          ],
          type: "object",
        },
        isSourceExists: {
          type: "boolean",
        },
        nonAA: {
          type: "boolean",
        },
        success: {
          type: "boolean",
        },
      },
      required: ["finalData", "isSourceExists", "nonAA", "success"],
      type: "object",
    },
    {
      defaultProperties: [],
      properties: {
        success: {
          type: "boolean",
        },
        url: {
          defaultProperties: [],
          properties: {
            isSourceExists: {
              type: "boolean",
            },
            url: {
              type: "string",
            },
          },
          required: ["isSourceExists", "url"],
          type: "object",
        },
      },
      required: ["success", "url"],
      type: "object",
    },
  ],
}
export const dealSchema = {
  definitions: {
    Amounts: {
      properties: {
        alt: {
          type: "number",
        },
        cash: {
          type: "number",
        },
        equities: {
          type: "number",
        },
        fixedIncome: {
          type: "number",
        },
        otherIlliquid: {
          type: "number",
        },
        others: {
          type: "number",
        },
        privateEquity: {
          type: "number",
        },
        realEstate: {
          type: "number",
        },
        yielding: {
          type: "number",
        },
      },
      required: [
        "alt",
        "cash",
        "equities",
        "fixedIncome",
        "otherIlliquid",
        "others",
        "privateEquity",
        "realEstate",
        "yielding",
      ],
      type: "object",
    },
    Brochure: {
      properties: {
        address: {
          type: "string",
        },
        description: {
          type: "string",
        },
        largeImageURL: {
          type: "string",
        },
        smallImage1URL: {
          type: "string",
        },
        smallImage2URL: {
          type: "string",
        },
      },
      required: [
        "address",
        "description",
        "largeImageURL",
        "smallImage1URL",
        "smallImage2URL",
      ],
      type: "object",
    },
    Deal: {
      properties: {
        age: {
          type: "number",
        },
        bookValue: {
          type: "number",
        },
        brochure: {
          $ref: "#/definitions/Brochure",
        },
        distributionAmount: {
          type: "number",
        },
        holdingPeriod: {
          type: "number",
        },
        id: {
          type: "number",
        },
        industry: {
          items: {
            $ref: "#/definitions/Industry",
          },
          type: "array",
        },
        initialInvestmentDate: {
          type: "string",
        },
        investmentVehicle: {
          type: "string",
        },
        marketValue: {
          type: "number",
        },
        name: {
          type: "string",
        },
        performance: {
          $ref: "#/definitions/Performance",
        },
        portfolioSize: {
          type: "number",
        },
        priceDate: {
          type: "string",
        },
        region: {
          type: "string",
        },
        sponsorOrPartner: {
          type: "string",
        },
        strategy: {
          type: "string",
        },
        type: {
          type: "string",
        },
      },
      required: [
        "age",
        "bookValue",
        "brochure",
        "distributionAmount",
        "holdingPeriod",
        "id",
        "industry",
        "initialInvestmentDate",
        "investmentVehicle",
        "marketValue",
        "name",
        "performance",
        "portfolioSize",
        "priceDate",
        "region",
        "sponsorOrPartner",
        "strategy",
        "type",
      ],
      type: "object",
    },
    Holdings: {
      properties: {
        cash: {
          type: "number",
        },
        cashInTransit: {
          type: "number",
        },
        illiquid: {
          type: "number",
        },
        liquid: {
          type: "number",
        },
        percentages: {
          items: {
            $ref: "#/definitions/Percentage",
          },
          type: "array",
        },
      },
      required: ["cash", "cashInTransit", "illiquid", "liquid", "percentages"],
      type: "object",
    },
    Inception: {
      properties: {
        quarter: {
          type: "number",
        },
        year: {
          type: "number",
        },
      },
      required: ["quarter", "year"],
      type: "object",
    },
    Industry: {
      properties: {
        key: {
          type: "string",
        },
        langCode: {
          type: "string",
        },
        value: {
          type: "string",
        },
      },
      required: ["key", "langCode", "value"],
      type: "object",
    },
    LastValuation: {
      properties: {
        quarter: {
          type: "number",
        },
        year: {
          type: "number",
        },
      },
      required: ["quarter", "year"],
      type: "object",
    },
    Percentage: {
      properties: {
        percent: {
          type: "number",
        },
        type: {
          type: "string",
        },
      },
      required: ["percent", "type"],
      type: "object",
    },
    Performance: {
      properties: {
        direction: {
          type: "string",
        },
        percent: {
          type: "number",
        },
      },
      required: ["direction", "percent"],
      type: "object",
    },
    RegionPercentage: {
      properties: {
        perAsia: {
          type: "number",
        },
        perEurope: {
          type: "number",
        },
        perGlobal: {
          type: "number",
        },
        perNorthAmerica: {
          type: "number",
        },
      },
      required: ["perAsia", "perEurope", "perGlobal", "perNorthAmerica"],
      type: "object",
    },
    TimePeriod: {
      properties: {
        amounts: {
          $ref: "#/definitions/Amounts",
        },
        deals: {
          items: {
            $ref: "#/definitions/Deal",
          },
          type: "array",
        },
        holdings: {
          $ref: "#/definitions/Holdings",
        },
        timeperiod: {
          $ref: "#/definitions/Timeperiod",
        },
        valuationProgress: {
          type: "number",
        },
      },
      required: [
        "amounts",
        "deals",
        "holdings",
        "timeperiod",
        "valuationProgress",
      ],
      type: "object",
    },
    Timeperiod: {
      properties: {
        quarter: {
          type: "number",
        },
        year: {
          type: "number",
        },
      },
      required: ["quarter", "year"],
      type: "object",
    },
  },
  properties: {
    inception: {
      $ref: "#/definitions/Inception",
    },
    lastValuation: {
      $ref: "#/definitions/LastValuation",
    },
    regionPercentage: {
      $ref: "#/definitions/RegionPercentage",
    },
    timePeriods: {
      items: {
        $ref: "#/definitions/TimePeriod",
      },
      type: "array",
    },
    totalDeal: {
      type: "number",
    },
  },
  required: [
    "inception",
    "lastValuation",
    "regionPercentage",
    "timePeriods",
    "totalDeal",
  ],
  type: "object",
}
export const distributionCapitalSchema = {
  items: {
    properties: {
      capitalGain: {
        type: "number",
      },
      clientId: {
        type: "string",
      },
      distributionDate: {
        type: "string",
      },
      incomeDistribution: {
        type: "number",
      },
    },
    required: [
      "capitalGain",
      "clientId",
      "distributionDate",
      "incomeDistribution",
    ],
    type: "object",
  },
  type: "array",
}
export const PerformanceQuarterDealsRootSchema = {
  $schema: "http://json-schema.org/draft-07/schema#",
  defaultProperties: [],
  properties: {
    amounts: {
      defaultProperties: [],
      properties: {
        alt: {
          type: ["null", "string"],
        },
        cash: {
          type: ["null", "string"],
        },
        equities: {
          type: ["null", "string"],
        },
        fixedIncome: {
          type: ["null", "string"],
        },
        otherIlliquid: {
          type: ["null", "string"],
        },
        others: {
          type: ["null", "string"],
        },
        privateEquity: {
          type: ["null", "string"],
        },
        realEstate: {
          type: ["null", "string"],
        },
        yielding: {
          type: ["null", "string"],
        },
      },
      required: [
        "alt",
        "cash",
        "equities",
        "fixedIncome",
        "otherIlliquid",
        "others",
        "privateEquity",
        "realEstate",
        "yielding",
      ],
      type: "object",
    },
    deals: {
      items: {
        defaultProperties: [],
        properties: {
          age: {
            type: "number",
          },
          bookValue: {
            type: "number",
          },
          brochure: {
            defaultProperties: [],
            properties: {
              address: {
                type: "string",
              },
              description: {
                type: "string",
              },
              largeImageURL: {
                type: ["null", "string"],
              },
              smallImage1URL: {
                type: ["null", "string"],
              },
              smallImage2URL: {
                type: ["null", "string"],
              },
            },
            required: ["address", "description"],
            type: "object",
          },
          distributionAmount: {
            type: "number",
          },
          holdingPeriod: {
            type: "number",
          },
          id: {
            type: "number",
          },
          industry: {
            items: {
              defaultProperties: [],
              properties: {
                key: {
                  type: "string",
                },
                langCode: {
                  type: "string",
                },
                value: {
                  type: "string",
                },
              },
              required: ["key", "langCode", "value"],
              type: "object",
            },
            type: "array",
          },
          initialInvestmentDate: {
            type: "string",
          },
          investmentVehicle: {
            type: "string",
          },
          marketValue: {
            type: "number",
          },
          name: {
            type: "string",
          },
          performance: {
            defaultProperties: [],
            properties: {
              direction: {
                type: "string",
              },
              percent: {
                type: "number",
              },
            },
            required: ["direction", "percent"],
            type: "object",
          },
          portfolioSize: {
            type: "number",
          },
          priceDate: {
            type: ["null", "string"],
          },
          region: {
            type: "string",
          },
          sponsorOrPartner: {
            type: "string",
          },
          strategy: {
            type: "string",
          },
          type: {
            type: "string",
          },
        },
        required: [
          "age",
          "bookValue",
          "brochure",
          "distributionAmount",
          "holdingPeriod",
          "id",
          "industry",
          "initialInvestmentDate",
          "investmentVehicle",
          "marketValue",
          "name",
          "performance",
          "portfolioSize",
          "region",
          "sponsorOrPartner",
          "strategy",
          "type",
        ],
        type: "object",
      },
      type: "array",
    },
    holdings: {
      defaultProperties: [],
      properties: {
        cash: {
          type: "number",
        },
        cashInTransit: {
          type: "number",
        },
        illiquid: {
          type: "number",
        },
        liquid: {
          type: "number",
        },
        percentages: {
          items: {
            defaultProperties: [],
            properties: {
              percent: {
                type: "number",
              },
              type: {
                type: "string",
              },
            },
            required: ["percent", "type"],
            type: "object",
          },
          type: "array",
        },
      },
      required: ["cash", "cashInTransit", "illiquid", "liquid", "percentages"],
      type: "object",
    },
    regionPercentage: {
      type: ["null", "string"],
    },
    timeperiod: {
      defaultProperties: [],
      properties: {
        quarter: {
          type: "number",
        },
        year: {
          type: "number",
        },
      },
      required: ["quarter", "year"],
      type: "object",
    },
    totalDeal: {
      type: ["null", "string"],
    },
    valuationProgress: {
      type: "number",
    },
  },
  required: [
    "amounts",
    "deals",
    "holdings",
    "regionPercentage",
    "timeperiod",
    "totalDeal",
    "valuationProgress",
  ],
  type: "object",
}
export const ProfitLossDetailsSchema = {
  properties: {
    results: {
      items: {
        defaultProperties: [],
        properties: {
          holdingType: {
            type: "string",
          },
          results: {
            items: {
              defaultProperties: [],
              properties: {
                percentChange: {
                  defaultProperties: [],
                  properties: {
                    direction: {
                      type: "string",
                    },
                    percent: {
                      type: "number",
                    },
                  },
                  required: ["direction", "percent"],
                  type: "object",
                },
                result: {
                  type: "string",
                },
                value: {
                  defaultProperties: [],
                  properties: {
                    direction: {
                      type: "string",
                    },
                    money: {
                      type: "number",
                    },
                  },
                  required: ["direction", "money"],
                  type: "object",
                },
              },
              required: ["percentChange", "result", "value"],
              type: "object",
            },
            type: "array",
          },
          totalChange: {
            defaultProperties: [],
            properties: {
              percentChange: {
                defaultProperties: [],
                properties: {
                  direction: {
                    type: "string",
                  },
                  percent: {
                    type: "number",
                  },
                },
                required: ["direction", "percent"],
                type: "object",
              },
              value: {
                defaultProperties: [],
                properties: {
                  direction: {
                    type: "string",
                  },
                  money: {
                    type: "number",
                  },
                },
                required: ["direction", "money"],
                type: "object",
              },
            },
            required: ["percentChange", "value"],
            type: "object",
          },
        },
        required: ["holdingType", "results", "totalChange"],
        type: "object",
      },
      type: "array",
    },
    summary: {
      defaultProperties: [],
      properties: {
        results: {
          items: {
            defaultProperties: [],
            properties: {
              percentChange: {
                defaultProperties: [],
                properties: {
                  direction: {
                    type: "string",
                  },
                  percent: {
                    type: "number",
                  },
                },
                required: ["direction", "percent"],
                type: "object",
              },
              result: {
                type: "string",
              },
              value: {
                defaultProperties: [],
                properties: {
                  direction: {
                    type: "string",
                  },
                  money: {
                    type: "number",
                  },
                },
                required: ["direction", "money"],
                type: "object",
              },
            },
            required: ["percentChange", "result", "value"],
            type: "object",
          },
          type: "array",
        },
        totalChange: {
          defaultProperties: [],
          properties: {
            percentChange: {
              defaultProperties: [],
              properties: {
                direction: {
                  type: "string",
                },
                percent: {
                  type: "number",
                },
              },
              required: ["direction", "percent"],
              type: "object",
            },
            value: {
              defaultProperties: [],
              properties: {
                direction: {
                  type: "string",
                },
                money: {
                  type: "number",
                },
              },
              required: ["direction", "money"],
              type: "object",
            },
          },
          required: ["percentChange", "value"],
          type: "object",
        },
      },
      required: ["results", "totalChange"],
      type: "object",
    },
    timeperiod: {
      defaultProperties: [],
      properties: {
        quarter: {
          type: "number",
        },
        toDate: {
          type: "string",
        },
        year: {
          type: "number",
        },
      },
      required: ["toDate"],
      type: "object",
    },
  },
  required: ["results", "summary", "timeperiod"],
  type: "object",
}
export const PopupDetailRootSchema = {
  $schema: "http://json-schema.org/draft-07/schema#",
  defaultProperties: [],
  definitions: {
    PopupDetail: {
      defaultProperties: [],
      properties: {
        flag: {
          type: "boolean",
        },
        popupId: {
          type: "number",
        },
        popupName: {
          type: "string",
        },
      },
      required: ["flag", "popupId", "popupName"],
      type: "object",
    },
  },
  properties: {
    popupDetails: {
      items: {
        $ref: "#/definitions/PopupDetail",
      },
      type: "array",
    },
  },
  required: ["popupDetails"],
  type: "object",
}
export const RedemptionFundRootSchema = {
  $schema: "http://json-schema.org/draft-07/schema#",
  defaultProperties: [],
  properties: {
    redemptionFunds: {
      items: {
        defaultProperties: [],
        properties: {
          balance: {
            type: "number",
          },
          date: {
            type: "string",
          },
          fundName: {
            type: "string",
          },
        },
        required: ["balance", "date", "fundName"],
        type: "object",
      },
      type: "array",
    },
  },
  required: ["redemptionFunds"],
  type: "object",
}
export const RedeemDetailsRootSchema = {
  $schema: "http://json-schema.org/draft-07/schema#",
  defaultProperties: [],
  properties: {
    redemptionSavedClientAppDB: {
      defaultProperties: [],
      properties: {
        assetName: {
          type: "string",
        },
        clientId: {
          type: "number",
        },
        id: {
          type: "number",
        },
        reason: {
          type: "string",
        },
        redemptionAmount: {
          type: "number",
        },
        remainingBalance: {
          type: "number",
        },
      },
      required: [
        "assetName",
        "clientId",
        "id",
        "reason",
        "redemptionAmount",
        "remainingBalance",
      ],
      type: "object",
    },
  },
  required: ["redemptionSavedClientAppDB"],
  type: "object",
}
export const TotalCommitmentsSchema = {
  properties: {
    commitments: {
      items: {
        properties: {
          called: {
            type: "number",
          },
          committed: {
            type: "number",
          },
          deployed: {
            type: "number",
          },
          holdingType: {
            type: "string",
          },
          id: {
            type: "number",
          },
          lastCommitment: {
            type: "string",
          },
          managedVehicle: {
            type: "string",
          },
          portfolioWeight: {
            type: "number",
          },
          strategy: {
            type: "string",
          },
          uncalled: {
            type: "number",
          },
        },
        required: [
          "called",
          "committed",
          "deployed",
          "holdingType",
          "id",
          "lastCommitment",
          "managedVehicle",
          "portfolioWeight",
          "strategy",
          "uncalled",
        ],
        type: "object",
      },
      type: "array",
    },
    lastValuation: {
      properties: {
        month: {
          type: "number",
        },
        year: {
          type: "number",
        },
      },
      required: ["month", "year"],
      type: "object",
    },
    timeperiod: {
      properties: {
        toDate: {
          type: "string",
        },
      },
      required: ["toDate"],
      type: "object",
    },
    totalCommitted: {
      type: "number",
    },
    totalUncalled: {
      type: "number",
    },
  },
  required: [
    "commitments",
    "lastValuation",
    "timeperiod",
    "totalCommitted",
    "totalUncalled",
  ],
  type: "object",
}
export const CashflowsSchema = {
  properties: {
    distributionFirstValuation: {
      defaultProperties: [],
      properties: {
        quarter: {
          type: "number",
        },
        year: {
          type: "number",
        },
      },
      required: ["quarter", "year"],
      type: "object",
    },
    distributionPerTimePeriod: {
      items: {
        defaultProperties: [],
        properties: {
          deals: {
            items: {
              defaultProperties: [],
              properties: {
                date: {
                  type: "string",
                },
                distribution: {
                  type: "number",
                },
                investmentVehicle: {
                  type: "string",
                },
                name: {
                  type: "string",
                },
              },
              required: ["date", "distribution", "investmentVehicle", "name"],
              type: "object",
            },
            type: "array",
          },
          timeperiod: {
            defaultProperties: [],
            properties: {
              quarter: {
                type: "number",
              },
              toDate: {
                type: "string",
              },
              year: {
                type: "number",
              },
            },
            type: "object",
          },
          totalDistributions: {
            type: "number",
          },
        },
        required: ["deals", "timeperiod", "totalDistributions"],
        type: "object",
      },
      type: "array",
    },
    itdCapitalCallProjection: {
      type: "number",
    },
    itdDistributionProjection: {
      type: "number",
    },
    projectionForQuarters: {
      items: {
        defaultProperties: [],
        properties: {
          projection: {
            defaultProperties: [],
            properties: {
              capitalCall: {
                type: "number",
              },
              capitalDistribution: {
                type: "number",
              },
              incomeDistribution: {
                type: "number",
              },
              net: {
                type: "number",
              },
              totalDistribution: {
                type: "number",
              },
            },
            required: [
              "capitalCall",
              "capitalDistribution",
              "incomeDistribution",
              "net",
              "totalDistribution",
            ],
            type: "object",
          },
          timeperiod: {
            defaultProperties: [],
            properties: {
              quarter: {
                type: "number",
              },
              year: {
                type: "number",
              },
            },
            required: ["quarter", "year"],
            type: "object",
          },
        },
        required: ["projection", "timeperiod"],
        type: "object",
      },
      type: "array",
    },
    projectionForYears: {
      items: {
        defaultProperties: [],
        properties: {
          projection: {
            defaultProperties: [],
            properties: {
              capitalCall: {
                type: "number",
              },
              capitalDistribution: {
                type: "number",
              },
              incomeDistribution: {
                type: "number",
              },
              net: {
                type: "number",
              },
              totalDistribution: {
                type: "number",
              },
            },
            required: [
              "capitalCall",
              "capitalDistribution",
              "incomeDistribution",
              "net",
              "totalDistribution",
            ],
            type: "object",
          },
          timeperiod: {
            defaultProperties: [],
            properties: {
              quarter: {
                type: "number",
              },
              year: {
                type: "number",
              },
            },
            required: ["quarter", "year"],
            type: "object",
          },
        },
        required: ["projection", "timeperiod"],
        type: "object",
      },
      type: "array",
    },
    ytdCapitalCallProjection: {
      type: "number",
    },
    ytdDistributionProjection: {
      type: "number",
    },
  },
  required: [
    "distributionFirstValuation",
    "distributionPerTimePeriod",
    "itdCapitalCallProjection",
    "itdDistributionProjection",
    "projectionForQuarters",
    "projectionForYears",
    "ytdCapitalCallProjection",
    "ytdDistributionProjection",
  ],
  type: "object",
}
export const MarketIndicatorSchema = {
  properties: {
    allMarkets: {
      items: {
        defaultProperties: [],
        properties: {
          badText: {
            type: "string",
          },
          description: {
            type: "string",
          },
          goodText: {
            type: "string",
          },
          spectrum: {
            defaultProperties: [],
            properties: {
              end: {
                defaultProperties: [],
                properties: {
                  date: {
                    type: "string",
                  },
                  value: {
                    type: "number",
                  },
                },
                required: ["date", "value"],
                type: "object",
              },
              start: {
                defaultProperties: [],
                properties: {
                  date: {
                    type: "string",
                  },
                  value: {
                    type: "number",
                  },
                },
                required: ["date", "value"],
                type: "object",
              },
            },
            required: ["end", "start"],
            type: "object",
          },
          title: {
            type: "string",
          },
        },
        required: ["badText", "description", "goodText", "spectrum", "title"],
        type: "object",
      },
      type: "array",
    },
    summaryText: {
      type: "string",
    },
    summaryTitle: {
      type: "string",
    },
  },
  required: ["allMarkets", "summaryText", "summaryTitle"],
  type: "object",
}
export const InvestmentCartSchema = {
  properties: {
    investmentCartDeals: {
      items: {
        defaultProperties: [],
        properties: {
          associatedConventionalDealId: {
            type: "number",
          },
          dealId: {
            type: "number",
          },
          dealName: {
            type: "string",
          },
          isInvestmentPreferenceShariah: {
            type: "boolean",
          },
          isProgram: {
            type: "boolean",
          },
        },
        required: [
          "dealId",
          "dealName",
          "isInvestmentPreferenceShariah",
          "isProgram",
        ],
        type: "object",
      },
      type: "array",
    },
  },
  type: "object",
}
export const DealDetailsSchema = {
  $schema: "http://json-schema.org/draft-07/schema#",
  defaultProperties: [],
  properties: {
    inception: {
      defaultProperties: [],
      properties: {
        quarter: {
          type: "number",
        },
        year: {
          type: "number",
        },
      },
      required: ["quarter", "year"],
      type: "object",
    },
    lastValuation: {
      defaultProperties: [],
      properties: {
        quarter: {
          type: "number",
        },
        year: {
          type: "number",
        },
      },
      required: ["quarter", "year"],
      type: "object",
    },
    periods: {
      items: {
        defaultProperties: [],
        properties: {
          bookValue: {
            type: "number",
          },
          name: {
            type: "string",
          },
          brochure: {
            defaultProperties: [],
            properties: {
              address: {
                type: "string",
              },
              description: {
                type: "string",
              },
              largeImageURL: {
                type: "string",
              },
              smallImage1URL: {
                type: "string",
              },
              smallImage2URL: {
                type: "string",
              },
            },
            required: ["address", "description"],
            type: "object",
          },
          gainsOrLosses: {
            type: "number",
          },
          holdingPeriod: {
            type: "number",
          },
          income: {
            type: "number",
          },
          initialFunding: {
            type: "number",
          },
          initialInvestmentDate: {
            type: "string",
          },
          marketValue: {
            type: "number",
          },
          multiple: {
            type: "number",
          },
          netChange: {
            type: "number",
          },
          performanceContribution: {
            type: "number",
          },
          priceDate: {
            type: "string",
          },
          returnOfCapital: {
            type: "number",
          },
          shares: {
            type: "number",
          },
          sponsorOrPartner: {
            type: "string",
          },
          strategy: {
            type: "string",
          },
          timeperiod: {
            defaultProperties: [],
            properties: {
              quarter: {
                type: "number",
              },
              year: {
                type: "number",
              },
            },
            required: ["quarter", "year"],
            type: "object",
          },
          valueEnd: {
            type: "number",
          },
          valueStart: {
            type: "number",
          },
        },
        required: [
          "bookValue",
          "gainsOrLosses",
          "income",
          "initialFunding",
          "marketValue",
          "multiple",
          "netChange",
          "performanceContribution",
          "returnOfCapital",
          "shares",
          "timeperiod",
          "valueEnd",
          "valueStart",
        ],
        type: "object",
      },
      type: "array",
    },
  },
  required: ["inception", "lastValuation", "periods"],
  type: "object",
}
export const CommitmentRelatedDealSchema = {
  properties: {
    inception: {
      properties: {
        quarter: {
          type: "number",
        },
        year: {
          type: "number",
        },
      },
      required: ["quarter", "year"],
      type: "object",
    },
    lastValuation: {
      properties: {
        quarter: {
          type: "number",
        },
        year: {
          type: "number",
        },
      },
      required: ["quarter", "year"],
      type: "object",
    },
    timePeriods: {
      items: {
        properties: {
          deals: {
            items: {
              properties: {
                age: {
                  type: "number",
                },
                bookValue: {
                  type: "number",
                },
                brochure: {
                  properties: {
                    address: {
                      type: "string",
                    },
                    description: {
                      type: "string",
                    },
                  },
                  required: ["address", "description"],
                  type: "object",
                },
                distributionAmount: {
                  type: "number",
                },
                holdingPeriod: {
                  type: "number",
                },
                id: {
                  type: "number",
                },
                industry: {
                  items: {
                    properties: {
                      key: {
                        type: "string",
                      },
                      langCode: {
                        type: "string",
                      },
                      value: {
                        type: "string",
                      },
                    },
                    required: ["key", "langCode", "value"],
                    type: "object",
                  },
                  type: "array",
                },
                initialInvestmentDate: {
                  type: "string",
                },
                investmentVehicle: {
                  type: "string",
                },
                marketValue: {
                  type: "number",
                },
                name: {
                  type: "string",
                },
                performance: {
                  properties: {
                    direction: {
                      type: "string",
                    },
                    percent: {
                      type: "number",
                    },
                  },
                  required: ["direction", "percent"],
                  type: "object",
                },
                portfolioSize: {
                  type: "number",
                },
                region: {
                  type: "string",
                },
                sponsorOrPartner: {
                  type: "string",
                },
                strategy: {
                  type: "string",
                },
                type: {
                  type: "string",
                },
              },
              required: [
                "age",
                "bookValue",
                "brochure",
                "distributionAmount",
                "holdingPeriod",
                "id",
                "industry",
                "initialInvestmentDate",
                "investmentVehicle",
                "marketValue",
                "name",
                "performance",
                "portfolioSize",
                "region",
                "sponsorOrPartner",
                "strategy",
                "type",
              ],
              type: "object",
            },
            type: "array",
          },
          holdings: {
            properties: {
              cash: {
                type: "number",
              },
              cashInTransit: {
                type: "number",
              },
              illiquid: {
                type: "number",
              },
              liquid: {
                type: "number",
              },
              percentages: {
                items: {
                  properties: {
                    percent: {
                      type: "number",
                    },
                    type: {
                      type: "string",
                    },
                  },
                  required: ["percent", "type"],
                  type: "object",
                },
                type: "array",
              },
            },
            required: [
              "cash",
              "cashInTransit",
              "illiquid",
              "liquid",
              "percentages",
            ],
            type: "object",
          },
          timeperiod: {
            properties: {
              quarter: {
                type: "number",
              },
              year: {
                type: "number",
              },
            },
            required: ["quarter", "year"],
            type: "object",
          },
          valuationProgress: {
            type: "number",
          },
        },
        required: ["deals", "holdings", "timeperiod", "valuationProgress"],
        type: "object",
      },
      type: "array",
    },
  },
  required: ["inception", "lastValuation", "timePeriods"],
  type: "object",
}
export const ProgramDealsSchema = {
  items: {
    properties: {
      deals: {
        items: {
          defaultProperties: [],
          properties: {
            assetClass: {
              type: "string",
            },
            assetClassAr: {
              type: "string",
            },
            country: {
              type: "string",
            },
            countryAr: {
              type: "string",
            },
            dealId: {
              type: "number",
            },
            dealName: {
              type: "string",
            },
            defaultSelection: {
              type: "boolean",
            },
            expectedExitYear: {
              type: "string",
            },
            expectedReturn: {
              type: "string",
            },
            isShariah: {
              type: "number",
            },
            moreInfo: {
              items: {},
              type: "array",
            },
            sector: {
              type: "string",
            },
            sectorAr: {
              type: "string",
            },
            sponsor: {
              type: "string",
            },
            unplacedAmount: {
              type: "number",
            },
          },
          required: [
            "assetClass",
            "assetClassAr",
            "country",
            "countryAr",
            "dealId",
            "dealName",
            "defaultSelection",
            "expectedExitYear",
            "expectedReturn",
            "isShariah",
            "moreInfo",
            "sector",
            "sectorAr",
            "sponsor",
            "unplacedAmount",
          ],
          type: "object",
        },
        type: "array",
      },
      programId: {
        type: "number",
      },
      programName: {
        type: "string",
      },
    },
    type: "object",
  },
  type: "array",
}
export const DocCenterListSchema = {
  $schema: "http://json-schema.org/draft-07/schema#",
  defaultProperties: [],
  properties: {
    data: {
      items: {
        defaultProperties: [],
        properties: {
          contentType: {
            type: "string",
          },
          filecounts: {
            type: "number",
          },
          name: {
            type: "string",
          },
        },
        required: ["contentType", "filecounts", "name"],
        type: "object",
      },
      type: "array",
    },
    success: {
      type: "boolean",
    },
  },
  required: ["data", "success"],
  type: "object",
}
export const ReportAndVideoListSchema = {
  $schema: "http://json-schema.org/draft-07/schema#",
  defaultProperties: [],
  properties: {
    data: {
      items: {
        defaultProperties: [],
        properties: {
          contentType: {
            type: "string",
          },
          date: {
            type: "string",
          },
          fileWithPrefix: {
            type: "string",
          },
          length: {
            type: "string",
          },
          name: {
            type: "string",
          },
          size: {
            type: "string",
          },
        },
        required: [
          "contentType",
          "date",
          "fileWithPrefix",
          "length",
          "name",
          "size",
        ],
        type: "object",
      },
      type: "array",
    },
    success: {
      type: "boolean",
    },
  },
  required: ["data", "success"],
  type: "object",
}
export const SubscriptionSavedClientAppDbSchema = {
  properties: {
    subscriptionSavedClientAppDB: {
      items: {
        defaultProperties: [],
        properties: {
          clientId: {
            type: "number",
          },
          concentration: {
            type: "number",
          },
          dealId: {
            type: "number",
          },
          dealName: {
            type: "string",
          },
          id: {
            type: "number",
          },
          indermediateInvestmentAmount: {
            type: "number",
          },
          isPrefund: {
            type: "boolean",
          },
          isProgram: {
            type: "boolean",
          },
          programDetailsEntityList: {
            items: {
              defaultProperties: [],
              properties: {
                clientId: {
                  type: "number",
                },
                dealName: {
                  type: "string",
                },
                id: {
                  type: "number",
                },
                investmentAmount: {
                  type: "number",
                },
                programDealId: {
                  type: "number",
                },
              },
              required: [
                "clientId",
                "dealName",
                "id",
                "investmentAmount",
                "programDealId",
              ],
              type: "object",
            },
            type: "array",
          },
          totalInvestmentAmount: {
            type: "number",
          },
        },
        required: [
          "clientId",
          "dealId",
          "dealName",
          "id",
          "isProgram",
          "programDetailsEntityList",
          "totalInvestmentAmount",
        ],
        type: "object",
      },
      type: "array",
    },
  },
  type: "object",
}
export const GlossaryResSchema = {
  $schema: "http://json-schema.org/draft-07/schema#",
  items: {
    defaultProperties: [],
    properties: {
      definition: {
        type: "string",
      },
      term: {
        type: "string",
      },
    },
    required: ["definition", "term"],
    type: "object",
  },
  type: "array",
}
export const DownloadDealSheetSchema = {
  $schema: "http://json-schema.org/draft-07/schema#",
  defaultProperties: [],
  properties: {
    success: {
      type: "boolean",
    },
    url: {
      type: "string",
    },
    isBlobExists: {
      type: "boolean",
    },
  },
  required: ["url", "success", "isBlobExists"],
  type: "object",
}
export const TopWeeklySchema = {
  $schema: "http://json-schema.org/draft-07/schema#",
  defaultProperties: [],
  properties: {
    darstAudio: {
      type: "string",
    },
    message: {
      type: "string",
    },
    messageAr: {
      type: "string",
    },
    month: {
      type: "string",
    },
    sectionTitle: {
      type: "string",
    },
    timestamp: {
      type: "string",
    },
    topBonds: {
      items: {
        defaultProperties: [],
        properties: {
          bondCloseChange: {
            defaultProperties: [],
            properties: {
              direction: {
                type: "string",
              },
              percent: {
                type: "number",
              },
              unit: {
                type: "string",
              },
            },
            required: ["direction", "percent"],
            type: "object",
          },
          bondMaturity: {
            type: "number",
          },
          bondStockWeekChange: {
            defaultProperties: [],
            properties: {
              direction: {
                type: "string",
              },
              percent: {
                type: "number",
              },
              unit: {
                type: "string",
              },
            },
            required: ["direction", "percent"],
            type: "object",
          },
          bondWeekChange: {
            defaultProperties: [],
            properties: {
              direction: {
                type: "string",
              },
              percent: {
                type: "number",
              },
              unit: {
                type: "string",
              },
            },
            required: ["direction", "percent", "unit"],
            type: "object",
          },
          bondYTDChange: {
            defaultProperties: [],
            properties: {
              direction: {
                type: "string",
              },
              percent: {
                type: "number",
              },
              unit: {
                type: "string",
              },
            },
            required: ["direction", "percent", "unit"],
            type: "object",
          },
          bondYields: {
            type: "string",
          },
          flag: {
            type: "string",
          },
        },
        required: [
          "bondCloseChange",
          "bondMaturity",
          "bondStockWeekChange",
          "bondWeekChange",
          "bondYTDChange",
          "bondYields",
          "flag",
        ],
        type: "object",
      },
      type: "array",
    },
    topIndices: {
      items: {
        defaultProperties: [],
        properties: {
          indexCode: {
            type: "string",
          },
          indexFXCurrencyCode: {
            type: "string",
          },
          indexFXStrength: {
            type: "string",
          },
          indexFXValue: {
            defaultProperties: [],
            properties: {
              direction: {
                type: "string",
              },
              percent: {
                type: "number",
              },
            },
            required: ["direction", "percent"],
            type: "object",
          },
          indexLevel: {
            type: "string",
          },
          indexName: {
            type: "string",
          },
          indexWeekChange: {
            defaultProperties: [],
            properties: {
              direction: {
                type: "string",
              },
              percent: {
                type: "number",
              },
              unit: {
                type: "string",
              },
            },
            required: ["direction", "percent", "unit"],
            type: "object",
          },
          indexYTDChange: {
            defaultProperties: [],
            properties: {
              direction: {
                type: "string",
              },
              percent: {
                type: "number",
              },
              unit: {
                type: "string",
              },
            },
            required: ["direction", "percent", "unit"],
            type: "object",
          },
        },
        required: [
          "indexCode",
          "indexFXValue",
          "indexLevel",
          "indexName",
          "indexWeekChange",
          "indexYTDChange",
        ],
        type: "object",
      },
      type: "array",
    },
    topStocks: {
      items: {
        defaultProperties: [],
        properties: {
          stockCode: {
            type: "string",
          },
          stockCompany: {
            type: "string",
          },
          stockPrice: {
            type: "number",
          },
          stockWeekChange: {
            defaultProperties: [],
            properties: {
              direction: {
                type: "string",
              },
              percent: {
                type: "number",
              },
            },
            required: ["direction", "percent"],
            type: "object",
          },
          stockYTDChange: {
            defaultProperties: [],
            properties: {
              direction: {
                type: "string",
              },
              percent: {
                type: "number",
              },
            },
            required: ["direction", "percent"],
            type: "object",
          },
        },
        required: [
          "stockCode",
          "stockCompany",
          "stockPrice",
          "stockWeekChange",
          "stockYTDChange",
        ],
        type: "object",
      },
      type: "array",
    },
    week: {
      type: "string",
    },
    weekId: {
      type: "string",
    },
    year: {
      type: "string",
    },
  },
  required: [
    "darstAudio",
    "message",
    "messageAr",
    "month",
    "sectionTitle",
    "timestamp",
    "topBonds",
    "topIndices",
    "topStocks",
    "week",
    "weekId",
    "year",
  ],
  type: "object",
}
export const HighlightsSchema = {
  $schema: "http://json-schema.org/draft-07/schema#",
  defaultProperties: [],
  properties: {
    highlights: {
      items: {
        type: "string",
      },
      type: "array",
    },
  },
  required: ["highlights"],
}
export const DownloadDocumnetsSchema = {
  $schema: "http://json-schema.org/draft-07/schema#",
  defaultProperties: [],
  properties: {
    success: {
      type: "boolean",
    },
    url: {
      type: "string",
    },
    action: {
      type: "string",
    },
  },
  required: ["url", "success", "action"],
  type: "object",
}
export const WatchlistSchema = {
  properties: {
    bond: {
      items: {
        defaultProperties: [],
        properties: {
          bondCloseChange: {
            defaultProperties: [],
            properties: {
              direction: {
                type: "string",
              },
              percent: {
                type: "number",
              },
              unit: {
                type: "string",
              },
            },
            required: ["direction", "percent", "unit"],
            type: "object",
          },
          bondMaturity: {
            type: "number",
          },
          bondStockWeekChange: {
            defaultProperties: [],
            properties: {
              direction: {
                type: "string",
              },
              percent: {
                type: "number",
              },
              unit: {
                type: "string",
              },
            },
            required: ["direction", "percent", "unit"],
            type: "object",
          },
          bondWeekChange: {
            defaultProperties: [],
            properties: {
              direction: {
                type: "string",
              },
              percent: {
                type: "number",
              },
              unit: {
                type: "string",
              },
            },
            required: ["direction", "percent", "unit"],
            type: "object",
          },
          bondYTDChange: {
            defaultProperties: [],
            properties: {
              direction: {
                type: "string",
              },
              percent: {
                type: "number",
              },
              unit: {
                type: "string",
              },
            },
            required: ["direction", "percent", "unit"],
            type: "object",
          },
          bondYields: {
            type: "string",
          },
          flag: {
            type: "string",
          },
        },
        required: [
          "bondCloseChange",
          "bondMaturity",
          "bondStockWeekChange",
          "bondWeekChange",
          "bondYTDChange",
          "bondYields",
          "flag",
        ],
        type: "object",
      },
      type: "array",
    },
    indices: {
      items: {
        defaultProperties: [],
        properties: {
          indexCode: {
            type: "string",
          },
          indexFXCurrencyCode: {
            type: "string",
          },
          indexFXStrength: {
            type: "string",
          },
          indexFXValue: {
            defaultProperties: [],
            properties: {
              direction: {
                type: "string",
              },
              percent: {
                type: "number",
              },
            },
            required: ["direction", "percent"],
            type: "object",
          },
          indexLevel: {
            type: "string",
          },
          indexName: {
            type: "string",
          },
          indexWeekChange: {
            defaultProperties: [],
            properties: {
              direction: {
                type: "string",
              },
              percent: {
                type: "number",
              },
              unit: {
                type: "string",
              },
            },
            required: ["direction", "percent", "unit"],
            type: "object",
          },
          indexYTDChange: {
            defaultProperties: [],
            properties: {
              direction: {
                type: "string",
              },
              percent: {
                type: "number",
              },
              unit: {
                type: "string",
              },
            },
            required: ["direction", "percent", "unit"],
            type: "object",
          },
        },
        required: [
          "indexCode",
          "indexFXCurrencyCode",
          "indexFXStrength",
          "indexFXValue",
          "indexLevel",
          "indexName",
          "indexWeekChange",
          "indexYTDChange",
        ],
        type: "object",
      },
      type: "array",
    },
    stock: {
      items: {
        defaultProperties: [],
        properties: {
          stockCode: {
            type: "string",
          },
          stockCompany: {
            type: "string",
          },
          stockPrice: {
            type: "number",
          },
          stockWeekChange: {
            defaultProperties: [],
            properties: {
              direction: {
                type: "string",
              },
              percent: {
                type: "number",
              },
            },
            required: ["direction", "percent"],
            type: "object",
          },
          stockYTDChange: {
            defaultProperties: [],
            properties: {
              direction: {
                type: "string",
              },
              percent: {
                type: "number",
              },
            },
            required: ["direction", "percent"],
            type: "object",
          },
        },
        required: [
          "stockCode",
          "stockCompany",
          "stockPrice",
          "stockWeekChange",
          "stockYTDChange",
        ],
        type: "object",
      },
      type: "array",
    },
  },
  required: ["bond", "indices", "stock"],
  type: "object",
}
export const CardCategoriesSchema = {
  properties: {
    bondCategories: {
      items: {
        defaultProperties: [],
        properties: {
          categoryName: {
            type: "string",
          },
          categoryNumber: {
            type: "number",
          },
          items: {
            items: {
              defaultProperties: [],
              properties: {
                bondCloseChange: {
                  defaultProperties: [],
                  properties: {
                    direction: {
                      type: "string",
                    },
                    percent: {
                      type: "number",
                    },
                    unit: {
                      type: "string",
                    },
                  },
                  required: ["direction", "percent", "unit"],
                  type: "object",
                },
                bondMaturity: {
                  type: "number",
                },
                bondStockWeekChange: {
                  defaultProperties: [],
                  properties: {
                    direction: {
                      type: "string",
                    },
                    percent: {
                      type: "number",
                    },
                    unit: {
                      type: "string",
                    },
                  },
                  required: ["direction", "percent", "unit"],
                  type: "object",
                },
                bondWeekChange: {
                  defaultProperties: [],
                  properties: {
                    direction: {
                      type: "string",
                    },
                    percent: {
                      type: "number",
                    },
                    unit: {
                      type: "string",
                    },
                  },
                  required: ["direction", "percent", "unit"],
                  type: "object",
                },
                bondYTDChange: {
                  defaultProperties: [],
                  properties: {
                    direction: {
                      type: "string",
                    },
                    percent: {
                      type: "number",
                    },
                    unit: {
                      type: "string",
                    },
                  },
                  required: ["direction", "percent", "unit"],
                  type: "object",
                },
                bondYields: {
                  type: "string",
                },
                flag: {
                  type: "string",
                },
              },
              required: [
                "bondCloseChange",
                "bondMaturity",
                "bondStockWeekChange",
                "bondWeekChange",
                "bondYTDChange",
                "bondYields",
                "flag",
              ],
              type: "object",
            },
            type: "array",
          },
        },
        required: ["categoryName", "categoryNumber", "items"],
        type: "object",
      },
      type: "array",
    },
    indexCategories: {
      items: {
        defaultProperties: [],
        properties: {
          categoryName: {
            type: "string",
          },
          categoryNumber: {
            type: "number",
          },
          items: {
            items: {
              defaultProperties: [],
              properties: {
                indexCode: {
                  type: "string",
                },
                indexFXCurrencyCode: {
                  type: "string",
                },
                indexFXStrength: {
                  type: "string",
                },
                indexFXValue: {
                  defaultProperties: [],
                  properties: {
                    direction: {
                      type: "string",
                    },
                    percent: {
                      type: "number",
                    },
                  },
                  required: ["direction", "percent"],
                  type: "object",
                },
                indexLevel: {
                  type: "string",
                },
                indexName: {
                  type: "string",
                },
                indexWeekChange: {
                  defaultProperties: [],
                  properties: {
                    direction: {
                      type: "string",
                    },
                    percent: {
                      type: "number",
                    },
                    unit: {
                      type: "string",
                    },
                  },
                  required: ["direction", "percent", "unit"],
                  type: "object",
                },
                indexYtdChange: {
                  defaultProperties: [],
                  properties: {
                    direction: {
                      type: "string",
                    },
                    percent: {
                      type: "number",
                    },
                    unit: {
                      type: "string",
                    },
                  },
                  required: ["direction", "percent", "unit"],
                  type: "object",
                },
              },
              required: [
                "indexCode",
                "indexFXCurrencyCode",
                "indexFXStrength",
                "indexFXValue",
                "indexLevel",
                "indexName",
                "indexWeekChange",
                "indexYtdChange",
              ],
              type: "object",
            },
            type: "array",
          },
        },
        required: ["categoryName", "categoryNumber", "items"],
        type: "object",
      },
      type: "array",
    },
    stockCategories: {
      items: {
        defaultProperties: [],
        properties: {
          categoryName: {
            type: "string",
          },
          categoryNumber: {
            type: "number",
          },
          items: {
            items: {
              defaultProperties: [],
              properties: {
                stockCode: {
                  type: "string",
                },
                stockCompany: {
                  type: "string",
                },
                stockPrice: {
                  type: "number",
                },
                stockWeekChange: {
                  defaultProperties: [],
                  properties: {
                    direction: {
                      type: "string",
                    },
                    percent: {
                      type: "number",
                    },
                  },
                  required: ["direction", "percent"],
                  type: "object",
                },
                stockYTDChange: {
                  defaultProperties: [],
                  properties: {
                    direction: {
                      type: "string",
                    },
                    percent: {
                      type: "number",
                    },
                  },
                  required: ["direction", "percent"],
                  type: "object",
                },
              },
              required: [
                "stockCode",
                "stockCompany",
                "stockPrice",
                "stockWeekChange",
                "stockYTDChange",
              ],
              type: "object",
            },
            type: "array",
          },
        },
        required: ["categoryName", "categoryNumber", "items"],
        type: "object",
      },
      type: "array",
    },
  },
  required: ["bondCategories", "indexCategories", "stockCategories"],
  type: "object",
}
export const PortfolioActivityResSchema = {
  $schema: "http://json-schema.org/draft-07/schema#",
  items: {
    defaultProperties: [],
    properties: {
      acitivityType: {
        type: "string",
      },
      activityDate: {
        type: "string",
      },
      amount: {
        type: "number",
      },
      clientActivityId: {
        type: "number",
      },
      dealName: {
        type: "string",
      },
    },
    required: [
      "acitivityType",
      "activityDate",
      "amount",
      "clientActivityId",
      "dealName",
    ],
    type: "object",
  },
  type: "array",
}
export const RmAppointmentResponseSchema = {
  $schema: "http://json-schema.org/draft-07/schema#",
  defaultProperties: [],
  properties: {
    appointmentId: {
      type: "string",
    },
    clientEventId: {
      type: "string",
    },
    onlineMeetingUrl: {
      type: "string",
    },
    rmEventId: {
      type: "string",
    },
  },
  required: ["appointmentId", "clientEventId", "onlineMeetingUrl", "rmEventId"],
  type: "object",
}
export const DealDistributionTypesSchema = {
  $schema: "http://json-schema.org/draft-07/schema#",
  items: {
    defaultProperties: [],
    properties: {
      amount: {
        type: "number",
      },
      dealId: {
        type: "number",
      },
      dealName: {
        type: "string",
      },
      distributionDate: {
        type: "string",
      },
      spvLongName: {
        type: "string",
      },
      spvName: {
        type: "string",
      },
      type: {
        type: "string",
      },
    },
    required: [
      "amount",
      "dealId",
      "dealName",
      "distributionDate",
      "spvLongName",
      "spvName",
      "type",
    ],
    type: "object",
  },
  type: "array",
}
