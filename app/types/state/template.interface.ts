export interface VariablesState {
  data: Record<string, string[]>;
  loading: boolean;
  error: string | null;
}