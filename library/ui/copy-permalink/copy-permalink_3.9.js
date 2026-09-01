/**
 * @license Mozilla Public License Version 2.0
 * This script has been developed by the "community"
 * There isn't any guarantee that this script will work on another version of Lizmap Web Client.
 */

lizMap.events.on({
	'uicreated': function(e) {
		const HIDE_DELAY = 1000;

		const link = document.querySelector("#permalink");
		if (!link) {
			console.warn("copy-permalink : #permalink introuvable");
			return;
		}

		const tooltip = document.createElement("div");
		tooltip.style.cssText = [
			"position:absolute",
			"z-index:2000",
			"padding:4px 8px",
			"border-radius:3px",
			"background:#000",
			"color:#fff",
			"font-size:12px",
			"line-height:1.4",
			"white-space:nowrap",
			"pointer-events:none",
			"opacity:0",
			"transition:opacity .15s ease"
		].join(";");
		document.body.appendChild(tooltip);

		function copyToClipboard(text) {
			//Modern API
			if (navigator.clipboard && window.isSecureContext) {
				return navigator.clipboard.writeText(text);
			}
			//Legacy API
			return new Promise(function (resolve, reject) {
				const input = document.getElementById("input-share-permalink");
				if (!input) {
					reject(new Error("champ input-share-permalink introuvable"));
					return;
				}
				input.select();
				document.execCommand("copy")
				? resolve()
				: reject(new Error("execCommand('copy') a renvoyé false"));
			});
		}

		function feedback(message) {
			tooltip.textContent = message;
			tooltip.style.opacity = "1";

			const r = link.getBoundingClientRect();
			tooltip.style.left = ( window.scrollX + r.left + r.width / 2 - tooltip.offsetWidth / 2) + "px";
			tooltip.style.top  = ( window.scrollY + r.top - tooltip.offsetHeight - 6) + "px";

			setTimeout(function () { tooltip.style.opacity = "0"; }, HIDE_DELAY);
		}
	
		link.addEventListener("click", function (event) {
			event.preventDefault();

			const input = document.getElementById("input-share-permalink");
			const url = (input && input.value) ? input.value : link.href;

			copyToClipboard(url)
			.then(function () {
				feedback("Lien copié");
			})
			.catch(function (err) {
				console.warn("copy-permalink :", err);
				feedback("Échec de la copie");
			});
		}, false);
	}
});