# Replace the default href permalink with a copy-to-clipboard permalink

In the **Share** panel, the permalink link normally opens the map URL in a new
browser tab. This script overrides that behaviour: clicking the link copies the
permalink URL to the clipboard and shows a short "Lien copié" confirmation
tooltip instead.

## Behaviour

* Click on the permalink link (Share panel) -> the URL is copied, no new tab
* A small tooltip confirms the copy (or reports a failure)
* The URL is read from the `#input-share-permalink` field, falling back to the link `href`