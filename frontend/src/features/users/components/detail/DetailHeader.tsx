const DetailHeader = ({
  avatar,
  squareAvatar = false,
  children,
}: {
  avatar: React.ReactNode;
  squareAvatar?: boolean;
  children: React.ReactNode;
}) => (
  <div className="overflow-hidden rounded-(--radius-lg) border border-(--border) bg-(--card) shadow-(--shadow-sm)">
    <div className="relative h-28 bg-gradient-to-br from-(--primary)/20 via-(--primary)/10 to-(--bg)">
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, var(--border) 1px, transparent 0)",
          backgroundSize: "14px 14px",
        }}
      />
    </div>

    <div className="px-6 pb-6">
      <div
        className={`-mt-10 h-20 w-20 overflow-hidden bg-(--card) shadow-(--shadow-sm) ring-4 ring-(--card) ${
          squareAvatar ? "rounded-(--radius-lg)" : "rounded-full"
        }`}
      >
        {avatar}
      </div>
      {children}
    </div>
  </div>
);

export default DetailHeader;
