/**
 * Interswitch Web Checkout Utility for CeresVera
 * Uses the Interswitch Inline Checkout (TEST mode)
 * Matches the official Interswitch sample HTML exactly.
 * 
 * Test Cards (from https://docs.interswitchgroup.com/docs/test-cards):
 * - Verve: 5061050254756707864 (Exp: 06/26, CVV: 111, PIN: 1111)            → Success
 * - Verve: 5060990580000217499 (Exp: 03/50, CVV: 111, PIN: 1111)            → Success
 * - VISA:  4000000000002503    (Exp: 03/50, CVV: 11, PIN: 1111)             → Success
 * - Mastercard: 5123450000000008 (Exp: 01/39, CVV: 100, PIN: 1111, OTP: 123456) → Success
 * 
 * Note: Amount is in MINOR denomination (kobo). 3000 = ₦30.00
 */

const INTERSWITCH_SCRIPT_URL = "https://newwebpay.qa.interswitchng.com/inline-checkout.js";

export const loadInterswitchScript = () => {
    return new Promise((resolve, reject) => {
        if (window.webpayCheckout) {
            resolve(true);
            return;
        }

        const existingScript = document.querySelector(`script[src="${INTERSWITCH_SCRIPT_URL}"]`);
        if (existingScript) {
            existingScript.addEventListener('load', () => resolve(true));
            existingScript.addEventListener('error', () => reject(new Error("Failed to load Interswitch checkout script.")));
            return;
        }

        const script = document.createElement("script");
        script.src = INTERSWITCH_SCRIPT_URL;
        script.async = true;
        script.onload = () => {
            console.log("[ISW] Interswitch inline checkout script loaded successfully");
            resolve(true);
        };
        script.onerror = () => reject(new Error("Failed to load Interswitch checkout script. Check your internet connection."));
        document.body.appendChild(script);
    });
};

/**
 * Triggers the Interswitch Inline Checkout.
 * Parameters match the official sample HTML EXACTLY:
 *   merchant_code, pay_item_id, txn_ref, amount, currency, site_redirect_url, onComplete, mode
 */
export const triggerPayment = async (params, onComplete) => {
    try {
        console.log("[ISW] Loading Interswitch script...");
        await loadInterswitchScript();

        if (!window.webpayCheckout) {
            throw new Error("Interswitch checkout object not found after script load.");
        }

        // Match the Interswitch sample HTML EXACTLY
        // var paymentRequest = {
        //     merchant_code: "MX6072",
        //     pay_item_id: "9405967",
        //     txn_ref: "MX-TRN-" + Math.random() * 2.5,
        //     amount: "3000",
        //     currency: 566,            <-- NUMBER, not string
        //     site_redirect_url: location.href,
        //     onComplete: paymentCallback,
        //     mode: "TEST"
        // };
        var paymentRequest = {
            merchant_code: params.merchant_code,
            pay_item_id: params.pay_item_id,
            txn_ref: params.txn_ref,
            amount: params.amount,
            currency: 566,
            site_redirect_url: window.location.href,
            onComplete: function(response) {
                console.log("[ISW] Payment Response:", response);
                if (onComplete) onComplete(response);
            },
            mode: "TEST"
        };

        console.log("[ISW] Checkout params:", paymentRequest);
        window.webpayCheckout(paymentRequest);
    } catch (error) {
        console.error("[ISW] Payment Trigger Error:", error);
        alert(`Unable to initialize payment gateway: ${error.message}. Please check your internet connection or try again later.`);
    }
};
