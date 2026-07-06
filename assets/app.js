/* Hapvida × DRVMG — Landing de vendas (conversão + rede MG real) */
(function () {
  "use strict";
  var WA = "5585997800029"; // ⚠️ Wolkmar: trocar aqui
  var wa = function (m) { return "https://wa.me/" + WA + "?text=" + encodeURIComponent(m); };
  var openWa = function (m) { window.open(wa(m), "_blank", "noopener,noreferrer"); };
  var esc = function (s) { return String(s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); };
  var ss = function (k, v) { try { if (v === undefined) return sessionStorage.getItem(k); sessionStorage.setItem(k, v); } catch (e) { return null; } };

  document.querySelectorAll("[data-wa]").forEach(function (b) {
    b.addEventListener("click", function (e) { e.preventDefault(); openWa(b.getAttribute("data-wa") || "Olá! Quero uma cotação do plano Hapvida."); });
  });

  /* ---------- FORMULÁRIO MULTI-ETAPA ---------- */
  (function () {
    var form = document.getElementById("leadForm");
    if (!form) return;
    var fill = document.getElementById("lcFill");
    var steps = form.querySelectorAll(".lc-step");
    var tipo = "Individual";
    function go(n) {
      steps.forEach(function (s) { s.classList.toggle("active", s.getAttribute("data-step") == n); });
      fill.style.width = n == 1 ? "50%" : "100%";
      if (n == 2) { var f = form.querySelector("#ln"); if (f) setTimeout(function () { f.focus(); }, 60); }
    }
    form.querySelectorAll(".opt[data-tipo]").forEach(function (o) { o.addEventListener("click", function () { tipo = o.getAttribute("data-tipo"); go(2); }); });
    var back = document.getElementById("lcBack");
    if (back) back.addEventListener("click", function () { go(1); });
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var ok = true;
      form.querySelectorAll(".lc-step[data-step='2'] [required]").forEach(function (inp) {
        var bad = !(inp.value || "").trim(); var fld = inp.closest(".field"); if (fld) fld.classList.toggle("invalid", bad); if (bad) ok = false;
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

  /* ---------- REDE PRÓPRIA HAPVIDA EM MINAS GERAIS (dados oficiais) ---------- */
  (function () {
    var root = document.getElementById("rede");
    if (!root) return;
    var CITIES = {
      "Belo Horizonte": {
        hospitais: ["Hospital Lifecenter — Funcionários", "Hospital Vera Cruz — Barro Preto", "Hospital Maternidade Octaviano Neves — Santa Efigênia"],
        pa: ["Pronto Atendimento Contorno — Santa Efigênia", "Pronto Atendimento HVC — Barro Preto"],
        clinicas: ["Clínica Barreiro — Barreiro", "Clínica Octaviano Neves — Santa Efigênia", "Centro Médico Proclin Amazonas — Centro", "HVC Day (Ed. Minerva) — Barro Preto", "Unidade Avançada Venda Nova — São João Batista", "Ambulatório HVC — Barro Preto"],
        diag: ["Diagnóstico Raja Gabaglia — Santa Lúcia", "Diagnóstico Timbiras — Barro Preto", "Centro de Oncologia e Infusões — Barro Preto", "Diagnóstico Efigênia — Santa Efigênia"]
      },
      "Contagem": { hospitais: ["Hospital Lifecenter Contagem — Eldorado"], clinicas: ["Centro Médico Proclin — Eldorado"] },
      "Betim": { pa: ["Unidade Avançada de Betim — Jardim da Cidade"] },
      "Uberlândia": { hospitais: ["Hospital Madrecor — Santa Mônica"], clinicas: ["Clínica Médica Uberlândia — Tabajaras"] },
      "Uberaba": { pa: ["Pronto Atendimento Uberaba — Santos Dumont"], clinicas: ["Clínica Triângulo Sul — São Benedito", "Clínica Uberaba — Santa Maria"], diag: ["Diagnóstico Sete Colinas — São Benedito"] },
      "Divinópolis": { hospitais: ["Hospital Santa Mônica — Padre Libério"], clinicas: ["Centro Clínico Divinópolis — Centro"], diag: ["Bioimagem Divinópolis — Centro"] },
      "Poços de Caldas": { hospitais: ["Hospital Poços de Caldas — Jardim Esmeralda"] },
      "Varginha": { hospitais: ["Hospital Varginha — Parque Mariela"] },
      "Alfenas": { hospitais: ["Hospital Alfenas — Jardim Tropical"] },
      "Nova Serrana": { hospitais: ["Hospital Santa Mônica — Nova Serrana"] },
      "Ituiutaba": { clinicas: ["Clínica Ituiutaba — Centro"] },
      "Montes Claros": { clinicas: ["Clínica Dr. Santos — Centro"] }
    };
    var ORDER = ["Belo Horizonte", "Contagem", "Betim", "Uberlândia", "Uberaba", "Divinópolis", "Poços de Caldas", "Varginha", "Alfenas", "Nova Serrana", "Ituiutaba", "Montes Claros"];
    var LABEL = { hospitais: "Hospitais", pa: "Prontos atendimentos", clinicas: "Clínicas", diag: "Diagnósticos" };
    var IC = {
      hospitais: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" width="16" height="16"><path d="M12 7v8M8 11h8"/><rect x="4" y="4" width="16" height="16" rx="3"/></svg>',
      pa: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" width="16" height="16"><path d="M12 21s7-6.2 7-11a7 7 0 0 0-14 0c0 4.8 7 11 7 11Z"/><path d="M12 7v6M9 10h6"/></svg>',
      clinicas: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" width="16" height="16"><path d="M4 21V9l8-6 8 6v12M9 21v-6h6v6"/></svg>',
      diag: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" width="16" height="16"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>'
    };
    var listEl = root.querySelector("#mgCities"), detEl = root.querySelector("#mgDetail"), ctaBtn = root.querySelector("#mgCta");
    var current = "";
    function total(c) { var d = CITIES[c], n = 0; ["hospitais", "pa", "clinicas", "diag"].forEach(function (k) { if (d[k]) n += d[k].length; }); return n; }
    function renderList() {
      listEl.innerHTML = ORDER.map(function (c) { return '<button class="mg-city' + (c === current ? " on" : "") + '" data-city="' + esc(c) + '">' + esc(c) + '<span class="badge2">' + total(c) + "</span></button>"; }).join("");
      listEl.querySelectorAll(".mg-city").forEach(function (b) { b.addEventListener("click", function () { select(b.getAttribute("data-city")); }); });
    }
    function renderDetail() {
      var d = CITIES[current], html = "<h3>" + esc(current) + '</h3><div class="dsub">' + total(current) + " unidade(s) da rede própria Hapvida</div>";
      ["hospitais", "pa", "clinicas", "diag"].forEach(function (k) {
        if (!d[k] || !d[k].length) return;
        html += '<div class="mg-group"><div class="gh">' + IC[k] + " " + LABEL[k] + " (" + d[k].length + ")</div>";
        d[k].forEach(function (u) {
          var p = u.split(" — ");
          html += '<div class="mg-unit"><span class="ui">' + IC[k] + "</span><div><b>" + esc(p[0]) + "</b>" + (p[1] ? "<span>" + esc(p[1]) + "</span>" : "") + "</div></div>";
        });
        html += "</div>";
      });
      detEl.innerHTML = html;
      if (ctaBtn) ctaBtn.setAttribute("data-msg", "Olá! Quero conhecer a rede Hapvida completa em " + current + " (MG) e fazer uma cotação.");
    }
    function select(c) { current = c; renderList(); renderDetail(); }
    if (ctaBtn) ctaBtn.addEventListener("click", function () { openWa(this.getAttribute("data-msg") || "Olá! Quero conhecer a rede Hapvida em Minas Gerais."); });
    select("Belo Horizonte");
  })();

  /* ---------- CHAT DA ATENDENTE ---------- */
  (function () {
    var pop = document.getElementById("chatpop");
    if (!pop) return;
    var open = function () { if (ss("hv_chat") !== "1") pop.classList.add("show"); };
    var close = function () { pop.classList.remove("show"); ss("hv_chat", "1"); };
    pop.querySelector(".cx").addEventListener("click", close);
    pop.querySelectorAll("[data-chat]").forEach(function (b) { b.addEventListener("click", function () { openWa(b.getAttribute("data-chat")); close(); }); });
    if (ss("hv_chat") !== "1") setTimeout(open, 9000);
  })();

  /* ---------- FAQ ---------- */
  document.querySelectorAll(".faq-q").forEach(function (q) {
    q.addEventListener("click", function () { var it = q.closest(".faq-item"), a = it.querySelector(".faq-a"); var o = it.classList.toggle("open"); a.style.maxHeight = o ? a.scrollHeight + "px" : 0; });
  });

  /* ---------- CONTADORES + REVEAL ---------- */
  var io = new IntersectionObserver(function (es) { es.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } }); }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
  document.querySelectorAll(".rv").forEach(function (el) { io.observe(el); });
  function count(el) { var t = parseInt(el.getAttribute("data-count"), 10) || 0, dur = 1300, s = null; function step(ts) { if (s === null) s = ts; var p = Math.min((ts - s) / dur, 1); el.textContent = Math.round(t * (1 - Math.pow(1 - p, 3))).toLocaleString("pt-BR"); if (p < 1) requestAnimationFrame(step); } requestAnimationFrame(step); }
  var cio = new IntersectionObserver(function (es) { es.forEach(function (en) { if (en.isIntersecting) { count(en.target); cio.unobserve(en.target); } }); }, { threshold: 0.6 });
  document.querySelectorAll("[data-count]").forEach(function (el) { cio.observe(el); });

  if (document.querySelector(".mcta")) document.body.classList.add("has-mcta");
})();
