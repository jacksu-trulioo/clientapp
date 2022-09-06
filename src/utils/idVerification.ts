import { KYC_UPLOAD_INNER_SHAPE } from "~/components/KycIdVerification/KycIdVerificationUploadBox/KycIdVerificationUploadBoxInnerShape"
import { KycDocumentTypes } from "~/services/mytfo/types"

export const ID_VERIFICATION_STEPS = [
  {
    title: "idVerification.passportInfoStep.heading",
    description: "idVerification.passportInfoStep.description",
    component: {
      type: "uploadBox",
      title: "idVerification.passportInfoStep.uploadBox.title",
      secondaryCta: "idVerification.passportInfoStep.uploadBox.secondaryCta",
      tooltipText: "idVerification.passportInfoStep.uploadBox.tooltipText",
    },
    type: KycDocumentTypes.PassportFront,
    shape: KYC_UPLOAD_INNER_SHAPE.document,
  },
  {
    title: "idVerification.passportSignatureStep.heading",
    subtitle: "idVerification.passportSignatureStep.subtitle",
    description: "idVerification.passportSignatureStep.description",
    component: {
      type: "uploadBox",
      title: "idVerification.passportSignatureStep.uploadBox.title",
      secondaryCta: "idVerification.passportInfoStep.uploadBox.secondaryCta",
      tooltipText: "idVerification.passportSignatureStep.uploadBox.tooltipText",
    },
    type: KycDocumentTypes.PassportSignature,
    shape: KYC_UPLOAD_INNER_SHAPE.default,
  },
  {
    title: "idVerification.nationalIdCardFrontStep.heading",
    subtitle: "idVerification.nationalIdCardFrontStep.subtitle",
    description: "idVerification.nationalIdCardFrontStep.description",
    component: {
      type: "uploadBox",
      title: "idVerification.nationalIdCardFrontStep.uploadBox.title",
      secondaryCta:
        "idVerification.nationalIdCardFrontStep.uploadBox.secondaryCta",
      tooltipText:
        "idVerification.nationalIdCardFrontStep.uploadBox.tooltipText",
    },
    type: KycDocumentTypes.NationalIdFront,
    shape: KYC_UPLOAD_INNER_SHAPE.default,
  },
  {
    title: "idVerification.nationalIdCardBackStep.heading",
    subtitle: "idVerification.nationalIdCardBackStep.subtitle",
    description: "idVerification.nationalIdCardBackStep.description",
    component: {
      type: "uploadBox",
      title: "idVerification.nationalIdCardBackStep.uploadBox.title",
      secondaryCta:
        "idVerification.nationalIdCardBackStep.uploadBox.secondaryCta",
      tooltipText:
        "idVerification.nationalIdCardBackStep.uploadBox.tooltipText",
    },
    type: KycDocumentTypes.NationalIdBack,
    shape: KYC_UPLOAD_INNER_SHAPE.default,
  },
  {
    title: "idVerification.livePhotoStep.heading",
    description: "idVerification.livePhotoStep.description",
    component: {
      type: "uploadBox",
      title: "idVerification.livePhotoStep.uploadBox.title",
    },
    type: KycDocumentTypes.LivePhoto,
    shape: KYC_UPLOAD_INNER_SHAPE.oval,
  },
  {
    title: "idVerification.scheduleVideoCall.heading",
    description: "idVerification.scheduleVideoCall.description",
    component: {
      type: "scheduleVideoCall",
      title: "idVerification.livePhotoStep.uploadBox.title",
    },
    type: KycDocumentTypes.LivePhoto,
  },
]

export const USE_CAPTURE_BUTTON = false // Change this value if you'd like to use the button while capturing
export const START_MESSAGE = "Starting GlobalGateway Capture"
export const DEFAULT_TIMEOUT = 90 * 1000

export const handleSdkError = (
  errArray: { code: string | number; type: string }[],
  t: (key: string) => void,
) => {
  let errorMessage = ""
  if (errArray && errArray.length > 0) {
    // handle different error code here
    for (let i = 0; i < errArray.length; i += 1) {
      errorMessage += `${t(
        `idVerification.errors.trulioo.${errArray[i].type}`,
      )} \n`
    }
  } else {
    errorMessage = "Capture timeout"
  }

  return errorMessage
}
