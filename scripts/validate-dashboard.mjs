#!/usr/bin/env node

import { readFileSync } from "node:fs";

const root = new URL("../", import.meta.url);
const failures = [];

function read(path) {
  return readFileSync(new URL(path, root), "utf8");
}

function check(condition, message) {
  if (!condition) failures.push(message);
}

function isObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function isFiniteNumber(value) {
  return typeof value === "number" && Number.isFinite(value);
}

function isProbability(value) {
  return isFiniteNumber(value) && value >= 0 && value <= 1;
}

function hasKeys(object, keys, label) {
  for (const key of keys) {
    check(Object.hasOwn(object ?? {}, key), `${label} is missing ${key}`);
  }
}

function parseJson(path) {
  try {
    return JSON.parse(read(path));
  } catch (error) {
    failures.push(`${path} is not valid JSON: ${error.message}`);
    return null;
  }
}

function extractScripts(html) {
  const scripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map((match) => match[1]);
  check(scripts.length > 0, "index.html must include at least one inline script");
  return scripts.join("\n");
}

function extractEmbeddedData(script) {
  const marker = "const DATA = ";
  const start = script.indexOf(marker);
  if (start === -1) {
    failures.push("index.html script is missing const DATA");
    return null;
  }

  const tail = script.slice(start + marker.length);
  const end = findJsonEnd(tail);
  if (end === null) {
    failures.push("index.html embedded DATA block could not be delimited");
    return null;
  }

  try {
    return JSON.parse(tail.slice(0, end));
  } catch (error) {
    failures.push(`index.html embedded DATA is not valid JSON: ${error.message}`);
    return null;
  }
}

function findJsonEnd(source) {
  let depth = 0;
  let inString = false;
  let escaped = false;

  for (let index = 0; index < source.length; index += 1) {
    const char = source[index];

    if (inString) {
      if (escaped) {
        escaped = false;
      } else if (char === "\\") {
        escaped = true;
      } else if (char === "\"") {
        inString = false;
      }
      continue;
    }

    if (char === "\"") {
      inString = true;
    } else if (char === "{" || char === "[") {
      depth += 1;
    } else if (char === "}" || char === "]") {
      depth -= 1;
      if (depth === 0) return index + 1;
      if (depth < 0) return null;
    }
  }

  return null;
}

function checkQuantiles(q, label) {
  const keys = ["0.1", "0.25", "0.5", "0.75", "0.9"];
  hasKeys(q, keys, label);
  const values = keys.map((key) => q?.[key]);
  values.forEach((value, index) => check(isFiniteNumber(value), `${label}.${keys[index]} must be a number`));
  for (let index = 1; index < values.length; index += 1) {
    check(values[index] >= values[index - 1], `${label} must be monotonic`);
  }
}

function checkAsset(data, asset) {
  const entry = data.assets?.[asset];
  check(isObject(entry), `assets.${asset} must exist`);
  if (!isObject(entry)) return;

  hasKeys(entry, ["live", "history", "backfill", "ladder"], `assets.${asset}`);
  const { live, history, backfill, ladder } = entry;

  hasKeys(live, ["asset", "as_of", "price", "regime", "headline"], `${asset}.live`);
  check(live?.asset === asset, `${asset}.live.asset must match ${asset}`);
  check(isFiniteNumber(live?.price) && live.price > 0, `${asset}.live.price must be positive`);
  if (live?.mvrv_pct !== null && live?.mvrv_pct !== undefined) {
    check(isProbability(live.mvrv_pct), `${asset}.live.mvrv_pct must be 0..1`);
  }

  if (live?.campaign) {
    hasKeys(live.campaign, ["anchor_date", "anchor_price", "start", "weeks_in_campaign", "drawdown", "trough_so_far"], `${asset}.live.campaign`);
    check(isFiniteNumber(live.campaign.anchor_price) && live.campaign.anchor_price > 0, `${asset}.campaign.anchor_price must be positive`);
    check(isFiniteNumber(live.campaign.drawdown) && live.campaign.drawdown <= 0, `${asset}.campaign.drawdown must be non-positive`);
    hasKeys(live, ["raw_forecast", "calibrated", "policy"], `${asset}.live accumulation fields`);
    check(isProbability(live.raw_forecast?.p_bottom_in), `${asset}.raw_forecast.p_bottom_in must be 0..1`);
    check(isProbability(live.calibrated?.p_bottom_in), `${asset}.calibrated.p_bottom_in must be 0..1`);
    checkQuantiles(live.raw_forecast?.bottom_price_q, `${asset}.raw_forecast.bottom_price_q`);
    checkQuantiles(live.calibrated?.bottom_price_q, `${asset}.calibrated.bottom_price_q`);
    check(isProbability(live.policy?.deployment_target), `${asset}.policy.deployment_target must be 0..1`);
    check(["HIGH", "MEDIUM", "LOW"].includes(live.calibrated?.evidence?.grade), `${asset}.evidence.grade must be HIGH, MEDIUM, or LOW`);
  }

  check(Array.isArray(history?.dates) && history.dates.length > 50, `${asset}.history.dates must have data`);
  check(Array.isArray(history?.price), `${asset}.history.price must be an array`);
  check(history?.dates?.length === history?.price?.length, `${asset}.history dates and price length must match`);
  check(Array.isArray(history?.campaigns) && history.campaigns.length > 0, `${asset}.history.campaigns must have entries`);
  check(Array.isArray(backfill) && backfill.length > 0, `${asset}.backfill must have rows`);
  check(typeof ladder?.rule === "string" && ladder.rule.length > 20, `${asset}.ladder.rule must describe the ladder`);
}

