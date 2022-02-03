import { IonContent, IonHeader, IonPage, IonTitle } from '@ionic/react';
import LoginOptions from '../components/LoginOptions';
// import {
//     initWithEKC,
//     initWithGnosis,
//     initWithMetamask,
//     initWithPrivateKeySigner,
//     initWithWalletConnect,
//     ProviderType,
//     setCacheConfig,
//     setChainConfig,
//     SignerService,
// } from "iam-client-lib";

interface LoginProps {
    setDid: (did: string) => void
}
const Login = (props: LoginProps) => {
    const { setDid } = props;

    // const initSignerService = async function (providerType: ProviderType) {
    //     switch (providerType) {
    //         case ProviderType.MetaMask:
    //             return initWithMetamask();
    //         case ProviderType.WalletConnect:
    //             return initWithWalletConnect();
    //         default:
    //             throw new Error(`no handler for provider '${providerType}'`);
    //     }
    // };

    const loginMethod = async () => {
        console.log("logging in!")
        setDid("didstring")
    }

    // const login = async function ({
    //     providerType,
    // }: {
    //     providerType: ProviderType;
    // }) {
    //     // setLoading(true);
    //     // setErrored(false);
    //     // setUnauthorized(false);
    //     try {
    //         const { signerService } = await initSignerService(providerType);
    //         console.log("LOGGING IN ", signerService.did);
    //         setDid(signerService.did);
    //         localStorage.setItem("did", signerService.did);
    //         let { identityToken } = await signerService.publicKeyAndIdentityToken();
    //         console.log(identityToken, "THE identity token")
    //         // if (identityToken) {
    //         //     await axios.post<{ token: string }>(
    //         //         `${config.backendUrl}/login`,
    //         //         {
    //         //             identityToken,
    //         //         },
    //         //         { withCredentials: true }
    //         //     );
    //         // }

    //         // const { data: roles } = await axios.get<Role[]>(
    //         //     `${config.backendUrl}/roles`,
    //         //     { withCredentials: true }
    //         // );
    //         // localStorage.setItem("roles", JSON.stringify(roles));
    //     }
    //     catch (err) {
    //         console.log(err, "THE ERR FROM LOGIN")
    //         // let httpErr = err as { response?: { status: number } };
    //         // if (httpErr?.response?.status === 401) {
    //         //     setUnauthorized(true);
    //     }
    //     //setErrored(true);

    //     //setLoading(false);
    // };

 

    return (
        <IonPage>
            <LoginOptions loginMethod={loginMethod} />
        </IonPage>
    );
};

export default Login;