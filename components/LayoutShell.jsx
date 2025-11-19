import Navbar from './Navbar';

export default function LayoutShell({ children }) {
  return (
    <div>
      <Navbar />
      <main style={{ padding: 24 }}>{children}</main>
    </div>
  );
}
