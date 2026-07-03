import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatRs } from "@/lib/utils";

type OrderStatus = "Pending" | "Out for Delivery" | "Delivered" | "Cancelled";

const recentOrders: {
  id: string;
  customer: string;
  eggs: number;
  amount: number;
  status: OrderStatus;
  date: string;
}[] = [
  { id: "PWP-1042", customer: "Ayesha Khan", eggs: 30, amount: 850, status: "Delivered", date: "Today, 8:20 AM" },
  { id: "PWP-1041", customer: "Bilal Ahmed", eggs: 12, amount: 390, status: "Out for Delivery", date: "Today, 7:55 AM" },
  { id: "PWP-1040", customer: "Sana Malik", eggs: 6, amount: 230, status: "Pending", date: "Today, 7:40 AM" },
  { id: "PWP-1039", customer: "Usman Tariq", eggs: 60, amount: 1730, status: "Delivered", date: "Yesterday, 6:10 PM" },
  { id: "PWP-1038", customer: "Hira Sheikh", eggs: 12, amount: 390, status: "Cancelled", date: "Yesterday, 4:45 PM" },
];

const statusStyles: Record<OrderStatus, string> = {
  Pending: "bg-secondary text-secondary-foreground border-transparent",
  "Out for Delivery": "bg-primary/15 text-primary border-transparent",
  Delivered: "bg-emerald-100 text-emerald-700 border-transparent",
  Cancelled: "bg-destructive/10 text-destructive border-transparent",
};

export function RecentOrders() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent orders</CardTitle>
        <CardDescription>Latest activity across all delivery routes</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Eggs</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Placed</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentOrders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">{order.id}</TableCell>
                <TableCell>{order.customer}</TableCell>
                <TableCell>{order.eggs}</TableCell>
                <TableCell>{formatRs(order.amount)}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={statusStyles[order.status]}>
                    {order.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right text-muted-foreground">
                  {order.date}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}