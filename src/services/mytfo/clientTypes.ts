export type DealsTypeArray = DealsType[]
export type DatesObj = {
  fromDate: string
  toDate: string
}
export type TimePeriods = {
  timeperiod: {
    year: number
    quarter: number
  }
  valuationProgress: number
  holdings: {
    illiquid: number
    liquid: number
    cash: number
    cashInTransit: number
    percentages: {
      type: string
      percent: number
    }[]
  }
  amounts: {
    alt: number
    cash: number
    fixedIncome: number
    otherIlliquid: number
    privateEquity: number
    realEstate: number
    yielding: number
    equities: number
    others: number
  }
  deals: {
    id: number
    name: string
    portfolioSize: number
    type: string
    region: string
    age: number
    industry: {
      key: string
      langCode: string
      value: string
    }[]
    investmentVehicle: string
    distributionAmount: number
    marketValue: number
    bookValue: number
    performance: {
      percent: number
      direction: string
    }
    holdingPeriod: number
    initialInvestmentDate: string
    priceDate: string
    sponsorOrPartner: string
    strategy: string
    brochure: {
      address: string
      description: string
      largeImageURL: string
      smallImage1URL: string
      smallImage2URL: string
    }
  }[]
  regionPercentage: {
    perNorthAmerica: number
    perAsia: number
    perEurope: number
    perGlobal: number
  }[]
}
export type Timeperiod = {
  year: number
  quarter: number | string
}
export type Deal2 = {
  id: number
  name: string
  portfolioSize: number
  type: string
  region: string
  age: number
  industry: Industry[]
  investmentVehicle: string
  distributionAmount: number
  marketValue: number
  bookValue: number
  performance: Performance
  holdingPeriod: number
  initialInvestmentDate: string
  priceDate: string
  sponsorOrPartner: string
  strategy: string
  brochure: Brochure
}
export type Industry = {
  key: string
  langCode: string
  value: string
}
export type Performance = {
  percent: number
  direction: string
}
export type Brochure = {
  address: string
  description: string
  largeImageURL?: string
  smallImage1URL?: string
  smallImage2URL?: string
}
export type Investment = {
  region: string
  investmentVehicle: string
  deals: DealsType[]
}
export type GroupByDeal = {
  timeperiod: Timeperiod
  deals: Deal[]
}
export type Deal = {
  investmentVehicle: string
  region: string
  investments: DealsType[]
}
export type DealsType = {
  id: number
  name: string
  portfolioSize: number
  type: string
  region: string
  age: number
  industry: Industry[]
  investmentVehicle: string
  distributionAmount: number
  marketValue: number
  bookValue: number
  performance: Performance
  holdingPeriod: number
  initialInvestmentDate: string
  priceDate: string
  sponsorOrPartner: string
  strategy: string
  brochure: Brochure
}
export type InvestmentCartDealDetails = {
  opportunityId: number
  opportunityName: string
  sponsor?: string
  assetClass?: string
  assetClassAr?: string
  sector?: string
  sectorAr?: string
  expectedExitYear?: string
  expectedReturn?: string
  country?: string
  countryAr?: string
  isInterested?: string
  minimumAmount: number
  maximumAmount: number
  isAddedToCart?: boolean
  isInvestmentPreferenceShariah: boolean
  isProgram: boolean
  isChecked?: boolean
  investmentAmountKey?: number
  inputState?: InputState
  investmentAmountLabel?: string
  isPreFund?: boolean
  concentration?: "5" | "10" | "20"
  associatedConventionalDealId: number | undefined
  programDeals?: SubscriptionDealsDetail[]
  isScheduled?: boolean
  isSeen?: boolean
  clientOpportunityId?: number
  deals?: SubscriptionDealsDetail[]
  isExpiredDeal?: boolean
}

export type InputState =
  | "initial"
  | "error_maximum_amount"
  | "error_minimum_amount"
  | "untouched"
  | "valid"
  | string

export type InterestedOpportunitiesProps = {
  opportunities: OpportunitiesProps[]
  showHeading?: boolean
  showAll?: boolean
}

