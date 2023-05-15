import { Iniciador } from '../dist/index.js'

const iniciador = new Iniciador({
  clientId: 'c82700f8-f0bf-4cce-9068-a2fd6991ee9b',
  clientSecret: 'sB#C8ybhJEN63RjBz6Kpd8NUywHkKzXN$d&Zr3j4',
  environment: 'dev',
})

const { accessToken, paymentId } = await iniciador.authInterface({
  participantId: 'c8f0bf49-4744-4933-8960-7add6e590841',
  redirectURL: 'https://app.sandbox.inic.dev/pag-receipt',
  user: {
    name: 'John Doe',
    taxId: '76109277673',
  },
  amount: 133300,
})

const payment = await iniciador.payment({ accessToken }).get(paymentId)
const paymentStatus = await iniciador.payment({ accessToken }).status(paymentId)
const savePayment = iniciador.save({
  externalId: 'externalId',
  participantId: 'c8f0bf49-4744-4933-8960-7add6e590841',
  redirectURL: 'https://app.sandbox.inic.dev/pag-receipt',
  user: {
    name: 'John Doe',
    taxId: '76109277673',
  },
  amount: 133300,
  method: 'PIX_INIC',
})
const paymentInitiation = await iniciador.payment({ accessToken }).send()

console.log('Payment: ', paymentInitiation)
