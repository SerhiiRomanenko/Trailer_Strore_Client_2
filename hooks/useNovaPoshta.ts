import { useState, useCallback } from "react";

const API_URL = "https://api.novaposhta.ua/v2.0/json/";
const API_KEY: string = "62ed425a55417a2c220bbb9e19a6f7e8";

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

  const apiRequest = async (
    modelName: string,
    calledMethod: string,
    methodProperties: object
  ) => {
    if (API_KEY === "YOUR_NOVA_POSHTA_API_KEY") {
      const message = "API-ключ Нової Пошти не налаштовано.";
      console.error(message);
      setError(message);
      return null;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          apiKey: API_KEY,
          modelName,
          calledMethod,
          methodProperties,
        }),
      });

      if (!response.ok) {
        throw new Error("Помилка мережі при запиті до API Нової Пошти");
      }

      const data = await response.json();

      if (data.success) {
        return data.data;
      } else {
        const errorString = data.errors.join(", ");
        throw new Error(errorString || "Невідома помилка API.");
      }
    } catch (err: any) {
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

      const data = await apiRequest("Address", "searchSettlements", {
        CityName: searchQuery,
        Limit: "10",
      });

      const addresses = data?.[0]?.Addresses || [];

      return addresses.map((addr: any) => ({
        Description: addr.Present,
        Ref: addr.Ref,
        SettlementTypeDescription: addr.SettlementTypeDescription,
      }));
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
