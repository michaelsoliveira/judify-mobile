import { Link, Stack } from "expo-router";
import { Text, View } from "react-native";

export default function NotFound() {
  return (
    <>
      <Stack.Screen options={{ title: "Não encontrado" }} />
      <View className="flex-1 items-center justify-center bg-slate-950 px-6">
        <Text className="mb-4 text-center text-lg text-slate-300">
          Esta página não existe.
        </Text>
        <Link href="/" className="text-sky-400">
          Voltar ao início
        </Link>
      </View>
    </>
  );
}
