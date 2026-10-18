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
      <h1 className="text-xl font-bold">Masuk (responder / admin)</h1>
      <p className="text-sm text-stone-600">
        Ini prototipe: pilih salah satu akun demo berikut. Penerapan
        autentikasi nyata (mis. Supabase Auth) berada di luar cakupan
        prototipe kompetisi ini.
      </p>
      {error ? (
        <p className="rounded border border-red-300 bg-red-50 p-3 text-sm text-red-800">
          Akun tidak valid.
        </p>
      ) : null}

      <form action={signIn} className="space-y-3 rounded-lg border bg-white p-5">
        {staff.map((p) => (
          <label
            key={p.id}
            className="flex items-center gap-3 rounded border p-3 text-sm hover:bg-stone-50"
          >
            <input type="radio" name="user_id" value={p.id} required />
            <span>
              <span className="font-medium">{p.display_name}</span>
              <br />
              <span className="text-stone-700">
                Peran: {p.role === "admin" ? "Administrator" : "Responder"} ·
                Verifikasi: {p.professional_verification_status} · Wilayah:
                Sleman
              </span>
            </span>
          </label>
        ))}
        <button
          type="submit"
          className="w-full rounded-md bg-emerald-700 px-4 py-2 font-medium text-white hover:bg-emerald-800"
        >
          Masuk
        </button>
      </form>
    </div>
  );
}
