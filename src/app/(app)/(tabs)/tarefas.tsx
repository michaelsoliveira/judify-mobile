import { apiJson } from "@/lib/api";
import type { Tarefa } from "@/types/api";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TarefasScreen() {
  const router = useRouter();
  const { data, isLoading, error, refetch, isRefetching } = useQuery({
    queryKey: ["minhas-tarefas"],
    queryFn: () =>
      apiJson<Tarefa[]>("/tarefas/minhas-tarefas?limit=50"),
  });

  const err = error as Error & { status?: number };

  return (
    <SafeAreaView className="flex-1 bg-slate-950" edges={["bottom"]}>
      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color="#38bdf8" size="large" />
        </View>
      ) : error ? (
        <View className="flex-1 justify-center px-4">
          <Text className="text-center text-red-400">
            {err.status === 403
              ? err.message
              : err.message || "Erro ao carregar tarefas."}
          </Text>
        </View>
      ) : (
        <FlatList
          className="px-4 pt-2"
          data={data ?? []}
          keyExtractor={(item) => item.id}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={() => refetch()}
              tintColor="#38bdf8"
            />
          }
          ListEmptyComponent={
            <Text className="py-8 text-center text-slate-500">
              Nenhuma tarefa encontrada.
            </Text>
          }
          renderItem={({ item }) => (
            <Pressable
              className="mb-3 rounded-2xl border border-slate-800 bg-slate-900/90 p-4 active:opacity-90"
              onPress={() => router.push(`/tarefa/${item.id}`)}
            >
              <Text className="text-base font-semibold text-slate-50">
                {item.titulo}
              </Text>
              <View className="mt-2 flex-row flex-wrap gap-2">
                <Text className="rounded-md bg-slate-800 px-2 py-0.5 text-xs text-slate-300">
                  {item.status}
                </Text>
                <Text className="rounded-md bg-slate-800 px-2 py-0.5 text-xs text-slate-300">
                  {item.prioridade}
                </Text>
                {item.prazo_fatal ? (
                  <Text className="text-xs text-slate-500">
                    Prazo: {new Date(item.prazo_fatal).toLocaleString()}
                  </Text>
                ) : null}
              </View>
            </Pressable>
          )}
        />
      )}
    </SafeAreaView>
  );
}
