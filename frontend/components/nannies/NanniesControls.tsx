import type { NanniesSort } from "@/types/types";
import { NANNIES_SORT_LABELS } from "@/types/types";

type NanniesControlsProps = {
  sort: NanniesSort;
  region: string;
  onSortChange: (sort: NanniesSort) => void;
  onRegionChange: (region: string) => void;
};

export default function NanniesControls({
  sort,
  region,
  onSortChange,
  onRegionChange,
}: NanniesControlsProps) {
  const entries = Object.entries(NANNIES_SORT_LABELS);
  return (
    <>
      <select
        value={sort}
        onChange={(event) => onSortChange(event.target.value as NanniesSort)}
      >
        {entries.map(([key, value]) => (
          <option value={key} key={key}>
            {value}
          </option>
        ))}
      </select>
      <input
        value={region}
        onChange={(event) => onRegionChange(event.target.value)}
        placeholder="Region"
      />
    </>
  );
}
