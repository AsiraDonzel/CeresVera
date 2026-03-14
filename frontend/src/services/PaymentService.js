/**
 * Interswitch Web Checkout Utility for CeresVera
 */

const INTERSWITCH_SCRIPT_URL = "https://newwebpay.qa.interswitchng.com/inline-checkout.js";

export const loadInterswitchScript = () => {
    return new Promise((resolve, reject) => {
        if (window.webpayCheckout) {
            resolve(true);
            return;
        }
        const script = document.createElement("script");
        script.src = INTERSWITCH_SCRIPT_URL;
        script.async = true;
        script.onload = () => resolve(true);
        script.onerror = () => reject(new Error("Failed to load Interswitch checkout script."));
        document.body.appendChild(script);
    });
};

/**
 * Triggers the Interswitch Inline Checkout
 * @param {Object} params - Payment parameters from backend (amount, txn_ref, merchant_code, pay_item_id)
 * @param {Function} onComplete - Callback for transaction completion
 */
export const triggerPayment = async (params, onComplete) => {
    try {
        await loadInterswitchScript();

        if (!window.webpayCheckout) {
            throw new Error("Interswitch checkout not initialized.");
        }

        const checkoutParams = {
            merchantCode: params.merchant_code,
            payItemId: params.pay_item_id,
            customerEmail: localStorage.getItem('user_email') || "customer@ceresvera.com",
            amount: params.amount, // Already in minor denomination (kobo) from backend
            txnRef: params.txn_ref,
            currency: 566, // NGN
            onComplete: (response) => {
                console.log("Interswitch Response:", response);
                if (onComplete) onComplete(response);
            },
            mode: 'TEST'
        };

        window.webpayCheckout(checkoutParams);
    } catch (error) {
        console.error("Payment Trigger Error:", error);
        alert("Unable to initialize payment gateway. Please try again.");
    }
};
