import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ShoppingListItem {
  id: string;
  name: string;
  quantity: number;
  unit?: string;
  checked: boolean;
}

export interface ShoppingList {
  id: string;
  name: string;
  items: ShoppingListItem[];
  createdAt: string;
  updatedAt: string;
}

interface ShoppingListsState {
  lists: ShoppingList[];
  activeListId: string | null;
}

const initialState: ShoppingListsState = {
  lists: JSON.parse(localStorage.getItem('shoppingLists') || '[]'),
  activeListId: null,
};

const shoppingListsSlice = createSlice({
  name: 'shoppingLists',
  initialState,
  reducers: {
    createList: (state, action: PayloadAction<string>) => {
      const newList: ShoppingList = {
        id: Date.now().toString(),
        name: action.payload,
        items: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      state.lists.push(newList);
      state.activeListId = newList.id;
      localStorage.setItem('shoppingLists', JSON.stringify(state.lists));
    },
    deleteList: (state, action: PayloadAction<string>) => {
      state.lists = state.lists.filter(list => list.id !== action.payload);
      if (state.activeListId === action.payload) {
        state.activeListId = state.lists.length > 0 ? state.lists[0].id : null;
      }
      localStorage.setItem('shoppingLists', JSON.stringify(state.lists));
    },
    addItemToList: (state, action: PayloadAction<{ listId: string; item: Omit<ShoppingListItem, 'checked'> }>) => {
      const list = state.lists.find(l => l.id === action.payload.listId);
      if (list) {
        list.items.push({
          ...action.payload.item,
          checked: false,
        });
        list.updatedAt = new Date().toISOString();
        localStorage.setItem('shoppingLists', JSON.stringify(state.lists));
      }
    },
    removeItemFromList: (state, action: PayloadAction<{ listId: string; itemId: string }>) => {
      const list = state.lists.find(l => l.id === action.payload.listId);
      if (list) {
        list.items = list.items.filter(item => item.id !== action.payload.itemId);
        list.updatedAt = new Date().toISOString();
        localStorage.setItem('shoppingLists', JSON.stringify(state.lists));
      }
    },
    toggleItemChecked: (state, action: PayloadAction<{ listId: string; itemId: string }>) => {
      const list = state.lists.find(l => l.id === action.payload.listId);
      if (list) {
        const item = list.items.find(i => i.id === action.payload.itemId);
        if (item) {
          item.checked = !item.checked;
          list.updatedAt = new Date().toISOString();
          localStorage.setItem('shoppingLists', JSON.stringify(state.lists));
        }
      }
    },
    setActiveList: (state, action: PayloadAction<string | null>) => {
      state.activeListId = action.payload;
    },
  },
});

export const {
  createList,
  deleteList,
  addItemToList,
  removeItemFromList,
  toggleItemChecked,
  setActiveList,
} = shoppingListsSlice.actions;

export default shoppingListsSlice.reducer;
