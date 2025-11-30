// src/components/admin/products/ProductSearchFilter.jsx
export default function ProductSearchFilter({
  filter,
  onChange,
}) {
  const handleChange = (key, value) => {
    onChange({ [key]: value });
  };

  return (
    <div className="ap-card ap-filter">
      <div className="ap-filter-row">
        <input
          className="ap-input"
          placeholder="Tìm theo tên, danh mục, mô tả hoặc ID..."
          value={filter.search}
          onChange={(e) =>
            handleChange("search", e.target.value)
          }
        />

        <select
          className="ap-input ap-select"
          value={filter.category}
          onChange={(e) =>
            handleChange("category", e.target.value)
          }
        >
          <option value="all">Tất cả danh mục</option>
          <option value="Hoa hồng">Hoa hồng</option>
          <option value="Hoa cưới">Hoa cưới</option>
          <option value="Hoa sinh nhật">
            Hoa sinh nhật
          </option>
          <option value="Hoa lan">Hoa lan</option>
          <option value="Uncategorized">
            Khác / Chưa phân loại
          </option>
        </select>

        <select
          className="ap-input ap-select"
          value={filter.stock}
          onChange={(e) =>
            handleChange("stock", e.target.value)
          }
        >
          <option value="all">Tất cả trạng thái</option>
          <option value="in_stock">Chỉ còn hàng</option>
          <option value="out_of_stock">Chỉ hết hàng</option>
        </select>

        <select
          className="ap-input ap-select"
          value={filter.sortBy}
          onChange={(e) =>
            handleChange("sortBy", e.target.value)
          }
        >
          <option value="newest">Mới nhất</option>
          <option value="oldest">Cũ nhất</option>
          <option value="price_asc">
            Giá tăng dần
          </option>
          <option value="price_desc">
            Giá giảm dần
          </option>
          <option value="name_asc">
            Tên (A → Z)
          </option>
        </select>
      </div>

      <div className="ap-filter-row ap-filter-row-bottom">
        <div className="ap-filter-price">
          <span>Khoảng giá:</span>
          <input
            className="ap-input"
            type="number"
            placeholder="Từ"
            value={filter.minPrice}
            onChange={(e) =>
              handleChange("minPrice", e.target.value)
            }
          />
          <span className="ap-filter-tilde">~</span>
          <input
            className="ap-input"
            type="number"
            placeholder="Đến"
            value={filter.maxPrice}
            onChange={(e) =>
              handleChange("maxPrice", e.target.value)
            }
          />
        </div>
      </div>
    </div>
  );
}
