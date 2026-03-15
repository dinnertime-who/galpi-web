export default function Layout({ children }: { children: React.ReactNode }) {
  return <div className="sm:max-w-md mx-auto">{children}</div>;
}
