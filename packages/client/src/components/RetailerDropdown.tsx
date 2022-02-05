import { IonContent, IonAccordionGroup, IonAccordion, IonIcon, IonItem, IonRow, IonCol, IonLabel, IonList, IonPage, IonImg, IonGrid } from '@ionic/react';
import { arrowDownCircle } from 'ionicons/icons';
import { ReactChild, ReactFragment, ReactPortal, useRef } from 'react';
import { Provider } from "../pages/ChargePointDetail";
import strings from "../constants/strings.json";
import { logoElectron } from "ionicons/icons";
import styled from "styled-components";
import Selected from "../assets/Selected.png";

interface RetailerDropdownProps {
    retailers: any,
    loadingRetailers: boolean,
    selectedProvider?: Provider,
    setSelectedProvider?: any
}

const ImgContainer = styled(IonCol)`
display: flex;
justify-content: center
align-items: center
flex-direction: column
align-content: center
`


const RetailerDropdown: React.FC<RetailerDropdownProps> = (props: RetailerDropdownProps) => {
    const { retailers, loadingRetailers, setSelectedProvider, selectedProvider } = props;
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
        console.log(provider)
        setSelectedProvider(provider)
    }

    const SelectSupplierHeader = styled.p`
    font-size: 16px;
    line-height: 19px;
    margin: 0;
    padding: 0px;
    color: #363636;;
    `

    const SelectSupplierSubHeader = styled.p`
    font-size: 16px;
    line-height: 19px;
    margin: 0;
    color: #363636;;
    font-size: 12px;
    line-height: 18px;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    
    `

    const RetailerLabel = styled(IonLabel)`
    margin: 2px;
    padding: 5px 5px 5px 10px;
    `


    return (
        <div className="ion-padding ion-text-center">
            <IonAccordionGroup value="retailers" ref={accordionGroupRef}>
                <IonAccordion value="providers">
                    <IonItem slot="header">
                        <IonGrid>
                            <IonRow>
                                <IonCol class="ion-align-self-center" size="2">
                                        <IonIcon icon={logoElectron}></IonIcon>
                                </IonCol>
                                <IonCol>
                                    <IonGrid>
                                        <IonRow>
                                            <IonCol>
                                                <SelectSupplierHeader>
                                                    {selectedProvider ? selectedProvider.name : strings.selectSupplier}
                                                </SelectSupplierHeader>
                                            </IonCol>
                                        </IonRow>
                                        <IonRow>
                                            <IonCol>
                                            <SelectSupplierSubHeader>
                                            {strings.supplier}
                                            </SelectSupplierSubHeader>
                                                
                                                </IonCol>
                                        </IonRow>
                                    </IonGrid>
                                </IonCol>
                            </IonRow>
                        </IonGrid>
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
                                <RetailerLabel className="ion-padding">{retailer.name}</RetailerLabel>
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