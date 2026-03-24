import { apiJson } from "@/lib/api";
import type { TarefaDashboardStats } from "@/types/api";
import { useQuery } from "@tanstack/react-query";
import { RefreshControl, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

function StatCard({
  label,
  value,
  accent,
}: {
  label: string;
  value: number;
  accent?: string;
}) {
  return (
    <View className="flex-1 min-w-[44%] rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
      <Text className="text-xs uppercase tracking-wide text-slate-500">
        {label}
      </Text>
      <Text className={`mt-2 text-2xl font-bold ${accent ?? "text-slate-50"}`}>
        {value}
      </Text>
    </View>
  );
}

export default function HomeScreen() {
  const { data, isLoading, error, refetch, isRefetching } = useQuery({
    queryKey: ["dashboard-estatisticas"],
    queryFn: () => apiJson<TarefaDashboardStats>("/tarefas/dashboard/estatisticas"),
  });

  const err = error as Error & { status?: number };
  const isEscritorio =
    err?.status === 403 &&
    (err?.message?.includes("escritório") ||
      err?.message?.includes("escritorio"));

  return (
    <SafeAreaView className="flex-1 bg-slate-950" edges={["bottom"]}>
      <ScrollView
        className="flex-1 px-4 pt-2"
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={() => refetch()}
            tintColor="#38bdf8"
          />
        }
      >
        <Text className="mb-6 text-2xl font-bold text-slate-50">Resumo</Text>

        {isLoading ? (
          <Text className="text-slate-400">Carregando estatísticas…</Text>
        ) : error ? (
          <View className="rounded-2xl border border-amber-900/50 bg-amber-950/40 p-4">
            <Text className="font-semibold text-amber-200">
              {isEscritorio
                ? "Selecione um escritório no sistema web ou peça ao administrador para vincular sua conta."
                : err.message || "Não foi possível carregar o resumo."}
            </Text>
          </View>
        ) : data ? (
          <View className="gap-4">
            <View className="flex-row flex-wrap gap-3">
              <StatCard label="Minhas tarefas" value={data.minhas_tarefas} />
              <StatCard
                label="Pendentes"
                value={data.minhas_pendentes}
                accent="text-amber-400"
              />
            </View>
            <View className="flex-row flex-wrap gap-3">
              <StatCard
                label="Em andamento"
                value={data.minhas_em_andamento}
                accent="text-sky-400"
              />
              <StatCard
                label="Concluídas"
                value={data.minhas_concluidas}
                accent="text-emerald-400"
              />
            </View>
            <View className="flex-row flex-wrap gap-3">
              <StatCard label="Atrasadas (esc.)" value={data.atrasadas} />
              <StatCard label="Vencem hoje" value={data.vencendo_hoje} />
            </View>
            <Text className="text-xs text-slate-500">
              Escritório — total {data.total} · pendentes {data.pendentes} · em
              andamento {data.em_andamento}
            </Text>
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}
