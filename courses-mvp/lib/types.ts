export enum OrderStatus {
  NEW = "New",
  PAYMENT_VERIFY = "Payment Verify",
  ACCESS_SENT = "Access Sent",
  COMPLETED = "Completed",
  CANCELLED = "Cancelled",
}

export interface KanbanItem {
  id: string;
  title: string;
  subtitle: string;
  amount: string;
  date: string;
  status: OrderStatus;
  avatar: string;
}
