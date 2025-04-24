'use client'

import dynamic from 'next/dynamic'
import React from 'react';
import type { CesiumType } from '../types/cesium';

const CesiumDynamicComponent = dynamic(() => import('./CesiumComponent'), {
    ssr: false
});

export const CesiumWrapper:React.FunctionComponent = () => {
    const [CesiumJs, setCesiumJs] = React.useState<CesiumType | null>(null);
    
    React.useEffect(() => {
        if (CesiumJs !== null) return
        const CesiumImportPromise = import('cesium');
        CesiumImportPromise.then((CesiumModule) => {
            setCesiumJs(CesiumModule);
        });
    }, [CesiumJs]);

    return (
        CesiumJs ? <CesiumDynamicComponent CesiumJs={CesiumJs} /> : null
    )
}

export default CesiumWrapper;