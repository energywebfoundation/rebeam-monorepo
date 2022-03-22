import React, { useRef, useState } from 'react';
import ReactMapGL, { MapRef, Marker } from 'react-map-gl';
import { IonPage, IonLoading, IonContent } from '@ionic/react';
import getChargingPoints from '../hooks/getChargingPoints';
import ChargePointDetailModal from '../components/ChargeDetailModal';
import strings from '../constants/strings.json';
import styled from 'styled-components';
import { ChargePoint } from '../App';
import MapPin from '../assets/MapPin.png';
import MapPinSelected from '../assets/MapPinSelected.png';
import WalletPopover from '../components/WalletPopover';
import axios from 'axios';
import usePollForPresentationData from '../hooks/usePollForPresentationData';
import {LocationProperties} from "../hooks/getChargingPoints";
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
  const { presentation, chargeProcessLoading, setChargeProcessLoading } =
    usePollForPresentationData(setSupplierModalOpen);

  const handleStartCharge = async () => {
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

  const handleMarkerClick = (properties: LocationProperties) => {
    setSelectedChargePoint(properties);
    setShowChargeStationModal(true);
  };

  const determineIsSelected = (selectedId: string) => {
    if (!selectedChargePoint) {
      return false;
    }
    return selectedId === selectedChargePoint.id;
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
              onViewportChange={setViewport}
            >
              {chargePoints &&
                chargePoints.features.map((cp, i) => {
                  const isSelected = determineIsSelected(cp.properties.id);
                  return (
                    <Marker
                      key={i}
                      longitude={cp.geometry.coordinates[0]}
                      latitude={cp.geometry.coordinates[1]}
                      offsetLeft={-20}
                      offsetTop={-10}
                    >
                      <img
                        src={isSelected ? MapPinSelected : MapPin}
                        style={{
                          height: '40px',
                        }}
                        onClick={() => handleMarkerClick(cp.properties)}
                      />
                    </Marker>
                  );
                })}
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
