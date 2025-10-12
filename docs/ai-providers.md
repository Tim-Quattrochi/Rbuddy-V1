# AI Provider Comparison Guide

## Supported Providers

The AI Chat feature supports multiple AI providers, allowing you to choose based on your needs, budget, and preferences.

## Quick Comparison

| Feature | OpenAI (GPT) | Google Gemini | Mistral AI | Perplexity | Anthropic Claude |
|---------|-------------|---------------|------------|------------|------------------|
| **Default Model** | gpt-3.5-turbo | gemini-pro | mistral-small | llama-3.1-sonar | claude-3-sonnet |
| **Cost (per 1M tokens)** | $0.50-$1.50 | $0.00-$0.13 | $0.20-$2.00 | $0.20-$5.00 | $3.00-$15.00 |
| **Response Speed** | Fast | Very Fast | Fast | Very Fast | Medium |
| **Context Window** | 4K-128K | 32K-1M | 32K | 128K | 200K |
| **Setup Difficulty** | Easy | Easy | Easy | Easy | Medium |
| **Free Tier** | $18 credit | Yes (limited) | Free trial | $5 credit | No |
| **Best For** | General use | Budget | European servers | Real-time info | Long context |

## Provider Details

### OpenAI (GPT-3.5 / GPT-4)

**Pros:**
- Industry standard with excellent performance
- Wide variety of models (GPT-3.5, GPT-4, GPT-4-turbo)
- Great documentation and community support
- Consistent, high-quality responses

**Cons:**
- More expensive than Gemini
- Rate limits on free tier
- Requires API key from OpenAI

**Setup:**
```bash
AI_PROVIDER=openai
OPENAI_API_KEY=sk-your-key-here
OPENAI_MODEL=gpt-3.5-turbo  # or gpt-4, gpt-4-turbo
```

**Get API Key:** https://platform.openai.com/api-keys

**Pricing:**
- GPT-3.5-turbo: $0.50/$1.50 per 1M tokens (input/output)
- GPT-4: $30/$60 per 1M tokens
- GPT-4-turbo: $10/$30 per 1M tokens

**Recommended Models:**
- `gpt-3.5-turbo` - Best balance of cost and performance
- `gpt-4-turbo` - Higher quality responses
- `gpt-4` - Best quality (expensive)

---

### Google Gemini

**Pros:**
- Very cost-effective (generous free tier)
- Fast response times
- Large context window (up to 1M tokens)
- Good multilingual support

**Cons:**
- Newer, less established than OpenAI
- Fewer model options
- May have occasional availability issues

**Setup:**
```bash
AI_PROVIDER=gemini
GEMINI_API_KEY=your-gemini-key
GEMINI_MODEL=gemini-pro  # or gemini-pro-vision
```

**Get API Key:** https://makersuite.google.com/app/apikey

**Pricing:**
- Gemini Pro: Free up to 60 requests/minute
- Gemini Pro (paid): $0.00125/$0.00375 per 1K characters

**Recommended Models:**
- `gemini-pro` - Best for text conversations
- `gemini-pro-vision` - Supports image input (future feature)

---

### Mistral AI

**Pros:**
- European AI provider with strong privacy focus
- Cost-effective pricing
- Good performance for most tasks
- Multiple model sizes available
- Fast response times

**Cons:**
- Less well-known than OpenAI/Google
- Smaller model selection
- European data centers (may have higher latency for non-EU users)

**Setup:**
```bash
AI_PROVIDER=mistral
MISTRAL_API_KEY=your-mistral-key
MISTRAL_MODEL=mistral-small-latest  # or mistral-medium, mistral-large
```

**Get API Key:** https://console.mistral.ai/

**Pricing:**
- Mistral Small: $0.20/$0.60 per 1M tokens (input/output)
- Mistral Medium: $2.70/$8.10 per 1M tokens
- Mistral Large: $2.00/$6.00 per 1M tokens

**Recommended Models:**
- `mistral-small-latest` - Best value, good for most tasks
- `mistral-medium-latest` - Balanced performance
- `mistral-large-latest` - Highest quality

---

### Perplexity AI

**Pros:**
- Real-time web search capabilities
- Very fast response times
- Good for current information
- Competitive pricing
- Multiple Llama models available

**Cons:**
- Newer provider, less established
- May include web citations in responses
- Smaller context window than some competitors

**Setup:**
```bash
AI_PROVIDER=perplexity
PERPLEXITY_API_KEY=your-perplexity-key
PERPLEXITY_MODEL=llama-3.1-sonar-small-128k-chat
```

**Get API Key:** https://www.perplexity.ai/settings/api

**Pricing:**
- Sonar Small (8B): $0.20/$0.20 per 1M tokens
- Sonar Large (70B): $1.00/$1.00 per 1M tokens
- Llama 3.1 models: $0.20-$5.00 per 1M tokens

**Recommended Models:**
- `llama-3.1-sonar-small-128k-chat` - Fast and economical
- `llama-3.1-sonar-large-128k-chat` - Better quality
- `llama-3.1-sonar-huge-128k-online` - Best with real-time search

---

### Anthropic Claude

**Pros:**
- Very large context window (200K tokens)
- Excellent at following instructions
- Strong focus on safety and helpfulness
- Great for complex conversations

