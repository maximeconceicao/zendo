import { Pressable, View } from 'react-native';
import { MetricData } from 'src/domains/activity/activity.utils';
import { ChevronRight } from 'lucide-react-native';
import CustomText from 'src/domains/shared/components/CustomText';

const MetricGroup = ({ title, data }: { title: string; data: MetricData[] }) => (
  <View className="mb-6">
    <CustomText className="text-lg mb-3" bold>
      {title}
    </CustomText>

    {data.map((item, index) =>
      item.type === 'button' ? (
        <Pressable
          key={item.label}
          className="flex-row justify-between items-center py-3 border-b border-gray-300"
          onPress={() => item.onPress?.()}
        >
          <CustomText className="text-lg text-gray-900">{item.label}</CustomText>
          <ChevronRight size={20} color="black" />
        </Pressable>
      ) : (
        <View key={item.label}>
          <View className="mb-3 flex-row justify-between items-center">
            <CustomText className="text-lg font-medium">{item.label}</CustomText>
            <CustomText className="text-base" bold>
              {item.value}
            </CustomText>
          </View>
          {index < data.length - 1 && <View className="h-[1px] mb-3 bg-gray-300" />}
        </View>
      )
    )}
  </View>
);

export default MetricGroup;
