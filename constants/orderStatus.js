const ORDER_STATUS = {
    PENDING: "pending",
    SHIPPED: "shipped",
    DELIVERED: "delivered",
    CANCELED: "canceled",
    PAID: "paid",
    FINISHED: "finished",
  }
  
  const ALLOWED_ORDER_STATUSES = Object.values(ORDER_STATUS)
  
  module.exports = { ORDER_STATUS, ALLOWED_ORDER_STATUSES }