export function getPublishedContentWhere() {
  return {
    or: [fieldEqualsPublished('status'), fieldEqualsPublished('_status')],
  }
}

function fieldEqualsPublished(fieldName: string) {
  return {
    [fieldName]: {
      equals: 'published',
    },
  }
}
