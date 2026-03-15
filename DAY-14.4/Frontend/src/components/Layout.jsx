import Sidebar from "./Sidebar";

const Layout = ({ children }) => {
  return (
    <div className="app-shell">
      <Sidebar />
      <main className="app-main">{children}</main>
      <aside className="app-rightbar"></aside>
    </div>
  );
};

export default Layout;
