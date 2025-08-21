export default function AuthRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="grid min-h-screen place-items-center">{children}</div>;
}
