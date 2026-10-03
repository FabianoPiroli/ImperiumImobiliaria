function getApiUrl(): string {
  const raw = (process.env.NEXT_PUBLIC_API_BASE_URL || process.env.NEXT_PUBLIC_API_URL)?.trim();
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
  if (!res.ok) {
    const errorBody = await res.json().catch(() => null);
    throw new Error(
      errorBody?.message ?? "Não foi possível concluir a operação.",
    );
  }
  if (res.status === 204) return null;
  const text = await res.text();
  try {
    return text ? JSON.parse(text) : null;
  } catch {
    return text;
  }
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
export async function registerClient(nome: string, email: string, senha: string) {
  return parseResponse(
    await fetch(`${API_URL}/auth/clientes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome, email, senha }),
    }),
  );
}
export async function getClientFavorites() {
  return parseResponse(await fetch(`${API_URL}/cliente/favoritos`, { headers: authHeaders() }));
}
export async function addClientFavorite(imovelId: number) {
  return parseResponse(await fetch(`${API_URL}/cliente/favoritos/${imovelId}`, { method: "POST", headers: authHeaders() }));
}
export async function removeClientFavorite(imovelId: number) {
  return parseResponse(await fetch(`${API_URL}/cliente/favoritos/${imovelId}`, { method: "DELETE", headers: authHeaders() }));
}
export async function getClientRequests() {
  return parseResponse(await fetch(`${API_URL}/cliente/solicitacoes`, { headers: authHeaders() }));
}
export async function getClientRequest(id: number) {
  return parseResponse(await fetch(`${API_URL}/cliente/solicitacoes/${id}`, { headers: authHeaders() }));
}
export async function createClientRequest(data: unknown) {
  return parseResponse(await fetch(`${API_URL}/cliente/solicitacoes`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(data),
  }));
}
export async function updateClientRequest(id: number, data: unknown) {
  return parseResponse(await fetch(`${API_URL}/cliente/solicitacoes/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(data),
  }));
}
export async function deleteClientRequest(id: number) {
  return parseResponse(await fetch(`${API_URL}/cliente/solicitacoes/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  }));
}
export async function uploadClientRequestPhoto(id: number, file: File) {
  const form = new FormData();
  form.append("foto", file);
  return parseResponse(await fetch(`${API_URL}/cliente/solicitacoes/${id}/foto`, {
    method: "POST",
    headers: authHeaders(),
    body: form,
  }));
}
export async function getAdminRequests() {
  return parseResponse(await fetch(`${API_URL}/cliente/admin/solicitacoes`, { headers: authHeaders() }));
}
export async function getAdminRequest(id: number) {
  return parseResponse(await fetch(`${API_URL}/cliente/admin/solicitacoes/${id}`, { headers: authHeaders() }));
}
export async function updateAdminRequest(id: number, data: string | Record<string, unknown>) {
  const body = typeof data === "string" ? { status: data } : data;
  return parseResponse(await fetch(`${API_URL}/cliente/admin/solicitacoes/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(body),
  }));
}
export async function deleteAdminRequest(id: number) {
  return parseResponse(await fetch(`${API_URL}/cliente/admin/solicitacoes/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  }));
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
