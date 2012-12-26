function mmg_interaction(mmg) {

    var mi = {},
        tooltips = [],
        exclusive = true,
        hide_on_move = true,
        show_on_hover = true,
        close_timer = null,
        formatter;

    mi.formatter = function(x) {
        if (!arguments.length) return formatter;
        formatter = x;
        return mi;
    };
    mi.formatter(function(feature) {
        var o = '',
            props = feature.properties;
        if (props.title) {
          o += '<strong>' + props.title + '</strong><br />';
        }
        if (props.description) {
          o += props.description;
        }
        return o;
    });

    mi.hide_on_move = function(x) {
        if (!arguments.length) return hide_on_move;
        hide_on_move = x;
        return mi;
    };

    mi.exclusive = function(x) {
        if (!arguments.length) return exclusive;
        exclusive = x;
        return mi;
    };

    mi.show_on_hover = function(x) {
        if (!arguments.length) return show_on_hover;
        show_on_hover = x;
        return mi;
    };

    mi.hide_tooltips = function() {
        while (tooltips.length) mmg.remove(tooltips.pop());
        for (var i = 0; i < markers.length; i++) {
            delete markers[i].clicked;
        }
    };

    mi.bind_marker = function(marker) {
        var delayed_close = function() {
            if (!marker.clicked) close_timer = window.setTimeout(function() {
                mi.hide_tooltips();
            }, 200);
        };

        var show = function(e) {
            if (exclusive && tooltips.length > 0) {
                mi.hide_tooltips();
            }

            var tooltip = document.createElement('div');
            tooltip.className = 'wax-movetip';

            var intip = tooltip.appendChild(document.createElement('div'));
            intip.className = 'wax-intip';
            var content = formatter(marker.data);
            if (typeof content == 'string') {
                intip.innerHTML = content;
            } else {
                intip.appendChild(content);
            }

            // Here we're adding the tooltip to the dom briefly
            // to gauge its size. There should be a better way to do this.
            document.body.appendChild(tooltip);
            intip.style.marginTop = -(
                (marker.element.offsetHeight * 0.5) +
                tooltip.offsetHeight + 10) + 'px';
            document.body.removeChild(tooltip);

            if (show_on_hover) {
                tooltip.onmouseover = function() {
                    if (close_timer) window.clearTimeout(close_timer);
                };
                tooltip.onmouseout = delayed_close;
            }

            var t = {
                element: tooltip,
                data: {},
                location: marker.location.copy()
            };
            tooltips.push(t);
            mmg.add(t);
            mmg.draw();
        };

        marker.element.onclick = function() {
            show();
            marker.clicked = true;
        };

        if (show_on_hover) {
            marker.element.onmouseover = show;
            marker.element.onmouseout = delayed_close;
        }
    };

    if (mmg && mmg.map) {
        mmg.map.addCallback('panned', function() {
            if (hide_on_move) {
                while (tooltips.length) {
                    mmg.remove(tooltips.pop());
                }
            }
        });
        var markers = mmg.markers();
        for (var i = 0; i < markers.length; i++) {
            mi.bind_marker(markers[i]);
        }
    } else {
        if (console) console.log('mmg must be added to a map before interaction is assigned');
    }

    return mi;
}
