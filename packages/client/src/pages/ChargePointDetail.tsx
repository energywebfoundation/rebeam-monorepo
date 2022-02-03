import { IonContent, IonHeader, IonCard, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { RouteComponentProps } from "react-router-dom";

interface ChargePointDetailProps
  extends RouteComponentProps<{
    id: string;
  }> {
  chargePoint: {
    id: number,
    stationName: string
  }

}
const ChargePointDetail: React.FC<ChargePointDetailProps> = (props: ChargePointDetailProps) => {
  const {match} = props;
  console.log(match, "IS THERE A MATCH? ")
  const { chargePoint } = props;
  const {id, stationName} = chargePoint;
  return (
    <IonPage>
      <IonHeader>
        <IonTitle>Charge Point Detail Page</IonTitle>
      </IonHeader>
      <IonContent fullscreen>
        <IonCard>
          <p>Station Id: {id}</p>
          <p>Station Name {stationName}</p>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default ChargePointDetail;