interface ParticipantsPayload {
  id: string
  slug: string
  name: string
  avatar: string
}

interface Cursor {
  afterCursor: string
  beforeCursor: string
}

export interface ParticipantFilterOutputDto {
  data: ParticipantsPayload[]
  cursor: Cursor
}

export interface ParticipantFilterDto {
  id?: string

  name?: string

  slug?: string

  status?: 'ACTIVE' | 'INACTIVE'

  firstParticipants?: string

  limit?: string

  afterCursor?: string

  beforeCursor?: string
}
