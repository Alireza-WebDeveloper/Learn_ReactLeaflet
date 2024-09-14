import { Outlet } from 'react-router-dom';
import Header from '../../components/header';

const MainLayout = () => {
  return (
    <>
      <Header />
      <main className="mt-3 mx-auto container p-2">{<Outlet />}</main>
    </>
  );
};

export default MainLayout;
