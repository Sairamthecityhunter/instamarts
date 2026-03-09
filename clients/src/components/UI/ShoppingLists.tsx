import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FiPlus, FiTrash2, FiCheck, FiX } from 'react-icons/fi';
import { RootState } from '../../store/store';
import {
  createList,
  deleteList,
  addItemToList,
  removeItemFromList,
  toggleItemChecked,
  setActiveList,
} from '../../store/slices/shoppingListsSlice';
import { toast } from 'react-hot-toast';

const ShoppingLists: React.FC = () => {
  const dispatch = useDispatch();
  const { lists, activeListId } = useSelector((state: RootState) => state.shoppingLists);
  const [newListName, setNewListName] = useState('');
  const [newItemName, setNewItemName] = useState('');
  const [showNewListForm, setShowNewListForm] = useState(false);

  const activeList = lists.find(l => l.id === activeListId);

  const handleCreateList = () => {
    if (newListName.trim()) {
      dispatch(createList(newListName));
      setNewListName('');
      setShowNewListForm(false);
      toast.success('Shopping list created!');
    }
  };

  const handleAddItem = () => {
    if (activeList && newItemName.trim()) {
      dispatch(addItemToList({
        listId: activeList.id,
        item: {
          id: Date.now().toString(),
          name: newItemName,
          quantity: 1,
        },
      }));
      setNewItemName('');
      toast.success('Item added to list!');
    }
  };

  const handleDeleteList = (listId: string) => {
    if (window.confirm('Are you sure you want to delete this list?')) {
      dispatch(deleteList(listId));
      toast.success('List deleted');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900">Shopping Lists</h2>
        <button
          onClick={() => setShowNewListForm(!showNewListForm)}
          className="flex items-center gap-2 text-green-600 hover:text-green-700"
        >
          <FiPlus className="h-5 w-5" />
          <span>New List</span>
        </button>
      </div>

      {/* Create New List Form */}
      {showNewListForm && (
        <div className="mb-4 p-4 bg-gray-50 rounded-lg">
          <input
            type="text"
            value={newListName}
            onChange={(e) => setNewListName(e.target.value)}
            placeholder="List name..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-2"
            onKeyPress={(e) => e.key === 'Enter' && handleCreateList()}
          />
          <div className="flex gap-2">
            <button
              onClick={handleCreateList}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Create
            </button>
            <button
              onClick={() => {
                setShowNewListForm(false);
                setNewListName('');
              }}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Lists */}
      {lists.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No shopping lists yet. Create one to get started!</p>
      ) : (
        <div className="space-y-4">
          {lists.map((list) => (
            <div
              key={list.id}
              className={`border rounded-lg p-4 ${
                activeListId === list.id ? 'border-green-500 bg-green-50' : 'border-gray-200'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <h3
                  className="font-semibold text-gray-900 cursor-pointer"
                  onClick={() => dispatch(setActiveList(list.id))}
                >
                  {list.name}
                </h3>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">
                    {list.items.filter(i => !i.checked).length} items
                  </span>
                  <button
                    onClick={() => handleDeleteList(list.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <FiTrash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {activeListId === list.id && (
                <div className="space-y-2">
                  {/* Add Item Form */}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newItemName}
                      onChange={(e) => setNewItemName(e.target.value)}
                      placeholder="Add item..."
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      onKeyPress={(e) => e.key === 'Enter' && handleAddItem()}
                    />
                    <button
                      onClick={handleAddItem}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                      <FiPlus className="h-5 w-5" />
                    </button>
                  </div>

                  {/* List Items */}
                  <div className="space-y-1 max-h-48 overflow-y-auto">
                    {list.items.map((item) => (
                      <div
                        key={item.id}
                        className={`flex items-center gap-2 p-2 rounded ${
                          item.checked ? 'bg-gray-100' : 'bg-white'
                        }`}
                      >
                        <button
                          onClick={() => dispatch(toggleItemChecked({ listId: list.id, itemId: item.id }))}
                          className={`p-1 rounded ${
                            item.checked
                              ? 'bg-green-600 text-white'
                              : 'border border-gray-300'
                          }`}
                        >
                          {item.checked ? <FiCheck className="h-4 w-4" /> : null}
                        </button>
                        <span
                          className={`flex-1 text-sm ${
                            item.checked ? 'line-through text-gray-500' : 'text-gray-900'
                          }`}
                        >
                          {item.name} {item.quantity > 1 && `(${item.quantity})`}
                        </span>
                        <button
                          onClick={() => dispatch(removeItemFromList({ listId: list.id, itemId: item.id }))}
                          className="text-red-600 hover:text-red-700"
                        >
                          <FiX className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ShoppingLists;
