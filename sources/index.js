import "./arena/style.css";
import { projects, career, stations } from "./arena/content.js";
import { Sound } from "./arena/Sound.js";

const $ = (selector) => document.querySelector(selector);
const sound = new Sound();
const visited = new Set();
const dialog = $("#exhibit-dialog");
let arena,
  currentExhibit,
  activeProject = 0,
  toastTimer,
  priorFocus;

function updateSound() {
  $("#sound-label").textContent = `SOUND ${sound.enabled ? "ON" : "OFF"}`;
  $("#sound-button").setAttribute("aria-pressed", sound.enabled);
  $("#sound-button").setAttribute(
    "aria-label",
    `Turn sound ${sound.enabled ? "off" : "on"}`,
  );
  $("#sound-button").classList.toggle("is-muted", !sound.enabled);
}
updateSound();
$("#sound-button").addEventListener("click", () => {
  sound.toggle();
  updateSound();
});
document.addEventListener("visibilitychange", () =>
  document.hidden ? sound.suspend() : sound.resume(),
);

function toast(message) {
  clearTimeout(toastTimer);
  $("#toast").textContent = message;
  $("#toast").hidden = false;
  toastTimer = setTimeout(() => {
    $("#toast").hidden = true;
  }, 4000);
}

function projectMarkup() {
  const p = projects[activeProject];
  return `<div class="project-tabs" role="group" aria-label="Select a project">${projects.map((p, i) => `<button data-project="${i}" class="${i === activeProject ? "active" : ""}" aria-pressed="${i === activeProject}">${p.name}</button>`).join("")}</div><div class="project-image"><img src="${p.image}" alt="${p.name} project screenshot"><span>${p.type}</span></div><div class="project-detail"><h3>${p.name}</h3><p>${p.description}</p><div class="tags">${p.tags.map((tag) => `<span>${tag}</span>`).join("")}</div><a class="text-link" href="${p.url}" target="_blank" rel="noopener noreferrer">${p.link}<span>↗</span></a></div>`;
}

function exhibitMarkup(id) {
  if (id === "work")
    return `<div class="exhibit-heading"><span class="eyebrow">SELECTED WORK / 2025—2026</span><h2 id="exhibit-title">BUILT TO<br>DO SOMETHING.</h2><p>Desktop tools, GPU systems, and full-stack experiments. <br>Things I’ve put my hands on.</p></div><div id="project-content">${projectMarkup()}</div>`;
  if (id === "story")
    return `<div class="exhibit-heading"><span class="eyebrow">A FEW ROUNDS IN</span><h2 id="exhibit-title">THE STORY<br>SO FAR.</h2><p>I like building things that work under real conditions. <br>Here’s where I’ve been learning to do that.</p></div><div class="career-list">${career.map((c) => `<article><span class="career-date">${c.date}</span><h3>${c.company}</h3><span class="career-role">${c.title}</span><p>${c.detail}</p></article>`).join("")}</div>`;
  if (id === "life")
    return `<div class="exhibit-heading"><span class="eyebrow">THE PERSON BEHIND THE PROJECTS</span><h2 id="exhibit-title">OFF THE MAT.<br>STILL ME.</h2><p>When I’m not building, I’m in the gym, playing sports, <br>or spending time with the people who matter.</p></div><div class="life-gallery"><figure class="life-wide"><img src="/projects/wrestling.png" alt="Ayush competing in a wrestling match"><figcaption><strong>2× ALL-STATE</strong><span>Show up. Put in the reps. Do it again.</span></figcaption></figure><figure><img src="/MEandMom.jpg" alt="Ayush and his mom"><figcaption><strong>ME & MOM</strong><span>The original support system.</span></figcaption></figure><figure><video controls playsinline preload="none" poster="/315bench-poster.jpg" src="/315bench.mp4" aria-label="Ayush bench pressing 315 pounds"></video><figcaption><strong>315 CLUB</strong><span>A few more reps outside the editor.</span></figcaption></figure></div>`;
  return `<div class="exhibit-heading"><span class="eyebrow">GOOD WORK STARTS WITH A CONVERSATION</span><h2 id="exhibit-title">IN YOUR<br>CORNER.</h2><p>A project, an opportunity, or just a good conversation. <br>I’m always up for building something worth the effort.</p></div><a class="contact-email" href="mailto:ayushkun@umich.edu"><span>DROP ME A LINE</span><strong>ayushkun@<br>umich.edu</strong><span class="contact-arrow">↗</span></a><div class="contact-links"><a href="https://github.com/atkunja" target="_blank" rel="noopener noreferrer"><span>01 / GITHUB</span><strong>@atkunja</strong><span>↗</span></a><a href="https://linkedin.com/in/ayushkunjadia/" target="_blank" rel="noopener noreferrer"><span>02 / LINKEDIN</span><strong>Ayush Kunjadia</strong><span>↗</span></a></div><p class="contact-signoff">THANKS FOR STEPPING INTO THE FIELDHOUSE.<span>— Ayush</span></p>`;
}

