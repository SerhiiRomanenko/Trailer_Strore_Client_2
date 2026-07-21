import React from 'react';
import { useSelector } from 'react-redux';
import { CustomerInfo, DeliveryInfo, PaymentInfo } from '../../pages/CheckoutPage';
import { RootState } from '../../redux/store';
import Button from '../Button';

interface Props {
    customerInfo: CustomerInfo;
    deliveryInfo: DeliveryInfo;
    paymentInfo: PaymentInfo;
    onConfirm: () => void;
    onBack: () => void;
    isSubmitting?: boolean;
}

const OrderSummaryStep: React.FC<Props> = ({ customerInfo, deliveryInfo, paymentInfo, onConfirm, onBack, isSubmitting }) => {
    const cartItems = useSelector((state: RootState) => state.cart.items);
    const totalPrice = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    const getDeliveryText = () => {
        if (deliveryInfo.method === 'pickup') {
            return 'Самовивіз зі складу';
        }
        if (deliveryInfo.cityName && deliveryInfo.branchName) {
            return `Нова Пошта: ${deliveryInfo.cityName}, ${deliveryInfo.branchName}`;
        }
        return 'Нова Пошта (не вказано відділення)';
    };

    const getPaymentText = () => {
        return paymentInfo.method === 'cash' ? 'Готівкою при отриманні' : 'Оплата карткою';
    }

    return (
        <div>
            <h2 className="text-lg font-bold text-[var(--color-text)] mb-4 text-center">Підтвердження замовлення</h2>

            <div className="space-y-4 bg-[var(--color-bg)] p-4 rounded-lg border border-[var(--color-border)]">
                <div>
                    <h3 className="font-semibold text-sm mb-3 text-[var(--color-text)]">Товари в замовленні</h3>
                    <div className="space-y-2">
                        {cartItems.map(item => (
                            <div key={item.id} className="flex justify-between items-center text-sm">
                                <span className="text-[var(--color-text-secondary)]">{item.name} <span className="text-[var(--color-text-tertiary)]">x {item.quantity}</span></span>
                                <span className="font-medium text-[var(--color-text)]">{(item.price * item.quantity).toLocaleString('uk-UA')} UAH</span>
                            </div>
                        ))}
                    </div>
                    <div className="mt-3 pt-3 border-t border-[var(--color-border)] flex justify-between items-baseline">
                        <span className="font-bold text-[var(--color-text)]">Всього:</span>
                        <span className="font-bold text-lg text-[var(--color-text)]">{totalPrice.toLocaleString('uk-UA')} UAH</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-[var(--color-border)]">
                     <div>
                        <h3 className="font-semibold text-sm mb-2 text-[var(--color-text)]">Дані покупця</h3>
                        <div className="space-y-0.5 text-sm text-[var(--color-text-secondary)]">
                            <p>{customerInfo.name}</p>
                            <p>{customerInfo.email}</p>
                            <p>{customerInfo.phone}</p>
                        </div>
                    </div>
                    <div>
                        <h3 className="font-semibold text-sm mb-2 text-[var(--color-text)]">Доставка та оплата</h3>
                         <div className="space-y-0.5 text-sm text-[var(--color-text-secondary)]">
                            <p>{getDeliveryText()}</p>
                            <p>{getPaymentText()}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-6 flex justify-between items-center">
                <Button type="button" variant="secondary" onClick={onBack}>Назад</Button>
                <Button type="button" variant="accent" onClick={onConfirm} disabled={isSubmitting}>
                  {isSubmitting ? "Оформлюємо..." : "Підтвердити замовлення"}
                </Button>
            </div>
        </div>
    );
};

export default OrderSummaryStep;
