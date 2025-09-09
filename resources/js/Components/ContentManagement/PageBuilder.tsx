import React, { useState, useCallback } from 'react';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
    useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
    PlusIcon,
    TrashIcon,
    EyeIcon,
    DocumentDuplicateIcon,
    Bars3Icon,
    PencilIcon,
} from '@heroicons/react/24/outline';
import WysiwygEditor from './WysiwygEditor';
import MediaLibrary from './MediaLibrary';

interface PageSection {
    id: string;
    type: string;
    content: any;
    settings: any;
    sort_order: number;
}

interface PageBuilderProps {
    sections: PageSection[];
    onChange: (sections: PageSection[]) => void;
}

const sectionTypes = [
    { type: 'hero', name: 'Hero Section', description: 'Large banner with background image and text' },
    { type: 'text', name: 'Text Block', description: 'Rich text content with WYSIWYG editor' },
    { type: 'image', name: 'Image', description: 'Single image with caption' },
    { type: 'gallery', name: 'Gallery', description: 'Grid of images' },
    { type: 'products', name: 'Products', description: 'Featured or category products' },
    { type: 'testimonials', name: 'Testimonials', description: 'Customer testimonials' },
    { type: 'cta', name: 'Call to Action', description: 'Button with compelling text' },
    { type: 'faq', name: 'FAQ', description: 'Frequently asked questions' },
    { type: 'contact', name: 'Contact Form', description: 'Contact information and form' },
    { type: 'custom', name: 'Custom HTML', description: 'Custom HTML content' },
];

