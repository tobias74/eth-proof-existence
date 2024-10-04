import React, { useState } from 'react';
import { Tooltip } from './Tooltip';

interface AbbreviatedHexProps {
    value: string;
    label?: string;
}

export const AbbreviatedHex: React.FC<AbbreviatedHexProps> = ({ value, label }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(value);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const abbreviatedValue = `${value.slice(0, 6)}...${value.slice(-4)}`;

    return (
        <Tooltip content={copied ? 'Copied!' : 'Click to copy'}>
            <span
                onClick={handleCopy}
                className="inline-flex items-center space-x-1 cursor-pointer hover:bg-gray-100 rounded px-1"
            >
                {label && <span className="font-medium">{label}:</span>}
                <span className="font-mono text-sm">{abbreviatedValue}</span>
            </span>
        </Tooltip>
    );
};