import {getResolver} from 'web-did-resolver';
import {Resolver} from 'did-resolver';

export const SUPPORTED_DID_METHODS = ["web"];

const getDIDMethod = (did) => {
    const regex = /^did:([^:]+):/;
    const match = did?.match(regex);
    return match ? match[1] : "";
}

export const resolveDid = async (did)  => {
    const didMethod = getDIDMethod(did);
    if (SUPPORTED_DID_METHODS.indexOf(didMethod) === -1)
        throw new Error(`Unsupported DID method: ${didMethod}. DID: ${did}`);
    const webResolver = getResolver();
    let didResolver = new Resolver({
        ...webResolver
    });

    return await didResolver.resolve(did);
}
