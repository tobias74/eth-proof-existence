import React from 'react';
import { AccountConnector } from './elements/AccountConnector';

export const WagmiElements: React.FC = () => {
    return (
        <>
            <div className="hidden lg:block">
                <AccountConnector />
            </div>
            <div className="lg:hidden">
                <AccountConnector />
            </div>
        </>
    );
};