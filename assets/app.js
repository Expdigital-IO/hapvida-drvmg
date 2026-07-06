/* Hapvida × DRVMG — Landing de vendas v2 (conversão) */
(function () {
  "use strict";
  var WA = "5585997800029"; // ⚠️ Wolkmar: trocar aqui
  var wa = function (m) { return "https://wa.me/" + WA + "?text=" + encodeURIComponent(m); };
  var openWa = function (m) { window.open(wa(m), "_blank", "noopener,noreferrer"); };
  var ss = function (k, v) { try { if (v === undefined) return sessionStorage.getItem(k); sessionStorage.setItem(k, v); } catch (e) { return null; } };

  // botões [data-wa]
  document.querySelectorAll("[data-wa]").forEach(function (b) {
    b.addEventListener("click", function (e) { e.preventDefault(); openWa(b.getAttribute("data-wa") || "Olá! Quero uma cotação do plano Hapvida."); });
  });

  /* ---------- FORMULÁRIO MULTI-ETAPA (hero) ---------- */
  (function () {
    var form = document.getElementById("leadForm");
    if (!form) return;
    var fill = document.getElementById("lcFill");
    var steps = form.querySelectorAll(".lc-step");
    var tipo = "Individual";
    function go(n) {
      steps.forEach(function (s) { s.classList.toggle("active", s.getAttribute("data-step") == n); });
      fill.style.width = n == 1 ? "50%" : "100%";
      if (n == 2) { var f = form.querySelector("#ln"); if (f) setTimeout(function(){ f.focus(); }, 60); }
    }
    form.querySelectorAll(".opt[data-tipo]").forEach(function (o) {
      o.addEventListener("click", function () { tipo = o.getAttribute("data-tipo"); go(2); });
    });
    var back = document.getElementById("lcBack");
    if (back) back.addEventListener("click", function () { go(1); });
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var ok = true;
      form.querySelectorAll(".lc-step[data-step='2'] [required]").forEach(function (inp) {
        var bad = !(inp.value || "").trim();
        var fld = inp.closest(".field"); if (fld) fld.classList.toggle("invalid", bad);
        if (bad) ok = false;
      });
      if (!ok) return;
      var g = function (id) { var el = document.getElementById(id); return el && el.value.trim() ? el.value.trim() : ""; };
      var msg = "Nova cotação do plano Hapvida (site hapvida.drvmg.com.br):\n• Tipo: " + tipo + "\n• Nome: " + g("ln") + "\n• WhatsApp: " + g("lw");
      if (g("lc")) msg += "\n• Cidade: " + g("lc");
      openWa(msg);
      document.getElementById("leadWrap").style.display = "none";
      document.querySelector(".leadcard [data-ok]").style.display = "block";
      ss("hv_lead", "1");
    });
  })();

  /* ---------- EXPLORADOR DA REDE CREDENCIADA ---------- */
  (function () {
    var root = document.getElementById("rede");
    if (!root) return;
    var CAT = {
      hospitais: { n: 85, plus: true, cat: "hospitais próprios", h: "Hospitais próprios de ponta a ponta", p: "Internação, cirurgias e maternidade em estrutura própria Hapvida — sem depender de terceiros, com mais agilidade e cuidado." },
      pa: { n: 77, plus: true, cat: "prontos atendimentos", h: "Pronto atendimento quando você precisa", p: "Emergência e urgência 24h em dezenas de unidades — atendimento rápido pra você e sua família a qualquer hora." },
      clinicas: { n: 331, plus: true, cat: "clínicas", h: "Consultas perto de você", p: "Centenas de clínicas para consultas e acompanhamento com as principais especialidades médicas." },
      diag: { n: 271, plus: true, cat: "unidades de diagnóstico", h: "Exames com laudo ágil", p: "Laboratórios e centros de imagem próprios — do exame simples ao mais complexo, tudo na mesma rede." },
      estados: { n: 20, plus: false, cat: "estados atendidos", h: "Cobertura em todo o Brasil", p: "Onde você estiver, tem Hapvida NotreDame Intermédica — a maior rede exclusiva do Norte e Nordeste, com atendimento nacional." }
    };
    var numEl = root.querySelector("#redeNum"), plusEl = root.querySelector("#redePlus"), catEl = root.querySelector("#redeCat");
    var hEl = root.querySelector("#redeH"), pEl = root.querySelector("#redeP");
    var current = "hospitais", city = "";
    function animateNum(target) {
      var dur = 900, start = null;
      function step(ts) { if (start === null) start = ts; var pr = Math.min((ts - start) / dur, 1); numEl.textContent = Math.round(target * (1 - Math.pow(1 - pr, 3))); if (pr < 1) requestAnimationFrame(step); }
      requestAnimationFrame(step);
    }
    function render(key) {
      var c = CAT[key]; current = key;
      animateNum(c.n); plusEl.style.display = c.plus ? "inline" : "none";
      catEl.textContent = c.cat; hEl.textContent = c.h; pEl.textContent = c.p;
      updateCta();
    }
    function updateCta() {
      var ct = root.querySelector("#redeCtaTxt"), btn = root.querySelector("#redeCtaBtn");
      var c = CAT[current];
      if (city) { ct.innerHTML = "Quer a lista de <b>" + c.cat + "</b> em <b>" + city + "</b>? A gente te envia agora."; }
      else { ct.innerHTML = "Escolha sua cidade e receba a <b>lista completa da rede</b> no WhatsApp."; }
      btn.setAttribute("data-msg", "Olá! Quero conhecer a rede credenciada Hapvida (" + c.cat + ")" + (city ? " em " + city : "") + ". Pode me enviar a lista?");
    }
    root.querySelectorAll(".rtab").forEach(function (t) {
      t.addEventListener("click", function () { root.querySelectorAll(".rtab").forEach(function (x) { x.classList.remove("on"); }); t.classList.add("on"); render(t.getAttribute("data-cat")); });
    });
    root.querySelectorAll(".rchip").forEach(function (ch) {
      ch.addEventListener("click", function () { root.querySelectorAll(".rchip").forEach(function (x) { x.classList.remove("on"); }); ch.classList.add("on"); city = ch.textContent.trim(); updateCta(); });
    });
    root.querySelector("#redeCtaBtn").addEventListener("click", function () { openWa(this.getAttribute("data-msg") || "Olá! Quero conhecer a rede credenciada Hapvida."); });
    render("hospitais");
  })();

  /* ---------- CHAT DA ATENDENTE ---------- */
  (function () {
    var pop = document.getElementById("chatpop");
    if (!pop) return;
    var open = function () { if (ss("hv_chat") !== "1") pop.classList.add("show"); };
    var close = function () { pop.classList.remove("show"); ss("hv_chat", "1"); };
    pop.querySelector(".cx").addEventListener("click", close);
    pop.querySelectorAll("[data-chat]").forEach(function (b) {
      b.addEventListener("click", function () { openWa(b.getAttribute("data-chat")); close(); });
    });
    if (ss("hv_chat") !== "1") setTimeout(open, 9000);
  })();

  /* ---------- EXIT-INTENT ---------- */
  (function () {
    var ov = document.getElementById("exitov");
    if (!ov) return;
    var form = ov.querySelector("form");
    var closeBtn = ov.querySelector(".ex-close");
    function show() { if (ss("hv_exit") === "1" || ss("hv_lead") === "1") return; ov.classList.add("show"); ss("hv_exit", "1"); }
    function hide() { ov.classList.remove("show"); }
    closeBtn.addEventListener("click", hide);
    ov.addEventListener("click", function (e) { if (e.target === ov) hide(); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") hide(); });
    if (window.matchMedia("(min-width:760px)").matches) {
      document.addEventListener("mouseout", function (e) { if (!e.relatedTarget && e.clientY <= 0) show(); });
    }
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var ok = true;
      form.querySelectorAll("[required]").forEach(function (inp) { var bad = !(inp.value || "").trim(); var fld = inp.closest(".field"); if (fld) fld.classList.toggle("invalid", bad); if (bad) ok = false; });
      if (!ok) return;
      var n = form.querySelector("[data-label='Nome']"), w = form.querySelector("[data-label='WhatsApp']");
      openWa("Quero a Tabela Hapvida 2026 com as condições de hoje!\n• Nome: " + (n ? n.value.trim() : "") + "\n• WhatsApp: " + (w ? w.value.trim() : ""));
      hide();
    });
  })();

  /* ---------- FAQ ---------- */
  document.querySelectorAll(".faq-q").forEach(function (q) {
    q.addEventListener("click", function () { var it = q.closest(".faq-item"), a = it.querySelector(".faq-a"); var o = it.classList.toggle("open"); a.style.maxHeight = o ? a.scrollHeight + "px" : 0; });
  });

  /* ---------- CONTADORES + REVEAL ---------- */
  var io = new IntersectionObserver(function (es) { es.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } }); }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
  document.querySelectorAll(".rv").forEach(function (el) { io.observe(el); });

  function count(el) { var t = parseInt(el.getAttribute("data-count"), 10) || 0, dur = 1400, s = null; function step(ts) { if (s === null) s = ts; var p = Math.min((ts - s) / dur, 1); el.textContent = Math.round(t * (1 - Math.pow(1 - p, 3))).toLocaleString("pt-BR"); if (p < 1) requestAnimationFrame(step); } requestAnimationFrame(step); }
  var cio = new IntersectionObserver(function (es) { es.forEach(function (en) { if (en.isIntersecting) { count(en.target); cio.unobserve(en.target); } }); }, { threshold: 0.6 });
  document.querySelectorAll("[data-count]").forEach(function (el) { cio.observe(el); });

  if (document.querySelector(".mcta")) document.body.classList.add("has-mcta");
})();
