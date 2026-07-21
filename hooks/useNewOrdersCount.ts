import { useState, useEffect, useCallback, useRef } from "react";
import api from "../api/axiosInstance";

const CHECKED_IDS_KEY = "adminCheckedOrderIds";

function getCheckedIds(): Set<string> {
  try {
    const raw = localStorage.getItem(CHECKED_IDS_KEY);
    return new Set(raw ? JSON.parse(raw) : []);
  } catch {
    return new Set();
  }
}

function saveCheckedIds(ids: Set<string>) {
  try {
    localStorage.setItem(CHECKED_IDS_KEY, JSON.stringify([...ids]));
  } catch { /* silent */ }
}

export function clearNewOrdersCount() {
  api.get("/api/orders").then((res) => {
    const ids = new Set(res.data.map((o: { id: string }) => o.id));
    saveCheckedIds(ids);
  }).catch(() => { /* swallow */ });
}

export function useNewOrdersCount() {
  const [newCount, setNewCount] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const checkedRef = useRef<Set<string>>(getCheckedIds());

  const fetchAndCount = useCallback(() => {
    api.get("/api/orders").then((res) => {
      const currentIds = new Set(res.data.map((o: { id: string }) => o.id));
      const newOrders = res.data.filter((o: { id: string }) =>
        !checkedRef.current.has(o.id)
      );
      setNewCount(newOrders.length);

      if (newOrders.length > 0 && !showPopup) {
        setShowPopup(true);
      }
    }).catch(() => {
      setNewCount(0);
    });
  }, [showPopup]);

  useEffect(() => {
    fetchAndCount();
    const timer = setInterval(fetchAndCount, 15000);
    return () => clearInterval(timer);
  }, [fetchAndCount]);

  const dismiss = useCallback(() => {
    setShowPopup(false);
    api.get("/api/orders").then((res) => {
      checkedRef.current = new Set(res.data.map((o: { id: string }) => o.id));
      saveCheckedIds(checkedRef.current);
    }).catch(() => { /* swallow */ });
    setNewCount(0);
  }, []);

  const markChecked = useCallback(() => {
    api.get("/api/orders").then((res) => {
      checkedRef.current = new Set(res.data.map((o: { id: string }) => o.id));
      saveCheckedIds(checkedRef.current);
    }).catch(() => { /* swallow */ });
    setNewCount(0);
    setShowPopup(false);
  }, []);

  return { newCount, showPopup, dismiss, markChecked };
}
