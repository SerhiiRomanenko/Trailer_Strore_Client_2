import React, { useState, useEffect } from "react";
import Button from "../components/Button";
import BuildingOfficeIcon from "../components/icons/BuildingOfficeIcon";
import PhoneIcon from "../components/icons/PhoneIcon";
import EnvelopeIcon from "../components/icons/EnvelopeIcon";
import ClockIcon from "../components/icons/ClockIcon";
import emailjs from "emailjs-com";

const ContactsPage: React.FC = () => {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSent, setIsSent] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    document.title = "Контакти | Trailers";
    const descTag = document.querySelector('meta[name="description"]');
    if (descTag) {
      descTag.setAttribute(
        "content",
        "Зв'яжіться з нами для консультації та замовлення причепів. Адреса, телефон та email магазину Trailers."
      );
    }
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormState({ ...formState, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const serviceID = "service_ofl5lph";
    const templateID = "template_u21l3gf";
    const publicKey = "qQGABM2WJ9sjgRw40";

    const templateParams = {
      name: formState.name,
      email: formState.email,
      question: formState.message,
    };

    emailjs.send(serviceID, templateID, templateParams, publicKey).then(
      (response) => {
        console.log("SUCCESS!", response.status, response.text);
        setIsSent(true);
        setIsError(false);
        setFormState({ name: "", email: "", message: "" });
        setTimeout(() => setIsSent(false), 5000);
      },
      (err) => {
        console.log("FAILED...", err);
        setIsSent(false);
        setIsError(true);
        setTimeout(() => setIsError(false), 5000);
      }
    );
  };

  const inputClasses =
    "w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors";

  return (
    <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg border border-slate-200">
      <h1 className="text-4xl font-black text-slate-900 mb-8 text-center">
        Контакти
      </h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-4">
              Зв'яжіться з нами
            </h2>
            <div className="space-y-4 text-slate-600">
              <div className="flex items-start gap-4">
                <BuildingOfficeIcon className="h-6 w-6 text-orange-500 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-slate-800">Наша адреса</h3>
                  <p>
                    Київська обл., Бучанський р-н, смт. Ворзель, вул. Яблунська,
                    11
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <PhoneIcon className="h-6 w-6 text-orange-500 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-slate-800">Телефон</h3>
                  <a
                    className="text-orange-600 hover:text-orange-700 hover:underline"
                    href="tel:380679372731"
                  >
                    +38 (067) 937-27-31
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <EnvelopeIcon className="h-6 w-6 text-orange-500 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-slate-800">Email</h3>
                  <a
                    className="text-orange-600 hover:text-orange-700 hover:underline"
                    href="mailto:serhiiromanenko13@gmail.com"
                  >
                    serhiiromanenko13@gmail.com
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <ClockIcon className="h-6 w-6 text-orange-500 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-slate-800">
                    Години роботи
                  </h3>
                  <p>Пн - Пт: 09:00 - 18:00</p>
                  <p>Сб - Нд: Вихідний</p>
                </div>
              </div>
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-4">
              Наше розташування
            </h2>
            <div className="rounded-lg overflow-hidden shadow-md border border-slate-200">
              <iframe
                src="https://maps.google.com/maps?q=50.531206,30.168801&hl=uk&z=17&output=embed"
                className="w-full h-80 border-0"
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Карта розташування"
              ></iframe>
            </div>
          </div>
        </div>
        <div>
          <div className="bg-slate-50 p-8 rounded-lg border border-slate-200 h-full">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">
              Напишіть нам
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-slate-700 mb-1"
                >
                  Ваше ім'я
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  required
                  value={formState.name}
                  onChange={handleChange}
                  className={inputClasses}
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-slate-700 mb-1"
                >
                  Ваш Email
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  required
                  value={formState.email}
                  onChange={handleChange}
                  className={inputClasses}
                />
              </div>
              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-slate-700 mb-1"
                >
                  Повідомлення
                </label>
                <textarea
                  name="message"
                  id="message"
                  required
                  rows={5}
                  value={formState.message}
                  onChange={handleChange}
                  className={inputClasses}
                />
              </div>
              <div>
                <Button type="submit" variant="primary" className="w-full">
                  Надіслати повідомлення
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {(isSent || isError) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div
            className={`p-8 rounded-xl shadow-2xl transform transition-transform duration-300 ease-out 
                         ${
                           isSent
                             ? "bg-emerald-100 border-emerald-500"
                             : "bg-rose-100 border-rose-500"
                         } 
                         scale-100`}
          >
            <div className="text-center">
              {isSent ? (
                <div className="text-emerald-600">
                  <svg
                    className="w-16 h-16 mx-auto mb-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <p className="text-2xl font-bold">Успішно!</p>
                  <p className="mt-2 text-lg">
                    Дякуємо! Ваше повідомлення надіслано.
                  </p>
                </div>
              ) : (
                <div className="text-rose-600">
                  <svg
                    className="w-16 h-16 mx-auto mb-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <p className="text-2xl font-bold">Помилка!</p>
                  <p className="mt-2 text-lg">
                    Повідомлення не вдалося надіслати.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactsPage;
