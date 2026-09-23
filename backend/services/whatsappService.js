/**
 * WhatsApp Notification Service for QAMRAH
 * Sends order notifications to the admin WhatsApp (+91 62358 20223)
 * Supports WhatsApp Cloud API with automatic click-to-chat fallback URL.
 */

export const formatOrderMessage = (order) => {
  const formattedDate = new Date(order.createdAt || Date.now()).toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    dateStyle: 'medium',
    timeStyle: 'short'
  });

  const productLines = (order.items || [])
    .map(
      (item) =>
        `- ${item.name} (${item.weight || 'Standard'}) x ${item.quantity}\n  Pack: ${item.packDesign || 'Classic QAMRAH Pack'}${
          item.packPriceAdjustment ? ` (+₹${item.packPriceAdjustment})` : ''
        }`
    )
    .join('\n');

  const message = `QAMRAH NEW ORDER

Order ID: ${order.orderId}
Customer Name: ${order.customer?.name || 'Customer'}
Phone: ${order.customer?.phone || 'N/A'}
Address: ${order.customer?.address || ''}, ${order.customer?.city || ''} - ${order.customer?.pincode || ''}

Products:
${productLines}

Subtotal: ₹${order.subtotal}
Shipping: ₹${order.shipping}
Total: ₹${order.total}

Order Date: ${formattedDate}
Payment Method: ${order.paymentMethod || 'Cash on Delivery'}`;

  return message;
};

export const sendOrderWhatsAppNotification = async (order) => {
  const targetNumber = (process.env.ADMIN_WHATSAPP_NUMBER || '+916235820223').replace(/[^0-9]/g, '');
  const messageText = formatOrderMessage(order);
  const fallbackUrl = `https://wa.me/${targetNumber}?text=${encodeURIComponent(messageText)}`;

  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;

  // If WhatsApp Cloud API credentials are configured, send via Graph API
  if (phoneNumberId && accessToken) {
    try {
      const response = await fetch(`https://graph.facebook.com/v19.0/${phoneNumberId}/messages`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          recipient_type: 'individual',
          to: targetNumber,
          type: 'text',
          text: {
            preview_url: false,
            body: messageText
          }
        })
      });

      const result = await response.json();
      if (response.ok) {
        console.log('[WhatsApp API] Order notification sent successfully:', result);
        return {
          success: true,
          method: 'cloud_api',
          fallbackUrl,
          messageText
        };
      } else {
        console.warn('[WhatsApp API] Cloud API error response:', result);
      }
    } catch (apiError) {
      console.warn('[WhatsApp API] Cloud API request failed:', apiError.message);
    }
  }

  // Graceful fallback: return the click-to-chat URL so admin/customer can also trigger via WhatsApp
  console.log('[WhatsApp API] WhatsApp Cloud API not configured or unavailable. Generated click-to-chat URL.');
  return {
    success: true,
    method: 'click_to_chat_fallback',
    fallbackUrl,
    messageText
  };
};
