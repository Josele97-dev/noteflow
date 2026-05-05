import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { ChecklistNote, IdeaNote, Note } from '../types';

interface NotesStore {
  notes: Note[];
  checklists: ChecklistNote[];
  ideas: IdeaNote[];
  _hydrated: boolean;

  addNote: (note: Note) => void;
  addChecklist: (checklist: ChecklistNote) => void;
  addIdea: (idea: IdeaNote) => void;

  deleteNote: (id: string) => void;
  deleteChecklist: (id: string) => void;
  deleteIdea: (id: string) => void;

  archiveNote: (id: string) => void;
  archiveChecklist: (id: string) => void;
  archiveIdea: (id: string) => void;

  unarchiveNote: (id: string) => void;
  unarchiveChecklist: (id: string) => void;
  unarchiveIdea: (id: string) => void;

  updateNote: (id: string, data: Partial<Note>) => void;
  updateChecklist: (id: string, data: Partial<ChecklistNote>) => void;
  updateIdea: (id: string, data: Partial<IdeaNote>) => void;

  toggleChecklistItem: (checklistId: string, itemId: string) => void;

  updateChecklistItem: (checklistId: string, itemId: string, text: string) => void;
  addChecklistItem: (checklistId: string, text: string) => void;
  deleteChecklistItem: (checklistId: string, itemId: string) => void;
}

const parseDates = <T extends { createdAt: any; updatedAt: any }>(items: T[]): T[] =>
  items.map((item) => ({
    ...item,
    createdAt: new Date(item.createdAt),
    updatedAt: new Date(item.updatedAt),
  }));

const setArchived = <T extends { id: string; archived: boolean; updatedAt: Date }>(
  items: T[],
  id: string,
  archived: boolean
): T[] =>
  items.map((item) =>
    item.id === id ? { ...item, archived, updatedAt: new Date() } : item
  );

export const useNotesStore = create<NotesStore>()(
  persist(
    (set) => ({
      notes: [],
      checklists: [],
      ideas: [],
      _hydrated: false,

      addNote: (note) => set((s) => ({ notes: [...s.notes, note] })),
      addChecklist: (checklist) => set((s) => ({ checklists: [...s.checklists, checklist] })),
      addIdea: (idea) => set((s) => ({ ideas: [...s.ideas, idea] })),

      deleteNote: (id) => set((s) => ({ notes: s.notes.filter((n) => n.id !== id) })),
      deleteChecklist: (id) => set((s) => ({ checklists: s.checklists.filter((c) => c.id !== id) })),
      deleteIdea: (id) => set((s) => ({ ideas: s.ideas.filter((i) => i.id !== id) })),

      archiveNote: (id) => set((s) => ({ notes: setArchived(s.notes, id, true) })),
      archiveChecklist: (id) => set((s) => ({ checklists: setArchived(s.checklists, id, true) })),
      archiveIdea: (id) => set((s) => ({ ideas: setArchived(s.ideas, id, true) })),

      unarchiveNote: (id) => set((s) => ({ notes: setArchived(s.notes, id, false) })),
      unarchiveChecklist: (id) => set((s) => ({ checklists: setArchived(s.checklists, id, false) })),
      unarchiveIdea: (id) => set((s) => ({ ideas: setArchived(s.ideas, id, false) })),

      updateNote: (id, data) =>
        set((s) => ({
          notes: s.notes.map((n) =>
            n.id === id ? { ...n, ...data, updatedAt: new Date() } : n
          ),
        })),

      updateChecklist: (id, data) =>
        set((s) => ({
          checklists: s.checklists.map((c) =>
            c.id === id ? { ...c, ...data, updatedAt: new Date() } : c
          ),
        })),

      updateIdea: (id, data) =>
        set((s) => ({
          ideas: s.ideas.map((i) =>
            i.id === id ? { ...i, ...data, updatedAt: new Date() } : i
          ),
        })),

      toggleChecklistItem: (checklistId, itemId) =>
        set((s) => ({
          checklists: s.checklists.map((c) =>
            c.id !== checklistId
              ? c
              : {
                  ...c,
                  updatedAt: new Date(),
                  items: c.items.map((i) =>
                    i.id === itemId
                      ? { ...i, isCompleted: !i.isCompleted }
                      : i
                  ),
                }
          ),
        })),

      updateChecklistItem: (checklistId, itemId, text) =>
        set((s) => ({
          checklists: s.checklists.map((c) =>
            c.id !== checklistId
              ? c
              : {
                  ...c,
                  updatedAt: new Date(),
                  items: c.items.map((i) =>
                    i.id === itemId ? { ...i, text } : i
                  ),
                }
          ),
        })),

      addChecklistItem: (checklistId, text) =>
        set((s) => ({
          checklists: s.checklists.map((c) =>
            c.id !== checklistId
              ? c
              : {
                  ...c,
                  updatedAt: new Date(),
                  items: [
                    ...c.items,
                    {
                      id: Math.random().toString(),
                      text,
                      isCompleted: false,
                    },
                  ],
                }
          ),
        })),

      deleteChecklistItem: (checklistId, itemId) =>
        set((s) => ({
          checklists: s.checklists.map((c) =>
            c.id !== checklistId
              ? c
              : {
                  ...c,
                  updatedAt: new Date(),
                  items: c.items.filter((i) => i.id !== itemId),
                }
          ),
        })),
    }),
    {
      name: 'noteflow-storage',
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.notes = parseDates(state.notes);
          state.checklists = parseDates(state.checklists);
          state.ideas = parseDates(state.ideas);
          state._hydrated = true;
        }
      },
    }
  )
);