/* =====================================================================
   CISCM — Site interactions (vanilla JS + GSAP + Swiper)
   Everything is attached through data-cxm-* attributes, so it will not
   interfere with scripts on the existing site.
   ===================================================================== */
(function () {
  "use strict";
  var root = document.querySelector(".cxm") || document.body;
  var MEDIA = window.CXM_MEDIA || { photos: {}, videos: {} };
  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var hasGsap = typeof window.gsap !== "undefined";
  if (!hasGsap || reduceMotion) root.classList.add("cxm-no-gsap");

  var $ = function (sel, ctx) {
    return (ctx || document).querySelector(sel);
  };
  var $$ = function (sel, ctx) {
    return Array.prototype.slice.call((ctx || document).querySelectorAll(sel));
  };
  var TONES = ["cxm-t-blue", "cxm-t-sky", "cxm-t-teal", "cxm-t-emerald", "cxm-t-amber", "cxm-t-orange", "cxm-t-rose", "cxm-t-cyan", "cxm-t-indigo"];
  var setTone = function (el, tone) {
    TONES.forEach(function (t) {
      el.classList.remove(t);
    });
    if (tone) el.classList.add(tone);
  };

  /* ---------- 1. Logo ---------- */
  $$("[data-cxm-logo]").forEach(function (wrap) {
    if (!MEDIA.logo) return;
    var img = new Image();
    img.className = "cxm-logo-img";
    img.alt = "CISCM — Chartered Institute of Supply Chain Management";
    img.onload = function () {
      wrap.innerHTML = "";
      wrap.appendChild(img);
    };
    img.src = MEDIA.logo;
  });

  /* ---------- 2. Background photos ---------- */
  $$("[data-cxm-photo]").forEach(function (el) {
    var src = MEDIA.photos[el.getAttribute("data-cxm-photo")];
    if (src) el.style.backgroundImage = 'url("' + src + '")';
  });

  /* ---------- 3. Background videos ---------- */
  $$("[data-cxm-video]").forEach(function (holder) {
    var list = MEDIA.videos[holder.getAttribute("data-cxm-video")];
    if (!list || !list.length) return;
    var v = document.createElement("video");
    v.muted = true;
    v.loop = true;
    v.playsInline = true;
    v.autoplay = !reduceMotion;
    v.setAttribute("muted", "");
    v.setAttribute("playsinline", "");
    v.setAttribute("aria-hidden", "true");
    v.preload = "metadata";
    list.forEach(function (src, i) {
      var s = document.createElement("source");
      s.src = src;
      s.type = "video/mp4";
      if (i === list.length - 1)
        s.addEventListener("error", function () {
          v.remove();
          toggleHide(holder);
        });
      v.appendChild(s);
    });
    v.addEventListener("canplay", function () {
      v.classList.add("cxm-ready");
    });
    holder.appendChild(v);
    if (!reduceMotion) {
      var p = v.play();
      if (p && p.catch) p.catch(function () {});
    }
  });
  function toggleHide(holder) {
    var scope = holder.closest("[data-cxm-scope]");
    var btn = scope && $("[data-cxm-vid-toggle]", scope);
    if (btn) btn.style.display = "none";
  }
  $$("[data-cxm-vid-toggle]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var scope = btn.closest("[data-cxm-scope]");
      var v = scope && $("video", scope);
      if (!v) return;
      var icon = $("i", btn);
      if (v.paused) {
        v.play();
        icon.className = "bi bi-pause-fill";
        btn.setAttribute("aria-label", "Pause background video");
      } else {
        v.pause();
        icon.className = "bi bi-play-fill";
        btn.setAttribute("aria-label", "Play background video");
      }
    });
  });

  /* ---------- 4. Generic tabs ---------- */
  function activateTab(group, key) {
    $$("[data-cxm-tab]", group).forEach(function (b) {
      var on = b.getAttribute("data-cxm-tab") === key;
      b.classList.toggle("cxm-active", on);
      b.setAttribute("aria-selected", on ? "true" : "false");
    });
    $$('.cxm-subnav a[href="#' + key + '"]').forEach(function (a) {
      $$(".cxm-subnav a").forEach(function (x) {
        x.classList.toggle("cxm-active", x === a);
      });
    });
    $$("[data-cxm-pane]", group).forEach(function (p) {
      p.classList.toggle("cxm-active", p.getAttribute("data-cxm-pane") === key);
    });
  }
  $$("[data-cxm-tabs]").forEach(function (group) {
    $$("[data-cxm-tab]", group).forEach(function (b) {
      b.addEventListener("click", function () {
        activateTab(group, b.getAttribute("data-cxm-tab"));
      });
    });
  });
  function openTabFromHash() {
    var h = location.hash.replace("#", "");
    if (!h) return;
    $$("[data-cxm-tabs]").forEach(function (group) {
      var btn = $('[data-cxm-tab="' + h + '"]', group);
      if (btn) activateTab(group, h);
    });
  }
  $$("[data-cxm-tabs]").forEach(function (group) {
    var first = $("[data-cxm-tab].cxm-active", group);
    if (first && $('.cxm-subnav a[href="#' + first.getAttribute("data-cxm-tab") + '"]')) activateTab(group, first.getAttribute("data-cxm-tab"));
  });
  openTabFromHash();
  window.addEventListener("hashchange", openTabFromHash);

  /* ---------- 5. Four Currents explorer ---------- */
  var CURRENTS = {
    material: {
      name: "Material",
      tone: "cxm-t-orange",
      flows: "Physical goods, capacity and assets",
      q: "Can we make, move, store and deliver reliably at the required cost and time?",
      d: [
        ["03", "Supply Planning and Inventory Optimisation"],
        ["06", "Operations and the Manufacturing Interface"],
        ["07", "Logistics, Transportation and Distribution"],
        ["14", "Quality, Standards and Continuous Improvement"],
      ],
    },
    money: {
      name: "Money",
      tone: "cxm-t-emerald",
      flows: "Cost, price, working capital, value and exposure",
      q: "Does our buying, holding and moving create value — and can we defend it financially?",
      d: [
        ["04", "Sourcing and Strategic Procurement"],
        ["10", "Supply Chain Finance, Cost and Value"],
      ],
    },
    information: {
      name: "Information",
      tone: "cxm-t-sky",
      flows: "Demand signals, plans, master data, systems and analytics",
      q: "Do we understand current and likely future conditions well enough to decide soundly?",
      d: [
        ["02", "Demand Management and Forecasting"],
        ["11", "Digital Supply Chain, Data and Technology"],
      ],
    },
    trust: {
      name: "Trust",
      tone: "cxm-t-rose",
      flows: "Assurance, integrity, compliance, provenance and relationship confidence",
      q: "Can we stand behind what we supply, how it was sourced and what we claim about it?",
      d: [
        ["05", "Supplier Relationship and Performance Management"],
        ["08", "Global Trade, Customs and Cross-Border Compliance"],
        ["09", "Supply Chain Risk, Resilience and Continuity"],
        ["12", "Sustainability, Ethics and Responsible Supply Chains"],
      ],
    },
  };
  $$("[data-cxm-currents]").forEach(function (box) {
    var panel = $(".cxm-cur-panel", box);
    var show = function (key) {
      var c = CURRENTS[key];
      if (!c) return;
      $$(".cxm-cur-btn", box).forEach(function (b) {
        b.classList.toggle("cxm-active", b.getAttribute("data-cxm-cur") === key);
      });
      setTone(panel, c.tone);
      $('[data-cxm-f="eyebrow"]', panel).textContent = "The " + c.name + " current";
      $('[data-cxm-f="flows"]', panel).textContent = c.flows;
      $('[data-cxm-f="q"]', panel).textContent = c.q;
      $('[data-cxm-f="icon"]', panel).className =
        "cxm-gcard-icon bi " + $('.cxm-cur-btn[data-cxm-cur="' + key + '"] .cxm-ico i', box).className.replace("bi ", "");
      $('[data-cxm-f="domains"]', panel).innerHTML = c.d
        .map(function (d) {
          return '<div class="cxm-cur-dom"><span>' + d[0] + "</span>" + d[1] + "</div>";
        })
        .join("");
      if (hasGsap && !reduceMotion) gsap.fromTo($$(".cxm-cur-dom", panel), { opacity: 0, x: 16 }, { opacity: 1, x: 0, stagger: 0.06, duration: 0.4 });
    };
    $$(".cxm-cur-btn", box).forEach(function (b) {
      ["mouseenter", "focus", "click"].forEach(function (ev) {
        b.addEventListener(ev, function () {
          if (!b.classList.contains("cxm-active")) show(b.getAttribute("data-cxm-cur"));
        });
      });
    });
    show("material");
  });

  /* ---------- 6. Domain filter ---------- */
  $$("[data-cxm-filters]").forEach(function (bar) {
    var grid = $(bar.getAttribute("data-cxm-filters"));
    $$(".cxm-filter", bar).forEach(function (b) {
      b.addEventListener("click", function () {
        var f = b.getAttribute("data-filter");
        $$(".cxm-filter", bar).forEach(function (x) {
          x.classList.toggle("cxm-active", x === b);
        });
        $$("[data-cxm-domain]", grid).forEach(function (d) {
          d.classList.toggle("cxm-dim", f !== "all" && d.getAttribute("data-cxm-domain") !== f);
        });
      });
    });
  });

  /* ---------- 7. Proficiency staircase ---------- */
  $$("[data-cxm-levels]").forEach(function (box) {
    var panel = $(".cxm-level-panel", box);
    var show = function (b) {
      $$(".cxm-level", box).forEach(function (x) {
        x.classList.toggle("cxm-active", x === b);
      });
      setTone(panel, b.getAttribute("data-tone"));
      $('[data-cxm-f="title"]', panel).textContent = "Level " + b.getAttribute("data-n") + " · " + b.getAttribute("data-name");
      $('[data-cxm-f="text"]', panel).textContent = b.getAttribute("data-text");
    };
    $$(".cxm-level", box).forEach(function (b) {
      ["mouseenter", "focus", "click"].forEach(function (ev) {
        b.addEventListener(ev, function () {
          show(b);
        });
      });
    });
    show($('.cxm-level[data-n="4"]', box) || $(".cxm-level", box));
  });

  /* ---------- 8. Orbit diagrams ---------- */
  $$("[data-cxm-orbit]").forEach(function (box) {
    var sats = $$(".cxm-orbit-sat", box);
    var panel = $(".cxm-orbit-panel", box);
    var n = sats.length;
    sats.forEach(function (s, i) {
      var a = (i / n) * Math.PI * 2 - Math.PI / 2;
      s.style.left = 50 + 38 * Math.cos(a) + "%";
      s.style.top = 50 + 38 * Math.sin(a) + "%";
    });
    var show = function (s, i) {
      sats.forEach(function (x) {
        x.classList.toggle("cxm-active", x === s);
      });
      setTone(panel, s.getAttribute("data-tone"));
      $('[data-cxm-f="count"]', panel).textContent = i + 1 + " / " + n;
      $('[data-cxm-f="title"]', panel).textContent = s.getAttribute("data-label");
      $('[data-cxm-f="text"]', panel).textContent = s.getAttribute("data-text");
    };
    sats.forEach(function (s, i) {
      ["mouseenter", "focus", "click"].forEach(function (ev) {
        s.addEventListener(ev, function () {
          show(s, i);
        });
      });
    });
    if (sats[0]) show(sats[0], 0);
  });

  /* ---------- 9. Count-up numbers & progress bars ---------- */
  var io =
    "IntersectionObserver" in window
      ? new IntersectionObserver(
          function (entries) {
            entries.forEach(function (e) {
              if (!e.isIntersecting) return;
              var el = e.target;
              io.unobserve(el);
              if (el.hasAttribute("data-cxm-count")) {
                var to = parseInt(el.getAttribute("data-cxm-count"), 10),
                  t0 = performance.now(),
                  dur = 1400;
                if (reduceMotion) {
                  el.textContent = to;
                  return;
                }
                var tick = function (t) {
                  var p = Math.min(1, (t - t0) / dur);
                  el.textContent = Math.round(to * (1 - Math.pow(1 - p, 3)));
                  if (p < 1) requestAnimationFrame(tick);
                };
                requestAnimationFrame(tick);
              } else if (el.hasAttribute("data-w")) {
                el.style.width = el.getAttribute("data-w");
              }
            });
          },
          { threshold: 0.3 },
        )
      : null;
  $$("[data-cxm-count], .cxm-bar span[data-w]").forEach(function (el) {
    if (io) io.observe(el);
    else el.textContent = el.getAttribute("data-cxm-count") || el.textContent;
  });

  /* ---------- 10. Swiper carousels ---------- */
  if (typeof window.Swiper !== "undefined") {
    $$("[data-cxm-swiper]").forEach(function (el) {
      var kind = el.getAttribute("data-cxm-swiper");
      var nav = el.parentElement.querySelector("[data-cxm-swiper-nav]");
      var opts = {
        slidesPerView: 1.1,
        spaceBetween: 20,
        grabCursor: true,
        speed: 700,
        pagination: { el: $(".swiper-pagination", el), clickable: true },
        navigation: nav ? { prevEl: $("[data-prev]", nav), nextEl: $("[data-next]", nav) } : undefined,
        breakpoints: { 640: { slidesPerView: 2 }, 992: { slidesPerView: 3 }, 1200: { slidesPerView: kind === "journey" ? 4 : 3 } },
      };
      if (kind === "teasers" && !reduceMotion) opts.autoplay = { delay: 3800, disableOnInteraction: false, pauseOnMouseEnter: true };
      new Swiper(el, opts);
    });
  }

  /* ---------- 11. GSAP animations ---------- */
  if (hasGsap && !reduceMotion) {
    if (window.ScrollTrigger) gsap.registerPlugin(ScrollTrigger);
    var intro = $$("[data-cxm-intro]");
    if (intro.length) gsap.from(intro, { y: 40, opacity: 0, duration: 1, stagger: 0.12, ease: "power3.out", delay: 0.1 });
    if (window.ScrollTrigger) {
      ScrollTrigger.batch(".cxm-reveal", {
        start: "top 88%",
        once: true,
        onEnter: function (els) {
          gsap.to(els, { opacity: 1, y: 0, duration: 0.9, stagger: 0.09, ease: "power3.out", overwrite: true });
        },
      });
      $$(".cxm-band .cxm-media-photo, .cxm-parallax .cxm-media-photo").forEach(function (ph) {
        gsap.fromTo(
          ph,
          { yPercent: -6 },
          {
            yPercent: 6,
            ease: "none",
            scrollTrigger: { trigger: ph.closest(".cxm-band, .cxm-parallax"), start: "top bottom", end: "bottom top", scrub: true },
          },
        );
      });
    } else {
      gsap.set(".cxm-reveal", { opacity: 1, y: 0 });
    }
  }

  /* ---------- 12. Forms (front-end only — connect to your backend) ---------- */
  $$("[data-cxm-form]").forEach(function (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var ok = $(form.getAttribute("data-cxm-form"));
      if (form.hasAttribute("data-cxm-keep")) {
        if (ok) ok.classList.add("cxm-show");
        return;
      }
      form.style.display = "none";
      if (ok) ok.classList.add("cxm-show");
    });
    $$("input, select, textarea", form).forEach(function (f) {
      f.addEventListener("input", function () {
        var ok = $(form.getAttribute("data-cxm-form"));
        if (ok && form.hasAttribute("data-cxm-keep")) ok.classList.remove("cxm-show");
      });
    });
  });
  $$("[data-cxm-pick]").forEach(function (b) {
    b.addEventListener("click", function () {
      $$("[data-cxm-pick]").forEach(function (x) {
        x.classList.toggle("cxm-active", x === b);
      });
      var sel = $("[data-cxm-type]");
      if (sel) sel.value = b.getAttribute("data-cxm-pick");
      var target = $("#cxm-form");
      if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  /* ---------- 13. Sub-navigation highlight ---------- */
  var subLinks = $$('.cxm-subnav a[href^="#"]');
  if (subLinks.length && "IntersectionObserver" in window) {
    var spy = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (!e.isIntersecting) return;
          subLinks.forEach(function (a) {
            a.classList.toggle("cxm-active", a.getAttribute("href") === "#" + e.target.id);
          });
        });
      },
      { rootMargin: "-40% 0px -55% 0px" },
    );
    subLinks.forEach(function (a) {
      var t = document.getElementById(a.getAttribute("href").slice(1));
      if (t && !t.hasAttribute("data-cxm-tabanchor")) spy.observe(t);
    });
  }

  /* ---------- 14. Back to top ---------- */
  var top = $(".cxm-totop");
  if (top) {
    window.addEventListener(
      "scroll",
      function () {
        top.classList.toggle("cxm-show", window.scrollY > 400);
      },
      { passive: true },
    );
    top.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }
  $$("[data-cxm-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });
})();
