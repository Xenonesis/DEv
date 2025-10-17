# Adding AI Challenges to Host Panel

## Quick Implementation Guide

To add AI Challenge creation to the `/host` panel, follow these steps:

### 1. Update the Host Panel State

Add these state variables to `src/app/host/page.tsx`:

```typescript
const [aiChallenges, setAIChallenges] = useState<AIChallenge[]>([]);
const [isCreateAIChallengeOpen, setIsCreateAIChallengeOpen] = useState(false);
const [activeTab, setActiveTab] = useState('hackathons');
```

### 2. Add AI Challenge Interface

```typescript
interface AIChallenge {
    id: string;
    title: string;
    description: string;
    category: string;
    prize?: string;
    maxParticipants?: number;
    startDate: string;
    endDate: string;
    status: 'UPCOMING' | 'ONGOING' | 'COMPLETED' | 'CANCELLED';
    difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';
    dataset?: string;
    evaluationMetric?: string;
    participantCount?: number;
    submissionCount?: number;
}
```

### 3. Load AI Challenges Data

Update the `loadData` function to fetch AI challenges:

```typescript
const [aiChallengesResponse] = await Promise.all([
    fetch('/api/host/ai-challenges')
]);

const aiChallengesData = await aiChallengesResponse.json();
if (aiChallengesData.success) {
    setAIChallenges(aiChallengesData.data);
}
```

### 4. Add Tabs to the UI

Replace the single hackathons table with tabs:

```tsx
<Tabs value={activeTab} onValueChange={setActiveTab}>
    <TabsList>
        <TabsTrigger value="hackathons">
            <Trophy className="w-4 h-4 mr-2" />
            Hackathons
        </TabsTrigger>
        <TabsTrigger value="ai-challenges">
            <Brain className="w-4 h-4 mr-2" />
            AI Challenges
        </TabsTrigger>
    </TabsList>
    
    <TabsContent value="hackathons">
        {/* Existing hackathons table */}
    </TabsContent>
    
    <TabsContent value="ai-challenges">
        {/* AI Challenges table - similar structure */}
    </TabsContent>
</Tabs>
```

### 5. Add Create AI Challenge Button

In the header, add conditional rendering:

```tsx
{activeTab === 'hackathons' ? (
    <Button onClick={() => setIsCreateDialogOpen(true)}>
        <Plus className="w-4 h-4 mr-2" />
        Create Hackathon
    </Button>
) : (
    <Button onClick={() => setIsCreateAIChallengeOpen(true)}>
        <Plus className="w-4 h-4 mr-2" />
        Create AI Challenge
    </Button>
)}
```

### 6. Create AI Challenge Form Dialog

Add a dialog similar to the hackathon form with these fields:
- Title
- Description  
- Category (dropdown: Computer Vision, NLP, RL, etc.)
- Prize
- Max Participants
- Start/End Date
- Difficulty
- Tags
- Dataset (optional)
- Evaluation Metric (optional)
- Rules (optional textarea)

### 7. Handle AI Challenge Submission

```typescript
const handleAIChallengeSubmit = async (formData) => {
    const response = await fetch('/api/host/ai-challenges', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
    });
    
    if (response.ok) {
        toast.success('AI Challenge created successfully');
        loadData();
    }
};
```

## Alternative: Simple Approach

If you want a quick implementation without modifying the existing host panel structure:

1. Add a "Create AI Challenge" button that redirects to a dedicated page `/host/ai-challenges/create`
2. Create that page with the full form
3. After creation, redirect back to `/host` or a `/host/ai-challenges` list page

This keeps the host panel clean and separates concerns.

## API Endpoints Already Available

✅ `GET /api/host/ai-challenges` - List host's challenges
✅ `POST /api/host/ai-challenges` - Create new challenge  
✅ `PUT /api/host/ai-challenges/[id]` - Update challenge (needs to be created)
✅ `DELETE /api/host/ai-challenges/[id]` - Delete challenge (needs to be created)

## Next Steps

1. Choose between integrated tabs or separate pages approach
2. Implement the UI components
3. Test the create/edit/delete functionality
4. Add participant and submission viewing
