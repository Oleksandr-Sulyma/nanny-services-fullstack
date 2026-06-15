import { LoaderCircle } from "lucide-react";

type LoadMoreButtonProps = {
  isLoading: boolean;
  onClick: () => void;
};

export default function LoadMoreButton({
  isLoading,
  onClick,
}: LoadMoreButtonProps) {
  const buttonText = isLoading ? "Loading..." : "Load more";

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isLoading}
      className="inline-flex min-h-12 items-center justify-center gap-2 rounded-[30px] bg-brand px-10 py-3 font-medium text-white transition-colors hover:bg-white hover:text-brand disabled:cursor-not-allowed disabled:opacity-60"
    >
      {isLoading && <LoaderCircle className="h-4 w-4 animate-spin" />}
      {buttonText}
    </button>
  );
}
