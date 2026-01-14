export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // --- ROUTE 1 : ENVOI DU MAIL DE VALIDATION ---
    if (url.pathname === "/send-validation") {
      const { email } = await request.json();

      // Génération du token
      const token = crypto.randomUUID();

      // Stockage du token dans KV
      await env.EMAIL_TOKENS.put(token, email, { expirationTtl: 3600 });

      // Lien de validation
      const verifyLink = `https://ton-domaine.com/verify?token=${token}`;

      // Envoi de l'email via SMTP
      await sendEmail(env, email, verifyLink);

      return new Response(JSON.stringify({ ok: true }), {
        headers: { "Content-Type": "application/json" }
      });
    }

    // --- ROUTE 2 : VALIDATION DU TOKEN ---
    if (url.pathname === "/verify") {
      const token = url.searchParams.get("token");

      const email = await env.EMAIL_TOKENS.get(token);

      if (!email) {
        return new Response("Lien invalide ou expiré");
      }

      // Marquer l'email comme vérifié
      await env.VERIFIED_EMAILS.put(email, "true");

      // Supprimer le token
      await env.EMAIL_TOKENS.delete(token);

      return new Response("votre email a été bien vérifier , vous pouvez fermez cette page .");
    }

    return new Response("Not found", { status: 404 });
  }
};

// Fonction d'envoi d'email SMTP
async function sendEmail(env, to, link) {
  const message = `
    Bonjour,
    Clique ici pour valider votre email :
    ${link}
  `;

  await env.SMTP.send({
    from: env.SMTP_FROM,
    to,
    subject: "Valide ton email",
    text: message
  });
}
