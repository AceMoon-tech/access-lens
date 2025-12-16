import { clsx } from "clsx";
export default function Card({ className = "", children }) {
  return (
    <div className={clsx("card-base", className)}>
      {children}
    </div>
  );
}
