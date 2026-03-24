/** Resposta de login / refresh alinhada ao backend Judify. */
export type UserPublic = {
  id: string;
  username: string;
  email: string;
  provider?: string | null;
  image?: string | null;
  auth_id?: string | null;
  current_escritorio_id?: string | null;
};

export type LoginResponse = {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  user: UserPublic;
};

export type RefreshResponse = {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  refresh_token_expired?: boolean;
};

export type Tarefa = {
  id: string;
  titulo: string;
  descricao?: string | null;
  status: string;
  prioridade: string;
  processo_id: string;
  tipo_tarefa_id: number;
  fase_id: number;
  escritorio_id: string;
  prazo_fatal?: string | null;
  data_inicio?: string | null;
  data_fim?: string | null;
  importante?: boolean;
  urgente?: boolean;
  processo?: { id?: string; numero?: string; titulo?: string } | null;
};

export type TarefasPaginated = {
  total: number;
  page: number;
  limit: number;
  data: Tarefa[];
};

export type TarefaDashboardStats = {
  total: number;
  pendentes: number;
  em_andamento: number;
  concluidas: number;
  canceladas: number;
  atrasadas: number;
  vencendo_hoje: number;
  minhas_tarefas: number;
  minhas_pendentes: number;
  minhas_em_andamento: number;
  minhas_concluidas: number;
  produtividade_mes: number;
  [key: string]: unknown;
};
