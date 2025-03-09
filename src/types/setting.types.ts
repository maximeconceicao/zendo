export type SettingOption =
  | { id: string; title: string; type: 'switch'; value: boolean; onToggle: () => void }
  | { id: string; title: string; type: 'link'; screen: string }
  | { id: string; title: string; type: 'button'; onPress: () => void };
