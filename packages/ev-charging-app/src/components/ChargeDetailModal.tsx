import React from 'react';
import {
  IonModal,
  IonContent,
  IonButton,
  IonGrid,
  IonRow,
  IonCol,
} from '@ionic/react';
import StationHeader from './StationHeader';
import NavigationOptions from './NavigationOptions';
import styled from 'styled-components';
import strings from '../constants/strings.json';
import { ChargePoint } from '../App';

export interface Provider {
  name: string;
  id: number;
  logo?: string;
}

export interface DetailModalProps {
  selectedChargePoint?: ChargePoint;
  isOpen: boolean;
  handleStartCharge: () => void;
  showModal: (x: boolean) => void;
  setToken: (x: string) => void;
  setSelectedChargePoint: (x: ChargePoint | undefined) => void;
}

const StyledBorder = styled.hr`
  background-color: #b3bbc0;
  margin: 0;
`;
const SessionButton = styled(IonButton)`
  font-size: 16px;
  line-height: 20px;
  text-align: center;
  letter-spacing: 0.4px;
  --color: white;
`;

const Modal = styled(IonModal)`
  margin: 15px;
`;

const ChargePointDetailModal = (props: DetailModalProps) => {
  const {
    selectedChargePoint,
    isOpen,
    handleStartCharge,
    showModal,
    setSelectedChargePoint,
  } = props;
  const handleDismiss = () => {
    showModal(false);
    setSelectedChargePoint(undefined);
  };
  return (
    <div>
      {selectedChargePoint && (
        <Modal
          isOpen={isOpen}
          breakpoints={[0.1, 0.5, 1]}
          initialBreakpoint={0.45}
          onDidDismiss={handleDismiss}
          showBackdrop={false}
        >
          <IonContent>
            <StationHeader selectedChargePoint={selectedChargePoint} />
            <StyledBorder></StyledBorder>
            <NavigationOptions />
            <StyledBorder></StyledBorder>
            <IonGrid>
              <IonRow className="ion-padding">
                <IonCol>
                  <SessionButton
                    id="start-charging "
                    expand="block"
                    onClick={handleStartCharge}
                    color={'primary'}
                  >
                    {strings.requestStartCharging}
                  </SessionButton>
                </IonCol>
              </IonRow>
            </IonGrid>
          </IonContent>
        </Modal>
      )}
    </div>
  );
};

export default ChargePointDetailModal;