**Cons:**
- Most expensive option
- Requires additional SDK installation
- No free tier
- Implementation not yet complete (coming soon)

**Setup:**
```bash
AI_PROVIDER=anthropic
ANTHROPIC_API_KEY=your-anthropic-key
ANTHROPIC_MODEL=claude-3-sonnet-20240229
```

**Additional Installation Required:**
```bash
npm install @anthropic-ai/sdk
```

**Get API Key:** https://console.anthropic.com/

**Pricing:**
- Claude 3 Haiku: $0.25/$1.25 per 1M tokens
- Claude 3 Sonnet: $3/$15 per 1M tokens
- Claude 3 Opus: $15/$75 per 1M tokens

**Recommended Models:**
- `claude-3-haiku-20240307` - Fast and economical
- `claude-3-sonnet-20240229` - Balanced (recommended)
- `claude-3-opus-20240229` - Highest quality

**Note:** Anthropic provider requires implementing the provider method in `aiChatService.ts`

---

## Cost Comparison

Based on 10,000 chat messages with ~150 tokens each:

| Provider | Model | Estimated Cost |
|----------|-------|----------------|
| OpenAI | gpt-3.5-turbo | $2.25 |
| OpenAI | gpt-4-turbo | $45.00 |
| Google | gemini-pro | $0.00 (free tier) |
| Google | gemini-pro (paid) | $5.63 |
| Mistral | mistral-small | $12.00 |
| Mistral | mistral-large | $30.00 |
| Perplexity | sonar-small | $3.00 |
| Perplexity | sonar-large | $15.00 |
| Anthropic | claude-3-haiku | $18.75 |
| Anthropic | claude-3-sonnet | $45.00 |

## Recommendations

### For Development/Testing
**Use Gemini Pro (Free Tier)**
- No cost during development
- Fast response times
- Easy to set up

### For Production (Budget)
**Use Perplexity Sonar Small or Mistral Small**
- Very low cost ($3-$12 per 10K messages)
- Good performance for most use cases
- Fast response times
- Easy to set up

### For Production (Balanced)
**Use OpenAI GPT-3.5-turbo or Gemini Pro (Paid)**
- Best balance of cost and quality
- Industry-proven reliability
- Wide adoption and good support
**Use OpenAI GPT-3.5-turbo**
- Best balance of cost and quality
- Industry-proven reliability
- Wide adoption

### For Enterprise/Complex Use Cases
**Use OpenAI GPT-4-turbo or Anthropic Claude**
- Best quality responses
- Large context windows
- Worth the extra cost for critical applications

## Switching Providers

To switch providers, simply update your `.env` file:

```bash
# Current provider (e.g., OpenAI)
AI_PROVIDER=openai
OPENAI_API_KEY=sk-xxx

# Switch to Gemini
AI_PROVIDER=gemini
GEMINI_API_KEY=xxx
```

Restart your server, and the new provider will be used automatically. No code changes required!

## Performance Tips

### OpenAI
- Use `gpt-3.5-turbo` for most cases
- Enable caching for repeated prompts
- Set `max_tokens` to control costs

### Gemini
- Use streaming for real-time responses (future feature)
- Take advantage of large context window
- Monitor rate limits on free tier

### Mistral
- Use smaller models for faster responses
- Enable caching for repeated queries
- Good for European users (lower latency)

### Perplexity
- Leverage real-time web search for current information
- Use sonar models for general chat
- Monitor API usage to stay within limits

### Anthropic
- Leverage the 200K context window for complex conversations
- Use Haiku for speed, Sonnet for balance, Opus for quality
- Implement prompt caching to reduce costs

## Getting API Keys

### OpenAI
1. Go to https://platform.openai.com/signup
2. Create an account
3. Navigate to API Keys section
4. Create new secret key
5. Add to `.env` file

### Google Gemini
1. Go to https://makersuite.google.com/app/apikey
2. Sign in with Google account
3. Click "Create API Key"
4. Add to `.env` file

### Mistral AI
1. Go to https://console.mistral.ai/
2. Create an account
3. Navigate to API Keys
4. Generate new key
5. Add to `.env` file

### Perplexity AI
1. Go to https://www.perplexity.ai/settings/api
2. Sign up for an account
3. Generate API key
4. Add to `.env` file

### Anthropic
1. Go to https://console.anthropic.com/
2. Create an account
3. Navigate to API Keys
4. Generate new key
5. Add to `.env` file

## Troubleshooting

### Provider Not Working
1. Check API key is correct
2. Verify `AI_PROVIDER` environment variable
3. Ensure API key has sufficient credits
4. Check rate limits haven't been exceeded

### Switching Providers
1. Update `.env` file with new provider and key
2. Restart the server
3. Test with a simple message
4. Monitor logs for any errors

## Future Providers

We plan to add support for:
- **Azure OpenAI** - Enterprise-grade OpenAI models with enhanced security
- **Cohere** - Specialized in RAG and search capabilities
- **Together AI** - Access to multiple open-source models
- **Local Models** - Run models on your own infrastructure (Ollama, LM Studio)
- **Hugging Face** - Access to thousands of open-source models

To request a provider, open an issue on GitHub!
