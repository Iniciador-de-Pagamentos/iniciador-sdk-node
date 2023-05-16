import { Iniciador } from '../dist/index.js'

// Instantiate the Iniciador object with the provided configurations
const iniciador = new Iniciador({
  clientId: 'clientId',
  clientSecret: 'clientSecret',
  environment: 'dev',
})

/* 
  Authenticate and obtain the accessToken, interfaceURL and paymentId 
    - Use interfaceURL to complete the payment flow
    - Use the accessToken and paymentId to verify the payment data
*/
const { accessToken, interfaceURL, paymentId } = await iniciador.authInterface()

// Get the details of a specific payment by ID
const payment = await iniciador.payment({ accessToken }).get(paymentId)

// Get the status of a specific payment by ID
const paymentStatus = await iniciador.payment({ accessToken }).status(paymentId)
