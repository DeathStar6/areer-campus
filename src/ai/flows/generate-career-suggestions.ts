
'use server';

/**
 * @fileOverview This file defines Genkit flows for generating career suggestions based on a student's study level and specialization.
 * - generateFutureStudies - Generates suggestions for future studies.
 * - generatePlacementsAndJobs - Generates suggestions for placements and jobs.
 * - generateCollegeSuggestions - Generates suggestions for colleges.
 * - CareerSuggestionInput - The input type for the flows.
 */

import {ai, isApiKeyConfigured} from '@/ai/genkit';
import {z} from 'genkit';

const CareerSuggestionInputSchema = z.object({
  studyLevel: z.string().describe("The student's study level (e.g., B.Tech, M.Tech, MBA, Diploma)."),
  course: z.string().describe("The student's course or field of study (e.g., Computer Science & Engineering, Mechanical Engineering)."),
  specialization: z.string().optional().describe("The student's specialization within their course (e.g., Artificial Intelligence & Machine Learning, Robotics). Can be 'N/A' if not applicable."),
});
export type CareerSuggestionInput = z.infer<typeof CareerSuggestionInputSchema>;

const FutureStudiesOutputSchema = z.object({
  futureStudies: z.string().describe('AI-powered suggestions for future studies, 2-3 sentences.'),
});

const PlacementsAndJobsOutputSchema = z.object({
    placementsAndJobs: z.string().describe('AI-powered suggestions for placements and jobs, 2-3 sentences.'),
});

const CollegeSuggestionsOutputSchema = z.object({
    collegeSuggestions: z.string().describe('A list of 4-5 popular colleges for the suggested future studies, including a brief detail about each. Format as a comma-separated list.'),
});

// Fallback responses when API is not available
const getFallbackResponse = (type: 'futureStudies' | 'placementsAndJobs' | 'collegeSuggestions', input: CareerSuggestionInput) => {
  const { studyLevel, course, specialization } = input;
  const specText = specialization && specialization !== 'N/A' ? ` with a specialization in ${specialization}` : '';
  
  switch (type) {
    case 'futureStudies':
      return `Based on your ${studyLevel} in ${course}${specText}, consider pursuing advanced studies in related fields. You could explore specialized master's programs, industry certifications, or research opportunities that align with your academic background and career goals.`;
    
    case 'placementsAndJobs':
      return `With your ${studyLevel} in ${course}${specText}, you're well-positioned for roles in technology, engineering, and related industries. Consider positions in software development, system design, project management, or research and development.`;
    
    case 'collegeSuggestions':
      return `Top institutions for your field include MIT (renowned for engineering excellence), Stanford University (leading in technology innovation), Carnegie Mellon University (expertise in computer science), University of California Berkeley (strong engineering programs), and Georgia Institute of Technology (excellent technical education).`;
    
    default:
      return 'Career guidance is currently being generated based on your academic profile.';
  }
};

export async function generateFutureStudies(input: CareerSuggestionInput): Promise<string> {
  if (!isApiKeyConfigured) {
    return getFallbackResponse('futureStudies', input);
  }
  
  try {
    const result = await futureStudiesFlow(input);
    return result.futureStudies;
  } catch (error) {
    console.error('Error generating future studies:', error);
    return getFallbackResponse('futureStudies', input);
  }
}

export async function generatePlacementsAndJobs(input: CareerSuggestionInput): Promise<string> {
  if (!isApiKeyConfigured) {
    return getFallbackResponse('placementsAndJobs', input);
  }
  
  try {
    const result = await placementsAndJobsFlow(input);
    return result.placementsAndJobs;
  } catch (error) {
    console.error('Error generating placements and jobs:', error);
    return getFallbackResponse('placementsAndJobs', input);
  }
}

export async function generateCollegeSuggestions(input: CareerSuggestionInput): Promise<string> {
  if (!isApiKeyConfigured) {
    return getFallbackResponse('collegeSuggestions', input);
  }
  
  try {
    const result = await collegeSuggestionsFlow(input);
    return result.collegeSuggestions;
  } catch (error) {
    console.error('Error generating college suggestions:', error);
    return getFallbackResponse('collegeSuggestions', input);
  }
}

// Prompt for Future Studies
const futureStudiesPrompt = ai.definePrompt({
  name: 'futureStudiesPrompt',
  input: {schema: CareerSuggestionInputSchema},
  output: {schema: FutureStudiesOutputSchema},
  prompt: `You are a career counselor. The student is pursuing a {{studyLevel}} in {{course}}{{#if specialization}}, with a specialization in {{specialization}}{{/if}}.
Suggest suitable future study options. Provide 2–3 sentences.
Provide your response as a valid JSON object that conforms to the output schema.`,
});

// Prompt for Placements and Jobs
const placementsAndJobsPrompt = ai.definePrompt({
  name: 'placementsAndJobsPrompt',
  input: {schema: CareerSuggestionInputSchema},
  output: {schema: PlacementsAndJobsOutputSchema},
  prompt: `You are a career counselor. The student is pursuing a {{studyLevel}} in {{course}}{{#if specialization}}, with a specialization in {{specialization}}{{/if}}.
Suggest possible jobs and placements in the current market. Provide 2–3 sentences.
Provide your response as a valid JSON object that conforms to the output schema.`,
});

// Prompt for College Suggestions
const collegeSuggestionsPrompt = ai.definePrompt({
  name: 'collegeSuggestionsPrompt',
  input: {schema: CareerSuggestionInputSchema},
  output: {schema: CollegeSuggestionsOutputSchema},
  prompt: `You are a career counselor. The student is pursuing a {{studyLevel}} in {{course}}{{#if specialization}}, with a specialization in {{specialization}}{{/if}}.
Suggest 4-5 popular colleges for the recommended future study options, including a brief detail about each.
Provide your response as a valid JSON object that conforms to the output schema.`,
});

const createSuggestionFlow = (name: string, prompt: any, inputSchema: any, outputSchema: any) => {
    return ai.defineFlow(
        {
            name,
            inputSchema,
            outputSchema,
        },
        async (input: z.infer<typeof inputSchema>) => {
            const promptInput = {
                ...input,
                specialization: input.specialization && input.specialization !== 'N/A' ? input.specialization : '',
            };
            const result = await prompt(promptInput);
            const output = result.output;
            if (!output) {
                throw new Error('No output from AI');
            }
            return output;
        }
    );
}

const futureStudiesFlow = createSuggestionFlow('futureStudiesFlow', futureStudiesPrompt, CareerSuggestionInputSchema, FutureStudiesOutputSchema);
const placementsAndJobsFlow = createSuggestionFlow('placementsAndJobsFlow', placementsAndJobsPrompt, CareerSuggestionInputSchema, PlacementsAndJobsOutputSchema);
const collegeSuggestionsFlow = createSuggestionFlow('collegeSuggestionsFlow', collegeSuggestionsPrompt, CareerSuggestionInputSchema, CollegeSuggestionsOutputSchema);
