export type CustomerSegment = "VIP" | "Regular" | "New"
export type CustomerStatus = "Active" | "Inactive"

export type Customer = {
  id: string
  name: string
  phone: string
  email: string
  city: string
  address: string
  totalOrders: number
  totalSpent: number
  avgOrder: number
  lastOrderLabel: string
  lastOrderAt: string // ISO date, used for "Active" vs "Inactive"
  joinedLabel: string
  segment: CustomerSegment
  status: CustomerStatus
  favoriteBox: string
}

function makeCustomer(
  c: Omit<Customer, "avgOrder" | "status"> & { avgOrder?: number }
): Customer {
  const avgOrder = c.avgOrder ?? Math.round(c.totalSpent / Math.max(1, c.totalOrders))
  const daysSinceLastOrder =
    (new Date("2026-07-03T12:00:00").getTime() - new Date(c.lastOrderAt).getTime()) /
    (1000 * 60 * 60 * 24)
  return { ...c, avgOrder, status: daysSinceLastOrder <= 21 ? "Active" : "Inactive" }
}

export const customers: Customer[] = [
  makeCustomer({
    id: "CUST-001", name: "Ayesha Khan", phone: "0301 2345678", email: "ayesha.khan@example.com",
    city: "Lahore", address: "House 12, Street 4, DHA Phase 5, Lahore",
    totalOrders: 24, totalSpent: 8930, lastOrderLabel: "Today, 8:20 AM", lastOrderAt: "2026-07-03T08:20:00",
    joinedLabel: "Jan 2026", segment: "VIP", favoriteBox: "30 Eggs (Flat)",
  }),
  makeCustomer({
    id: "CUST-002", name: "Bilal Ahmed", phone: "0322 1122334", email: "bilal.ahmed@example.com",
    city: "Lahore", address: "Flat 3B, Gulberg III, Lahore",
    totalOrders: 9, totalSpent: 3120, lastOrderLabel: "Today, 7:55 AM", lastOrderAt: "2026-07-03T07:55:00",
    joinedLabel: "Mar 2026", segment: "Regular", favoriteBox: "12 Eggs",
  }),
  makeCustomer({
    id: "CUST-003", name: "Sana Malik", phone: "0333 4455667", email: "sana.malik@example.com",
    city: "Lahore", address: "House 45, Model Town, Lahore",
    totalOrders: 1, totalSpent: 230, lastOrderLabel: "Today, 7:40 AM", lastOrderAt: "2026-07-03T07:40:00",
    joinedLabel: "Jul 2026", segment: "New", favoriteBox: "6 Eggs",
  }),
  makeCustomer({
    id: "CUST-004", name: "Usman Tariq", phone: "0345 7788990", email: "usman.tariq@example.com",
    city: "Islamabad", address: "Office 12, Blue Area, Islamabad",
    totalOrders: 16, totalSpent: 14250, lastOrderLabel: "Yesterday, 6:10 PM", lastOrderAt: "2026-07-02T18:10:00",
    joinedLabel: "Nov 2025", segment: "VIP", favoriteBox: "Custom (60+ eggs)",
  }),
  makeCustomer({
    id: "CUST-005", name: "Hira Sheikh", phone: "0312 6677889", email: "hira.sheikh@example.com",
    city: "Lahore", address: "House 8, Johar Town, Lahore",
    totalOrders: 4, totalSpent: 1180, lastOrderLabel: "Yesterday, 4:45 PM", lastOrderAt: "2026-07-02T16:45:00",
    joinedLabel: "May 2026", segment: "Regular", favoriteBox: "12 Eggs",
  }),
  makeCustomer({
    id: "CUST-006", name: "Fahad Iqbal", phone: "0300 1231234", email: "fahad.iqbal@example.com",
    city: "Rawalpindi", address: "House 22, Bahria Town, Rawalpindi",
    totalOrders: 11, totalSpent: 5230, lastOrderLabel: "Yesterday, 2:05 PM", lastOrderAt: "2026-07-02T14:05:00",
    joinedLabel: "Feb 2026", segment: "Regular", favoriteBox: "30 Eggs (Flat)",
  }),
  makeCustomer({
    id: "CUST-007", name: "Mehwish Ali", phone: "0321 9988776", email: "mehwish.ali@example.com",
    city: "Karachi", address: "Flat 6, Clifton Block 2, Karachi",
    totalOrders: 3, totalSpent: 690, lastOrderLabel: "Yesterday, 11:30 AM", lastOrderAt: "2026-07-02T11:30:00",
    joinedLabel: "Jun 2026", segment: "New", favoriteBox: "6 Eggs",
  }),
  makeCustomer({
    id: "CUST-008", name: "Zain Raza", phone: "0334 5566778", email: "zain.raza@example.com",
    city: "Islamabad", address: "House 5, F-10, Islamabad",
    totalOrders: 7, totalSpent: 2730, lastOrderLabel: "Mon, 7:15 PM", lastOrderAt: "2026-06-29T19:15:00",
    joinedLabel: "Apr 2026", segment: "Regular", favoriteBox: "12 Eggs",
  }),
  makeCustomer({
    id: "CUST-009", name: "Nida Farooq", phone: "0302 3344556", email: "nida.farooq@example.com",
    city: "Lahore", address: "House 19, Wapda Town, Lahore",
    totalOrders: 2, totalSpent: 460, lastOrderLabel: "Jun 15, 3:50 PM", lastOrderAt: "2026-06-15T15:50:00",
    joinedLabel: "Jun 2026", segment: "New", favoriteBox: "30 Eggs (Flat)",
  }),
  makeCustomer({
    id: "CUST-010", name: "Owais Chaudhry", phone: "0315 8899001", email: "owais.chaudhry@example.com",
    city: "Islamabad", address: "Office 4, I-8 Markaz, Islamabad",
    totalOrders: 19, totalSpent: 21430, lastOrderLabel: "Jun 29, 10:00 AM", lastOrderAt: "2026-06-29T10:00:00",
    joinedLabel: "Sep 2025", segment: "VIP", favoriteBox: "Custom (90+ eggs)",
  }),
  makeCustomer({
    id: "CUST-011", name: "Rabia Yousaf", phone: "0341 2233445", email: "rabia.yousaf@example.com",
    city: "Lahore", address: "House 33, Askari 10, Lahore",
    totalOrders: 5, totalSpent: 1150, lastOrderLabel: "Jun 10, 9:25 AM", lastOrderAt: "2026-06-10T09:25:00",
    joinedLabel: "Mar 2026", segment: "Regular", favoriteBox: "6 Eggs",
  }),
  makeCustomer({
    id: "CUST-012", name: "Kashif Mehmood", phone: "0308 6677001", email: "kashif.mehmood@example.com",
    city: "Islamabad", address: "House 2, G-11, Islamabad",
    totalOrders: 8, totalSpent: 3120, lastOrderLabel: "May 30, 5:40 PM", lastOrderAt: "2026-05-30T17:40:00",
    joinedLabel: "Jan 2026", segment: "Regular", favoriteBox: "12 Eggs",
  }),
  makeCustomer({
    id: "CUST-013", name: "Ammara Siddiqui", phone: "0320 1122009", email: "ammara.siddiqui@example.com",
    city: "Karachi", address: "Flat 9, North Nazimabad, Karachi",
    totalOrders: 13, totalSpent: 6250, lastOrderLabel: "Jun 29, 8:10 AM", lastOrderAt: "2026-06-29T08:10:00",
    joinedLabel: "Dec 2025", segment: "VIP", favoriteBox: "30 Eggs (Flat)",
  }),
  makeCustomer({
    id: "CUST-014", name: "Sadia Rehman", phone: "0345 3345667", email: "sadia.rehman@example.com",
    city: "Rawalpindi", address: "House 7, Satellite Town, Rawalpindi",
    totalOrders: 6, totalSpent: 9840, lastOrderLabel: "Jun 26, 9:00 AM", lastOrderAt: "2026-06-26T09:00:00",
    joinedLabel: "Feb 2026", segment: "Regular", favoriteBox: "Custom (120 eggs)",
  }),
]