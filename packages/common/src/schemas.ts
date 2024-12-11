import { z } from "zod";

const questionChoiceSchema = z.object({
  choiceText: z.string(),
  choiceValue: z.number().or(z.string()),
  choiceTranslationKey: z.string(),
  relatedVariableName: z.string().optional(),
  relatedVariableValue: z.number().or(z.string()).optional(),
});

const displayConditionSchema = z.object({
  variableName: z.string().min(1),
  operator: z.string().min(1),
  value: z.string().min(1).or(z.number()),
});

const questionSchema = z.object({
  id: z.string().nonempty(),
  sortKey: z.string(),
  questionText: z.string(),
  descriptionText: z.string().optional(),
  descriptionTranslationKey: z.string().optional(),
  formula: z.string().min(1),
  variableName: z.string(),
  relatedVariableName: z.string().optional(),
  label: z.string(),
  choices: z.array(questionChoiceSchema).optional(),
  displayCondition: z.array(displayConditionSchema).optional(),
});

const actionSchema = z.object({
  id: z.string().min(1),
  variableName: z.string().min(1),
  title: z.string().min(1),
  category: z.string().min(1),
  impactFormulas: z.array(
    z.object({
      conditions: z.array(displayConditionSchema),
      formula: z.string(),
    }),
  ),
  type: z.string(),
  displayCondition: z.array(displayConditionSchema).optional(),
  tags: z.array(z.string()),
  skipIdsIfSelected: z.array(z.string()),
  proportionedImpact: z.number().optional(),
});

export type Action = z.infer<typeof actionSchema>;
export type QuestionChoiceType = z.infer<typeof questionChoiceSchema>;
export type QuestionType = z.infer<typeof questionSchema>;
export type DisplayCondition = z.infer<typeof displayConditionSchema>;

export { questionSchema, actionSchema };
