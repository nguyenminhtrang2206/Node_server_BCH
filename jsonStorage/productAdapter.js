"use strict";

function adapt(item) {
  return {
    id: +item.id,
    name: item.name,
    model: item.model,
    type: item.type,
    amount: item.amount,
  };
}

module.exports = { adapt };
