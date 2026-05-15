export function getPublishedContentWhere() {
  return {
    _status: {
      equals: 'published',
    },
  }
}

export function getPublishedStatusWhere() {
  return {
    status: {
      equals: 'published',
    },
  }
}
