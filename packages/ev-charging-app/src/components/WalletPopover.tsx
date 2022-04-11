import React from 'react';
import {
  IonPopover,
  IonContent,
  IonRow,
  IonCol,
  IonIcon,
  IonItem,
  IonImg,
  IonList,
  IonLabel,
  IonHeader,
  IonGrid,
} from '@ionic/react';
import styled from 'styled-components';
import WalletQRCode from '../assets/smallQRCode.png';
import EnergyWebIcon from '../assets/svgs/energyweb-logo.svg';
import { closeOutline, chevronForwardOutline } from 'ionicons/icons';
import strings from '../constants/strings.json';
const SupplierItem = styled(IonItem)`
  --inner-padding-bottom: 10px;
  --inner-padding-top: 10px;
`;

const StyledHeader = styled(IonHeader)`
  font-size: 15px;
  margin: 10px;
`;

const SupplierHeader = styled(IonHeader)`
  font-weight: normal;
  font-size: 21px;
  line-height: 25px;
`;

const StyledHeaderGrid = styled(IonGrid)`
  padding: 0;
`;

const RetailerLabel = styled(IonLabel)`
  margin: 0 0 0 10px;
  padding: 0;
  font-size: 12px;
  line-height: 18px;
`;
const RetailerLogoImg = styled(IonImg)`
  width: 20px;
`;
interface IWalletPopoverProps {
  isOpen: boolean;
  presentationDataEncoded?: string;
  handleWalletSelect: () => void;
  handleDismiss: () => void;
}
export interface IPresentationData {
  prentationLinkEncoded: string;
}

const WalletPopover = (props: IWalletPopoverProps) => {
  const { isOpen, handleWalletSelect, handleDismiss } = props;
  return (
    <>
      <IonPopover
        isOpen={isOpen}
        showBackdrop={true}
        onDidDismiss={handleDismiss}
      >
        <IonContent>
          <IonList
            style={{
              marginBottom: '20px',
            }}
          >
            <StyledHeaderGrid>
              <IonRow className="ion-padding">
                <IonCol size="1" className="ion-align-self-center">
                  <IonIcon
                    icon={closeOutline}
                    style={{
                      width: '16.33px',
                    }}
                    onClick={handleDismiss}
                  ></IonIcon>
                </IonCol>
                <IonCol className="ion-align-self-center">
                  <SupplierHeader>{strings.supplier}</SupplierHeader>
                </IonCol>
              </IonRow>
              <IonRow
                style={{
                  backgroundColor: 'rgba(179, 187, 192, 0.2)',
                }}
              >
                <IonCol className="ion-justify-content-start">
                  <StyledHeader>{strings.chooseSupplierMsg}</StyledHeader>
                </IonCol>
              </IonRow>
            </StyledHeaderGrid>
            <SupplierItem onClick={handleWalletSelect}>
              <IonGrid>
                <IonRow>
                  <IonCol
                    size="1"
                    className="ion-align-items-center ion-justify-content-start"
                  >
                    <RetailerLogoImg src={EnergyWebIcon}></RetailerLogoImg>
                  </IonCol>
                  <IonCol className="ion-align-items-center ion-justify-content-start">
                    <RetailerLabel className="ion-padding">
                      {strings.switchboard}
                    </RetailerLabel>
                  </IonCol>
                  <IonCol
                    size="2"
                    className="ion-align-items-center ion-justify-content-start"
                  >
                    <IonIcon icon={chevronForwardOutline}></IonIcon>
                  </IonCol>
                </IonRow>
              </IonGrid>
            </SupplierItem>
            <SupplierItem>
              <IonGrid>
                <IonRow>
                  <IonCol
                    size="1"
                    className="ion-align-items-center ion-justify-content-start"
                  >
                    <RetailerLogoImg src={WalletQRCode}></RetailerLogoImg>
                  </IonCol>
                  <IonCol className="ion-align-items-center ion-justify-content-start">
                    <RetailerLabel className="ion-padding">
                      {strings.scanQrCode}
                    </RetailerLabel>
                  </IonCol>
                  <IonCol
                    size="2"
                    className="ion-align-items-center ion-justify-content-start"
                  >
                    <IonIcon icon={chevronForwardOutline}></IonIcon>
                  </IonCol>
                </IonRow>
              </IonGrid>
            </SupplierItem>
          </IonList>
        </IonContent>
      </IonPopover>
    </>
  );
};

export default WalletPopover;
