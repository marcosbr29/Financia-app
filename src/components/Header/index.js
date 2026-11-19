
import { Ionicons } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";
import { styles } from "./styles";

export default function Header({
  userName = "",
  month = "",
  onAddPress,
}) {
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Text style={styles.greeting}>
          Olá{userName ? `, ${userName}` : ""}!
        </Text>

        <TouchableOpacity
          style={styles.addButtonSmall}
          onPress={onAddPress}
        >
          <Ionicons name="add" size={22} color="#fff" />
        </TouchableOpacity>
      </View>

      <Text style={styles.subtitle}>
        Resumo de {month}
      </Text>
    </View>
  );
}
