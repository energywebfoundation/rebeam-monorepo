import { IonContent, IonAccordionGroup, IonAccordion, IonItem, IonLabel, IonList, IonPage, IonImg } from '@ionic/react';
import { arrowDownCircle } from 'ionicons/icons';
import { ReactChild, ReactFragment, ReactPortal, useRef } from 'react';
import {Provider} from "../pages/ChargePointDetail";

interface RetailerDropdownProps {
    retailers: any,
    loadingRetailers: boolean,
    selectedProvider?: Provider,
    setSelectedProvider?: any
}




const RetailerDropdown: React.FC<RetailerDropdownProps> = (props: RetailerDropdownProps) => {
    const { retailers, loadingRetailers, setSelectedProvider } = props;
    console.log(JSON.stringify(retailers), "WHAT IS THE SHAPE?")
    const accordionGroupRef = useRef(null);
    // const logAccordionValue = () => {
    //     if (accordionGroupRef.current) {
    //       console.log(accordionGroupRef.current);
    //     }
    //   }
    //   const closeAccordion = () => {
    //     if (accordionGroupRef.current && accordionGroupRef.current.value) {
    //       accordionGroupRef.current
    //     }
    //   }
    const handleSelectProvider = (provider: any) => {
        console.log("in handle select!!!")
        console.log(provider)
        setSelectedProvider(provider)
    }
    return (
        <div style={{
            height: "200px"
        }} className="ion-padding ion-text-center">
            Select a Provider
            <IonAccordionGroup value="retailers" ref={accordionGroupRef}>
                <IonAccordion value="providers">
                    <IonItem slot="header">
                        <IonLabel className="ion-padding ion-text-center">
                            Providers
                        </IonLabel>
                    </IonItem>
                    <IonList slot="content">
                        {retailers?.map((retailer: { id: { toString: () => string | undefined; }; logo: string | undefined; name: boolean | ReactChild | ReactFragment | ReactPortal | null | undefined; }, index: number) =>
                        (
                            <IonItem key={index} onClick={() => handleSelectProvider(retailer)}>
                                {retailer.logo && (
                                    <IonImg src={retailer.logo} style={{
                                        height: "20px"
                                    }}></IonImg>
                                )}
                                <IonLabel className="ion-padding">{retailer.name}</IonLabel>
                            </IonItem>
                        )
                        )}
                    </IonList>
                </IonAccordion>
            </IonAccordionGroup>

        </div>
    );
};

export default RetailerDropdown;