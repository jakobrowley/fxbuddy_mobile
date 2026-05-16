/**
 * utm-capture.js
 * Runs synchronously near the top of <head> BEFORE mixpanel.js.
 * Captures UTM params, click IDs, and referrer on landing, persists
 * to localStorage with a 30-day TTL, and exposes window.fxbAttribution.
 */
(function () {
    var STORAGE_KEY = 'fxb_attribution';
    var TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

    var UTM_KEYS = [
        'utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term',
        'fbclid', 'gclid', 'gbraid', 'wbraid', 'msclkid'
    ];

    function parseParams() {
        try {
            var params = {};
            var search = window.location.search;
            if (!search) return null;
            var sp = new URLSearchParams(search);
            var found = false;
            UTM_KEYS.forEach(function (k) {
                var v = sp.get(k);
                if (v) { params[k] = v; found = true; }
            });
            return found ? params : null;
        } catch (e) {
            return null;
        }
    }

    function readStored() {
        try {
            var raw = localStorage.getItem(STORAGE_KEY);
            if (!raw) return null;
            var obj = JSON.parse(raw);
            if (!obj || !obj.captured_at) return null;
            if (Date.now() - obj.captured_at > TTL_MS) {
                localStorage.removeItem(STORAGE_KEY);
                return null;
            }
            return obj;
        } catch (e) {
            return null;
        }
    }

    function writeStored(data) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        } catch (e) {}
    }

    var fresh = parseParams();
    var attribution;

    if (fresh) {
        // New UTM/click-id params found — overwrite whatever was stored
        attribution = Object.assign({}, fresh, {
            captured_at: Date.now(),
            referrer: document.referrer || '',
            landing_page: window.location.pathname
        });
        writeStored(attribution);
    } else {
        // No fresh params — read existing stored entry if within TTL
        var stored = readStored();
        if (stored) {
            attribution = stored;
        } else {
            // No UTM params, no stored entry — capture referrer + landing page only
            attribution = {
                captured_at: Date.now(),
                referrer: document.referrer || '',
                landing_page: window.location.pathname
            };
        }
    }

    // Expose globally for other scripts to read
    window.fxbAttribution = attribution;

    /**
     * Returns an attribution object suitable for inclusion in the signup POST body.
     * Keys map to the fields the backend stores in users table.
     */
    window.fxbGetAttributionForSignup = function () {
        var attr = window.fxbAttribution || {};
        var result = {};
        if (attr.utm_source)   result.utm_source   = attr.utm_source;
        if (attr.utm_medium)   result.utm_medium   = attr.utm_medium;
        if (attr.utm_campaign) result.utm_campaign = attr.utm_campaign;
        if (attr.utm_content)  result.utm_content  = attr.utm_content;
        if (attr.utm_term)     result.utm_term     = attr.utm_term;
        if (attr.fbclid)       result.fbclid       = attr.fbclid;
        if (attr.gclid)        result.gclid        = attr.gclid;
        if (attr.gbraid)       result.gbraid       = attr.gbraid;
        if (attr.wbraid)       result.wbraid       = attr.wbraid;
        if (attr.msclkid)      result.msclkid      = attr.msclkid;
        if (attr.referrer)     result.referrer     = attr.referrer;
        if (attr.landing_page) result.signup_landing_page = attr.landing_page;
        return result;
    };
}());