function openExhibit(id) {
  if (!stations.some((s) => s.id === id)) return;
  currentExhibit = id;
  priorFocus = document.activeElement;
  const s = stations.find((s) => s.id === id);
  $("#exhibit-index").textContent = `${s.number} / ${s.label}`;
  $("#exhibit-content").innerHTML = exhibitMarkup(id);
  visited.add(id);
  $("#visit-count").textContent = `${visited.size} / 4 VISITED`;
  $(`[data-visit="${id}"]`).classList.add("visited");
  $(`[data-hotspot="${id}"]`).classList.add("visited");
  arena.cancelRoute();
  arena.setPaused(true);
  dialog.showModal();
  document.body.classList.add("exhibit-open");
  dialog.scrollTop = 0;
  $("#close-exhibit").focus();
  sound.play();
}

function closeExhibit() {
  dialog.querySelectorAll("video").forEach((video) => video.pause());
  dialog.close();
  document.body.classList.remove("exhibit-open");
  arena?.setPaused(false);
  priorFocus?.focus({ preventScroll: true });
}
$("#close-exhibit").addEventListener("click", closeExhibit);
dialog.addEventListener("cancel", (event) => {
  event.preventDefault();
  closeExhibit();
});
dialog.addEventListener("click", (event) => {
  if (
    event.target === dialog &&
    event.clientX < dialog.getBoundingClientRect().left
  )
    closeExhibit();
});
$("#next-exhibit").addEventListener("click", () => {
  const index = stations.findIndex((s) => s.id === currentExhibit);
  closeExhibit();
  arena.visit(stations[(index + 1) % stations.length].id);
});
$("#exhibit-content").addEventListener("click", (event) => {
  const button = event.target.closest("[data-project]");
  if (!button) return;
  activeProject = Number(button.dataset.project);
  $("#project-content").innerHTML = projectMarkup();
  $(`[data-project="${activeProject}"]`).focus();
  sound.play();
});

stations.forEach((s) => {
  const button = document.createElement("button");
  button.className = "hotspot";
  button.dataset.hotspot = s.id;
  button.setAttribute("aria-label", `Walk to ${s.title}`);
  button.innerHTML = `<span class="hotspot-number">${s.number}</span><span class="hotspot-name">${s.label}<span>EXPLORE ↗</span></span>`;
  button.addEventListener("click", () => {
    arena.visit(s.id);
    sound.play();
  });
  $("#hotspots").append(button);
});
document.querySelectorAll("[data-visit]").forEach((button) =>
  button.addEventListener("click", () => {
    arena.visit(button.dataset.visit);
    sound.play();
  }),
);

