import classes from "./SquareButton.module.scss";

type SquareButtonProps = {
  text: string;
  size?: "small" | "medium" | "large";
  onClick?: () => void;
};

const SquareButton = ({
  text,
  size = "medium",
  onClick,
}: SquareButtonProps) => {
  return (
    <button
      className={`${classes["button"]} ${classes[size]}`}
      onClick={onClick}
    >
      {text}
    </button>
  );
};

export default SquareButton;
