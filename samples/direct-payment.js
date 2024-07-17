import { Iniciador } from '../dist/index.js'

// Instantiate the Iniciador object with the provided configurations
const iniciador = new Iniciador({
  clientId: '4c19e330-e5f9-4981-99eb-9d3a4a8cf429',
  clientSecret: 'uwtG12!EAQQYA%99KgV*WVQ%qFU%4Cd9vWYsyv$g',
  environment: 'dev',
})

// Saving the payment with the specified details
const savePayment = iniciador.save({
  externalId: 'externalId',
  participantId: '0b919e9b-bee0-4549-baa3-bb6d003575ce',
  redirectURL: 'https://app.sandbox.inic.dev/pag-receipt',
  user: {
    name: 'John Doe',
    taxId: '76109277673',
  },
  amount: 133300,
  method: 'PIX_MANU_AUTO',
})

// Sending the direct payment initiation and obtaining the result
const paymentInitiation = await iniciador.directPayment().send()

// Get the details of a specific payment by ID
const payment = await iniciador.directPayment().get(paymentInitiation.id)

// Get the status of a specific payment by ID
const paymentStatus = await iniciador.directPayment().status(paymentInitiation.id)
