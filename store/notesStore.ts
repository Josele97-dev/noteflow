import { create } from 'zustand';
import * as api from '../lib/api';
import { ChecklistNote, IdeaNote, Note } from '../types';

interface NotesStore {
  notes: Note[];
  checklists: ChecklistNote[];
  ideas: IdeaNote[];
  _hydrated: boolean;
  isLoading: boolean;
  error: string | null;

  fetchAll: () => Promise<void>;

  addNote: (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  addChecklist: (checklist: Omit<ChecklistNote, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  addIdea: (idea: Omit<IdeaNote, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;

  deleteNote: (id: string) => Promise<void>;
  deleteChecklist: (id: string) => Promise<void>;
  deleteIdea: (id: string) => Promise<void>;

  archiveNote: (id: string) => Promise<void>;
  archiveChecklist: (id: string) => Promise<void>;
  archiveIdea: (id: string) => Promise<void>;

  unarchiveNote: (id: string) => Promise<void>;
  unarchiveChecklist: (id: string) => Promise<void>;
  unarchiveIdea: (id: string) => Promise<void>;

  updateNote: (id: string, data: Partial<Note>) => Promise<void>;
  updateChecklist: (id: string, data: Partial<ChecklistNote>) => Promise<void>;
  updateIdea: (id: string, data: Partial<IdeaNote>) => Promise<void>;

  toggleChecklistItem: (checklistId: string, itemId: string) => Promise<void>;
}

export const useNotesStore = create<NotesStore>()((set, get) => ({
  notes: [],
  checklists: [],
  ideas: [],
  _hydrated: false,
  isLoading: false,
  error: null,

  fetchAll: async () => {
    set({ isLoading: true, error: null });
    try {
      const [notes, checklists, ideas] = await Promise.all([
        api.getNotes(),
        api.getChecklists(),
        api.getIdeas(),
      ]);
      set({ notes, checklists, ideas, _hydrated: true });
    } catch (e) {
      set({ error: 'Error al cargar datos', _hydrated: true });
    } finally {
      set({ isLoading: false });
    }
  },

  addNote: async (note) => {
    const created = await api.createNote({ title: note.title, content: note.content });
    set((s) => ({ notes: [created, ...s.notes] }));
  },

  addChecklist: async (checklist) => {
    const created = await api.createChecklist({ title: checklist.title, items: checklist.items });
    set((s) => ({ checklists: [created, ...s.checklists] }));
  },

  addIdea: async (idea) => {
    const created = await api.createIdea({ title: idea.title, content: idea.content, color: idea.color, tags: idea.tags });
    set((s) => ({ ideas: [created, ...s.ideas] }));
  },

  deleteNote: async (id) => {
    await api.deleteNote(id);
    set((s) => ({ notes: s.notes.filter((n) => n.id !== id) }));
  },

  deleteChecklist: async (id) => {
    await api.deleteChecklist(id);
    set((s) => ({ checklists: s.checklists.filter((c) => c.id !== id) }));
  },

  deleteIdea: async (id) => {
    await api.deleteIdea(id);
    set((s) => ({ ideas: s.ideas.filter((i) => i.id !== id) }));
  },

  archiveNote: async (id) => {
    await api.updateNote(id, { archived: true });
    set((s) => ({ notes: s.notes.map((n) => n.id === id ? { ...n, archived: true } : n) }));
  },

  archiveChecklist: async (id) => {
    await api.updateChecklist(id, { archived: true });
    set((s) => ({ checklists: s.checklists.map((c) => c.id === id ? { ...c, archived: true } : c) }));
  },

  archiveIdea: async (id) => {
    await api.updateIdea(id, { archived: true });
    set((s) => ({ ideas: s.ideas.map((i) => i.id === id ? { ...i, archived: true } : i) }));
  },

  unarchiveNote: async (id) => {
    await api.updateNote(id, { archived: false });
    set((s) => ({ notes: s.notes.map((n) => n.id === id ? { ...n, archived: false } : n) }));
  },

  unarchiveChecklist: async (id) => {
    await api.updateChecklist(id, { archived: false });
    set((s) => ({ checklists: s.checklists.map((c) => c.id === id ? { ...c, archived: false } : c) }));
  },

  unarchiveIdea: async (id) => {
    await api.updateIdea(id, { archived: false });
    set((s) => ({ ideas: s.ideas.map((i) => i.id === id ? { ...i, archived: false } : i) }));
  },

  updateNote: async (id, data) => {
    const updated = await api.updateNote(id, data);
    set((s) => ({ notes: s.notes.map((n) => n.id === id ? updated : n) }));
  },

  updateChecklist: async (id, data) => {
    const updated = await api.updateChecklist(id, data);
    set((s) => ({ checklists: s.checklists.map((c) => c.id === id ? updated : c) }));
  },

  updateIdea: async (id, data) => {
    const updated = await api.updateIdea(id, data);
    set((s) => ({ ideas: s.ideas.map((i) => i.id === id ? updated : i) }));
  },

  toggleChecklistItem: async (checklistId, itemId) => {
    const checklist = get().checklists.find((c) => c.id === checklistId);
    if (!checklist) return;
    const updatedItems = checklist.items.map((i) =>
      i.id === itemId ? { ...i, isCompleted: !i.isCompleted } : i
    );
    const updated = await api.updateChecklist(checklistId, { items: updatedItems });
    set((s) => ({ checklists: s.checklists.map((c) => c.id === checklistId ? updated : c) }));
  },
}));