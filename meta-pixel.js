/* Meta Pixel base — fires PageView automatically.
   Exposed: window.fbqTrack(name, params) for downstream callers. */
(function () {
    if (window.fbq) return;
    !function (f, b, e, v, n, t, s) {
        if (f.fbq) return; n = f.fbq = function () {
            n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
        };
        if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = '2.0';
        n.queue = []; t = b.createElement(e); t.async = !0; t.src = v;
        s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s);
    }(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');

    fbq('init', '902711134222556');
    fbq('track', 'PageView');

    window.fbqTrack = function (name, params) {
        try { if (window.fbq) window.fbq('track', name, params || {}); } catch (_) { /* ignore */ }
    };
})();
