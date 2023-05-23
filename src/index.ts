import fetch, { Response } from 'node-fetch'
import { AuthInterfaceOutput, AuthOutput } from './types/auth'
import { PaymentInitiationPayload, PaymentStatusPayload } from './types/payments'
import { ParticipantFilterDto, ParticipantFilterOutputDto } from './types/participants'

export class Iniciador {
  private clientId: string
  private clientSecret: string
  private environment: string

  private paymentPayload: object | PaymentInitiationPayload

  constructor({
    clientId,
    clientSecret,
    environment,
  }: {
    clientId: string
    clientSecret: string
    environment: 'dev' | 'sandbox' | 'staging'
  }) {
    this.clientId = clientId
    this.clientSecret = clientSecret
    this.environment = this.setEnviroment(environment)
    this.paymentPayload = {}
  }

  /**
   * @function setEnviroment
   * @description set enviroment url.
   * @param {string} environment - informed enviroment.
   * @returns {string}
   */
  private setEnviroment = (environment: string): string => {
    switch (environment) {
      case 'dev':
        return 'https://consumer.dev.inic.dev/v1'
      case 'sandbox':
        return 'https://consumer.sandbox.inic.dev/v1'
      case 'staging':
        return 'https://consumer.staging.inic.dev/v1'
      case 'prod':
        return 'https://consumer.u4c-iniciador.com.br/v1'
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
   * @function auth
   * @description handles the authentication process by making a POST request to the auth endpoint.
   * @returns {Promise<AuthOutput>} A promise that resolves to the auth output.
   */
  async auth(): Promise<AuthOutput> {
    return fetch(`${this.environment}/auth`, {
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
    return fetch(`${this.environment}/auth/interface`, {
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
    const url = `${this.environment}/participants?${queryString}`

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
    get: (paymentId: string) => Promise<PaymentInitiationPayload>
    status: (paymentId: string) => Promise<PaymentStatusPayload>
    send: () => Promise<PaymentInitiationPayload>
  } {
    return {
      /**
       * @function get
       * @description Retrieves the payment with the specified payment ID.
       * @param {string} paymentId - The ID of the payment to retrieve.
       * @returns {Promise<PaymentInitiationPayload>} A promise that resolves to the payment initiation payload.
       */
      get: async (paymentId: string): Promise<PaymentInitiationPayload> => {
        return fetch(`${this.environment}/payments/${paymentId}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        }).then((response) => this.handleResponse<PaymentInitiationPayload>(response))
      },
      /**
       * @function status
       * @description Retrieves the status of the payment with the specified payment ID.
       * @param {string} paymentId - The ID of the payment to retrieve the status for.
       * @returns {Promise<PaymentStatusPayload>} A promise that resolves to the payment status payload.
       */
      status: async (paymentId: string): Promise<PaymentStatusPayload> => {
        return fetch(`${this.environment}/payments/${paymentId}/status`, {
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

        return fetch(`${this.environment}/payments`, {
          method: 'POST',
          body: JSON.stringify(this.paymentPayload),
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` },
        }).then((response) => this.handleResponse<PaymentInitiationPayload>(response))
      },
    }
  }
}
