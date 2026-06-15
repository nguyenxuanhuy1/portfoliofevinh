import type { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import {
  DashboardOutlined,
  ProjectOutlined,
  UserOutlined,
  ContactsOutlined,
  LogoutOutlined,
  TrophyOutlined,
  CalendarOutlined,
  BookOutlined,
} from '@ant-design/icons';
import { routeConfig } from '../../router/routeConfig';
import { useAuthStore } from '../../store/authStore';
import { useTranslation } from '../../features/shared/i18n/useTranslation';
import { useThemeStore } from '../../store/themeStore';
import { useEffect, useRef } from 'react';

const { Sider, Content, Header } = Layout;

const iconMap: Record<string, ReactNode> = {
  '/admin': <DashboardOutlined />,
  '/admin/projects': <ProjectOutlined />,
  '/admin/profile': <UserOutlined />,
  '/admin/skills': <TrophyOutlined />,
  '/admin/experience': <CalendarOutlined />,
  '/admin/contacts': <ContactsOutlined />,
  '/admin/topics': <BookOutlined />,
};

type Props = {
  children: ReactNode;
};

export function AdminLayout({ children }: Props) {
  const location = useLocation();
  const { logout } = useAuthStore();
  const { language } = useTranslation();
  const { theme, setTheme } = useThemeStore();
  const prevThemeRef = useRef<'dark' | 'light'>(theme);

  useEffect(() => {
    // Force dark theme inside the admin layout
    if (theme !== 'dark') {
      setTheme('dark');
    }

    return () => {
      // Restore user's original theme when navigating away
      if (prevThemeRef.current !== 'dark') {
        setTheme(prevThemeRef.current);
      }
    };
  }, []);

  const menuItems = routeConfig
    .filter((route) => route.layout === 'admin' && route.showInMenu)
    .map((route) => {
      let displayLabel = '';
      if (route.label) {
        if (typeof route.label === 'string') {
          displayLabel = route.label;
        } else {
          displayLabel = route.label[language];
        }
      }
      return {
        key: route.path,
        icon: iconMap[route.path] ?? <DashboardOutlined />,
        label: <Link to={route.path}>{displayLabel}</Link>,
      };
    });

  return (
    <Layout className="admin-layout">
      <Sider className="admin-layout__sider" width={220} collapsed={false}>
        <div className="admin-layout__logo">
          <span className="logo-bracket">&lt;</span>
          <span className="logo-text">admin</span>
          <span className="logo-bracket">/&gt;</span>
        </div>
        <Menu
          className="admin-layout__menu"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
        />
        <div className="admin-layout__logout" onClick={logout}>
          <LogoutOutlined />
          <span>Đăng xuất</span>
        </div>
      </Sider>

      <Layout>
        <Header className="admin-layout__header">
          <span className="admin-layout__header-title">Trang quản trị</span>
        </Header>
        <Content className="admin-layout__content">
          {children}
        </Content>
      </Layout>
    </Layout>
  );
}