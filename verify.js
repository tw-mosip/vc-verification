import {resolveDid} from "./utils/did-utils.js";
import {Ed25519Signature2020} from "@digitalbazaar/ed25519-signature-2020";
import {Ed25519VerificationKey2020} from "@digitalbazaar/ed25519-verification-key-2020";
import * as vc from "@digitalbazaar/vc";
import jsonld from "jsonld";
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
import {DOCUMENTS} from "./utils/documents.js";

const {extendContextLoader} = require("jsonld-signatures")

export const verifyVC = async (credential) => {
    try {
       let resolutionResult = await resolveDid(credential?.proof?.verificationMethod);
        if (resolutionResult.didResolutionMetadata.error) {
            throw new Error(resolutionResult.didResolutionMetadata.error)
        }
        let issuerDid = resolutionResult.didDocument;
        const verificationMethod = issuerDid?.verificationMethod[0]
        const suite = await getSuite(verificationMethod);

        const result = await vc.verifyCredential({
            credential: credential,
            suite: suite,
            documentLoader: getDocumentLoader(issuerDid)
        })
        return {"verified": result.verified}
    } catch (e) {
        return {"verified": false}
    }

}

const getDocumentLoader = (didDoc) => {
    return extendContextLoader(async url => {
        if (url === didDoc?.id) {
            return {
                contextUrl: null, documentUrl: url, document: didDoc
            };
        }
        if (DOCUMENTS[url]) {
            return {
                contextUrl: null, documentUrl: url, document: DOCUMENTS[url]
            }
        }
        return await jsonld.documentLoaders.node()(url);
    });
}


const getSuite = async (verificationMethod) => {
    let keyPair = await Ed25519VerificationKey2020.from(verificationMethod)
    return new Ed25519Signature2020({key: keyPair})
}
