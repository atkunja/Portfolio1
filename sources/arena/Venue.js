import * as THREE from "three";
import { stations } from "./content.js";

const palette = {
  floor: "#1a252c",
  dark: "#12212b",
  trim: "#34434b",
  cream: "#e8ddc6",
  red: "#be5037",
  seat: "#374850",
};
const basic = (color) => new THREE.MeshBasicMaterial({ color });
const standard = (color, roughness = 0.85, metalness = 0.03) =>
  new THREE.MeshStandardMaterial({ color, roughness, metalness });

export class Venue {
  constructor(scene) {
    this.scene = scene;
    this.materials = Object.fromEntries(
      Object.entries(palette).map(([key, color]) => [key, standard(color)]),
    );
    this.materials.metal = standard("#75838a", 0.42, 0.65);
    this.materials.lamp = basic("#ffe9bc");
    this.textures = [];
    this.buildFloor();
    this.buildStands();
    this.buildArchitecture();
    this.buildStations();
    this.buildLighting();
    this.buildDust();
  }

  box(size, position, material, parent = this.scene) {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(...size), material);
    mesh.position.set(...position);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    parent.add(mesh);
    return mesh;
  }

  canvasTexture(width, height, draw) {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    draw(ctx, width, height);
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 4;
    this.textures.push(texture);
    return texture;
  }

  buildFloor() {
    const floorTexture = this.canvasTexture(512, 512, (ctx, w, h) => {
      ctx.fillStyle = "#253138";
      ctx.fillRect(0, 0, w, h);
      ctx.strokeStyle = "#2b373d";
      ctx.lineWidth = 2;
      ctx.strokeRect(0, 0, w, h);
      for (let i = 0; i < 2400; i++) {
        ctx.fillStyle = i % 2 ? "#ffffff06" : "#00000010";
        ctx.fillRect((i * 137.5) % w, (i * 71.7) % h, 2, 2);
      }
    });
    floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
    floorTexture.repeat.set(26, 26);
    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(100, 100),
      new THREE.MeshStandardMaterial({ map: floorTexture, roughness: 0.95 }),
    );
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    this.scene.add(floor);

    // Regulation-inspired square mat, stitched panels, and a circular boundary.
    this.box([21.2, 0.18, 21.2], [0, 0.07, 0], this.materials.dark);
    const matTexture = this.canvasTexture(2048, 2048, (ctx, w, h) => {
      ctx.fillStyle = "#b75038";
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = "#203b49";
      ctx.beginPath();
      ctx.arc(w / 2, h / 2, 843, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "#e8ddc6";
      ctx.lineWidth = 8;
      ctx.beginPath();
      ctx.arc(1024, 1024, 840, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(1024, 1024, 166, 0, Math.PI * 2);
      ctx.stroke();
      ctx.lineWidth = 3;
      ctx.strokeStyle = "#ffffff0a";
      for (let x = 0; x < w; x += w / 8) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let i = 0; i < 22000; i++) {
        ctx.fillStyle = i % 2 ? "#ffffff06" : "#0000000b";
        ctx.fillRect((i * 173.49) % w, (i * 97.23) % h, 1.5, 1.5);
      }
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.font = '700 194px "Barlow Condensed", Impact, sans-serif';
      ctx.fillStyle = "#e8ddc6";
      ctx.fillText("AK", 1024, 1015);
      ctx.font = '700 57px "Barlow Condensed", Impact, sans-serif';
      ctx.fillText("K U N J A D I A   F I E L D H O U S E", 1024, 490);
      ctx.font = '500 28px "DM Sans", sans-serif';
      ctx.fillStyle = "#aeb7b8";
      ctx.fillText("ENGINEER  /  FOUNDER  /  WRESTLER", 1024, 1515);
      ctx.fillStyle = "#e8ddc6";
      ctx.fillRect(986, 977, 7, 92);
      ctx.fillRect(1055, 977, 7, 92);
      ctx.font = '700 37px "Barlow Condensed", Impact, sans-serif';
      ctx.fillText("EST. IN MICHIGAN", 1024, 1965);
      ctx.save();
      ctx.translate(79, 1024);
      ctx.rotate(-Math.PI / 2);
      ctx.fillText("LEAVE IT ALL ON THE MAT", 0, 0);
      ctx.restore();
      ctx.save();
      ctx.translate(1965, 1024);
      ctx.rotate(Math.PI / 2);
      ctx.fillText("STAY CURIOUS. STAY IN THE FIGHT.", 0, 0);
      ctx.restore();
    });
    const mat = new THREE.Mesh(
      new THREE.PlaneGeometry(21, 21),
      new THREE.MeshStandardMaterial({
        map: matTexture,
        roughness: 0.7,
        metalness: 0.03,
      }),
    );
    mat.rotation.x = -Math.PI / 2;
    mat.position.y = 0.17;
    mat.receiveShadow = true;
    this.scene.add(mat);
    this.ground = new THREE.Plane(new THREE.Vector3(0, 1, 0), -0.17);

    // Scorer's desk and two team benches, outside the usable competition floor.
    const wood = standard("#a48660", 0.78);
    for (const x of [-6.5, 6.5]) {
      this.box([4.5, 0.13, 0.65], [x, 0.67, 12.8], wood);
      for (const dx of [-1.7, 1.7])
        this.box([0.16, 0.66, 0.5], [x + dx, 0.33, 12.8], this.materials.metal);
    }
    this.box([5.5, 1.1, 1], [0, 0.55, -13.8], this.materials.dark);
    this.sign(
      "MAT 01",
      "HOME OF AYUSH KUNJADIA",
      [4.9, 0.85],
      [0, 0.76, -13.27],
      0,
      "#e8ddc6",
      "#20333e",
    );
    for (const x of [-1.5, 1.5]) {
      this.box([0.72, 0.045, 0.48], [x, 1.13, -13.8], this.materials.metal);
      const screen = this.box(
        [0.72, 0.45, 0.05],
        [x, 1.37, -14.01],
        this.materials.dark,
      );
      screen.rotation.x = -0.18;
    }
  }

  sign(
    title,
    subtitle,
    size,
    position,
    rotation = 0,
    foreground = "#e8ddc6",
    background = "#15232d",
  ) {
    const map = this.canvasTexture(1024, 320, (ctx) => {
      ctx.fillStyle = background;
      ctx.fillRect(0, 0, 1024, 320);
      ctx.fillStyle = foreground;
      ctx.textAlign = "center";
      ctx.font = '700 104px "Barlow Condensed", Impact, sans-serif';
      ctx.fillText(title, 512, 157);
      ctx.font = '400 29px "DM Sans", sans-serif';
      ctx.fillText(subtitle, 512, 235);
    });
    const mesh = new THREE.Mesh(
      new THREE.PlaneGeometry(...size),
      new THREE.MeshStandardMaterial({
        map,
        roughness: 0.85,
        emissive: "#ffffff",
        emissiveMap: map,
        emissiveIntensity: 0.12,
      }),
    );
    mesh.position.set(...position);
    mesh.rotation.y = rotation;
    this.scene.add(mesh);
    return mesh;
  }

  buildStands() {
    const seatGeo = new THREE.BoxGeometry(0.6, 0.12, 0.55);
    const backGeo = new THREE.BoxGeometry(0.6, 0.51, 0.1);
    const seats = [],
      backs = [];
    for (const side of [-1, 1]) {
      for (let row = 0; row < 5; row++) {
        const x = side * (16.4 + row * 1.08),
          y = 0.5 + row * 0.6;
        this.box([1.12, y, 29], [x, y / 2, -1], this.materials.dark);
        this.box(
          [0.045, 0.04, 29],
          [x - side * 0.48, y + 0.025, -1],
          this.materials.metal,
        );
        for (let col = 0; col < 28; col++) {
          if (col === 8 || col === 9 || col === 19 || col === 20) continue;
          const z = -14.3 + col * 0.95;
          seats.push([x, y + 0.24, z]);
          backs.push([x + side * 0.23, y + 0.52, z, Math.PI / 2]);
        }
      }
      for (const z of [-15.4, 13.4]) {
        this.box(
          [5.8, 0.08, 0.08],
          [side * 18.6, 4.05, z],
          this.materials.metal,
        );
        for (let r = 0; r < 3; r++)
          this.box(
            [0.065, 1.5, 0.065],
            [side * (16.4 + r * 2.1), 3.3, z],
            this.materials.metal,
          );
      }
    }
    const matrix = new THREE.Matrix4();
    const seatMesh = new THREE.InstancedMesh(
      seatGeo,
      this.materials.seat,
      seats.length,
    );
    const backMesh = new THREE.InstancedMesh(
      backGeo,
      this.materials.seat,
      backs.length,
    );
    seats.forEach((p, i) => {
      matrix.makeTranslation(...p);
      seatMesh.setMatrixAt(i, matrix);
    });
    backs.forEach((p, i) => {
      matrix.makeRotationY(p[3]);
      matrix.setPosition(p[0], p[1], p[2]);
      backMesh.setMatrixAt(i, matrix);
    });
    seatMesh.receiveShadow = backMesh.receiveShadow = true;
    this.scene.add(seatMesh, backMesh);

    // Audience silhouettes with varied clothing, seated at a human scale.
    const count = 96;
    const body = new THREE.InstancedMesh(
      new THREE.CapsuleGeometry(0.18, 0.3, 4, 6),
      standard("#4d5960"),
      count,
    );
    const heads = new THREE.InstancedMesh(
      new THREE.SphereGeometry(0.12, 8, 6),
      standard("#b1937c"),
      count,
    );
    for (let i = 0; i < count; i++) {
      const p = seats[(i * 37 + 11) % seats.length];
      matrix.makeTranslation(p[0], p[1] + 0.35, p[2]);
      body.setMatrixAt(i, matrix);
      matrix.makeTranslation(p[0], p[1] + 0.73, p[2]);
      heads.setMatrixAt(i, matrix);
      body.setColorAt(
        i,
        new THREE.Color(
          ["#77695b", "#354853", "#784b3b", "#232d35", "#a59d88"][i % 5],
        ),
      );
      heads.setColorAt(
        i,
        new THREE.Color(["#b38666", "#896344", "#c49a7b"][i % 3]),
      );
    }
    this.scene.add(body, heads);
  }

  buildArchitecture() {
    this.box([48, 12, 0.5], [0, 6, -24], this.materials.dark);
    for (const x of [-24, 24])
      this.box([0.5, 12, 52], [x, 6, 0], this.materials.dark);
    for (let x = -22; x <= 22; x += 5.5)
      this.box([0.35, 12, 0.4], [x, 6, -23.6], this.materials.trim);
    for (const [x, first, second, caption] of [
      [-20, "SHOW", "UP.", "EVERY DAY"],
      [-11, "2×", "ALL-STATE", "WRESTLING"],
      [11, "STAY", "CURIOUS.", "KEEP BUILDING"],
      [20, "DO", "THE WORK.", "ONE MORE REP"],
    ]) {
      const map = this.canvasTexture(600, 1000, (ctx) => {
        ctx.fillStyle = "#9e4933";
        ctx.fillRect(0, 0, 600, 1000);
        ctx.strokeStyle = "#d79b724f";
        ctx.lineWidth = 3;
        ctx.strokeRect(24, 24, 552, 950);
        ctx.textAlign = "center";
        ctx.fillStyle = "#e7d9bd";
        ctx.font = '700 64px "Barlow Condensed"';
        ctx.fillText("AK", 300, 130);
        ctx.font = '700 154px "Barlow Condensed"';
        ctx.fillText(first, 300, 405);
        ctx.font = `700 ${second.length > 7 ? 103 : 133}px "Barlow Condensed"`;
        ctx.fillText(second, 300, 558);
        ctx.fillRect(240, 646, 120, 4);
        ctx.font = '400 25px "DM Sans"';
        ctx.fillText(caption, 300, 828);
      });
      const banner = new THREE.Mesh(
        new THREE.PlaneGeometry(3.6, 6),
        new THREE.MeshStandardMaterial({ map, roughness: 1 }),
      );
      banner.position.set(x, 6.5, -23.65);
      this.scene.add(banner);
      this.box([3.85, 0.08, 0.08], [x, 9.55, -23.58], this.materials.metal);
    }
    this.sign(
      "KUNJADIA FIELDHOUSE",
      "MICHIGAN  •  EVERY DAY IS A PRACTICE DAY",
      [19, 3.4],
      [0, 9.2, -23.63],
    );

    // Low trusses sit over the sidelines, leaving the playing floor unobstructed.
    for (const x of [-14.5, 14.5]) {
      for (const y of [9.2, 9.75])
        this.box([0.09, 0.09, 33], [x, y, -1.5], this.materials.metal);
      for (let z = -17; z < 15; z += 1.5) {
        const diagonal = this.box(
          [0.065, 0.75, 0.065],
          [x, 9.48, z],
          this.materials.metal,
        );
        diagonal.rotation.x = 0.72;
      }
      for (const z of [-13, -5, 4, 12]) {
        this.box([1.35, 0.14, 0.7], [x, 9.05, z], this.materials.trim);
        this.box([1.16, 0.035, 0.54], [x, 8.96, z], this.materials.lamp);
      }
    }
    // Scoreboard deliberately lives on the far wall, not above the chase camera.
    this.box([8.5, 3.4, 0.3], [0, 5.7, -19.8], this.materials.trim);
    this.scoreboard = this.sign(
      "00  :  00",
      "AYUSH          PRACTICE          VISITOR",
      [8.1, 3.08],
      [0, 5.7, -19.61],
    );
    this.setScore(0);
    for (const x of [-4, 4])
      this.box([0.09, 3.6, 0.09], [x, 8.8, -19.8], this.materials.metal);
    // Warm linear lights separate the arena from the surrounding darkness.
    for (const x of [-15.1, 15.1])
      this.box([0.05, 0.025, 28], [x, 0.06, -1], basic("#a36640"));
  }

  setScore(score) {
    const old = this.scoreboard.material.map;
    const tex = this.canvasTexture(1200, 450, (ctx) => {
      ctx.fillStyle = "#101b21";
      ctx.fillRect(0, 0, 1200, 450);
      ctx.fillStyle = "#e8ddc6";
      ctx.textAlign = "center";
      ctx.font = '400 31px "DM Sans", sans-serif';
      ctx.fillText("AYUSH", 275, 83);
      ctx.fillText("VISITOR", 925, 83);
      ctx.font = '700 204px "Barlow Condensed", Impact, sans-serif';
      ctx.fillStyle = "#e5ab65";
      ctx.fillText(String(score).padStart(2, "0"), 275, 290);
      ctx.fillStyle = "#e8ddc6";
      ctx.fillText("00", 925, 290);
      ctx.font = '700 63px "Barlow Condensed", Impact, sans-serif';
      ctx.fillText("3:00", 600, 203);
      ctx.font = '400 25px "DM Sans", sans-serif';
      ctx.fillStyle = "#95a09e";
      ctx.fillText("PRACTICE", 600, 260);
      ctx.fillStyle = "#bc5238";
      ctx.fillRect(70, 343, 1060, 2);
      ctx.fillStyle = "#e8ddc6";
      ctx.font = '400 27px "DM Sans", sans-serif';
      ctx.fillText("KUNJADIA FIELDHOUSE   /   MAT 01", 600, 403);
    });
    this.scoreboard.material.map = tex;
    this.scoreboard.material.emissiveMap = tex;
    this.scoreboard.material.emissiveIntensity = 0.7;
    old.dispose();
  }

  buildStations() {
    const loader = new THREE.TextureLoader();
    const configs = [
      {
        x: -12.5,
        z: -3.5,
        angle: 0.35,
        title: "01 / THE WORK",
        subtitle: "IDEAS INTO REAL THINGS",
        image: "/projects/duet.png",
      },
      {
        x: 12.5,
        z: -3.5,
        angle: -0.25,
        title: "03 / OFF THE MAT",
        subtitle: "MORE THAN A JOB TITLE",
        image: "/projects/wrestling.png",
      },
    ];
    for (const c of configs) {
      const group = new THREE.Group();
      group.position.set(c.x, 0, c.z);
      group.rotation.y = c.angle;
      this.scene.add(group);
      this.box([4.6, 3.8, 0.18], [0, 2.3, 0], this.materials.trim, group);
      this.box([4.8, 0.16, 1.3], [0, 0.13, 0], this.materials.dark, group);
      for (const x of [-1.7, 1.7])
        this.box([0.13, 0.65, 0.13], [x, 0.4, 0], this.materials.metal, group);
      const photo = loader.load(c.image);
      photo.colorSpace = THREE.SRGBColorSpace;
      const image = new THREE.Mesh(
        new THREE.PlaneGeometry(4.15, 2.5),
        new THREE.MeshBasicMaterial({ map: photo, toneMapped: false }),
      );
      image.position.set(0, 2.7, 0.1);
      group.add(image);
      const title = this.sign(c.title, c.subtitle, [4.2, 1.03], [0, 0, 0]);
      this.scene.remove(title);
      title.position.set(0, 0.89, 0.1);
      group.add(title);
    }
    // Dedicated career and contact placards; their hotspots open the real content.
    this.sign(
      "02 / THE STORY",
      "THE WORK THAT GOT ME HERE",
      [5.4, 1.65],
      [0, 2.18, -12.25],
    );
    this.box([5.6, 0.15, 0.3], [0, 1.27, -12.28], this.materials.trim);
    for (const x of [-2.5, 2.5])
      this.box([0.1, 1.4, 0.1], [x, 0.7, -12.28], this.materials.metal);

    this.sign(
      "IN YOUR CORNER.",
      "LET’S BUILD SOMETHING GOOD.",
      [4.4, 1.35],
      [11, 2.2, 9],
      -0.6,
    );
    for (const station of stations) {
      const ring = new THREE.Mesh(
        new THREE.RingGeometry(0.53, 0.57, 48),
        basic("#dec49a"),
      );
      ring.rotation.x = -Math.PI / 2;
      ring.position.set(station.approach[0], 0.19, station.approach[1]);
      this.scene.add(ring);
    }
  }

  buildLighting() {
    this.scene.add(new THREE.HemisphereLight("#c9dbe4", "#393327", 2.1));
    const key = new THREE.DirectionalLight("#ffe7c0", 3.7);
    key.position.set(-8, 22, 9);
    key.castShadow = true;
    key.shadow.mapSize.set(2048, 2048);
    Object.assign(key.shadow.camera, {
      left: -25,
      right: 25,
      top: 25,
      bottom: -25,
      near: 1,
      far: 60,
    });
    key.shadow.bias = -0.0005;
    key.shadow.normalBias = 0.04;
    key.shadow.radius = 3;
    this.scene.add(key);
    const fill = new THREE.DirectionalLight("#a6d0df", 1.4);
    fill.position.set(15, 10, -15);
    this.scene.add(fill);
    const rim = new THREE.SpotLight("#ffd2a0", 220, 55, 0.55, 0.7, 1.3);
    rim.position.set(0, 12, -12);
    rim.target.position.set(0, 0, 0);
    this.scene.add(rim, rim.target);
    // Subtle stage haze: translucent cones, never a shader-heavy full-screen pass.
    for (const x of [-12, 12]) {
      const cone = new THREE.Mesh(
        new THREE.ConeGeometry(4.8, 15, 24, 1, true),
        new THREE.MeshBasicMaterial({
          color: "#d1dce0",
          transparent: true,
          opacity: 0.013,
          depthWrite: false,
          side: THREE.DoubleSide,
          blending: THREE.AdditiveBlending,
        }),
      );
      cone.position.set(x, 7.5, -8);
      this.scene.add(cone);
    }
  }

  buildDust() {
    const positions = new Float32Array(180 * 3);
    for (let i = 0; i < positions.length; i += 3) {
      positions[i] = Math.sin(i * 72.6) * 23;
      positions[i + 1] = 1 + (i % 31) / 3;
      positions[i + 2] = Math.cos(i * 23.7) * 22;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    this.dust = new THREE.Points(
      geo,
      new THREE.PointsMaterial({
        color: "#ddccb0",
        size: 0.025,
        transparent: true,
        opacity: 0.24,
        depthWrite: false,
      }),
    );
    this.scene.add(this.dust);
  }

  update(t) {
    this.dust.rotation.y = Math.sin(t * 0.035) * 0.025;
  }
}
