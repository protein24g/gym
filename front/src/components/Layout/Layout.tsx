import { FC } from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../Header/Header';
import Sidebar from '../Sidebar/Sidebar';

const Layout: FC = () => {
  return (
    <div className="flex h-screen bg-slate-100">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-auto">
        <Header />
        <div className="p-3 overflow-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;
