type AvatarProps = {
  name: string;
};

export default function InitialAvatar({ name }: AvatarProps) {
  const initial = name ? name.charAt(0).toUpperCase() : "?";
  return (
    <div className="flex h-11 w-11 items-center justify-center rounded-full select-none bg-brand-soft">
      <span className="font-sans font-medium text-[20px] leading-none text-brand">
        {initial}
      </span>
    </div>
  );
}
