import { useAuth } from "@/context/auth";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LoginScreen() {
  const { signIn, user } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user) router.replace("/home");
  }, [user, router]);

  async function onSubmit() {
    setError(null);
    if (!email.trim() || !password) {
      setError("Informe e-mail e senha.");
      return;
    }
    setSubmitting(true);
    try {
      await signIn(email, password);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Não foi possível entrar.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-slate-950">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1 justify-center px-6"
      >
        <Text className="mb-2 text-3xl font-bold text-slate-50">Judify</Text>
        <Text className="mb-8 text-base text-slate-400">
          Entre com sua conta do escritório.
        </Text>

        <Text className="mb-1 text-sm font-medium text-slate-300">E-mail</Text>
        <TextInput
          className="mb-4 rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-slate-100"
          placeholder="voce@escritorio.com"
          placeholderTextColor="#64748b"
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
          editable={!submitting}
        />

        <Text className="mb-1 text-sm font-medium text-slate-300">Senha</Text>
        <TextInput
          className="mb-6 rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-slate-100"
          placeholder="••••••••"
          placeholderTextColor="#64748b"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          editable={!submitting}
          onSubmitEditing={onSubmit}
        />

        {error ? (
          <Text className="mb-4 text-center text-sm text-red-400">{error}</Text>
        ) : null}

        <Pressable
          className="items-center rounded-xl bg-sky-500 py-4 active:opacity-90"
          onPress={onSubmit}
          disabled={submitting}
        >
          {submitting ? (
            <ActivityIndicator color="#0f172a" />
          ) : (
            <Text className="text-base font-semibold text-slate-950">
              Entrar
            </Text>
          )}
        </Pressable>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
