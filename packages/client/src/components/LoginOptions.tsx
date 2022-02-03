import React from "react";
import MetaMaskIcon from "../assets/login-icons/metamask-icon.svg";
import WalletConnectIcon from "../assets/login-icons/wallet-connect-icon.svg";
import { IonModal, IonContent, IonPage, IonCard, IonButton, IonTitle, IonCardContent, IonMenuButton, IonGrid, IonRow, IonCol, IonHeader } from '@ionic/react';
import Login from "../pages/Login";
// import { ProviderType } from "iam-client-lib";
interface LoginOptionsProps {
    loginMethod: any
}


const LoginOptions = (props: LoginOptionsProps) => {
    const {loginMethod} = props;
    const handleSelectMetamask = async () => {
        console.log("selected Metamask")
        loginMethod();
        // const result = await login(ProviderType.MetaMask);
        // console.log(result, "THE RESULT!!!!!")
    }
    
    const handleSelectWalletConnect = async () => {
        console.log("selected Wallet Connect")
    }
    return (
        <IonContent>
            <IonHeader className="ion-padding">
                Login With Wallet
            </IonHeader>
            <IonGrid>
                <IonRow>
                    <IonCol>
                        <IonButton expand="block"
                            onClick={handleSelectMetamask}
                        >
                            <img
                                slot="start"
                                src={MetaMaskIcon}
                                alt="MetaMask Logo"
                                style={{
                                    height: "48px",
                                    width: "48px",
                                    margin: "10px"
                                }}
                            ></img>
                            <span>Login with MetaMask</span>
                        </IonButton>

                    </IonCol>
                    <IonCol>
                        <IonButton expand="block"
                            onClick={handleSelectWalletConnect}
                        >
                            <img
                                slot="start"
                                src={WalletConnectIcon}
                                alt="Wallet Connect Logo"
                            ></img>
                            <span>Login with WalletConnect</span>
                        </IonButton>

                    </IonCol>
                </IonRow>
            </IonGrid>


        </IonContent>
    )

}

export default LoginOptions