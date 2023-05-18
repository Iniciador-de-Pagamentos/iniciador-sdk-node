export interface User {
  taxId: string
  name?: string
}

export interface Bank {
  id?: string
  name?: string
  avatar?: string
}

export enum OFAccountsType {
  checkingAccount = 'CACC',
  salaryAccount = 'SLRY',
  savingsAccount = 'SVGS',
  prePaidAccount = 'TRAN',
}

export interface BankAccount {
  taxId?: string
  name?: string
  number: string
  accountType: OFAccountsType
  ispb: string
  issuer: string
  bank?: Bank
}

export enum PaymentInitiationStatus {
  STARTED = 'STARTED',
  ENQUEUED = 'ENQUEUED',
  CONSENT_AWAITING_AUTHORIZATION = 'CONSENT_AWAITING_AUTHORIZATION',
  CONSENT_AUTHORIZED = 'CONSENT_AUTHORIZED',
  CONSENT_REJECTED = 'CONSENT_REJECTED',
  PAYMENT_PENDING = 'PAYMENT_PENDING',
  PAYMENT_PARTIALLY_ACCEPTED = 'PAYMENT_PARTIALLY_ACCEPTED',
  PAYMENT_SETTLEMENT_PROCESSING = 'PAYMENT_SETTLEMENT_PROCESSING',
  PAYMENT_SETTLEMENT_DEBTOR_ACCOUNT = 'PAYMENT_SETTLEMENT_DEBTOR_ACCOUNT',
  PAYMENT_COMPLETED = 'PAYMENT_COMPLETED',
  PAYMENT_REJECTED = 'PAYMENT_REJECTED',
  CANCELED = 'CANCELED',
  ERROR = 'ERROR',
  PAYMENT_SCHEDULED = 'PAYMENT_SCHEDULED',
}

export interface Provider {
  tradeName: string
  avatar: string
  mainColor: string
}

export interface Metadata {
  [key: string]: unknown
}

export interface PaymentInitiationPayload {
  id: string
  createdAt: Date
  error?: {
    code: string
    description: string
  }
  status?: PaymentInitiationStatus
  externalId?: string
  endToEndId?: string
  transactionIdentification?: string
  clientId: string
  customerId: string
  provider?: Provider
  consentId?: string
  paymentId?: string
  participantId?: string
  user: User
  businessEntity?: User
  method: string
  pixKey?: string
  qrCode?: string
  amount: number
  date: string
  description?: string
  metadata?: Metadata
  redirectURL?: string
  redirectOnErrorURL?: string
  ibge?: string
  debtor?: BankAccount
  creditor?: BankAccount
  fee?: number
}

export interface PaymentStatusPayload {
  id: string
  date: string
  consentId?: string
  createdAt: string
  updatedAt: string
  transactionIdentification?: string
  endToEndId?: string
  amount: number
  status: string
  error?: Error
  redirectConsentURL?: string
  externalId: string
}
