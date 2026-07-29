/* Regulating an Unstable Mountain — shared site behaviour */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Mobile nav ---------- */
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.querySelector(".main-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    nav.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        nav.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---------- Active nav link ---------- */
  var current = (window.location.pathname.split("/").pop() || "index.html");
  document.querySelectorAll(".main-nav a[href]").forEach(function (a) {
    var href = a.getAttribute("href");
    if (href === current || (current === "" && href === "index.html")) {
      a.classList.add("active");
    }
  });

  /* ---------- Reveal on scroll ---------- */
  var revealTargets = document.querySelectorAll(
    ".reveal, .step-item, .people-row, .bar-col"
  );

  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealTargets.forEach(function (el) { el.classList.add("is-visible"); });
    startCounters();
  } else {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.25, rootMargin: "0px 0px -8% 0px" }
    );
    revealTargets.forEach(function (el) { io.observe(el); });

    var counterIo = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            runCounter(entry.target);
            counterIo.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.6 }
    );
    document.querySelectorAll("[data-countup]").forEach(function (el) {
      counterIo.observe(el);
    });
  }

  function startCounters() {
    document.querySelectorAll("[data-countup]").forEach(function (el) {
      el.textContent = formatCount(el, parseFloat(el.getAttribute("data-countup")));
    });
  }

  function formatCount(el, value) {
    var prefix = el.getAttribute("data-prefix") || "";
    var suffix = el.getAttribute("data-suffix") || "";
    var decimals = parseInt(el.getAttribute("data-decimals") || "0", 10);
    return prefix + value.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ",") + suffix;
  }

  function runCounter(el) {
    var target = parseFloat(el.getAttribute("data-countup"));
    var duration = parseInt(el.getAttribute("data-duration") || "1400", 10);
    var startTime = null;

    function step(ts) {
      if (startTime === null) startTime = ts;
      var progress = Math.min((ts - startTime) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = formatCount(el, target * eased);
      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        el.textContent = formatCount(el, target);
      }
    }
    window.requestAnimationFrame(step);
  }

  /* ---------- Current year ---------- */
  var yearEls = document.querySelectorAll("[data-year]");
  yearEls.forEach(function (el) { el.textContent = new Date().getFullYear(); });
})();
