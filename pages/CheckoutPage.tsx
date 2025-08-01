import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAuth } from "../contexts/AuthContext";
import { RootState, AppDispatch } from "../redux/store";
import { addOrder } from "../redux/ordersSlice";
import { clearCart } from "../redux/cartSlice";

import Stepper from "../components/checkout/Stepper";
import CustomerInfoStep from "../components/checkout/CustomerInfoStep";
import DeliveryPaymentStep from "../components/checkout/DeliveryPaymentStep";
import OrderSummaryStep from "../components/checkout/OrderSummaryStep";
import Button from "../components/Button";

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
  const { currentUser, setAuthMessage } = useAuth(); // Додано setAuthMessage для відображення повідомлень
  const cartItems = useSelector((state: RootState) => state.cart.items);

  const [currentStep, setCurrentStep] = useState(1);

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

  const navigate = (path: string) => {
    window.history.pushState({}, "", path);
    window.dispatchEvent(new Event("locationchange"));
  };

  const handleNextStep = () => setCurrentStep((prev) => prev + 1);
  const handlePrevStep = () => setCurrentStep((prev) => prev - 1);

  const handlePlaceOrder = async () => {
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
      dispatch(clearCart());
      setAuthMessage({
        type: "success",
        text: "Замовлення успішно оформлено!",
      });
      navigate(`/order-confirmation/${createdOrder.id}`);
    } catch (error: any) {
      console.error("Failed to place order:", error);
      const errorMessage =
        error.message || "Не вдалося створити замовлення. Спробуйте ще раз.";
      setAuthMessage({ type: "error", text: errorMessage });
    }
  };

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
          />
        );
      default:
        return null;
    }
  };

  if (cartItems.length === 0 && currentStep === 1) {
    return (
      <div className="text-center py-20 px-6 bg-white rounded-xl border border-gray-200">
        <h1 className="text-3xl font-bold text-gray-800">Ваш кошик порожній</h1>
        <p className="text-gray-500 mt-3 mb-6">
          Ви не можете оформити замовлення, доки не додасте товари в кошик.
        </p>
        <Button onClick={() => navigate("/")} variant="primary">
          Перейти до покупок
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto bg-white p-6 sm:p-8 rounded-xl shadow-lg border border-gray-200">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-6 text-center">
        Оформлення замовлення
      </h1>
      <Stepper steps={STEPS} currentStep={currentStep} />
      <div className="mt-10">{renderStep()}</div>
    </div>
  );
};

export default CheckoutPage;
