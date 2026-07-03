"use client";

import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn, formatRs } from "@/lib/utils";
import { OrderStepper, ORDER_STEPS } from "@/components/dashboard/order-stepper";

type BoxOption = {
  id: "6" | "12" | "30" | "custom";
  label: string;
  eggs: number;
  price: number;
  description: string;
};

const BOX_OPTIONS: BoxOption[] = [
  {
    id: "6",
    label: "6 Eggs",
    eggs: 6,
    price: 180,
    description: "Good for a small household",
  },
  {
    id: "12",
    label: "12 Eggs",
    eggs: 12,
    price: 340,
    description: "Our most popular tray",
  },
  {
    id: "30",
    label: "30 Eggs (Flat)",
    eggs: 30,
    price: 800,
    description: "Best value, one full flat",
  },
  {
    id: "custom",
    label: "Custom Quantity",
    eggs: 0,
    price: 0,
    description: "For bulk or wholesale orders",
  },
];

const CUSTOM_PRICE_PER_EGG = 28;
const DELIVERY_FEE = 50;

type DeliveryDetails = {
  fullName: string;
  phone: string;
  address: string;
  landmark: string;
};

type PaymentMethod = "cash" | "upi";

function nextDayLabel() {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow.toLocaleDateString("en-PK", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

export function OrderWizard() {
  const [step, setStep] = useState(1);
  const [boxId, setBoxId] = useState<BoxOption["id"]>("12");
  const [customQty, setCustomQty] = useState(60);
  const [details, setDetails] = useState<DeliveryDetails>({
    fullName: "",
    phone: "",
    address: "",
    landmark: "",
  });
  const [payment, setPayment] = useState<PaymentMethod>("cash");
  const [placed, setPlaced] = useState(false);

  const selectedBox = BOX_OPTIONS.find((b) => b.id === boxId)!;

  const eggCount = boxId === "custom" ? customQty : selectedBox.eggs;
  const itemsTotal =
    boxId === "custom" ? customQty * CUSTOM_PRICE_PER_EGG : selectedBox.price;
  const grandTotal = itemsTotal + DELIVERY_FEE;

  const canContinue = useMemo(() => {
    if (step === 1) return boxId !== "custom" || customQty >= 30;
    if (step === 2)
      return (
        details.fullName.trim().length > 1 &&
        details.phone.trim().length >= 10 &&
        details.address.trim().length > 5
      );
    return true;
  }, [step, boxId, customQty, details]);

  function goNext() {
    if (step < ORDER_STEPS.length) setStep(step + 1);
    else setPlaced(true);
  }

  function goBack() {
    if (step > 1) setStep(step - 1);
  }

  if (placed) {
    return (
      <Card className="mx-auto max-w-xl text-center">
        <CardHeader className="items-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-2xl text-primary-foreground">
            ✓
          </span>
          <CardTitle className="mt-2 text-2xl">Order placed</CardTitle>
          <CardDescription>
            Thanks, {details.fullName.split(" ")[0] || "there"}. Your eggs are
            on the way.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-left text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Order</span>
            <span className="font-medium">
              {eggCount} eggs ({selectedBox.label})
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Delivery</span>
            <span className="font-medium">
              Tomorrow, {nextDayLabel()}, before 9 PM
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Payment</span>
            <span className="font-medium">
              {payment === "cash" ? "Cash on Delivery" : "UPI on Delivery"}
            </span>
          </div>
          <Separator />
          <div className="flex justify-between text-base font-semibold">
            <span>Total</span>
            <span className="text-primary">{formatRs(grandTotal)}</span>
          </div>
        </CardContent>
        <CardFooter className="justify-center">
          <Button
            variant="outline"
            onClick={() => {
              setPlaced(false);
              setStep(1);
            }}
          >
            Place another order
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <div className="mx-auto grid w-full max-w-5xl gap-8 lg:grid-cols-[1fr_320px]">
      <Card>
        <CardHeader>
          <OrderStepper currentStep={step} />
          <CardTitle className="mt-6">{ORDER_STEPS[step - 1].title}</CardTitle>
        </CardHeader>

        <CardContent>
          {step === 1 && (
            <StepSelectEggs
              boxId={boxId}
              setBoxId={setBoxId}
              customQty={customQty}
              setCustomQty={setCustomQty}
            />
          )}
          {step === 2 && (
            <StepDeliveryDetails details={details} setDetails={setDetails} />
          )}
          {step === 3 && <StepNextDayDelivery />}
          {step === 4 && (
            <StepPayment payment={payment} setPayment={setPayment} />
          )}
        </CardContent>

        <CardFooter className="justify-between">
          <Button variant="ghost" onClick={goBack} disabled={step === 1}>
            Back
          </Button>
          <Button onClick={goNext} disabled={!canContinue}>
            {step === ORDER_STEPS.length ? "Place order" : "Continue"}
          </Button>
        </CardFooter>
      </Card>

      <OrderSummary
        selectedBox={selectedBox}
        eggCount={eggCount}
        itemsTotal={itemsTotal}
        deliveryFee={DELIVERY_FEE}
        grandTotal={grandTotal}
      />
    </div>
  );
}

function StepSelectEggs({
  boxId,
  setBoxId,
  customQty,
  setCustomQty,
}: {
  boxId: BoxOption["id"];
  setBoxId: (id: BoxOption["id"]) => void;
  customQty: number;
  setCustomQty: (n: number) => void;
}) {
  return (
    <div className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-3">
        {BOX_OPTIONS.filter((b) => b.id !== "custom").map((box) => (
          <button
            key={box.id}
            type="button"
            onClick={() => setBoxId(box.id)}
            className={cn(
              "rounded-xl border p-4 text-left transition-colors",
              boxId === box.id
                ? "border-primary bg-secondary"
                : "border-border hover:bg-secondary/60",
            )}
          >
            <p className="font-serif text-lg font-semibold">{box.label}</p>
            <p className="mt-1 text-xs text-muted-foreground">
              {box.description}
            </p>
            <p className="mt-3 text-base font-semibold text-primary">
              {formatRs(box.price)}
            </p>
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={() => setBoxId("custom")}
        className={cn(
          "flex w-full items-center justify-between rounded-xl border p-4 text-left transition-colors",
          boxId === "custom"
            ? "border-primary bg-secondary"
            : "border-border hover:bg-secondary/60",
        )}
      >
        <div>
          <p className="font-serif text-lg font-semibold">Custom Quantity</p>
          <p className="text-xs text-muted-foreground">
            For bulk orders — {formatRs(CUSTOM_PRICE_PER_EGG)} per egg, minimum
            30
          </p>
        </div>
        <Badge variant={boxId === "custom" ? "default" : "outline"}>Bulk</Badge>
      </button>

      {boxId === "custom" && (
        <div className="grid max-w-xs gap-2 pt-1">
          <Label htmlFor="custom-qty">Number of eggs</Label>
          <Input
            id="custom-qty"
            type="number"
            min={30}
            step={6}
            value={customQty}
            onChange={(e) => setCustomQty(Number(e.target.value))}
          />
          {customQty < 30 && (
            <p className="text-xs text-destructive">
              Minimum bulk order is 30 eggs.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

function StepDeliveryDetails({
  details,
  setDetails,
}: {
  details: DeliveryDetails;
  setDetails: (d: DeliveryDetails) => void;
}) {
  function update<K extends keyof DeliveryDetails>(key: K, value: string) {
    setDetails({ ...details, [key]: value });
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="grid gap-2">
        <Label htmlFor="fullName">Full name</Label>
        <Input
          id="fullName"
          placeholder="Ayesha Khan"
          value={details.fullName}
          onChange={(e) => update("fullName", e.target.value)}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="phone">Phone number</Label>
        <Input
          id="phone"
          type="tel"
          placeholder="03xx xxxxxxx"
          value={details.phone}
          onChange={(e) => update("phone", e.target.value)}
        />
      </div>
      <div className="grid gap-2 sm:col-span-2">
        <Label htmlFor="address">Complete address</Label>
        <Input
          id="address"
          placeholder="House #, street, area, city"
          value={details.address}
          onChange={(e) => update("address", e.target.value)}
        />
      </div>
      <div className="grid gap-2 sm:col-span-2">
        <Label htmlFor="landmark">Nearby landmark</Label>
        <Input
          id="landmark"
          placeholder="e.g. Near Al-Falah Masjid"
          value={details.landmark}
          onChange={(e) => update("landmark", e.target.value)}
        />
      </div>
    </div>
  );
}

function StepNextDayDelivery() {
  return (
    <div className="flex flex-col items-start gap-4 rounded-xl border border-border bg-secondary/60 p-5">
      <Badge variant="secondary">Delivery window</Badge>
      <p className="font-serif text-xl font-semibold">
        Tomorrow, {nextDayLabel()} — before 9:00 PM
      </p>
      <p className="text-sm leading-6 text-muted-foreground">
        Every order placed today goes out for delivery the next day.
        You&rsquo;ll get a call from our rider shortly before they arrive, so
        keep your phone handy.
      </p>
    </div>
  );
}

function StepPayment({
  payment,
  setPayment,
}: {
  payment: PaymentMethod;
  setPayment: (p: PaymentMethod) => void;
}) {
  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">
        No online payment needed — pay when your order arrives.
      </p>
      <RadioGroup
        value={payment}
        onValueChange={(v) => setPayment(v as PaymentMethod)}
        className="sm:grid-cols-2 sm:grid"
      >
        {[
          {
            id: "cash",
            label: "Cash on Delivery",
            copy: "Pay the rider in cash",
          },
          {
            id: "upi",
            label: "UPI on Delivery",
            copy: "Scan and pay at the door",
          },
        ].map((option) => (
          <Label
            key={option.id}
            htmlFor={option.id}
            className={cn(
              "flex cursor-pointer items-start gap-3 rounded-xl border p-4 font-normal",
              payment === option.id
                ? "border-primary bg-secondary"
                : "border-border",
            )}
          >
            <RadioGroupItem
              id={option.id}
              value={option.id}
              className="mt-0.5"
            />
            <span>
              <span className="block text-sm font-semibold text-foreground">
                {option.label}
              </span>
              <span className="text-xs text-muted-foreground">
                {option.copy}
              </span>
            </span>
          </Label>
        ))}
      </RadioGroup>
    </div>
  );
}

function OrderSummary({
  selectedBox,
  eggCount,
  itemsTotal,
  deliveryFee,
  grandTotal,
}: {
  selectedBox: BoxOption;
  eggCount: number;
  itemsTotal: number;
  deliveryFee: number;
  grandTotal: number;
}) {
  return (
    <Card className="h-fit lg:sticky lg:top-24">
      <CardHeader>
        <CardTitle>Order summary</CardTitle>
        <CardDescription>Updates as you go through the steps</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">
            {selectedBox.id === "custom" ? "Custom order" : selectedBox.label}
          </span>
          <span className="font-medium">{eggCount} eggs</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Items</span>
          <span className="font-medium">{formatRs(itemsTotal)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Delivery fee</span>
          <span className="font-medium">{formatRs(deliveryFee)}</span>
        </div>
        <Separator />
        <div className="flex justify-between text-base font-semibold">
          <span>Total</span>
          <span className="text-primary">{formatRs(grandTotal)}</span>
        </div>
      </CardContent>
    </Card>
  );
}
