import React, { createContext, useContext, useState, useEffect } from 'react';

const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("halleyx_orders") || "[]");
    setOrders(saved);
  }, []);

  const addOrder = (newOrder) => {
    const updated = [...orders, { ...newOrder, id: Date.now() }];
    setOrders(updated);
    localStorage.setItem("halleyx_orders", JSON.stringify(updated));
  };

  return (
    <OrderContext.Provider value={{ orders, addOrder }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => useContext(OrderContext);