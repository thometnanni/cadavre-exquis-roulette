import { DRAWINGS } from "./manifest.js";

const reels = [...document.querySelectorAll(".reel")];
const spinBtn = document.querySelector("#spin");

const len = 4; // how many drawings scroll past before landing
const ease = "cubic-bezier(0.12, 0.85, 0.15, 1)";

function randomOf(cat) {
  const list = DRAWINGS[cat];
  return list[Math.floor(Math.random() * list.length)];
}

function imgEl(cat, name) {
  const img = document.createElement("img");
  img.src = `drawings/${cat}/${name}`;
  return img;
}

function setReelHeight(reel) {
  reel.querySelector(".strip").style.setProperty("--reel-h", `${reel.clientHeight}px`);
}

for (const reel of reels) {
  const cat = reel.dataset.cat;
  const strip = reel.querySelector(".strip");
  setReelHeight(reel);
  strip.appendChild(imgEl(cat, randomOf(cat)));
}

function spinReel(reel, delay, duration) {
  const cat = reel.dataset.cat;
  const strip = reel.querySelector(".strip");

  return new Promise((resolve) => {
    setTimeout(() => {
      const reelHeight = reel.clientHeight;
      setReelHeight(reel);

      const names = Array.from({ length: len }, () => randomOf(cat));
      strip.style.transition = "none";
      strip.style.transform = "translateY(0)";
      strip.innerHTML = "";
      for (const name of names) strip.appendChild(imgEl(cat, name));

      reel.classList.add("spinning");

      // force reflow so the transition below actually animates
      void strip.offsetHeight;

      strip.style.transition = `transform ${duration}ms ${ease}`;
      strip.style.transform = `translateY(-${(len - 1) * reelHeight}px)`;

      setTimeout(() => {
        reel.classList.remove("spinning");
        resolve();
      }, duration);
    }, delay);
  });
}

async function spin() {
  spinBtn.disabled = true;
  spinBtn.classList.add("spinning");

  await Promise.all(
    reels.map((reel, i) => spinReel(reel, i * 150, 1400 + i * 300)),
  );

  spinBtn.classList.remove("spinning");
  spinBtn.disabled = false;
}

spinBtn.addEventListener("click", spin);
