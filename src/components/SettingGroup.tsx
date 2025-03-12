import React from 'react';
import { FlatList, Pressable, Switch, View } from 'react-native';
import { SettingOption } from 'src/types/setting.types';
import CustomText from './CustomText';

const SettingGroup = ({
  title,
  description,
  settings
}: {
  title: string;
  description: string;
  settings: SettingOption[];
}) => {
  const renderItem = ({ item }: { item: SettingOption }) => (
    <Pressable
      className="flex-row justify-between items-center py-3 border-b border-gray-300"
      onPress={() => (item.type === 'button' && item.onPress ? item.onPress() : null)}
    >
      <CustomText className={`text-lg text-gray-900 ${item.className || ''}`}>
        {item.title}
      </CustomText>
      {item.type === 'switch' ? (
        <Switch
          value={item.value}
          onValueChange={item.onToggle}
          trackColor={{ false: '#A0A0A0', true: '#505050' }}
          thumbColor={'#000000'}
        />
      ) : // <ArrowRight size={20} className="text-gray-500 dark:text-gray-400" />
      null}
    </Pressable>
  );

  return (
    <View className="mb-6">
      <View>
        <CustomText className="text-xl font-bold text-gray-900">{title}</CustomText>
        <CustomText className="text-gray-600">{description}</CustomText>
      </View>

      <FlatList data={settings} keyExtractor={(item) => item.id} renderItem={renderItem} />
    </View>
  );
};

export default SettingGroup;
