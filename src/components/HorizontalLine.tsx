import { View } from 'react-native';

const HorizontalLine = ({ className }: { className?: string }) => {
  return <View className={`border-t border-gray-300 ${className || ''}`} />;
};

export default HorizontalLine;
