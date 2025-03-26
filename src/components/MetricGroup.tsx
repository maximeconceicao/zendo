import { FlatList, Pressable, View } from 'react-native';
import CustomText from './CustomText';
import { MetricData } from 'src/utils/activity.utils';
import { ChevronRight } from 'lucide-react-native';

const MetricGroup = ({ title, data }: { title: string; data: MetricData[] }) => (
  <View className={'mb-6'}>
    <CustomText className={'text-lg mb-3'} bold>
      {title}
    </CustomText>
    <FlatList
      data={data}
      keyExtractor={(item) => item.label}
      renderItem={({ item, index }) =>
        item.type === 'button' ? (
          <Pressable
            className="flex-row justify-between items-center py-3 border-b border-gray-300"
            onPress={() => (item.type === 'button' && item.onPress ? item.onPress() : null)}
          >
            <CustomText className={`text-lg text-gray-900`}>{item.label}</CustomText>
            <ChevronRight size={20} color="black" />
          </Pressable>
        ) : (
          <View>
            <View className={'mb-3 flex-row justify-between items-center'}>
              <CustomText className={'text-lg font-medium'}>{item.label}</CustomText>
              <CustomText className={'text-base'} bold>
                {item.value}
              </CustomText>
            </View>
            {index < data.length - 1 && <View className="h-[1px] mb-3 bg-gray-300" />}
          </View>
        )
      }
    />
  </View>
);

export default MetricGroup;
