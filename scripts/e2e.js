/* eslint-disable @typescript-eslint/no-require-imports */
const { chromium } = require("playwright");

const BASE = process.env.BASE || "http://localhost:3111";
const results = [];

async function main() {
  const browser = await chromium.launch();

  // 1. Reporter submits a report (own context)
  const reporterCtx = await browser.newContext();
  const page = await reporterCtx.newPage();
  await page.goto(BASE + "/lapor");
  await page.check('input[name="species"][value="ayam"]');
  await page.check('input[name="observed_signs"][value="mati mendadak"]');
  await page.fill('textarea[name="observed_signs_note"]', "Uji coba e2e otomatis");
  await page.fill('input[name="onset_at"]', "2026-10-18");
  await page.fill('input[name="affected_count"]', "3");
  await page.fill('input[name="dead_count"]', "1");
  await page.selectOption('select[name="region_id"]', "rgn-sleman-prambanan");
  await page.fill('textarea[name="location_detail"]', "Dusun Uji (contoh)");
  await page.fill('input[name="reporter_name"]', "Penguji Otomatis");
  await page.fill('input[name="reporter_contact"]', "0899-test");
  await page.check('input[name="consent"]');
  await Promise.all([page.waitForURL(/\/status\/VR-/), page.click('form:has(input[name="consent"]) button[type="submit"]')]);
  const ref = page.url().split("/status/")[1].split("?")[0];
  const confirmText = await page.textContent("body");
  results.push(["1. submit -> gets reference on confirm page", confirmText.includes(ref)]);

  // 2. Anonymous lookup by reference (fresh context, no cookies)
  const anonCtx = await browser.newContext();
  const anon = await anonCtx.newPage();
  await anon.goto(BASE + "/cek");
  await anon.fill('input[name="reference"]', ref);
  await Promise.all([anon.waitForURL(/\/status\//), anon.click('form button[type="submit"]')]);
  const anonStatus = await anon.textContent("body");
  results.push(["2. anon sees personalized history", anonStatus.includes("Riwayat tindak lanjut")]);
  results.push(["2b. anon does NOT see restricted location detail", !anonStatus.includes("Dusun Uji")]);
  results.push(["2c. anon does NOT see responder contact", !anonStatus.includes("0899-test")]);
  await anonCtx.close();

  // 3. Responder signs in, sees queue
  const respCtx = await browser.newContext();
  const resp = await respCtx.newPage();
  await resp.goto(BASE + "/masuk");
  await resp.check('input[name="user_id"][value="usr-responder-1"]');
  await Promise.all([resp.waitForURL("**/responder"), resp.click('form button[type="submit"]')]);
  const queueBody = await resp.textContent("body");
  results.push(["3. queue contains new report", queueBody.includes(ref)]);
  results.push(["3b. queue labels verification state", queueBody.includes("belum terverifikasi")]);

  // 4. Responder updates: receive + note
  await resp.goto(BASE + "/responder/" + ref);
  await resp.selectOption('select[name="workflow_status"]', "Received");
  await resp.fill('textarea[name="note"]', "Akan menghubungi pelapor besok (simulasi)");
  await Promise.all([resp.waitForURL(/ok=1/), resp.click('form:has(input[name="reference"]) button[type="submit"]')]);
  const detailBody = await resp.textContent("body");
  results.push(["4. update saved + audit logged", detailBody.includes("Perubahan tersimpan") && detailBody.includes("Akan menghubungi pelapor besok")]);

  // 5. Reporter sees the update (no responder needed)
  await page.goto(BASE + "/status/" + ref);
  const statusBody = await page.textContent("body");
  results.push(["5. reporter sees received status", statusBody.includes("Diterima")]);
  results.push(["5b. reporter sees follow-up note", statusBody.includes("Akan menghubungi pelapor besok")]);

  // 6. Dashboard
  await resp.goto(BASE + "/dashboard");
  const dashBody = await resp.textContent("body");
  results.push(["6. dashboard aggregates by region", dashBody.includes("Prambanan")]);
  results.push(["6b. dashboard separates unverified counts", dashBody.includes("Belum terverifikasi")]);

  // 7. Access control: anonymous cannot open responder pages
  const noAuthCtx = await browser.newContext();
  const noAuth = await noAuthCtx.newPage();
  const resp1 = await noAuth.request.get(BASE + "/responder", { maxRedirects: 0 });
  const resp2 = await noAuth.request.get(BASE + "/dashboard", { maxRedirects: 0 });
  results.push(["7. /responder redirects when logged out", resp1.status() === 307]);
  results.push(["7b. /dashboard redirects when logged out", resp2.status() === 307]);
  await noAuthCtx.close();

  // 8. Education library metadata
  await page.goto(BASE + "/edukasi/edu-2");
  const eduBody = await page.textContent("body");
  results.push(["8. edu shows source + reviewer + review date", eduBody.includes("Sumber") && eduBody.includes("iSIKHNAS") && eduBody.includes("Penelaah")]);

  await reporterCtx.close();
  await respCtx.close();
  await browser.close();

  let failed = 0;
  for (const [name, ok] of results) {
    console.log((ok ? "PASS" : "FAIL") + "  " + name);
    if (!ok) failed++;
  }
  console.log(failed === 0 ? "\nALL CHECKS PASSED" : `\n${failed} CHECKS FAILED`);
  process.exit(failed === 0 ? 0 : 1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
