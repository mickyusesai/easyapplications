import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

const EVALUATION_SYSTEM_PROMPT = `You are an expert evaluator of Erasmus+ project applications.
You evaluate applications based on the criteria used by National Agencies.

Analyze the provided application text and produce a structured evaluation report with:

1. **Executive Summary** - Brief overview of the application and overall impression
2. **Relevance of the Project** (Score: X/25)
   - Alignment with Erasmus+ programme objectives
   - Clarity of objectives and target groups
3. **Quality of Project Design and Implementation** (Score: X/30)
   - Coherence of project activities and methodology
   - Quality of work plan and risk management
4. **Quality of the Project Team and Cooperation Arrangements** (Score: X/20)
   - Competence and complementarity of partners
   - Distribution of tasks and roles
5. **Impact and Dissemination** (Score: X/25)
   - Expected impact and sustainability
   - Dissemination and exploitation plan
6. **Overall Score** (X/100)
7. **Key Strengths** - Bullet points
8. **Areas for Improvement** - Bullet points with specific, actionable suggestions
9. **Recommendations** - Concrete next steps to strengthen the application

Be thorough, constructive, and specific. Reference actual content from the application.
Format your response in clean Markdown.

NOTE: The exact evaluation criteria and scoring will be refined in future updates.`;

export interface EvaluationResult {
  content: string;
}

export async function evaluateApplication(
  applicationText: string
): Promise<EvaluationResult> {
  const message = await client.messages.create({
    model: "claude-opus-4-6",
    max_tokens: 16000,
    thinking: {
      type: "enabled",
      budget_tokens: 10000,
    },
    system: EVALUATION_SYSTEM_PROMPT,
    messages: [
      {
        role: "user",
        content: `Please evaluate the following Erasmus+ project application:\n\n${applicationText}`,
      },
    ],
  });

  const textBlocks = message.content.filter(
    (block): block is Anthropic.TextBlock => block.type === "text"
  );
  const content = textBlocks.map((block) => block.text).join("\n");

  return { content };
}
