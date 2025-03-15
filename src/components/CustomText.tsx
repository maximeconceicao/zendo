import { Text, TextProps } from 'react-native';

interface CustomTextProps extends TextProps {
  bold?: boolean;
}

const CustomText = ({ style, bold, ...props }: CustomTextProps) => {
  return (
    <Text
      {...props}
      style={[{ fontFamily: bold ? 'SFProDisplay-Semibold' : 'SFProDisplay-Light' }, style]}
    />
  );
};

export default CustomText;
