import fetch from 'node-fetch'
import { eres } from '@utils'

export class Iniciador {
  private clientId: string
  private clientSecret: string
  private environment: string

  constructor({
    clientId,
    clientSecret,
    environment,
  }: {
    clientId: string
    clientSecret: string
    environment: string
  }) {
    this.clientId = clientId
    this.clientSecret = clientSecret
    this.environment = this.setEnviroment(environment)
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
        break
    }
  }

  async auth() {
    const [error, response] = await eres(
      fetch(`${this.environment}/auth`, {
        method: 'POST',
        body: JSON.stringify({
          clientId: this.clientId,
          clientSecret: this.clientSecret,
        }),
      }),
    )

    if (error) throw new Error('Falha na autenticação')

    const data = await response.json()

    return data
  }

  async authInterface() {
    const [error, response] = await eres(
      fetch(`${this.environment}/auth/interface`, {
        method: 'POST',
        body: JSON.stringify({
          clientId: this.clientId,
          clientSecret: this.clientSecret,
        }),
      }),
    )

    if (error) throw new Error('Falha na autenticação')

    const data = await response.json()

    return data
  }

  payment({ accessToken }: { accessToken: string }) {
    return {
      get: async () => {
        const [error, response] = await eres(
          fetch(`${this.environment}/payment`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }),
        )

        if (error) throw new Error('Falha ao obter informações de pagamento')

        const data = await response.json()

        return data
      },
      status: async () => {
        const [error, response] = await eres(
          fetch(`${this.environment}/paymen/statust`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }),
        )

        if (error) throw new Error('Falha ao obter o status do pagamento')

        const data = await response.json()

        return data
      },
      listen: (callback: (event: any) => void) => {
        // Lógica para ouvir eventos relacionados ao pagamento e chamar o callback fornecido
        // Implemente a lógica de eventos usando WebSockets ou outra tecnologia adequada
      },
    }
  }
}
