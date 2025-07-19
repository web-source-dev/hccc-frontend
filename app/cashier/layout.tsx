import CashierProtected from "@/components/cashier-protected"

export default function CashierLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <CashierProtected>
      {children}
    </CashierProtected>
  )
} 