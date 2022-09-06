import { Auth0UserProfile, LoginOptions } from "auth0-js"

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Custom command to login.
       */
      login(): Chainable<Element>

      /**
       * Custom command to login BE.
       */
      loginBE(): Chainable<Element>

      /**
       * Custom command to login Client.
       */
      loginClient(): Chainable<Element>

      /**
       * Custom command to login using Social account from BE.
       */
      loginSocial(): Chainable<Element>
      /**
       * Custom command to login using Social account from BE.
       */
      loginSocial(): Chainable<Element>
      /**
       * Custom command to login using Social account from BE.
       */
      loginSocial(): Chainable<Element>
      /**
       * Custom command to login using Social account from BE.
       */
      loginSocial(): Chainable<Element>
      /**
       * Custom command to login using Social account from BE.
       */
      loginSocial(): Chainable<Element>
      /**
       * Custom command to login using Social account from BE.
       */
      loginSocial(): Chainable<Element>
      /**
       * Custom command to logout.
       */
      logout(): Chainable<Element>

      /**
       * Custom command to get user token.
       */
      getUserTokens(credentials: LoginOptions): Chainable<Auth0Result>

      /**
       * Custom command to get user profile info.
       */
      getUserInfo(accessToken: string): Chainable<Auth0UserProfile>

      /**
       * Custom command to get user profile info.
       */
      getClientUserInfo(accessToken: string): Chainable<Auth0UserProfile>

      /**
       * Custom command to get user profile info.
       */
      getMandateId(accessToken: string): Chainable<MandateList>

      /**
       * CLIENT: Custom command to assert rounding of dollar
       */
      checkDollarRounding(selector: string): Chainable<Element>

      /**
       * CLIENT: Custom command to assert decimal of percentages
       */
      checkPercentageDecimal(selector: string): Chainable<Element>

      /**
       * CLIENT: Custom command to assert decimal of percentages
       */
      scheduleMeet({
        timeZone,
        datePickerAriaLabel,
        fillTime,
        meetingType,
        phoneNumberPrefix,
      }: scheduleMeet): Chainable<Element>

      /**
       * CLIENT: Custom command to do filter
       */
      filterBy({ radio, checkbox }: filterBy): Chainable<Element>

      /**
       * CLIENT: Custom command to do test API's by clearing the cookie
       */
      testByClearCookie(
        requestObj: object,
        cookieName: string,
      ): Chainable<Element>

      /**
       * CLIENT: Custom command to do test API's by clearing the cookie
       */
      checkJsonSchemaForAllClient({
        mandatesList,
        requestObj,
        jsonSchema,
      }: checkJsonSchema): Chainable<Element>

      /**
       * CLIENT: Custom command to do test API's by clearing the cookie
       */
      testUpdateClientOpportunites({
        mandatesList,
        requestObj,
        jsonSchema,
      }: checkJsonSchema): Chainable<Element>

      /**
       * CLIENT: Custom command to do Check Calculation
       */
      orderSummaryCalculationCheck(): Chainable<Element>

      /**
       * CLIENT: Custom command to do Check Calculation
       */
      confirmCalculationCheck(invAmount): Chainable<Element>

      /**
       * CLIENT: Custom command to Enter the Amount
       */
      enterAmount(): Chainable<Element>

      /**
       * CLIENT: Custom command to count the textbox
       */
      textbox(): Chainable<Element>

      /**
       * CLIENT: Custom command to Remove Deal from Cart
       */
      removeDeal(): Chainable<Element>

      /**
       * CLIENT: Custom command to Add the Deal in to the cart
       */
      addToCartDeal(): Chainable<Element>

      /**
       * CLIENT: Custom command to Add the Program in to the cart
       */
      addToCartProgram(): Chainable<Element>
    }
  }
}

type Auth0Result = {
  accessToken: string
  expiresIn: string
  idToken: string
  scope: string
}

type MandateList = {
  userId: number
  mandateList: Array<{ mandateId: number; accountType: string }>
}

type scheduleMeet = {
  timeZone: RegExp | string
  datePickerAriaLabel: RegExp | string
  fillTime: "random" | RegExp | (string & {})
  meetingType: "phoneCall" | "virtualMeeting" | (string & {})
  callReason:
    | "TFO"
    | "portfolio"
    | "proposal"
    | "other"
    | "opportunity"
    | (string & {})
  phoneNumberPrefix: RegExp | (string & {})
  lang: "en" | "ar"
}

type filterBy = {
  radio?: Array<RegExp | string>
  checkbox?: Array<RegExp | string>
}

type checkJsonSchema = {
  mandatesList: Array<{ mandateId: number; accountType: string }>
  requestObj: {
    method?: string
    url?: string
    body?: object
  }
  jsonSchema: object
}
