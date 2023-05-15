import fetch, { Response } from 'node-fetch'
import { AuthInterfaceOutput, AuthOutput } from './types/auth'
import { PaymentInitiationPayload, PaymentStatusPayload } from './types/payments'

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

  private setEnviroment = (environment: string) => {
    switch (environment) {
      case 'dev':
        return 'https://consumer.dev.inic.dev/v1'
      case 'sandbox':
        return 'https://consumer.sandbox.inic.dev/v1'
      case 'staging':
        return 'https://consumer.staging.inic.dev/v1'
      default:
        throw new Error('Something went wrong, verify enviroment value.')
    }
  }

  private handleResponse<T>(response: Response) {
    return response.json() as Promise<T>
  }

  async auth() {
    return fetch(`${this.environment}/auth`, {
      method: 'POST',
      body: JSON.stringify({
        clientId: this.clientId,
        clientSecret: this.clientSecret,
      }),
      headers: { 'Content-Type': 'application/json' },
    }).then((response) => this.handleResponse<AuthOutput>(response))
  }

  async authInterface(payment?: PaymentInitiationPayload) {
    return fetch(`${this.environment}/auth/interface`, {
      method: 'POST',
      body: JSON.stringify({
        clientId: this.clientId,
        clientSecret: this.clientSecret,
        payment,
      }),
      headers: { 'Content-Type': 'application/json' },
    }).then((response) => this.handleResponse<AuthInterfaceOutput>(response))
  }

  async participants({ accessToken }: { accessToken: string }) {
    return fetch(`${this.environment}/participants`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    }).then((response) => this.handleResponse<AuthInterfaceOutput>(response))
  }

  save(payment?: PaymentInitiationPayload) {
    this.paymentPayload = Object.assign(this.paymentPayload, payment)
  }

  payment({ accessToken }: { accessToken: string }) {
    return {
      get: async (paymentId: string) => {
        return fetch(`${this.environment}/payments/${paymentId}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        }).then((response) => this.handleResponse<PaymentInitiationPayload>(response))
      },
      status: async (paymentId: string) => {
        return fetch(`${this.environment}/payments/${paymentId}/status`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        }).then((response) => this.handleResponse<PaymentStatusPayload>(response))
      },
      send: async () => {
        const isPaymentPayloadEmpty = Object.keys(this.paymentPayload).length === 0
        if (isPaymentPayloadEmpty)
          throw new Error('Something went wrong, try to fill up payment payload with save method.')

        return fetch(`${this.environment}/payments`, {
          method: 'POST',
          body: JSON.stringify(this.paymentPayload),
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` },
        }).then((response) => this.handleResponse<PaymentStatusPayload>(response))
      },
    }
  }
}
