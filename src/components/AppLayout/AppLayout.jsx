import React, { useState } from 'react';
import { Container } from 'react-bootstrap';
import Topbar from '../Topbar/Topbar';
import Sidebar from '../Sidebar/Sidebar';
import './AppLayout.css';

const AppLayout = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <div className="app-layout">
      <Topbar onToggleSidebar={toggleSidebar} sidebarCollapsed={sidebarCollapsed} />
      <Sidebar collapsed={sidebarCollapsed} />
      
      <main className={`main-content ${sidebarCollapsed ? 'sidebar-collapsed' : 'sidebar-expanded'}`}>
        <Container fluid className="content-container">
          {children}
        </Container>
      </main>
    </div>
  );
};

export default AppLayout;