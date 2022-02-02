import { IonContent, IonHeader, IonCard, IonPage, IonTitle, IonToolbar } from '@ionic/react';
interface CardProps  {
    chargePoint?: {
        id?: number,
        stationName?: string
    }
}
const ChargePointDetail: React.FC<CardProps> = (props: CardProps) => {
    const {chargePoint} = props;
  return (
    <IonPage>
      <IonHeader>
          <IonTitle>Charge Point Detail Page</IonTitle>
      </IonHeader>
      <IonContent fullscreen>
        <IonCard>
        <p>Station Id</p>
        <p>Station Name</p>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default ChargePointDetail;