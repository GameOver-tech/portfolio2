import { supabase } from '../supabase/client.js'

const PROVIDER_ENDPOINTS = {
  groq: 'https://api.groq.com/openai/v1/chat/completions',
  gemini: 'https://generativelanguage.googleapis.com/v1beta/models',
  openrouter: 'https://openrouter.ai/api/v1/chat/completions',
}

const FETCH_TIMEOUT = 8000

async function fetchWithTimeout(url, options, timeout = FETCH_TIMEOUT) {
  const controller = new AbortController()
  const id = setTimeout(() => controller.abort(), timeout)
  try {
    const res = await fetch(url, { ...options, signal: controller.signal })
    return res
  } finally {
    clearTimeout(id)
  }
}

export async function getEnabledProviders() {
  const { data } = await supabase
    .from('ai_providers')
    .select('provider_name, api_key, model, status, priority, is_default')
    .eq('status', 'active')
    .order('priority', { ascending: true })

  return data || []
}

function buildGeminiPayload(messages, tools, model, maxTokens, temperature) {
  const contents = messages.map(m => {
    if (m.role === 'system') return { role: 'user', parts: [{ text: m.content }] }
    if (m.role === 'user') return { role: 'user', parts: [{ text: m.content }] }
    if (m.role === 'assistant') {
      const parts = []
      if (m.content) parts.push({ text: m.content })
      if (m.tool_calls) {
        m.tool_calls.forEach(tc => {
          let args = {}
          try { args = JSON.parse(tc.function.arguments) } catch {}
          parts.push({
            functionCall: { name: tc.function.name, args }
          })
        })
      }
      return { role: 'model', parts }
    }
    if (m.role === 'tool') {
      return {
        role: 'function',
        parts: [{ functionResponse: { name: 'get_tool_result', response: { response: m.content } } }]
      }
    }
    return null
  }).filter(Boolean)

  const toolDefs = tools?.length ? tools.map(t => ({
    functionDeclarations: [{
      name: t.function.name,
      description: t.function.description,
      parameters: t.function.parameters,
    }],
  })) : undefined

  return {
    contents,
    tools: toolDefs,
    generationConfig: {
      temperature: temperature ?? 0.4,
      maxOutputTokens: maxTokens ?? 600,
    },
  }
}

function parseGeminiResponse(data) {
  const candidate = data?.candidates?.[0]
  if (!candidate) return null

  const content = candidate.content
  if (!content) return null

  const parts = content.parts || []
  const textParts = parts.filter(p => p.text).map(p => p.text).join('')
  const functionCalls = parts.filter(p => p.functionCall).map(p => ({
    id: p.functionCall.name,
    type: 'function',
    function: {
      name: p.functionCall.name,
      arguments: JSON.stringify(p.functionCall.args || {}),
    },
  }))

  return {
    content: textParts || null,
    tool_calls: functionCalls.length > 0 ? functionCalls : null,
  }
}

function buildStandardPayload(messages, tools, model, maxTokens, temperature) {
  return {
    model,
    messages: messages.map(m => ({
      role: m.role === 'assistant' ? 'assistant' : m.role === 'tool' ? 'tool' : 'user',
      content: m.content || '',
      tool_call_id: m.tool_call_id,
    })),
    tools: tools?.length ? tools : undefined,
    temperature: temperature ?? 0.4,
    max_tokens: maxTokens ?? 600,
  }
}

export async function chatWithProvider(provider, messages, tools, model, maxTokens, temperature) {
  const endpoint = PROVIDER_ENDPOINTS[provider.provider_name]
  if (!endpoint) throw new Error(`Unknown provider: ${provider.provider_name}`)

  const actualModel = model || provider.model || 'llama-3.3-70b-versatile'

  if (provider.provider_name === 'gemini') {
    const url = `${endpoint}/${actualModel}:generateContent?key=${provider.api_key}`
    const payload = buildGeminiPayload(messages, tools, actualModel, maxTokens, temperature)
    const res = await fetchWithTimeout(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    if (!res.ok) {
      const errText = await res.text().catch(() => '')
      throw new Error(`Gemini API error (${res.status}): ${errText}`)
    }
    const data = await res.json()
    return parseGeminiResponse(data)
  }

  const headers = {
    'Content-Type': 'application/json',
  }

  if (provider.provider_name === 'openrouter') {
    headers['Authorization'] = `Bearer ${provider.api_key}`
    headers['HTTP-Referer'] = process.env.VITE_APP_URL || 'https://portfolio.vercel.app'
  } else {
    headers['Authorization'] = `Bearer ${provider.api_key}`
  }

  const payload = buildStandardPayload(messages, tools, actualModel, maxTokens, temperature)
  const res = await fetchWithTimeout(endpoint, {
    method: 'POST',
    headers,
    body: JSON.stringify(payload),
  })
  if (!res.ok) {
    const errText = await res.text().catch(() => '')
    throw new Error(`${provider.provider_name} API error (${res.status}): ${errText}`)
  }
  const data = await res.json()

  const choice = data.choices?.[0]
  if (!choice) return null

  return {
    content: choice.message?.content || null,
    tool_calls: choice.message?.tool_calls || null,
  }
}

export async function chatWithFallback(messages, tools, preferredModel, maxTokens, temperature) {
  const providers = await getEnabledProviders()
  if (!providers.length) return null

  const errors = []

  for (const provider of providers) {
    try {
      const result = await chatWithProvider(provider, messages, tools, preferredModel || provider.model, maxTokens, temperature)
      if (result) return { result, provider: provider.provider_name }
    } catch (err) {
      errors.push(`${provider.provider_name}: ${err.message}`)
      console.warn(`AI provider "${provider.provider_name}" failed, trying next...`, err.message)
    }
  }

  throw new Error(`All AI providers failed. Errors: ${errors.join('; ')}`)
}
