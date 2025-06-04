import API from "./_baseURL.js";

// Start payment using PagBank
export const startPayment = async ({ referenceId, amount, buyerName, buyerEmail, buyerPhone }) => {
    const response = await API.post("/pagbank/checkout", {
        referenceId,
        amount,
        buyerName,
        buyerEmail,
        buyerPhone,
    });

    return response.data;
};
