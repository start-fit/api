type ListaCategoria = {
  idCategoria: UUID
}

type AdcionarTreinoUsuario = {
  nomeTreino: string;
  userId: UUID;
  treinos: {
    treinoId: UUID;
    repeticao?: number;
    serie?: number;
  }[],
}
