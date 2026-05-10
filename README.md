# FanFactors Website v3 — We're taking music back.

This package updates the prior FanFactors site around the actual platform story:

- Legal music listening
- Direct copyright-owner payment logic
- Artist-set pricing and rights control
- Fans becoming music business owners through artist-approved selling
- FanScore, quests, invites and social proof
- Blog and static Admin Studio prototype
- The mission to make one billion millionaires through music-powered ownership

## Create Account button

The header now has a right-side **Create Account** button.

Current staging URL:
https://staging.fanfactors.com

Production URL stored on CTA elements as `data-production-url`:
https://www.fanfactors.com

For launch, switch the href values from staging to the live registration URL.

## Admin area note

The Admin Area is a polished static prototype. It demonstrates blog/page/campaign/KPI management but does not include real authentication or backend persistence. The dashboard draft form uses local browser storage only.

## Preview locally

```bash
cd fanfactors-music-back-v3
python -m http.server 8000
```

Then open `http://localhost:8000`.
