import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import { ChevronDownIcon, GlobeAltIcon } from '@heroicons/react/24/outline';
import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';

interface Language {
    code: string;
    name: string;
    native_name: string;
    flag?: string;
}

interface LanguageSwitcherProps {
    currentLocale: string;
    availableLanguages: Record<string, Language>;
    className?: string;
}

export default function LanguageSwitcher({ 
    currentLocale, 
    availableLanguages, 
    className = '' 
}: LanguageSwitcherProps) {
    const [isLoading, setIsLoading] = useState(false);

    const currentLanguage = availableLanguages[currentLocale];

    const handleLanguageSwitch = (locale: string) => {
        if (locale === currentLocale || isLoading) return;

        setIsLoading(true);
        
        router.post(route('language.switch'), {
            locale: locale,
            redirect: window.location.href
        }, {
            onFinish: () => setIsLoading(false),
            onError: () => setIsLoading(false)
        });
    };

    return (
        <Menu as="div" className={`relative inline-block text-left ${className}`}>
            <div>
                <Menu.Button className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:opacity-50">
                    <GlobeAltIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                    <span className="hidden sm:inline">
                        {currentLanguage?.native_name || currentLanguage?.name || currentLocale.toUpperCase()}
                    </span>
                    <span className="sm:hidden">
                        {currentLocale.toUpperCase()}
                    </span>
                    <ChevronDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </Menu.Button>
            </div>

            <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
            >
                <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="py-1">
                        {Object.entries(availableLanguages).map(([code, language]) => (
                            <Menu.Item key={code}>
                                {({ active }) => (
                                    <button
                                        onClick={() => handleLanguageSwitch(code)}
                                        disabled={isLoading || code === currentLocale}
                                        className={`
                                            ${active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'}
                                            ${code === currentLocale ? 'bg-gray-50 text-gray-500' : ''}
                                            group flex w-full items-center px-4 py-2 text-sm disabled:cursor-not-allowed
                                        `}
                                    >
                                        {language.flag && (
                                            <span className="mr-3 text-lg" role="img" aria-label={language.name}>
                                                {language.flag}
                                            </span>
                                        )}
                                        <div className="flex flex-col items-start">
                                            <span className="font-medium">{language.native_name}</span>
                                            {language.native_name !== language.name && (
                                                <span className="text-xs text-gray-500">{language.name}</span>
                                            )}
                                        </div>
                                        {code === currentLocale && (
                                            <span className="ml-auto text-xs text-green-600">●</span>
                                        )}
                                    </button>
                                )}
                            </Menu.Item>
                        ))}
                    </div>
                </Menu.Items>
            </Transition>
        </Menu>
    );
}
