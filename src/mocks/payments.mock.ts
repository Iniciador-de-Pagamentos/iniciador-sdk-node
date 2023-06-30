export const PaymentInitiationMock = {
  status: 'ENQUEUED',
  createdAt: '2022-07-19T20:02:10.859Z',
  updatedAt: null,
  deletedAt: null,
  id: '16c58618-406d-4d9e-81d4-f9e7a59f6db0',
  externalId: 'EXTERNAL_ID_acd05da5-7f91-436e-bf04-4977d1bfb2be',
  redirectURL: 'https://iniciador.com.br?ob=987654321',
  redirectConsentURL: null,
  userTaxId: '66972581010',
  ibge: null,
  amount: 135500,
  fee: 0,
  date: '2022-07-19T20:02:10.859Z',
  method: 'PIX_MANU_AUTO',
  description: null,
  debtorAccountPixKey: null,
  debtorAccountTaxId: null,
  debtorAccountName: null,
  debtorAccountISPB: '00104',
  debtorAccountBankName: null,
  debtorAccountBankAvatar: null,
  debtorAccountBankCOMPE: null,
  debtorAccountIssuer: null,
  debtorAccountNumber: null,
  debtorAccountType: null,
  debtorAccountDICTRaw: null,
  creditorAccountTaxId: '70803771029',
  creditorAccountName: 'creditor account name',
  creditorAccountISPB: '00104',
  creditorAccountBankName: 'Acentra',
  creditorAccountBankAvatar: 'https://www.acentra.coop.br/logo.svg',
  creditorAccountBankCOMPE: null,
  creditorAccountIssuer: 'issuer',
  creditorAccountNumber: '321',
  creditorAccountType: 'CACC',
  metadata: '{"tests":"tests"}',
  clientId: '0e3b1190-5e3a-4b2d-9074-1d64785a22c5',
  participant: {
    id: '6b6e18ac-0fff-4959-96d2-2da9900063d0',
    name: 'Acentra',
    avatar: 'https://www.acentra.coop.br/logo.svg',
  },
  participantId: '6b6e18ac-0fff-4959-96d2-2da9900063d0',
  serverApiVersion: 'v1',
}

export const PaymentInitiationstatusMock = {
  id: '16c58618-406d-4d9e-81d4-f9e7a59f6db0',
  date: '2022-07-19T20:02:10.859Z',
  createdAt: '2022-07-19T20:02:10.859Z',
  updatedAt: '2022-07-19T20:02:10.859Z',
  amount: 135500,
  status: 'ENQUEUED',
  error: {},
  redirectConsentURL: null,
  externalId: 'EXTERNAL_ID_acd05da5-7f91-436e-bf04-4977d1bfb2be',
  consentId: null,
  transactionIdentification: null,
}
