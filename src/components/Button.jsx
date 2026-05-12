import clsx from "clsx";

const VARIANT_CLASSES = {
  primary: "btn-primary",
  secondary: "btn-secondary",
  tertiary: "btn-tertiary",
};

const SIZE_CLASSES = {
  md: "btn-md",
  sm: "btn-sm",
};

export default function Button({
  as: Component = "button",
  variant = "primary",
  size = "md",
  disabled = false,
  className = "",
  children,
  ...props
}) {
  const resolvedVariant = VARIANT_CLASSES[variant] ? variant : "primary";
  const resolvedSize = SIZE_CLASSES[size] ? size : "md";

  return (
    <Component
      disabled={disabled}
      className={clsx(
        "btn-base",
        VARIANT_CLASSES[resolvedVariant],
        SIZE_CLASSES[resolvedSize],
        className
      )}
      
      {...props}
    >
      {children}
    </Component>
  );
}
