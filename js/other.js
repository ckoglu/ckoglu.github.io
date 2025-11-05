function initializeTooltip() {
  let currentTooltipEl = null;
  let currentTargetEl = null;

  const showTooltip = (el) => {
    const tooltipText = el.dataset.tooltipTop || el.dataset.tooltipBottom || el.dataset.tooltipRight || el.dataset.tooltipLeft;
    if (!tooltipText) return;

    const tooltip = document.createElement("div");
    tooltip.className = "tooltip";
    tooltip.textContent = tooltipText;

    // Stil (dilersen CSS'te tanımla)
    tooltip.style.position = "fixed";
    tooltip.style.zIndex = "10000";
    tooltip.style.padding = "calc(var(--padding)/15) calc(var(--padding)/3)";
    tooltip.style.background = "var(--black-clr)";
    tooltip.style.color = "var(--white-clr)";
    tooltip.style.fontSize = "calc(var(--font-size) - 2px)";
    tooltip.style.fontWeight = "400";
    tooltip.style.pointerEvents = "none";
    tooltip.style.whiteSpace = "nowrap";

    document.body.appendChild(tooltip);

    // Pozisyon hesapla
    const rect = el.getBoundingClientRect();
    const offset = 8;

    if (el.hasAttribute("data-tooltip-bottom")) {
      // Altına, ortalayarak
      tooltip.style.top = `${rect.bottom + offset}px`;
      tooltip.style.left = `${rect.left + (rect.width - tooltip.offsetWidth) / 2}px`;
    } else if (el.hasAttribute("data-tooltip-top")) {
      // Üstüne, ortalayarak
      tooltip.style.top = `${rect.top - tooltip.offsetHeight - offset}px`;
      tooltip.style.left = `${rect.left + (rect.width - tooltip.offsetWidth) / 2}px`;
    } else if (el.hasAttribute("data-tooltip-right")) {
      // Sağında, ortalayarak
      tooltip.style.top = `${rect.top + (rect.height - tooltip.offsetHeight) / 2}px`;
      tooltip.style.left = `${rect.right + offset}px`;
    } else if (el.hasAttribute("data-tooltip-left")) {
      // Solunda, ortalayarak
      tooltip.style.top = `${rect.top + (rect.height - tooltip.offsetHeight) / 2}px`;
      tooltip.style.left = `${rect.left - tooltip.offsetWidth - offset}px`;
    }

    currentTooltipEl = tooltip;
    currentTargetEl = el;
  };

  const hideTooltip = () => {
    if (currentTooltipEl) {
      currentTooltipEl.remove();
      currentTooltipEl = null;
      currentTargetEl = null;
    }
  };

  // Hover ile göster
  document.addEventListener(
    "mouseenter",
    (e) => {
      const el = e.target;
      if (
        el.nodeType === Node.ELEMENT_NODE &&
        el.matches("[data-tooltip-bottom], [data-tooltip-right], [data-tooltip-left], [data-tooltip-top]")
      ) {
        el.tooltipTimeout = setTimeout(() => showTooltip(el), 500);
      }
    },
    true
  );

  // Mouse çıkınca gizle
  document.addEventListener(
    "mouseleave",
    (e) => {
      const el = e.target;
      if (
        el.nodeType === Node.ELEMENT_NODE &&
        el.matches("[data-tooltip-bottom], [data-tooltip-right], [data-tooltip-left], [data-tooltip-top]")
      ) {
        clearTimeout(el.tooltipTimeout);
        hideTooltip();
      }
    },
    true
  );

  // Scroll ile tooltip konumunu güncelle
  window.addEventListener("scroll", () => {
    if (!currentTooltipEl || !currentTargetEl) return;

    const el = currentTargetEl;
    const tooltip = currentTooltipEl;
    const rect = el.getBoundingClientRect();
    const offset = 8;

    if (el.hasAttribute("data-tooltip-bottom")) {
      tooltip.style.top = `${rect.bottom + offset}px`;
      tooltip.style.left = `${rect.left + (rect.width - tooltip.offsetWidth) / 2}px`;
    } else if (el.hasAttribute("data-tooltip-top")) {
      tooltip.style.top = `${rect.top - tooltip.offsetHeight - offset}px`;
      tooltip.style.left = `${rect.left + (rect.width - tooltip.offsetWidth) / 2}px`;
    } else if (el.hasAttribute("data-tooltip-right")) {
      tooltip.style.top = `${rect.top + (rect.height - tooltip.offsetHeight) / 2}px`;
      tooltip.style.left = `${rect.right + offset}px`;
    } else if (el.hasAttribute("data-tooltip-left")) {
      tooltip.style.top = `${rect.top + (rect.height - tooltip.offsetHeight) / 2}px`;
      tooltip.style.left = `${rect.left - tooltip.offsetWidth - offset}px`;
    }
  });
}
initializeTooltip();

function showToast(icon="info", message, type="info") {
  const container = document.getElementById("toastContainer");
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.innerHTML = `<data size="1"><i icon="${icon}"></i></data><span class="toast-message">${message}</span>`;
  container.appendChild(toast);
  setTimeout(() => toast.classList.add("show"), 50);
  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 400);
  }, 5000);
}

document.addEventListener('click', (e) => {
  if (e.target.closest('[role="top-scroll"]')) {window.scrollTo({ top: 0, behavior: 'smooth' });}
});