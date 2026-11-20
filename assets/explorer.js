(() => {
  "use strict";
  const samples = {"banca":[{"group":"","values":[10,2270000,0.8],"bars":[8,2]},{"group":"Cursos Pym","values":[2,530000,1.0],"bars":[2,0]},{"group":"Logistica Centro","values":[0,null,null],"bars":[0,0]},{"group":"Papelera Norte","values":[3,430000,0.6666666666666666],"bars":[2,1]},{"group":"Servicios Del Sur","values":[1,310000,1.0],"bars":[1,0]},{"group":"Walmart De México","values":[4,1000000,0.75],"bars":[3,1]}],"cafeteria":[{"group":"","values":[81,13,30],"bars":[28,40,13]},{"group":"Enero","values":[42,7,18],"bars":[19,23,0]},{"group":"Febrero","values":[34,5,11],"bars":[4,17,13]},{"group":"Sin fecha","values":[5,1,1],"bars":[5,0,0]}],"marketing":[{"group":"","values":[18,9,0.3],"bars":[18,42]},{"group":"Oferta 1","values":[5,5,0.4166666666666667],"bars":[5,7]},{"group":"Oferta 2","values":[3,3,0.25],"bars":[3,9]},{"group":"Oferta 3","values":[3,3,0.25],"bars":[3,9]},{"group":"Oferta 4","values":[4,4,0.3333333333333333],"bars":[4,8]},{"group":"Oferta 5","values":[3,3,0.25],"bars":[3,9]},{"group":"Oferta 6: sin historial","values":[null,null,null],"bars":[0,0]}]};
  const project = {
    banca: {
      filter: "Empresa", all: "Todas las empresas",
      labels: ["Créditos vigentes", "Monto vigente informado", "Cobertura de monto"],
      units: ["", "MXN", "%"],
      title: "Créditos vigentes por calidad del monto",
      bars: ["Con monto", "Sin monto"], barUnit: "",
      note: "La cobertura indica qué proporción de los créditos vigentes tiene un monto informado.",
      empty: "La empresa está en el catálogo y carece de operaciones vigentes."
    },
    cafeteria: {
      filter: "Periodo", all: "Todos los periodos",
      labels: ["Ingreso conocido", "Ventas conservadas", "Piezas con cantidad conocida"],
      units: ["UM", "", ""],
      title: "Ingreso por modalidad de venta",
      bars: ["En el local", "Para llevar", "Sin identificar"], barUnit: "UM",
      note: "UM significa unidades monetarias. El ingreso incluye los tickets con importe conocido, incluso si falta la cantidad."
    },
    marketing: {
      filter: "Campaña", all: "Todas las campañas",
      labels: ["Aceptaciones", "Hogares que aceptaron", "Tasa de aceptación"],
      units: ["", "", "%"],
      title: "Respuestas registradas",
      bars: ["Aceptadas", "Sin aceptación"], barUnit: "",
      note: "Un hogar puede aceptar varias campañas. La tasa divide las aceptaciones entre todas las respuestas del filtro.",
      empty: "Esta oferta figura en el catálogo. Todavía carece de respuestas registradas."
    }
  };
  const number = new Intl.NumberFormat("es-MX",{maximumFractionDigits:1});
  const percent = new Intl.NumberFormat("es-MX",{style:"percent",maximumFractionDigits:1});
  function format(value,unit) {
    if (value === null) return "—";
    return unit === "%" ? percent.format(value) : number.format(value) + (unit ? " " + unit : "");
  }
  function node(tag,style,value) {
    const element = document.createElement(tag);
    if (style) element.className = style;
    if (value !== undefined) element.textContent = value;
    return element;
  }
  function mount(element,slug) {
    const config = project[slug], options = samples[slug];
    if (!element || !config) return;
    const panel = node("div","px-panel");
    const label = node("label","px-filter");
    const select = node("select","px-select");
    options.forEach((entry, i) => select.append(new Option(entry.group || config.all,String(i))));
    label.append(node("span","px-label","Filtrar por " + config.filter.toLowerCase()),select);
    const summary = node("div","px-summary");
    summary.setAttribute("role","status");
    summary.setAttribute("aria-live","polite");
    summary.setAttribute("aria-atomic","true");
    const chart = node("div","px-chart"), note = node("p","px-note");
    panel.append(label,summary,chart,note);
    function update() {
      const entry = options[Number(select.value)];
      const quantity = entry.bars.reduce((a,b) => a+b,0);
      const cards = config.labels.map((name,i) => {
        const card = node("div","px-stat");
        card.append(node("span","px-name",name),node("strong","px-number",format(entry.values[i],config.units[i])));
        return card;
      });
      summary.replaceChildren(...cards);
      const chartHeader = node("div","px-chart-title",config.title);
      const bars = quantity ? config.bars.map((name,i) => {
        const line = node("div","px-bar-row");
        const track = node("div","px-track"), fill = node("span","px-fill");
        fill.style.width = (entry.bars[i]/quantity*100) + "%";
        track.setAttribute("aria-hidden","true");
        track.append(fill);
        line.append(node("span","px-bar-label",name),track,node("strong","px-bar-value",format(entry.bars[i],config.barUnit)));
        return line;
      }) : [];
      chart.replaceChildren(chartHeader,...bars);
      note.textContent = quantity ? config.note : config.empty;
    }
    select.addEventListener("change",update);
    element.replaceChildren(panel);
    update();
  }
  window.PyMExplorer = Object.freeze({mount});
})();
