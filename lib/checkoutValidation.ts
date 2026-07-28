import { z } from "zod";

export const checkoutCustomerSchema = z.object({
  firstName: z.string().trim().min(2, "Ingresa tu nombre"),
  lastName: z.string().trim().min(2, "Ingresa tus apellidos"),
  phone: z.string().trim().min(7, "Ingresa un celular válido"),
  email: z.string().trim().email("Ingresa un correo válido").optional().or(z.literal("")),
  department: z.string().trim().min(2, "Selecciona un departamento"),
  city: z.string().trim().min(2, "Ingresa la ciudad"),
  address: z.string().trim().min(5, "Ingresa la dirección"),
  extraInfo: z.string().trim().optional().or(z.literal("")),
  notes: z.string().trim().optional().or(z.literal("")),
  acceptPolicies: z.boolean().refine((value) => value, "Debes aceptar las políticas")
});

export const cartItemSchema = z.object({
  productId: z.string().trim().min(1),
  quantity: z.number().int().min(1)
});

export const paymentCreateSchema = z.object({
  items: z.array(cartItemSchema).min(1, "Tu carrito está vacío"),
  customer: checkoutCustomerSchema
});

export const paymentStatusQuerySchema = z.object({
  id: z.string().trim().min(1, "Falta el identificador de la transacción")
});

export type CheckoutCustomerInput = z.infer<typeof checkoutCustomerSchema>;
export type CartItemInput = z.infer<typeof cartItemSchema>;
export type PaymentCreateInput = z.infer<typeof paymentCreateSchema>;