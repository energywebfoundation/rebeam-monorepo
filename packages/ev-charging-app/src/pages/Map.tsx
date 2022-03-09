import React, { useRef, useState } from 'react';
import ReactMapGL, { Layer, MapEvent, MapRef, Source } from 'react-map-gl';
import { FeatureCollection } from 'geojson';
import { IonPage, IonLoading, IonContent } from '@ionic/react';
import getChargingPoints from '../hooks/getChargingPoints';
import ChargePointDetailModal from '../components/ChargeDetailModal';
import strings from '../constants/strings.json';
import styled from 'styled-components';
import { ChargePoint } from '../App';
import {
  CHG_POINTS_SOURCE_ID,
  CHG_POINTS_LAYER_ID,
  SOURCE_DATA_TYPE,
} from '../constants/map-constants';
import WalletPopover from '../components/WalletPopover';
import axios from 'axios';
import usePollForPresentationData from '../hooks/usePollForPresentationData';
interface MapProps {
  setSelectedChargePoint: (x: ChargePoint | undefined) => void;
  selectedChargePoint?: ChargePoint;
  setToken: (x: string) => void;
  token?: string;
}

export interface IPresentationData {
  prentationLinkEncoded: string;
}

const MapContainer = styled.div`
  display: flex;
  flex-direction: row;
  height: 100%;
`;

const Map = (props: MapProps) => {
  const { setSelectedChargePoint, selectedChargePoint, setToken, token } =
    props;
  const [supplierModalOpen, setSupplierModalOpen] = useState(false);
  const [showChargeStationModal, setShowChargeStationModal] = useState(false);
  const [viewport, setViewport] = useState({
    latitude: 52.54154,
    longitude: 13.38588,
    zoom: 15,
    minZoom: 2.1,
    bearing: 0,
    pitch: 0,
    source: 'mapbox://styles/mapbox/streets-v11',
  });
  const { chargePoints, loadingChargePoints, setLoadingChargePoints } =
    getChargingPoints();
  const mapRef = useRef<MapRef>(null);
  const {presentation, chargeProcessLoading, setChargeProcessLoading} = usePollForPresentationData(setSupplierModalOpen)

  const handleStartCharge = async () => {
    ///FIX THIS LOGIC
    if (!token) {
      let evseParsed;
      if (selectedChargePoint?.evses) {
        evseParsed = JSON.parse(selectedChargePoint?.evses);
        const selectedChargePointData = {
          locationId: selectedChargePoint?.id,
          evseId: evseParsed[0].uid,
        };
        const result = await axios.post(
          `${process.env.REACT_APP_BACKEND_URL}charge/initiate`,
          selectedChargePointData
        );
        const { data } = result;
        const { ocpiToken } = data;
        if (ocpiToken) {
          console.log(ocpiToken, 'post this to swagger');
          //Set the token to state:
          setToken(ocpiToken);
          //Save data to local storage:
          localStorage.setItem('ocpiToken', ocpiToken);
          //Start loading indicator:
          setChargeProcessLoading(true);
        }
      } else {
        throw new Error('NO EVSE FOR SELECTED LOCATION');
      }
    } else {
      setSupplierModalOpen(true);
    }
  };
  const handleMapOnClick = (event: MapEvent) => {
    event.preventDefault();
    const map = mapRef.current;
    if (map) {
      const features = map.queryRenderedFeatures(event.point);
      const selectedProperties = features?.[0];
      const { layer } = selectedProperties;
      const { id } = layer;
      if (id !== CHG_POINTS_LAYER_ID) {
        return;
      }
      if (!selectedProperties) {
        return;
      } else {
        const { properties } = selectedProperties;
        setSelectedChargePoint(properties);
        setShowChargeStationModal(true);
      }
    } else {
      return;
    }
  };

  return (
    <IonPage>
      <IonContent>
        <IonLoading
          isOpen={chargeProcessLoading}
          message={strings.requestingChargeLoader}
          onDidDismiss={() => setChargeProcessLoading(false)}
        />
        <IonLoading
          isOpen={loadingChargePoints}
          message={'Fetching Charge Points'}
          onDidDismiss={() => setLoadingChargePoints(false)}
        />
        <MapContainer>
          {!loadingChargePoints && (
            <ReactMapGL
              {...viewport}
              ref={mapRef}
              mapboxApiAccessToken={process.env.REACT_APP_MAP_BOX_TOKEN}
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
                          'circle-radius': [
                            'case',
                            ['boolean', ['feature-state', 'hover'], false],
                            15, // on hover
                            10,
                          ],
                          'circle-blur': [
                            'case',
                            ['boolean', ['feature-state', 'hover'], false],
                            0.5, // on hover
                            0,
                          ],
                          'circle-color': '#A466FF',
                          'circle-stroke-width': 2,
                          'circle-stroke-color': '#fff',
                        }}
                      ></Layer>
                    </div>
                  </Source>
                </div>
              )}
            </ReactMapGL>
          )}

          {selectedChargePoint && (
            <ChargePointDetailModal
              selectedChargePoint={selectedChargePoint}
              isOpen={showChargeStationModal}
              handleStartCharge={handleStartCharge}
              showModal={setShowChargeStationModal}
              setToken={setToken}
              setSelectedChargePoint={setSelectedChargePoint}
            />
          )}
          {presentation && (
            <WalletPopover
              isOpen={supplierModalOpen}
              presentationDataEncoded={presentation}
              setSupplierModal={setSupplierModalOpen}
            />
          )}
        </MapContainer>
      </IonContent>
    </IonPage>
  );
};

export default React.memo(Map);