$("#enter-button").addEventListener("click", () => {
  if (!arena) return;
  document.body.classList.add("playing");
  $("#chooser").inert = true;
  sound.start();
  arena.enter();
  setTimeout(() => {
    $("#chooser").hidden = true;
  }, 850);
});
$("#home-button").addEventListener("click", () => {
  if (!document.body.classList.contains("playing")) return;
  closeExhibit();
  arena.cancelRoute();
  arena.mode = "gate";
  arena.player.root.position.set(-0.85, 0.17, 0);
  arena.player.root.rotation.set(0, Math.PI / 2, 0);
  arena.opponent.root.position.set(0.75, 0.17, 0);
  arena.opponent.root.rotation.set(0, -Math.PI / 2, 0);
  arena.playerHalo.visible = false;
  $("#chooser").hidden = false;
  $("#chooser").inert = false;
  document.body.classList.remove("playing", "cinematic");
  $("#score-pop").classList.remove("show");
  $("#toast").hidden = true;
  $("#game-ui").hidden = true;
  $("#cinematic-ui").hidden = true;
  $("#enter-button").focus();
});
$("#practice-button").addEventListener("click", () => arena.practice());
$("#camera-button").addEventListener("click", () => arena.toggleCamera());
$("#skip-button").addEventListener("click", () => arena.finishEntrance());
$("#interact-button").addEventListener("click", () => arena.interact());
$("#retry-button").addEventListener("click", () => location.reload());

async function boot() {
  try {
    const [{ Arena }] = await Promise.all([
      import("./arena/Arena.js"),
      document.fonts.ready,
    ]);
    await Promise.all([
      document.fonts.load('700 16px "Barlow Condensed"'),
      document.fonts.load('400 16px "DM Sans"'),
    ]);
    arena = new Arena($("#arena-view"), {
      onCinematic: (active) => {
        document.body.classList.toggle("cinematic", active);
        $("#cinematic-ui").hidden = !active;
        $("#game-ui").hidden = active;
      },
      onReady: () => {
        $("#game-ui").hidden = false;
        toast("You’re in. Click the mat to walk, or choose an exhibit below.");
        arena.renderer.domElement.focus({ preventScroll: true });
      },
      onStation: openExhibit,
      onCamera: (close) => {
        $("#camera-label").textContent = close ? "Arena view" : "Closer look";
        $("#camera-button").setAttribute("aria-pressed", close);
      },
      onHint: toast,
      onImpact: (score) => {
        sound.play("impact");
        $("#score").textContent = String(score).padStart(2, "0");
        $("#score-pop").innerHTML =
          "<strong>+5</strong><span>COMMITMENT PAYS OFF.</span>";
        $("#score-pop").classList.remove("show");
        requestAnimationFrame(() => $("#score-pop").classList.add("show"));
        setTimeout(() => $("#score-pop").classList.remove("show"), 2200);
      },
      onRoute: (title) => {
        $("#route-status").hidden = !title;
        $("#route-status").textContent = title ? `ON THE WAY / ${title}` : "";
      },
      onMove: () => {
        $("#toast").hidden = true;
      },
      onNear: (id) => {
        $("#interact-button").hidden = !id;
        if (id)
          $("#interact-button").innerHTML =
            `${stations.find((s) => s.id === id).title} <kbd>E</kbd>`;
      },
      onProject: (items) =>
        items.forEach((item) => {
          const node = $(`[data-hotspot="${item.id}"]`);
          node.style.transform = `translate(${item.x}px, ${item.y}px) translate(-50%, -100%)`;
          node.style.visibility = item.visible ? "" : "hidden";
        }),
    });
    $("#load-label").textContent = "Enter the fieldhouse";
    $("#enter-button").disabled = false;
    document.body.classList.add("arena-ready");
    // A compact, read-only diagnostic snapshot supports repeatable smoke tests.
    window.fieldhouse = Object.freeze({
      snapshot: () => ({
        mode: arena.mode,
        position: { x: arena.position.x, z: arena.position.z },
        score: arena.score,
        visited: [...visited],
        drawCalls: arena.renderer.info.render.calls,
        triangles: arena.renderer.info.render.triangles,
      }),
    });
  } catch (error) {
    console.error("Fieldhouse initialization failed", error);
    $("#load-label").textContent = "Arena unavailable";
    $("#webgl-fallback").hidden = false;
  }
}
boot();
