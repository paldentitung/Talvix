const Skeleton = ({ className = "" }: { className?: string }) => (
  <div className={`animate-pulse rounded bg-(--border) ${className}`} />
);

export default Skeleton;
