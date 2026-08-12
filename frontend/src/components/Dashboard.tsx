import { useEffect, useState } from 'react';
import './Dashboard.css';
import Customer from './Customer';
import Product from './Product';
import StockMovement from './StockMovement';
import SalesChallan from './SalesChallan';





interface DashboardProps {
  user: {
    name: string;
    email: string;
    role: string;
  };
  onLogout: () => void;
}





interface DashboardStats {
  customers: number;
  products: number;
  stock: number;
  challans: number;
}





function Dashboard({ user, onLogout }: DashboardProps) {
  const [currentPage, setCurrentPage] = useState('dashboard');

  const [stats, setStats] = useState<DashboardStats>({
    customers: 0,
    products: 0,
    stock: 0,
    challans: 0,
  });

  const [statsLoading, setStatsLoading] = useState(true);





  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        setStatsLoading(true);

        const token = localStorage.getItem('accessToken');

        const headers = {
          Authorization: `Bearer ${token}`,
        };

        const [
          customersResponse,
          productsResponse,
          challansResponse,
        ] = await Promise.all([
          fetch('http://localhost:3000/customers', {
            headers,
          }),
          fetch('http://localhost:3000/products', {
            headers,
          }),
          fetch('http://localhost:3000/sales-challans', {
            headers,
          }),
        ]);

        if (
          !customersResponse.ok ||
          !productsResponse.ok ||
          !challansResponse.ok
        ) {
          throw new Error('Failed to fetch dashboard statistics');
        }

        const customersData = await customersResponse.json();
        const productsData = await productsResponse.json();
        const challansData = await challansResponse.json();

        const customers = customersData.data || customersData;
        const products = productsData.data || productsData;
        const challans = challansData.data || challansData;

        const totalStock = Array.isArray(products)
          ? products.reduce(
              (
                total: number,
                product: {
                  currentStock: number;
                },
              ) =>
                total + Number(product.currentStock || 0),
              0,
            )
          : 0;

        setStats({
          customers: Array.isArray(customers)
            ? customersData.total ?? customers.length
            : 0,

          products: Array.isArray(products)
            ? productsData.total ?? products.length
            : 0,

          stock: totalStock,

          challans: Array.isArray(challans)
            ? challans.length
            : 0,
        });
      } catch (error) {
        console.error(
          'Failed to load dashboard statistics:',
          error,
        );
      } finally {
        setStatsLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);





  if (currentPage === 'customers') {
    return (
      <Customer
        onBack={() => setCurrentPage('dashboard')}
      />
    );
  }





  if (currentPage === 'products') {
    return (
      <Product
        onBack={() => setCurrentPage('dashboard')}
      />
    );
  }





  if (currentPage === 'stock-movements') {
    return (
      <StockMovement
        onBack={() => setCurrentPage('dashboard')}
      />
    );
  }





  if (currentPage === 'sales-challans') {
    return (
      <SalesChallan
        onBack={() => setCurrentPage('dashboard')}
      />
    );
  }





  return (
    <div className="dashboard">





      <aside className="sidebar">





        <div className="sidebar-logo">
          <div className="sidebar-logo-box">F</div>





          <div>
            <h2>FundsRoom</h2>
            <span>ERP</span>
          </div>
        </div>





        <nav className="sidebar-nav">





          <button
            className="nav-item active"
            onClick={() => setCurrentPage('dashboard')}
          >
            Dashboard
          </button>





          {(user.role === 'Admin' || user.role === 'Sales') && (
            <button
              className="nav-item"
              onClick={() => setCurrentPage('customers')}
            >
              Customers
            </button>
          )}






          {(user.role === 'Admin' || user.role === 'Warehouse') && (
            <button
              className="nav-item"
              onClick={() => setCurrentPage('products')}
            >
              Products
            </button>
          )}






          {(user.role === 'Admin' || user.role === 'Warehouse') && (
            <button
              className="nav-item"
              onClick={() => setCurrentPage('stock-movements')}
            >
              Stock Movements
            </button>
          )}






          {(user.role === 'Admin' || user.role === 'Sales') && (
            <button
              className="nav-item"
              onClick={() => setCurrentPage('sales-challans')}
            >
              Sales Challans
            </button>
          )}





        </nav>





        <button
          className="logout-button"
          onClick={onLogout}
        >
          Logout
        </button>





      </aside>






      <main className="dashboard-main">





        <header className="dashboard-header">





          <div>
            <h1>Dashboard</h1>
            <p>Welcome back to FundsRoom ERP</p>
          </div>





          <div className="user-info">





            <div className="user-avatar">
              {user.name.charAt(0).toUpperCase()}
            </div>





            <div>
              <strong>{user.name}</strong>
              <span>{user.role}</span>
            </div>





          </div>





        </header>






        <section className="dashboard-content">





          <div className="welcome-card">





            <div>
              <h2>Welcome, {user.name}!</h2>





              <p>
                Manage your customers, products, inventory
                and sales operations from here.
              </p>
            </div>





          </div>






          <div className="stats-grid">





            <div className="stat-card">
              <span className="stat-title">
                Customers
              </span>





              <strong>
                {statsLoading ? '...' : stats.customers}
              </strong>





              <p>Total customers</p>
            </div>






            <div className="stat-card">
              <span className="stat-title">
                Products
              </span>





              <strong>
                {statsLoading ? '...' : stats.products}
              </strong>





              <p>Total products</p>
            </div>






            <div className="stat-card">
              <span className="stat-title">
                Stock
              </span>





              <strong>
                {statsLoading ? '...' : stats.stock}
              </strong>





              <p>Current inventory</p>
            </div>






            <div className="stat-card">
              <span className="stat-title">
                Challans
              </span>





              <strong>
                {statsLoading ? '...' : stats.challans}
              </strong>





              <p>Sales challans</p>
            </div>





          </div>





        </section>





      </main>





    </div>
  );
}





export default Dashboard;