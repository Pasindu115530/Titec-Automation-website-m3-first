"use client";

import React from 'react';
import { Map, APIProvider, AdvancedMarker, Pin } from "@vis.gl/react-google-maps";

export default function MapSection() {
    const defaultCenter = {
        lat: 7.183163519396652,
        lng: 79.93233839777095
    };

    return (
        <section className='w-full h-[75vh]'>
            <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''}>
                <Map
                    defaultCenter={defaultCenter}
                    defaultZoom={13}
                    mapId={process.env.NEXT_PUBLIC_MAP_ID}
                >
                    <AdvancedMarker
                        key={'TiTec_Location'}
                        position={defaultCenter}
                        title={"Titec Automation"}>
                        <Pin background={'red'} glyphColor={'#000'} borderColor={'#000'} />
                    </AdvancedMarker>
                </Map>
            </APIProvider>
        </section>
    );
}
