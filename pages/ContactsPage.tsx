import React, { useState, useEffect } from "react";
import { MapPin, Phone, Mail, Clock, Send } from "lucide-react";
import { useToast } from "../components/Toast";
import emailjs from "emailjs-com";

const ContactsPage: React.FC = () => {
  const { success, error: showError } = useToast();
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [sending, setSending] = useState(false);

  useEffect(() => {
    document.title = "Контакти | ПричепМаркет";
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);

    try {
      const serviceID = "service_ofl5lph";
      const templateID = "template_u21l3gf";
      const publicKey = "qQGABM2WJ9sjgRw40";

      await emailjs.send(serviceID, templateID, {
        name: formState.name,
        email: formState.email,
        question: formState.message,
      }, publicKey);

      success("Повідомлення надіслано", "Ми зв'яжемося з вами найближчим часом.");
      setFormState({ name: "", email: "", message: "" });
    } catch {
      showError("Не вдалося надіслати повідомлення. Спробуйте ще раз.");
    } finally {
      setSending(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormState({ ...formState, [e.target.name]: e.target.value });
  };

  const ContactCard = ({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) => (
    <div className="flex items-start gap-3">
      <div className="p-2 rounded-lg bg-[var(--color-bg)] text-[var(--color-text-secondary)]">
        {icon}
      </div>
      <div>
        <h3 className="text-sm font-medium text-[var(--color-text)]">{title}</h3>
        <div className="text-sm text-[var(--color-text-secondary)] mt-0.5">{children}</div>
      </div>
    </div>
  );

  return (
    <div className="py-4 md:py-6">
      <h1 className="text-xl md:text-2xl font-bold text-[var(--color-text)] mb-4 md:mb-6">Контакти</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* Contact info */}
        <div className="space-y-4 md:space-y-6">
          <div className="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] p-4 md:p-5">
            <h2 className="text-sm font-semibold text-[var(--color-text)] mb-4">Зв'яжіться з нами</h2>
            <div className="space-y-4">
              <ContactCard icon={<MapPin className="h-4 w-4" />} title="Адреса">
                <p>Київська обл., смт. Ворзель, вул. Яблунська, 11</p>
                <p className="text-xs text-[var(--color-text-tertiary)] mt-1">
                  Приїзд, будь ласка, узгоджуйте заздалегідь телефоном — я не завжди на місці.
                </p>
              </ContactCard>
              <ContactCard icon={<Phone className="h-4 w-4" />} title="Телефон">
                <a href="tel:+380679372731" className="text-[var(--color-link)] hover:underline">
                  +38 (067) 937-27-31
                </a>
              </ContactCard>
              <ContactCard icon={<Mail className="h-4 w-4" />} title="Email">
                <a href="mailto:serhiiromanenko13@gmail.com" className="text-[var(--color-link)] hover:underline break-all">
                  serhiiromanenko13@gmail.com
                </a>
              </ContactCard>
              <ContactCard icon={<Clock className="h-4 w-4" />} title="Години роботи">
                <p>Пн — Пт: 09:00 — 18:00</p>
                <p className="text-[var(--color-text-tertiary)]">Сб — Нд: Вихідний</p>
              </ContactCard>
            </div>
          </div>

          {/* Map */}
          <div className="rounded-xl overflow-hidden border border-[var(--color-border)]">
            <iframe
              src="https://maps.google.com/maps?q=50.531206,30.168801&hl=uk&z=17&output=embed"
              className="w-full border-0"
              style={{ height: "250px" }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Карта"
            />
          </div>
        </div>

        {/* Contact form */}
        <div className="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] p-4 md:p-5">
          <h2 className="text-sm font-semibold text-[var(--color-text)] mb-4">Напишіть нам</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="contact-name" className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1.5">
                Ім'я
              </label>
              <input
                type="text"
                name="name"
                id="contact-name"
                required
                value={formState.name}
                onChange={handleChange}
                placeholder="Ваше ім'я"
                className="w-full"
              />
            </div>
            <div>
              <label htmlFor="contact-email" className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1.5">
                Email
              </label>
              <input
                type="email"
                name="email"
                id="contact-email"
                required
                value={formState.email}
                onChange={handleChange}
                placeholder="your@email.com"
                className="w-full"
              />
            </div>
            <div>
              <label htmlFor="contact-message" className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1.5">
                Повідомлення
              </label>
              <textarea
                name="message"
                id="contact-message"
                required
                rows={5}
                value={formState.message}
                onChange={handleChange}
                className="w-full resize-none"
                placeholder="Ваше повідомлення..."
              />
            </div>
            <button
              type="submit"
              disabled={sending}
              className="w-full text-sm font-semibold py-2.5 rounded-md bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-hover)] transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Send className="h-4 w-4" />
              {sending ? "Надсилання..." : "Надіслати"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactsPage;
