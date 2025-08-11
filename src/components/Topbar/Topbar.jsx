import React from 'react';
import { Navbar, Nav, NavDropdown, Button } from 'react-bootstrap';
import { useAuth } from '../../contexts/AuthContext';
import './Topbar.css';

const Topbar = ({ onToggleSidebar, sidebarCollapsed }) => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <Navbar bg="white" expand="lg" className="topbar shadow-sm px-3" fixed="top">
      <div className="d-flex align-items-center">
        <Button
          variant="outline-secondary"
          size="sm"
          onClick={onToggleSidebar}
          className="me-3 sidebar-toggle"
          aria-label="Toggle sidebar"
        >
          <i className={`fas ${sidebarCollapsed ? 'fa-bars' : 'fa-times'}`}></i>
        </Button>
        
        <Navbar.Brand href="#" className="d-flex align-items-center">
          <div className="brand-logo me-2">
            <span className="brand-text">RES·Q</span>
          </div>
          <span className="brand-subtitle d-none d-md-inline">LINK</span>
        </Navbar.Brand>
      </div>

      <Nav className="ms-auto">
        <div className="d-flex align-items-center">
          {/* Notifications */}
          <Button variant="outline-secondary" size="sm" className="me-2 notification-btn">
            <i className="fas fa-bell"></i>
            <span className="notification-badge">3</span>
          </Button>

          {/* User Menu */}
          <NavDropdown
            title={
              <div className="d-flex align-items-center">
                <img
                  src={user?.avatar || 'https://ui-avatars.com/api/?name=User&background=8bc34a&color=fff'}
                  alt="User Avatar"
                  className="user-avatar me-2"
                />
                <span className="d-none d-md-inline">{user?.name}</span>
              </div>
            }
            id="user-dropdown"
            align="end"
            className="user-dropdown"
          >
            <NavDropdown.Item>
              <i className="fas fa-user me-2"></i>
              Profile
            </NavDropdown.Item>
            <NavDropdown.Item>
              <i className="fas fa-cog me-2"></i>
              Settings
            </NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item onClick={handleLogout}>
              <i className="fas fa-sign-out-alt me-2"></i>
              Logout
            </NavDropdown.Item>
          </NavDropdown>
        </div>
      </Nav>
    </Navbar>
  );
};

export default Topbar;