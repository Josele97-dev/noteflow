import * as api from '../../lib/api';
import { useNotesStore } from '../../store/notesStore';

jest.mock('../../lib/api', () => ({
  getNotes: jest.fn().mockResolvedValue([]),
  getChecklists: jest.fn().mockResolvedValue([]),
  getIdeas: jest.fn().mockResolvedValue([]),

  createNote: jest.fn(),
  deleteNote: jest.fn(),
  updateNote: jest.fn(),

  createIdea: jest.fn(),
  deleteIdea: jest.fn(),
  updateIdea: jest.fn(),

  createChecklist: jest.fn(),
  deleteChecklist: jest.fn(),
  updateChecklist: jest.fn(),
}));

const mockedApi = api as jest.Mocked<typeof api>;

describe('notesStore', () => {
  beforeEach(() => {
    useNotesStore.setState({
      notes: [],
      checklists: [],
      ideas: [],
      _hydrated: false,
      isLoading: false,
      error: null,
    });

    jest.clearAllMocks();
  });

  it('se inicializa vacío', () => {
    const state = useNotesStore.getState();

    expect(state.notes).toEqual([]);
    expect(state.checklists).toEqual([]);
    expect(state.ideas).toEqual([]);
  });

  
  it('fetchAll carga datos y activa _hydrated', async () => {
    await useNotesStore.getState().fetchAll();

    const state = useNotesStore.getState();

    expect(state._hydrated).toBe(true);
  });

  
  it('addNote añade una nota', async () => {
    mockedApi.createNote.mockResolvedValue({
      id: '1',
      title: 'Mi nota',
      content: 'Contenido',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    } as any);

    await useNotesStore.getState().addNote({
      title: 'Mi nota',
      content: 'Contenido',
    });

    expect(useNotesStore.getState().notes).toHaveLength(1);
    expect(useNotesStore.getState().notes[0].title).toBe('Mi nota');
  });

  it('deleteNote elimina una nota', async () => {
    useNotesStore.setState({
      notes: [{ id: '1', title: 'Nota' } as any],
    });

    mockedApi.deleteNote.mockResolvedValue(undefined);

    await useNotesStore.getState().deleteNote('1');

    expect(useNotesStore.getState().notes).toHaveLength(0);
  });

  it('archiveNote marca como archivada', async () => {
    useNotesStore.setState({
      notes: [{ id: '1', archived: false } as any],
    });

    mockedApi.updateNote.mockResolvedValue({} as any);

    await useNotesStore.getState().archiveNote('1');

    expect(useNotesStore.getState().notes[0].archived).toBe(true);
  });

  it('unarchiveNote desmarca archivada', async () => {
    useNotesStore.setState({
      notes: [{ id: '1', archived: true } as any],
    });

    mockedApi.updateNote.mockResolvedValue({} as any);

    await useNotesStore.getState().unarchiveNote('1');

    expect(useNotesStore.getState().notes[0].archived).toBe(false);
  });

  
  it('addIdea añade una idea', async () => {
    mockedApi.createIdea.mockResolvedValue({
      id: '2',
      title: 'Idea',
      content: '',
      color: '#FFD700',
      tags: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    } as any);

    await useNotesStore.getState().addIdea({
      title: 'Idea',
      content: '',
      color: '#FFD700',
      tags: [],
    });

    expect(useNotesStore.getState().ideas).toHaveLength(1);
  });

  it('deleteIdea elimina una idea', async () => {
    useNotesStore.setState({
      ideas: [{ id: '2' } as any],
    });

    mockedApi.deleteIdea.mockResolvedValue(undefined);

    await useNotesStore.getState().deleteIdea('2');

    expect(useNotesStore.getState().ideas).toHaveLength(0);
  });

 
  it('addChecklist añade una tarea', async () => {
    mockedApi.createChecklist.mockResolvedValue({
      id: '3',
      title: 'Tarea',
      items: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    } as any);

    await useNotesStore.getState().addChecklist({
      title: 'Tarea',
      items: [],
    });

    expect(useNotesStore.getState().checklists).toHaveLength(1);
  });

  it('deleteChecklist elimina una tarea', async () => {
    useNotesStore.setState({
      checklists: [{ id: '3' } as any],
    });

    mockedApi.deleteChecklist.mockResolvedValue(undefined);

    await useNotesStore.getState().deleteChecklist('3');

    expect(useNotesStore.getState().checklists).toHaveLength(0);
  });

  it('archiveChecklist marca tarea como archivada', async () => {
    useNotesStore.setState({
      checklists: [{ id: '3', archived: false } as any],
    });

    mockedApi.updateChecklist.mockResolvedValue({} as any);

    await useNotesStore.getState().archiveChecklist('3');

    expect(useNotesStore.getState().checklists[0].archived).toBe(true);
  });
});