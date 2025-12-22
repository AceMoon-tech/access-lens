import { clsx } from "clsx";
export default function Card({ className = "", children, ...props }) {
  return (
    <div className={clsx("card-base", className)} {...props}>
      {children}
    </div>
  );
}
