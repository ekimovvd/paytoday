const subscriptionData = {
  id: "182227",
  status: "not-active",
  amountRub: 2345,
  amountUsd: 23,
  frequency: "Еженедельно",
  totalRub: 2345,
  totalUsd: 23,
  paymentsCount: "1",
  nextPayment: new Date(2025, 1, 2),
};

const invoiceData = [
  {
    id: "123456",
    client: {
      name: "ANTON",
      phone: "+7 923 23-23-23",
      email: "ANTON@MAIL.COM",
    },
    createdDate: new Date(2024, 11, 29, 15, 45),
    paymentDate: new Date(2024, 11, 29),
    status: "paid",
    amountUsd: 1000.234,
    vatUsd: 1000,
    amountRub: 10000,
  },
  {
    id: "123457",
    client: {
      name: "SERGEY",
      phone: "+7 911 11-11-11",
      email: "SERGEY@MAIL.COM",
    },
    createdDate: new Date(2024, 11, 28, 14, 30),
    paymentDate: new Date(2024, 11, 28),
    status: "pending",
    amountUsd: 2500.567,
    vatUsd: 2000,
    amountRub: 15000,
  },
];

export { subscriptionData, invoiceData };
