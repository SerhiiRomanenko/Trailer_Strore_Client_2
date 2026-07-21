import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAuth } from "../contexts/AuthContext";
import { RootState, AppDispatch } from "../redux/store";
import { addOrder } from "../redux/ordersSlice";
import { clearCart } from "../redux/cartSlice";
import { ArrowLeft } from "lucide-react";
import { useToast } from "../components/Toast";
import emailjs from "emailjs-com";

import Stepper from "../components/checkout/Stepper";
import CustomerInfoStep from "../components/checkout/CustomerInfoStep";
import DeliveryPaymentStep from "../components/checkout/DeliveryPaymentStep";
import OrderSummaryStep from "../components/checkout/OrderSummaryStep";
import Button from "../components/Button";
import TrailerLoading from "../components/TrailerLoading";

export interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
}

export interface DeliveryInfo {
  method: "pickup" | "nova-poshta";
  cityRef?: string;
  cityName?: string;
  branchRef?: string;
  branchName?: string;
}

export interface PaymentInfo {
  method: "cash" | "card";
}

const STEPS = ["Контактна інформація", "Доставка і оплата", "Підтвердження"];

const CheckoutPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { currentUser } = useAuth();
  const { success: showToast, error: showError } = useToast();
  const cartItems = useSelector((state: RootState) => state.cart.items);

  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    name: currentUser?.name || "",
    email: currentUser?.email || "",
    phone: "",
  });
  const [deliveryInfo, setDeliveryInfo] = useState<DeliveryInfo>({
    method: "pickup",
  });
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo>({
    method: "cash",
  });

  useEffect(() => {
    document.title = "Оформлення замовлення | ПричепМаркет";
  }, []);

  const navigate = (path: string) => {
    window.history.pushState({}, "", path);
    window.dispatchEvent(new Event("locationchange"));
  };

  const handleNextStep = () => setCurrentStep((prev) => prev + 1);
  const handlePrevStep = () => setCurrentStep((prev) => prev - 1);

  const handlePlaceOrder = useCallback(async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    const newOrderData = {
      date: new Date().toISOString(),
      customer: customerInfo,
      delivery: {
        method: deliveryInfo.method,
        cityRef: deliveryInfo.cityRef,
        cityName: deliveryInfo.cityName,
        branchRef: deliveryInfo.branchRef,
        branchName: deliveryInfo.branchName,
      },
      payment: paymentInfo,
      items: cartItems,
      total: cartItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      ),
      status: "Processing" as const,
    };

    try {
      const createdOrder = await dispatch(addOrder(newOrderData)).unwrap();

      // Send order notification email
      try {
        const itemsList = cartItems
          .map((item) => `${item.name} × ${item.quantity} = ${(item.price * item.quantity).toLocaleString("uk-UA")} ${item.currency}`)
          .join("\n");

        const deliveryText = deliveryInfo.method === "pickup"
          ? "Самовивіз"
          : `Нова Пошта — ${deliveryInfo.cityName || ""}, ${deliveryInfo.branchName || ""}`;

        const paymentText = paymentInfo.method === "cash" ? "Готівка" : "Картка";

        await emailjs.send(
          "service_ofl5lph",
          "template_bk7qet8",
          {
            name: customerInfo.name,
            phoneNumber: customerInfo.phone,
            city: deliveryInfo.cityName || "Самовивіз",
            trailer: itemsList,
            email: customerInfo.email,
            paymentMethod: paymentText,
            deliveryMethod: deliveryText,
            comments: "",
          },
          "qQGABM2Wj9sjgRw40"
        );
      } catch (emailError) {
        console.error("Failed to send order email:", emailError);
        // Don't block the flow — order is already saved
      }

      dispatch(clearCart());
      showToast("Замовлення успішно оформлено!");
      navigate(`/order-confirmation/${createdOrder.id}`);
    } catch (error: any) {
      console.error("Failed to place order:", error);
      const errorMessage =
        error || "Не вдалося створити замовлення. Спробуйте ще раз.";
      showError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  }, [isSubmitting, customerInfo, deliveryInfo, paymentInfo, cartItems, dispatch, navigate, showToast, showError]);

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <CustomerInfoStep
            data={customerInfo}
            onUpdate={setCustomerInfo}
            onNext={handleNextStep}
          />
        );
      case 2:
        return (
          <DeliveryPaymentStep
            deliveryData={deliveryInfo}
            paymentData={paymentInfo}
            onUpdateDelivery={setDeliveryInfo}
            onUpdatePayment={setPaymentInfo}
            onNext={handleNextStep}
            onBack={handlePrevStep}
          />
        );
      case 3:
        return (
          <OrderSummaryStep
            customerInfo={customerInfo}
            deliveryInfo={deliveryInfo}
            paymentInfo={paymentInfo}
            onConfirm={handlePlaceOrder}
            onBack={handlePrevStep}
            isSubmitting={isSubmitting}
          />
        );
      default:
        return null;
    }
  };

  if (cartItems.length === 0 && currentStep === 1) {
    return (
      <div className="text-center py-20 bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)]">
        <h1 className="text-xl font-bold text-[var(--color-text)] mb-2">Ваш кошик порожній</h1>
        <p className="text-sm text-[var(--color-text-tertiary)] mb-6">
          Ви не можете оформити замовлення, доки не додасте товари в кошик.
        </p>
        <Button onClick={() => navigate("/")} variant="accent">
          Перейти до покупок
        </Button>
      </div>
    );
  }

  return (
    <div className="py-4 md:py-6 max-w-4xl mx-auto">
      <button
        onClick={() => navigate("/cart")}
        className="flex items-center gap-1.5 text-xs text-[var(--color-text-tertiary)] hover:text-[var(--color-primary)] transition-colors mb-4"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Назад до кошика
      </button>

      <h1 className="text-xl md:text-2xl font-bold text-[var(--color-text)] mb-4 md:mb-6 text-center">
        Оформлення замовлення
      </h1>

      <Stepper steps={STEPS} currentStep={currentStep} />
      <div className="mt-6 bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] p-4 md:p-6">
        {renderStep()}
      </div>
    </div>
  );
};

export default CheckoutPage;
