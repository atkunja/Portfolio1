import * as THREE from "three";

const sphere = new THREE.SphereGeometry(1, 16, 12);

function material(color, roughness = 0.85) {
  return new THREE.MeshStandardMaterial({ color, roughness, metalness: 0.02 });
}

// A fully articulated athlete. One persistent rig handles the entrance,
// locomotion, stance, and the repeatable practice exchange.
export class Wrestler {
  constructor({
    color = "#bd4d32",
    accent = "#f2dfb3",
    skin = "#ae7751",
    number = "AK",
  } = {}) {
    this.root = new THREE.Group();
    this.root.name = `Wrestler ${number}`;
    this.body = new THREE.Group();
    this.root.add(this.body);
    this.materials = {
      skin: material(skin),
      kit: material(color),
      accent: material(accent),
      shoe: material("#171d22", 0.6),
      hair: material("#211a18"),
    };
    this.joints = {};
    this.build();
    this.pose(0, 0);
  }

  ellipsoid(parent, size, position, mat) {
    const mesh = new THREE.Mesh(sphere, mat);
    mesh.scale.set(...size);
    mesh.position.set(...position);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    parent.add(mesh);
    return mesh;
  }

  segment(parent, length, top, bottom, mat) {
    const geo = new THREE.CylinderGeometry(top, bottom, length, 12);
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.y = -length / 2;
    mesh.castShadow = true;
    parent.add(mesh);
    return mesh;
  }

  joint(parent, name, position) {
    const group = new THREE.Group();
    group.position.set(...position);
    parent.add(group);
    this.joints[name] = group;
    return group;
  }

