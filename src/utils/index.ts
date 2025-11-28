export function formatarData(data: string | Date): string {
  const d = typeof data === "string" ? new Date(data) : data;
  return d.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export function removerAcentos(texto: string): string {
  return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

export function contemTexto(texto: string, busca: string): boolean {
  const textoNormalizado = removerAcentos(texto.toLowerCase());
  const buscaNormalizada = removerAcentos(busca.toLowerCase());
  return textoNormalizado.includes(buscaNormalizada);
}
