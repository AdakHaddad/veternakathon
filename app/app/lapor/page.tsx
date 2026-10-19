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
      <div>
        <Link href="/" className="text-sm text-emerald-700 hover:underline">
          ← Beranda
        </Link>
        <h1 className="mt-2 text-2xl font-bold">Buat laporan</h1>
        <p className="mt-1 text-sm text-stone-600">
          Isi seperlunya saja; jika data tidak diketahui, biarkan kosong.
          Laporan Anda akan ditinjau responder yang ditunjuk.
        </p>
      </div>
      {error ? (
        <p className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm font-medium text-red-800">
          Mohon lengkapi: jenis ternak, wilayah, minimal satu tanda yang
          terlihat, dan persetujuan kirim.
        </p>
      ) : null}

      <form
        action={submitReport}
        className="space-y-6 rounded-2xl border border-stone-200 bg-white p-6 shadow-sm"
      >
        <FormSection step="1" title="Ternak apa yang bermasalah?" required>
          <div className="flex flex-wrap gap-3">
            {SPECIES.map((s) => (
              <label
                key={s}
                className="flex cursor-pointer items-center gap-2 rounded-xl border border-stone-300 px-4 py-2 text-sm font-medium hover:border-emerald-500 hover:bg-emerald-50 has-checked:border-emerald-600 has-checked:bg-emerald-50"
              >
                <input
                  type="radio"
                  name="species"
                  value={s}
                  required
                  className="accent-emerald-700"
                />
                {s === "ayam" ? "🐤" : "🐄"} {s}
              </label>
            ))}
          </div>
        </FormSection>

        <FormSection
          step="2"
          title="Tanda yang Anda lihat"
          hint="Pilih semua yang cocok"
          required
        >
          <div className="grid gap-2 sm:grid-cols-2">
            {SPECIES.map((s) => (
              <SignGroup key={s} species={s} signGroupOptions={SIGN_OPTIONS[s]} />
            ))}
          </div>
          <textarea
            name="observed_signs_note"
            rows={3}
            placeholder="Catatan tambahan (opsional): perilaku aneh, kondisi kandang, dsb."
            className="input-el w-full"
          />
        </FormSection>

        <FormSection step="3" title="Kapan tanda pertama terlihat?" hint="Boleh dikosongkan">
          <input type="date" name="onset_at" className="input-el max-w-xs" />
        </FormSection>

        <FormSection step="4" title="Perkiraan jumlah hewan" hint="Tidak diketahui? Kosongkan">
          <div className="flex flex-wrap gap-4">
            <label className="flex items-center gap-2 text-sm">
              <span className="w-16 text-stone-600">Terkena</span>
              <input
                type="number"
                name="affected_count"
                min={0}
                placeholder="0"
                className="input-el w-32"
              />
            </label>
            <label className="flex items-center gap-2 text-sm">
              <span className="w-16 text-stone-600">Mati</span>
              <input
                type="number"
                name="dead_count"
                min={0}
                placeholder="0"
                className="input-el w-32"
              />
            </label>
          </div>
        </FormSection>

        <FormSection step="5" title="Wilayah" required>
          <select name="region_id" required className="input-el max-w-sm">
            <option value="">Pilih wilayah uji coba…</option>
            {regions.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name}
              </option>
            ))}
          </select>
          <textarea
            name="location_detail"
            rows={2}
            placeholder="Detail lokasi (opsional, hanya untuk responder): nama dusun/peternakan."
            className="input-el w-full"
          />
        </FormSection>

        <FormSection step="6" title="Cara menghubungi Anda" hint="Opsional">
          <input
            name="reporter_name"
            placeholder="Nama panggilan"
            className="input-el w-full"
          />
          <input
            name="reporter_contact"
            placeholder="Nomor HP (opsional)"
            className="input-el w-full"
          />
        </FormSection>

        <FormSection step="7" title="Persetujuan" required>
          <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-stone-300 bg-stone-50 p-3 text-sm hover:border-emerald-500">
            <input
              type="checkbox"
              name="consent"
              value="ya"
              required
              className="mt-0.5 size-4 accent-emerald-700"
            />
            Saya setuju laporan ini digunakan untuk tindak lanjut kesehatan
            hewan dalam program ini.
          </label>
        </FormSection>

        <button
          type="submit"
          className="w-full rounded-xl bg-emerald-700 px-4 py-3 font-semibold text-white shadow-sm transition hover:bg-emerald-800"
        >
          Kirim laporan
        </button>
      </form>

      <p className="text-center text-sm text-stone-600">
        Laporan terkirim tapi belum dijawab?{" "}
        <Link href="/edukasi" className="font-medium text-emerald-700 hover:underline">
          Lihat kontak resmi
        </Link>
      </p>
    </div>
  );
}

function FormSection({
  step,
  title,
  hint,
  required,
  children,
}: {
  step: string;
  title: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <fieldset className="grid gap-3 sm:grid-cols-[2.5rem_1fr]">
      <span className="mt-0.5 grid size-8 place-items-center rounded-lg bg-emerald-100 text-sm font-bold text-emerald-800">
        {step}
      </span>
      <div className="col-span-1 space-y-3 sm:col-span-1">
        <legend className="font-semibold [&]:-ml-0">
          {title}
          {required ? <span className="text-red-600"> *</span> : null}
          {hint ? (
            <span className="ml-2 text-xs font-normal text-stone-500">
              ({hint})
            </span>
          ) : null}
        </legend>
        {children}
      </div>
    </fieldset>
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
    <label
      key={species + s}
      className="flex items-center gap-2 rounded-lg border border-stone-200 px-3 py-2 text-sm transition hover:border-emerald-400 hover:bg-emerald-50/50"
    >
      <input
        type="checkbox"
        name="observed_signs"
        value={s}
        className="size-4 accent-emerald-700"
      />
      {s}
    </label>
  ));
}
