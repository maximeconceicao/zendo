type SwitchProps = {
  value: boolean;
  onValueChange: (value: boolean) => void;
  trackColor?: { false: string; true: string };
  thumbColor?: string;
};

// Interrupteur DOM reproduisant le composant Switch de React Native.
const Switch = ({
  value,
  onValueChange,
  trackColor = { false: '#A0A0A0', true: '#505050' },
  thumbColor = '#000000'
}: SwitchProps) => (
  <button
    type="button"
    role="switch"
    aria-checked={value}
    onClick={() => onValueChange(!value)}
    className="relative inline-flex h-7 w-12 shrink-0 cursor-pointer appearance-none items-center rounded-full border-0 p-0 transition-colors"
    style={{ backgroundColor: value ? trackColor.true : trackColor.false }}
  >
    <span
      className="inline-block h-5 w-5 rounded-full transition-transform"
      style={{ backgroundColor: thumbColor, transform: value ? 'translateX(24px)' : 'translateX(4px)' }}
    />
  </button>
);

export default Switch;
