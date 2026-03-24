import { apiJson } from "@/lib/api";
import type { Tarefa } from "@/types/api";
import { useQuery } from "@tanstack/react-query";
import { Stack, useLocalSearchParams } from "expo-router";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View className="mb-3 border-b border-slate-800 pb-3">
      <Text className="text-xs uppercase text-slate-500">{label}</Text>
      <Text className="mt-1 text-base text-slate-100">{value}</Text>
    </View>
  );
}

export default function TarefaDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const { data, isLoading, error } = useQuery({
    queryKey: ["tarefa", id],
    queryFn: () => apiJson<Tarefa>(`/tarefas/${id}`),
    enabled: !!id,
  });

  const err = error as Error;

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          title: data?.titulo ?? "Tarefa",
          headerStyle: { backgroundColor: "#020617" },
          headerTintColor: "#f8fafc",
          headerShadowVisible: false,
        }}
      />
      <ScrollView className="flex-1 bg-slate-950 px-4 py-4">
        {isLoading ? (
          <View className="mt-8 items-center">
            <ActivityIndicator color="#38bdf8" />
          </View>
        ) : error ? (
          <Text className="text-red-400">{err.message}</Text>
        ) : data ? (
          <View>
            <Text className="mb-4 text-xl font-bold text-slate-50">
              {data.titulo}
            </Text>
            {data.descricao ? (
              <Text className="mb-6 text-base leading-6 text-slate-300">
                {data.descricao}
              </Text>
            ) : null}
            <Row label="Status" value={data.status} />
            <Row label="Prioridade" value={data.prioridade} />
            {data.prazo_fatal ? (
              <Row
                label="Prazo fatal"
                value={new Date(data.prazo_fatal).toLocaleString()}
              />
            ) : null}
            {data.processo?.numero || data.processo?.titulo ? (
              <Row
                label="Processo"
                value={
                  [data.processo?.numero, data.processo?.titulo]
                    .filter(Boolean)
                    .join(" — ") || "—"
                }
              />
            ) : null}
          </View>
        ) : null}
      </ScrollView>
    </>
  );
}
