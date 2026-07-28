"use client";

import { useState } from "react";

import { checkoutCustomerSchema } from "@/lib/checkoutValidation";
import { TRANSFER_PAYMENT_CONFIG } from "@/lib/constants";
import { useCart } from "@/components/cart/CartProvider";
import { Button } from "@/components/ui/Button";
import { Field, Input, Select, Textarea } from "@/components/ui/Input";

type ErrorMap = Partial<Record<string, string>>;
type PaymentMethod = "mercadopago" | "transfer";

const DEPARTMENTS = [
  "Amazonas",
  "Antioquia",
  "Arauca",
  "Atlántico",
  "Bolívar",
  "Boyacá",
  "Caldas",
  "Caquetá",
  "Casanare",
  "Cauca",
  "Cesar",
  "Chocó",
  "Córdoba",
  "Cundinamarca",
  "Bogotá D. C.",
  "Huila",
  "La Guajira",
  "Magdalena",
  "Meta",
  "Nariño",
  "Norte de Santander",
  "Quindío",
  "Risaralda",
  "Santander",
  "Sucre",
  "Tolima",
  "Valle del Cauca"
];

function redirectToMercadoPago(url: string) {
  window.location.assign(url);
}

function redirectToWhatsApp(url: string) {
  window.location.assign(url);
}

export function CheckoutForm() {
  const { items } = useCart();
  const [errors, setErrors] = useState<ErrorMap>({});
  const [submitting, setSubmitting] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("mercadopago");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const customer = {
      firstName: String(formData.get("firstName") ?? ""),
      lastName: String(formData.get("lastName") ?? ""),
      phone: String(formData.get("phone") ?? ""),
      email: String(formData.get("email") ?? ""),
      department: String(formData.get("department") ?? ""),
      city: String(formData.get("city") ?? ""),
      address: String(formData.get("address") ?? ""),
      extraInfo: String(formData.get("extraInfo") ?? ""),
      notes: String(formData.get("notes") ?? ""),
      acceptPolicies: formData.get("acceptPolicies") === "on"
    };

    const validation = checkoutCustomerSchema.safeParse(customer);

    if (!validation.success) {
      const nextErrors: ErrorMap = {};

      validation.error.issues.forEach((issue) => {
        const field = issue.path[0];
        if (typeof field === "string" && !nextErrors[field]) {
          nextErrors[field] = issue.message;
        }
      });

      setErrors(nextErrors);
      return;
    }

    if (items.length === 0) {
      setErrors({ acceptPolicies: "Agrega productos antes de continuar" });
      return;
    }

    setSubmitting(true);
    setErrors({});

    try {
      const endpoint = paymentMethod === "mercadopago" ? "/api/payments/mercadopago/create" : "/api/payments/transfer/create";
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ items, customer: validation.data })
      });

      if (!response.ok) {
        const body = (await response.json().catch(() => null)) as { message?: string } | null;
        throw new Error(body?.message ?? "No se pudo preparar el pago");
      }

      const data = (await response.json()) as {
        checkoutUrl: string;
        initPoint?: string;
        whatsappUrl?: string;
      };

      if (paymentMethod === "transfer") {
        if (!data.whatsappUrl) {
          throw new Error("No se pudo preparar el enlace de WhatsApp");
        }

        redirectToWhatsApp(data.whatsappUrl);
        return;
      }

      redirectToMercadoPago(data.initPoint ?? data.checkoutUrl);
    } catch (error) {
      setErrors({ acceptPolicies: error instanceof Error ? error.message : "Ocurrió un error inesperado" });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="checkout-form" onSubmit={handleSubmit} noValidate>
      <div className="form-grid">
        <Field label="Nombre *" htmlFor="firstName" error={errors.firstName}>
          <Input id="firstName" name="firstName" autoComplete="given-name" />
        </Field>

        <Field label="Apellidos *" htmlFor="lastName" error={errors.lastName}>
          <Input id="lastName" name="lastName" autoComplete="family-name" />
        </Field>

        <Field label="Celular *" htmlFor="phone" error={errors.phone}>
          <Input id="phone" name="phone" inputMode="tel" autoComplete="tel" placeholder="3001234567" />
        </Field>

        <Field label="Correo electrónico" htmlFor="email" error={errors.email}>
          <Input id="email" name="email" type="email" autoComplete="email" />
        </Field>

        <Field label="Departamento *" htmlFor="department" error={errors.department}>
          <Select id="department" name="department" defaultValue="">
            <option value="">Selecciona</option>
            {DEPARTMENTS.map((department) => (
              <option key={department}>{department}</option>
            ))}
          </Select>
        </Field>

        <Field label="Ciudad *" htmlFor="city" error={errors.city}>
          <Input id="city" name="city" autoComplete="address-level2" />
        </Field>

        <Field label="Dirección completa *" htmlFor="address" error={errors.address} full>
          <Input id="address" name="address" autoComplete="street-address" placeholder="Calle, carrera, número, barrio, torre o apartamento" />
        </Field>

        <Field label="Información adicional" htmlFor="extraInfo" error={errors.extraInfo} full>
          <Input id="extraInfo" name="extraInfo" placeholder="Referencias de entrega, piso, torre, etc." />
        </Field>

        <Field label="Notas" htmlFor="notes" error={errors.notes} full>
          <Textarea id="notes" name="notes" placeholder="Color, referencia, indicaciones de entrega..." />
        </Field>
      </div>

      <label className="policy-check">
        <input type="checkbox" name="acceptPolicies" />
        <span>Acepto las políticas de compra y tratamiento de datos.</span>
      </label>
      {errors.acceptPolicies ? <p className="form-error">{errors.acceptPolicies}</p> : null}

      <section className="payment-methods" aria-label="Método de pago">
        <h3>Elige cómo quieres pagar</h3>
        <div className="payment-options">
          <label className={`payment-option${paymentMethod === "mercadopago" ? " selected" : ""}`}>
            <input type="radio" name="paymentMethod" value="mercadopago" checked={paymentMethod === "mercadopago"} onChange={() => setPaymentMethod("mercadopago")} />
            <span>
              <strong>Tarjeta crédito o débito</strong>
              <small>Pagas seguro con Mercado Pago.</small>
            </span>
          </label>

          <label className={`payment-option${paymentMethod === "transfer" ? " selected" : ""}`}>
            <input type="radio" name="paymentMethod" value="transfer" checked={paymentMethod === "transfer"} onChange={() => setPaymentMethod("transfer")} />
            <span>
              <strong>Transferencia</strong>
              <small>DaviPlata, Bancolombia Breve o Nequi.</small>
            </span>
          </label>
        </div>

        {paymentMethod === "transfer" ? (
          <div className="transfer-box">
            <strong>Cuentas para transferencia</strong>
            <div className="transfer-account-list">
              {TRANSFER_PAYMENT_CONFIG.accounts.map((account) => (
                <div className="transfer-account" key={account.name}>
                  <span>{account.name}</span>
                  <strong>{account.account}</strong>
                </div>
              ))}
            </div>
            <p>Al continuar se abrirá WhatsApp para enviar el comprobante al 312 288 9457 y coordinar el despacho.</p>
          </div>
        ) : null}
      </section>

      <p className="form-help">
        Primero guardamos tus datos de envío. Luego continuas a Mercado Pago o WhatsApp, según el método elegido.
      </p>

      <Button type="submit" variant="green" fullWidth disabled={submitting || items.length === 0}>
        {submitting ? "Preparando pedido..." : paymentMethod === "mercadopago" ? "Continuar con Mercado Pago" : "Enviar comprobante por WhatsApp"}
      </Button>
    </form>
  );
}
