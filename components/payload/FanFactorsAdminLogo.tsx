'use client'

export function FanFactorsAdminLogo() {
  return (
    <div
      aria-label="FanFactors Admin"
      style={{
        alignItems: 'center',
        display: 'grid',
        gap: 12,
        justifyItems: 'center',
      }}
    >
      <img
        alt=""
        src="/assets/images/brand/fanfactors-login-mark.png"
        style={{
          display: 'block',
          height: 'auto',
          width: 84,
        }}
      />
      <span
        style={{
          color: '#f6f8f2',
          fontSize: 22,
          fontWeight: 950,
          lineHeight: 1,
        }}
      >
        FanFactors
      </span>
    </div>
  )
}
