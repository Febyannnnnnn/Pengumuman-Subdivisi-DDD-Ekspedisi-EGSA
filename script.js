const data = {
  "nanda": { name: "Nanda", role: "Subdivisi Desain" },
  "tsaqif": { name: "Tsaqif", role: "Subdivisi Desain" },
  "fio": { name: "Fio", role: "Subdivisi Desain" },
  "rafferty": { name: "Rafferty", role: "Subdivisi Dokumentasi" },
  "kamal": { name: "Kamal", role: "Subdivisi Editing" },
  "seno": { name: "Seno", role: "Subdivisi Editing" }
};

const form = document.getElementById("formNama");
const inputNama = document.getElementById("nama");
const hasil = document.getElementById("hasil");
const confettiLayer = document.getElementById("confettiLayer");

form.addEventListener("submit", function (event) {
  event.preventDefault();
  cekHasil();
});

function cekHasil() {
  const key = inputNama.value.trim().toLocaleLowerCase("id-ID");
  const person = data[key];

  hasil.classList.remove("show");
  if (!key) {
    hasil.innerHTML = '<p class="explain">Masukkan nama depanmu terlebih dahulu, ya.</p>';
    hasil.classList.add("show");
    return;
  }

  if (!person) {
    hasil.innerHTML = '<p class="explain">Nama belum ditemukan. Coba periksa ejaan nama depanmu, ya. 🌿</p>';
    hasil.classList.add("show");
    playDing(false);
    return;
  }

  hasil.innerHTML = `
    <p class="congrats">🎉 Selamat! 🎉</p>
    <p class="explain">Berdasarkan hasil diskusi dan pertimbangan, kamu ditetapkan sebagai:</p>
    <p class="person">${escapeHTML(person.name)}</p>
    <p class="role">${escapeHTML(person.role)}</p>
    <p class="explain">Subdivisi DDD Ekspedisi EGSA 2027</p>
    <p class="wish">✨ Semoga amanah ini dapat dijalankan dengan baik dan penuh tanggung jawab.</p>
  `;
  hasil.classList.add("show");
  launchConfetti();
  playDing(true);
}

function escapeHTML(text) {
  return text.replace(/[&<>"']/g, function (char) {
    return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char];
  });
}

function launchConfetti() {
  const colors = ["#860021", "#f8c246", "#78c4ae", "#125494", "#2e774f", "#fff7d0"];
  for (let i = 0; i < 95; i++) {
    const piece = document.createElement("span");
    piece.className = "confetti-piece";
    piece.style.left = Math.random() * 100 + "%";
    piece.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    piece.style.setProperty("--fall-time", (2.2 + Math.random() * 2.2) + "s");
    piece.style.setProperty("--drift", (Math.random() * 240 - 120) + "px");
    piece.style.setProperty("--spin", (Math.random() * 1000 - 500) + "deg");
    piece.style.borderRadius = Math.random() > .5 ? "50%" : "1px";
    confettiLayer.appendChild(piece);
    piece.addEventListener("animationend", () => piece.remove(), { once: true });
  }
}

// Ding dibuat langsung dengan Web Audio agar tidak bergantung pada tautan MP3 eksternal.
// Audio baru dijalankan setelah klik pengguna, sesuai aturan autoplay browser.
function playDing(success) {
  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const now = ctx.currentTime;
    const notes = success ? [659.25, 783.99, 987.77] : [523.25];
    notes.forEach((frequency, index) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const start = now + index * 0.12;
      osc.type = "sine";
      osc.frequency.setValueAtTime(frequency, start);
      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.exponentialRampToValueAtTime(0.13, start + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.42);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(start);
      osc.stop(start + 0.44);
    });
    window.setTimeout(() => ctx.close(), 1200);
  } catch (error) {
    // Website tetap berjalan walaupun browser tidak mengizinkan audio.
  }
}
