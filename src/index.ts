import { AuthInterfaceOutput, AuthOutput } from './types/auth'
import { ParticipantFilterDto, ParticipantFilterOutputDto } from './types/participants'
import { PaymentInitiationPayload, PaymentStatusPayload } from './types/payments'

export class Iniciador {
  private clientId: string
  private clientSecret: string
  private environmentURL: string

  private paymentPayload: object | PaymentInitiationPayload

  constructor({
    clientId,
    clientSecret,
    environment,
  }: {
    clientId: string
    clientSecret: string
    environment: 'dev' | 'sandbox' | 'staging' | 'prod'
  }) {
    this.clientId = clientId
    this.clientSecret = clientSecret
    this.environmentURL = this.setEnviromentURL(environment)
    this.paymentPayload = {}
  }

  /**
   * @function setEnviroment
   * @description set enviroment url.
   * @param {string} environment - informed enviroment.
   * @returns {string}
   */
  private setEnviromentURL = (environment: string): string => {
    switch (environment) {
      case 'dev':
        return 'https://consumer.dev.inic.dev/v1'
      case 'sandbox':
        return 'https://consumer.sandbox.inic.dev/v1'
      case 'staging':
        return 'https://consumer.staging.inic.dev/v1'
      case 'prod':
        return 'https://consumer.iniciador.com.br/v1'
      default:
        throw new Error('Something went wrong, verify enviroment value.')
    }
  }

  /**
   * @function handleResponse
   * @description handle fetch responses.
   * @param {Response} response - response from fetch.
   * @returns {Promise<T>}
   */
  private handleResponse<T>(response: Response): Promise<T> {
    return response.json() as Promise<T>
  }

  /**
   * @function extractJwtData
   * @description extracts the data from a JWT token.
   * @param {string} token - The JWT token.
   * @returns {object | Error} - An object containing the header and payload data from the token.
   * @throws {Error} - Throws an error if the token is invalid or cannot be parsed.
   */
  private extractJwtData(token: string): any {
    const parts = token.split('.')
    if (parts.length !== 3) {
      // JWT token should have three parts separated by periods
      throw new Error('Something went wrong, verify your access token.')
    }

    try {
      const header = JSON.parse(Buffer.from(parts[0] as string, 'base64').toString('utf-8'))
      const { payload } = JSON.parse(Buffer.from(parts[1] as string, 'base64').toString('utf-8'))
      return {
        header,
        payload,
      }
    } catch (error) {
      // Error decoding the token or parsing JSON
      throw new Error('Something went wrong, verify your access token.')
    }
  }

  /**
   * @function auth
   * @description handles the authentication process by making a POST request to the auth endpoint.
   * @returns {Promise<AuthOutput>} A promise that resolves to the auth output.
   */
  async auth(): Promise<AuthOutput> {
    return fetch(`${this.environmentURL}/auth`, {
      method: 'POST',
      body: JSON.stringify({
        clientId: this.clientId,
        clientSecret: this.clientSecret,
      }),
      headers: { 'Content-Type': 'application/json' },
    }).then((response) => this.handleResponse<AuthOutput>(response))
  }

  /**
   * @function authInterface
   * @description handles the authentication process by making a POST request to the auth interface endpoint.
   * @returns {Promise<AuthInterfaceOutput>} A promise that resolves to the auth interface output.
   */
  async authInterface(): Promise<AuthInterfaceOutput> {
    return fetch(`${this.environmentURL}/auth/interface`, {
      method: 'POST',
      body: JSON.stringify({
        clientId: this.clientId,
        clientSecret: this.clientSecret,
      }),
      headers: { 'Content-Type': 'application/json' },
    }).then((response) => this.handleResponse<AuthInterfaceOutput>(response))
  }

