import React, { useRef, useState, useEffect } from "react";
import ReactMapGL, { Layer, MapEvent, MapRef, Popup, Source, InteractiveMap } from "react-map-gl";
import { FeatureCollection } from "geojson";
import { IonPage } from '@ionic/react';  
import {
    MAP_BOX_TOKEN,
    CHG_POINTS_SOURCE_ID,
    CHG_POINTS_LAYER_ID,
    SOURCE_DATA_TYPE
} from "../constants/map-constants";
import { mockData } from "../constants/mock-data";
interface MapProps {
    setSelectedChargePoint: any
    selectedChargePoint?: any
}

const Map = (props: MapProps) => {
    const { setSelectedChargePoint, selectedChargePoint } = props;
    const [viewport, setViewport] = useState({
        latitude: 52.5200,
        longitude: 13.4050,
        zoom: 15,
        minZoom: 2.1,
        bearing: 0,
        pitch: 0,
        source: 'mapbox://styles/mapbox/streets-v11'
    });
    const interactiveLayerIds = [
        CHG_POINTS_LAYER_ID
    ]
    const mapRef = useRef<MapRef>(null);
    console.log(selectedChargePoint, "THE SELECTED CHARGE POINT!")

    const handleMapOnClick = (event: MapEvent) => {
        const map = mapRef.current;
        const features = map!.queryRenderedFeatures(event.point)
        console.log(features, "ARE THERE FEATURES")
        const selectedProperties = features?.[0];
        console.log(JSON.stringify(selectedProperties), "the properties")
        const { layer } = selectedProperties;
        const { id } = layer;
        console.log(id, "THE ID")
        if (id !== CHG_POINTS_LAYER_ID) {
            return
        }
        console.log(selectedProperties, "THE SELECTED")
        if (!selectedProperties) {
            return
        } else {
            const { properties } = selectedProperties;
            setSelectedChargePoint(properties)
        }
    }

    return (
        <IonPage>
            <div style={{
                display: "flex",
                flexDirection: "row",
                height: "100%",
            }}>
                <ReactMapGL
                    {...viewport}
                    ref={mapRef}
                    mapboxApiAccessToken={MAP_BOX_TOKEN}
                    width="100%"
                    height="100%"
                    onClick={handleMapOnClick}
                    interactiveLayerIds={interactiveLayerIds}
                    onViewportChange={setViewport}
                >
                    <div>
                        <Source
                            type={SOURCE_DATA_TYPE}
                            id={CHG_POINTS_SOURCE_ID}
                            data={mockData as FeatureCollection}
                        >
                            <div>
                                <Layer
                                    id={CHG_POINTS_LAYER_ID}
                                    source={CHG_POINTS_SOURCE_ID}
                                    type="circle"
                                    paint={{
                                        "circle-radius": [
                                            "case",
                                            ["boolean",
                                                ["feature-state", "hover"],
                                                false
                                            ],
                                            15, // on hover
                                            10
                                        ],
                                        "circle-blur": [
                                            "case",
                                            ["boolean",
                                                ["feature-state", "hover"],
                                                false
                                            ],
                                            0.5, // on hover
                                            0
                                        ],
                                        "circle-color": "#007cbf",
                                        "circle-stroke-width": 2,
                                        "circle-stroke-color": "#fff",
                                    }}

                                ></Layer>
                            </div>
                        </Source>
                    </div>
                </ReactMapGL>
            </div>
        </IonPage>
    )
}

export default React.memo(Map);