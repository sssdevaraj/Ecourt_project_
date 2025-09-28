const axios = require("axios");
require("dotenv").config();

const WHATSAPP_API_URL = "https://graph.facebook.com/v22.0"; 
const PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID;
const ACCESS_TOKEN = process.env.WHATSAPP_PERMANENT_TOKEN;

/**
 * Sends a WhatsApp OTP message using a template
 * 
 * @param {string} to - 10-digit Indian phone number (e.g., "9876543210")
 * @param {string} body - The OTP code or message
 * @returns {Object} - Success or error response
 */
const sendWhatsappOtp = async (to, body) => {
  try {
    const payload = {
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to: `91${to}`,
      type: "template",
      template: {
        name: "new_otp",
        language: {
          code: "en_US"
        },
        components: [
          {
            type: "body",
            parameters: [
              {
                type: "text",
                text: body // OTP
              }
            ]
          },
          {
            type: "button",
            sub_type: "url",
            index: "0",
            parameters: [
              {
                type: "text",
                text: body 
              }
            ]
          }
        ]
      }
    };

    const response = await axios.post(
      `${WHATSAPP_API_URL}/${PHONE_NUMBER_ID}/messages`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    return {
      success: true,
      messageId: response.data.messages[0].id,
    };
  } catch (error) {
    console.error(
      `❌ WhatsApp API Error: ${error.response?.data?.error?.message || error.message}`
    );
    throw new Error("OTP send error");
  }
};

module.exports = sendWhatsappOtp;
