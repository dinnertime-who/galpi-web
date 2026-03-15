export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="sm:max-w-md mx-auto shadow-lg bg-background">
      {children}
    </div>
  );
}
