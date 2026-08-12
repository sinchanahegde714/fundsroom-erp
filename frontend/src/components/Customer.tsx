import { useEffect, useState } from 'react';
import './Customer.css';

const API_URL = import.meta.env.VITE_API_URL;

interface CustomerData {
  id: number;
  name: string;
  mobile: string;
  email: string;
  businessName: string;
  gstNumber?: string;
  customerType: string;
  address: string;
  status: string;
  followUpDate?: string;
  notes?: string;
}

interface CustomerProps {
  onBack: () => void;
}

function Customer({ onBack }: CustomerProps) {
  const [customers, setCustomers] = useState<CustomerData[]>([]);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingCustomer, setEditingCustomer] =
    useState<CustomerData | null>(null);

  const [selectedCustomer, setSelectedCustomer] =
    useState<CustomerData | null>(null);

  const [followUpNote, setFollowUpNote] = useState('');
  const [savingNote, setSavingNote] = useState(false);
  const [noteMessage, setNoteMessage] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    email: '',
    businessName: '',
    gstNumber: '',
    customerType: 'Retail',
    status: 'Lead',
    address: '',
    followUpDate: '',
    notes: '',
  });

  const getToken = () => {
    return localStorage.getItem('accessToken');
  };

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await fetch(`${API_URL}/customers`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch customers');
      }

      setCustomers(data.data);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Failed to fetch customers');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
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
      name: '',
      mobile: '',
      email: '',
      businessName: '',
      gstNumber: '',
      customerType: 'Retail',
      status: 'Lead',
      address: '',
      followUpDate: '',
      notes: '',
    });

    setEditingCustomer(null);
    setShowForm(false);
  };

  const handleEdit = (customer: CustomerData) => {
    setEditingCustomer(customer);

    setFormData({
      name: customer.name,
      mobile: customer.mobile,
      email: customer.email,
      businessName: customer.businessName,
      gstNumber: customer.gstNumber || '',
      customerType: customer.customerType,
      status: customer.status,
      address: customer.address,
      followUpDate: customer.followUpDate
        ? customer.followUpDate.substring(0, 10)
        : '',
      notes: customer.notes || '',
    });

    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setError('');

      const url = editingCustomer
        ? `${API_URL}/customers/${editingCustomer.id}`
        : `${API_URL}/customers`;

      const method = editingCustomer ? 'PATCH' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({
          ...formData,
          gstNumber: formData.gstNumber || undefined,
          followUpDate: formData.followUpDate || undefined,
          notes: formData.notes || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to save customer');
      }

      resetForm();
      await fetchCustomers();
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Failed to save customer');
      }
    }
  };

  const handleSaveFollowUpNote = async () => {
    if (!selectedCustomer) {
      return;
    }

    try {
      setSavingNote(true);
      setNoteMessage('');
      setError('');

      const response = await fetch(
        `${API_URL}/customers/${selectedCustomer.id}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getToken()}`,
          },
          body: JSON.stringify({
            notes: followUpNote,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to save follow-up note');
      }

      const updatedCustomer = {
        ...selectedCustomer,
        notes: followUpNote,
      };

      setSelectedCustomer(updatedCustomer);
      setNoteMessage('Follow-up note saved successfully.');

      await fetchCustomers();
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Failed to save follow-up note');
      }
    } finally {
      setSavingNote(false);
    }
  };

  const filteredCustomers = customers.filter((customer) => {
    const searchValue = search.toLowerCase();

    return (
      customer.name.toLowerCase().includes(searchValue) ||
      customer.businessName.toLowerCase().includes(searchValue) ||
      customer.mobile.includes(searchValue) ||
      customer.email.toLowerCase().includes(searchValue)
    );
  });

  return (
    <div className="customer-page">

      <div className="customer-header">

        <div>
          <button
            className="back-button"
            onClick={onBack}
          >
            ← Dashboard
          </button>

          <h1>Customers</h1>
          <p>Manage your customer and CRM information</p>
        </div>

        <button
          className="add-customer-button"
          onClick={() => {
            setEditingCustomer(null);
            setShowForm(true);
          }}
        >
          + Add Customer
        </button>

      </div>

      {error && (
        <div className="customer-error">
          {error}
        </div>
      )}

      {selectedCustomer && (
        <div className="customer-form-card">

          <div className="form-card-header">
            <h2>Customer Details</h2>

            <button
              className="close-button"
              onClick={() => {
                setSelectedCustomer(null);
                setFollowUpNote('');
                setNoteMessage('');
              }}
            >
              ×
            </button>
          </div>

          <div className="customer-details">

            <div>
              <strong>Customer Name</strong>
              <p>{selectedCustomer.name}</p>
            </div>

            <div>
              <strong>Mobile</strong>
              <p>{selectedCustomer.mobile}</p>
            </div>

            <div>
              <strong>Email</strong>
              <p>{selectedCustomer.email}</p>
            </div>

            <div>
              <strong>Business Name</strong>
              <p>{selectedCustomer.businessName}</p>
            </div>

            <div>
              <strong>GST Number</strong>
              <p>{selectedCustomer.gstNumber || '—'}</p>
            </div>

            <div>
              <strong>Customer Type</strong>
              <p>{selectedCustomer.customerType}</p>
            </div>

            <div>
              <strong>Status</strong>
              <p>{selectedCustomer.status}</p>
            </div>

            <div>
              <strong>Follow-up Date</strong>
              <p>
                {selectedCustomer.followUpDate
                  ? selectedCustomer.followUpDate.substring(0, 10)
                  : '—'}
              </p>
            </div>

            <div className="full-width">
              <strong>Address</strong>
              <p>{selectedCustomer.address}</p>
            </div>

            <div className="full-width">
              <strong>Notes</strong>
              <p>{selectedCustomer.notes || 'No notes added.'}</p>
            </div>

          </div>

          <div className="follow-up-section">

            <h3>Follow-up Notes</h3>

            <textarea
              className="follow-up-textarea"
              placeholder="Add or update follow-up notes..."
              value={followUpNote}
              onChange={(e) => setFollowUpNote(e.target.value)}
            />

            {noteMessage && (
              <div className="note-success">
                {noteMessage}
              </div>
            )}

            <button
              className="save-note-button"
              onClick={handleSaveFollowUpNote}
              disabled={savingNote}
            >
              {savingNote
                ? 'Saving...'
                : 'Save Follow-up Note'}
            </button>

          </div>

        </div>
      )}

      {showForm && (
        <div className="customer-form-card">

          <div className="form-card-header">
            <h2>
              {editingCustomer
                ? 'Edit Customer'
                : 'Add Customer'}
            </h2>

            <button
              className="close-button"
              onClick={resetForm}
            >
              ×
            </button>
          </div>

          <form onSubmit={handleSubmit}>

            <div className="customer-form-grid">

              <div className="customer-form-group">
                <label>Customer Name</label>
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="customer-form-group">
                <label>Mobile Number</label>
                <input
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="customer-form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="customer-form-group">
                <label>Business Name</label>
                <input
                  name="businessName"
                  value={formData.businessName}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="customer-form-group">
                <label>GST Number</label>
                <input
                  name="gstNumber"
                  value={formData.gstNumber}
                  onChange={handleInputChange}
                />
              </div>

              <div className="customer-form-group">
                <label>Customer Type</label>
                <select
                  name="customerType"
                  value={formData.customerType}
                  onChange={handleInputChange}
                >
                  <option value="Retail">Retail</option>
                  <option value="Wholesale">Wholesale</option>
                  <option value="Distributor">Distributor</option>
                </select>
              </div>

              <div className="customer-form-group">
                <label>Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                >
                  <option value="Lead">Lead</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              <div className="customer-form-group">
                <label>Follow-up Date</label>
                <input
                  type="date"
                  name="followUpDate"
                  value={formData.followUpDate}
                  onChange={handleInputChange}
                />
              </div>

              <div className="customer-form-group full-width">
                <label>Address</label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="customer-form-group full-width">
                <label>Notes</label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
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
                className="save-customer-button"
              >
                {editingCustomer
                  ? 'Update Customer'
                  : 'Save Customer'}
              </button>

            </div>

          </form>

        </div>
      )}

      {!showForm && !selectedCustomer && (
        <>
          <div className="customer-toolbar">

            <input
              className="customer-search"
              placeholder="Search by name, business, mobile or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

          </div>

          <div className="customer-table-card">

            {loading ? (
              <div className="customer-loading">
                Loading customers...
              </div>
            ) : filteredCustomers.length === 0 ? (
              <div className="customer-empty">
                No customers found.
              </div>
            ) : (
              <div className="table-wrapper">

                <table>

                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Business</th>
                      <th>Mobile</th>
                      <th>Type</th>
                      <th>Status</th>
                      <th>Follow-up</th>
                      <th>Action</th>
                    </tr>
                  </thead>

                  <tbody>

                    {filteredCustomers.map((customer) => (
                      <tr key={customer.id}>

                        <td>
                          <strong>{customer.name}</strong>
                        </td>

                        <td>
                          {customer.businessName}
                        </td>

                        <td>
                          {customer.mobile}
                        </td>

                        <td>
                          {customer.customerType}
                        </td>

                        <td>
                          <span
                            className={`status-badge ${customer.status.toLowerCase()}`}
                          >
                            {customer.status}
                          </span>
                        </td>

                        <td>
                          {customer.followUpDate
                            ? customer.followUpDate.substring(0, 10)
                            : '—'}
                        </td>

                        <td>
                          <div className="customer-actions">

                            <button
                              className="view-button"
                              onClick={() => {
                                setSelectedCustomer(customer);
                                setFollowUpNote(customer.notes || '');
                                setNoteMessage('');
                              }}
                            >
                              View
                            </button>

                            <button
                              className="edit-button"
                              onClick={() =>
                                handleEdit(customer)
                              }
                            >
                              Edit
                            </button>

                          </div>
                        </td>

                      </tr>
                    ))}

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

export default Customer;