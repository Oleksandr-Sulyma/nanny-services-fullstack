type LoadMoreButtonProps = {
  isLoading: boolean;
  onClick: () => void;
};

export default function LoadMoreButton({ isLoading, onClick }: LoadMoreButtonProps) {
  const buttonText = isLoading ? "Loading..." : "Load more";
  return (
    <button onClick={onClick} disabled={isLoading}>
      {buttonText}
    </button>
  );
}
