export function getPublishedContentWhere() {
  return {
    _status: {
      equals: 'published',
    },
  }
}
