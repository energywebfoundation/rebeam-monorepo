import React from "react";
import { IonModal, IonContent, IonPage, IonCard, IonButton, IonTitle, IonCardContent, IonMenuButton } from '@ionic/react';
interface CardProps  {
    chargePoint: {
        id: number,
        stationName: string
    },
    dismissChargePoint: () => void
}
const Modal = (props: CardProps) => {
    const {chargePoint, dismissChargePoint} = props;
    return (
        <IonPage>
        <IonContent>
          <IonModal
            isOpen={!!chargePoint}
            swipeToClose={true}
            presentingElement={undefined}
            onDidDismiss={dismissChargePoint}>
            <IonMenuButton>
            {/* <ion-icon name="close-circle-outline"></ion-icon> */}
            </IonMenuButton>
            <p>{`Charge Point ID: ${chargePoint.id}`}</p>
            <p>{`Charge Point Station: ${chargePoint.stationName}`}</p>
          </IonModal>
        </IonContent>
      </IonPage>
    )

}

export default Modal