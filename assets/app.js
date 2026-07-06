/* Hapvida × DRVMG — Landing de vendas (conversão + rede MG real + mapa) */
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
    var fill = document.getElementById("lcFill"), steps = form.querySelectorAll(".lc-step"), tipo = "Individual";
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

  /* ---------- REDE PRÓPRIA HAPVIDA EM MG (dados oficiais + mapa) ---------- */
  (function () {
    var root = document.getElementById("rede");
    if (!root) return;
    var CITIES = {
      "Belo Horizonte": {
        hospitais: [["Hospital Lifecenter", "Av. do Contorno, 4747 — Funcionários"], ["Hospital Vera Cruz", "Av. Barbacena, 653 — Barro Preto"], ["Maternidade Octaviano Neves", "Rua Ceará, 186 — Santa Efigênia"]],
        pa: [["Pronto Atendimento Contorno", "Av. do Contorno, 2001 — Santa Efigênia"], ["Pronto Atendimento HVC", "Av. Barbacena, 653 — Barro Preto"]],
        clinicas: [["Clínica Barreiro", "Av. Sinfrônio Brochado, 587 — Barreiro"], ["Clínica Octaviano Neves", "Rua Domingos Vieira, 561 — Santa Efigênia"], ["Centro Médico Proclin Amazonas", "Av. Amazonas, 641, 5º andar — Centro"], ["HVC Day (Ed. Minerva)", "Rua dos Aimorés, 3000 — Barro Preto"], ["Unidade Avançada Venda Nova", "Rua Dr. Álvaro Camargos, 2002 — São João Batista"], ["Ambulatório HVC", "Rua dos Timbiras, 3210 — Barro Preto"]],
        diag: [["Diagnóstico Raja Gabaglia", "Av. Raja Gabaglia, 4091 — Santa Lúcia"], ["Diagnóstico Timbiras", "Rua dos Timbiras, 3210 — Barro Preto"], ["Centro de Oncologia e Infusões", "Rua Rio Grande do Sul, 620 — Barro Preto"], ["Diagnóstico Efigênia", "Rua Rio Grande do Norte, 441 — Santa Efigênia"]]
      },
      "Contagem": { hospitais: [["Hospital Lifecenter Contagem", "Rua das Mangueiras, 150 — Eldorado"]], clinicas: [["Centro Médico Proclin", "Av. João Cesar de Oliveira, 1009 — Eldorado"]] },
      "Betim": { pa: [["Unidade Avançada de Betim", "Rua Edmeia Mattos Lazzarotti, 2192 — Jardim da Cidade"]] },
      "Uberlândia": { hospitais: [["Hospital Madrecor", "Av. Francisco Ribeiro, 1111 — Santa Mônica"]], clinicas: [["Clínica Médica Uberlândia", "Rua Virgílio Melo Franco, 465 — Tabajaras"]] },
      "Uberaba": { pa: [["Pronto Atendimento Uberaba", "Av. Santos Dumont, 2140 — Santos Dumont"]], clinicas: [["Clínica Triângulo Sul", "Rua Ituiutaba, 577 — São Benedito"], ["Clínica Uberaba", "Av. Santa Beatriz da Silva, 1880 — Santa Maria"]], diag: [["Diagnóstico Sete Colinas", "Av. Santa Beatriz da Silva, 1861 — São Benedito"]] },
      "Divinópolis": { hospitais: [["Hospital Santa Mônica", "Rua Pedro F. Amaral, 33 — Padre Libério"]], clinicas: [["Centro Clínico Divinópolis", "Av. Sete de Setembro, 951 — Centro"]], diag: [["Bioimagem Divinópolis", "Rua Rio de Janeiro, 101 — Centro"]] },
      "Poços de Caldas": { hospitais: [["Hospital Poços de Caldas", "Rua Frei Cristóvão de Figueiredo, 125 — Jardim Esmeralda"]] },
      "Varginha": { hospitais: [["Hospital Varginha", "Av. Antonieta Esper Kallas, 299 — Parque Mariela"]] },
      "Alfenas": { hospitais: [["Hospital Alfenas", "Rua Adolfo Engel, 19 — Jardim Tropical"]] },
      "Nova Serrana": { hospitais: [["Hospital Santa Mônica Nova Serrana", "Rua João Caetano Campos, 480 — Francisco Lucas"]] },
      "Ituiutaba": { clinicas: [["Clínica Ituiutaba", "Rua Vinte e Seis, 1547 — Centro"]] },
      "Montes Claros": { clinicas: [["Clínica Dr. Santos", "Rua Dr. Santos, 223, Sala 204 — Centro"]] }
    };
    var ORDER = ["Belo Horizonte", "Contagem", "Betim", "Uberlândia", "Uberaba", "Divinópolis", "Poços de Caldas", "Varginha", "Alfenas", "Nova Serrana", "Ituiutaba", "Montes Claros"];
    var COORDS = {
      "Montes Claros": [310, 105], "Belo Horizonte": [360, 235], "Contagem": [344, 229], "Betim": [331, 238],
      "Nova Serrana": [300, 245], "Divinópolis": [284, 262], "Uberlândia": [140, 240], "Uberaba": [156, 282],
      "Ituiutaba": [98, 258], "Varginha": [330, 320], "Alfenas": [298, 325], "Poços de Caldas": [258, 336]
    };
    var LABEL = { hospitais: "Hospitais", pa: "Prontos atendimentos", clinicas: "Clínicas", diag: "Diagnósticos" };
    var IC = {
      hospitais: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" width="16" height="16"><path d="M12 7v8M8 11h8"/><rect x="4" y="4" width="16" height="16" rx="3"/></svg>',
      pa: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" width="16" height="16"><path d="M12 21s7-6.2 7-11a7 7 0 0 0-14 0c0 4.8 7 11 7 11Z"/><path d="M12 7v6M9 10h6"/></svg>',
      clinicas: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" width="16" height="16"><path d="M4 21V9l8-6 8 6v12M9 21v-6h6v6"/></svg>',
      diag: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" width="16" height="16"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>'
    };
    var listEl = root.querySelector("#mgCities"), detEl = root.querySelector("#mgDetail"), ctaBtn = root.querySelector("#mgCta"), pinsEl = root.querySelector("#mgPins");
    var current = "";
    function total(c) { var d = CITIES[c], n = 0; ["hospitais", "pa", "clinicas", "diag"].forEach(function (k) { if (d[k]) n += d[k].length; }); return n; }
    function hasHosp(c) { return !!(CITIES[c].hospitais && CITIES[c].hospitais.length); }
    function buildPins() {
      if (!pinsEl) return;
      pinsEl.innerHTML = ORDER.map(function (c) {
        var p = COORDS[c]; if (!p) return "";
        return '<g class="mg-pin' + (hasHosp(c) ? " big" : "") + '" data-city="' + esc(c) + '" transform="translate(' + p[0] + "," + p[1] + ')" tabindex="0" role="button" aria-label="' + esc(c) + '">' +
          '<circle class="pin-halo" r="12"/><circle class="pin-dot" r="' + (hasHosp(c) ? 6.5 : 4.5) + '"/>' +
          '<text class="pin-lbl" y="-13">' + esc(c) + "</text></g>";
      }).join("");
      pinsEl.querySelectorAll(".mg-pin").forEach(function (g) {
        g.addEventListener("click", function () { select(g.getAttribute("data-city")); });
        g.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); select(g.getAttribute("data-city")); } });
      });
    }
    function renderList() {
      listEl.innerHTML = ORDER.map(function (c) { return '<button class="mg-city' + (c === current ? " on" : "") + '" data-city="' + esc(c) + '">' + esc(c) + '<span class="badge2">' + total(c) + "</span></button>"; }).join("");
      listEl.querySelectorAll(".mg-city").forEach(function (b) { b.addEventListener("click", function () { select(b.getAttribute("data-city")); }); });
    }
    function renderDetail() {
      var d = CITIES[current], html = "<h3>" + esc(current) + '</h3><div class="dsub">' + total(current) + " unidade(s) da rede própria Hapvida · MG</div>";
      ["hospitais", "pa", "clinicas", "diag"].forEach(function (k) {
        if (!d[k] || !d[k].length) return;
        html += '<div class="mg-group"><div class="gh">' + IC[k] + " " + LABEL[k] + " (" + d[k].length + ")</div>";
        d[k].forEach(function (u) { html += '<div class="mg-unit"><span class="ui">' + IC[k] + "</span><div><b>" + esc(u[0]) + "</b><span>" + esc(u[1]) + "</span></div></div>"; });
        html += "</div>";
      });
      detEl.innerHTML = html;
      if (ctaBtn) ctaBtn.setAttribute("data-msg", "Olá! Quero conhecer a rede Hapvida completa em " + current + " (MG) e fazer uma cotação.");
    }
    function highlightPin() { if (pinsEl) pinsEl.querySelectorAll(".mg-pin").forEach(function (g) { g.classList.toggle("on", g.getAttribute("data-city") === current); }); }
    function select(c) { current = c; renderList(); renderDetail(); highlightPin(); }
    if (ctaBtn) ctaBtn.addEventListener("click", function () { openWa(this.getAttribute("data-msg") || "Olá! Quero conhecer a rede Hapvida em Minas Gerais."); });
    buildPins(); select("Belo Horizonte");
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

  /* ---------- CONSTELAÇÃO DA REDE (atmosfera do hero) ---------- */
  (function () {
    var svg = document.getElementById("constel");
    if (!svg) return;
    // [x, y, éHospital(1/0)] — nós espalhados como uma rede própria
    var N = [[110, 130, 0], [250, 92, 1], [208, 250, 0], [382, 176, 0], [150, 360, 0], [330, 342, 0], [480, 112, 1], [560, 268, 0], [452, 400, 0], [660, 178, 0], [720, 330, 1], [880, 140, 0], [942, 300, 0], [1082, 206, 1], [1146, 110, 0], [1002, 420, 0], [300, 470, 0], [782, 452, 0]];
    var L = [[0, 1], [1, 3], [0, 2], [2, 4], [2, 5], [3, 6], [3, 7], [5, 7], [5, 8], [6, 9], [7, 9], [7, 10], [9, 11], [11, 12], [11, 13], [13, 14], [12, 15], [10, 12], [8, 16], [10, 17]];
    var s = "";
    L.forEach(function (p) { var a = N[p[0]], b = N[p[1]]; s += '<line x1="' + a[0] + '" y1="' + a[1] + '" x2="' + b[0] + '" y2="' + b[1] + '"/>'; });
    N.forEach(function (n) {
      if (n[2]) s += '<circle class="halo" cx="' + n[0] + '" cy="' + n[1] + '" r="6" style="animation-delay:' + (Math.random() * 3).toFixed(2) + 's"/>';
      s += '<circle class="' + (n[2] ? "pn" : "") + '" cx="' + n[0] + '" cy="' + n[1] + '" r="' + (n[2] ? 4.6 : 2.6) + '"/>';
    });
    svg.innerHTML = s;
  })();

  if (document.querySelector(".mcta")) document.body.classList.add("has-mcta");
})();
