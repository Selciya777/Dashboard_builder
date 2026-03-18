// Fake API using localStorage

export const getOrders = async () => {

  const orders = JSON.parse(localStorage.getItem("orders")) || []

  return orders
}

export const createOrder = async (order) => {

  const orders = JSON.parse(localStorage.getItem("orders")) || []

  const newOrder = {
    id: Date.now(),
    ...order
  }

  const updated = [...orders, newOrder]

  localStorage.setItem("orders", JSON.stringify(updated))

  return newOrder
}