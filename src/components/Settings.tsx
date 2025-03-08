import React, { useState } from 'react';
import { FlatList, Pressable, Switch, Text, useColorScheme, View } from 'react-native';
//import { useNavigation } from '@react-navigation/native';
//import { ArrowRight } from "lucide-react-native";

// 🔹 Définition des types d'options
type SettingOption =
  | { id: string; title: string; type: 'switch'; value: boolean; onToggle: () => void }
  | { id: string; title: string; type: 'link'; screen: string };

const SettingsScreen = () => {
  //const navigation = useNavigation();
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  const [isDark, setIsDark] = useState<boolean>(isDarkMode);
  const [notifications, setNotifications] = useState<boolean>(true);

  const toggleDarkMode = () => setIsDark(!isDark);
  const toggleNotifications = () => setNotifications(!notifications);

  const settingsOptions: SettingOption[] = [
    { id: '1', title: 'Mode sombre', type: 'switch', value: isDark, onToggle: toggleDarkMode },
    {
      id: '2',
      title: 'Notifications',
      type: 'switch',
      value: notifications,
      onToggle: toggleNotifications
    },
    { id: '3', title: 'À propos', type: 'link', screen: 'AboutScreen' }
  ];

  // 🔹 Correction : Vérification stricte de `screen`
  const renderItem = ({ item }: { item: SettingOption }) => (
    <Pressable
      className="flex-row justify-between items-center px-4 py-3 border-b border-gray-300 dark:border-gray-700"
      onPress={() => (item.type === 'link' && item.screen ? null : null)}
    >
      <Text className="text-lg text-gray-900 dark:text-gray-100">{item.title}</Text>
      {item.type === 'switch' ? (
        <Switch value={item.value} onValueChange={item.onToggle} />
      ) : // <ArrowRight size={20} className="text-gray-500 dark:text-gray-400" />
      null}
    </Pressable>
  );

  return (
    <View className="flex-1 bg-white dark:bg-black">
      <View className="p-4">
        <Text className="text-2xl font-bold text-gray-900 dark:text-gray-100">Paramètres</Text>
        <Text className="text-gray-600 dark:text-gray-400">Personnalisez votre expérience</Text>
      </View>

      <FlatList data={settingsOptions} keyExtractor={(item) => item.id} renderItem={renderItem} />
    </View>
  );
};

export default SettingsScreen;
