import { useState, useCallback, useRef, useEffect } from "react";

const API_URL = import.meta.env.VITE_API_NOVAPOST_URL || "https://api.novaposhta.ua/v2.0/json/";
const API_KEY: string = import.meta.env.VITE_API_NOVAPOST_KEY || "";
const REQUEST_TIMEOUT = 10000;
const DEBOUNCE_MS = 350;

export interface City {
  Description: string;
  Ref: string;
  SettlementTypeDescription: string;
}

export interface Warehouse {
  Description: string;
  Ref: string;
}

export const useNovaPoshta = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      abortRef.current?.abort();
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    };
  }, []);

  const apiRequest = async (
    modelName: string,
    calledMethod: string,
    methodProperties: object
  ) => {
    if (API_KEY === "YOUR_NOVA_POSHTA_API_KEY" || !API_KEY) {
      const message = "API-ключ Нової Пошти не налаштовано.";
      console.error(message);
      setError(message);
      return null;
    }

    // Cancel any in-flight request
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    setError(null);

    try {
      const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          apiKey: API_KEY,
          modelName,
          calledMethod,
          methodProperties,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (!response.ok) {
        throw new Error("Помилка мережі при запиті до API Нової Пошти");
      }

      const data = await response.json();

      if (data.success) {
        return data.data;
      } else {
        const errorString = data.errors?.join(", ") || "Невідома помилка API.";
        throw new Error(errorString);
      }
    } catch (err: any) {
      if (err.name === "AbortError") return null;
      console.error("Помилка API Нової Пошти:", err);
      setError(err.message || "Не вдалося завантажити дані з API Нової Пошти.");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const searchCities = useCallback(
    async (searchQuery: string): Promise<City[]> => {
      if (searchQuery.length < 2) return [];

      // Debounce the actual API call
      return new Promise((resolve) => {
        if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);

        debounceTimerRef.current = setTimeout(async () => {
          const data = await apiRequest("Address", "searchSettlements", {
            CityName: searchQuery,
            Limit: "10",
          });

          const addresses = data?.[0]?.Addresses || [];
          const results: City[] = addresses.map((addr: any) => ({
            Description: addr.Present,
            Ref: addr.Ref,
            SettlementTypeDescription: addr.SettlementTypeDescription,
          }));
          resolve(results);
        }, DEBOUNCE_MS);
      });
    },
    []
  );

  const getWarehouses = useCallback(
    async (cityRef: string): Promise<Warehouse[]> => {
      const data = await apiRequest("Address", "getWarehouses", {
        SettlementRef: cityRef,
        TypeOfWarehouseRef: "9a68df70-0267-42a8-bb5c-37f427e36ee4",
        Limit: "200",
      });
      return data || [];
    },
    []
  );

  return { loading, error, searchCities, getWarehouses };
};
