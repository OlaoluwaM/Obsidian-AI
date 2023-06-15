const URL_BASE = "https://api.openai.com/v1";

const openAIAPiURLs = [`${URL_BASE}/chat/completions`] as const;

export function foo(url: string) {}

export function bar() {
  const response = fetch(options.apiUrl ?? "https://api.openai.com/v1/chat/completions", {
    headers: {
      Authorization: `Bearer ${options.apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messages: options.messages,
      model: options.model,
      stream: true,
      temperature: options.temperature,
      top_p: options.topP,
      n: options.n,
      stop: options.stop,
      frequency_penalty: options.frequencyPenalty,
      presence_penalty: options.presencePenalty,
      logit_bias: options.logitBias,
      max_tokens: options.maxTokens,
      user: options.user,
    }),
    method: "POST",
  });
}
