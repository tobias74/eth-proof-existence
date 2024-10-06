import { Fragment, ReactNode } from 'react';
import { Disclosure } from '@headlessui/react';
import { DisclosureButton, DisclosurePanel } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
import { LanguageSelector } from './elements/LanguageSelector';
import { useTranslation } from 'react-i18next';
import { WagmiElements } from './WagmiElements';

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ');
}

const Layout: React.FC<{
    children: ReactNode;
    wagmiEnabled: boolean;
}> = ({ children, wagmiEnabled }) => {
    const { t } = useTranslation();

    const navigation = [
        { name: t('about'), href: '/about' },
        { name: t('imprint'), href: '/imprint' },
        { name: t('privacy'), href: '/privacy' },
    ];

    return (
        <div className="min-h-screen flex flex-col">
            <Disclosure as="nav" className="bg-gray-800">
                {({ open }) => (
                    <>
                        <div className="w-full px-4">
                            <div className="relative flex items-center justify-between h-16">
                                <div className="absolute inset-y-0 left-0 flex items-center lg:hidden">
                                    <DisclosureButton className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                                        <span className="sr-only">Open main menu</span>
                                        {open ? (
                                            <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                                        ) : (
                                            <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                                        )}
                                    </DisclosureButton>
                                </div>
                                <div className="flex-1 flex items-center justify-center lg:items-stretch lg:justify-start">
                                    <div className="hidden lg:flex items-center mr-4">
                                        <LanguageSelector />
                                    </div>
                                    <div className="flex-shrink-0 flex items-center">
                                        <Link to={'/'} className="text-white text-lg font-bold">
                                            documented.me
                                        </Link>
                                    </div>
                                    <div className="hidden lg:block lg:ml-6">
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
                                <div className="absolute inset-y-0 right-0 flex items-center pr-2 lg:static lg:inset-auto lg:ml-6 lg:pr-0">
                                    <div className="lg:hidden">
                                        <LanguageSelector />
                                    </div>
                                    <div className="hidden lg:block">
                                        {wagmiEnabled && <WagmiElements />}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <DisclosurePanel className="lg:hidden">
                            <div className="px-2 pt-2 pb-3 space-y-1">
                                {navigation.map((item) => (
                                    <DisclosureButton
                                        key={item.name}
                                        as={Link}
                                        to={item.href}
                                        className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                                    >
                                        {item.name}
                                    </DisclosureButton>
                                ))}
                            </div>
                            {wagmiEnabled && (
                                <div className="px-2 pt-2 pb-3 border-t border-gray-700">
                                    <WagmiElements />
                                </div>
                            )}
                        </DisclosurePanel>
                    </>
                )}
            </Disclosure>

            <main className="flex-grow w-full px-4 lg:px-6 xl:px-8 bg-gray-100">
                <div className="max-w-2xl mx-auto p-4">
                    {children}
                </div>
            </main>

            <footer className="bg-gray-800 text-gray-300 py-4 mt-auto">
                <div className="w-full text-center">
                    <p>Made by <a target="_blank" href="https://tobiga.com" className="text-gray-300 no-underline hover:text-gray-100 transition duration-150 ease-in-out">tobiga UG (haftungsbeschränkt)</a></p>
                </div>
            </footer>
        </div>
    );
};

export default Layout;