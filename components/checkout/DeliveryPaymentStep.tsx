import React, { useState } from "react";
import { DeliveryInfo, PaymentInfo } from "../../pages/CheckoutPage";
import Button from "../Button";
import { useNovaPoshta, City, Warehouse } from "../../hooks/useNovaPoshta";
import Autocomplete from "./Autocomplete";
import SpinnerIcon from "../icons/SpinnerIcon";

interface Props {
  deliveryData: DeliveryInfo;
  paymentData: PaymentInfo;
  onUpdateDelivery: (data: DeliveryInfo) => void;
  onUpdatePayment: (data: PaymentInfo) => void;
  onNext: () => void;
  onBack: () => void;
}

const DeliveryPaymentStep: React.FC<Props> = ({
  deliveryData,
  paymentData,
  onUpdateDelivery,
  onUpdatePayment,
  onNext,
  onBack,
}) => {
  const {
    loading: npApiLoading,
    error: npApiError,
    searchCities,
    getWarehouses,
  } = useNovaPoshta();

  const [citySearch, setCitySearch] = useState(deliveryData.cityName || "");
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [warehousesLoading, setWarehousesLoading] = useState(false);

  const handleDeliveryMethodChange = (method: "pickup" | "nova-poshta") => {
    onUpdateDelivery({
      method: method,
      cityName: "",
      cityRef: "",
      branchName: "",
      branchRef: "",
    });
    setCitySearch("");
    setWarehouses([]);
  };

  const handlePaymentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdatePayment({
      ...paymentData,
      method: e.target.value as "cash" | "card",
    });
  };

  const handleCitySelect = async (city: City) => {
    setCitySearch(city.Description);
    onUpdateDelivery({
      ...deliveryData,
      method: "nova-poshta",
      cityName: city.Description,
      cityRef: city.Ref,
      branchName: "",
      branchRef: "",
    });

    setWarehousesLoading(true);
    const fetchedWarehouses = await getWarehouses(city.Ref);
    setWarehouses(fetchedWarehouses);
    setWarehousesLoading(false);
  };

  const handleBranchSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedRef = e.target.value;
    const selectedBranch = warehouses.find((wh) => wh.Ref === selectedRef);
    if (selectedBranch) {
      onUpdateDelivery({
        ...deliveryData,
        branchRef: selectedBranch.Ref,
        branchName: selectedBranch.Description,
      });
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext();
  };

  const inputClasses =
    "w-full px-4 py-2.5 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors";
  const radioCardBaseClasses =
    "block p-5 border rounded-lg cursor-pointer transition-all duration-200";
  const radioCardActiveClasses =
    "bg-orange-50 border-orange-500 ring-2 ring-orange-500";
  const radioCardInactiveClasses = "border-slate-200 hover:border-slate-400";

  return (
    <form onSubmit={handleFormSubmit}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 mb-4">
            Спосіб доставки
          </h2>
          <div className="space-y-4">
            <label
              className={`${radioCardBaseClasses} ${
                deliveryData.method === "pickup"
                  ? radioCardActiveClasses
                  : radioCardInactiveClasses
              }`}
            >
              <div className="flex items-center">
                <input
                  type="radio"
                  name="method"
                  value="pickup"
                  checked={deliveryData.method === "pickup"}
                  onChange={() => handleDeliveryMethodChange("pickup")}
                  className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-slate-300"
                />
                <span className="ml-3 font-semibold text-slate-800">
                  Самовивіз
                </span>
              </div>
              <p className="text-sm text-slate-500 mt-2 ml-7">
                Забрати зі складу: м. Ворзель, вул. Яблунська, 11
              </p>
            </label>
            <label
              className={`${radioCardBaseClasses} ${
                deliveryData.method === "nova-poshta"
                  ? radioCardActiveClasses
                  : radioCardInactiveClasses
              }`}
            >
              <div className="flex items-center">
                <input
                  type="radio"
                  name="method"
                  value="nova-poshta"
                  checked={deliveryData.method === "nova-poshta"}
                  onChange={() => handleDeliveryMethodChange("nova-poshta")}
                  className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-slate-300"
                />
                <span className="ml-3 font-semibold text-slate-800">
                  Нова Пошта
                </span>
              </div>
              {deliveryData.method === "nova-poshta" && (
                <div className="mt-4 space-y-4 ml-7">
                  <Autocomplete
                    value={citySearch}
                    onChange={setCitySearch}
                    onSelect={handleCitySelect}
                    getSuggestions={searchCities}
                    placeholder="Введіть назву міста"
                  />

                  {warehousesLoading && (
                    <div className="flex items-center gap-2 text-slate-500">
                      <SpinnerIcon className="h-5 w-5" />
                      <span>Завантаження відділень...</span>
                    </div>
                  )}

                  {deliveryData.cityRef &&
                    !warehousesLoading &&
                    warehouses.length > 0 && (
                      <select
                        name="branch"
                        value={deliveryData.branchRef || ""}
                        onChange={handleBranchSelect}
                        required
                        className={inputClasses}
                      >
                        <option value="" disabled>
                          Оберіть вантажне відділення
                        </option>
                        {warehouses.map((wh) => (
                          <option key={wh.Ref} value={wh.Ref}>
                            {wh.Description}
                          </option>
                        ))}
                      </select>
                    )}

                  {deliveryData.cityRef &&
                    !warehousesLoading &&
                    warehouses.length === 0 &&
                    npApiError === null && (
                      <p className="text-sm text-red-500 mt-2">
                        У цьому місті немає вантажних відділень. Спробуйте інше.
                      </p>
                    )}

                  {npApiError && (
                    <p className="text-sm text-red-500 mt-2">
                      Помилка API: {npApiError}
                    </p>
                  )}
                </div>
              )}
            </label>
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-800 mb-4">
            Спосіб оплати
          </h2>
          <div className="space-y-4">
            <label
              className={`${radioCardBaseClasses} ${
                paymentData.method === "cash"
                  ? radioCardActiveClasses
                  : radioCardInactiveClasses
              }`}
            >
              <div className="flex items-center">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cash"
                  checked={paymentData.method === "cash"}
                  onChange={handlePaymentChange}
                  className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-slate-300"
                />
                <span className="ml-3 font-semibold text-slate-800">
                  Готівкою при отриманні
                </span>
              </div>
              <p className="text-sm text-slate-500 mt-2 ml-7">
                Оплата при отриманні товару.
              </p>
            </label>
            <label
              className={`${radioCardBaseClasses} ${
                paymentData.method === "card"
                  ? radioCardActiveClasses
                  : radioCardInactiveClasses
              }`}
            >
              <div className="flex items-center">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="card"
                  checked={paymentData.method === "card"}
                  onChange={handlePaymentChange}
                  className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-slate-300"
                />
                <span className="ml-3 font-semibold text-slate-800">
                  Оплата карткою (Online)
                </span>
              </div>
              <p className="text-sm text-slate-500 mt-2 ml-7">
                Оплата буде проведена через платіжний шлюз (зараз недоступно).
              </p>
            </label>
          </div>
        </div>
      </div>
      <div className="mt-10 flex justify-between items-center">
        <Button type="button" variant="secondary" onClick={onBack}>
          Назад
        </Button>
        <Button type="submit" variant="primary">
          Далі: Підтвердження
        </Button>
      </div>
    </form>
  );
};

export default DeliveryPaymentStep;
