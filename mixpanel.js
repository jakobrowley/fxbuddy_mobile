/**
 * mixpanel.js — official Mixpanel queueing snippet wrapped to:
 *  1. No-op if window.MIXPANEL_TOKEN is empty (safe for local dev)
 *  2. Load the lib via /mp/* reverse proxy (ad-blocker resistant)
 *  3. Init with persistence: localStorage + api_host = same-origin proxy
 *  4. Auto-fire $page_view with UTM/fbclid/gclid super-props from window.fxbAttribution
 *  5. Expose window.mp helpers (track / identify / alias / register / peopleSet)
 *     for backward compat with existing auth.js call sites
 */
(function () {
    var token = (typeof window.MIXPANEL_TOKEN === 'string') ? window.MIXPANEL_TOKEN.trim() : '';

    // No-op stub for when token is unset (dev) or lib loading fails.
    var noop = function () {};
    var stub = { track: noop, identify: noop, alias: noop, register: noop, peopleSet: noop };

    if (!token) {
        window.mp = stub;
        return;
    }

    // Force the lib loader to use our reverse-proxied URL.
    window.MIXPANEL_CUSTOM_LIB_URL = '/mp/lib.min.js';

    // Official Mixpanel snippet — creates window.mixpanel queueing stub + injects script.
    // From https://docs.mixpanel.com/docs/quickstart/install-mixpanel — DO NOT modify.
    (function(f,b){if(!b.__SV){var e,g,i,h;window.mixpanel=b;b._i=[];b.init=function(e,f,c){function g(a,d){var b=d.split(".");2==b.length&&(a=a[b[0]],d=b[1]);a[d]=function(){a.push([d].concat(Array.prototype.slice.call(arguments,0)))}}var a=b;"undefined"!==typeof c?a=b[c]=[]:c="mixpanel";a.people=a.people||[];a.toString=function(a){var d="mixpanel";"mixpanel"!==c&&(d+="."+c);a||(d+=" (stub)");return d};a.people.toString=function(){return a.toString(1)+".people (stub)"};i="disable time_event track track_pageview track_links track_forms track_with_groups add_group set_group remove_group register register_once alias unregister identify name_tag set_config reset opt_in_tracking opt_out_tracking has_opted_in_tracking has_opted_out_tracking clear_opt_in_out_tracking start_batch_senders people.set people.set_once people.unset people.increment people.append people.union people.track_charge people.clear_charges people.delete_user people.remove".split(" ");for(h=0;h<i.length;h++)g(a,i[h]);var j="set set_once union unset remove delete".split(" ");a.get_group=function(){function b(c){d[c]=function(){call2_args=arguments;call2=[c].concat(Array.prototype.slice.call(call2_args,0));a.push([e,call2])}}for(var d={},e=["get_group"].concat(Array.prototype.slice.call(arguments,0)),c=0;c<j.length;c++)b(j[c]);return d};b._i.push([e,f,c])};b.__SV=1.2;e=f.createElement("script");e.type="text/javascript";e.async=!0;e.src="undefined"!==typeof MIXPANEL_CUSTOM_LIB_URL?MIXPANEL_CUSTOM_LIB_URL:"file:"===f.location.protocol&&"//cdn.mxpnl.com/libs/mixpanel-2-latest.min.js".match(/^\/\//)?"https://cdn.mxpnl.com/libs/mixpanel-2-latest.min.js":"//cdn.mxpnl.com/libs/mixpanel-2-latest.min.js";g=f.getElementsByTagName("script")[0];g.parentNode.insertBefore(e,g)}})(document,window.mixpanel||[]);

    // Initialize with our config.
    window.mixpanel.init(token, {
        api_host: 'https://m.fxbuddy.app/mp',
        persistence: 'localStorage',
        cross_subdomain_cookie: false,
        ignore_dnt: false,
        track_pageview: false  // we fire manually below with attribution super-props
    });

    // Register UTM/click-ID super-props (every event auto-includes these going forward).
    var attr = window.fxbAttribution || {};
    var superProps = {};
    ['utm_source','utm_medium','utm_campaign','utm_content','utm_term','fbclid','gclid','referrer','landing_page'].forEach(function (k) {
        if (attr[k]) superProps[k] = attr[k];
    });
    if (Object.keys(superProps).length) {
        window.mixpanel.register(superProps);
    }

    // Manual $page_view with attribution + page context (auto-fired once per page load).
    window.mixpanel.track('$mp_web_page_view', {
        page_path: window.location.pathname,
        page_url: window.location.href,
        page_title: document.title
    });

    // Public API for auth.js (existing call sites — preserve exact method signatures).
    window.mp = {
        track: function (event, props) { try { window.mixpanel.track(event, props); } catch (e) {} },
        identify: function (userId) { try { window.mixpanel.identify(userId); } catch (e) {} },
        alias: function (userId) { try { window.mixpanel.alias(userId); } catch (e) {} },
        register: function (superProps) { try { window.mixpanel.register(superProps); } catch (e) {} },
        peopleSet: function (profile) { try { window.mixpanel.people.set(profile); } catch (e) {} }
    };
})();
