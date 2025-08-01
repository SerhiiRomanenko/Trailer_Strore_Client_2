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
}

const OrderSummaryStep: React.FC<Props> = ({ customerInfo, deliveryInfo, paymentInfo, onConfirm, onBack }) => {
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
            <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center">Підтвердження замовлення</h2>
            
            <div className="space-y-6 bg-slate-50 p-6 rounded-lg border border-slate-200">
                <div>
                    <h3 className="font-semibold text-lg mb-3 text-slate-700">Товари в замовленні</h3>
                    <div className="space-y-3">
                        {cartItems.map(item => (
                            <div key={item.id} className="flex justify-between items-center text-sm">
                                <span className="text-slate-800">{item.name} <span className="text-slate-500">x {item.quantity}</span></span>
                                <span className="font-medium text-slate-900">{(item.price * item.quantity).toLocaleString('uk-UA')} UAH</span>
                            </div>
                        ))}
                    </div>
                    <div className="mt-4 pt-4 border-t border-slate-200 flex justify-between items-baseline">
                        <span className="font-bold text-xl text-slate-900">Всього:</span>
                        <span className="font-black text-2xl text-slate-900">{totalPrice.toLocaleString('uk-UA')} UAH</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-slate-200">
                     <div>
                        <h3 className="font-semibold text-lg mb-2 text-slate-700">Дані покупця</h3>
                        <div className="space-y-1 text-slate-600">
                            <p>{customerInfo.name}</p>
                            <p>{customerInfo.email}</p>
                            <p>{customerInfo.phone}</p>
                        </div>
                    </div>
                    <div>
                        <h3 className="font-semibold text-lg mb-2 text-slate-700">Доставка та оплата</h3>
                         <div className="space-y-1 text-slate-600">
                            <p>{getDeliveryText()}</p>
                            <p>{getPaymentText()}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-8 flex justify-between items-center">
                <Button type="button" variant="secondary" onClick={onBack}>Назад</Button>
                <Button type="button" variant="primary" onClick={onConfirm}>Підтвердити замовлення</Button>
            </div>
        </div>
    );
};

export default OrderSummaryStep;