export type OpportunitiesProps = {
  opportunityId: number
  opportunityName: string
  about: string
  expectedReturn: string
  expectedExitYear: string
  assetClass: string
  country: string
  sector: string
  sponsor: string
  opportunityImageUrl: string
  countryImageUrl: string
  isShariah: boolean | number
  isProgram: boolean
  isInvested: boolean
}
export type DealDetails = {
  inception: Inception
  lastValuation: LastValuation
  periods: Period[]
}
export type Inception = {
  year: number
  quarter: number
}
export type LastValuation = {
  year: number
  quarter: number
}
export type Period = {
  timeperiod: Timeperiod
  bookValue: number
  marketValue: number
  initialFunding: number
  shares: number
  performanceContribution: number
  multiple: number
  netChange: number
  valueStart: number
  valueEnd: number
  returnOfCapital: number
  gainsOrLosses: number
  income: number
  holdingPeriod?: number
  initialInvestmentDate?: string
  priceDate?: string
  sponsorOrPartner?: string
  strategy?: string
  name?: string
  brochure?: Brochure
}

export type SubscriptionPrograms = ProgramsDetails[]
export type ProgramsDetails = {
  concentration: number
  programId: number
  subscriptionAmount: string
  isInvestmentPreferenceShariah: boolean
  associatedConventionalProgramId: number
  programName: string
  selectedDeal?: number
  deals: SubscriptionDealsDetail[]
}
export type SubscriptionDealsDetail = {
  dealName: string
  dealId: number
  unplacedAmount: number
  defaultSelection: boolean
  sponsor: string
  assetClass: string
  assetClassAr: string
  sector: string
  sectorAr: string
  expectedExitYear: string
  expectedReturn: string
  country: string
  countryAr: string
  moreInfo: {
    title: string
    value: string
  }[]
  isShariah: number
  commitedAmount: number
  isSelected?: boolean
}
export type opportunityDetailsObj = {
  opportunityId: number
  clientOpportunityId: number
  opportunityName: string
  about: string
  expectedReturn: string
  expectedExitYear: string
  assetClass: string
  country: string
  sector: string
  sponsor: string
  opportunityImageUrl: string
  countryImageUrl: string
  isShariah: boolean | number
  isProgram: boolean
  info: Info[]
  message: string
  disclaimer: string
  opportunityVideoUrl: string
  isInterested: string
  isScheduled: boolean
  isSeen: boolean
  isAddedToCart: boolean
  isInvested: boolean
}
export type opportunityDetails = opportunityDetailsObj[]
export type Info = {
  title: string
  text: {
    value: string
  }[]
}
export type GlossaryRes = GlossaryObj[]
export type GlossaryObj = {
  term: string
  definition: string
}
export type sortGlossaryDataWithSingleAplhabet = Array<{
  alphabet: string
  record: Array<GlossaryObj>
}>
export type categorzeArrayBySingleAplhabet = {
  // 👇️ key        👇️ value
  [key: string]: { alphabet: string; record: Array<GlossaryObj> }
}

export type TopIndices = {
  indexName: string
  indexCode: string
  indexLevel: string
  indexWeekChange: {
    percent: number
    direction: string
    unit: string
  }
}

export type TopStocks = {
  stockCompany: string
  stockCode: string
  stockPrice: number
  stockWeekChange: {
    percent: number
    direction: string
  }
}

export type TopBonds = {
  bondYields: string
  bondMaturity: number
  bondStockWeekChange: {
    percent: number
    direction: string
    unit?: string
  }
  bondWeekChange: {
    percent: number
    direction: string
    unit: string
  }
}

export type PAMicroServiceType = PAMicroServiceDataType[]

export type PAMicroServiceDataType = {
  clientActivityId: number
  dealName: string
  activityDate: string
  amount: number
  acitivityType: string
}

