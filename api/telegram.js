const TELEGRAM_API_URL = 'https://api.telegram.org/bot';

function sanitize(value) {
  return String(value ?? '').trim();
}

function escapeHtml(value) {
  return sanitize(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
}

function buildMessage(payload) {
  const name = escapeHtml(payload.name);
  const email = escapeHtml(payload.email);
  const phone = escapeHtml(payload.phone || 'не указан');
  const deployment = payload.deployment === 'cloud' ? 'Облако' : 'On-premise';

  return [
    '<b>Новая заявка NeuraMask</b>',
    '',
    `<b>Имя и компания:</b> ${name}`,
    `<b>Email:</b> ${email}`,
    `<b>Телефон:</b> ${phone}`,
    `<b>Формат:</b> ${deployment}`,
  ].join('\n');
}

export default async function handler(request, response) {
  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST');
    return response.status(405).json({ error: 'Method not allowed' });
  }

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    return response.status(500).json({ error: 'Telegram is not configured' });
  }

  const payload = request.body ?? {};
  const name = sanitize(payload.name);
  const email = sanitize(payload.email);

  if (!name || !email) {
    return response.status(400).json({ error: 'Name and email are required' });
  }

  const telegramResponse = await fetch(`${TELEGRAM_API_URL}${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text: buildMessage(payload),
      parse_mode: 'HTML',
      disable_web_page_preview: true,
    }),
  });

  if (!telegramResponse.ok) {
    return response.status(502).json({ error: 'Telegram request failed' });
  }

  return response.status(200).json({ ok: true });
}
