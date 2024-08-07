import { Iniciador } from '../dist/index.js'

// Instantiate the Iniciador object with the provided configurations
const iniciador = new Iniciador({
  clientId: 'clientId',
  clientSecret: 'clientSecret',
  environment: 'dev',
})
// Authentication and obtaining the accessToken
const { accessToken } = await iniciador.auth()

// Call to retrieve the list of participants
const participants = await iniciador.participants({ accessToken })

// Saving the payment with the specified details
const savePayment = iniciador.save({
  externalId: 'externalId',
  participantId: '0b919e9b-bee0-4549-baa3-bb6d003575ce',
  redirectURL: 'https://app.sandbox.inic.dev/pag-receipt',
  user: {
    name: 'John Doe',
    taxId: 'taxId',
  },
  amount: 133300,
  method: 'PIX_MANU_AUTO',
})

// Sending the payment initiation and obtaining the result
const paymentInitiation = await iniciador.payment({ accessToken }).send()

// Get the details of a specific payment by ID
const payment = await iniciador.payment({ accessToken }).get()

// Get the status of a specific payment by ID
const paymentStatus = await iniciador.payment({ accessToken }).status()
