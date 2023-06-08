import "./globals.css"

export const metadata = {
  title: "for earning",
  description: "hire system",
}

export default function RootLayout({ children }) {
  return (
    <html lang="zh">
      <body>{children}</body>
    </html>
  )
}
