import { z } from 'zod';

export const taskCreateSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(200, 'Title must be less than 200 characters'),
  description: z
    .string()
    .optional(),
  completed: z
    .boolean()
    .optional(),
});

export const taskUpdateSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(200, 'Title must be less than 200 characters'),
  description: z
    .string()
    .optional(),
  completed: z
    .boolean()
    .optional(),
});

export const taskFilterSchema = z.object({
  completed: z
    .boolean()
    .optional(),
  search: z
    .string()
    .optional(),
  ordering: z
    .string()
    .optional(),
});

export type TaskCreateFormData = z.infer<typeof taskCreateSchema>;
export type TaskUpdateFormData = z.infer<typeof taskUpdateSchema>;
export type TaskFilterFormData = z.infer<typeof taskFilterSchema>;