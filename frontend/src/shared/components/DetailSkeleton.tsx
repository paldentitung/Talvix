import Skeleton from "./Skeleton";

const card = "rounded-(--radius-lg) border border-(--border) bg-(--card)";

const DetailSkeleton = ({
  squareAvatar = false,
  stats = 0,
  sections = 2,
}: {
  squareAvatar?: boolean;
  stats?: number;
  sections?: number;
}) => (
  <div className="mx-auto flex max-w-3xl flex-col gap-5" aria-busy="true">
    <div className={`overflow-hidden ${card}`}>
      <div className="h-28 animate-pulse bg-(--bg)" />
      <div className="px-6 pb-6">
        <Skeleton
          className={`-mt-10 h-20 w-20 ring-4 ring-(--card) ${
            squareAvatar ? "rounded-(--radius-lg)" : "rounded-full"
          }`}
        />
        <Skeleton className="mt-4 h-5 w-48" />
        <Skeleton className="mt-2 h-4 w-32" />
      </div>
    </div>

    {stats > 0 && (
      <div className="grid grid-cols-3 gap-3">
        {Array.from({ length: stats }).map((_, i) => (
          <Skeleton key={i} className={`h-16 ${card}`} />
        ))}
      </div>
    )}

    {Array.from({ length: sections }).map((_, i) => (
      <Skeleton key={i} className={`${i === 0 ? "h-32" : "h-48"} ${card}`} />
    ))}
  </div>
);

export default DetailSkeleton;