function SortableSection({ section, onUpdate, onDelete, onDuplicate }: {
    section: PageSection;
    onUpdate: (section: PageSection) => void;
    onDelete: (id: string) => void;
    onDuplicate: (section: PageSection) => void;
}) {
    const [isEditing, setIsEditing] = useState(false);
    const [isMediaLibraryOpen, setIsMediaLibraryOpen] = useState(false);
    
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: section.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    const updateSection = (updates: Partial<PageSection>) => {
        onUpdate({ ...section, ...updates });
    };

    const updateContent = (key: string, value: any) => {
        updateSection({
            content: { ...section.content, [key]: value }
        });
    };

    const updateSettings = (key: string, value: any) => {
        updateSection({
            settings: { ...section.settings, [key]: value }
        });
    };

    const renderSectionEditor = () => {
        switch (section.type) {
            case 'hero':
                return (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Title
                            </label>
                            <input
                                type="text"
                                value={section.content.title || ''}
                                onChange={(e) => updateContent('title', e.target.value)}
                                className="w-full border border-gray-300 rounded-md px-3 py-2"
                                placeholder="Hero title"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Subtitle
                            </label>
                            <input
                                type="text"
                                value={section.content.subtitle || ''}
                                onChange={(e) => updateContent('subtitle', e.target.value)}
                                className="w-full border border-gray-300 rounded-md px-3 py-2"
                                placeholder="Hero subtitle"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Background Image
                            </label>
                            <div className="flex items-center space-x-2">
                                <input
                                    type="text"
                                    value={section.content.background_image || ''}
                                    onChange={(e) => updateContent('background_image', e.target.value)}
                                    className="flex-1 border border-gray-300 rounded-md px-3 py-2"
                                    placeholder="Image URL"
                                />
                                <button
                                    type="button"
                                    onClick={() => setIsMediaLibraryOpen(true)}
                                    className="px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                                >
                                    Browse
                                </button>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Button Text
                            </label>
                            <input
                                type="text"
                                value={section.content.button_text || ''}
                                onChange={(e) => updateContent('button_text', e.target.value)}
                                className="w-full border border-gray-300 rounded-md px-3 py-2"
                                placeholder="Button text"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Button URL
                            </label>
                            <input
                                type="text"
                                value={section.content.button_url || ''}
                                onChange={(e) => updateContent('button_url', e.target.value)}
                                className="w-full border border-gray-300 rounded-md px-3 py-2"
                                placeholder="Button URL"
                            />
                        </div>
                    </div>
                );

            case 'text':
                return (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Content
                            </label>
                            <WysiwygEditor
                                value={section.content.content || ''}
                                onChange={(content) => updateContent('content', content)}
                                height={300}
                            />
                        </div>
                    </div>
                );

            case 'image':
                return (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Image
                            </label>
                            <div className="flex items-center space-x-2">
                                <input
                                    type="text"
                                    value={section.content.image_url || ''}
                                    onChange={(e) => updateContent('image_url', e.target.value)}
                                    className="flex-1 border border-gray-300 rounded-md px-3 py-2"
                                    placeholder="Image URL"
                                />
                                <button
                                    type="button"
                                    onClick={() => setIsMediaLibraryOpen(true)}
                                    className="px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                                >
                                    Browse
                                </button>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Alt Text
                            </label>
                            <input
                                type="text"
                                value={section.content.alt_text || ''}
                                onChange={(e) => updateContent('alt_text', e.target.value)}
                                className="w-full border border-gray-300 rounded-md px-3 py-2"
                                placeholder="Alt text for accessibility"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Caption
                            </label>
                            <input
                                type="text"
                                value={section.content.caption || ''}
                                onChange={(e) => updateContent('caption', e.target.value)}
                                className="w-full border border-gray-300 rounded-md px-3 py-2"
                                placeholder="Image caption"
                            />
                        </div>
                    </div>
                );

            case 'cta':
                return (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Heading
                            </label>
                            <input
                                type="text"
                                value={section.content.heading || ''}
                                onChange={(e) => updateContent('heading', e.target.value)}
                                className="w-full border border-gray-300 rounded-md px-3 py-2"
                                placeholder="Call to action heading"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Description
                            </label>
                            <textarea
                                value={section.content.description || ''}
                                onChange={(e) => updateContent('description', e.target.value)}
                                className="w-full border border-gray-300 rounded-md px-3 py-2"
                                rows={3}
                                placeholder="Description text"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Button Text
                            </label>
                            <input
                                type="text"
                                value={section.content.button_text || ''}
                                onChange={(e) => updateContent('button_text', e.target.value)}
                                className="w-full border border-gray-300 rounded-md px-3 py-2"
                                placeholder="Button text"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Button URL
                            </label>
                            <input
                                type="text"
                                value={section.content.button_url || ''}
                                onChange={(e) => updateContent('button_url', e.target.value)}
                                className="w-full border border-gray-300 rounded-md px-3 py-2"
                                placeholder="Button URL"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Button Style
                            </label>
                            <select
                                value={section.content.button_style || 'primary'}
                                onChange={(e) => updateContent('button_style', e.target.value)}
                                className="w-full border border-gray-300 rounded-md px-3 py-2"
                            >
                                <option value="primary">Primary</option>
                                <option value="secondary">Secondary</option>
                                <option value="outline">Outline</option>
                            </select>
                        </div>
                    </div>
                );

            case 'custom':
                return (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Custom HTML
                            </label>
                            <textarea
                                value={section.content.html || ''}
                                onChange={(e) => updateContent('html', e.target.value)}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 font-mono text-sm"
                                rows={10}
                                placeholder="Enter custom HTML code..."
                            />
                        </div>
                    </div>
                );

            default:
                return (
                    <div className="text-center py-8 text-gray-500">
                        Section type "{section.type}" not implemented yet
                    </div>
                );
        }
    };

    const renderSectionPreview = () => {
        switch (section.type) {
            case 'hero':
                return (
                    <div className="bg-gray-100 p-6 rounded-lg">
                        <h3 className="text-lg font-semibold">{section.content.title || 'Hero Title'}</h3>
                        <p className="text-gray-600">{section.content.subtitle || 'Hero subtitle'}</p>
                        {section.content.button_text && (
                            <button className="mt-2 px-4 py-2 bg-blue-600 text-white rounded">
                                {section.content.button_text}
                            </button>
                        )}
                    </div>
                );

            case 'text':
                return (
                    <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: section.content.content || 'Text content...' }} />
                );

            case 'image':
                return (
                    <div className="text-center">
                        {section.content.image_url ? (
                            <img
                                src={section.content.image_url}
                                alt={section.content.alt_text || ''}
                                className="max-w-full h-auto rounded"
                            />
                        ) : (
                            <div className="bg-gray-100 h-48 flex items-center justify-center rounded">
                                <span className="text-gray-500">No image selected</span>
                            </div>
                        )}
                        {section.content.caption && (
                            <p className="mt-2 text-sm text-gray-600">{section.content.caption}</p>
                        )}
                    </div>
                );

            case 'cta':
                return (
                    <div className="bg-blue-50 p-6 rounded-lg text-center">
                        <h3 className="text-lg font-semibold">{section.content.heading || 'Call to Action'}</h3>
                        <p className="text-gray-600 mt-2">{section.content.description || 'Description'}</p>
                        {section.content.button_text && (
                            <button className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg">
                                {section.content.button_text}
                            </button>
                        )}
                    </div>
                );

            default:
                return (
                    <div className="bg-gray-50 p-4 rounded text-center text-gray-600">
                        {section.type.charAt(0).toUpperCase() + section.type.slice(1)} Section
                    </div>
                );
        }
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="bg-white border border-gray-200 rounded-lg shadow-sm"
        >
            {/* Section Header */}
            <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    <div
                        {...attributes}
                        {...listeners}
                        className="cursor-grab active:cursor-grabbing p-1 text-gray-400 hover:text-gray-600"
                    >
                        <Bars3Icon className="h-5 w-5" />
                    </div>
                    <span className="font-medium text-gray-900">
                        {sectionTypes.find(type => type.type === section.type)?.name || section.type}
                    </span>
                </div>
                <div className="flex items-center space-x-2">
                    <button
                        onClick={() => setIsEditing(!isEditing)}
                        className={`p-1 rounded ${isEditing ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                        <PencilIcon className="h-4 w-4" />
                    </button>
                    <button
                        onClick={() => onDuplicate(section)}
                        className="p-1 text-gray-400 hover:text-gray-600"
                    >
                        <DocumentDuplicateIcon className="h-4 w-4" />
                    </button>
                    <button
                        onClick={() => onDelete(section.id)}
                        className="p-1 text-red-400 hover:text-red-600"
                    >
                        <TrashIcon className="h-4 w-4" />
                    </button>
                </div>
            </div>

            {/* Section Content */}
            <div className="p-4">
                {isEditing ? renderSectionEditor() : renderSectionPreview()}
            </div>

            {/* Media Library Modal */}
            <MediaLibrary
                isOpen={isMediaLibraryOpen}
                onClose={() => setIsMediaLibraryOpen(false)}
                onSelect={(file) => {
                    if (section.type === 'hero') {
                        updateContent('background_image', file.url);
                    } else if (section.type === 'image') {
                        updateContent('image_url', file.url);
                        updateContent('alt_text', file.alt_text || file.original_name);
                    }
                    setIsMediaLibraryOpen(false);
                }}
                fileTypes={['image/*']}
            />
        </div>
    );
}

export default function PageBuilder({ sections, onChange }: PageBuilderProps) {
    const [showAddSection, setShowAddSection] = useState(false);
    
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = useCallback((event: DragEndEvent) => {
        const { active, over } = event;

        if (active.id !== over?.id) {
            const oldIndex = sections.findIndex(section => section.id === active.id);
            const newIndex = sections.findIndex(section => section.id === over?.id);

            const newSections = arrayMove(sections, oldIndex, newIndex).map((section, index) => ({
                ...section,
                sort_order: index,
            }));

            onChange(newSections);
        }
    }, [sections, onChange]);

    const addSection = (type: string) => {
        const newSection: PageSection = {
            id: `section-${Date.now()}`,
            type,
            content: {},
            settings: {},
            sort_order: sections.length,
        };

        onChange([...sections, newSection]);
        setShowAddSection(false);
    };

    const updateSection = (updatedSection: PageSection) => {
        const newSections = sections.map(section =>
            section.id === updatedSection.id ? updatedSection : section
        );
        onChange(newSections);
    };

    const deleteSection = (sectionId: string) => {
        if (confirm('Are you sure you want to delete this section?')) {
            const newSections = sections
                .filter(section => section.id !== sectionId)
                .map((section, index) => ({
                    ...section,
                    sort_order: index,
                }));
            onChange(newSections);
        }
    };

    const duplicateSection = (section: PageSection) => {
        const newSection: PageSection = {
            ...section,
            id: `section-${Date.now()}`,
            sort_order: section.sort_order + 1,
        };

        const newSections = [
            ...sections.slice(0, section.sort_order + 1),
            newSection,
            ...sections.slice(section.sort_order + 1),
        ].map((s, index) => ({
            ...s,
            sort_order: index,
        }));

        onChange(newSections);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">Page Sections</h3>
                <button
                    onClick={() => setShowAddSection(!showAddSection)}
                    className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                    <PlusIcon className="h-4 w-4 mr-2" />
                    Add Section
                </button>
            </div>

            {/* Add Section Panel */}
            {showAddSection && (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-3">Choose a section type:</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {sectionTypes.map(({ type, name, description }) => (
                            <button
                                key={type}
                                onClick={() => addSection(type)}
                                className="p-3 text-left border border-gray-300 rounded-lg hover:border-indigo-500 hover:bg-white transition-colors"
                            >
                                <div className="font-medium text-gray-900">{name}</div>
                                <div className="text-sm text-gray-500 mt-1">{description}</div>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Sections List */}
            {sections.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg">
                    <PlusIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No sections</h3>
                    <p className="mt-1 text-sm text-gray-500">Get started by adding a section to your page.</p>
                    <div className="mt-6">
                        <button
                            onClick={() => setShowAddSection(true)}
                            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700"
                        >
                            <PlusIcon className="h-4 w-4 mr-2" />
                            Add Section
                        </button>
                    </div>
                </div>
            ) : (
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                >
                    <SortableContext
                        items={sections.map(section => section.id)}
                        strategy={verticalListSortingStrategy}
                    >
                        <div className="space-y-4">
                            {sections.map((section) => (
                                <SortableSection
                                    key={section.id}
                                    section={section}
                                    onUpdate={updateSection}
                                    onDelete={deleteSection}
                                    onDuplicate={duplicateSection}
                                />
                            ))}
                        </div>
                    </SortableContext>
                </DndContext>
            )}
        </div>
    );
}
