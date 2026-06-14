import "./global.css";

import { StatusBar } from "expo-status-bar";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { FOUNDATION_STAGE } from "@vukasync/types";
import { getFoundationLabel } from "@vukasync/ui";
import { formatFoundationStatus } from "@vukasync/utils";

const architectureItems = [
  "Expo Managed Workflow",
  "NativeWind mobile styling",
  "Shared TypeScript packages"
];

export default function App() {
  return (
    <SafeAreaView className="flex-1 bg-vukasync-background">
      <StatusBar style="dark" />
      <View className="flex-1 justify-center px-6">
        <View className="rounded-3xl border border-slate-200 bg-white p-6">
          <Text className="self-start rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-700">
            {FOUNDATION_STAGE}
          </Text>
          <Text className="mt-6 text-3xl font-bold text-slate-950">
            VukaSync OS mobile foundation
          </Text>
          <Text className="mt-4 text-base leading-7 text-slate-600">
            {formatFoundationStatus("mobile")}
          </Text>
          <Text className="mt-8 text-xs font-bold uppercase tracking-wider text-slate-500">
            {getFoundationLabel("mobile")}
          </Text>
          <View className="mt-4 gap-3">
            {architectureItems.map((item) => (
              <Text key={item} className="text-base text-slate-700">
                - {item}
              </Text>
            ))}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
