import React, { useEffect } from "react";
import { CreditCard, Banknote, Building2, Truck, MapPin, Clock } from "lucide-react";
import { setMeta, SITE_URL } from "../utils/seo";

const DeliveryAndPaymentPage: React.FC = () => {
  useEffect(() => {
    const title = "Доставка і оплата | ПричепМаркет";
    const desc = "Дізнайтесь про умови доставки Новою Поштою, самовивіз, та доступні способи оплати причепів: готівка, картка, безготівковий розрахунок.";
    const canonical = `${SITE_URL}/delivery-and-payment`;
    setMeta({ title, description: desc, canonical });
  }, []);

  const InfoCard = ({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) => (
    <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-4 md:p-5">
      <div className="flex items-center gap-2.5 mb-2">
        <div className="p-2 rounded-lg bg-[var(--color-bg)] text-[var(--color-primary)]">
          {icon}
        </div>
        <h3 className="font-semibold text-[var(--color-text)]">{title}</h3>
      </div>
      <div className="text-sm text-[var(--color-text-secondary)] space-y-1">
        {children}
      </div>
    </div>
  );

  return (
    <div className="py-4 md:py-6 max-w-4xl mx-auto">
      <h1 className="text-xl md:text-2xl font-bold text-[var(--color-text)] mb-4 md:mb-6">
        Оплата та доставка
      </h1>

      <div className="space-y-6 md:space-y-8">
        <section>
          <h2 className="text-sm font-semibold text-[var(--color-text)] mb-3 flex items-center gap-2">
            <span className="w-1.5 h-5 rounded-full bg-[var(--color-primary)]" />
            Способи оплати
          </h2>
          <div className="space-y-3">
            <InfoCard icon={<Banknote className="h-4 w-4" />} title="Готівкою при отриманні">
              <p>Оплата готівкою можлива при самовивозі зі складу або при отриманні товару у відділенні "Нової Пошти" (накладений платіж).</p>
              <p className="text-xs text-[var(--color-text-tertiary)]">
                Зверніть увагу, що "Нова Пошта" стягує комісію за переказ коштів.
              </p>
            </InfoCard>
            <InfoCard icon={<CreditCard className="h-4 w-4" />} title="Онлайн-оплата карткою (Visa/MasterCard)">
              <p>Ви можете оплатити замовлення онлайн за допомогою платіжних карт Visa та MasterCard. Платіж відбувається через безпечний платіжний шлюз.</p>
              <p className="text-xs text-[var(--color-error)] font-medium mt-2">
                Цей спосіб оплати тимчасово недоступний.
              </p>
            </InfoCard>
            <InfoCard icon={<Building2 className="h-4 w-4" />} title="Безготівковий розрахунок">
              <p>Для юридичних осіб та ФОП доступна оплата за безготівковим розрахунком. Ми виставимо вам рахунок-фактуру для оплати.</p>
            </InfoCard>
          </div>
        </section>

        <section>
          <h2 className="text-sm font-semibold text-[var(--color-text)] mb-3 flex items-center gap-2">
            <span className="w-1.5 h-5 rounded-full bg-[var(--color-primary)]" />
            Способи доставки
          </h2>
          <div className="space-y-3">
            <InfoCard icon={<MapPin className="h-4 w-4" />} title="Самовивіз зі складу">
              <p>Ви можете безкоштовно забрати своє замовлення з нашого складу:</p>
              <p className="font-medium text-[var(--color-text)] text-sm">
                Київська обл., Бучанський р-н, смт. Ворзель, вул. Яблунська, 11
              </p>
              <div className="flex items-center gap-1.5 mt-2 text-xs text-[var(--color-text-tertiary)]">
                <Clock className="h-3.5 w-3.5" />
                Пн-Пт, 09:00 — 18:00
              </div>
            </InfoCard>
            <InfoCard icon={<Truck className="h-4 w-4" />} title="Доставка по Україні «Новою Поштою»">
              <p>Ми відправляємо причепи по всій Україні службою доставки "Нова Пошта". Доставка може здійснюватися як на вантажне відділення, так і за адресою.</p>
              <p className="text-xs text-[var(--color-text-tertiary)] mt-1">
                Вартість доставки розраховується індивідуально за тарифами перевізника та залежить від ваги, габаритів та відстані.
              </p>
            </InfoCard>
          </div>
        </section>
      </div>
    </div>
  );
};

export default DeliveryAndPaymentPage;
