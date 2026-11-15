/* ==========================================================================
   梦限大MewType 应援站 — main.js
   原生 JavaScript，无任何外部依赖，可离线运行。
   --------------------------------------------------------------------------
   01  顶部状态（滚动收缩 / 导航展开 / 进度条 / 返回顶部）
   02  滚动入场动画
   03  首屏海报轮播
   04  数字滚动计数
   05  人物弹窗
   06  筛选（活动 / 周边）
   07  卡片横向拖动
   08  杂项
   ========================================================================== */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var $ = function (sel, ctx) {
    return (ctx || document).querySelector(sel);
  };
  var $$ = function (sel, ctx) {
    return Array.prototype.slice.call((ctx || document).querySelectorAll(sel));
  };

  /* ---------------------------------------------- 01 顶部状态 */
  var header = $("#siteHeader");
  var progress = $("#scrollProgress");
  var toTop = $("#toTop");
  var nav = $("#siteNav");
  var navToggle = $("#navToggle");

  function onScroll() {
    var y = window.pageYOffset || document.documentElement.scrollTop;
    if (header) header.classList.toggle("is-stuck", y > 24);
    if (toTop) toTop.classList.toggle("is-on", y > 620);
    if (progress) {
      var h = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.width = (h > 0 ? (y / h) * 100 : 0) + "%";
    }
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  if (navToggle && nav) {
    navToggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    $$(".nav__link", nav).forEach(function (a) {
      a.addEventListener("click", function () {
        nav.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("is-open")) {
        nav.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
        navToggle.focus();
      }
    });
  }

  if (toTop) {
    toTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
    });
  }

  /* ---------------------------------------------- 02 滚动入场动画 */
  var revealItems = $$("[data-reveal]");
  if (revealItems.length) {
    if (reduceMotion || !("IntersectionObserver" in window)) {
      revealItems.forEach(function (el) {
        el.classList.add("is-in");
      });
    } else {
      var io = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-in");
              io.unobserve(entry.target);
            }
          });
        },
        { rootMargin: "0px 0px -12% 0px", threshold: 0.08 }
      );
      revealItems.forEach(function (el) {
        io.observe(el);
      });
    }
  }
  /* 给同组元素自动加上递增延迟 */
  $$("[data-reveal-group]").forEach(function (group) {
    $$("[data-reveal]", group).forEach(function (el, i) {
      if (!el.style.getPropertyValue("--d")) {
        el.style.setProperty("--d", Math.min(i * 70, 420) + "ms");
      }
    });
  });

  /* ---------------------------------------------- 03 首屏海报轮播 */
  var slides = $$(".poster-slide");
  if (slides.length > 1) {
    var dotsWrap = $("#posterDots");
    var idx = 0;
    var timer = null;
    var capJp = $("#posterCapJp");
    var capEn = $("#posterCapEn");

    if (dotsWrap) {
      slides.forEach(function (_, i) {
        var b = document.createElement("button");
        b.type = "button";
        b.setAttribute("aria-label", "查看第 " + (i + 1) + " 张主视觉");
        b.addEventListener("click", function () {
          go(i);
          restart();
        });
        dotsWrap.appendChild(b);
      });
    }

    function go(n) {
      idx = (n + slides.length) % slides.length;
      slides.forEach(function (s, i) {
        s.classList.toggle("is-on", i === idx);
      });
      if (dotsWrap) {
        $$("button", dotsWrap).forEach(function (b, i) {
          b.classList.toggle("is-on", i === idx);
        });
      }
      var cur = slides[idx];
      if (capJp && cur.dataset.jp) capJp.textContent = cur.dataset.jp;
      if (capEn && cur.dataset.en) capEn.textContent = cur.dataset.en;
    }
    function restart() {
      if (timer) clearInterval(timer);
      if (!reduceMotion) timer = setInterval(function () {
        go(idx + 1);
      }, 5200);
    }
    go(0);
    restart();
    document.addEventListener("visibilitychange", function () {
      if (document.hidden) {
        if (timer) clearInterval(timer);
      } else {
        restart();
      }
    });
  }

  /* ---------------------------------------------- 04 数字滚动计数 */
  var counters = $$("[data-count]");
  if (counters.length) {
    var run = function (el) {
      var target = parseFloat(el.dataset.count);
      var suffix = el.dataset.suffix || "";
      if (reduceMotion) {
        el.textContent = target + suffix;
        return;
      }
      var start = performance.now();
      var dur = 1200;
      var step = function (now) {
        var p = Math.min((now - start) / dur, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(target * eased) + suffix;
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };
    if ("IntersectionObserver" in window) {
      var co = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (e) {
            if (e.isIntersecting) {
              run(e.target);
              co.unobserve(e.target);
            }
          });
        },
        { threshold: 0.5 }
      );
      counters.forEach(function (el) {
        co.observe(el);
      });
    } else {
      counters.forEach(run);
    }
  }

  /* ---------------------------------------------- 05 人物弹窗 */
  var modal = $("#memberModal");
  if (modal) {
    var panel = $(".modal__panel", modal);
    var lastFocus = null;
    var art = $("#modalArt");
    var role = $("#modalRole");
    var name = $("#modalName");
    var en = $("#modalEn");
    var tag = $("#modalTagline");
    var desc = $("#modalDesc");
    var facts = $("#modalFacts");

    function fill(card) {
      if (art) {
        art.src = card.dataset.img;
        art.alt = card.dataset.name + " 官方角色立绘";
      }
      if (role) role.textContent = card.dataset.role || "";
      if (name) name.textContent = card.dataset.name || "";
      if (en) en.textContent = card.dataset.en || "";
      if (tag) tag.textContent = card.dataset.tagline || "";
      if (desc) desc.textContent = card.dataset.desc || "";
      if (facts) {
        facts.innerHTML = "";
        var rows = (card.dataset.facts || "").split("|").filter(Boolean);
        rows.forEach(function (r) {
          var parts = r.split("::");
          var dt = document.createElement("dt");
          var dd = document.createElement("dd");
          dt.textContent = parts[0] || "";
          dd.textContent = parts[1] || "";
          facts.appendChild(dt);
          facts.appendChild(dd);
        });
      }
    }

    function open(card) {
      lastFocus = document.activeElement;
      fill(card);
      modal.classList.add("is-open");
      modal.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
      var close = $(".modal__close", modal);
      if (close) close.focus();
    }
    function close() {
      modal.classList.remove("is-open");
      modal.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
      if (lastFocus) lastFocus.focus();
    }

    $$("[data-member]").forEach(function (card) {
      card.addEventListener("click", function (e) {
        e.preventDefault();
        open(card);
      });
      card.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          open(card);
        }
      });
    });

    $$("[data-close]", modal).forEach(function (b) {
      b.addEventListener("click", close);
    });
    modal.addEventListener("click", function (e) {
      if (e.target === modal) close();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && modal.classList.contains("is-open")) close();
      /* 焦点陷阱 */
      if (e.key === "Tab" && modal.classList.contains("is-open") && panel) {
        var f = $$(
          'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])',
          panel
        ).filter(function (el) {
          return el.offsetParent !== null;
        });
        if (!f.length) return;
        var first = f[0];
        var last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    });
  }

  /* ---------------------------------------------- 06 筛选 */
  function syncCount(group) {
    var count = $("#filterCount");
    if (!count) return;
    var items = $$("[data-cat]", group);
    count.textContent = items.filter(function (i) {
      return !i.hidden;
    }).length;
  }

  /* 时间轴：某一年的条目全部被隐藏时，把年份标题也收起来 */
  function syncYears(group) {
    var years = $$(".tl-year", group);
    if (!years.length) return;
    years.forEach(function (year) {
      var anyVisible = false;
      var node = year.nextElementSibling;
      while (node && !node.classList.contains("tl-year")) {
        if (!node.hidden) anyVisible = true;
        node = node.nextElementSibling;
      }
      year.hidden = !anyVisible;
    });
  }

  $$("[data-filter-group]").forEach(function (group) {
    var buttons = $$("[data-filter]", group);
    var items = $$("[data-cat]", group);
    buttons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        var key = btn.dataset.filter;
        buttons.forEach(function (b) {
          b.classList.toggle("is-on", b === btn);
          b.setAttribute("aria-pressed", b === btn ? "true" : "false");
        });
        items.forEach(function (item) {
          var show = key === "all" || item.dataset.cat === key;
          item.hidden = !show;
          if (show) {
            item.classList.remove("is-in");
            /* 触发一次重绘，让动画重播 */
            void item.offsetWidth;
            item.classList.add("is-in");
          }
        });
        syncYears(group);
        syncCount(group);
      });
    });
    syncCount(group);
  });

  /* ---------------------------------------------- 07 横向拖动 */
  $$("[data-drag]").forEach(function (rail) {
    var down = false;
    var sx = 0;
    var sl = 0;
    rail.addEventListener("pointerdown", function (e) {
      if (e.pointerType === "touch") return;
      down = true;
      sx = e.clientX;
      sl = rail.scrollLeft;
      rail.style.cursor = "grabbing";
    });
    rail.addEventListener("pointermove", function (e) {
      if (!down) return;
      rail.scrollLeft = sl - (e.clientX - sx);
    });
    ["pointerup", "pointerleave", "pointercancel"].forEach(function (ev) {
      rail.addEventListener(ev, function () {
        down = false;
        rail.style.cursor = "";
      });
    });
  });

  /* ---------------------------------------------- 08 杂项 */
  var yearEl = $("#year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* 平滑锚点（考虑固定页头高度） */
  $$('a[href^="#"]').forEach(function (a) {
    a.addEventListener("click", function (e) {
      var id = a.getAttribute("href");
      if (!id || id === "#") return;
      var target = document.getElementById(id.slice(1));
      if (!target) return;
      e.preventDefault();
      var top = target.getBoundingClientRect().top + window.pageYOffset - 84;
      window.scrollTo({ top: top, behavior: reduceMotion ? "auto" : "smooth" });
      history.replaceState(null, "", id);
    });
  });
})();
