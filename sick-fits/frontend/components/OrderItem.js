import React from "react";
import formatMoney from "../lib/formatMoney";

const OrderItem = props => {
  const item = props.item;
  return (
    <div className="order-item" key={item.id}>
      <img src={item.image} alt={item.title} />
      <div className="item-details">
        <h2>{item.title}</h2>
        <p>Qty: {item.quantity}</p>
        <p>Each: {formatMoney(item.price)}</p>
        <p>Subtotal: {formatMoney(item.price * item.quantity)}</p>
        <p>{item.description}</p>
      </div>
    </div>
  );
};

export default OrderItem;