export type Insights = {
  name: string
  created_at: string
  published_at: string
  id: number
  uuid: string
  content: Content
  slug: string
  full_slug: string
  sort_by_date?: string
  position: number
  tag_list?: string[]
  is_startpage: boolean
  parent_id: number
  meta_data?: string
  group_id: string
  first_published_at: string
  release_id?: number
  lang: string
  path?: string
  alternates?: string[]
  default_full_slug?: string
  translated_slugs?: string
}

export type Content = {
  _uid: string
  Title: string
  Contents?: {
    _uid: string
    Title: string
    component: string
    Description: string
  }[]
  CardImage?: CardImage
  CardImage_clientapp?: CardImage
  component: string
  Disclaimer?: string
  BannerImage: BannerImage
  Description: string
  PublishDate: string
  EstimatedDuration: string
  client_app_content?: {
    _uid: string
    Title: string
    component: string
    Description: string
  }[]
  client_app_description?: string
  SRT_File?: SrtFile
  VideoURL?: string
  PosterImage?: PosterImage
  SRT_File_AR?: SrtFileAr
  Details?: string
  summary?: Summary[]
  OrderingSequence?: string
  Video?: Video
  Guests?: string[]
  DownloadLink?: DownloadLink
}
export type DownloadLink = {
  id: string
  url: string
  linktype: string
  fieldtype: string
  cached_url: string
}

export type Video = {
  id: string
  url: string
  linktype: string
  fieldtype: string
  cached_url: string
}

export type Summary = {
  _uid: string
  Title: string
  component: string
  BannerImage: string
  Description: string
  PublishDate: string
  EstimatedDuration: string
}

export type SrtFile = {
  id?: number
  alt?: number | string
  name: string
  focus?: string
  title?: string
  filename: string
  copyright?: string
  fieldtype: string
}

export type BannerImage = {
  id: number
  alt: string
  name: string
  focus?: string
  title: string
  filename: string
  copyright: string
  fieldtype: string
}
export type CardImage = {
  id: number
  alt: string
  name: string
  focus?: string
  title: string
  filename: string
  copyright: string
  fieldtype: string
}

export type PosterImage = {
  id: number
  alt: string
  name: string
  focus?: string
  title: string
  filename: string
  copyright: string
  fieldtype: string
}
export type SrtFileAr = {
  id?: string
  alt?: string
  name: string
  focus?: string
  title?: string
  filename: string
  copyright?: string
  fieldtype: string
}

export type MatketArchiveClient = {
  type: string
  insights: Insights[]
  pageCount: number
  totalCount: number
}

export type InsightsClient = {
  stories: Insights[]
}
export type finalPortfolioActivity = PortfolioActivityDataType &
  PortfolioActivityDealType

export type finalPortfolioActivityRes = Array<finalPortfolioActivity>

export type PortfolioActivityDataType = {
  date?: string
  numberOfEvents?: number
}

export type PortfolioActivityDealType = {
  [key: string]: Array<PortfolioActivityDealList>
}

export type PortfolioActivityDealList = {
  dealName?: string
  amount?: number
}

export type PortfolioActivityGroupByType = Array<Array<PAMicroServiceDataType>>

export type HighlightsResponse = {
  highlights: string[]
}
export type indices = {
  indexName: string
  indexCode: string
  indexLevel: string
  indexFXStrength: string
  indexWeekChange: {
    percent: number
    direction: string
    unit: string
  }
  indexYTDChange: {
    percent: number
    direction: string
    unit: string
  }
  indexFXCurrencyCode: string
  indexFXValue: {
    percent: number
    direction: string
  }
}[]
export type bond = {
  bondYields: string
  bondMaturity: number
  flag: string
  bondStockWeekChange: {
    percent: number
    direction: string
    unit: string
  }
  bondYTDChange: {
    percent: number
    direction: string
    unit: string
  }
  bondCloseChange: {
    percent: number
    direction: string
    unit: string
  }
  bondWeekChange: {
    percent: number
    direction: string
    unit: string
  }
}[]
export type stock = {
  stockCompany: string
  stockCode: string
  stockPrice: number
  stockWeekChange: {
    percent: number
    direction: string
  }
  stockYTDChange: {
    percent: number
    direction: string
  }
}[]
export type WatchlistResponse = {
  indices: indices
  bond: bond
  stock: stock
}

