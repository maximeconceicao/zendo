import { FlatList, View } from 'react-native';
import CustomText from './CustomText';
import { MetricData } from 'src/utils/activity.utils';

const MetricGroup = ({ title, data }: { title: string; data: MetricData[] }) => (
  <View>
    <CustomText className={'text-2xl font-semibold text-gray-800 mb-3'}>{title}</CustomText>
    <FlatList
      data={data}
      keyExtractor={(item) => item.label}
      renderItem={({ item }) => (
        <View className={'mb-5'}>
          <CustomText className={'text-lg font-medium text-gray-800'}>{item.label}</CustomText>
          <CustomText className={'text-base text-gray-600 mt-1'}>{item.value}</CustomText>
        </View>
      )}
    />
  </View>
);

export default MetricGroup;
