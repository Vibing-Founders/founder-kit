import { Route, Routes } from 'react-router-dom';
import AllCustomers from './pages/admin/AllCustomers';
import Account from './pages/Account';

export default function App() {
  return (
    <Routes>
      <Route path="/account" element={<Account />} />
      <Route path="/admin/customers" element={<AllCustomers />} />
    </Routes>
  );
}
