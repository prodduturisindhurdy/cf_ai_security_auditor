export default {
  async fetch(request, env) {
    if (request.method === "POST") {
      try {
        const { codeSnippet } = await request.json();
        // Calling Llama 3.3 model via Workers AI
        const response = await env.AI.run('@cf/meta/llama-3.3-70b-instruct', {
          messages: [
            { role: "system", content: "You are a Cloudflare Security Engineer. Identify vulnerabilities in the provided backend code." },
            { role: "user", content: `Audit this code: ${codeSnippet}` }
          ]
        });
        return new Response(JSON.stringify(response), {
          headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
        });
      } catch (e) {
        return new Response(JSON.stringify({ error: e.message }), { status: 500 });
      }
    }
    return new Response("Backend AI Auditor is live. Send a POST request with a 'codeSnippet'.");
  }
};
