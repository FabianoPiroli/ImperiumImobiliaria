import { NextResponse } from "next/server";

const IBGE_BASE_URL = "https://servicodados.ibge.gov.br/api/v1/localidades";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  const isStatesRequest =
    path.length === 1 && path[0] === "estados";
  const isCitiesRequest =
    path.length === 3 &&
    path[0] === "estados" &&
    /^[A-Za-z]{2}$/.test(path[1]) &&
    path[2] === "municipios";

  if (!isStatesRequest && !isCitiesRequest) {
    return NextResponse.json({ error: "Rota do IBGE inválida." }, { status: 400 });
  }

  const url = new URL(`${IBGE_BASE_URL}/${path.map(encodeURIComponent).join("/")}`);
  if (isStatesRequest) url.searchParams.set("orderBy", "nome");

  let response: Response;
  try {
    response = await fetch(url, {
      next: { revalidate: 86400 },
    });
  } catch {
    return NextResponse.json(
      { error: "O serviço de localidades está indisponível." },
      { status: 502 }
    );
  }

  if (!response.ok) {
    return NextResponse.json(
      { error: "O serviço de localidades está indisponível." },
      { status: 502 }
    );
  }

  return NextResponse.json(await response.json());
}
