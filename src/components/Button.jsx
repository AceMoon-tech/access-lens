import clsx from "clsx";

export default function Button({
  as: Component = "button",
  variant = "primary",
  size = "md",
  disabled = false,
  className = "",
  children,
  ...props
}) {
  return (
    <Component
      disabled={disabled}
      className={clsx(
        "btn-base",
        `btn-${variant}`,
        `btn-${size}`,
        className
      )}
      
      {...props}
    >
      {children}
    </Component>
  );
}
