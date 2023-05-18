import nock from 'nock'

import { Iniciador } from './index'

import { ParticipantsListMock, PaymentInitiationMock, PaymentInitiationstatusMock } from './mocks'

beforeAll(() => {
  nock.disableNetConnect()

  nock('https://consumer.dev.inic.dev/v1')
    .post('/auth')
    .reply(201, { accessToken: 'yourAuthToken' })
    .post('/auth/interface')
    .reply(201, { interfaceURL: 'http://iniciador.com.br', accessToken: 'yourAuthToken', paymentId: 'yourPaymentId' })
    .get('/participants')
    .query(true)
    .reply(200, { data: ParticipantsListMock, cursor: { afterCursor: null, beforeCursor: null } })
    .get('/payments/paymentId')
    .reply(200, PaymentInitiationMock)
    .get('/payments/paymentId/status')
    .reply(200, PaymentInitiationstatusMock)
    .post('/payments')
    .reply(201, PaymentInitiationMock)
})

afterAll(() => {
  nock.cleanAll()
})

describe('Iniciador', () => {
  const clientId = 'yourClientId'
  const clientSecret = 'yourClientSecret'
  const environment = 'dev'

  const iniciador = new Iniciador({ clientId, clientSecret, environment })

  describe('auth', () => {
    it('should return the auth output', async () => {
      const output = await iniciador.auth()

      expect(output).toEqual({ accessToken: 'yourAuthToken' })
    })
  })

  describe('authInterface', () => {
    it('should return the auth interface output', async () => {
      const output = await iniciador.authInterface()

      expect(output).toEqual({
        interfaceURL: 'http://iniciador.com.br',
        accessToken: 'yourAuthToken',
        paymentId: 'yourPaymentId',
      })
    })
  })

  describe('participants', () => {
    it('should return participants output', async () => {
      const output = await iniciador.participants({ accessToken: 'yourAuthToken' })

      expect(output.data).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(String),
            name: expect.any(String),
            avatar: expect.any(String),
          }),
        ]),
      )
      expect(output.cursor).toBeDefined()
    })
  })

  describe('save', () => {
    it('should save payment initiation data', () => {
      const data: any = {
        amount: 13333,
      }

      iniciador.save(data)

      expect(iniciador['paymentPayload']).toEqual(data)
    })
  })

  describe('payment', () => {
    it('should return a payment initiation', async () => {
      const output = await iniciador.payment({ accessToken: 'yourAuthToken' }).get('paymentId')

      expect(output).toEqual(PaymentInitiationMock)
    })

    it('should return payment initiation status', async () => {
      const output = await iniciador.payment({ accessToken: 'yourAuthToken' }).status('paymentId')

      expect(output).toEqual(PaymentInitiationstatusMock)
    })

    describe('create a payment initiation', () => {
      it('should throw an error if paymentPayload was void', async () => {
        iniciador['paymentPayload'] = {}

        await iniciador
          .payment({ accessToken: 'yourAuthToken' })
          .send()
          .catch((error) => {
            expect(error).toMatchObject({
              message: 'Something went wrong, try to fill up payment payload with save method.',
            })
          })
      })

      it('should create a payment initiation', async () => {
        const paymentInitiationData: any = {
          externalId: 'externalId',
          participantId: 'c8f0bf49-4744-4933-8960-7add6e590841',
          redirectURL: 'https://app.sandbox.inic.dev/pag-receipt',
          user: {
            name: 'John Doe',
            taxId: 'taxId',
          },
          amount: 133300,
          method: 'PIX_INIC',
        }

        nock('https://consumer.dev.inic.dev/v1')
          .post('/payments', paymentInitiationData)
          .reply(201, PaymentInitiationMock)

        iniciador.save(paymentInitiationData)

        const output = await iniciador.payment({ accessToken: 'yourAuthToken' }).send()

        expect(output).toEqual(PaymentInitiationMock)
      })
    })
  })
})
