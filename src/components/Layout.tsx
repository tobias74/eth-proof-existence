import { Fragment, ReactNode } from 'react';
import { Disclosure, Menu, Transition } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
import { AccountConnector } from './elements/AccountConnector';
import { LanguageSelector } from './elements/LanguageSelector';
import { useTranslation } from 'react-i18next';

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ');
}

interface LayoutProps {
    children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    const { t } = useTranslation();

    const navigation = [
        { name: t('home'), href: '/' },
        { name: t('about'), href: '/about' },
    ];

    return (
        <div className="min-h-screen flex flex-col">
            <Disclosure as="nav" className="bg-gray-800">
                {({ open }) => (
                    <>
                        <div className="w-full px-4">
                            <div className="relative flex items-center justify-between h-16">
                                <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                                    <Disclosure.Button className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                                        <span className="sr-only">Open main menu</span>
                                        {open ? (
                                            <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                                        ) : (
                                            <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                                        )}
                                    </Disclosure.Button>
                                </div>
                                <div className="flex-1 flex items-center justify-between sm:items-stretch sm:justify-start">
                                    <div className="flex-shrink-0 flex items-center">
                                        <span className="text-white text-lg font-bold">{t('fileNotarizer')}</span>
                                    </div>
                                    <div className="hidden sm:block sm:ml-6">
                                        <div className="flex space-x-4">
                                            {navigation.map((item) => (
                                                <Link
                                                    key={item.name}
                                                    to={item.href}
                                                    className={classNames(
                                                        'text-gray-300 hover:bg-gray-700 hover:text-white',
                                                        'px-3 py-2 rounded-md text-sm font-medium'
                                                    )}
                                                >
                                                    {item.name}
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                                    <div className="mr-3">
                                        <LanguageSelector />
                                    </div>
                                    <AccountConnector />
                                </div>
                            </div>
                        </div>

                        <Disclosure.Panel className="sm:hidden">
                            <div className="px-2 pt-2 pb-3 space-y-1">
                                {navigation.map((item) => (
                                    <Disclosure.Button
                                        key={item.name}
                                        as={Link}
                                        to={item.href}
                                        className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                                    >
                                        {item.name}
                                    </Disclosure.Button>
                                ))}
                            </div>
                        </Disclosure.Panel>
                    </>
                )}
            </Disclosure>

            <main className="flex-grow w-full px-4 sm:px-6 lg:px-8">{children}</main>

            <footer className="bg-gray-800 text-gray-300 py-4 mt-auto">
                <div className="w-full text-center">
                    <p>&copy; 2024 Your Company. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};

export default Layout;