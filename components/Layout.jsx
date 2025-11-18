import Navbar from './Navbar';

export default function Layout({ children }) {
  return (
    <div className="app-root">
      <Navbar />
      <main className="app-main">
        <div className="app-container">{children}</div>
      </main>
    </div>
  );
}
