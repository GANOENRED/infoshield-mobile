const toggle = document.getElementById('toggleProtection');
const status = document.getElementById('status');
const wordsInput = document.getElementById('wordsInput');
const saveWords = document.getElementById('saveWords');
const iframe = document.getElementById('webview');
const urlInput = document.getElementById('urlInput');
const goBtn = document.getElementById('goBtn');
const panel = document.getElementById('panelFlotante');

// ===== Estado =====
let activo = JSON.parse(localStorage.getItem('infoshieldActivo')) || false;
let blockedWords = JSON.parse(localStorage.getItem('blockedWords')) || ["bitcoin", "casino"];

toggle.checked = activo;
wordsInput.value = blockedWords.join(",");
status.textContent = activo ? "Protección activada" : "Protección desactivada";

// ===== Guardar palabras =====
saveWords.onclick = () => {
  blockedWords = wordsInput.value.split(",").map(w => w.trim());
  localStorage.setItem("blockedWords", JSON.stringify(blockedWords));
  alert("Palabras guardadas");
};

// ===== Toggle =====
toggle.onchange = () => {
  activo = toggle.checked;
  localStorage.setItem("infoshieldActivo", activo);
  status.textContent = activo ? "Protección activada" : "Protección desactivada";
};

// ===== Navegación =====
goBtn.onclick = () => {
  let url = urlInput.value;
  if (!url.startsWith("http")) {
    url = "https://" + url;
  }
  iframe.src = url;
};

// ===== Bloqueo dentro del iframe =====
iframe.onload = () => {
  if (!activo) return;

  try {
    const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
    let html = iframeDoc.body.innerHTML;

    blockedWords.forEach(word => {
      const regex = new RegExp(word, "gi");
      html = html.replace(regex, "****");
    });

    iframeDoc.body.innerHTML = html;

  } catch (e) {
    console.log("No se puede modificar esta página por políticas CORS.");
  }
};

// ===== Panel draggable (móvil real) =====
let offsetX, offsetY, isDragging = false;

panel.addEventListener("touchstart", e => {
  isDragging = true;
  offsetX = e.touches[0].clientX - panel.offsetLeft;
  offsetY = e.touches[0].clientY - panel.offsetTop;
});

panel.addEventListener("touchmove", e => {
  if (!isDragging) return;
  panel.style.left = e.touches[0].clientX - offsetX + "px";
  panel.style.top = e.touches[0].clientY - offsetY + "px";
});

panel.addEventListener("touchend", () => {
  isDragging = false;
});

