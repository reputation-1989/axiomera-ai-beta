import CouncilInterface from '@/components/CouncilInterface';
import { Sidebar } from '@/components/Sidebar';

export default function Home() {
  return (
    <main className="flex h-screen bg-background text-foreground overflow-hidden">
      <Sidebar />
      <CouncilInterface />
    </main>
  );
}
