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

type AtualizarTreinoUsuario = {
  userId: UUID;
  configTreinoId: UUID;
  repeticao: number;
  serie: number;
}

type ExcluirTreinoUsuario = {
  userId: UUID;
  configTreinoId: UUID;
}
