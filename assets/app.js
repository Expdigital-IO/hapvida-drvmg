/* Hapvida × DRVMG — Landing de vendas (interações) */
(function () {
  "use strict";
  // ⚠️ trocar aqui (Wolkmar)
  var WA = "5585997800029";
  var wa = function (msg) { return "https://wa.me/" + WA + "?text=" + encodeURIComponent(msg); };
  var openWa = function (msg) { window.open(wa(msg), "_blank", "noopener,noreferrer"); };

  // botões [data-wa]
  document.querySelectorAll("[data-wa]").forEach(function (b) {
    b.addEventListener("click", function (e) { e.preventDefault(); openWa(b.getAttribute("data-wa") || "Olá! Quero uma cotação do plano Hapvida."); });
  });

  // formulários de cotação -> WhatsApp
  document.querySelectorAll("form[data-waform]").forEach(function (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var ok = true;
      form.querySelectorAll("[required]").forEach(function (inp) {
        var v = (inp.value || "").trim(), bad = !v;
        var fld = inp.closest(".field"); if (fld) fld.classList.toggle("invalid", bad);
        if (bad) ok = false;
      });
      if (!ok) return;
      var msg = (form.getAttribute("data-waform") || "Quero uma cotação do plano Hapvida") + ":\n";
      form.querySelectorAll("[data-label]").forEach(function (inp) {
        if (inp.value && inp.value.trim()) msg += "• " + inp.getAttribute("data-label") + ": " + inp.value.trim() + "\n";
      });
      openWa(msg);
      var ok2 = null, n = form.parentElement;
      while (n && !ok2) { ok2 = n.querySelector("[data-ok]"); n = n.parentElement; }
      if (ok2) { (form.closest("#leadWrap") || form).style.display = "none"; ok2.style.display = "block"; }
    });
  });

  // FAQ
  document.querySelectorAll(".faq-q").forEach(function (q) {
    q.addEventListener("click", function () {
      var it = q.closest(".faq-item"), a = it.querySelector(".faq-a");
      var open = it.classList.toggle("open");
      a.style.maxHeight = open ? a.scrollHeight + "px" : 0;
    });
  });

  // reveal on scroll
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
  }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
  document.querySelectorAll(".rv").forEach(function (el) { io.observe(el); });

  // contadores animados
  function animate(el) {
    var target = parseInt(el.getAttribute("data-count"), 10) || 0;
    var dur = 1400, start = null;
    function step(ts) {
      if (start === null) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased).toLocaleString("pt-BR");
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  var cio = new IntersectionObserver(function (es) {
    es.forEach(function (en) { if (en.isIntersecting) { animate(en.target); cio.unobserve(en.target); } });
  }, { threshold: 0.6 });
  document.querySelectorAll("[data-count]").forEach(function (el) { cio.observe(el); });

  // sticky mobile cta: reserva espaço no mobile
  if (document.querySelector(".mcta")) document.body.classList.add("has-mcta");
})();
