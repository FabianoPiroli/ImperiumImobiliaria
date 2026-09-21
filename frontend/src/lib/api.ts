function getApiUrl(): string {
  const raw = process.env.NEXT_PUBLIC_API_URL?.trim();
  if (!raw) return "http://localhost:3000";
  const clean = raw.replace(/\/+$/, "");
  return /^https?:\/\//i.test(clean) ? clean : `https://${clean}`;
}

const API_URL = getApiUrl();

function authHeaders(): Record<string, string> {
  const token =
    typeof window === "undefined" ? "" : localStorage.getItem("imperium_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function parseResponse(res: Response) {
  if (!res.ok)
    throw new Error(
      (await res.json().catch(() => null))?.message ??
        "Não foi possível concluir a operação.",
    );
  return res.json();
}

export async function getImoveis() {
  return parseResponse(
    await fetch(`${API_URL}/imoveis`, { cache: "no-store" }),
  );
}
export async function getImovel(id: number) {
  return parseResponse(await fetch(`${API_URL}/imoveis/${id}`));
}
export async function createImovel(data: unknown) {
  return parseResponse(
    await fetch(`${API_URL}/imoveis`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...authHeaders() },
      body: JSON.stringify(data),
    }),
  );
}
export async function updateImovel(id: number, data: unknown) {
  return parseResponse(
    await fetch(`${API_URL}/imoveis/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", ...authHeaders() },
      body: JSON.stringify(data),
    }),
  );
}
export async function deleteImovel(id: number) {
  return parseResponse(
    await fetch(`${API_URL}/imoveis/${id}`, {
      method: "DELETE",
      headers: authHeaders(),
    }),
  );
}
export async function login(email: string, senha: string) {
  return parseResponse(
    await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, senha }),
    }),
  );
}
export async function uploadMedia(id: number, arquivo: File) {
  const form = new FormData();
  form.append("arquivo", arquivo);
  return parseResponse(
    await fetch(`${API_URL}/imoveis/${id}/midias`, {
      method: "POST",
      headers: authHeaders(),
      body: form,
    }),
  );
}
export async function uploadMedias(id: number, arquivos: File[]) {
  for (const arquivo of arquivos) await uploadMedia(id, arquivo);
}
export async function deleteMedia(imovelId: number, mediaId: number) {
  return parseResponse(await fetch(`${API_URL}/imoveis/${imovelId}/midias/${mediaId}`, { method: "DELETE", headers: authHeaders() }));
}
export function mediaUrl(url: string) {
  return /^https?:\/\//i.test(url) ? url : `${API_URL}${url}`;
}

export async function resolveMapsUrl(url: string): Promise<{ lat: number; lng: number }> {
  return parseResponse(
    await fetch(`${API_URL}/imoveis/resolver-maps?url=${encodeURIComponent(url)}`),
  );
}
