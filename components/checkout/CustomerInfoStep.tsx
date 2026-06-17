import React, { useState } from 'react';
import { CustomerInfo } from '../../pages/CheckoutPage';
import Button from '../Button';

interface Props {
    data: CustomerInfo;
    onUpdate: (data: CustomerInfo) => void;
    onNext: () => void;
}

const CustomerInfoStep: React.FC<Props> = ({ data, onUpdate, onNext }) => {
    const [formData, setFormData] = useState<CustomerInfo>(data);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleNext = (e: React.FormEvent) => {
        e.preventDefault();
        onUpdate(formData);
        onNext();
    };

    return (
        <form onSubmit={handleNext}>
            <h2 className="text-lg font-bold text-[var(--color-text)] mb-4">Контактна інформація</h2>
            <div className="space-y-4">
                <div>
                    <label htmlFor="name" className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1.5">Повне ім'я</label>
                    <input type="text" name="name" id="name" required value={formData.name} onChange={handleChange} />
                </div>
                <div>
                    <label htmlFor="email" className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1.5">Email</label>
                    <input type="email" name="email" id="email" required value={formData.email} onChange={handleChange} />
                </div>
                <div>
                    <label htmlFor="phone" className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1.5">Номер телефону</label>
                    <input type="tel" name="phone" id="phone" required value={formData.phone} onChange={handleChange} />
                </div>
            </div>
            <div className="mt-6 text-right">
                <Button type="submit" variant="accent">Далі: Доставка та оплата</Button>
            </div>
        </form>
    );
};

export default CustomerInfoStep;
