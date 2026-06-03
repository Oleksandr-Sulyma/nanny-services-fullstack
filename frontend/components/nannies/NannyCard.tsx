import type { Nanny } from "@/types/types";
type NannyCardProps = {
  nanny: Nanny;
};

export default function NannyCard({ nanny }: NannyCardProps) {
  return (
    <li>
      <img src={nanny.avatar_url} alt={nanny.name} width={80} height={80} />
      <strong>{nanny.name}</strong>
      <p>
        {nanny.location.settlement}, {nanny.location.region}
      </p>
      <p>Price: ${nanny.price_per_hour}/hour</p>
      <p>Rating: {nanny.rating}</p>
    </li>
  );
}
