import React, { useRef, useEffect } from 'react';
import { Editor } from '@tinymce/tinymce-react';

interface WysiwygEditorProps {
    value: string;
    onChange: (content: string) => void;
    placeholder?: string;
    height?: number;
    disabled?: boolean;
    onInit?: () => void;
}

export default function WysiwygEditor({
    value,
    onChange,
    placeholder = 'Start writing...',
    height = 400,
    disabled = false,
    onInit
}: WysiwygEditorProps) {
    const editorRef = useRef<any>(null);

    const handleEditorChange = (content: string) => {
        onChange(content);
    };

    const editorConfig = {
        height,
        menubar: false,
        plugins: [
            'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
            'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
            'insertdatetime', 'media', 'table', 'help', 'wordcount', 'emoticons',
            'codesample', 'quickbars'
        ],
        toolbar: [
            'undo redo | blocks | bold italic forecolor | alignleft aligncenter alignright alignjustify',
            'bullist numlist outdent indent | removeformat | image media link | code codesample | help'
        ].join(' | '),
        content_style: `
            body { 
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif; 
                font-size: 14px;
                line-height: 1.6;
            }
            .mce-content-body {
                padding: 16px;
            }
        `,
        placeholder,
        branding: false,
        promotion: false,
        statusbar: false,
        resize: 'vertical',
        block_formats: 'Paragraph=p; Header 1=h1; Header 2=h2; Header 3=h3; Header 4=h4; Header 5=h5; Header 6=h6; Preformatted=pre',
        image_advtab: true,
        image_caption: true,
        image_description: false,
        image_dimensions: false,
        image_title: true,
        file_picker_types: 'image',
        file_picker_callback: (callback: any, value: any, meta: any) => {
            if (meta.filetype === 'image') {
                // Open media library modal
                window.dispatchEvent(new CustomEvent('open-media-library', {
                    detail: {
                        callback: (url: string, alt?: string) => {
                            callback(url, { alt: alt || '' });
                        },
                        type: 'image'
                    }
                }));
            }
        },
        setup: (editor: any) => {
            editor.on('init', () => {
                if (onInit) onInit();
            });
            
            // Custom shortcode buttons
            editor.ui.registry.addButton('shortcode_button', {
                text: 'Button',
                tooltip: 'Insert Button Shortcode',
                onAction: () => {
                    editor.windowManager.open({
                        title: 'Insert Button',
                        body: {
                            type: 'panel',
                            items: [
                                {
                                    type: 'input',
                                    name: 'text',
                                    label: 'Button Text'
                                },
                                {
                                    type: 'input',
                                    name: 'url',
                                    label: 'Button URL'
                                },
                                {
                                    type: 'selectbox',
                                    name: 'style',
                                    label: 'Button Style',
                                    items: [
                                        { text: 'Primary', value: 'primary' },
                                        { text: 'Secondary', value: 'secondary' },
                                        { text: 'Success', value: 'success' },
                                        { text: 'Danger', value: 'danger' }
                                    ]
                                }
                            ]
                        },
                        buttons: [
                            {
                                type: 'cancel',
                                text: 'Cancel'
                            },
                            {
                                type: 'submit',
                                text: 'Insert',
                                primary: true
                            }
                        ],
                        onSubmit: (api: any) => {
                            const data = api.getData();
                            const shortcode = `[button url="${data.url}" text="${data.text}" style="${data.style}"]`;
                            editor.insertContent(shortcode);
                            api.close();
                        }
                    });
                }
            });

            editor.ui.registry.addButton('shortcode_callout', {
                text: 'Callout',
                tooltip: 'Insert Callout Shortcode',
                onAction: () => {
                    editor.windowManager.open({
                        title: 'Insert Callout',
                        body: {
                            type: 'panel',
                            items: [
                                {
                                    type: 'selectbox',
                                    name: 'type',
                                    label: 'Callout Type',
                                    items: [
                                        { text: 'Info', value: 'info' },
                                        { text: 'Warning', value: 'warning' },
                                        { text: 'Error', value: 'error' },
                                        { text: 'Success', value: 'success' }
                                    ]
                                },
                                {
                                    type: 'input',
                                    name: 'title',
                                    label: 'Title (optional)'
                                },
                                {
                                    type: 'textarea',
                                    name: 'content',
                                    label: 'Content'
                                }
                            ]
                        },
                        buttons: [
                            {
                                type: 'cancel',
                                text: 'Cancel'
                            },
                            {
                                type: 'submit',
                                text: 'Insert',
                                primary: true
                            }
                        ],
                        onSubmit: (api: any) => {
                            const data = api.getData();
                            const titleAttr = data.title ? ` title="${data.title}"` : '';
                            const shortcode = `[callout type="${data.type}"${titleAttr}]${data.content}[/callout]`;
                            editor.insertContent(shortcode);
                            api.close();
                        }
                    });
                }
            });

            // Add shortcode buttons to toolbar
            editor.ui.registry.addMenuButton('shortcodes', {
                text: 'Shortcodes',
                fetch: (callback: any) => {
                    const items = [
                        {
                            type: 'menuitem',
                            text: 'Button',
                            onAction: () => editor.execCommand('mceInsertContent', false, '[button url="" text="" style="primary"]')
                        },
                        {
                            type: 'menuitem',
                            text: 'Callout',
                            onAction: () => editor.execCommand('mceInsertContent', false, '[callout type="info"]Content[/callout]')
                        },
                        {
                            type: 'menuitem',
                            text: 'Quote',
                            onAction: () => editor.execCommand('mceInsertContent', false, '[quote author="" source=""]Quote text[/quote]')
                        },
                        {
                            type: 'menuitem',
                            text: 'Highlight',
                            onAction: () => editor.execCommand('mceInsertContent', false, '[highlight text="highlighted text"]')
                        }
                    ];
                    callback(items);
                }
            });
        },
        quickbars_selection_toolbar: 'bold italic | quicklink h2 h3 blockquote',
        quickbars_insert_toolbar: 'quickimage quicktable',
        contextmenu: 'link image table',
        powerpaste_word_import: 'clean',
        powerpaste_html_import: 'clean',
    };

    return (
        <div className="wysiwyg-editor">
            <Editor
                ref={editorRef}
                value={value}
                onEditorChange={handleEditorChange}
                init={editorConfig}
                disabled={disabled}
            />
        </div>
    );
}
