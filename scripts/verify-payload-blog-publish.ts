import config from '@payload-config'
import { getPayload, type RequiredDataFromCollectionSlug } from 'payload'

const collection = 'blog-posts'
const slug = `payload-publish-smoke-${Date.now()}`

type BlogPostData = RequiredDataFromCollectionSlug<typeof collection>

async function verifyPayloadBlogPublish() {
  const payload = await getPayload({ config })

  try {
    await deleteExistingBySlug(payload, slug)

    const created = await payload.create({
      collection,
      data: buildPostData('created', 'published'),
      draft: false,
      overrideAccess: true,
    })

    const draft = await payload.update({
      id: created.id,
      collection,
      data: buildPostData('draft update', 'draft'),
      draft: true,
      overrideAccess: true,
    })

    if (draft._status !== 'draft') {
      throw new Error(`Expected draft update status to be draft, received ${draft._status}`)
    }

    const published = await payload.update({
      id: created.id,
      collection,
      data: buildPostData('published update', 'published'),
      draft: false,
      overrideAccess: true,
    })

    if (published._status !== 'published') {
      throw new Error(`Expected published status, received ${published._status}`)
    }

    const visible = await payload.find({
      collection,
      limit: 1,
      overrideAccess: true,
      where: {
        and: [
          {
            slug: {
              equals: slug,
            },
          },
          {
            _status: {
              equals: 'published',
            },
          },
        ],
      },
    })

    if (visible.totalDocs !== 1) {
      throw new Error(`Expected one published smoke post, found ${visible.totalDocs}`)
    }

    payload.logger.info(`Payload blog publish smoke test passed: ${slug}`)
  } finally {
    await deleteExistingBySlug(payload, slug)
  }
}

async function deleteExistingBySlug(payload: Awaited<ReturnType<typeof getPayload>>, postSlug: string) {
  const existing = await payload.find({
    collection,
    limit: 10,
    overrideAccess: true,
    where: {
      slug: {
        equals: postSlug,
      },
    },
  })

  for (const doc of existing.docs) {
    await payload.delete({
      id: doc.id,
      collection,
      overrideAccess: true,
    })
  }
}

function buildPostData(label: string, status: NonNullable<BlogPostData['_status']>): BlogPostData {
  const title = `Payload Publish Smoke ${label}`

  return {
    title,
    slug,
    _status: status,
    status,
    publishedAt: new Date().toISOString(),
    excerpt: `Smoke test post used to verify Payload can save drafts and publish changes for the corporate blog.`,
    body: toLexicalRichText(`This temporary post verifies the Payload blog publish flow for ${label}.`),
    category: 'QA',
    tags: [
      {
        tag: 'payload',
      },
      {
        tag: 'publishing',
      },
    ],
    seo: {
      title,
      description: 'Temporary smoke test content for verifying Payload blog publishing.',
      aiSummary: 'Temporary smoke test content for verifying Payload blog publishing.',
    },
  }
}

function toLexicalRichText(text: string): BlogPostData['body'] {
  return {
    root: {
      type: 'root',
      children: [
        {
          type: 'paragraph',
          children: [
            {
              detail: 0,
              format: 0,
              mode: 'normal',
              style: '',
              text,
              type: 'text',
              version: 1,
            },
          ],
          direction: 'ltr',
          format: '',
          indent: 0,
          version: 1,
        },
      ],
      direction: 'ltr',
      format: '',
      indent: 0,
      version: 1,
    },
  }
}

await verifyPayloadBlogPublish()
