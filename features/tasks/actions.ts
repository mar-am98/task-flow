"use server";

// Server Actions for Task CRUD — run on the server, called directly from components.

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

// ─── Types ────────────────────────────────────────────────────────────────────

// Shape of a subtask when creating/updating
export interface SubtaskInput {
  id?: string;       // Present when editing an existing subtask
  text: string;
  completed: boolean;
}

// ─── READ ─────────────────────────────────────────────────────────────────────

/**
 * Fetch all tasks with their subtasks, sorted newest first.
 */
export async function getTasks() {
  try {
    const tasks = await prisma.task.findMany({
      orderBy: { createdAt: "desc" },
      include: { subtasks: true }, // also fetch related subtasks
    });
    return { data: tasks, error: null };
  } catch (error) {
    console.error("Failed to fetch tasks:", error);
    return { data: [], error: "Failed to load tasks." };
  }
}

// ─── CREATE ───────────────────────────────────────────────────────────────────

/**
 * Create a brand-new task (and its subtasks) from form data.
 */
export async function createTask(formData: FormData) {
  // Pull values from the submitted form
  const title = formData.get("title")?.toString().trim();
  const description = formData.get("description")?.toString().trim() || undefined;
  const priority = formData.get("priority")?.toString() || "MEDIUM";
  const status = formData.get("status")?.toString() || "To Do";
  const projectName = formData.get("projectName")?.toString() || "Personal";
  const projectColor = formData.get("projectColor")?.toString() || "bg-emerald-500";
  const dueDateRaw = formData.get("dueDate")?.toString();
  const dueDate = dueDateRaw ? new Date(dueDateRaw) : undefined;

  // Parse subtasks sent as a JSON string in the hidden field
  let subtasksInput: SubtaskInput[] = [];
  try {
    const raw = formData.get("subtasks")?.toString();
    if (raw) subtasksInput = JSON.parse(raw);
  } catch {
    // ignore JSON parse errors — subtasks field is optional
  }

  if (!title || title.length === 0) {
    return { error: "Task title cannot be empty." };
  }

  try {
    await prisma.task.create({
      data: {
        title,
        description,
        priority,
        status,
        projectName,
        projectColor,
        dueDate,
        // Create all subtasks in one nested write
        subtasks: {
          create: subtasksInput
            .filter((st) => st.text.trim().length > 0)
            .map((st) => ({ text: st.text.trim(), completed: st.completed })),
        },
      },
    });

    revalidatePath("/"); // Refresh the page so the new task appears
    return { error: null };
  } catch (error) {
    console.error("Failed to create task:", error);
    return { error: "Failed to create task." };
  }
}

// ─── UPDATE ───────────────────────────────────────────────────────────────────

/**
 * Update an existing task's fields. Subtasks are fully replaced:
 * deleted first, then re-created from form data.
 */
export async function updateTask(id: string, formData: FormData) {
  const title = formData.get("title")?.toString().trim();
  const description = formData.get("description")?.toString().trim() || undefined;
  const priority = formData.get("priority")?.toString() || "MEDIUM";
  const status = formData.get("status")?.toString() || "To Do";
  const projectName = formData.get("projectName")?.toString() || "Personal";
  const projectColor = formData.get("projectColor")?.toString() || "bg-emerald-500";
  const dueDateRaw = formData.get("dueDate")?.toString();
  const dueDate = dueDateRaw ? new Date(dueDateRaw) : null;

  let subtasksInput: SubtaskInput[] = [];
  try {
    const raw = formData.get("subtasks")?.toString();
    if (raw) subtasksInput = JSON.parse(raw);
  } catch {
    // ignore
  }

  if (!title || title.length === 0) {
    return { error: "Task title cannot be empty." };
  }

  try {
    // Delete existing subtasks first, then re-create from form state
    await prisma.subtask.deleteMany({ where: { taskId: id } });

    await prisma.task.update({
      where: { id },
      data: {
        title,
        description,
        priority,
        status,
        projectName,
        projectColor,
        dueDate,
        subtasks: {
          create: subtasksInput
            .filter((st) => st.text.trim().length > 0)
            .map((st) => ({ text: st.text.trim(), completed: st.completed })),
        },
      },
    });

    revalidatePath("/");
    return { error: null };
  } catch (error) {
    console.error("Failed to update task:", error);
    return { error: "Failed to update task." };
  }
}

// ─── TOGGLE STATUS ────────────────────────────────────────────────────────────

/**
 * Toggle a task's status between "To Do" and "Done".
 */
export async function toggleTaskStatus(id: string, currentStatus: string) {
  const nextStatus = currentStatus === "Done" ? "To Do" : "Done";
  try {
    await prisma.task.update({
      where: { id },
      data: { status: nextStatus },
    });

    revalidatePath("/");
    return { error: null };
  } catch (error) {
    console.error("Failed to toggle task status:", error);
    return { error: "Failed to update task status." };
  }
}

// ─── TOGGLE SUBTASK ───────────────────────────────────────────────────────────

/**
 * Toggle a single subtask's completed state.
 */
export async function toggleSubtask(subtaskId: string, completed: boolean) {
  try {
    await prisma.subtask.update({
      where: { id: subtaskId },
      data: { completed: !completed },
    });

    revalidatePath("/");
    return { error: null };
  } catch (error) {
    console.error("Failed to toggle subtask:", error);
    return { error: "Failed to update subtask." };
  }
}

// ─── DELETE ───────────────────────────────────────────────────────────────────

/**
 * Delete a task by ID. Subtasks are deleted automatically via cascade.
 */
export async function deleteTask(id: string) {
  try {
    await prisma.task.delete({ where: { id } });

    revalidatePath("/");
    return { error: null };
  } catch (error) {
    console.error("Failed to delete task:", error);
    return { error: "Failed to delete task." };
  }
}
