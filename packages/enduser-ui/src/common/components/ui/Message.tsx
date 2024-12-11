import { Icon } from "./Icon";

interface MessageProps {
  text: string;
  icon?: string;
  children?: JSX.Element;
}

const Message: React.FC<MessageProps> = ({ text, children, icon }) => (
  <div className="flex flex-col justify-center items-center min-h-screen">
    {icon && (
      <div className="flex w-full my-6 justify-center text-neutral-20 scale-[5]">
        <Icon size="medium" type="XCircle" />
      </div>
    )}

    <p className="text-heading-sm mb-4 text-center max-w-2xl mx-1">{text}</p>
    {children}
  </div>
);

export default Message;