function checkEpisode(episode, index) {
  const label = `episodes[${index}]`;
  hasKeys(episode, ["name", "asset", "dates", "price", "deployed", "target", "dca_deployed"], label);
  const series = [episode.dates, episode.price, episode.deployed, episode.target, episode.dca_deployed];
  const lengths = series.map((value) => (Array.isArray(value) ? value.length : -1));
  check(lengths.every((length) => length > 0), `${label} series must be non-empty arrays`);
  check(new Set(lengths).size === 1, `${label} series lengths must match`);
  for (const key of ["deployed", "target", "dca_deployed"]) {
    (episode[key] ?? []).forEach((value, itemIndex) => {
      check(isProbability(value), `${label}.${key}[${itemIndex}] must be 0..1`);
    });
  }
  if (episode.live) {
    check(episode.name.includes("live"), `${label} live episode name should include live`);
  } else {
    check(isObject(episode.trough), `${label} completed episode must include trough`);
  }
}

function checkData(data) {
  if (!isObject(data)) return;

  hasKeys(data, ["generated_at", "params", "assets", "episodes", "validation", "distribution", "disclosures"], "data");
  check(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/.test(data.generated_at ?? ""), "generated_at must use YYYY-MM-DD HH:mm");
  check(data.params?.family === "time_boost", "params.family should remain time_boost unless the research export changes");

  for (const asset of ["BTC", "ETH"]) checkAsset(data, asset);

  check(Array.isArray(data.episodes) && data.episodes.length > 0, "episodes must have entries");
  (data.episodes ?? []).forEach(checkEpisode);
  check((data.episodes ?? []).some((episode) => episode.live), "episodes must include live campaigns");
  check((data.episodes ?? []).some((episode) => !episode.live), "episodes must include completed campaigns");

  const gates = data.validation?.gates;
  hasKeys(gates, ["all_pass", "perturb_plateau", "stress_no_ruin"], "validation.gates");
  check(gates?.all_pass === false, "Fable is currently a failed validation artifact; all_pass must stay false unless research changes");
  check(gates?.perturb_plateau === false, "perturb_plateau must stay false unless research changes");
  check(gates?.stress_no_ruin === false, "stress_no_ruin must stay false unless research changes");
  check(Array.isArray(data.validation?.loco) && data.validation.loco.length > 0, "validation.loco must have rows");
  check(Array.isArray(data.validation?.perturbation) && data.validation.perturbation.length > 0, "validation.perturbation must have rows");
  check(Array.isArray(data.validation?.stress) && data.validation.stress.length > 0, "validation.stress must have rows");

  check(Array.isArray(data.distribution?.loo) && data.distribution.loo.length > 0, "distribution.loo must have rows");
  check(Array.isArray(data.distribution?.live_windows), "distribution.live_windows must be an array");
  check(data.distribution?.summary?.policy_beats_ladder_median === false, "distribution must preserve that the ladder beat the score policy");
  check(Array.isArray(data.disclosures) && data.disclosures.length >= 5, "disclosures should preserve the full negative-result audit trail");
}

function checkHtml(html, script) {
  check(html.includes("<title>Crypto Cycle"), "index.html must keep a meaningful title");
  check(html.includes("Research only"), "index.html must display Research only");
  check(html.includes("do not use as a live deployment recommendation"), "index.html must warn against live deployment use");
  check(html.includes("not investment advice"), "index.html must include not investment advice");
  check(html.includes("policy validation: FAILED"), "index.html must show failed policy validation on live cards");
  check(html.includes("Policy validation failed"), "index.html must include the model audit failure warning");
  check(html.includes("Live campaigns are reported as incomplete"), "index.html must state live campaigns are incomplete");
  check(!/\b(TODO|FIXME|lorem ipsum)\b/i.test(html), "index.html should not ship TODO/FIXME/lorem text");

  try {
    new Function(script);
  } catch (error) {
    failures.push(`index.html inline script has a syntax error: ${error.message}`);
  }
}

const data = parseJson("data.json");
const html = read("index.html");
const script = extractScripts(html);
const embedded = extractEmbeddedData(script);

checkHtml(html, script);
checkData(data);

if (data && embedded) {
  check(JSON.stringify(data) === JSON.stringify(embedded), "index.html embedded DATA must match data.json exactly");
}

if (failures.length > 0) {
  console.error("Dashboard validation failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`Dashboard contract OK: ${Object.keys(data.assets).join("/")} generated ${data.generated_at}; ${data.episodes.length} episodes checked.`);
