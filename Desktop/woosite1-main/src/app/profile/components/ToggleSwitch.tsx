interface ToggleSwitchProps {
  isOn: boolean;
  onToggle?: () => void;
}

export default function ToggleSwitch({ isOn, onToggle }: ToggleSwitchProps) {
  return (
    <div 
      onClick={onToggle}
      style={{
        width: '51px',
        height: '31px',
        borderRadius: '31px',
        backgroundColor: isOn ? '#c355f5' : '#39393d',
        position: 'relative',
        cursor: 'pointer',
        transition: 'background-color 0.2s',
        flexShrink: 0
      }}
    >
      <div
        style={{
          width: '27px',
          height: '27px',
          borderRadius: '27px',
          backgroundColor: 'white',
          position: 'absolute',
          top: '2px',
          left: isOn ? '22px' : '2px',
          transition: 'left 0.2s',
          boxShadow: '0 1px 3px rgba(0,0,0,0.3)'
        }}
      />
    </div>
  );
} 