export type CardCategoriesResponse = {
  stockCategories: {
    categoryName: string
    categoryNumber: number
    items: {
      stockCompany: string
      stockCode: string
      stockPrice: number
      stockWeekChange: {
        percent: number
        direction: string
      }
      stockYTDChange: {
        percent: number
        direction: string
      }
    }[]
  }[]
  bondCategories: {
    categoryName: string
    categoryNumber: number
    items: {
      bondYields: string
      bondMaturity: number
      flag: string
      bondStockWeekChange: {
        percent: number
        direction: string
        unit: string
      }
      bondYTDChange: {
        percent: number
        direction: string
        unit: string
      }
      bondCloseChange: {
        percent: number
        direction: string
        unit: string
      }
      bondWeekChange: {
        percent: number
        direction: string
        unit: string
      }
    }[]
  }[]
  indexCategories: {
    categoryName: string
    categoryNumber: number
    items: {
      indexName: string
      indexCode: string
      indexLevel: string
      indexFXStrength: string
      indexWeekChange: {
        percent: number
        direction: string
        unit: string
      }
      indexYtdChange: {
        percent: number
        direction: string
        unit: string
      }
      indexFXCurrencyCode: string
      indexFXValue: {
        percent: number
        direction: string
      }
    }[]
  }[]
}

export type TopWeeklyResponse = {
  week: string
  month: string
  year: string
  weekId: string
  timestamp: string
  sectionTitle: string
  topBonds: TopBonds[]
  topIndices: TopIndices[]
  topStocks: TopStocks[]
  message: string
  messageAr: string
  darstAudio: string
}
export type MarketSimplifiedResponse = {
  watchlistResponse: WatchlistResponse
  cardCategoriesResponse: CardCategoriesResponse
  highlightsResponse: HighlightsResponse
  topWeeklyResponse: TopWeeklyResponse
}
export type marketArchiveReqBody = {
  lang: string
  count: number
  type: string
  category: string
  currentPage: number
}

export type RmAppointmentResponse = {
  appointmentId: string
  onlineMeetingUrl: string
  clientEventId: string
  rmEventId: string
}

export type PortfolioActivityType = {
  distributions: PortfolioActivityDealsType[]
  capitalCalls: PortfolioActivityDealsType[]
  exits: PortfolioActivityDealsType[]
  date: string
  numberOfEvents: number
}

type PortfolioActivityDealsType = {
  dealName: string
  amount: number
}

export type OpportunitiesResponseType = {
  data: OpportunitiesProps[]
  filterValues: {
    assetClass: [
      {
        assetClass: string
        assetClassAr: string
      },
    ]
    sector: [
      {
        sector: string
        sectorAr: string
      },
    ]
    sponsor: [
      {
        sponsor: string
      },
    ]
  }
}
export type DealDistributionTypes = {
  year?: number | string
  ytdDistributionProjection: number | string
  itdDistributionProjection: number | string
  ytdCapitalCallProjection: number | string
  itdCapitalCallProjection: number | string
  yearFrom?: number | string
  yearTo?: number | string
  distributionPerTimePeriod: Array<DistributionPerTimePeriod>
}

export type DistributionPerTimePeriod = {
  timeperiod: Timeperiod
  spvList: Array<SpvList>
}

export type SpvList = {
  totalDistributions: number
  spvName: string
  spvLongName: string
  dealsData: Array<DetailDeals>
}

export type DetailDeals = {
  dealId: number
  dealName: string
  distributionDate: string
  type: string
  amount: number
}

export type structuredPerformanceDetailsData = structuredPerformanceDetailData[]

export type structuredPerformanceDetailData = {
  quarter: number | string
  detailedPerformance: DetailedPerformance
  monthlyPerformance: Array<MonthlyPerformance>
  performanceChartData: PerformanceChartData
  year?: number
}

