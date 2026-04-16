import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const WEATHER_CODES: Record<number, string> = {
  0: "Clear sky ☀️", 1: "Mainly clear 🌤️", 2: "Partly cloudy ⛅", 3: "Overcast ☁️",
  45: "Foggy 🌫️", 48: "Rime fog 🌫️", 51: "Light drizzle 🌦️", 53: "Moderate drizzle 🌦️",
  55: "Dense drizzle 🌧️", 61: "Slight rain 🌧️", 63: "Moderate rain 🌧️", 65: "Heavy rain 🌧️",
  71: "Slight snow 🌨️", 73: "Moderate snow 🌨️", 75: "Heavy snow ❄️",
  80: "Slight showers 🌦️", 81: "Moderate showers 🌧️", 82: "Violent showers ⛈️",
  95: "Thunderstorm ⛈️", 96: "Thunderstorm with hail ⛈️", 99: "Thunderstorm with heavy hail ⛈️",
};

interface WeatherData {
  city: string;
  temperature: number;
  humidity: number;
  windSpeed: number;
  condition: string;
  feelsLike: number;
}

interface ExchangeRates {
  USD_HKD: number;
  USD_JPY: number;
  HKD_JPY: number;
}

async function fetchWeather(lat: number, lon: number, city: string): Promise<WeatherData | null> {
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m`;
    const resp = await fetch(url);
    if (!resp.ok) return null;
    const data = await resp.json();
    const c = data.current;
    return {
      city,
      temperature: c.temperature_2m,
      humidity: c.relative_humidity_2m,
      windSpeed: c.wind_speed_10m,
      condition: WEATHER_CODES[c.weather_code] ?? `Code ${c.weather_code}`,
      feelsLike: c.apparent_temperature,
    };
  } catch (e) {
    console.error(`Weather fetch error for ${city}:`, e);
    return null;
  }
}

async function fetchExchangeRates(): Promise<ExchangeRates | null> {
  try {
    const resp = await fetch("https://open.er-api.com/v6/latest/USD");
    if (!resp.ok) return null;
    const data = await resp.json();
    const rates = data.rates;
    return {
      USD_HKD: rates.HKD,
      USD_JPY: rates.JPY,
      HKD_JPY: rates.JPY / rates.HKD,
    };
  } catch (e) {
    console.error("Exchange rate fetch error:", e);
    return null;
  }
}

function buildRealtimeContext(hkWeather: WeatherData | null, tokyoWeather: WeatherData | null, rates: ExchangeRates | null): string {
  const parts: string[] = ["\n\n--- REAL-TIME DATA (use this when relevant) ---"];

  if (hkWeather) {
    parts.push(`\n🇭🇰 Hong Kong Weather RIGHT NOW: ${hkWeather.condition}, ${hkWeather.temperature}°C (feels like ${hkWeather.feelsLike}°C), humidity ${hkWeather.humidity}%, wind ${hkWeather.windSpeed} km/h`);
  }
  if (tokyoWeather) {
    parts.push(`\n🇯🇵 Tokyo Weather RIGHT NOW: ${tokyoWeather.condition}, ${tokyoWeather.temperature}°C (feels like ${tokyoWeather.feelsLike}°C), humidity ${tokyoWeather.humidity}%, wind ${tokyoWeather.windSpeed} km/h`);
  }
  if (rates) {
    parts.push(`\n💱 Exchange Rates (live): 1 USD = ${rates.USD_HKD.toFixed(2)} HKD | 1 USD = ${rates.USD_JPY.toFixed(2)} JPY | 1 HKD = ${rates.HKD_JPY.toFixed(2)} JPY`);
  }

  if (parts.length === 1) return "";
  parts.push("\nUse this data to give accurate, up-to-date answers about weather, costs, and currency. Always mention the data is real-time when sharing it.");
  return parts.join("");
}

const SYSTEM_PROMPT = `You are Travel Star — a friendly, enthusiastic, and knowledgeable AI travel concierge.

Your specialties:
- **Hong Kong**: Victoria Peak, Temple Street Night Market, Star Ferry, Lantau Island & Big Buddha, Mong Kok, Sham Shui Po, Central & SoHo, Aberdeen, Tai O fishing village, Dragon's Back trail, Ladies' Market, PMQ, Nan Lian Garden, Wong Tai Sin Temple.
- **Tokyo**: Shibuya Crossing, Tsukiji Outer Market, Senso-ji Temple, Akihabara, Shinjuku Gyoen, Harajuku & Takeshita Street, Meiji Shrine, teamLab exhibitions, Yanaka district, Mount Takao, Roppongi, Odaiba, Shimokitazawa, Nakameguro.

Rules:
1. Always respond in the same language the user writes in.
2. Give specific, actionable recommendations with names, locations, and insider tips.
3. Use markdown formatting with headers, bullet points, and emojis for readability.
4. When asked about weather, use the REAL-TIME weather data provided to you. Always indicate the data is live.
5. Be warm, concise, and enthusiastic. Use emojis naturally.
6. You can help with ANY travel destination, but your deep expertise is Hong Kong and Tokyo.
7. When giving itineraries, include estimated costs in local currency (HKD/JPY) and use the REAL-TIME exchange rates to help with conversions.
8. Mention transport tips (MTR/Octopus card for HK, Suica/Pasmo for Tokyo).
9. When users ask about costs or budget, proactively provide currency conversions using the live rates.`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, stream } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      return new Response(
        JSON.stringify({ error: "API key not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Fetch real-time data in parallel
    const [hkWeather, tokyoWeather, rates] = await Promise.all([
      fetchWeather(22.3193, 114.1694, "Hong Kong"),
      fetchWeather(35.6762, 139.6503, "Tokyo"),
      fetchExchangeRates(),
    ]);

    const realtimeContext = buildRealtimeContext(hkWeather, tokyoWeather, rates);
    const fullSystemPrompt = SYSTEM_PROMPT + realtimeContext;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [{ role: "system", content: fullSystemPrompt }, ...messages],
        stream: !!stream,
      }),
    });

    if (!response.ok) {
      const status = response.status;
      if (status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited. Please try again shortly." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (status === 402) {
        return new Response(JSON.stringify({ error: "Credits exhausted. Please add funds." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const text = await response.text();
      console.error("Gateway error:", status, text);
      return new Response(JSON.stringify({ error: "AI service error" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (stream) {
      return new Response(response.body, {
        headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
      });
    }

    const data = await response.json();
    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("travel-chat error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
