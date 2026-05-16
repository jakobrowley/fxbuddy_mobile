/**
 * mixpanel.js
 * Lazily loads Mixpanel JS via the /mp/* reverse proxy (ad-blocker resistant).
 * Token is read from window.MIXPANEL_TOKEN (set inline by the HTML before this
 * script loads). If the token is empty/missing the entire module is a no-op so
 * the site never breaks before the token is provisioned.
 *
 * Exposes window.mp with:
 *   mp.track(event, props)
 *   mp.identify(userId)
 *   mp.alias(userId)
 *   mp.register(superProps)
 *   mp.peopleSet(profile)
 */
(function () {
    // Token set by deploy — leave empty string here.
    var token = (typeof window.MIXPANEL_TOKEN === 'string') ? window.MIXPANEL_TOKEN.trim() : '';

    // No-op stub — used when token is absent or Mixpanel fails to load.
    var noop = function () {};
    var stub = {
        track: noop,
        identify: noop,
        alias: noop,
        register: noop,
        peopleSet: noop
    };

    if (!token) {
        window.mp = stub;
        return;
    }

    // Queue for calls made before the lib finishes loading.
    var queue = [];
    var ready = false;

    function enqueue(method, args) {
        queue.push({ method: method, args: args });
    }

    function flush() {
        queue.forEach(function (item) {
            try {
                var lib = window.mixpanel;
                if (!lib) return;
                if (item.method === 'peopleSet') {
                    lib.people.set(item.args[0]);
                } else {
                    lib[item.method].apply(lib, item.args);
                }
            } catch (e) {}
        });
        queue = [];
    }

    // Public API — proxies to Mixpanel lib once loaded, or queues calls.
    window.mp = {
        track: function (event, props) {
            if (ready) {
                try { window.mixpanel.track(event, props); } catch (e) {}
            } else {
                enqueue('track', [event, props]);
            }
        },
        identify: function (userId) {
            if (ready) {
                try { window.mixpanel.identify(userId); } catch (e) {}
            } else {
                enqueue('identify', [userId]);
            }
        },
        alias: function (userId) {
            if (ready) {
                try { window.mixpanel.alias(userId); } catch (e) {}
            } else {
                enqueue('alias', [userId]);
            }
        },
        register: function (superProps) {
            if (ready) {
                try { window.mixpanel.register(superProps); } catch (e) {}
            } else {
                enqueue('register', [superProps]);
            }
        },
        peopleSet: function (profile) {
            if (ready) {
                try { window.mixpanel.people.set(profile); } catch (e) {}
            } else {
                enqueue('peopleSet', [profile]);
            }
        }
    };

    // Dynamically load Mixpanel lib via reverse proxy (bypasses ad blockers).
    var script = document.createElement('script');
    script.src = '/mp/lib.min.js';
    script.async = true;
    script.onload = function () {
        try {
            window.mixpanel.init(token, {
                api_host: 'https://m.fxbuddy.app/mp',
                persistence: 'localStorage',
                cross_subdomain_cookie: false
            });

            // Register attribution as super-properties so they ride every event.
            var attr = window.fxbAttribution || {};
            var superProps = {};
            if (attr.utm_source)   superProps.utm_source   = attr.utm_source;
            if (attr.utm_medium)   superProps.utm_medium   = attr.utm_medium;
            if (attr.utm_campaign) superProps.utm_campaign = attr.utm_campaign;
            if (attr.utm_content)  superProps.utm_content  = attr.utm_content;
            if (attr.utm_term)     superProps.utm_term     = attr.utm_term;
            if (attr.fbclid)       superProps.fbclid       = attr.fbclid;
            if (attr.gclid)        superProps.gclid        = attr.gclid;
            if (attr.referrer)     superProps.referrer     = attr.referrer;
            if (Object.keys(superProps).length) {
                window.mixpanel.register(superProps);
            }

            ready = true;
            flush();

            // Auto-fire $page_view with attribution + landing context.
            var pageProps = {
                page_path: window.location.pathname,
                page_url: window.location.href,
                referrer: attr.referrer || document.referrer || '',
                landing_page: attr.landing_page || window.location.pathname
            };
            if (attr.utm_source)   pageProps.utm_source   = attr.utm_source;
            if (attr.utm_medium)   pageProps.utm_medium   = attr.utm_medium;
            if (attr.utm_campaign) pageProps.utm_campaign = attr.utm_campaign;
            if (attr.utm_content)  pageProps.utm_content  = attr.utm_content;
            if (attr.utm_term)     pageProps.utm_term     = attr.utm_term;
            if (attr.fbclid)       pageProps.fbclid       = attr.fbclid;
            if (attr.gclid)        pageProps.gclid        = attr.gclid;
            window.mixpanel.track('$page_view', pageProps);
        } catch (e) {
            // Silently degrade — never crash the page.
            window.mp = stub;
        }
    };
    script.onerror = function () {
        window.mp = stub;
    };
    document.head.appendChild(script);
}());
