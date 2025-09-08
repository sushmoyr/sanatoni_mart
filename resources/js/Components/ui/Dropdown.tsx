import React, { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { Link } from '@inertiajs/react';
import { cn } from '@/lib/utils';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

interface DropdownItem {
    label?: string;
    href?: string;
    onClick?: () => void;
    icon?: React.ReactNode;
    disabled?: boolean;
    separator?: boolean;
}

interface DropdownProps {
    trigger: React.ReactNode;
    items: DropdownItem[];
    align?: 'left' | 'right';
    className?: string;
}

export const Dropdown = ({ trigger, items, align = 'left', className }: DropdownProps) => {
    return (
        <Menu as="div" className={cn("relative inline-block text-left", className)}>
            <Menu.Button as="div">
                {trigger}
            </Menu.Button>

            <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
            >
                <Menu.Items 
                    className={cn(
                        "absolute z-10 mt-2 w-56 rounded-md bg-white shadow-e3 ring-1 ring-semantic-border focus:outline-none",
                        align === 'right' ? 'right-0 origin-top-right' : 'left-0 origin-top-left'
                    )}
                >
                    <div className="py-1">
                        {items.map((item, index) => {
                            if (item.separator) {
                                return (
                                    <div key={`separator-${index}`} className="border-t border-semantic-border my-1" />
                                );
                            }

                            return (
                                <Menu.Item key={item.label || `item-${index}`} disabled={item.disabled}>
                                    {({ active, disabled }) => {
                                        const content = (
                                            <div className={cn(
                                                "flex items-center px-4 py-2 text-sm",
                                                active && !disabled ? 'bg-brand-50 text-brand-700' : 'text-semantic-text',
                                                disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                                            )}>
                                                {item.icon && (
                                                    <span className="mr-3 flex-shrink-0">
                                                        {item.icon}
                                                    </span>
                                                )}
                                                {item.label}
                                            </div>
                                        );

                                        if (item.href && !disabled) {
                                            return (
                                                <Link href={item.href}>
                                                    {content}
                                                </Link>
                                            );
                                        }

                                        return (
                                            <button
                                                className="w-full text-left"
                                                onClick={item.onClick}
                                                disabled={disabled}
                                            >
                                                {content}
                                            </button>
                                        );
                                    }}
                                </Menu.Item>
                            );
                        })}
                    </div>
                </Menu.Items>
            </Transition>
        </Menu>
    );
};

interface DropdownTriggerProps {
    children: React.ReactNode;
    showChevron?: boolean;
    className?: string;
}

export const DropdownTrigger = ({ children, showChevron = true, className }: DropdownTriggerProps) => (
    <div className={cn("flex items-center cursor-pointer", className)}>
        {children}
        {showChevron && (
            <ChevronDownIcon className="ml-1 h-4 w-4 text-semantic-textSub" />
        )}
    </div>
);
