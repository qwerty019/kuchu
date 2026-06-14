"use server";

export async function getEmbedding(text: string) {
  try {
    const url =
      "https://llm.api.cloud.yandex.net/foundationModels/v1/textEmbedding";
    const modelUri = `emb://${process.env.YANDEX_CATALOG_ID}/text-search-query/latest`;

    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Api-Key ${process.env.YANDEX_GPT_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        modelUri: modelUri,
        text: text,
        // dim: "256",
      }),
    });

    if (!res.ok) {
      const data = await res.json();
      console.log(data);
      throw new Error("Ошибка при получении embedding.");
    }

    const data: Embedding = await res.json();

    return data;
  } catch (err) {
    console.log(err);
    if (err instanceof Error) {
      throw new Error(err.message);
    }

    throw new Error("Ошибка при получении embedding.");
  }
}

type Embedding = {
  embedding: string[];
  numTokens: string;
  modelVersion: string;
};

export async function textGeneration({
  messages,
  instructions,
  context,
}: {
  messages: { role: string; text: string }[];
  instructions: string;
  context: string[];
}) {
  try {
    const url =
      "https://llm.api.cloud.yandex.net/foundationModels/v1/completion";
    const modelUri = `gpt://${process.env.YANDEX_CATALOG_ID}/yandexgpt-lite`;

    if (context.length > 0) {
      let contextString = "\n\nКонтекст базы знаний:\n";

      context.forEach((doc, index) => {
        contextString += `${index + 1}. ${doc}\n`;
      });

      instructions += contextString;
    }

    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Api-Key ${process.env.YANDEX_GPT_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        modelUri,
        completionOptions: {
          stream: false,
          temperature: 0.3,
          maxTokens: "32000",
          reasoningOptions: {
            mode: "DISABLED",
          },
        },
        messages: [
          { role: "system", text: instructions },
          {
            role: "user",
            text: messages
              .map(
                (m) =>
                  `${m.role === "user" ? "Пользователь" : "Ассистент"}: ${m.text}`
              )
              .join("\n"),
          },
        ],
      }),
    });

    if (!res.ok) {
      const data = await res.json();

      if (data.message || data.error?.message) {
        throw new Error(data.message || data.error?.message);
      }

      throw new Error("Ошибка при генерации текста.");
    }

    const data: TextGeneration = await res.json();

    if (!data.result.alternatives[0].message.text) {
      throw new Error("Ошибка при генерации текста.");
    }

    return data;
  } catch (err) {
    console.log(err);
    if (err instanceof Error) {
      throw new Error(err.message);
    }

    throw new Error("Ошибка при генерации текста.");
  }
}

type TextGeneration = {
  result: {
    alternatives: [
      {
        message: {
          role: "assistant";
          text: string;
        };
        status: "ALTERNATIVE_STATUS_FINAL";
      },
    ];
    usage: {
      inputTextTokens: string;
      completionTokens: string;
      totalTokens: string;
      completionTokensDetails: {
        reasoningTokens: string;
      };
    };
    modelVersion: string;
  };
};
