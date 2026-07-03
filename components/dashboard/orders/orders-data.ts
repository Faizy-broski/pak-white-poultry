export type OrderStatus =
  | "Pending"
  | "Confirmed"
  | "Out for Delivery"
  | "Delivered"
  | "Cancelled"

export type PaymentMethod = "Cash" | "UPI"

export type Order = {
  id: string
  customer: string
  phone: string
  address: string
  eggs: number
  boxLabel: string
  amount: number
  status: OrderStatus
  payment: PaymentMethod
  placedAt: string // ISO date
  placedLabel: string
  deliverySlot: string
  rider?: string
}

export const ORDER_STATUSES: OrderStatus[] = [
  "Pending",
  "Confirmed",
  "Out for Delivery",
  "Delivered",
  "Cancelled",
]

export const orders: Order[] = [
  { id: "PWP-1052", customer: "Ayesha Khan", phone: "0301 2345678", address: "House 12, Street 4, DHA Phase 5, Lahore", eggs: 30, boxLabel: "30 Eggs (Flat)", amount: 850, status: "Delivered", payment: "Cash", placedAt: "2026-07-03T08:20:00", placedLabel: "Today, 8:20 AM", deliverySlot: "Today, before 9 PM", rider: "Imran R." },
  { id: "PWP-1051", customer: "Bilal Ahmed", phone: "0322 1122334", address: "Flat 3B, Gulberg III, Lahore", eggs: 12, boxLabel: "12 Eggs", amount: 390, status: "Out for Delivery", payment: "UPI", placedAt: "2026-07-03T07:55:00", placedLabel: "Today, 7:55 AM", deliverySlot: "Today, before 9 PM", rider: "Salman K." },
  { id: "PWP-1050", customer: "Sana Malik", phone: "0333 4455667", address: "House 45, Model Town, Lahore", eggs: 6, boxLabel: "6 Eggs", amount: 230, status: "Pending", payment: "Cash", placedAt: "2026-07-03T07:40:00", placedLabel: "Today, 7:40 AM", deliverySlot: "Tomorrow, before 9 PM" },
  { id: "PWP-1049", customer: "Usman Tariq", phone: "0345 7788990", address: "Office 12, Blue Area, Islamabad", eggs: 60, boxLabel: "Custom (60 eggs)", amount: 1730, status: "Delivered", payment: "Cash", placedAt: "2026-07-02T18:10:00", placedLabel: "Yesterday, 6:10 PM", deliverySlot: "Yesterday, before 9 PM", rider: "Imran R." },
  { id: "PWP-1048", customer: "Hira Sheikh", phone: "0312 6677889", address: "House 8, Johar Town, Lahore", eggs: 12, boxLabel: "12 Eggs", amount: 390, status: "Cancelled", payment: "UPI", placedAt: "2026-07-02T16:45:00", placedLabel: "Yesterday, 4:45 PM", deliverySlot: "—" },
  { id: "PWP-1047", customer: "Fahad Iqbal", phone: "0300 1231234", address: "House 22, Bahria Town, Rawalpindi", eggs: 30, boxLabel: "30 Eggs (Flat)", amount: 850, status: "Confirmed", payment: "Cash", placedAt: "2026-07-02T14:05:00", placedLabel: "Yesterday, 2:05 PM", deliverySlot: "Today, before 9 PM" },
  { id: "PWP-1046", customer: "Mehwish Ali", phone: "0321 9988776", address: "Flat 6, Clifton Block 2, Karachi", eggs: 6, boxLabel: "6 Eggs", amount: 230, status: "Delivered", payment: "UPI", placedAt: "2026-07-02T11:30:00", placedLabel: "Yesterday, 11:30 AM", deliverySlot: "Yesterday, before 9 PM", rider: "Adeel M." },
  { id: "PWP-1045", customer: "Zain Raza", phone: "0334 5566778", address: "House 5, F-10, Islamabad", eggs: 12, boxLabel: "12 Eggs", amount: 390, status: "Delivered", payment: "Cash", placedAt: "2026-07-01T19:15:00", placedLabel: "Mon, 7:15 PM", deliverySlot: "Tue, before 9 PM", rider: "Salman K." },
  { id: "PWP-1044", customer: "Nida Farooq", phone: "0302 3344556", address: "House 19, Wapda Town, Lahore", eggs: 30, boxLabel: "30 Eggs (Flat)", amount: 850, status: "Cancelled", payment: "Cash", placedAt: "2026-07-01T15:50:00", placedLabel: "Mon, 3:50 PM", deliverySlot: "—" },
  { id: "PWP-1043", customer: "Owais Chaudhry", phone: "0315 8899001", address: "Office 4, I-8 Markaz, Islamabad", eggs: 90, boxLabel: "Custom (90 eggs)", amount: 2520, status: "Delivered", payment: "UPI", placedAt: "2026-07-01T10:00:00", placedLabel: "Mon, 10:00 AM", deliverySlot: "Tue, before 9 PM", rider: "Adeel M." },
  { id: "PWP-1042", customer: "Rabia Yousaf", phone: "0341 2233445", address: "House 33, Askari 10, Lahore", eggs: 6, boxLabel: "6 Eggs", amount: 230, status: "Pending", payment: "Cash", placedAt: "2026-06-30T09:25:00", placedLabel: "Sun, 9:25 AM", deliverySlot: "Mon, before 9 PM" },
  { id: "PWP-1041", customer: "Kashif Mehmood", phone: "0308 6677001", address: "House 2, G-11, Islamabad", eggs: 12, boxLabel: "12 Eggs", amount: 390, status: "Delivered", payment: "Cash", placedAt: "2026-06-29T17:40:00", placedLabel: "Sat, 5:40 PM", deliverySlot: "Sun, before 9 PM", rider: "Imran R." },
  { id: "PWP-1040", customer: "Ammara Siddiqui", phone: "0320 1122009", address: "Flat 9, North Nazimabad, Karachi", eggs: 30, boxLabel: "30 Eggs (Flat)", amount: 850, status: "Out for Delivery", payment: "UPI", placedAt: "2026-06-29T08:10:00", placedLabel: "Sat, 8:10 AM", deliverySlot: "Today, before 9 PM", rider: "Adeel M." },
  { id: "PWP-1039", customer: "Talha Aslam", phone: "0333 7788112", address: "House 14, Township, Lahore", eggs: 6, boxLabel: "6 Eggs", amount: 230, status: "Delivered", payment: "Cash", placedAt: "2026-06-27T12:20:00", placedLabel: "Thu, 12:20 PM", deliverySlot: "Fri, before 9 PM", rider: "Salman K." },
  { id: "PWP-1038", customer: "Sadia Rehman", phone: "0345 3345667", address: "House 7, Satellite Town, Rawalpindi", eggs: 120, boxLabel: "Custom (120 eggs)", amount: 3360, status: "Confirmed", payment: "Cash", placedAt: "2026-06-26T09:00:00", placedLabel: "Wed, 9:00 AM", deliverySlot: "Thu, before 9 PM" },
]