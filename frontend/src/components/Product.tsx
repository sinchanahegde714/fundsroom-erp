import { useEffect, useState } from 'react';
import './Product.css';

interface ProductData {
  id: number;
  name: string;
  sku: string;
  category: string;
  unitPrice: number;
  currentStock: number;
  minimumStockAlertQuantity: number;
  location: string;
}

interface ProductProps {
  onBack: () => void;
}

function Product({ onBack }: ProductProps) {
  const [products, setProducts] = useState<ProductData[]>([]);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] =
    useState<ProductData | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    category: '',
    unitPrice: '',
    currentStock: '',
    minimumStockAlertQuantity: '',
    location: '',
  });

  const getToken = () => {
    return localStorage.getItem('accessToken');
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await fetch('http://localhost:3000/products', {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch products');
      }

      setProducts(data.data || data);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Failed to fetch products');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setFormData({
      name: '',
      sku: '',
      category: '',
      unitPrice: '',
      currentStock: '',
      minimumStockAlertQuantity: '',
      location: '',
    });

    setEditingProduct(null);
    setShowForm(false);
  };

  const handleEdit = (product: ProductData) => {
    setEditingProduct(product);

    setFormData({
      name: product.name,
      sku: product.sku,
      category: product.category,
      unitPrice: String(product.unitPrice),
      currentStock: String(product.currentStock),
      minimumStockAlertQuantity: String(
        product.minimumStockAlertQuantity,
      ),
      location: product.location,
    });

    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setError('');

      const url = editingProduct
        ? `http://localhost:3000/products/${editingProduct.id}`
        : 'http://localhost:3000/products';

      const method = editingProduct ? 'PATCH' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({
          name: formData.name,
          sku: formData.sku,
          category: formData.category,
          unitPrice: Number(formData.unitPrice),
          currentStock: Number(formData.currentStock),
          minimumStockAlertQuantity: Number(
            formData.minimumStockAlertQuantity,
          ),
          location: formData.location,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to save product');
      }

      resetForm();
      await fetchProducts();
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Failed to save product');
      }
    }
  };

  const filteredProducts = products.filter((product) => {
    const searchValue = search.toLowerCase();

    return (
      product.name.toLowerCase().includes(searchValue) ||
      product.sku.toLowerCase().includes(searchValue) ||
      product.category.toLowerCase().includes(searchValue) ||
      product.location.toLowerCase().includes(searchValue)
    );
  });

  return (
    <div className="product-page">

      <div className="product-header">

        <div>
          <button
            className="back-button"
            onClick={onBack}
          >
            ← Dashboard
          </button>

          <h1>Products</h1>
          <p>Manage products and inventory information</p>
        </div>

        <button
          className="add-product-button"
          onClick={() => {
            setEditingProduct(null);
            setShowForm(true);
          }}
        >
          + Add Product
        </button>

      </div>

      {error && (
        <div className="product-error">
          {error}
        </div>
      )}

      {showForm && (
        <div className="product-form-card">

          <div className="form-card-header">
            <h2>
              {editingProduct
                ? 'Edit Product'
                : 'Add Product'}
            </h2>

            <button
              className="close-button"
              onClick={resetForm}
            >
              ×
            </button>
          </div>

          <form onSubmit={handleSubmit}>

            <div className="product-form-grid">

              <div className="product-form-group">
                <label>Product Name</label>

                <input
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="product-form-group">
                <label>SKU / Code</label>

                <input
                  name="sku"
                  value={formData.sku}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="product-form-group">
                <label>Category</label>

                <input
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="product-form-group">
                <label>Unit Price</label>

                <input
                  type="number"
                  min="0"
                  step="0.01"
                  name="unitPrice"
                  value={formData.unitPrice}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="product-form-group">
                <label>Current Stock</label>

                <input
                  type="number"
                  min="0"
                  name="currentStock"
                  value={formData.currentStock}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="product-form-group">
                <label>Minimum Stock Alert Quantity</label>

                <input
                  type="number"
                  min="0"
                  name="minimumStockAlertQuantity"
                  value={formData.minimumStockAlertQuantity}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="product-form-group full-width">
                <label>Location / Warehouse</label>

                <input
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  required
                />
              </div>

            </div>

            <div className="form-actions">

              <button
                type="button"
                className="cancel-button"
                onClick={resetForm}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="save-product-button"
              >
                {editingProduct
                  ? 'Update Product'
                  : 'Save Product'}
              </button>

            </div>

          </form>

        </div>
      )}

      {!showForm && (
        <>
          <div className="product-toolbar">

            <input
              className="product-search"
              placeholder="Search by name, SKU, category or location..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

          </div>

          <div className="product-table-card">

            {loading ? (
              <div className="product-loading">
                Loading products...
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="product-empty">
                No products found.
              </div>
            ) : (
              <div className="table-wrapper">

                <table>

                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>SKU</th>
                      <th>Category</th>
                      <th>Unit Price</th>
                      <th>Current Stock</th>
                      <th>Min Alert</th>
                      <th>Location</th>
                      <th>Action</th>
                    </tr>
                  </thead>

                  <tbody>

                    {filteredProducts.map((product) => {

                      const isLowStock =
                        product.currentStock <=
                        product.minimumStockAlertQuantity;

                      return (
                        <tr key={product.id}>

                          <td>
                            <strong>{product.name}</strong>
                          </td>

                          <td>
                            {product.sku}
                          </td>

                          <td>
                            {product.category}
                          </td>

                          <td>
                            ₹{Number(product.unitPrice).toFixed(2)}
                          </td>

                          <td>
                            <span
                              className={
                                isLowStock
                                  ? 'stock-badge low-stock'
                                  : 'stock-badge'
                              }
                            >
                              {product.currentStock}
                            </span>
                          </td>

                          <td>
                            {product.minimumStockAlertQuantity}
                          </td>

                          <td>
                            {product.location}
                          </td>

                          <td>
                            <button
                              className="edit-product-button"
                              onClick={() =>
                                handleEdit(product)
                              }
                            >
                              Edit
                            </button>
                          </td>

                        </tr>
                      );
                    })}

                  </tbody>

                </table>

              </div>
            )}

          </div>
        </>
      )}

    </div>
  );
}

export default Product;