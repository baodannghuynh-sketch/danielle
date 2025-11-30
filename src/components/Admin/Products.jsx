// src/components/admin/Products.jsx
import { useState, useEffect, useCallback } from "react";
import { supabase } from "../../supabaseclient";
import ProductForm from "./products/ProductForm";
import ProductSearchFilter from "./products/ProductSearchFilter";
import ProductList from "./products/ProductList";
import ProductDetailModal from "./products/ProductDetailModal";
import ProductEditModal from "./products/ProductEditModal";
import Pagination from "./products/Pagination";
import "./products/products.css";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [filterState, setFilterState] = useState({
    search: "",
    category: "all",
    stock: "all",
    sortBy: "newest",
    minPrice: "",
    maxPrice: "",
  });
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  // Load products từ Supabase
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("products")
        .select("id, name, price, category, images, description, in_stock, created_at")
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Chuẩn hóa dữ liệu
      const normalized = (data || []).map((p) => ({
        ...p,
        images: Array.isArray(p.images)
          ? p.images
          : p.images
          ? [p.images]
          : [],
        in_stock:
          typeof p.in_stock === "boolean" ? p.in_stock : true,
      }));

      setProducts(normalized);
      setFilteredProducts(applyFilter(normalized, filterState));
      setCurrentPage(1);
    } catch (err) {
      console.error("Lỗi tải sản phẩm:", err);
      alert("Lỗi tải sản phẩm: " + err.message);
    } finally {
      setLoading(false);
    }
  }, [filterState]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Hàm áp dụng filter + sort
  const applyFilter = (list, filter) => {
    let result = [...list];

    // Search
    if (filter.search.trim() !== "") {
      const kw = filter.search.trim().toLowerCase();
      result = result.filter(
        (p) =>
          p.name?.toLowerCase().includes(kw) ||
          p.category?.toLowerCase().includes(kw) ||
          p.description?.toLowerCase().includes(kw) ||
          String(p.id).toLowerCase().includes(kw)
      );
    }

    // Category
    if (filter.category !== "all") {
      result = result.filter((p) => p.category === filter.category);
    }

    // Stock
    if (filter.stock === "in_stock") {
      result = result.filter((p) => p.in_stock);
    } else if (filter.stock === "out_of_stock") {
      result = result.filter((p) => !p.in_stock);
    }

    // Price range
    const min = filter.minPrice ? Number(filter.minPrice) : null;
    const max = filter.maxPrice ? Number(filter.maxPrice) : null;

    if (min != null && !isNaN(min)) {
      result = result.filter((p) => Number(p.price) >= min);
    }
    if (max != null && !isNaN(max)) {
      result = result.filter((p) => Number(p.price) <= max);
    }

    // Sort
    switch (filter.sortBy) {
      case "price_asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price_desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "name_asc":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "oldest":
        result.sort(
          (a, b) =>
            new Date(a.created_at) - new Date(b.created_at)
        );
        break;
      case "newest":
      default:
        result.sort(
          (a, b) =>
            new Date(b.created_at) - new Date(a.created_at)
        );
        break;
    }

    return result;
  };

  // Khi thay đổi filter từ thanh search/filter
  const handleFilterChange = (newFilter) => {
    const merged = { ...filterState, ...newFilter };
    setFilterState(merged);
    const result = applyFilter(products, merged);
    setFilteredProducts(result);
    setCurrentPage(1);
  };

  // Tạo sản phẩm mới
  const handleCreateProduct = async (data) => {
    try {
      const payload = {
        name: data.name.trim(),
        price: Number(data.price),
        category: data.category.trim() || "Uncategorized",
        images: data.images,
        description: data.description.trim() || null,
        in_stock: data.in_stock,
      };

      const { error } = await supabase
        .from("products")
        .insert(payload);

      if (error) throw error;

      alert("Thêm sản phẩm thành công!");
      await fetchProducts();
      return { ok: true };
    } catch (err) {
      console.error(err);
      alert("Lỗi thêm sản phẩm: " + err.message);
      return { ok: false, error: err.message };
    }
  };

  // Cập nhật sản phẩm
  const handleUpdateProduct = async (id, data) => {
    try {
      const payload = {
        name: data.name.trim(),
        price: Number(data.price),
        category: data.category.trim() || "Uncategorized",
        images: data.images,
        description: data.description.trim() || null,
        in_stock: data.in_stock,
      };

      const { error } = await supabase
        .from("products")
        .update(payload)
        .eq("id", id);

      if (error) throw error;

      alert("Cập nhật sản phẩm thành công!");
      setEditingProduct(null);
      await fetchProducts();
    } catch (err) {
      console.error(err);
      alert("Lỗi cập nhật sản phẩm: " + err.message);
    }
  };

  // Xóa sản phẩm
  const handleDeleteProduct = async (id) => {
    if (
      !window.confirm(
        "Xóa vĩnh viễn sản phẩm này? Không thể khôi phục!"
      )
    )
      return;

    try {
      const { error } = await supabase
        .from("products")
        .delete()
        .eq("id", id);

      if (error) throw error;

      setProducts((prev) => prev.filter((p) => p.id !== id));
      setFilteredProducts((prev) =>
        prev.filter((p) => p.id !== id)
      );
    } catch (err) {
      console.error(err);
      alert("Xóa thất bại: " + err.message);
    }
  };

  // Pagination
  const totalItems = filteredProducts.length;
  const totalPages = Math.max(
    1,
    Math.ceil(totalItems / pageSize)
  );
  const start = (currentPage - 1) * pageSize;
  const end = start + pageSize;
  const pageItems = filteredProducts.slice(start, end);

  return (
    <div className="ap-container">
      <h1 className="ap-title">
        Quản lý sản phẩm{" "}
        <span className="ap-title-count">
          ({products.length})
        </span>
      </h1>

      {/* Form thêm mới */}
      <ProductForm onCreate={handleCreateProduct} />

      {/* Thanh search + filter */}
      <ProductSearchFilter
        filter={filterState}
        onChange={handleFilterChange}
      />

      {/* Danh sách sản phẩm */}
      {loading ? (
        <div className="ap-loading">
          Đang tải sản phẩm...
        </div>
      ) : totalItems === 0 ? (
        <div className="ap-empty">
          <p>Chưa có sản phẩm nào phù hợp.</p>
          <p>Hãy thêm sản phẩm mới ở phía trên.</p>
        </div>
      ) : (
        <>
          <ProductList
            products={pageItems}
            onViewDetail={(p) => setSelectedProduct(p)}
            onEdit={(p) => setEditingProduct(p)}
            onDelete={handleDeleteProduct}
          />

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onChange={setCurrentPage}
          />
        </>
      )}

      {/* Modal chi tiết */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}

      {/* Modal chỉnh sửa */}
      {editingProduct && (
        <ProductEditModal
          product={editingProduct}
          onClose={() => setEditingProduct(null)}
          onSave={(data) =>
            handleUpdateProduct(editingProduct.id, data)
          }
        />
      )}
    </div>
  );
}
