## FundsRoom ERP

A full-stack ERP and CRM Operations Portal designed to manage customers, products, inventory, stock movements, and sales challans.

## Live Demo

**Frontend:** https://fundsroom-frontend-nks7.onrender.com

**Backend:** https://fundsroom-erp-coep.onrender.com

## Features

### Authentication & Authorization

- Secure login using email and password
- JWT-based authentication
- Password hashing using bcrypt
- Role-based access control
- Different access levels for Admin, Sales, Warehouse, and Accounts users

### Customer Management

- Add customers
- View customer details
- Edit customer information
- Search customers
- Manage customer and CRM information

### Product Management

- Add products
- View products
- Edit product information
- Track current stock
- Search products

### Stock Management

- Record stock movements
- Track inventory changes
- Monitor current stock levels

### Sales Challans

- Create sales challans
- View sales challans
- Manage challan information
- Connect customers and products with sales transactions

### Dashboard

- Customer count
- Product count
- Current inventory
- Sales challan count
- Role-based navigation

## 🛠️ Tech Stack

### Frontend

- React
- TypeScript
- Vite
- CSS

### Backend

- NestJS
- TypeScript
- REST APIs
- JWT
- Passport
- bcrypt
- Class Validator

### Database

- PostgreSQL
- TypeORM

### Deployment

- Render
- GitHub

## Project Structure

```text
fundsroom-erp/
│
├── backend/
│   └── backend/
│       ├── src/
│       │   ├── auth/
│       │   ├── customer/
│       │   ├── product/
│       │   ├── stock-movement/
│       │   ├── sales-challan/
│       │   └── ...
│       ├── package.json
│       └── ...
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Customer.tsx
│   │   │   ├── Product.tsx
│   │   │   ├── StockMovement.tsx
│   │   │   ├── SalesChallan.tsx
│   │   │   └── Dashboard.tsx
│   │   ├── App.tsx
│   │   └── ...
│   ├── package.json
│   └── ...
│
└── README.md

.env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_local_password
DB_NAME=fundsroom_erp
JWT_SECRET=your_jwt_secret

##Demo Login Credentials

The application provides different access levels based on user roles.

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@fundsroom.com | Admin@123 |
| Sales | sales@fundsroom.com | Sales@123 |
| Warehouse | warehouse@fundsroom.com | Sales@123 |
| Accounts | accounts@fundsroom.com | Sales@123 |

> These credentials are provided for demonstration and testing purposes only.

##Conclusion

FundsRoom ERP is a full-stack business management application that brings customer management, product management, inventory tracking, stock movements, and sales operations into one platform.

The application uses React and TypeScript for the frontend, NestJS for the backend, and PostgreSQL for data storage. JWT authentication and role-based access control help ensure that users can access the features relevant to their responsibilities.

The project is deployed using Render, making the application accessible through a live web interface while maintaining a separate backend and database layer.
