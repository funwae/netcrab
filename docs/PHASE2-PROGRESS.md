# Phase 2 - Advanced Insights - Progress

## Completed Components

### 1. ML Clustering Service ✅

**Location:** `packages/ai-services/src/clustering.ts`

**Features:**
- ✅ KMeans clustering algorithm for session patterns
- ✅ Feature extraction from session metrics
- ✅ Cluster description generation
- ✅ Automatic cluster labeling:
  - "High-friction Short Sessions"
  - "Fast Success Sessions"
  - "Long Wandering Sessions"
  - "High Activity Sessions"

**Usage:**
```typescript
import { SessionClustering } from '@netcrab/ai-services';

const clustering = new SessionClustering();
const clusters = await clustering.clusterSessions(sessions, k=3);
const descriptions = clustering.generateClusterDescriptions(clusters);
```

### 2. LLM-Powered Crab Notes Generator ✅

**Location:** `packages/ai-services/src/llm-notes.ts`

**Features:**
- ✅ Support for OpenAI and Anthropic APIs
- ✅ Mock mode for development/testing
- ✅ Generates notes from:
  - Session clusters
  - Hotspot data
- ✅ Structured output:
  - Title, summary, category, severity
  - Confidence score
  - Recommendations

**Supported Providers:**
- OpenAI (GPT-4, GPT-3.5)
- Anthropic (Claude)
- Mock (for development)

**Configuration:**
```typescript
const generator = new LLMNotesGenerator({
  provider: 'openai',
  apiKey: process.env.OPENAI_API_KEY,
  model: 'gpt-4-turbo-preview'
});
```

### 3. Flow Mining Service ✅

**Location:** `packages/ai-services/src/flow-mining.ts`

**Features:**
- ✅ Pattern mining from screen sequences
- ✅ Flow archetype discovery
- ✅ Dropoff point detection
- ✅ Automatic flow labeling
- ✅ Frequency-based ranking

**Output:**
- Flow archetypes with paths
- Completion rates
- Average friction/efficiency
- Dropoff points with rates

### 4. App API Integration ✅

**New Endpoints:**
- ✅ `GET /v1/crab-notes` - Get all Crab Notes for a time period
- ✅ `GET /v1/crab-notes/:screenId` - Get note for specific screen
- ✅ Enhanced `GET /v1/flows/top` - Now uses flow mining
- ✅ Enhanced `GET /v1/insights/overview` - Includes LLM-generated note of the day

**Features:**
- ✅ LLM integration with configurable provider
- ✅ Automatic note generation from hotspots
- ✅ Enhanced flow discovery using pattern mining

## API Endpoints

### Crab Notes

**Get all notes:**
```
GET /v1/crab-notes?orgId=X&productId=Y&from=DATE&to=DATE&limit=N
```

**Response:**
```json
{
  "notes": [
    {
      "id": "note_1234567890",
      "title": "High friction detected on billing_page",
      "summary": "Users are experiencing 81% friction on /settings/billing...",
      "category": "friction",
      "severity": "high",
      "confidence": 0.75,
      "createdAt": "2025-01-23T12:00:00Z",
      "relatedScreens": ["billing_page"],
      "recommendations": [
        "Review UI elements for clarity",
        "Check for loading states and error handling",
        "Consider simplifying the flow"
      ]
    }
  ]
}
```

**Get note for specific screen:**
```
GET /v1/crab-notes/:screenId?orgId=X&productId=Y&friction=0.81&sessions=32412&route=/settings/billing
```

## Configuration

### LLM Provider Setup

**Mock (default - no API key needed):**
```bash
export LLM_PROVIDER=mock
```

**OpenAI:**
```bash
export LLM_PROVIDER=openai
export LLM_API_KEY=sk-...
export LLM_MODEL=gpt-4-turbo-preview
```

**Anthropic:**
```bash
export LLM_PROVIDER=anthropic
export LLM_API_KEY=sk-ant-...
export LLM_MODEL=claude-3-opus-20240229
```

## Architecture

```
ClickHouse → Insights Service → AI Services
                                    ↓
                          ┌─────────┴─────────┐
                          ↓                   ↓
                    Clustering          LLM Generator
                          ↓                   ↓
                    Flow Mining         Crab Notes
```

## Next Steps

1. **User Segmentation** - Add segmentation by user properties, device, etc.
2. **Version Comparison** - Compare metrics across product versions
3. **Dashboard UI** - Build Next.js dashboard to visualize insights
4. **Real-time Updates** - WebSocket/SSE for live dashboard updates

## Status

✅ **Phase 2 Core Complete** - ML clustering, LLM notes, and flow mining are operational

The AI services are integrated and ready to generate insights. The system can now:
- Cluster sessions into behavioral patterns
- Generate plain-language insights via LLM
- Discover common user flow patterns
- Provide actionable recommendations

