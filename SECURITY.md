# ArmX - Security

## Trust boundary

ArmX has no authentication and no server data path in the MVP. The primary sensitive asset is the user's local training history. IndexedDB is not encrypted, so device-level access remains the relevant threat.

## Controls

- No secrets, credentials, or third-party analytics are bundled.
- Import data is validated by shape and type before it reaches IndexedDB.
- Content is rendered as React text; imported values are never inserted as HTML.
- Security headers reject MIME confusion, framing, unnecessary permissions, and unsafe opener relationships.
- Dependencies are kept intentionally small and should be audited with `npm audit` before release.

## Known limitations

Local data is not encrypted. A future encrypted export or Web Crypto-backed store should be designed separately because key recovery is a product decision, not a drop-in toggle. CSP can be tightened further when the production hosting policy and font strategy are fixed.
