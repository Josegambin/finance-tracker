export default function SkeletonCard() {
  return (
    <div className="card skeleton">
      <div className="skeleton-header">
        <div className="skeleton-icon"></div>
        <div className="skeleton-title"></div>
      </div>
      <div className="skeleton-value"></div>
    </div>
  );
}