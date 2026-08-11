import { useState } from 'react';
import './Dashboard.css';
import Customer from './Customer';
import Product from './Product';
import StockMovement from './StockMovement';



interface DashboardProps {
  user: {
    name: string;
    email: string;
    role: string;
  };
  onLogout: () => void;
}



function Dashboard({ user, onLogout }: DashboardProps) {
  const [currentPage, setCurrentPage] = useState('dashboard');



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



          <button
            className="nav-item"
            onClick={() => setCurrentPage('customers')}
          >
            Customers
          </button>



          <button
            className="nav-item"
            onClick={() => setCurrentPage('products')}
          >
            Products
          </button>



          <button
            className="nav-item"
            onClick={() => setCurrentPage('stock-movements')}
          >
            Stock Movements
          </button>



          <button className="nav-item">
            Sales Challans
          </button>



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



              <strong>—</strong>



              <p>Total customers</p>
            </div>




            <div className="stat-card">
              <span className="stat-title">
                Products
              </span>



              <strong>—</strong>



              <p>Total products</p>
            </div>




            <div className="stat-card">
              <span className="stat-title">
                Stock
              </span>



              <strong>—</strong>



              <p>Current inventory</p>
            </div>




            <div className="stat-card">
              <span className="stat-title">
                Challans
              </span>



              <strong>—</strong>



              <p>Sales challans</p>
            </div>



          </div>



        </section>



      </main>



    </div>
  );
}



export default Dashboard;