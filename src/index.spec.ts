import fetch from 'node-fetch'
import { Iniciador } from './index'

jest.mock('node-fetch')
const mockedFetch = fetch as jest.MockedFunction<typeof fetch>

describe('Iniciador', () => {
  describe('auth', () => {
    it('should return the auth output', async () => {
      const clientId = 'yourClientId'
      const clientSecret = 'yourClientSecret'
      const environment = 'sandbox'

      const authOutput = { token: 'yourAuthToken' }

      mockedFetch.mockRejectedValueOnce(authOutput)

      const iniciador = new Iniciador({ clientId, clientSecret, environment })
      const output = await iniciador.auth()

      expect(output).toEqual(authOutput)
      expect(mockedFetch).toHaveBeenCalledWith(expect.stringContaining(environment), expect.any(Object))
    })
  })

  describe('authInterface', () => {
    it('should return the auth interface output', async () => {
      const clientId = 'yourClientId'
      const clientSecret = 'yourClientSecret'
      const environment = 'sandbox'

      const authInterfaceOutput = { interfaceToken: 'yourInterfaceToken' }

      mockedFetch.mockRejectedValueOnce(authInterfaceOutput)

      const iniciador = new Iniciador({ clientId, clientSecret, environment })
      const output = await iniciador.authInterface()

      expect(output).toEqual(authInterfaceOutput)
      expect(mockedFetch).toHaveBeenCalledWith(expect.stringContaining('/auth/interface'), expect.any(Object))
    })
  })
})
