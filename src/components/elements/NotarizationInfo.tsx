import React from 'react';

export const NotarizationInfo: React.FC<{
    blockNumber: bigint | undefined;
    miningTime: string | undefined;
    isNotarized: boolean;
}> = ({ blockNumber, miningTime, isNotarized }) => {
    if (!isNotarized) {
        return (
            <div className="mt-4 p-4 bg-gray-100 rounded">
                <p>File has not been notarized yet.</p>
            </div>
        );
    }

    return (
        <div className="mt-4 p-4 bg-gray-100 rounded">
            <p>
                File was notarized at block {blockNumber?.toString()}
                {miningTime && `, mined on ${miningTime}`}
            </p>
        </div>
    );
};
