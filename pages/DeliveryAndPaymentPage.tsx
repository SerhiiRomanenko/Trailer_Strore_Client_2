import React, { useEffect } from "react";

const DeliveryAndPaymentPage: React.FC = () => {
  useEffect(() => {
    document.title = "Доставка і оплата | Trailers";
    const descTag = document.querySelector('meta[name="description"]');
    if (descTag) {
      descTag.setAttribute(
        "content",
        "Дізнайтесь про умови доставки та доступні способи оплати причепів в нашому магазині."
      );
    }
  }, []);

  return (
    <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg border border-slate-200 max-w-4xl mx-auto">
      <h1 className="text-3xl font-black text-slate-900 mb-6 text-center">
        Оплата та доставка
      </h1>

      <div className="space-y-10">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 mb-4">
            Способи оплати
          </h2>
          <div className="space-y-4 text-slate-600">
            <div className="p-6 border border-slate-200 rounded-lg bg-slate-50">
              <h3 className="font-bold text-lg text-slate-800">
                Готівкою при отриманні
              </h3>
              <p className="mt-2">
                Оплата готівкою можлива при самовивозі зі складу або при
                отриманні товару у відділенні "Нової Пошти" (накладений платіж).
              </p>
              <p className="text-sm mt-1">
                Зверніть увагу, що "Нова Пошта" стягує комісію за переказ
                коштів.
              </p>
            </div>
            <div className="p-6 border border-slate-200 rounded-lg bg-slate-50">
              <h3 className="font-bold text-lg text-slate-800">
                Онлайн-оплата карткою (Visa/MasterCard)
              </h3>
              <p className="mt-2">
                Ви можете оплатити замовлення онлайн за допомогою платіжних карт
                Visa та MasterCard. Платіж відбувається через безпечний
                платіжний шлюз.
              </p>
              <p className="text-sm mt-1 text-red-500 font-medium">
                (Цей спосіб оплати тимчасово недоступний).
              </p>
            </div>
            <div className="p-6 border border-slate-200 rounded-lg bg-slate-50">
              <h3 className="font-bold text-lg text-slate-800">
                Безготівковий розрахунок
              </h3>
              <p className="mt-2">
                Для юридичних осіб та ФОП доступна оплата за безготівковим
                розрахунком. Ми виставимо вам рахунок-фактуру для оплати.
              </p>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-slate-800 mb-4">
            Способи доставки
          </h2>
          <div className="space-y-4 text-slate-600">
            <div className="p-6 border border-slate-200 rounded-lg bg-slate-50">
              <h3 className="font-bold text-lg text-slate-800">
                Самовивіз зі складу
              </h3>
              <p className="mt-2">
                Ви можете безкоштовно забрати своє замовлення з нашого складу за
                адресою:
              </p>
              <p className="font-semibold text-slate-700 mt-1">
                Київська обл., Бучанський р-н, смт. Ворзель, вул. Яблунська, 11
              </p>
              <p className="text-sm mt-1">
                Графік роботи: Пн-Пт, 09:00 - 18:00.
              </p>
            </div>
            <div className="p-6 border border-slate-200 rounded-lg bg-slate-50">
              <h3 className="font-bold text-lg text-slate-800">
                Доставка по Україні "Новою Поштою"
              </h3>
              <p className="mt-2">
                Ми відправляємо причепи по всій Україні службою доставки "Нова
                Пошта".
              </p>
              <p className="mt-1">
                Доставка може здійснюватися як на вантажне відділення, так і за
                адресою.
              </p>
              <p className="text-sm mt-1">
                Вартість доставки розраховується індивідуально за тарифами
                перевізника та залежить від ваги, габаритів та відстані.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeliveryAndPaymentPage;
