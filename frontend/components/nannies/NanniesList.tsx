import type { Nanny } from "@/types/types";
import NannyCard from "./NannyCard";

type NannyListProps = {
  nannies: Nanny[];
};

export default function NanniesList({nannies}: NannyListProps) {
  return (
      <ul>
        {nannies.map((nanny) => (
          <NannyCard key={nanny.id} nanny={nanny} />
        ))}
      </ul>
  );
}
