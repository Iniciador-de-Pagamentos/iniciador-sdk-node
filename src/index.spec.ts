import nock from 'nock'

import { Iniciador } from './index'

beforeAll(() => {
  nock.disableNetConnect()

  nock('https://consumer.dev.inic.dev/v1')
    .post('/auth')
    .reply(201, { accessToken: 'yourAuthToken' })
    .post('/auth/interface')
    .reply(201, { interfaceURL: 'http://iniciador.com.br', accessToken: 'yourAuthToken', paymentId: 'yourPaymentId' })
})

afterAll(() => {
  nock.cleanAll()
})

describe('Iniciador', () => {
  describe('auth', () => {
    it('should return the auth output', async () => {
      const clientId = 'yourClientId'
      const clientSecret = 'yourClientSecret'
      const environment = 'dev'

      const iniciador = new Iniciador({ clientId, clientSecret, environment })
      const output = await iniciador.auth()

      expect(output).toEqual({ accessToken: 'yourAuthToken' })
    })
  })

  describe('authInterface', () => {
    it('should return the auth interface output', async () => {
      const clientId = 'yourClientId'
      const clientSecret = 'yourClientSecret'
      const environment = 'dev'

      const iniciador = new Iniciador({ clientId, clientSecret, environment })
      const output = await iniciador.authInterface()

      expect(output).toEqual({
        interfaceURL: 'http://iniciador.com.br',
        accessToken: 'yourAuthToken',
        paymentId: 'yourPaymentId',
      })
    })
  })
})
