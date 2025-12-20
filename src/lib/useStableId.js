import { useId } from "react";

export default function useStableId(providedId, prefix) {
  const reactId = useId();
  return providedId || `${prefix}-${reactId}`;
}