export type DetailedPerformance = {
  valueStart: number
  valueEnd: number
  itdAnnualizedPercent: ItdAnnualizedPercent
  itdAnnualizedPercentPerAnnum: number
  netChangeValue: NetChangeValue
  netChangePercent: NetChangePercent
  liquidValue: LiquidValue
  liquidValuePerAnnum: number
  illiquidValue: IlliquidValue
  illiquidValuePerAnnum: number
  illiquidVintage: IlliquidVintage
  illiquidVintagePerAnnum: number
  sharpeRatio: number
  riskVolatility: number
  annualizedPerformance: number
  additions: number
}

export type ItdAnnualizedPercent = {
  percent: number
  direction: string
}

export type NetChangeValue = {
  money: number
  direction: string
}

export type NetChangePercent = {
  percent: number
  direction: string
}

export type LiquidValue = {
  percent: number
  direction: string
}

export type IlliquidValue = {
  percent: number
  direction: string
}

export type IlliquidVintage = {
  percent: number
  direction: string
}

export type MonthlyPerformance = {
  period: {
    year: number
    month?: number
  }
  netChange: number
  additionsOrWithdrawels: number
  performance: number
  cumulativePerformancePercent: number
  cumulativePerformanceValue: number
}

export type PerformanceChartData = {
  cumulativeData: Array<number>
  periodicData: Array<number>
  months: Array<string>
  minMaxValue: MinMaxValue
}

export type MinMaxValue = {
  max: number
  min: number
}

export type PerformanceExcelArray = Array<{
  ["Period Performance"]: string | number
  ["Net Change"]: string | number
  ["Additions Or Withdrawels"]: string | number
  Performance: string | number
  ["Cumulative Performance Percent (%)"]: string | number
  ["Cumulative Performance Value"]: string | number
}>

export type InvestmentOrPortfolioSummaryExcelArray = Array<{
  ["Asset Class"]?: string
  ["Investment Name"]?: string
  ["Deal Name"]: string
  SPV: string
  ["Investment Date"]: string
  ["Investment Amount"]: number | string
  ["Market Value"]: number | string
  ["Performance Contribution"]: string | number
}>

export type InvestmentListingExcelArray = Array<{
  Fund: string
  ["Book Value"]: string | number
  ["Market Value"]: string | number
  Distribution: string | number
  Type: string | number
  Region: string | number
  Sector: string | number
  ["Holding Period"]: string | number
  ["As Of Quarter"]: string | number
}>

export type ProfitLossExcelArray = Array<{
  ["Asset Class"]: string | number
  ["Total Commision Expenses"]: string | number
  ["Total Forex Income"]: string | number
  ["Total Income"]: string | number
  ["Total Capital Appreciation"]: string | number
  ["Relative Commision Expenses"]: string | number
  ["Relative Forex Results"]: string | number
  ["Relative Income"]: string | number
  ["Relative Capital Appreciation"]: string | number
}>

export type CommitmentExcelArray = Array<{
  Deal: string | number
  ["Deployed (%)"]: string | number
  Committed: string | number
  Called: string | number
  Uncalled: string | number
  Strategy: string | number
  ["Committed Date"]: string | number
}>

export type CashflowExcelArray = Array<{
  Deal: string
  SPV: string
  ["Distribution Date"]: string
  Type: string
  Amount: string | number
  Quarter: string | number
}>

export type DealDataType = {
  timePeriods: [
    {
      deals: []
      holdings: { percentages: [{ percent: number; type: string }] }
    },
  ]
}

export type DealsAllocationTypes = {
  allocationChartData: AllocationChartDaum[]
  assetTableData: AssetTableDaum[]
}

export type AllocationChartDaum = {
  name?: string
  value?: number
  color?: string
}

export type AssetTableDaum = {
  type: string
  data: Daum[]
  color: string
}

export type Daum = {
  id: number
  name: string
  portfolioSize: number
  region: string
  age: number
  industry: Industry[]
  investmentVehicle: string
  distributionAmount: number
  marketValue: number
  bookValue: number
  performance: Performance
  holdingPeriod: number
  initialInvestmentDate: string
  priceDate: string
  sponsorOrPartner: string
  strategy: string
  brochure: Brochure
}
