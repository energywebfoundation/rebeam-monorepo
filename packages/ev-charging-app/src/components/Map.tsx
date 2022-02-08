import React, { useRef, useState } from "react";
import ReactMapGL, { Layer, MapEvent, MapRef, Source } from "react-map-gl";
import { FeatureCollection } from "geojson";
import { IonPage } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import getChargingPoints from '../hooks/getChargingPoints';
import ChargePointDetailModal from "./ChargeDetailModal";
import styled from "styled-components";
import { ChargePoint } from "../App";
import {
    MAP_BOX_TOKEN,
    CHG_POINTS_SOURCE_ID,
    CHG_POINTS_LAYER_ID,
    SOURCE_DATA_TYPE
} from "../constants/map-constants";

interface MapProps {
    setSelectedChargePoint: any;
    selectedChargePoint?: ChargePoint
}

const MapContainer = styled.div`
display: flex;
flex-direction: row;
height: 100%;
`

const Map = (props: MapProps) => {
    //history for react router:
    const history = useHistory();
    const { setSelectedChargePoint, selectedChargePoint } = props;
    const [showModal, setShowModal] = useState(false)
    const [viewport, setViewport] = useState({
        latitude: 52.5200,
        longitude: 13.4050,
        zoom: 15,
        minZoom: 2.1,
        bearing: 0,
        pitch: 0,
        source: 'mapbox://styles/mapbox/streets-v11'
    });
    const { chargePoints } = getChargingPoints();
    const mapRef = useRef<MapRef>(null);
    const handleStartCharge = () => {
        setShowModal(false);
        history.push('/charge');
    }
    const handleMapOnClick = (event: MapEvent) => {
        event.preventDefault();
        const map = mapRef.current;
        if (map) {
            const features = map.queryRenderedFeatures(event.point)
            const selectedProperties = features?.[0];
            const { layer } = selectedProperties;
            const { id } = layer;
            if (id !== CHG_POINTS_LAYER_ID) {
                return
            }
            if (!selectedProperties) {
                return
            } else {
                const { properties } = selectedProperties;
                setSelectedChargePoint(properties)
                setShowModal(true)
            }
        } else {
            return;
        }
    }

    return (
        <IonPage>
            <MapContainer>
                <ReactMapGL
                    {...viewport}
                    ref={mapRef}
                    mapboxApiAccessToken={MAP_BOX_TOKEN}
                    width="100%"
                    height="100%"
                    onClick={handleMapOnClick}
                    interactiveLayerIds={[CHG_POINTS_LAYER_ID]}
                    onViewportChange={setViewport}
                >
                    {chargePoints && (
                        <div>
                            <Source
                                type={SOURCE_DATA_TYPE}
                                id={CHG_POINTS_SOURCE_ID}
                                data={chargePoints as FeatureCollection}
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
                                            "circle-color": "#A466FF",
                                            "circle-stroke-width": 2,
                                            "circle-stroke-color": "#fff",
                                        }}

                                    ></Layer>
                                </div>
                            </Source>
                        </div>

                    )}
                </ReactMapGL>
                {selectedChargePoint && (
                    <ChargePointDetailModal selectedChargePoint={selectedChargePoint} isOpen={showModal} handleStartCharge={handleStartCharge} showModal={setShowModal} />
                )}
                    
            </MapContainer>
        </IonPage>
    )
}

export default React.memo(Map);