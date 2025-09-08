import React, { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { Button } from './Button';
import { cn } from '@/lib/utils';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
    size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
    showCloseButton?: boolean;
    className?: string;
}

const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg', 
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-full mx-4'
};

export const Modal = ({
    isOpen,
    onClose,
    title,
    children,
    size = 'md',
    showCloseButton = true,
    className
}: ModalProps) => {
    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel 
                                className={cn(
                                    "w-full transform overflow-hidden rounded-lg bg-white text-left align-middle shadow-e3 transition-all",
                                    sizeClasses[size],
                                    className
                                )}
                            >
                                {(title || showCloseButton) && (
                                    <div className="flex items-center justify-between p-6 border-b border-semantic-border">
                                        {title && (
                                            <Dialog.Title
                                                as="h3"
                                                className="text-lg font-serif font-semibold text-semantic-text"
                                            >
                                                {title}
                                            </Dialog.Title>
                                        )}
                                        {showCloseButton && (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={onClose}
                                                className="p-2 -mr-2"
                                            >
                                                <XMarkIcon className="h-5 w-5" />
                                                <span className="sr-only">Close</span>
                                            </Button>
                                        )}
                                    </div>
                                )}
                                
                                <div className={cn(
                                    "p-6",
                                    !title && !showCloseButton && "pt-6"
                                )}>
                                    {children}
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
};

interface ModalHeaderProps {
    children: React.ReactNode;
    className?: string;
}

export const ModalHeader = ({ children, className }: ModalHeaderProps) => (
    <div className={cn("mb-4", className)}>
        {children}
    </div>
);

interface ModalBodyProps {
    children: React.ReactNode;
    className?: string;
}

export const ModalBody = ({ children, className }: ModalBodyProps) => (
    <div className={cn("mb-6", className)}>
        {children}
    </div>
);

interface ModalFooterProps {
    children: React.ReactNode;
    className?: string;
}

export const ModalFooter = ({ children, className }: ModalFooterProps) => (
    <div className={cn("flex justify-end space-x-3 pt-4 border-t border-semantic-border", className)}>
        {children}
    </div>
);
