import { useEffect, useState } from 'react';
import './StockMovement.css';

interface ProductData {
  id: number;
  name: string;
  sku: string;
  currentStock: number;
}

interface UserData {
  id: number;
  name: string;
  email: string;
}

interface StockMovementData {
  id: number;
  product: ProductData;
  quantityChanged: number;
  movementType: 'IN' | 'OUT';
  reason: string;
  createdBy: UserData;
  createdAt: string;
}

interface StockMovementProps {
  onBack: () => void;
}

function StockMovement({ onBack }: StockMovementProps) {
  const [movements, setMovements] = useState<StockMovementData[]>([]);
  const [products, setProducts] = useState<ProductData[]>([]);

  const [showForm, setShowForm] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    productId: '',
    quantityChanged: '',
    movementType: 'IN',
    reason: '',
  });

  const getToken = () => {
    return localStorage.getItem('accessToken');
  };

  const getUserId = () => {
    const storedUser = localStorage.getItem('user');

    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        return user.id;
      } catch {
        return null;
      }
    }

    return null;
  };

  const fetchMovements = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await fetch(
        'http://localhost:3000/stock-movements',
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || 'Failed to fetch stock movements',
        );
      }

      setMovements(data);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Failed to fetch stock movements');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch(
        'http://localhost:3000/products',
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || 'Failed to fetch products',
        );
      }

      setProducts(data.data || data);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Failed to fetch products');
      }
    }
  };

  useEffect(() => {
    fetchMovements();
    fetchProducts();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setFormData({
      productId: '',
      quantityChanged: '',
      movementType: 'IN',
      reason: '',
    });

    setShowForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setError('');

      const userId = getUserId();

      if (!userId) {
        throw new Error(
          'Logged-in user information not found',
        );
      }

      const response = await fetch(
        'http://localhost:3000/stock-movements',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getToken()}`,
          },
          body: JSON.stringify({
            productId: Number(formData.productId),
            quantityChanged: Number(
              formData.quantityChanged,
            ),
            movementType: formData.movementType,
            reason: formData.reason,
            createdBy: Number(userId),
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || 'Failed to create stock movement',
        );
      }

      resetForm();

      await fetchMovements();
      await fetchProducts();
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Failed to create stock movement');
      }
    }
  };

  return (
    <div className="stock-movement-page">

      <div className="stock-movement-header">

        <div>
          <button
            className="back-button"
            onClick={onBack}
          >
            ← Dashboard
          </button>

          <h1>Stock Movements</h1>

          <p>
            Track stock additions and deductions
          </p>
        </div>

        <button
          className="add-movement-button"
          onClick={() => setShowForm(true)}
        >
          + Add Movement
        </button>

      </div>

      {error && (
        <div className="stock-movement-error">
          {error}
        </div>
      )}

      {showForm && (
        <div className="stock-movement-form-card">

          <div className="form-card-header">

            <h2>
              Add Stock Movement
            </h2>

            <button
              className="close-button"
              onClick={resetForm}
            >
              ×
            </button>

          </div>

          <form onSubmit={handleSubmit}>

            <div className="stock-movement-form-grid">

              <div className="stock-movement-form-group">
                <label>Product</label>

                <select
                  name="productId"
                  value={formData.productId}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">
                    Select product
                  </option>

                  {products.map((product) => (
                    <option
                      key={product.id}
                      value={product.id}
                    >
                      {product.name} — {product.sku}
                    </option>
                  ))}
                </select>
              </div>

              <div className="stock-movement-form-group">
                <label>Movement Type</label>

                <select
                  name="movementType"
                  value={formData.movementType}
                  onChange={handleInputChange}
                  required
                >
                  <option value="IN">
                    IN
                  </option>

                  <option value="OUT">
                    OUT
                  </option>
                </select>
              </div>

              <div className="stock-movement-form-group">
                <label>Quantity</label>

                <input
                  type="number"
                  name="quantityChanged"
                  min="1"
                  value={formData.quantityChanged}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="stock-movement-form-group full-width">
                <label>Reason</label>

                <textarea
                  name="reason"
                  value={formData.reason}
                  onChange={handleInputChange}
                  placeholder="Enter reason for stock movement"
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
                className="save-movement-button"
              >
                Save Movement
              </button>

            </div>

          </form>

        </div>
      )}

      {!showForm && (
        <div className="stock-movement-table-card">

          {loading ? (
            <div className="stock-movement-loading">
              Loading stock movements...
            </div>
          ) : movements.length === 0 ? (
            <div className="stock-movement-empty">
              No stock movements found.
            </div>
          ) : (
            <div className="table-wrapper">

              <table>

                <thead>
                  <tr>
                    <th>Product</th>
                    <th>SKU</th>
                    <th>Type</th>
                    <th>Quantity</th>
                    <th>Reason</th>
                    <th>Created By</th>
                    <th>Date</th>
                  </tr>
                </thead>

                <tbody>

                  {movements.map((movement) => (
                    <tr key={movement.id}>

                      <td>
                        <strong>
                          {movement.product.name}
                        </strong>
                      </td>

                      <td>
                        {movement.product.sku}
                      </td>

                      <td>
                        <span
                          className={
                            movement.movementType === 'IN'
                              ? 'movement-badge movement-in'
                              : 'movement-badge movement-out'
                          }
                        >
                          {movement.movementType}
                        </span>
                      </td>

                      <td>
                        {movement.quantityChanged}
                      </td>

                      <td>
                        {movement.reason}
                      </td>

                      <td>
                        {movement.createdBy.name}
                      </td>

                      <td>
                        {new Date(
                          movement.createdAt,
                        ).toLocaleString()}
                      </td>

                    </tr>
                  ))}

                </tbody>

              </table>

            </div>
          )}

        </div>
      )}

    </div>
  );
}

export default StockMovement;