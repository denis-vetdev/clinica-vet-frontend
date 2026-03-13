export interface Consulta {
  id?: number;
  animal: number;
  animal_nome?: string;
  veterinario: number;
  veterinario_nome?: string;
  data_hora: string;
  motivo: string;
  status: string;
  status_display?: string;
  observacoes?: string;
  criado_em?: string;
}
