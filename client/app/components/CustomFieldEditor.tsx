"use client";

import { useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface CustomField {
  id: string;
  type: "paragraph" | "orderedList" | "unorderedList" | "heading" | "subheading";
  content: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  order: number;
  style?: {
    fontFamily?: string;
    fontSize?: string;
    fontWeight?: string;
    fontStyle?: string;
    color?: string;
  };
  isVisible?: boolean;
}

interface CustomFieldEditorProps {
  customFields: CustomField[];
  onChange: (fields: CustomField[]) => void;
  onAddField: (field: Omit<CustomField, "id">) => void;
  onUpdateField: (id: string, field: Partial<CustomField>) => void;
  onDeleteField: (id: string) => void;
}

function SortableField({
  field,
  onEdit,
  onDelete,
  onStyleChange,
}: {
  field: CustomField;
  onEdit: (content: any) => void; // eslint-disable-line @typescript-eslint/no-explicit-any
  onDelete: () => void;
  onStyleChange: (updates: Partial<CustomField>) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: field.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const [isEditing, setIsEditing] = useState(false);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="border border-white/10 rounded-lg p-4 bg-white/5 mb-3"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <button
            {...attributes}
            {...listeners}
            className="cursor-grab text-[#d6b98c] hover:text-white transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="9" cy="12" r="1" />
              <circle cx="9" cy="5" r="1" />
              <circle cx="9" cy="19" r="1" />
              <circle cx="15" cy="12" r="1" />
              <circle cx="15" cy="5" r="1" />
              <circle cx="15" cy="19" r="1" />
            </svg>
          </button>
          <select
            value={field.type}
            onChange={(e) => {
              console.log('Type change:', e.target.value, 'Current type:', field.type);
              onStyleChange({ type: e.target.value as CustomField['type'] });
            }}
            className="bg-white/10 text-[#f5f0e8] text-xs px-2 py-1 rounded border border-white/10 outline-none"
          >
            <option value="paragraph" className="text-black">
              Paragraph
            </option>
            <option value="orderedList" className="text-black">
              Ordered List
            </option>
            <option value="unorderedList" className="text-black">
              Unordered List
            </option>
            <option value="heading" className="text-black">
              Heading
            </option>
            <option value="subheading" className="text-black">
              Sub Heading
            </option>
          </select>
        </div>
        <button
          onClick={onDelete}
          className="text-red-400 hover:text-red-300 transition-colors text-xs"
        >
          Delete
        </button>
      </div>

      {isEditing ? (
        <div>
          <textarea
            value={typeof field.content === "string" ? field.content : ""}
            onChange={(e) => onEdit(e.target.value)}
            className="w-full min-h-[120px] p-3 border border-white/10 rounded-lg bg-white text-black text-sm outline-none focus:border-[#d6b98c]"
            placeholder={
              field.type === "orderedList" || field.type === "unorderedList"
                ? "Enter items separated by newlines (one item per line)"
                : "Enter custom field content here..."
            }
          />
          <button
            onClick={() => setIsEditing(false)}
            className="mt-2 text-xs text-[#d6b98c] hover:text-white transition-colors"
          >
            Done
          </button>
        </div>
      ) : (
        <div
          onClick={() => setIsEditing(true)}
          className="text-[#f5f0e8] text-sm cursor-pointer hover:bg-white/5 p-2 rounded min-h-[84px]"
          role="button"
          tabIndex={0}
        >
          {field.content ? (
            <div>
              {field.type === "paragraph" && (
                <p>{String(field.content)}</p>
              )}
              {field.type === "heading" && (
                <h2 className="text-2xl font-bold">{String(field.content)}</h2>
              )}
              {field.type === "subheading" && (
                <h3 className="text-xl font-semibold">{String(field.content)}</h3>
              )}
              {field.type === "orderedList" && (
                <ol className="list-decimal list-inside space-y-1">
                  {String(field.content).split("\n").map((item: string, idx: number) => (
                    item.trim() && <li key={idx}>{item.trim()}</li>
                  ))}
                </ol>
              )}
              {field.type === "unorderedList" && (
                <ul className="list-disc list-inside space-y-1">
                  {String(field.content).split("\n").map((item: string, idx: number) => (
                    item.trim() && <li key={idx}>{item.trim()}</li>
                  ))}
                </ul>
              )}
            </div>
          ) : (
            <div className="text-[#9ca3af]">Click to edit field content</div>
          )}
        </div>
      )}

      {/* Styling Options */}
      <div className="mt-3 pt-3 border-t border-white/10">
        <div className="grid grid-cols-4 gap-2">
          <div>
            <label className="block text-[10px] text-[#f5f0e8]/50 mb-1">
              Font
            </label>
            <select
              value={field.style?.fontFamily || "font-sans"}
              onChange={(e) =>
                onStyleChange({
                  style: { ...field.style, fontFamily: e.target.value },
                })
              }
              className="w-full h-8 px-2 border border-white/10 rounded bg-white/5 text-xs text-[#f5f0e8] outline-none"
            >
              <option value="font-serif" className="text-black">
                Serif
              </option>
              <option value="font-sans" className="text-black">
                Sans
              </option>
              <option value="font-mono" className="text-black">
                Mono
              </option>
            </select>
          </div>
          <div>
            <label className="block text-[10px] text-[#f5f0e8]/50 mb-1">
              Size
            </label>
            <select
              value={field.style?.fontSize || "text-base"}
              onChange={(e) =>
                onStyleChange({
                  style: { ...field.style, fontSize: e.target.value },
                })
              }
              className="w-full h-8 px-2 border border-white/10 rounded bg-white/5 text-xs text-[#f5f0e8] outline-none"
            >
              <option value="text-sm" className="text-black">
                Small
              </option>
              <option value="text-base" className="text-black">
                Medium
              </option>
              <option value="text-lg" className="text-black">
                Large
              </option>
              <option value="text-xl" className="text-black">
                XL
              </option>
            </select>
          </div>
          <div>
            <label className="block text-[10px] text-[#f5f0e8]/50 mb-1">
              Weight
            </label>
            <select
              value={field.style?.fontWeight || "font-normal"}
              onChange={(e) =>
                onStyleChange({
                  style: { ...field.style, fontWeight: e.target.value },
                })
              }
              className="w-full h-8 px-2 border border-white/10 rounded bg-white/5 text-xs text-[#f5f0e8] outline-none"
            >
              <option value="font-light" className="text-black">
                Light
              </option>
              <option value="font-normal" className="text-black">
                Normal
              </option>
              <option value="font-medium" className="text-black">
                Medium
              </option>
              <option value="font-bold" className="text-black">
                Bold
              </option>
            </select>
          </div>
          <div>
            <label className="block text-[10px] text-[#f5f0e8]/50 mb-1">
              Color
            </label>
            <input
              type="color"
              value={field.style?.color || "#1a1814"}
              onChange={(e) =>
                onStyleChange({
                  style: { ...field.style, color: e.target.value },
                })
              }
              className="w-full h-8 border border-white/10 rounded bg-white/5 cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CustomFieldEditor({
  customFields,
  onChange,
  onAddField,
  onUpdateField,
  onDeleteField,
}: CustomFieldEditorProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      distance: 8,
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) {
      return;
    }

    if (active.id !== over.id) {
      const oldIndex = customFields.findIndex((field) => field.id === active.id);
      const newIndex = customFields.findIndex((field) => field.id === over.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        const newFields = arrayMove(customFields, oldIndex, newIndex).map(
          (field, index) => ({ ...field, order: index })
        );
        onChange(newFields);
      }
    }
  };

  const handleAddField = () => {
    const newField: Omit<CustomField, "id"> = {
      type: "paragraph",
      content: "",
      order: customFields.length,
      style: {
        fontFamily: "font-sans",
        fontSize: "text-base",
        fontWeight: "font-normal",
        fontStyle: "normal",
        color: "#1a1814",
      },
      isVisible: true,
    };
    onAddField(newField);
  };

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between mb-4">
        <label className="block text-[11px] font-medium tracking-widest uppercase text-[#d6b98c]">
          Custom Fields
        </label>
        {customFields.length < 10 && (
          <button
            onClick={handleAddField}
            className="text-xs text-[#d6b98c] hover:text-white transition-colors"
          >
            + Add Field ({customFields.length}/10)
          </button>
        )}
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={customFields.map((f) => f.id)}
          strategy={verticalListSortingStrategy}
        >
          {customFields.map((field) => (
            <SortableField
              key={field.id}
              field={field}
              onEdit={(content) => onUpdateField(field.id, { content })}
              onDelete={() => onDeleteField(field.id)}
              onStyleChange={(updates) => {
                console.log('onStyleChange called with updates:', updates);
                const updatePayload = {
                  ...updates,
                  style: updates.style ? { ...field.style, ...updates.style } : field.style,
                };
                console.log('Sending to onUpdateField:', updatePayload);
                onUpdateField(field.id, updatePayload);
              }}
            />
          ))}
        </SortableContext>
      </DndContext>
    </div>
  );
}
