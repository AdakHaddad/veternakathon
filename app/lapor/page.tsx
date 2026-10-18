import Link from "next/link";
import { submitReport } from "@/lib/actions";
import { getRegions } from "@/lib/queries";

const SPECIES = ["ayam", "sapi"];

const SIGN_OPTIONS: Record<string, string[]> = {
  ayam: [
    "mati mendadak",
    "nafsu makan turun",
    "sayap merunduk / lemas",
    "leher terpuntir",
    "diare (kotoran terlalu encer / hijau)",
    "terengah-engah",
  ],
  sapi: [
    "nafsu makan turun",
    "demam / tubuh panas",
    "diare",
    "kembung / perut membesar",
    "keluar air liur berlebihan",
    "lumpuh / sulit berdiri",
  ],
};


export default async function LaporkanPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const regions = getRegions().filter((r) => r.parent_region_id === "rgn-sleman");

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <h1 className="text-xl font-bold">Buat laporan</h1>
      <p className="text-sm text-stone-600">
        Isi seperlunya saja; jika data tidak diketahui, biarkan &ldquo;tidak
        diketahui&rdquo;. Laporan Anda akan ditinjau responder yang ditunjuk.
      </p>
      {error ? (
        <p className="rounded border border-red-300 bg-red-50 p-3 text-sm text-red-800">
          Mohon lengkapi: jenis ternak, wilayah, minimal satu tanda yang
          terlihat, dan persetujuan kirim.
        </p>
      ) : null}

      <form action={submitReport} className="space-y-5 rounded-lg border bg-white p-5">
        <fieldset className="space-y-2">
          <legend className="font-semibold">1. Ternak apa yang bermasalah? *</legend>
          <div className="flex gap-4">
            {SPECIES.map((s) => (
              <label key={s} className="flex items-center gap-2">
                <input type="radio" name="species" value={s} required />
                {s}
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset className="space-y-2">
          <legend className="font-semibold">2. Tanda yang Anda lihat * (pilih semua yang cocok)</legend>
          <div className="grid gap-2 sm:grid-cols-2">
            {SPECIES.map((s) => (
              <SignGroup key={s} species={s} signGroupOptions={SIGN_OPTIONS[s]} />
            ))}
          </div>
          <textarea
            name="observed_signs_note"
            rows={2}
            placeholder="Catatan tambahan (opsional): perilaku aneh, kondisi kandang, dsb."
            className="w-full rounded border p-2 text-sm"
          />
        </fieldset>

        <fieldset className="space-y-2">
          <legend className="font-semibold">3. Kapan tanda pertama terlihat?</legend>
          <input type="date" name="onset_at" className="rounded border p-2 text-sm" />
          <p className="text-xs text-stone-500">Boleh dikosongkan jika tidak pasti.</p>
        </fieldset>

        <fieldset className="space-y-2">
          <legend className="font-semibold">4. Perkiraan jumlah hewan</legend>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 text-sm">
              Terkena:
              <input
                type="number"
                name="affected_count"
                min={0}
                placeholder="tidak diketahui"
                className="w-36 rounded border p-1"
              />
            </label>
            <label className="flex items-center gap-2 text-sm">
              Mati:
              <input
                type="number"
                name="dead_count"
                min={0}
                placeholder="tidak diketahui"
                className="w-36 rounded border p-1"
              />
            </label>
          </div>
        </fieldset>

        <fieldset className="space-y-2">
          <legend className="font-semibold">5. Wilayah *</legend>
          <select name="region_id" required className="rounded border p-2 text-sm">
            <option value="">Pilih wilayah uji coba…</option>
            {regions.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name} — {getRegionLabel(r.id)}
              </option>
            ))}
          </select>
          <textarea
            name="location_detail"
            rows={2}
            placeholder="Detail lokasi (opsional, hanya untuk responder). Jangan tulis koordinat rumah."
            className="w-full rounded border p-2 text-sm"
          />
          <p className="text-xs text-stone-500">
            Detail lokasi tidak ditampilkan ke publik.
          </p>
        </fieldset>

        <fieldset className="space-y-2">
          <legend className="font-semibold">6. Cara menghubungi Anda (opsional)</legend>
          <input
            name="reporter_name"
            placeholder="Nama panggilan"
            className="w-full rounded border p-2 text-sm"
          />
          <input
            name="reporter_contact"
            placeholder="Nomor HP (opsional)"
            className="w-full rounded border p-2 text-sm"
          />
        </fieldset>

        <fieldset className="space-y-2">
          <legend className="font-semibold">7. Persetujuan *</legend>
          <label className="flex items-start gap-2 text-sm">
            <input type="checkbox" name="consent" value="ya" required className="mt-1" />
            Saya setuju laporan ini digunakan untuk tindak lanjut kesehatan hewan
            dalam uji coba ini. Saya memahami aplikasi ini tidak mendiagnosis
            penyakit dan bukan jalur darurat resmi.
          </label>
        </fieldset>

        <button
          type="submit"
          className="w-full rounded-md bg-emerald-700 px-4 py-2 font-medium text-white hover:bg-emerald-800"
        >
          Kirim laporan
        </button>
      </form>

      <p className="text-sm text-stone-500">
        Laporan terkirim tapi belum dijawab? Tetap hubungi{" "}
        <Link href="/edukasi">kontak resmi</Link> untuk kejadian mendesak.
      </p>
    </div>
  );
}

function SignGroup({
  species,
  signGroupOptions,
}: {
  species: string;
  signGroupOptions: string[];
}) {
  return signGroupOptions.map((s) => (
    <label key={species + s} className="flex items-center gap-2 text-sm">
      <input type="checkbox" name="observed_signs" value={s} />
      <span className="text-stone-500">[{species}]</span> {s}
    </label>
  ));
}

function getRegionLabel(id: string): string {
  return id === "rgn-sleman" ? "pilot" : "sub-wilayah pilot";
}
