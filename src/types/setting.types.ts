export type SettingOption =
  | {
      id: string;
      title: string;
      type: 'switch';
      value: boolean;
      onToggle: () => void;
      className?: string;
    }
  | { id: string; title: string; type: 'link'; screen: string; className?: string }
  | { id: string; title: string; type: 'button'; onPress: () => void; className?: string };
