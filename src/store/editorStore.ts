import { create } from 'zustand'
import type { Project, SlotTransform, TemplateDef } from '../types'

const HISTORY_LIMIT = 50

interface EditorState {
  template: TemplateDef | null
  project: Project | null
  selectedSlotId: string | null
  selectedTextId: string | null
  dirty: boolean
  past: Project[]
  future: Project[]

  /** Carga plantilla + proyecto en el editor (resetea historial). */
  init: (template: TemplateDef, project: Project) => void
  reset: () => void

  setSlotImage: (slotId: string, imageBlobId: string | undefined) => void
  updateSlotTransform: (slotId: string, partial: Partial<SlotTransform>) => void
  removeSlotImage: (slotId: string) => void
  setText: (fieldId: string, value: string) => void
  setName: (name: string) => void

  selectSlot: (slotId: string | null) => void
  selectText: (fieldId: string | null) => void

  undo: () => void
  redo: () => void
  markSaved: () => void
  /** Reemplaza el proyecto por la versión persistida y marca como guardado. */
  applySaved: (project: Project) => void
  canUndo: () => boolean
  canRedo: () => boolean
}

/** Aplica una mutación al proyecto registrando el estado anterior en el historial. */
function mutate(
  state: EditorState,
  fn: (project: Project) => Project,
): Partial<EditorState> {
  if (!state.project) return {}
  const previous = state.project
  const next = fn(structuredClone(previous))
  return {
    project: next,
    past: [...state.past, previous].slice(-HISTORY_LIMIT),
    future: [],
    dirty: true,
  }
}

export const useEditorStore = create<EditorState>((set, get) => ({
  template: null,
  project: null,
  selectedSlotId: null,
  selectedTextId: null,
  dirty: false,
  past: [],
  future: [],

  init: (template, project) =>
    set({
      template,
      project,
      selectedSlotId: null,
      selectedTextId: null,
      dirty: false,
      past: [],
      future: [],
    }),

  reset: () =>
    set({
      template: null,
      project: null,
      selectedSlotId: null,
      selectedTextId: null,
      dirty: false,
      past: [],
      future: [],
    }),

  setSlotImage: (slotId, imageBlobId) =>
    set((s) =>
      mutate(s, (p) => ({
        ...p,
        slots: {
          ...p.slots,
          [slotId]: {
            imageBlobId,
            transform: { scale: 1, offsetX: 0, offsetY: 0, rotation: 0 },
          },
        },
      })),
    ),

  updateSlotTransform: (slotId, partial) =>
    set((s) =>
      mutate(s, (p) => ({
        ...p,
        slots: {
          ...p.slots,
          [slotId]: {
            ...p.slots[slotId],
            transform: { ...p.slots[slotId].transform, ...partial },
          },
        },
      })),
    ),

  removeSlotImage: (slotId) =>
    set((s) =>
      mutate(s, (p) => ({
        ...p,
        slots: {
          ...p.slots,
          [slotId]: {
            imageBlobId: undefined,
            transform: { scale: 1, offsetX: 0, offsetY: 0, rotation: 0 },
          },
        },
      })),
    ),

  setText: (fieldId, value) =>
    set((s) =>
      mutate(s, (p) => ({
        ...p,
        texts: { ...p.texts, [fieldId]: { ...p.texts[fieldId], value } },
      })),
    ),

  setName: (name) => set((s) => mutate(s, (p) => ({ ...p, name }))),

  selectSlot: (slotId) => set({ selectedSlotId: slotId, selectedTextId: null }),
  selectText: (fieldId) =>
    set({ selectedTextId: fieldId, selectedSlotId: null }),

  undo: () =>
    set((s) => {
      if (!s.project || s.past.length === 0) return {}
      const previous = s.past[s.past.length - 1]
      return {
        project: previous,
        past: s.past.slice(0, -1),
        future: [s.project, ...s.future],
        dirty: true,
      }
    }),

  redo: () =>
    set((s) => {
      if (!s.project || s.future.length === 0) return {}
      const next = s.future[0]
      return {
        project: next,
        past: [...s.past, s.project],
        future: s.future.slice(1),
        dirty: true,
      }
    }),

  markSaved: () => set({ dirty: false }),
  applySaved: (project) => set({ project, dirty: false }),
  canUndo: () => get().past.length > 0,
  canRedo: () => get().future.length > 0,
}))