  /**
   * @function participants
   * @description Retrieves participants by making a GET request to the participants endpoint.
   * @param {Object} params - Parameters for participant retrieval.
   * @param {string} params.accessToken - The access token used for authorization.
   * @param {ParticipantFilterDto} [params.filters] - (Optional) Filters to apply to the participant retrieval.
   * @returns {Promise<ParticipantFilterOutputDto>} A promise that resolves to the filtered participant output.
   */
  async participants({
    accessToken,
    filters,
  }: {
    accessToken: string
    filters?: ParticipantFilterDto
  }): Promise<ParticipantFilterOutputDto> {
    const filterParams: Record<string, string> = {}

    if (filters)
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          filterParams[key] = value.toString()
        }
      })

    const queryString = new URLSearchParams(filterParams).toString()
    const url = `${this.environmentURL}/participants?${queryString}`

    return fetch(url, {
      headers: { Authorization: `Bearer ${accessToken}` },
    }).then((response) => this.handleResponse<ParticipantFilterOutputDto>(response))
  }

  /**
   * @function save
   * @description Saves the payment initiation payload.
   * @param {PaymentInitiationPayload} [payment] - (Optional) The payment initiation payload to save.
   */
  save(payment?: PaymentInitiationPayload) {
    this.paymentPayload = Object.assign(this.paymentPayload, payment)
  }

  /**
   * @function payment
   * @description Provides methods for payment-related operations.
   * @param {Object} params - Parameters for the payment methods.
   * @param {string} params.accessToken - The access token used for authorization.
   * @returns {Object} An object containing payment methods.
   */
  payment({ accessToken }: { accessToken: string }): {
    get: () => Promise<PaymentInitiationPayload>
    status: () => Promise<PaymentStatusPayload>
    send: () => Promise<PaymentInitiationPayload>
  } {
    const {
      payload: { id: paymentId },
    } = this.extractJwtData(accessToken)

    return {
      /**
       * @function get
       * @description Retrieves the payment with the specified payment ID.
       * @returns {Promise<PaymentInitiationPayload>} A promise that resolves to the payment initiation payload.
       */
      get: async (): Promise<PaymentInitiationPayload> => {
        return fetch(`${this.environmentURL}/payments/${paymentId}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        }).then((response) => this.handleResponse<PaymentInitiationPayload>(response))
      },
      /**
       * @function status
       * @description Retrieves the status of the payment with the specified payment ID.
       * @returns {Promise<PaymentStatusPayload>} A promise that resolves to the payment status payload.
       */
      status: async (): Promise<PaymentStatusPayload> => {
        return fetch(`${this.environmentURL}/payments/${paymentId}/status`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        }).then((response) => this.handleResponse<PaymentStatusPayload>(response))
      },
      /**
       * @function send
       * @description Sends the payment using the stored payment payload.
       * @throws {Error} Throws an error if the payment payload is empty.
       * @returns {Promise<PaymentInitiationPayload>} A promise that resolves to the payment status payload.
       */
      send: async (): Promise<PaymentInitiationPayload> => {
        const isPaymentPayloadEmpty = Object.keys(this.paymentPayload).length === 0
        if (isPaymentPayloadEmpty) {
          throw new Error('Something went wrong, try to fill up payment payload with save method.')
        }

        return fetch(`${this.environmentURL}/payments`, {
          method: 'POST',
          body: JSON.stringify(this.paymentPayload),
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` },
        }).then((response) => this.handleResponse<PaymentInitiationPayload>(response))
      },
    }
  }

  /**
   * @function directPayment
   * @description Provides methods for direct payment-related operations.
   * @returns {Object} An object containing payment methods.
   */
  directPayment(): {
    get: (paymentId: string) => Promise<PaymentInitiationPayload>
    status: (paymentId: string) => Promise<PaymentStatusPayload>
    send: () => Promise<PaymentInitiationPayload>
  } {
    const basicAuth = `${Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64')}`

    return {
      /**
       * @function get
       * @description Retrieves the payment with the specified payment ID.
       * @param {string} paymentId - Payment initiation ID.
       * @returns {Promise<PaymentInitiationPayload>} A promise that resolves to the payment initiation payload.
       */
      get: async (paymentId: string): Promise<PaymentInitiationPayload> => {
        return fetch(`${this.environmentURL}/direct/payments/${paymentId}`, {
          headers: { Authorization: `Basic ${basicAuth}` },
        }).then((response) => this.handleResponse<PaymentInitiationPayload>(response))
      },
      /**
       * @function status
       * @description Retrieves the status of the payment with the specified payment ID.
       * @param {string} paymentId - Payment initiation ID.
       * @returns {Promise<PaymentStatusPayload>} A promise that resolves to the payment status payload.
       */
      status: async (paymentId: string): Promise<PaymentStatusPayload> => {
        return fetch(`${this.environmentURL}/direct/payments/${paymentId}/status`, {
          headers: { Authorization: `Basic ${basicAuth}` },
        }).then((response) => this.handleResponse<PaymentStatusPayload>(response))
      },
      /**
       * @function send
       * @description Sends the payment using the stored payment payload.
       * @throws {Error} Throws an error if the payment payload is empty.
       * @returns {Promise<PaymentInitiationPayload>} A promise that resolves to the payment status payload.
       */
      send: async (): Promise<PaymentInitiationPayload> => {
        const isPaymentPayloadEmpty = Object.keys(this.paymentPayload).length === 0
        if (isPaymentPayloadEmpty) {
          throw new Error('Something went wrong, try to fill up payment payload with save method.')
        }

        return fetch(`${this.environmentURL}/direct/payments`, {
          method: 'POST',
          body: JSON.stringify(this.paymentPayload),
          headers: { 'Content-Type': 'application/json', Authorization: `Basic ${basicAuth}` },
        }).then((response) => this.handleResponse<PaymentInitiationPayload>(response))
      },
    }
  }
}
