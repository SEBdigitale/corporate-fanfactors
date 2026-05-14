'use client'

import { useEffect } from 'react'
import { useField } from '@payloadcms/ui'

import { BLOG_CLUSTER_FALLBACK_SLUG, blogClusterOptions, normalizeBlogClusterSlug } from '@/lib/blog-clusters'

type BlogClusterFieldProps = {
  field?: {
    admin?: {
      description?: string
    }
    label?: string
    required?: boolean
  }
  path: string
  readOnly?: boolean
}

export function BlogClusterField({ field, path: pathFromProps, readOnly }: BlogClusterFieldProps) {
  const { disabled, errorMessage, path, setValue, showError, value } = useField<string>({
    potentiallyStalePath: pathFromProps,
  })
  const selectedValue = normalizeBlogClusterSlug(value || BLOG_CLUSTER_FALLBACK_SLUG)
  const inputId = `field-${path.replace(/\./g, '__')}`
  const isReadOnly = readOnly || disabled

  useEffect(() => {
    if (value !== selectedValue) {
      setValue(selectedValue)
    }
  }, [selectedValue, setValue, value])

  return (
    <div className={`field-type text${showError ? ' error' : ''}`}>
      <label className="field-label" htmlFor={inputId}>
        {field?.label ?? 'Blog Cluster'}
        {field?.required ? <span className="required">*</span> : null}
      </label>
      <select
        aria-invalid={showError}
        disabled={isReadOnly}
        id={inputId}
        name={path}
        onChange={(event) => setValue(event.target.value)}
        required={field?.required}
        style={{
          background: 'var(--theme-elevation-50)',
          border: '1px solid var(--theme-elevation-150)',
          borderRadius: 4,
          color: 'var(--theme-text)',
          font: 'inherit',
          minHeight: 40,
          padding: '0 12px',
          width: '100%',
        }}
        value={selectedValue}
      >
        {blogClusterOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {field?.admin?.description ? <p className="field-description">{field.admin.description}</p> : null}
      {showError && errorMessage ? <p className="field-error">{errorMessage}</p> : null}
    </div>
  )
}
