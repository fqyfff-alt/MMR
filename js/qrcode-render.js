/* Renders a QR code (linking to sources.pdf) into any [data-qr-target] element.
   Uses the vendored qrcode-generator library (js/qrcode.lib.js, MIT, Kazuhiko Arase). */
(function () {
  "use strict";

  function renderQR(container) {
    if (typeof window.qrcode !== "function") return;

    var url = window.location.href.replace(/[^/]*$/, "sources.pdf");

    var qr = window.qrcode(0, "M");
    qr.addData(url);
    qr.make();

    var count = qr.getModuleCount();
    var size = parseInt(container.getAttribute("data-qr-size") || "120", 10);
    var moduleColor = container.getAttribute("data-qr-color") || "#2E2420";
    var bgColor = container.getAttribute("data-qr-bg") || "#FFFCF6";
    var margin = 2;
    var totalModules = count + margin * 2;
    var moduleSize = size / totalModules;

    var svgNS = "http://www.w3.org/2000/svg";
    var svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("viewBox", "0 0 " + size + " " + size);
    svg.setAttribute("width", size);
    svg.setAttribute("height", size);
    svg.setAttribute("role", "img");
    svg.setAttribute("aria-label", "QR code linking to the sources document (sources.pdf)");

    var bg = document.createElementNS(svgNS, "rect");
    bg.setAttribute("width", String(size));
    bg.setAttribute("height", String(size));
    bg.setAttribute("rx", String(size * 0.07));
    bg.setAttribute("fill", bgColor);
    svg.appendChild(bg);

    var d = "";
    for (var r = 0; r < count; r++) {
      for (var c = 0; c < count; c++) {
        if (qr.isDark(r, c)) {
          var x = (c + margin) * moduleSize;
          var y = (r + margin) * moduleSize;
          d += "M" + x.toFixed(2) + "," + y.toFixed(2) +
               "h" + moduleSize.toFixed(2) +
               "v" + moduleSize.toFixed(2) +
               "h-" + moduleSize.toFixed(2) + "z";
        }
      }
    }
    var path = document.createElementNS(svgNS, "path");
    path.setAttribute("d", d);
    path.setAttribute("fill", moduleColor);
    svg.appendChild(path);

    container.innerHTML = "";
    container.appendChild(svg);
    container.classList.add("qr-ready");
  }

  function init() {
    var targets = document.querySelectorAll("[data-qr-target]");
    targets.forEach(function (el) { renderQR(el); });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
