import { signIn } from "@/lib/actions";
import { getDb } from "@/lib/store";

export default async function MasukPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const staff = getDb().profiles.filter((p) => p.role !== "reporter");

  return (
    <div className="mx-auto max-w-md space-y-4">
      <div className="text-center">
        <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-stone-900 text-2xl text-white">
          🔐
        </span>
        <h1 className="mt-3 text-2xl font-bold">Masuk — Responder / Admin</h1>
        <p className="mt-1 text-sm text-stone-600">
          Pilih salah satu akun demo berikut untuk masuk.
        </p>
      </div>

      {error ? (
        <p className="rounded-xl border border-red-200 bg-red-50 p-3 text-center text-sm font-medium text-red-800">
          Akun tidak valid.
        </p>
      ) : null}

      <form action={signIn} className="space-y-3 rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
        {staff.map((p) => (
          <label
            key={p.id}
            className="flex cursor-pointer items-center gap-3 rounded-xl border border-stone-200 p-4 transition hover:border-emerald-500 hover:bg-emerald-50/50 has-checked:border-emerald-600 has-checked:bg-emerald-50"
          >
            <input
              type="radio"
              name="user_id"
              value={p.id}
              required
              className="size-4 accent-emerald-700"
            />
            <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-stone-100 text-lg">
              {p.role === "admin" ? "🛡️" : "🩺"}
            </span>
            <span className="text-sm">
              <span className="font-semibold">{p.display_name}</span>
              <br />
              <span className="text-stone-600">
                {p.role === "admin" ? "Administrator" : "Responder"} · Wilayah:
                Sleman ·{" "}
                {p.professional_verification_status === "verified"
                  ? "✅ Terverifikasi"
                  : "Belum terverifikasi"}
              </span>
            </span>
          </label>
        ))}
        <button
          type="submit"
          className="w-full rounded-xl bg-emerald-700 px-4 py-3 font-semibold text-white transition hover:bg-emerald-800"
        >
          Masuk
        </button>
      </form>
    </div>
  );
}
