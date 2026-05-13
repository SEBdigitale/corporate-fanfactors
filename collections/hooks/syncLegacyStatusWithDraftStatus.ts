import type { CollectionBeforeValidateHook } from 'payload'

type DraftStatus = 'draft' | 'published'

type DataWithStatus = {
  _status?: DraftStatus | null
  status?: DraftStatus | null
}

export const syncLegacyStatusWithDraftStatus: CollectionBeforeValidateHook = ({ data, req }) => {
  const draftData = data as DataWithStatus | undefined

  if (!draftData) {
    return data
  }

  const requestedStatus = getRequestedStatus(draftData, req.query?.draft)

  draftData._status = requestedStatus
  draftData.status = requestedStatus

  return draftData
}

function getRequestedStatus(data: DataWithStatus, draftQuery: unknown): DraftStatus {
  if (draftQuery === false || draftQuery === 'false') {
    return 'published'
  }

  if (draftQuery === true || draftQuery === 'true') {
    return 'draft'
  }

  if (isDraftStatus(data._status)) {
    return data._status
  }

  if (isDraftStatus(data.status)) {
    return data.status
  }

  return 'draft'
}

function isDraftStatus(status: unknown): status is DraftStatus {
  return status === 'draft' || status === 'published'
}
