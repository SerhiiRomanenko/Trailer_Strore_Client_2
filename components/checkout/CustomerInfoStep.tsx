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

    const inputClasses = "w-full px-4 py-2.5 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors";

    return (
        <form onSubmit={handleNext}>
            <h2 className="text-2xl font-bold text-slate-800 mb-6">Контактна інформація</h2>
            <div className="space-y-4">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">Повне ім'я</label>
                    <input type="text" name="name" id="name" required value={formData.name} onChange={handleChange} className={inputClasses} />
                </div>
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                    <input type="email" name="email" id="email" required value={formData.email} onChange={handleChange} className={inputClasses} />
                </div>
                <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-1">Номер телефону</label>
                    <input type="tel" name="phone" id="phone" required value={formData.phone} onChange={handleChange} className={inputClasses} />
                </div>
            </div>
            <div className="mt-8 text-right">
                <Button type="submit" variant="primary">Далі: Доставка та оплата</Button>
            </div>
        </form>
    );
};

export default CustomerInfoStep;