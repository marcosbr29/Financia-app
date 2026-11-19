
import AsyncStorage from "@react-native-async-storage/async-storage";

const PROFILE_KEY = "@financia_app:profile";

export async function getUserName() {
  const profile = await AsyncStorage.getItem(PROFILE_KEY);

  if (!profile) {
    return "";
  }

  const data = JSON.parse(profile);

  return data.name || "";
}

export async function saveUserName(name) {
  const normalizedName = name.trim();

  if (!normalizedName) {
    throw new Error("Digite um nome válido.");
  }

  await AsyncStorage.setItem(
    PROFILE_KEY,
    JSON.stringify({ name: normalizedName })
  );

  return normalizedName;
}
