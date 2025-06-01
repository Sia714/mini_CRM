// utils/vendorApi.ts

export async function vendorApi(payload) {
  const chance = Math.random();
  const status = chance <= 0.9 ? "SENT" : "FAILED";
  const deliveryTime = new Date().toISOString();

  // Simulating hitting your Delivery Receipt API
  await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/campaign/receipt`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      campaign_id: payload.campaign_id,
      customer_id: payload.customer_id,
      status,
      delivery_time: deliveryTime,
    }),
  });

  return { ...payload, status, deliveryTime };
}
