import { useAuth } from "@/context/auth";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PerfilScreen() {
  const { user, signOut } = useAuth();

  return (
    <SafeAreaView className="flex-1 bg-slate-950 px-4 pt-2" edges={["bottom"]}>
      <Text className="mb-6 text-2xl font-bold text-slate-50">Perfil</Text>

      <View className="mb-6 rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
        <Text className="text-xs uppercase text-slate-500">Nome</Text>
        <Text className="mt-1 text-lg text-slate-100">{user?.username}</Text>
        <Text className="mt-4 text-xs uppercase text-slate-500">E-mail</Text>
        <Text className="mt-1 text-lg text-slate-100">{user?.email}</Text>
      </View>

      <Pressable
        className="items-center rounded-xl border border-red-900/60 bg-red-950/30 py-4 active:opacity-90"
        onPress={() => signOut()}
      >
        <Text className="font-semibold text-red-300">Sair</Text>
      </Pressable>
    </SafeAreaView>
  );
}
