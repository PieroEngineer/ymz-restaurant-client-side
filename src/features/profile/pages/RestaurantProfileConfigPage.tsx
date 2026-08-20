import { ConfigurationArea } from "@/features/profile/components/ConfigurationArea";
import { ConfirmationArea } from "@/features/profile/components/ConfirmationArea";

export default function RestaurantConfigPage() {
  return (
    <div className="h-screen w-screen bg-white overflow-hidden flex flex-col items-center">
      <header
        className="w-full bg-brand-navy rounded-b-2xl shadow-lg flex items-center justify-center py-3 px-6 shrink-0"
      >
        <h1 className="text-white text-lg font-semibold tracking-wide">
          Mi restaurante
        </h1>
      </header>

      <main className="flex-1 w-full flex flex-col items-center justify-center gap-3 px-6 pb-1">
        <ConfigurationArea />
        <ConfirmationArea />
      </main>
    </div>
  );
}