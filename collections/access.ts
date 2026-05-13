import type { Access } from 'payload'

import { getPublishedContentWhere } from '../lib/payload-publishing'

export const anyone: Access = () => true

export const authenticated: Access = ({ req }) => Boolean(req.user)

export const publishedOnly: Access = ({ req }) => {
  if (req.user) {
    return true
  }

  return getPublishedContentWhere()
}
