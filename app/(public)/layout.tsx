import NavBar from "@/components/shared/nav-bar";
import { TooltipProvider } from "@/components/ui/tooltip";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <NavBar />
      <TooltipProvider>
        {children}
      </TooltipProvider>
    </>
  );
}