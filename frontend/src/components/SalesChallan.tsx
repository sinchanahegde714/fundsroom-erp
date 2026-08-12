import { useEffect, useState } from 'react';
import './SalesChallan.css';

interface CustomerData {
  id: number;
  name: string;
  businessName: string;
}

interface ProductData {
  id: number;
  name: string;
  sku: string;
  unitPrice: number;
  currentStock: number;
}

interface ChallanItem {
  id: number;
  product: ProductData;
  productNameSnapshot: string;
  skuSnapshot: string;
  unitPriceSnapshot: number;
  quantity: number;
}

interface SalesChallanData {
  id: number;
  challanNumber: string;
  customer: CustomerData;
  totalQuantity: number;
  status: string;
  createdBy: {
    id: number;
    name: string;
  };
  items: ChallanItem[];
  createdAt: string;
}

interface SalesChallanProps {
  onBack: () => void;
}

interface FormItem {
  productId: string;
  quantity: string;
}

function SalesChallan({ onBack }: SalesChallanProps) {
  const [challans, setChallans] = useState<SalesChallanData[]>([]);
  const [customers, setCustomers] = useState<CustomerData[]>([]);
  const [products, setProducts] = useState<ProductData[]>([]);

  const [showForm, setShowForm] = useState(false);
  const [selectedChallan, setSelectedChallan] =
    useState<SalesChallanData | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    customerId: '',
    status: 'Draft',
  });

  const [items, setItems] = useState<FormItem[]>([
    {
      productId: '',
      quantity: '',
    },
  ]);

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

  const fetchChallans = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await fetch(
        'http://localhost:3000/sales-challans',
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || 'Failed to fetch sales challans',
        );
      }

      setChallans(data);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Failed to fetch sales challans');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchCustomers = async () => {
    try {
      const response = await fetch(
        'http://localhost:3000/customers',
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || 'Failed to fetch customers',
        );
      }

      setCustomers(data.data || data);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Failed to fetch customers');
      }
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
    fetchChallans();
    fetchCustomers();
    fetchProducts();
  }, []);

  const handleFormChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleItemChange = (
    index: number,
    field: keyof FormItem,
    value: string,
  ) => {
    setItems((previous) =>
      previous.map((item, itemIndex) =>
        itemIndex === index
          ? {
              ...item,
              [field]: value,
            }
          : item,
      ),
    );
  };

  const addItem = () => {
    setItems((previous) => [
      ...previous,
      {
        productId: '',
        quantity: '',
      },
    ]);
  };

  const removeItem = (index: number) => {
    if (items.length === 1) {
      return;
    }

    setItems((previous) =>
      previous.filter(
        (_, itemIndex) => itemIndex !== index,
      ),
    );
  };

  const resetForm = () => {
    setFormData({
      customerId: '',
      status: 'Draft',
    });

    setItems([
      {
        productId: '',
        quantity: '',
      },
    ]);

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

      const validItems = items.filter(
        (item) =>
          item.productId !== '' &&
          Number(item.quantity) > 0,
      );

      if (validItems.length === 0) {
        throw new Error(
          'Add at least one product with a valid quantity',
        );
      }

      const response = await fetch(
        'http://localhost:3000/sales-challans',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getToken()}`,
          },
          body: JSON.stringify({
            customerId: Number(formData.customerId),
            items: validItems.map((item) => ({
              productId: Number(item.productId),
              quantity: Number(item.quantity),
            })),
            status: formData.status,
            createdBy: Number(userId),
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          Array.isArray(data.message)
            ? data.message.join(', ')
            : data.message || 'Failed to create challan',
        );
      }

      resetForm();
      await fetchChallans();
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Failed to create challan');
      }
    }
  };

  const calculateTotalQuantity = () => {
    return items.reduce(
      (total, item) =>
        total + (Number(item.quantity) || 0),
      0,
    );
  };

  return (
    <div className="sales-challan-page">

      <div className="sales-challan-header">

        <div>
          <button
            className="back-button"
            onClick={onBack}
          >
            ← Dashboard
          </button>

          <h1>Sales Challans</h1>

          <p>
            Create and manage sales challans
          </p>
        </div>

        <button
          className="add-challan-button"
          onClick={() => setShowForm(true)}
        >
          + Create Challan
        </button>

      </div>

      {error && (
        <div className="sales-challan-error">
          {error}
        </div>
      )}

      {selectedChallan && (
        <div className="sales-challan-details-card">

          <div className="form-card-header">

            <h2>
              Challan Details
            </h2>

            <button
              className="close-button"
              onClick={() =>
                setSelectedChallan(null)
              }
            >
              ×
            </button>

          </div>

          <div className="challan-details-grid">

            <div>
              <strong>Challan Number</strong>
              <p>{selectedChallan.challanNumber}</p>
            </div>

            <div>
              <strong>Customer</strong>
              <p>
                {selectedChallan.customer.name}
              </p>
            </div>

            <div>
              <strong>Business</strong>
              <p>
                {selectedChallan.customer.businessName}
              </p>
            </div>

            <div>
              <strong>Status</strong>
              <p>
                {selectedChallan.status}
              </p>
            </div>

            <div>
              <strong>Total Quantity</strong>
              <p>
                {selectedChallan.totalQuantity}
              </p>
            </div>

            <div>
              <strong>Created By</strong>
              <p>
                {selectedChallan.createdBy.name}
              </p>
            </div>

          </div>

          <h3 className="challan-items-title">
            Products
          </h3>

          <div className="table-wrapper">

            <table>

              <thead>
                <tr>
                  <th>Product</th>
                  <th>SKU</th>
                  <th>Unit Price</th>
                  <th>Quantity</th>
                </tr>
              </thead>

              <tbody>

                {selectedChallan.items.map(
                  (item) => (
                    <tr key={item.id}>

                      <td>
                        {item.productNameSnapshot}
                      </td>

                      <td>
                        {item.skuSnapshot}
                      </td>

                      <td>
                        ₹
                        {Number(
                          item.unitPriceSnapshot,
                        ).toFixed(2)}
                      </td>

                      <td>
                        {item.quantity}
                      </td>

                    </tr>
                  ),
                )}

              </tbody>

            </table>

          </div>

        </div>
      )}

      {showForm && (
        <div className="sales-challan-form-card">

          <div className="form-card-header">

            <h2>
              Create Sales Challan
            </h2>

            <button
              className="close-button"
              onClick={resetForm}
            >
              ×
            </button>

          </div>

          <form onSubmit={handleSubmit}>

            <div className="sales-challan-form-grid">

              <div className="sales-challan-form-group">
                <label>Customer</label>

                <select
                  name="customerId"
                  value={formData.customerId}
                  onChange={handleFormChange}
                  required
                >
                  <option value="">
                    Select customer
                  </option>

                  {customers.map((customer) => (
                    <option
                      key={customer.id}
                      value={customer.id}
                    >
                      {customer.name} —{' '}
                      {customer.businessName}
                    </option>
                  ))}

                </select>
              </div>

              <div className="sales-challan-form-group">
                <label>Status</label>

                <select
                  name="status"
                  value={formData.status}
                  onChange={handleFormChange}
                >
                  <option value="Draft">
                    Draft
                  </option>

                  <option value="Confirmed">
                    Confirmed
                  </option>

                  <option value="Cancelled">
                    Cancelled
                  </option>
                </select>
              </div>

            </div>

            <div className="challan-products-section">

              <div className="challan-products-header">

                <h3>Products</h3>

                <button
                  type="button"
                  className="add-item-button"
                  onClick={addItem}
                >
                  + Add Product
                </button>

              </div>

              {items.map((item, index) => {

                const selectedProduct =
                  products.find(
                    (product) =>
                      product.id ===
                      Number(item.productId),
                  );

                return (
                  <div
                    className="challan-product-row"
                    key={index}
                  >

                    <div className="sales-challan-form-group">

                      <label>
                        Product
                      </label>

                      <select
                        value={item.productId}
                        onChange={(e) =>
                          handleItemChange(
                            index,
                            'productId',
                            e.target.value,
                          )
                        }
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
                            {product.name} —{' '}
                            {product.sku}
                          </option>
                        ))}

                      </select>

                      {selectedProduct && (
                        <small className="product-stock-info">
                          Stock: {selectedProduct.currentStock}
                          {' | '}
                          Price: ₹
                          {Number(
                            selectedProduct.unitPrice,
                          ).toFixed(2)}
                        </small>
                      )}

                    </div>

                    <div className="sales-challan-form-group">

                      <label>
                        Quantity
                      </label>

                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) =>
                          handleItemChange(
                            index,
                            'quantity',
                            e.target.value,
                          )
                        }
                        required
                      />

                    </div>

                    <button
                      type="button"
                      className="remove-item-button"
                      onClick={() =>
                        removeItem(index)
                      }
                      disabled={items.length === 1}
                    >
                      Remove
                    </button>

                  </div>
                );
              })}

            </div>

            <div className="challan-total">

              <span>
                Total Quantity
              </span>

              <strong>
                {calculateTotalQuantity()}
              </strong>

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
                className="save-challan-button"
              >
                Create Challan
              </button>

            </div>

          </form>

        </div>
      )}

      {!showForm && !selectedChallan && (
        <div className="sales-challan-table-card">

          {loading ? (
            <div className="sales-challan-loading">
              Loading sales challans...
            </div>
          ) : challans.length === 0 ? (
            <div className="sales-challan-empty">
              No sales challans found.
            </div>
          ) : (
            <div className="table-wrapper">

              <table>

                <thead>
                  <tr>
                    <th>Challan Number</th>
                    <th>Customer</th>
                    <th>Total Quantity</th>
                    <th>Status</th>
                    <th>Created By</th>
                    <th>Date</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>

                  {challans.map((challan) => (
                    <tr key={challan.id}>

                      <td>
                        <strong>
                          {challan.challanNumber}
                        </strong>
                      </td>

                      <td>
                        {challan.customer.name}
                      </td>

                      <td>
                        {challan.totalQuantity}
                      </td>

                      <td>
                        <span
                          className={`challan-status-badge ${challan.status.toLowerCase()}`}
                        >
                          {challan.status}
                        </span>
                      </td>

                      <td>
                        {challan.createdBy.name}
                      </td>

                      <td>
                        {new Date(
                          challan.createdAt,
                        ).toLocaleString()}
                      </td>

                      <td>

                        <button
                          className="view-challan-button"
                          onClick={() =>
                            setSelectedChallan(
                              challan,
                            )
                          }
                        >
                          View
                        </button>

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

export default SalesChallan;