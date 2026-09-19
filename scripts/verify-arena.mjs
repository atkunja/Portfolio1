import assert from "node:assert/strict";
import {
  sampleExchange,
  EXCHANGE_DURATION,
  IMPACT_TIME,
} from "../sources/arena/exchange.js";
import { stations, projects } from "../sources/arena/content.js";
import { stat } from "node:fs/promises";

// Catch the precise continuity failure that made the old entrance feel unrelated
// to gameplay: no phase boundary or final handoff may relocate an athlete.
for (const time of [0.8, 1.65, 2.7, 3.1, 3.85, IMPACT_TIME, 5.1, 6.1, 7.7]) {
  const before = sampleExchange(time - 0.0001);
  const after = sampleExchange(time + 0.0001);
  for (const actor of ["player", "opponent"]) {
    for (const key of ["x", "y", "z", "yaw", "pitch"]) {
      assert.ok(
        Math.abs(after[actor][key] - before[actor][key]) < 0.002,
        `${actor}.${key} jumps at ${time}s`,
      );
    }
  }
}
const finish = sampleExchange(EXCHANGE_DURATION);
for (const [actor, expected] of [["player", [1.8, .17, .3]], ["opponent", [4, .17, -3]]]) {
  ["x", "y", "z"].forEach((axis, i) => assert.ok(Math.abs(finish[actor][axis] - expected[i]) < 1e-8, `${actor}.${axis} does not match the playable handoff`));
}
assert.ok(Math.abs(finish.player.pitch) < 1e-9);
const impact = sampleExchange(IMPACT_TIME);
assert.ok(Math.hypot(impact.player.x - impact.opponent.x, impact.player.z - impact.opponent.z) > .65, "Athletes must have separate landing space");
assert.equal(
  impact.opponent.pitch,
  -Math.PI / 2,
  "Opponent must land on their back",
);
assert.ok(impact.opponent.y >= 0.37, "Landing must clear the mat surface");
const lift = sampleExchange(3.85);
assert.ok(
  lift.opponent.y > lift.player.y + 0.4,
  "Opponent must leave the floor during the lift",
);
for (let time = 0; time < EXCHANGE_DURATION; time += 0.016) {
  const pose = sampleExchange(time);
  for (const actor of ["player", "opponent"])
    for (const value of Object.values(pose[actor]))
      assert.ok(Number.isFinite(value));
}
assert.equal(new Set(stations.map((s) => s.id)).size, 4);
for (const s of stations)
  for (const n of s.approach)
    assert.ok(
      Math.abs(n) <= 10.3,
      `${s.id} must be reachable inside walk bounds`,
    );
for (const p of projects) {
  assert.ok(
    (await stat(new URL(`../static${p.image}`, import.meta.url))).isFile(),
    `${p.name} image missing`,
  );
  assert.equal(new URL(p.url).protocol, "https:");
}
console.log(
  "Arena verification passed: continuous choreography, back landing, matching handoff, four reachable exhibits, and project assets.",
);
