/*******************************
 * Konfigurationsparametrar
 *******************************/
const CONFIG = {
  countdownTargetDate: "2025-05-01T00:00:00", // Exempelmåldatum
  introDuration: 6000,           // 0–6 s: Intro-text
  delayAfterIntro: 2000,         // 6–8 s: Vänta tills logotypen ska starta
  logoAnimationDuration: 12000,  // Från t=8 s till t=20 s (12 s)
  bgMusic: 11500,
  crawlDuration: 30000,          // Från t=19 s till t=49 s (30 s)
  planetDuration: 8000,          // Från t=49 s till t=57 s (8 s)
  finalFadeDuration: 3000        // Från t=57 s och framåt
};

/*******************************
 * Hjälpfunktioner
 *******************************/
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/*******************************
 * Nedräkningstimer
 *******************************/
function updateCountdown() {
  const countdownElement = document.getElementById("countdown");
  const targetDate = new Date(CONFIG.countdownTargetDate);
  const now = new Date();
  const diff = targetDate - now;
  if (diff <= 0) {
    countdownElement.textContent = "The day has arrived!";
    return;
  }
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);
  countdownElement.textContent = `${days}d ${hours}h ${minutes}m ${seconds}s`;
  setTimeout(updateCountdown, 1000);
}

/*******************************
 * Huvudsekvens: startIntro
 *******************************/
async function startIntro() {
  // 1. Dölj startknappen
  document.getElementById("start-button").style.display = "none";

  // 2. Visa intro-texten (0–6 s)
  const introText = document.getElementById("intro-text");
  introText.style.display = "block";
  await sleep(CONFIG.introDuration);  // 6000 ms
  introText.style.display = "none";

  // 3. Vänta extra 2 s tills t=8 s (totalt 8 s från start)
  await sleep(CONFIG.delayAfterIntro);

  // 4. Vid t=8 s: Visa logotypen och starta bakgrundsmusiken
  const logo = document.getElementById("logo");
  const bgMusic = document.getElementById("bgMusic");
  logo.style.display = "block";
  try {
    bgMusic.currentTime = 0;
    bgMusic.play();
  } catch (error) {
    console.error("Audio playback failed:", error);
  }

  // 5. Vänta 8 s (nu t=16 s) – logotypen är kvar tills crawl ska börja
  await sleep(8000);  // ändrat från tidigare 11 s till 8 s

  // 6. Vid t=16 s: Visa crawl-texten (ändrar starttiden för crawlen)
  const crawlContainer = document.getElementById("crawl-container");
  crawlContainer.style.display = "block";

  // 7. Vänta 4 s (nu t=20 s) och dölj logotypen (så att logotypen visas mellan t=8 och t=20 s)
  await sleep(4000);
  logo.style.display = "none";

  // 8. Låt crawl-texten animera från t=16 s till t=46 s (30 s varaktighet; du kan också justera detta om du vill)
  await sleep(CONFIG.crawlDuration);

  // 9. Vid t=46 s: Visa planet-effekten (justera tidpunkten vid behov)
  const planetEffect = document.getElementById("planet-effect");
  planetEffect.style.display = "block";
  await sleep(CONFIG.planetDuration);

  // 10. Vid t=54 s: Visa final text och knappar (fade-in styrs av CSS)
  const mainTitle = document.getElementById("main-title");
  const buttons = document.getElementById("buttons");
  mainTitle.style.display = "block";
  buttons.style.display = "block";
  buttons.style.opacity = "1";
}

/*******************************
 * Ljudfunktioner
 *******************************/
function playSound(file) {
  const soundPlayer = document.getElementById("soundPlayer");
  soundPlayer.pause();
  soundPlayer.currentTime = 0;
  soundPlayer.src = `static/sounds/${file}`;
  soundPlayer.play().catch(error => {
    console.error("Sound playback error:", error);
  });
}

document.querySelectorAll("#buttons .btn").forEach(button => {
  button.addEventListener("click", () => {
    const soundFile = button.dataset.sound;
    if (soundFile) {
      playSound(soundFile);
    }
  });
});

/*******************************
 * Event Listeners & Initiering
 *******************************/
document.getElementById("start-button").addEventListener("click", startIntro);
updateCountdown();