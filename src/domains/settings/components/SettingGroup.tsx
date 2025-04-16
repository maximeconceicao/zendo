import { ChevronRight } from 'lucide-react-native';
import React from 'react';
import { FlatList, Pressable, Switch, View } from 'react-native';
import { SettingOption } from 'src/domains/settings/setting.types';
import CustomText from '../../shared/components/CustomText';

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
      onPress={() => (item.type === 'button' || item.type === 'link' ? item.onPress() : null)}
    >
      <CustomText className={`text-lg text-gray-900 ${item.className || ''}`}>
        {item.title}
      </CustomText>
      {item.type === 'switch' && (
        <Switch
          value={item.value}
          onValueChange={item.onToggle}
          trackColor={{ false: '#A0A0A0', true: '#505050' }}
          thumbColor={'#000000'}
        />
      )}
      {item.type === 'link' && <ChevronRight size={20} color="black" />}
    </Pressable>
  );

  return (
    <View className="mb-6">
      <View>
        <CustomText className="text-lg text-gray-900" bold>
          {title}
        </CustomText>
        <CustomText className="text-gray-600">{description}</CustomText>
      </View>

      <FlatList data={settings} keyExtractor={(item) => item.id} renderItem={renderItem} />
    </View>
  );
};

export default SettingGroup;
