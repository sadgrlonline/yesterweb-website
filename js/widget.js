/* == Yesterweb Webring Widgets ==
 * Written by Lua MacDougall (https://foxgirl.dev/)
 * Updated 2022-01-14
 */

(function() {
    // https://github.com/luavixen/Patella v2.2.2
    var Patella = function(n) {
        function t(n, t) {
            return "__proto__" !== t && s.call(n, t)
        }

        function e(n, t, e) {
            y(n, t, {
                value: e,
                configurable: void 0 !== e,
                enumerable: !1,
                writable: !1
            })
        }

        function r(n) {
            return null !== n && "object" == typeof n && !p(n)
        }

        function o(n) {
            return "function" == typeof n
        }

        function u(n, t) {
            throw new(t ? d : v)(n)
        }

        function i() {
            for (var n = "Computed queue overflow! Last 10 functions in the queue:", t = j.length, e = t - 11; t > e; e++) n += "\n" + (e + 1) + ": " + (j[e].name || "anonymous");
            u(n, !0)
        }

        function f(n) {
            if (!t(n, b) && j.lastIndexOf(n) < x && (j.push(n), t(n, m) || e(n, m, []), !_)) {
                _ = !0;
                try {
                    for (; x < j.length; x++)(0, j[x])(), x > O && i()
                } finally {
                    _ = !1, j = [], x = 0
                }
            }
        }

        function c(n) {
            function t(n) {
                var t = e.lastIndexOf(n);
                0 > t || e.splice(t, 1)
            }
            r(n) && a(n);
            var e = [];
            return {
                get: function() {
                    var r = j[x];
                    return r && 0 > e.lastIndexOf(r) && (e.push(r), r[m].push(t)), n
                },
                set: function(t) {
                    r(t) && a(t), n = t;
                    for (var o = 0; o < e.length; o++) f(e[o])
                }
            }
        }

        function a(n) {
            if (!t(n, h))
                for (var r in e(n, h), n)
                    if (t(n, r)) try {
                        y(n, r, c(n[r]))
                    } catch (l) {}
        }
        var l = Object,
            s = l.hasOwnProperty,
            p = Array.isArray,
            d = Error,
            v = TypeError,
            y = l.defineProperty,
            h = (l = "function" == typeof Symbol ? Symbol : function(n) {
                return "__" + n
            })("observe"),
            b = l("dispose"),
            m = l("depends"),
            g = "Argument 'object' is not an object",
            w = "Argument 'func' is not a function",
            O = 2e3,
            _ = !1,
            j = [],
            x = 0;
        return n.computed = function(n) {
            return o(n) || u(w), f(n), n
        }, n.dispose = function(n, r) {
            var i, f;
            if (null == n ? (n = j[x]) || u("Tried to dispose of current computed function while not running a computed function", !0) : o(n) || u(w), !t(n, b)) {
                if (r || e(n, b), i = n[m])
                    for (e(n, m, r ? [] : void 0), f = 0; f < i.length; f++) i[f](n);
                _ && (f = j.lastIndexOf(n)) > x && j.splice(f, 1)
            }
            if (!_) return n
        }, n.ignore = function(n) {
            return r(n) || o(n) || u(g), t(n, h) || e(n, h), n
        }, n.observe = function(n) {
            return r(n) || o(n) || u(g), a(n), n
        }, n
    }({});

    var model = Patella.observe({
        state: 'loading',
        error: null,
        sites: null
    });

    try {
        var request = new XMLHttpRequest();
        request.onreadystatechange = function() {
            if (this.readyState !== this.DONE) return;
            if ((this.status / 100 | 0) !== 2) {
                model.error = new Error(this.status + ' ' + this.statusText);
                model.state = 'error';
                return;
            }
            try {
                model.sites = JSON.parse(this.responseText);
                model.state = 'ready';
            } catch (err) {
                model.error = err;
                model.state = 'error';
            }
        };
        request.open('GET', 'https://webring.yesterweb.org/webring.json');
        request.send(null);
    } catch (err) {
        model.error = err;
        model.state = 'error';
    }

    function normalizeURL(url) {
        url = (url + '').replace(/\/?$/, '/');
        try {
            var src = new URL(url);
            var dst = new URL('https://example.com/');
            dst.hostname = src.hostname;
            dst.pathname = src.pathname;
            return dst.toString();
        } catch (err) {
            return url;
        }
    }

    function findSiteIndex(url) {
        var sites = model.sites;
        var thisURL = normalizeURL(url);
        for (var i = 0; i < sites.length; i++) {
            var siteURL = normalizeURL(sites[i].url);
            if (thisURL.substring(0, siteURL.length) === siteURL) {
                return i;
            }
        }
        return -1;
    }

    function findSitesByWidget($target) {
        var thisHref = (
            $target.getAttribute('data-yw-url') ||
            $target.getAttribute('site') ||
            window.location.href
        );
        var thisIndex = findSiteIndex(thisHref);
        if (thisIndex < 0) {
            return null;
        }
        return {
            this: model.sites[thisIndex],
            next: model.sites[(thisIndex + 1) % model.sites.length],
            prev: model.sites[(thisIndex - 1 > 0 ? thisIndex : model.sites.length) - 1],
            rand: model.sites[Math.random() * model.sites.length | 0]
        };
    }

    function updateSiteLinks($content, sites) {
        $content.querySelector('.yw-link-next').href = sites.next.url;
        $content.querySelector('.yw-link-prev').href = sites.prev.url;
        $content.querySelector('.yw-link-rand').href = sites.rand.url;
    }

    function templWidgetFullError($content, message) {
        $content.innerHTML = '<p class="yw-error"></p>';
        $content.querySelector('.yw-error').innerText = 'Error: ' + message;
    }

    function templWidgetFull($target) {
        $target.innerHTML = (
            '<div class="yw-body">\n' +
            '  <h4 class="yw-title">Yesterweb Ring</h4>\n' +
            '  <div class="yw-content"></div>\n' +
            '</div>'
        );

        var $content = $target.querySelector('.yw-content');

        Patella.computed(function() {
            if (model.state === 'loading') {
                $content.innerHTML = '<div class="yw-spinner"></div>';
                return;
            }

            if (model.state === 'error') {
                templWidgetFullError($content, model.error.message);
                return;
            }

            if (model.state === 'ready') {
                var sites = findSitesByWidget($target);
                if (sites == null) {
                    templWidgetFullError($content, 'site not found in webring');
                    return;
                }

                $content.innerHTML = (
                    '<p class="yw-notice">\n' +
                    '  This site, <strong><a class="yw-site-name"></a></strong>, is keeping the old web alive.\n' +
                    '  Thanks, <strong class="yw-site-owner"></strong>!\n' +
                    '</p>\n' +
                    '<p class="yw-nav">\n' +
                    '  <a class="yw-link-next yw-link">[Next]</a>\n' +
                    '  <a class="yw-link-prev yw-link">[Prev]</a>\n' +
                    '  <a class="yw-link-rand yw-link">[Rand]</a>\n' +
                    '  <br>\n' +
                    '  <a class="yw-link-home yw-link" href="https://yesterweb.org/webring/members.html">[Members]</a>\n' +
                    '</p>'
                );

                updateSiteLinks($content, sites);

                var $siteName = $content.querySelector('.yw-site-name');
                $siteName.href = sites.this.url;
                $siteName.innerText = sites.this.name;

                var $siteOwner = $content.querySelector('.yw-site-owner');
                $siteOwner.innerText = sites.this.owner;
            }
        });
    }

    function templWidgetMini($target) {
        $target.innerHTML = (
            '<a class="yw-title" href="https://yesterweb.org/webring/members.html">The Yesterweb Ring</a>\n' +
            '<p class="yw-content"></p>'
        );

        var $content = $target.querySelector('.yw-content');

        Patella.computed(function() {
            if (model.state === 'loading') {
                $content.innerText = 'Loading...';
            }

            if (model.state === 'error') {
                $content.innerText = 'Error: ' + model.error.message;
            }

            if (model.state === 'ready') {
                var sites = findSitesByWidget($target);
                if (sites == null) {
                    $content.innerText = 'Error: site not found in webring';
                    return;
                }

                $content.innerHTML = (
                    '<a class="yw-link-next yw-link">Next</a>\n' +
                    '<a class="yw-link-prev yw-link">Prev</a>\n' +
                    '<a class="yw-link-rand yw-link">Rand</a>'
                );

                updateSiteLinks($content, sites);
            }
        });
    }

    function templWidgetText($target) {
        $target.innerHTML = (
            '<p class="yw-content">\n' +
            '  <a class="yw-link-rand yw-link" href="#">???</a>\n' +
            '  <span>//</span>\n' +
            '  <a class="yw-link-prev yw-link" href="#">&lt;&lt;</a>\n' +
            '  <a class="yw-link-home yw-link" href="https://yesterweb.org/webring/">Yesterweb</a>\n' +
            '  <a class="yw-link-next yw-link" href="#">&gt;&gt;</a>\n' +
            '  <span>//</span>\n' +
            '  <a class="yw-link-home yw-link" href="https://yesterweb.org/webring/members.html">..</a>\n' +
            '</p>'
        );

        Patella.computed(function() {
            if (model.state !== 'ready') return;

            var sites = findSitesByWidget($target);
            if (sites == null) return;

            updateSiteLinks($target, sites);
        });
    }

    var style = (
        '@font-face {\n' +
        '  font-family: "Yesterweb Monster";\n' +
        '  src: url("https://cloudflare-ipfs.com/ipfs/QmaKT1nHC9JM5xmz7cRuRcB8jrkRjxdPsLaLnyzEta3e8R/MonsterFriendFore.woff") format("woff");\n' +
        '}\n' +
        '\n' +
        '@font-face {\n' +
        '  font-family: "Yesterweb Nova Square";\n' +
        '  src: url("https://cloudflare-ipfs.com/ipfs/QmaKT1nHC9JM5xmz7cRuRcB8jrkRjxdPsLaLnyzEta3e8R/NovaSquare.woff") format("woff");\n' +
        '}\n' +
        '\n' +
        '.yw-widget-full:not(.yw-raw) {\n' +
        '  display: block;\n' +
        '  width: 190px;\n' +
        '  margin: 0;\n' +
        '  border: 3px double limegreen;\n' +
        '  padding: 16px;\n' +
        '  background-color: black;\n' +
        '  background-image: url("https://cloudflare-ipfs.com/ipfs/QmaKT1nHC9JM5xmz7cRuRcB8jrkRjxdPsLaLnyzEta3e8R/gridnew.gif");\n' +
        '  color: white;\n' +
        '  text-align: center;\n' +
        '  font-size: 12px;\n' +
        '  font-family: Arial, Helvetica, sans-serif;\n' +
        '}\n' +
        '\n' +
        '.yw-widget-full:not(.yw-raw) a {\n' +
        '  color: limegreen;\n' +
        '  text-decoration: none;\n' +
        '}\n' +
        '\n' +
        '.yw-widget-full:not(.yw-raw) .yw-content {\n' +
        '  width: 150px;\n' +
        '}\n' +
        '\n' +
        '.yw-widget-full:not(.yw-raw) .yw-title {\n' +
        '  margin: 0 -8px 0 -5px;\n' +
        '  font-family: "Yesterweb Monster", sans-serif;\n' +
        '  font-size: 15px;\n' +
        '  line-height: 20px;\n' +
        '  letter-spacing: 2px;\n' +
        '}\n' +
        '\n' +
        '.yw-widget-full:not(.yw-raw) .yw-nav,\n' +
        '.yw-widget-full:not(.yw-raw) .yw-error {\n' +
        '  margin-bottom: 0;\n' +
        '}\n' +
        '\n' +
        '.yw-widget-full:not(.yw-raw) .yw-spinner {\n' +
        '  height: 32px;\n' +
        '  margin-top: 16px;\n' +
        '  background-position: center;\n' +
        '  background-repeat: no-repeat;\n' +
        '  background-image: url("https://cloudflare-ipfs.com/ipfs/QmaKT1nHC9JM5xmz7cRuRcB8jrkRjxdPsLaLnyzEta3e8R/loading.gif");\n' +
        '}\n' +
        '\n' +
        '.yw-widget-mini:not(.yw-raw) {\n' +
        '  display: block;\n' +
        '  width: 160px;\n' +
        '  margin: 1em 0 1em 0;\n' +
        '  padding: 5px;\n' +
        '  background-color: #a9ff21;\n' +
        '  color: black;\n' +
        '  text-align: center;\n' +
        '  font-family: "Yesterweb Nova Square", sans-serif;\n' +
        '}\n' +
        '\n' +
        '.yw-widget-mini:not(.yw-raw) a {\n' +
        '  color: #0000ff;\n' +
        '  font-size: 14px;\n' +
        '}\n' +
        '\n' +
        '.yw-widget-mini:not(.yw-raw) .yw-title {\n' +
        '  color: black;\n' +
        '  text-decoration: none;\n' +
        '  font-size: 16px;\n' +
        '}\n' +
        '\n' +
        '.yw-widget-mini:not(.yw-raw) .yw-content {\n' +
        '  margin: 4px 0 4px 0;\n' +
        '}\n' +
        '\n' +
        '.yw-widget-text:not(.yw-raw) {\n' +
        '  font-family: sans-serif;\n' +
        '  font-weight: 700;\n' +
        '  font-size: 11px;\n' +
        '}\n' +
        '\n' +
        '.yw-widget-text:not(.yw-raw) a {\n' +
        '  color: limegreen;\n' +
        '  text-decoration: none;\n' +
        '}'
    );

    var $style = document.createElement('style');
    $style.appendChild(document.createTextNode(style));
    document.head.appendChild($style);

    function addClass($target, className) {
        if ($target.className.trim()) {
            $target.className += ' ' + className;
        } else {
            $target.className = className;
        }
    }

    function setupWidgets($list, template) {
        for (var i = 0; i < $list.length; i++) {
            var $target = $list[i];
            if ($target.getAttribute('data-yw-ready') != null) continue;
            $target.setAttribute('data-yw-ready', true);
            addClass($target, 'yw-widget');
            template($target);
        }
    }

    function templCustomWidget($target) {
        var type = window.yesterwebType;
        if (type === 'text') {
            addClass($target, 'yw-widget-text');
            templWidgetText($target);
        } else if (type === 'mini') {
            addClass($target, 'yw-widget-mini');
            templWidgetMini($target);
        } else {
            addClass($target, 'yw-widget-full');
            templWidgetFull($target);
        }
    }

    function scanWidgets() {
        setupWidgets(document.querySelectorAll('.yw-widget-full'), templWidgetFull);
        setupWidgets(document.querySelectorAll('.yw-widget-mini'), templWidgetMini);
        setupWidgets(document.querySelectorAll('.yw-widget-text'), templWidgetText);
        setupWidgets(document.querySelectorAll('webring-css'), templCustomWidget);
    }

    window.yesterwebScanWidgets = scanWidgets;

    scanWidgets();
    window.addEventListener('DOMContentLoaded', scanWidgets);
})();