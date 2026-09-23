export interface PaymentMethod {
  id: number;
  userId: number;
  methodName: string;
  details?: string;
  createdAt?: string;
}

export type NewPaymentMethodInput = Omit<PaymentMethod, "id" | "createdAt">;
