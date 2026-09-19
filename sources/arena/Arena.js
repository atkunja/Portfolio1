import * as THREE from "three";
import { Venue } from "./Venue.js";
import { Wrestler } from "./Wrestler.js";
import { stations } from "./content.js";
import { sampleExchange, EXCHANGE_DURATION, IMPACT_TIME } from "./exchange.js";

const ease = (t) => t * t * (3 - 2 * t);
const clamp = THREE.MathUtils.clamp;
const mix = THREE.MathUtils.lerp;

export class Arena {
  constructor(element, callbacks) {
    this.element = element;
    this.callbacks = callbacks;
    this.mode = "gate";
    this.keys = new Set();
    this.position = new THREE.Vector3(-0.85, 0.17, 0);
    this.destination = null;
    this.arrival = null;
    this.score = 0;
    this.motion = 0;
    this.zoom = 1;
    this.time = 0;
    this.reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color("#111e26");
    this.scene.fog = new THREE.FogExp2("#111e26", 0.013);
    this.camera = new THREE.PerspectiveCamera(42, 1, 0.1, 140);
    this.camera.position.set(28, 25, 36);
    this.cameraTarget = new THREE.Vector3(0, 0, -2);
    this.desiredCamera = new THREE.Vector3();
    this.desiredTarget = new THREE.Vector3();
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: "high-performance",
    });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.6));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFShadowMap;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.05;
    this.renderer.domElement.setAttribute(
      "aria-label",
      "Interactive wrestling arena. Move with WASD or arrow keys, or click the mat.",
    );
    this.renderer.domElement.setAttribute("tabindex", "0");
    element.appendChild(this.renderer.domElement);
    this.venue = new Venue(this.scene);
    this.player = new Wrestler();
    this.opponent = new Wrestler({
      color: "#d7d0b9",
      accent: "#8e9a99",
      skin: "#c18e6d",
      number: "02",
    });
    this.scene.add(this.player.root, this.opponent.root);
    this.player.root.position.copy(this.position);
    this.player.root.rotation.y = Math.PI / 2;
    this.opponent.root.position.set(0.75, 0.17, 0);
    this.opponent.root.rotation.y = -Math.PI / 2;
    this.raycaster = new THREE.Raycaster();
    this.pointer = new THREE.Vector2();
    this.point = new THREE.Vector3();
    this.buildDestination();
    this.bind();
    this.resize();
    this.lastTime = performance.now();
    this.renderer.setAnimationLoop(this.tick.bind(this));
  }

  buildDestination() {
    this.destinationMarker = new THREE.Mesh(
      new THREE.RingGeometry(0.19, 0.24, 32),
      new THREE.MeshBasicMaterial({
        color: "#f4e3bd",
        transparent: true,
        opacity: 0.8,
        depthWrite: false,
      }),
    );
    this.destinationMarker.rotation.x = -Math.PI / 2;
    this.destinationMarker.visible = false;
    this.scene.add(this.destinationMarker);
    this.playerHalo = new THREE.Mesh(
      new THREE.RingGeometry(0.43, 0.46, 40),
      new THREE.MeshBasicMaterial({
        color: "#e7bd79",
        transparent: true,
        opacity: 0.6,
        depthWrite: false,
      }),
    );
    this.playerHalo.rotation.x = -Math.PI / 2;
    this.playerHalo.visible = false;
    this.scene.add(this.playerHalo);
  }

  bind() {
    this.resizeObserver = new ResizeObserver(() => this.resize());
    this.resizeObserver.observe(this.element);
    window.addEventListener("keydown", (event) => {
      if (event.target.matches("input, textarea, select")) return;
      const key = event.code;
      if (
        [
          "KeyW",
          "KeyA",
          "KeyS",
          "KeyD",
          "ArrowUp",
          "ArrowDown",
          "ArrowLeft",
          "ArrowRight",
          "Space",
        ].includes(key) &&
        this.mode === "explore"
      ) {
        event.preventDefault();
        this.keys.add(key);
        if (key !== "Space") this.cancelRoute();
        if (key === "Space" && !event.repeat) this.practice();
      }
      if (key === "KeyE" && this.mode === "explore" && !event.repeat)
        this.interact();
      if (key === "KeyC" && this.mode === "explore" && !event.repeat)
        this.toggleCamera();
    });
    window.addEventListener("keyup", (event) => this.keys.delete(event.code));
    window.addEventListener("blur", () => this.keys.clear());
    this.renderer.domElement.addEventListener("pointerdown", (event) => {
      if (this.mode !== "explore") return;
      const rect = this.element.getBoundingClientRect();
      this.pointer.set(
        ((event.clientX - rect.left) / rect.width) * 2 - 1,
        (-(event.clientY - rect.top) / rect.height) * 2 + 1,
      );
      this.raycaster.setFromCamera(this.pointer, this.camera);
      if (this.raycaster.ray.intersectPlane(this.venue.ground, this.point)) {
        this.walkTo(
          clamp(this.point.x, -10.3, 10.3),
          clamp(this.point.z, -10.3, 10.3),
        );
        this.callbacks.onMove?.();
      }
    });
    document.addEventListener("visibilitychange", () => {
      this.lastTime = performance.now();
      this.keys.clear();
    });
    this.renderer.domElement.addEventListener(
      "wheel",
      (event) => {
        if (this.mode !== "explore") return;
        event.preventDefault();
        this.zoom = clamp(this.zoom + event.deltaY * 0.0007, 0.58, 1.18);
        this.callbacks.onCamera?.(this.zoom < 0.85);
      },
      { passive: false },
    );
  }

  toggleCamera() {
    this.zoom = this.zoom < 0.85 ? 1 : 0.62;
    this.callbacks.onCamera?.(this.zoom < 0.85);
  }

  resize() {
    const { width, height } = this.element.getBoundingClientRect();
    this.renderer.setSize(width, height);
    this.camera.aspect = width / Math.max(height, 1);
    this.camera.updateProjectionMatrix();
  }

  enter() {
    if (this.mode !== "gate") return;
    this.mode = "cinematic";
    this.cinematicTime = 0;
    this.impactPlayed = false;
    this.callbacks.onCinematic?.(true);
    if (this.reducedMotion) this.finishEntrance();
  }

  finishEntrance() {
    this.impactPlayed = false;
    this.mode = "explore";
    this.position.set(1.8, 0.17, 0.3);
    this.player.root.position.copy(this.position);
    this.player.root.rotation.set(0, Math.PI, 0);
    this.opponent.root.position.set(4, 0.17, -3);
    this.opponent.root.rotation.set(0, -0.4, 0);
    this.playerHalo.visible = true;
    this.callbacks.onCinematic?.(false);
    this.callbacks.onReady?.();
  }

  cancelRoute() {
    this.destination = null;
    this.arrival = null;
    this.destinationMarker.visible = false;
    this.callbacks.onRoute?.(null);
  }

  walkTo(x, z, arrival = null) {
    if (this.mode !== "explore") return;
    this.keys.clear();
    this.destination = new THREE.Vector3(x, 0.17, z);
    this.arrival = arrival;
    this.destinationMarker.position.set(x, 0.2, z);
    this.destinationMarker.visible = true;
  }

  visit(id) {
    const station = stations.find((s) => s.id === id);
    if (!station || this.mode !== "explore") return;
    this.callbacks.onRoute?.(station.title);
    this.walkTo(...station.approach, () => this.callbacks.onStation?.(id));
  }

  interact() {
    let closest = null,
      distance = Infinity;
    for (const s of stations) {
      const d = Math.hypot(
        this.position.x - s.approach[0],
        this.position.z - s.approach[1],
      );
      if (d < distance) {
        closest = s;
        distance = d;
      }
    }
    if (distance < 2.6) this.callbacks.onStation?.(closest.id);
    else
      this.callbacks.onHint?.(
        "Click an exhibit or walk toward its numbered marker.",
      );
  }

  practice() {
    if (this.mode !== "explore") return;
    this.callbacks.onRoute?.("Back to center mat");
    this.walkTo(-0.85, 0, () => {
      this.mode = "practice-setup";
      this.setupTime = 0;
      this.setupOpponentStart = this.opponent.root.position.clone();
      this.callbacks.onCinematic?.(true);
    });
  }

  setPaused(paused) {
    this.keys.clear();
    if (paused && this.mode === "explore") this.mode = "panel";
    else if (!paused && this.mode === "panel") this.mode = "explore";
  }

  updateWrestling(t) {
    const p = this.player,
      o = this.opponent;
    const sample = sampleExchange(t);
    const { player, opponent, lock, lift, arch, rise, separate, crouch } =
      sample;
    p.guard(this.time);
    o.guard(this.time + 2);
    p.root.position.set(player.x, player.y, player.z);
    o.root.position.set(opponent.x, opponent.y, opponent.z);
    p.root.rotation.set(player.pitch, player.yaw, 0, "YXZ");
    o.root.rotation.set(opponent.pitch, opponent.yaw, 0, "YXZ");
    p.pose(this.time, separate > 0 && separate < 1 ? 0.7 : 0, crouch);
    if (lock > 0 && rise === 0) {
      for (const side of ["left", "right"]) {
        p.joints[`${side}Arm`].rotation.x = -0.95;
        p.joints[`${side}Elbow`].rotation.x = -0.85;
      }
      o.joints.leftHip.rotation.x = -0.4 * lift * (1 - arch);
      o.joints.rightHip.rotation.x = -0.4 * lift * (1 - arch);
      o.joints.leftKnee.rotation.x = 0.65 * lift;
      o.joints.rightKnee.rotation.x = 0.65 * lift;
    }
    if (rise > 0)
      o.pose(
        this.time,
        separate > 0 && separate < 1 ? 0.8 : 0,
        rise * (1 - rise) * 0.8,
      );
    if (t >= IMPACT_TIME && !this.impactPlayed) {
      this.impactPlayed = true;
      this.score += 5;
      this.venue.setScore(this.score);
      this.callbacks.onImpact?.(this.score);
    }
    if (t > EXCHANGE_DURATION) this.finishEntrance();
  }

  updateMovement(dt) {
    let dx = 0,
      dz = 0;
    const key = (...names) => names.some((n) => this.keys.has(n));
    if (key("KeyW", "ArrowUp")) dz -= 1;
    if (key("KeyS", "ArrowDown")) dz += 1;
    if (key("KeyA", "ArrowLeft")) dx -= 1;
    if (key("KeyD", "ArrowRight")) dx += 1;
    // Keyboard directions match the screen, independent of camera angle.
    if (dx || dz) {
      const forward = new THREE.Vector3()
        .subVectors(this.cameraTarget, this.camera.position)
        .setY(0)
        .normalize();
      const right = new THREE.Vector3(-forward.z, 0, forward.x);
      const move = right.multiplyScalar(dx).addScaledVector(forward, -dz);
      dx = move.x;
      dz = move.z;
    } else if (this.destination) {
      const delta = this.destination.clone().sub(this.position);
      if (delta.length() < 0.14) {
        const arrival = this.arrival;
        this.position.copy(this.destination);
        this.cancelRoute();
        arrival?.();
      } else {
        dx = delta.x;
        dz = delta.z;
      }
    }
    const length = Math.hypot(dx, dz);
    const moving = length > 0.001;
    this.motion = THREE.MathUtils.damp(this.motion, moving ? 1 : 0, 12, dt);
    if (moving) {
      this.position.x = clamp(
        this.position.x + (dx / length) * dt * 4,
        -10.3,
        10.3,
      );
      this.position.z = clamp(
        this.position.z + (dz / length) * dt * 4,
        -10.3,
        10.3,
      );
      const desiredYaw = Math.atan2(dx, dz);
      const difference = Math.atan2(
        Math.sin(desiredYaw - this.player.root.rotation.y),
        Math.cos(desiredYaw - this.player.root.rotation.y),
      );
      this.player.root.rotation.y += difference * Math.min(1, dt * 12);
    }
    this.player.root.position.copy(this.position);
    this.player.pose(this.time, this.motion, 0);
    if (this.motion < 0.1) this.player.guard(this.time);
    this.playerHalo.position.set(this.position.x, 0.195, this.position.z);
    this.opponent.guard(this.time);
    this.opponent.root.rotation.y = Math.atan2(
      this.position.x - this.opponent.root.position.x,
      this.position.z - this.opponent.root.position.z,
    );
    this.destinationMarker.scale.setScalar(1 + Math.sin(this.time * 4) * 0.12);
    const nearest = stations.find(
      (s) =>
        Math.hypot(
          this.position.x - s.approach[0],
          this.position.z - s.approach[1],
        ) < 2.3,
    );
    this.callbacks.onNear?.(nearest?.id || null);
  }

  updateCamera(dt) {
    const narrow = this.camera.aspect < 0.85;
    if (this.mode === "gate") {
      const orbit = this.reducedMotion ? 0 : Math.sin(this.time * 0.065) * 3;
      this.desiredCamera.set(25 + orbit, narrow ? 34 : 28, narrow ? 46 : 37);
      this.desiredTarget.set(0, 1, -2);
    } else if (this.mode === "cinematic") {
      const t = this.cinematicTime;
      const pullBack = ease(clamp((t - 5.4) / 2.4, 0, 1));
      this.desiredCamera.set(
        mix(6, 18, pullBack),
        mix(3.5, 21, pullBack),
        mix(7.4, 26, pullBack),
      );
      this.desiredTarget.set(
        mix(0.8, 0, pullBack),
        mix(0.95, 0.2, pullBack),
        0,
      );
    } else {
      const zoom = (narrow ? 1.55 : 1) * this.zoom;
      const follow = this.zoom < 0.85 ? 0.8 : 0.34;
      this.desiredTarget.set(
        this.position.x * follow,
        0.4,
        this.position.z * follow - 0.8,
      );
      this.desiredCamera
        .copy(this.desiredTarget)
        .add(new THREE.Vector3(17 * zoom, 22 * zoom, 28 * zoom));
    }
    const alpha = 1 - Math.exp(-dt * (this.mode === "cinematic" ? 3 : 2.2));
    this.camera.position.lerp(this.desiredCamera, alpha);
    this.cameraTarget.lerp(this.desiredTarget, alpha);
    this.camera.lookAt(this.cameraTarget);
  }

  projectHotspots() {
    const { width, height } = this.element.getBoundingClientRect();
    const result = stations.map((s) => {
      this.point.set(s.x, 3.9, s.z).project(this.camera);
      return {
        id: s.id,
        x: clamp(
          (this.point.x + 1) * 0.5 * width,
          width < 760 ? 26 : 80,
          width - (width < 760 ? 26 : 80),
        ),
        y: clamp((-this.point.y + 1) * 0.5 * height, 115, height - 155),
        visible: this.point.z < 1,
      };
    });
    this.callbacks.onProject?.(result);
  }

  tick(now) {
    const dt = Math.min((now - this.lastTime) / 1000, 0.05);
    this.lastTime = now;
    if (document.hidden) return;
    this.time += dt;
    if (this.mode === "gate") {
      this.player.guard(this.time);
      this.opponent.guard(this.time + 2);
    } else if (this.mode === "cinematic") {
      this.cinematicTime += dt;
      this.updateWrestling(this.cinematicTime);
    } else if (this.mode === "practice-setup") {
      this.setupTime += dt;
      const t = ease(clamp(this.setupTime / 1.5, 0, 1));
      this.opponent.root.position.lerpVectors(
        this.setupOpponentStart,
        new THREE.Vector3(0.75, 0.17, 0),
        t,
      );
      this.opponent.pose(this.time, 0.8);
      this.player.guard(this.time);
      this.player.root.rotation.y = Math.PI / 2;
      if (t === 1) {
        this.mode = "cinematic";
        this.cinematicTime = 0;
      }
    } else if (this.mode === "explore") this.updateMovement(dt);
    this.venue.update(this.time);
    this.updateCamera(dt);
    this.projectHotspots();
    this.renderer.render(this.scene, this.camera);
  }
}
