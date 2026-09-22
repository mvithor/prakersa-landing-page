import { Route, Routes } from 'react-router-dom';
import MainLayout from '@/layouts/MainLayout/MainLayout';
import Demo from '@/pages/Demo/Demo';
import Home from '@/pages/Home/Home';
import NotFound from '@/pages/NotFound/NotFound';
import Privacy from '@/pages/Privacy/Privacy';
import RolePage from '@/pages/RolePage/RolePage';
import { PATHS } from './paths';

// Peta rute. Halaman peran berbagi satu templat dan dibedakan lewat roleKey.
export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path={PATHS.home} element={<Home />} />
        <Route path={PATHS.school} element={<RolePage key="school" roleKey="school" />} />
        <Route path={PATHS.industry} element={<RolePage key="industry" roleKey="industry" />} />
        <Route path={PATHS.demo} element={<Demo />} />
        <Route path={PATHS.privacy} element={<Privacy />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
