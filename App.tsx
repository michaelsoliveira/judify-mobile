import "./global.css"
import { Text, View } from "react-native";
 
export default function App() {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-4xl font-bold text-yellow-500">
        Welcome to Nativewind!
      </Text>
    </View>
  );
}