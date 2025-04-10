import ScreenName from 'src/constants/screenNames';

export type SettingOption =
  | {
      id: string;
      title: string;
      type: 'switch';
      value: boolean;
      onToggle: () => void;
      className?: string;
    }
  | { id: string; title: string; type: 'link'; onPress: () => void; className?: string }
  | { id: string; title: string; type: 'button'; onPress: () => void; className?: string };
