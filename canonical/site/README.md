# Teknikel — canonical 0.7.6 site presentation

Repository root `index.php` is the hosting adapter for `canonical/public/index.php`.
Document root is the repository root. `canonical/` remains HTTP-private; PHP includes
it locally. Existing business route wrappers enter common `core/legacy.php`, which
redirects to the canonical query page and evaluates publication gates there.

Site-owned: `site/config.php`, `site/views/**`, `locales/tr.json`, and
`public/assets/site/**`. Common files are installed only by the explicit updater:

```sh
node scripts/update-canonical.mjs --check /home/raistlin/YardimciWorkspace/YardimciAsistan/web-site-template
node scripts/update-canonical.mjs --apply /home/raistlin/YardimciWorkspace/YardimciAsistan/web-site-template
node scripts/sync-public-assets.mjs --apply
node scripts/sync-public-assets.mjs --check
```

Run these from the repository root. Neither builds nor verification repair assets.
The updater checks the unmodified upstream three-way planner, stages all changes,
preserves site-owned bytes, validates the manifest and swaps directories with
rollback. Previous installations remain in ignored `.test-artifacts/canonical-updates`.
The asset installer stages and renames the three explicit public namespaces with
rollback; a multi-directory crash-atomic exchange is not claimed.

`YA_SITE_API_ORIGIN` selects a separate public API fixture for host tests and disables
the production same-host CLI transport. Without that override, the existing explicit
hosting public-GET transport remains configured. Browser mutations/media still use
same-origin `/yardimci-asistan`; no backend source is packaged or changed.

`/demo-icerik/` redirects to the site-owned `demo-content` editorial extension. Its
existing ZIP and all original source photos remain intact. Its text and the previous
site phrase catalog are preserved in the single Turkish canonical catalog, ID
`teknikel-site`; only Desktop publication supplies target languages.

Product detail adds a presentation-only canonical `request.general` trigger for an
already published public product ID. The common widget owns validation, transport,
idempotency and dates (none for general_info), independently of AI. Private product
request hooks and the old advanced overlay/pinch/filter comparison have not been
ported. Site-owned catalog detail, gallery and comparison use the authorized products
from the common headless controller.

`site/views/pages/catalog.php` owns the complete catalog HTML. `public/assets/site/catalog.js`
owns category/brand widgets, filtering, pagination, comparison, detail, cart thumbnails
and form presentation. `site/views/pages/home.php` owns only the homepage placement
and compact cart summary; `public/assets/site/home-catalog.js` subscribes to the
same headless commerce state for that page. `public/assets/site/product-card.js`
is the sole product card builder for both pages (gallery, favorite, compare and add
controls). The obsolete homepage PHP product-card component has been removed.
`catalog.css` and `theme.css` own site-only structure and responsive layout.
The common layout and canonical template are unchanged: site-owned page views load
their scripts, and `core/commerce.js` alone owns catalog/session/cart validation,
current price snapshots, order payloads, uncertain retry/idempotency and receipt
recovery. Home comparison selection is transferred to the existing catalog comparison
panel via an ephemeral URL fragment, never a second comparison implementation.
There is no site-specific order transport or database/schema/publication change.

See the root README and milestone handoff for exact local/host acceptance commands.
Not live-ready: browser, real backend callback/session/receipt and HTTPS checks remain.
