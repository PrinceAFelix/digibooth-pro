import Icon from "../icon/Icon";

interface ButtonProps {
  icon?: string;
  text: string;
  onClick: () => void;
  properties: {
    width: string;
    textColorClass?: string;
    isActive?: boolean;
    btnColor?: string;
  };
}

const Button: React.FC<ButtonProps> = ({ icon, text, onClick, properties }) => {
  return (
    <div className="flex justify-center">
      <button
        disabled={!properties.isActive}
        onClick={onClick}
        style={{
          width: properties.width,
          backgroundColor: properties.btnColor || "#F8BBD0"
        }}
        className={`
          text-lg font-bold px-6 py-3 rounded-full shadow-lg 
          flex justify-center items-center gap-3 transition-all hover:shadow-xl 
          ${properties.textColorClass ?? "text-white"} 
        `}
      >
        {icon && <Icon src={icon} className="w-6 h-6" />}
        <span className="font-indie">{text}</span>
      </button>
    </div>
  );
};

export default Button;
