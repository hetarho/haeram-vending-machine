import { listProducts } from './api/listProducts';
import { VendingMachineContainer } from '@/src/components/VendingMachineContainer';

export default async function Home() {
  const initialData = await listProducts();

  return (
    <main className="min-h-screen p-8">
      <VendingMachineContainer initialData={initialData} />
    </main>
  );
}
