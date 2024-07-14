type ListaCategoria = {
  idCategoria: UUID
}

type AdcionarTreinoUsuario = {
  nomeTreino: string;
  treinoId: UUID;
  userId: UUID;
  repeticao?: number;
  serie?: number;
}
