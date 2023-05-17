# Iniciador Node SDK

Welcome to the Iniciador Node SDK! This tool is made for Node
developers who want to easily integrate with our API.

If you have no idea what Iniciador is, check out our [website](https://www.iniciador.com.br/)

## 1. Description

The Iniciador SDK is a Node.js library that provides a convenient way to interact with the Iniciador API.

## 2. Installation

To install the Iniciador SDK, run the following command:

```bash
npm install iniciador-sdk
```

## 3. Usage

To use the Iniciador SDK, import the necessary modules and create an instance of the `Iniciador` class:

```javascript
const { Iniciador } = require('iniciador-sdk')

const iniciador = new Iniciador({
  clientId: 'your-client-id',
  clientSecret: 'your-client-secret',
  environment: 'dev', // or 'sandbox' or 'staging'
})
```

### 3.1 Whitelabel

#### 3.1.1 Authentication

To authenticate with the Iniciador Whitelabel, use the `authInterface` method:

```javascript
const { accessToken, interfaceURL, paymentId } = await iniciador.authInterface()
```

- Use interfaceURL to complete the payment flow
- Use the accessToken and paymentId to verify the payment data

#### 3.1.2 Payments

To use payments services with the Iniciador Whitelabel, use the `payments` method:

##### 3.1.2.1 `get`

to get the payment details use `get` method

```javascript
const payment = await iniciador.payment({ accessToken }).get(paymentInitiation.id)
```

##### 3.1.2.2 `status`

to get the payment status details use `status` method

```javascript
const paymentStatus = await iniciador.payment({ accessToken }).status(paymentInitiation.id)
```

### 3.2 API Only

#### 3.2.1 Authentication

To authenticate with the Iniciador API, use the `auth` method:

```javascript
const { accessToken } = await iniciador.auth()
```

#### 3.2.2 Participants

To get participants with the Iniciador API, use the `participants` method:

```javascript
const participants = await iniciador.participants({ accessToken })
```

#### 3.2.3 Payments

To use payments services with the Iniciador API, use the `payments` method:

##### 3.2.3.1 `save`

to save the payment with the specified details use `save` method

```javascript
const savePayment = iniciador.save({
  externalId: 'externalId',
  participantId: 'c8f0bf49-4744-4933-8960-7add6e590841',
  redirectURL: 'https://app.sandbox.inic.dev/pag-receipt',
  user: {
    name: 'John Doe',
    taxId: 'taxId',
  },
  amount: 133300,
  method: 'PIX_INIC',
})
```

##### 3.2.3.2 `send`

to send the payment use `send` method

```javascript
const paymentInitiation = await iniciador.payment({ accessToken }).send()
```

##### 3.2.3.3 `get`

to get the payment details use `get` method

```javascript
const payment = await iniciador.payment({ accessToken }).get(paymentInitiation.id)
```

##### 3.2.3.4 `status`
to get the payment status details use `status` method

```javascript
const paymentStatus = await iniciador.payment({ accessToken }).status(paymentInitiation.id)
```

## Help and Feedback

If you have any questions or need assistance regarding our SDK, please don't hesitate to reach out to us. Our dedicated support team is here to help you integrate with us as quickly as possible. We strive to provide prompt responses and excellent support.

We also highly appreciate any feedback you may have. Your thoughts and suggestions are valuable to us as we continuously improve our SDK and services. We welcome your input and encourage you to share your thoughts with us.

Feel free to contact us by sending an email to suporte@iniciador.com.br. We look forward to hearing from you and assisting you with your integration.
