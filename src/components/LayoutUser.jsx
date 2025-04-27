// import SidebarUser from '../components/SidebarUser'; 
import SidebarUser from './SidebarUser';
import Header from './Header';
import Footer from './Footer';
import { Outlet } from 'react-router-dom';

const LayoutUser = () => {
  return (
    <div className="flex">
      <SidebarUser />
      <div className="ml-64 w-full flex flex-col min-h-screen">
        <Header />
        
        <main className="flex-grow p-6 bg-gray-50">
          <Outlet />
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default LayoutUser;