  build() {
    const m = this.materials;
    // Hips and ribcage are tapered, with separate deltoids and neck.
    this.ellipsoid(this.body, [0.235, 0.19, 0.16], [0, 0, 0], m.kit);
    const torso = new THREE.Mesh(
      new THREE.CylinderGeometry(0.31, 0.2, 0.51, 12),
      m.kit,
    );
    torso.scale.z = 0.61;
    torso.position.y = 0.28;
    torso.castShadow = true;
    this.body.add(torso);
    this.ellipsoid(this.body, [0.255, 0.12, 0.145], [0, 0.54, 0.005], m.skin);
    for (const side of [-1, 1]) {
      this.ellipsoid(
        this.body,
        [0.065, 0.26, 0.025],
        [side * 0.19, 0.43, 0.143],
        m.kit,
      );
      this.ellipsoid(
        this.body,
        [0.045, 0.24, 0.023],
        [side * 0.21, 0.31, 0.16],
        m.accent,
      );
    }
    this.ellipsoid(this.body, [0.085, 0.13, 0.087], [0, 0.65, 0], m.skin);
    const head = this.joint(this.body, "head", [0, 0.8, 0]);
    this.ellipsoid(head, [0.145, 0.177, 0.14], [0, 0, 0], m.skin);
    this.ellipsoid(head, [0.105, 0.095, 0.115], [0, -0.087, 0.039], m.skin);
    this.ellipsoid(head, [0.038, 0.048, 0.039], [0, -0.015, 0.133], m.skin);
    for (const x of [-0.057, 0.057]) {
      this.ellipsoid(head, [0.015, 0.008, 0.009], [x, 0.017, 0.129], m.hair);
      this.ellipsoid(head, [0.029, 0.009, 0.008], [x, 0.038, 0.125], m.hair);
    }
    const hair = new THREE.Mesh(
      new THREE.SphereGeometry(0.15, 16, 8, 0, Math.PI * 2, 0, Math.PI * 0.51),
      m.hair,
    );
    hair.scale.set(1.01, 1.18, 0.95);
    hair.position.set(0, 0.023, -0.014);
    head.add(hair);
    for (const side of [-1, 1]) {
      this.ellipsoid(
        head,
        [0.025, 0.07, 0.067],
        [side * 0.145, -0.015, 0],
        m.shoe,
      );
      this.ellipsoid(
        head,
        [0.026, 0.047, 0.045],
        [side * 0.159, -0.015, 0],
        m.accent,
      );
    }
    const band = new THREE.Mesh(
      new THREE.TorusGeometry(0.151, 0.012, 6, 24),
      m.accent,
    );
    band.rotation.y = Math.PI / 2;
    band.position.y = 0.04;
    head.add(band);

    for (const [side, sign] of [
      ["left", -1],
      ["right", 1],
    ]) {
      const shoulder = this.joint(this.body, `${side}Arm`, [
        sign * 0.29,
        0.49,
        0,
      ]);
      this.ellipsoid(shoulder, [0.122, 0.142, 0.13], [0, -0.04, 0], m.skin);
      this.segment(shoulder, 0.3, 0.113, 0.076, m.skin);
      const elbow = this.joint(shoulder, `${side}Elbow`, [0, -0.31, 0]);
      this.ellipsoid(elbow, [0.078, 0.08, 0.08], [0, 0, 0], m.skin);
      this.segment(elbow, 0.285, 0.083, 0.046, m.skin);
      this.ellipsoid(elbow, [0.048, 0.035, 0.05], [0, -0.258, 0], m.accent);
      this.ellipsoid(elbow, [0.061, 0.085, 0.034], [0, -0.32, 0.01], m.skin);
      const hip = this.joint(this.body, `${side}Hip`, [sign * 0.14, -0.06, 0]);
      this.segment(hip, 0.22, 0.139, 0.123, m.kit);
      this.ellipsoid(hip, [0.126, 0.2, 0.134], [0, -0.26, 0], m.skin);
      const knee = this.joint(hip, `${side}Knee`, [0, -0.43, 0]);
      this.ellipsoid(knee, [0.097, 0.09, 0.101], [0, 0, 0], m.skin);
      this.ellipsoid(knee, [0.102, 0.092, 0.048], [0, 0.016, 0.071], m.shoe);
      this.segment(knee, 0.39, 0.084, 0.047, m.skin);
      this.ellipsoid(knee, [0.078, 0.095, 0.075], [0, -0.335, 0], m.shoe);
      this.ellipsoid(knee, [0.084, 0.064, 0.151], [0, -0.414, 0.074], m.shoe);
      this.ellipsoid(knee, [0.086, 0.016, 0.148], [0, -0.456, 0.074], m.accent);
    }
    // A stitched cream panel makes the player distinguishable at arena scale.
    const patch = new THREE.Mesh(new THREE.PlaneGeometry(0.21, 0.15), m.accent);
    patch.position.set(0, 0.37, -0.134);
    patch.rotation.y = Math.PI;
    this.body.add(patch);
  }

  pose(time, speed = 0, crouch = 0) {
    const j = this.joints;
    const stride = Math.sin(time * 9) * Math.min(speed, 1);
    this.body.position.y =
      0.985 - crouch * 0.35 + Math.abs(Math.sin(time * 9)) * speed * 0.03;
    this.body.rotation.set(0.07 + crouch * 0.34, 0, stride * 0.025);
    j.head.rotation.x = -0.06 - crouch * 0.2;
    for (const [side, sign] of [
      ["left", 1],
      ["right", -1],
    ]) {
      j[`${side}Hip`].rotation.set(
        -stride * 0.55 * sign - crouch * 0.8,
        0,
        sign * 0.055,
      );
      j[`${side}Knee`].rotation.x =
        Math.max(0, stride * sign) * 0.85 + crouch * 1.05;
      j[`${side}Arm`].rotation.set(
        -0.22 + stride * 0.32 * sign - crouch * 0.48,
        0,
        sign * 0.18,
      );
      j[`${side}Elbow`].rotation.x = -0.65 - crouch * 0.7;
    }
  }

  guard(time) {
    this.pose(time, 0, 0.22 + Math.sin(time * 2) * 0.025);
    this.body.rotation.z = Math.sin(time * 1.3) * 0.018;
  }
}
