// src/components/admin/products/Pagination.jsx
export default function Pagination({
  currentPage,
  totalPages,
  onChange,
}) {
  if (totalPages <= 1) return null;

  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }

  return (
    <div className="ap-pagination">
      <button
        className="ap-pagination-btn"
        disabled={currentPage === 1}
        onClick={() => onChange(currentPage - 1)}
      >
        «
      </button>
      {pages.map((p) => (
        <button
          key={p}
          className={
            "ap-pagination-btn" +
            (p === currentPage ? " active" : "")
          }
          onClick={() => onChange(p)}
        >
          {p}
        </button>
      ))}
      <button
        className="ap-pagination-btn"
        disabled={currentPage === totalPages}
        onClick={() => onChange(currentPage + 1)}
      >
        »
      </button>
    </div>
  );
}
