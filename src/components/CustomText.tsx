import { Text, TextProps } from 'react-native';

const CustomText = ({ style, ...props }: TextProps) => {
  return <Text {...props} style={[{ fontFamily: 'SFProDisplay-Light' }, style]} />;
};

export default CustomText;
