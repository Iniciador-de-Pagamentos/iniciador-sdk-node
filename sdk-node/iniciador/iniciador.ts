import axios from 'axios'

import { eres } from '@utils'
import { match } from 'ts-pattern'

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
    return match(environment)
      .with('dev', () => 'https://consumer.dev.inic.dev/v1')
      .with('sandbox', () => 'https://consumer.sandbox.inic.dev/v1')
      .with('staging', () => 'https://consumer.staging.inic.dev/v1')
      .run()
  }

  async auth() {
    const [error, response] = await eres(
      axios.post(`${this.environment}/auth`, {
        clientId: this.clientId,
        clientSecret: this.clientSecret,
      }),
    )

    if (error) throw new Error('Falha na autenticação')

    return response.data
  }

  async authInterface() {
    const [error, response] = await eres(
      axios.post(`${this.environment}/auth/interface`, {
        clientId: this.clientId,
        clientSecret: this.clientSecret,
      }),
    )

    if (error) throw new Error('Falha na autenticação')

    return response.data
  }

  payment({ accessToken }: { accessToken: string }) {
    return {
      get: async () => {
        try {
          // Lógica para obter informações de pagamento
          const response = await axios.get(`${this.environment}/payment`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          })

          return response.data
        } catch (error) {
          // Trate o erro adequadamente
          throw new Error('Falha ao obter informações de pagamento')
        }
      },
      status: async () => {
        try {
          // Lógica para obter o status do pagamento
          const response = await axios.get(`${this.environment}/payment/status`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          })

          return response.data
        } catch (error) {
          // Trate o erro adequadamente
          throw new Error('Falha ao obter o status do pagamento')
        }
      },
      listen: (callback: (event: any) => void) => {
        // Lógica para ouvir eventos relacionados ao pagamento e chamar o callback fornecido
        // Implemente a lógica de eventos usando WebSockets ou outra tecnologia adequada
      },
    }
  }
}
