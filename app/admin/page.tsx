import { redirect } from 'next/navigation';

export default function AdminPage() {
  // Redirect to assets page by default
  redirect('/admin/assets');
}
