# Security

## Reporting a vulnerability

Please report suspected vulnerabilities privately by opening a
[GitHub security advisory](https://github.com/EmeraldZhu/4J-tms/security/advisories/new)
rather than a public issue.

## Security model

4J-TMS is a client-only application: the browser talks straight to Firebase with
the signed-in user's own credentials. There is no server tier to enforce
permissions, which has one important consequence:

> **The Firestore and Storage rules are the only real access control.**
> Route guards and query filters in the Vue app are conveniences. Anyone can open
> a console and issue their own SDK calls, so nothing may depend on the UI having
> asked the right question.

Access control lives in:

| File | Enforces |
| --- | --- |
| `firestore.rules` | Per-document read/write authorisation for all collections |
| `storage.rules` | Per-path upload/download authorisation, namespaced by uid |
| `firebase.json` → `hosting.headers` | CSP and transport/browser hardening headers |
| `src/router/index.js` | Client-side route guards (usability layer only) |

### Data model and ownership

| Collection | Ownership key |
| --- | --- |
| `landlords/{uid}` | Document id **is** the landlord's auth uid |
| `tenantProfiles/{uid}` | Document id **is** the tenant's auth uid; maps uid → `landlordId` |
| `properties/{id}` | `createdBy` = landlord uid |
| `units/{id}` | `createdBy` = landlord uid |
| `tenants/{id}` | `createdBy` = landlord uid; `authUid` = tenant uid once invited |
| `maintenance/{id}` | `landlordId` = landlord uid; `createdBy.uid` = tenant uid |
| `noticeboard/{id}` | `landlordId` = landlord uid |

`tenantProfiles` exists because tenant documents use random ids, so the rules
cannot look up "which landlord does this tenant belong to" from the tenant's uid
alone. Only a landlord may write an entry — if tenants could write their own,
anyone could claim membership of any landlord and read that landlord's notices.

### Query rule: filters must prove authorisation

Firestore rejects a query unless its filters guarantee every possible result is
readable. A query like `where('propertyName.value', '==', id)` on `units` does
not prove ownership and will be **denied**, even for the rightful owner. Owner-
scoped reads must therefore include the ownership filter explicitly:

```js
query(collection(db, 'units'),
      where('createdBy', '==', user.uid),
      where('propertyName.value', '==', propertyId))
```

Keep this in mind when adding queries — a missing ownership filter shows up as a
permission error, not as a silent leak.

## Deploying rule changes

Existing data predates the ownership fields the rules depend on, so **run the
migration before deploying the rules**, otherwise live tenants lose access to
notices and existing tickets vanish from the landlord dashboard.

```bash
npm install --no-save firebase-admin
export GOOGLE_APPLICATION_CREDENTIALS=/absolute/path/to/serviceAccount.json
node scripts/migrate-security.mjs --dry-run
```

Review the output, then apply and deploy:

```bash
node scripts/migrate-security.mjs
firebase deploy --only firestore:rules,storage:rules
```

Storage CORS is configured separately:

```bash
gsutil cors set cors.json gs://four-j-tms.appspot.com
```

## Still outstanding

These need work beyond the application code and are worth tracking:

- **Tenant provisioning should move to a Cloud Function.** Accounts are still
  created in the browser (`src/services/tenant-provisioning.js`). It uses a
  secondary Firebase app so the landlord's session survives, but the browser
  still briefly holds credentials for an account it does not own. The Admin SDK
  in a Cloud Function is the correct home for this.
- **Roles should become custom claims.** Role is currently derived from the
  presence of a Firestore document, costing an extra read per rule evaluation.
  Setting `role` and `landlordId` as custom claims from a Cloud Function would
  put them in the token and simplify the rules considerably.
- **Enable App Check** to stop the project's API being driven by anything other
  than the real app.
- **Restrict the browser API key** to this project's domains in
  Google Cloud Console → APIs & Services → Credentials. (The key in
  `firebase-config.js` is public by design — it identifies the project and
  authorises nothing — but referrer restrictions limit abuse of the quota.)
- **Add rules tests.** `@firebase/rules-unit-testing` against the emulator would
  let the ownership boundaries above be asserted in CI rather than by review.
