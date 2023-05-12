import { Iniciador } from '@sdk-node'

const iniciador = new Iniciador({
  clientId: 'c82700f8-f0bf-4cce-9068-a2fd6991ee9b',
  clientSecret: 'sB#C8ybhJEN63RjBz6Kpd8NUywHkKzXN$d&Zr3j4',
  environment: 'dev',
})

iniciador.authInterface().then((token) => console.log('Token: ', token))
