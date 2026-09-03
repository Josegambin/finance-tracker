import {
  BrowserRouter,
  Navigate,
  Route,
  Routes
} from 'react-router-dom';

import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/DashboardPage';
import ProtectedRoute from './components/ProtectedRoute';
import CategoriesPage from './pages/CategoriesPage';
import TransactionsPage from './pages/TransationPage';
import BudgetsPage from './pages/BudgetsPage';

function App() {

  return (
    <BrowserRouter>

      <Routes>

        <Route
          path="/"
          element={
            <Navigate
              to="/login"
              replace
            />
          }
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/categories"
          element={
            <ProtectedRoute>
              <CategoriesPage  />
            </ProtectedRoute>
          }
        />

        <Route
          path="/transactions"
          element={
            <ProtectedRoute>
              <TransactionsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/budgets"
          element={<BudgetsPage />}
        />

        <Route
          path="*"
          element={
            <Navigate
              to="/login"
              replace
            />
          }
        />
    
      </Routes>

    </BrowserRouter>
  );
}

export default App;