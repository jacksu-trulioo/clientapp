import {
  Box,
  Button,
  Flex,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Spacer,
  Text,
  useDisclosure,
} from "@chakra-ui/react"
import useTranslation from "next-translate/useTranslation"
import React from "react"

import { Checkbox, CloseIconSetting, TFOLogo } from "~/components"

type TermAndConditionType = {
  show: boolean
  close: () => void
}

export default function TermsAndCondition({
  show,
  close,
}: TermAndConditionType) {
  const { lang } = useTranslation("setting")
  const { onClose } = useDisclosure({ defaultIsOpen: true })

  return (
    <>
      <Modal isOpen={show} onClose={onClose}>
        <ModalOverlay />
        <ModalContent
          bg="#111111"
          border="1px solid #4D4D4D"
          mx={{ base: "20px", md: "0px" }}
          borderRadius="6px"
          w={{ base: "343px", md: "645px", lgp: "856px" }}
          h={{ base: "600px", md: "500px" }}
          maxW="865px"
        >
          <Flex px="29px" py="12px" justifyContent="center" alignItems="center">
            <ModalHeader p="0" mb="0" mt="0">
              <Box ml="-10px">
                {" "}
                <TFOLogo />
              </Box>
            </ModalHeader>
            <Spacer />
            <Button
              aria-label="Close"
              fontSize="12px"
              bg="transparent"
              color="#B99855"
              px="0px"
              _active={{ bg: "transparent" }}
              _hover={{ bg: "transparent" }}
              _focus={{ boxShadow: "none" }}
              onClick={close}
            >
              <Box>
                <CloseIconSetting />
              </Box>
            </Button>
          </Flex>
          {lang.includes("en") ? (
            <ModalBody
              overflow="auto"
              px={{ lgp: "30px", md: "30px", base: "16px" }}
              py="12px"
              mr="10px"
              css={{
                "&::-webkit-scrollbar": {
                  width: "4px",
                  background: "#222",
                },
                "&::-webkit-scrollbar-track": {
                  width: "6px",
                },
                "&::-webkit-scrollbar-thumb": {
                  background: "#4D4D4D",
                  borderRadius: "5px",
                },
              }}
            >
              <Box m="0px">
                <Box
                  as="p"
                  mb="24px"
                  textAlign="start"
                  fontSize={{ lgp: "20px", base: "18px", md: "20px" }}
                  color="#fff"
                  pt="10px"
                  fontWeight="600"
                >
                  Terms of Service
                </Box>
                <Box
                  as="p"
                  color="#fff"
                  mb="18px"
                  textAlign="start"
                  fontSize={{ lgp: "16px", base: "14px", md: "16px" }}
                  fontWeight="400"
                >
                  Agreement. Please read the following information carefully
                  before using this App. By clicking “I accept” below, you agree
                  to be bound by this User Agreement. If you do not agree with
                  any part of the User Agreement, do not use this App. The
                  Family Office (defined below) reserves the right, in its sole
                  discretion, to modify, alter or otherwise update this User
                  Agreement at any time, and by clicking “I accept” to the
                  revisions, you accept the modification. Where required, we may
                  also provide additional mechanisms for consent to changes to
                  this User Agreement. Any changes will be effective only after
                  the effective date of the change and will not affect any
                  dispute arising prior to the effective date of the change.
                </Box>
                <Box
                  as="p"
                  color="#C7C7C7"
                  mb="18px"
                  textAlign="start"
                  fontSize={{ lgp: "16px", base: "14px", md: "16px" }}
                  fontWeight="400"
                >
                  The Digital Client App (the "App") is an online digital
                  onboarding tool where you can apply to open an account upon
                  the supply of certain information to apply for accounts
                  required by The Family Office Co. BSC(c) and certain of its
                  affiliates ("The Family Office"), and is available subject to
                  your compliance with the terms and conditions set forth below.
                  Nothing in this User Agreement or the App shall be construed
                  as creating any warranty or other obligation on the part of
                  The Family Office.
                </Box>
                <Box
                  as="p"
                  color="#c7c7c7"
                  mb="18px"
                  textAlign="start"
                  fontSize={{ lgp: "16px", base: "14px", md: "16px" }}
                  fontWeight="400"
                >
                  This App is intended only for prospective and current clients
                  of The Family Office. This User Agreement relates solely to
                  the App and is in addition to, and is incorporated by
                  reference into, and shall be governed by the governing law
                  provisions of and subject to the dispute resolution mechanisms
                  set forth in, the Account Opening Packet. In the event of any
                  conflict, the terms of this User Agreement shall take
                  precedence over the Account Opening Packet with respect to the
                  App only, and otherwise the terms of the Account Opening
                  Packet shall take precedence with respect to your relationship
                  with The Family Office.
                </Box>
                <Box
                  as="p"
                  color="#C7C7C7"
                  mb="18px"
                  textAlign="start"
                  fontSize={{ lgp: "16px", base: "14px", md: "16px" }}
                  fontWeight="400"
                >
                  This App is not intended for use by individuals under the age
                  of eighteen (18). Users of this App must be at least 18 years
                  old, or of legal age to enter into agreements in the user’s
                  jurisdiction, whichever is older.
                </Box>
                <Box
                  as="p"
                  color="#C7C7C7"
                  mb="18px"
                  textAlign="start"
                  fontSize={{ lgp: "16px", base: "14px", md: "16px" }}
                  fontWeight="400"
                >
                  This App is intended to be used by individuals in permitted
                  jurisdictions.
                </Box>
              </Box>
              <Box m="0px" textAlign="start">
                <Box
                  as="p"
                  m="0"
                  fontSize={{ base: "16px", md: "18px", lgp: "18px" }}
                  fontWeight="400"
                  color="#fff"
                  py="10px"
                >
                  Disclaimer of Warranties; Limitation of Liability.
                </Box>
                <Box
                  as="p"
                  color="#C7C7C7"
                  mb="18px"
                  fontSize={{ lgp: "16px", base: "14px", md: "16px" }}
                  fontWeight="400"
                >
                  THIS APP AND THE INFORMATION PROVIDED THROUGH THE APP ARE
                  PROVIDED "AS IS" WITHOUT WARRANTY OF ANY KIND, EITHER
                  EXPRESSED OR IMPLIED, INCLUDING, BUT NOT LIMITED TO, THE
                  IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
                  PARTICULAR PURPOSE, OR NON-INFRINGEMENT. THE FAMILY OFFICE
                  DOES NOT WARRANT THAT THE APP WILL BE UNINTERRUPTED OR ERROR
                  FREE, THAT DEFECTS WILL BE CORRECTED, OR THAT THE APP THAT
                  MAKES THE ACCOUNT AND OTHER INFORMATION AVAILABLE IS FREE OF
                  VIRUSES OR OTHER HARMFUL COMPONENTS. These warranties are
                  hereby excluded to the fullest extent permissible by law.
                  UNDER NO CIRCUMSTANCES SHALL THE FAMILY OFFICE BE LIABLE FOR
                  ANY DIRECT OR INDIRECT, SPECIAL, INCIDENTAL OR CONSEQUENTIAL
                  DAMAGES THAT MAY ARISE FROM YOUR USE OF, OR INABILITY TO USE,
                  THIS APP OR THE INFORMATION. Some jurisdictions do not allow
                  the exclusion or limitation of liability for consequential or
                  incidental damages. In such jurisdictions, THE FAMILY OFFICE’s
                  liability is limited to the greatest extent permitted by law.
                  In the event of any conflict or inconsistency between the
                  information provided through the App and the information
                  provided to you directly from or on behalf of The Family
                  Office via regular communications, the information provided
                  via regular communications takes precedence.
                </Box>
                <Box
                  as="p"
                  color="#C7C7C7"
                  mb="18px"
                  fontSize={{ lgp: "16px", base: "14px", md: "16px" }}
                  fontWeight="400"
                >
                  BY ACCESSING AND USING THE APP, YOU UNDERSTAND THAT YOU MAY BE
                  WAIVING RIGHTS WITH RESPECT TO CLAIMS THAT ARE AT THIS TIME
                  UNKNOWN OR UNSUSPECTED, AND IN ACCORDANCE WITH SUCH WAIVER,
                  YOU ACKNOWLEDGE THAT YOU HAVE READ AND UNDERSTAND, AND HEREBY
                  EXPRESSLY WAIVE, THE BENEFITS OF ANY LAW OF ANY JURISDICTION
                  WHICH PROVIDES SUBSTANTIALLY AS FOLLOWS: "A GENERAL RELEASE
                  DOES NOT EXTEND TO CLAIMS WHICH THE CREDITOR DOES NOT KNOW OR
                  SUSPECT TO EXIST IN HIS OR HER FAVOR AT THE TIME OF EXECUTING
                  THE RELEASE, WHICH IF KNOWN BY HIM OR HER MUST HAVE MATERIALLY
                  AFFECTED HIS OR HER SETTLEMENT WITH THE DEBTOR."
                </Box>
                <Box
                  as="p"
                  color="#C7C7C7"
                  mb="18px"
                  fontSize={{ lgp: "16px", base: "14px", md: "16px" }}
                  fontWeight="400"
                >
                  THE LIMITATIONS AND DISCLAIMERS IN THIS SECTION DO NOT PURPORT
                  TO LIMIT LIABILITY OR ALTER YOUR RIGHTS AS A CONSUMER THAT
                  CANNOT BE EXCLUDED UNDER APPLICABLE LAW.
                </Box>
              </Box>
              <Box m="0px" textAlign="start">
                <Box
                  as="p"
                  m="0"
                  fontSize={{ base: "16px", md: "18px", lgp: "18px" }}
                  fontWeight="400"
                  color="#fff"
                  py="10px"
                >
                  Force Majeure.
                </Box>
                <Box
                  as="p"
                  color="#C7C7C7"
                  mb="18px"
                  fontSize={{ lgp: "16px", base: "14px", md: "16px" }}
                  fontWeight="400"
                >
                  Neither party will be liable for any delay or failure to
                  perform its obligations hereunder caused by an event of
                  natural disaster, pandemics, casualty, acts of God or public
                  enemy, power outages, riots, system failures, terrorism,
                  cyberattacks, governmental acts or such other event of similar
                  nature that is beyond the reasonable control of the party
                  seeking to rely on this section to excuse its delay or
                  failure.
                </Box>
              </Box>
              <Box m="0px" textAlign="start" mt="10px">
                <Box
                  as="p"
                  m="0"
                  fontSize={{ base: "16px", md: "18px", lgp: "18px" }}
                  fontWeight="400"
                  color="#fff"
                  py="10px"
                >
                  Our Copyrighted Materials; Infringement Claims.
                </Box>
                <Box
                  as="p"
                  color="#C7C7C7"
                  mb="18px"
                  fontSize={{ lgp: "16px", base: "14px", md: "16px" }}
                  fontWeight="400"
                >
                  The copyrights in all text, images, screens and other
                  materials provided on this App (collectively, the "Materials")
                  are owned or licensed by The Family Office and/or by third
                  parties. Except as provided below, none of the Materials may
                  be copied, distributed, displayed, downloaded, or transmitted
                  in any form or by any means without the prior written
                  permission of The Family Office or the copyright owner.
                  Unauthorized use of any Materials contained on this App may
                  violate copyright laws, trademark laws, the laws of privacy
                  and publicity, and/or other regulations and statutes
                </Box>
              </Box>
              <Box m="0px" textAlign="start">
                <Box
                  as="p"
                  m="0"
                  fontSize={{ base: "16px", md: "18px", lgp: "18px" }}
                  fontWeight="400"
                  color="#fff"
                  py="10px"
                >
                  Trademarks
                </Box>
                <Box
                  as="p"
                  color="#C7C7C7"
                  mb="18px"
                  fontSize={{ lgp: "16px", base: "14px", md: "16px" }}
                  fontWeight="400"
                >
                  Trademarks and service marks that may be referred to on this
                  App are the property of The Family Office or their respective
                  owners. Nothing on this App should be construed as granting,
                  by implication, estoppel, or otherwise, any license or right
                  to use any trademark without The Family Office’s written
                  permission. The name of The Family Office or The Family Office
                  logo may not be used in any way, including in advertising or
                  publicity pertaining to distribution of materials on this App,
                  without prior written permission. You are not authorized to
                  use The Family Office’s logo as a hyperlink to this App unless
                  you obtain The Family Office’s written permission in advance,
                  although The Family Office permits you to use certain
                  designated features of the App to use The Family Office’s logo
                  as a hyperlink for designated purposes.
                </Box>
              </Box>
              <Box m="0px" textAlign="start">
                <Box
                  as="p"
                  m="0"
                  fontSize={{ base: "16px", md: "18px", lgp: "18px" }}
                  fontWeight="400"
                  color="#fff"
                  py="10px"
                >
                  Right to Preserve and Disclose
                </Box>
                <Box
                  as="p"
                  color="#C7C7C7"
                  mb="18px"
                  fontSize={{ lgp: "16px", base: "14px", md: "16px" }}
                  fontWeight="400"
                >
                  The Family Office may preserve all information you provide,
                  consistent with the applicable Privacy Policy. The Family
                  Office may also disclose information you provide if required
                  to do so by law or in the good faith belief that such
                  preservation or disclosure is reasonably necessary to: (a)
                  complete your transaction; (b) comply with legal process; (c)
                  enforce this User Agreement; (d) respond to claims that any
                  materials on this App violate your rights or the rights of
                  third parties; (e) protect the rights, property, or personal
                  safety of The Family Office, its users and/or the public; or
                  (f) in the event that all or substantially all of The Family
                  Office’s assets are acquired by a third-party.
                </Box>
              </Box>
              <Box m="0px" textAlign="start">
                <Box
                  as="p"
                  m="0"
                  fontSize={{ base: "16px", md: "18px", lgp: "18px" }}
                  fontWeight="400"
                  color="#fff"
                  py="10px"
                >
                  Prohibited Actions
                </Box>
                <Box
                  as="p"
                  color="#C7C7C7"
                  mb="18px"
                  fontSize={{ lgp: "16px", base: "14px", md: "16px" }}
                  fontWeight="400"
                >
                  You agree not to: (a) decompile, reverse engineer,
                  disassemble, modify, reduce the App to human perceivable form
                  or create derivative works based upon the App or any part
                  thereof; (b) disable any licensing or control features of the
                  App; (c) “frame” the App or any portion thereof or otherwise
                  cause the App or its contents to appear to be provided by
                  anyone except The Family Office; (d) introduce into the App
                  any virus or other code or routine intended to disrupt or
                  damage the App, or alter, damage or delete any Materials, or
                  retrieve or record information about the App or its users; (e)
                  merge the App or Materials with another program or create
                  derivative works based on the App or Materials; (f) remove,
                  obscure, or alter any notice of the copyright or other
                  proprietary legends on the App or Materials; (g) sublicense,
                  assign, translate, rent, lease, lend, resell for profit,
                  distribute or otherwise assign or transfer the Materials or
                  access to the App to others; (h) use, or allow the use of, the
                  App or the Materials in contravention of any federal, state,
                  local, foreign or other applicable law, or rules or
                  regulations of regulatory or administrative organizations; or
                  (i) otherwise act in a fraudulent, illegal, malicious or
                  negligent manner when using the App. Except as expressly
                  provided herein, The Family Office and the third parties
                  reserve all rights with respect to the App, and may pursue all
                  legally available options under both civil and criminal laws
                  (and may cooperate with law enforcement agencies) in the event
                  of any violations.
                </Box>
              </Box>
              <Box m="0px" textAlign="start">
                <Box
                  as="p"
                  m="0"
                  fontSize={{ base: "16px", md: "18px", lgp: "18px" }}
                  fontWeight="400"
                  color="#fff"
                  py="10px"
                >
                  Prohibition on Scripts, Bots, Third Parties
                </Box>
                <Box
                  as="p"
                  color="#C7C7C7"
                  mb="18px"
                  fontSize={{ lgp: "16px", base: "14px", md: "16px" }}
                  fontWeight="400"
                >
                  You agree not to: (a) decompile, reverse engineer,
                  disassemble, modify, reduce the App to human perceivable form
                  or create derivative works based upon the App or any part
                  thereof; (b) disable any licensing or control features of the
                  App; (c) “frame” the App or any portion thereof or otherwise
                  cause the App or its contents to appear to be provided by
                  anyone except The Family Office; (d) introduce into the App
                  any virus or other code or routine intended to disrupt or
                  damage the App, or alter, damage or delete any Materials, or
                  retrieve or record information about the App or its users; (e)
                  merge the App or Materials with another program or create
                  derivative works based on the App or Materials; (f) remove,
                  obscure, or alter any notice of the copyright or other
                  proprietary legends on the App or Materials; (g) sublicense,
                  assign, translate, rent, lease, lend, resell for profit,
                  distribute or otherwise assign or transfer the Materials or
                  access to the App to others; (h) use, or allow the use of, the
                  App or the Materials in contravention of any federal, state,
                  local, foreign or other applicable law, or rules or
                  regulations of regulatory or administrative organizations; or
                  (i) otherwise act in a fraudulent, illegal, malicious or
                  negligent manner when using the App. Except as expressly
                  provided herein, The Family Office and the third parties
                  reserve all rights with respect to the App, and may pursue all
                  legally available options under both civil and criminal laws
                  (and may cooperate with law enforcement agencies) in the event
                  of any violations.
                </Box>
              </Box>
              <Box m="0px" textAlign="start">
                <Box
                  as="p"
                  m="0"
                  fontSize={{ base: "16px", md: "18px", lgp: "18px" }}
                  fontWeight="400"
                  color="#fff"
                  py="10px"
                >
                  Prohibition on Scraping
                </Box>
                <Box
                  as="p"
                  color="#C7C7C7"
                  mb="18px"
                  fontSize={{ lgp: "16px", base: "14px", md: "16px" }}
                  fontWeight="400"
                >
                  You are prohibited from “scraping,” copying, republishing,
                  licensing, or selling the data or information on the App.
                </Box>
              </Box>
              <Box m="0px" textAlign="start">
                <Box
                  as="p"
                  m="0"
                  fontSize={{ base: "16px", md: "18px", lgp: "18px" }}
                  fontWeight="400"
                  color="#fff"
                  py="10px"
                >
                  Ownership of Usage Data
                </Box>
                <Box
                  as="p"
                  color="#C7C7C7"
                  mb="18px"
                  fontSize={{ lgp: "16px", base: "14px", md: "16px" }}
                  fontWeight="400"
                >
                  The Family Office may collect and aggregate data about your
                  usage of the App, and The Family Office shall be the sole
                  owner of such information.
                </Box>
              </Box>
              <Box m="0px" textAlign="start">
                <Box
                  as="p"
                  m="0"
                  fontSize={{ base: "16px", md: "18px", lgp: "18px" }}
                  fontWeight="400"
                  color="#fff"
                  py="10px"
                >
                  Links
                </Box>
                <Box
                  as="p"
                  color="#C7C7C7"
                  mb="18px"
                  fontSize={{ lgp: "16px", base: "14px", md: "16px" }}
                  fontWeight="400"
                >
                  Although The Family Office controls a few hyperlinks in the
                  App, some links within this App may lead to third-party apps
                  or a third-party website. The Family Office includes these
                  third-party links solely as a convenience to you. The presence
                  of a link does not imply an endorsement of the linked app or
                  site, its operator, or its contents, or that The Family Office
                  is in any way affiliated with the linked app or site unless
                  explicitly indicated in each case in the App where such
                  materials are linked. The App does not incorporate any
                  materials appearing in such linked apps or sites by reference,
                  unless explicitly indicated in each case in the App where such
                  materials are linked. The Family Office reserves the right to
                  terminate a link to a third-party app or site at any time. The
                  third-party apps and sites are not controlled by The Family
                  Office, and may have different terms of use and privacy
                  policies, which The Family Office encourages you to review.
                </Box>
              </Box>
              <Box m="0px" textAlign="start">
                <Box
                  as="p"
                  m="0"
                  fontSize={{ base: "16px", md: "18px", lgp: "18px" }}
                  fontWeight="400"
                  color="#fff"
                  py="10px"
                >
                  Exclusions And Limitations; Consumer Protection Notice
                </Box>
                <Box
                  as="p"
                  color="#C7C7C7"
                  mb="18px"
                  fontSize={{ lgp: "16px", base: "14px", md: "16px" }}
                  fontWeight="400"
                >
                  If you are a consumer, the provisions in this User Agreement
                  are intended to be only as broad and inclusive as is permitted
                  by the laws of your country of residence. In any event, The
                  Family Office reserves all rights, defenses and permissible
                  limitations under the law of your country of residence.
                </Box>
              </Box>
              <Box m="0px" textAlign="start">
                <Box
                  as="p"
                  m="0"
                  fontSize={{ base: "16px", md: "18px", lgp: "18px" }}
                  fontWeight="400"
                  color="#fff"
                  py="10px"
                >
                  App Control
                </Box>
                <Box
                  as="p"
                  color="#C7C7C7"
                  mb="18px"
                  fontSize={{ lgp: "16px", base: "14px", md: "16px" }}
                  fontWeight="400"
                >
                  This App is controlled by The Family Office from the
                  jurisdiction of your Account Opening Packet. The Family Office
                  makes no representation that content or materials in this App
                  are appropriate or available for use in other jurisdictions.
                  Access to this App content or materials from jurisdictions
                  where such access is illegal is strictly prohibited. If you
                  choose to access this App from other jurisdictions, you do so
                  at your own risk. You are always responsible for your
                  compliance with applicable laws.
                </Box>
              </Box>
              <Box m="0px" textAlign="start">
                <Box
                  as="p"
                  m="0"
                  fontSize={{ base: "16px", md: "18px", lgp: "18px" }}
                  fontWeight="400"
                  color="#fff"
                  py="10px"
                >
                  Governing Law and Dispute Resolution.
                </Box>
                <Box
                  as="p"
                  color="#C7C7C7"
                  mb="18px"
                  fontSize={{ lgp: "16px", base: "14px", md: "16px" }}
                  fontWeight="400"
                >
                  This User Agreement and any use of this App by such user shall
                  be governed by and construed in accordance with the laws of
                  the jurisdiction set forth in the Account Opening Packet and
                  the dispute resolution provisions of the Account Opening
                  Packet shall apply. Until the Account Opening Packet is
                  executed, this User Agreement and any use of this App by such
                  user shall be governed by and construed in accordance with the
                  laws of the Kingdom of Bahrain, without regard to the conflict
                  of laws principles thereof, and such user irrevocably agrees
                  that any legal action arising out of or relating to this User
                  Agreement or such use may be brought by or on behalf of such
                  user only in the courts of Bahrain and irrevocably submits to
                  the jurisdiction of such courts. Such user irrevocably agrees
                  that The Family Office shall have the right to commence any
                  legal action against such user and/or its assets in any other
                  jurisdiction or to serve process in any manner permitted by
                  law, and the taking of proceedings in any jurisdiction shall
                  not preclude The Family Office from taking proceedings in any
                  other jurisdiction whether concurrently or not.
                </Box>
              </Box>
              <Box m="0px" textAlign="start">
                <Box
                  as="p"
                  m="0"
                  fontSize={{ base: "16px", md: "18px", lgp: "18px" }}
                  fontWeight="400"
                  color="#fff"
                  py="10px"
                >
                  Not Authorized to Do Business In Every Jurisdiction.
                </Box>
                <Box
                  as="p"
                  color="#C7C7C7"
                  mb="18px"
                  fontSize={{ lgp: "16px", base: "14px", md: "16px" }}
                  fontWeight="400"
                >
                  The Family Office is not authorized to do business generally
                  or to provide certain services in every jurisdiction.
                  Information published on this App may contain references or
                  cross-references to goods or services that are not available
                  in your state or country.
                </Box>
              </Box>
              <Box m="0px" textAlign="start">
                <Box
                  as="p"
                  m="0"
                  fontSize={{ base: "16px", md: "18px", lgp: "18px" }}
                  fontWeight="400"
                  color="#fff"
                  py="10px"
                >
                  Entire Agreement; Severability
                </Box>
                <Box
                  as="p"
                  color="#C7C7C7"
                  mb="18px"
                  fontSize={{ lgp: "16px", base: "14px", md: "16px" }}
                  fontWeight="400"
                >
                  You acknowledge that you have read and understood this User
                  Agreement and that you agree to be bound by its terms and
                  conditions. You further agree that this User Agreement,
                  together with the applicable Privacy Policy (contained
                  herein), which is hereby incorporated into this User Agreement
                  by reference, and the Account Opening Packet, constitute the
                  complete and exclusive statement of the agreement between you
                  and The Family Office and supersedes all other proposals or
                  prior agreements oral or written, and any other communications
                  relating to the subject matter of this User Agreement. If any
                  provision of this User Agreement is found unenforceable, it
                  shall not affect the validity of this User Agreement, which
                  shall remain valid and enforceable according to its terms.
                </Box>
              </Box>
              <Box m="0px" textAlign="start">
                <Box
                  as="p"
                  m="0"
                  fontSize={{ base: "16px", md: "18px", lgp: "18px" }}
                  fontWeight="400"
                  color="#fff"
                  py="10px"
                >
                  Electronic Signature
                </Box>
                <Box
                  as="p"
                  color="#C7C7C7"
                  mb="18px"
                  fontSize={{ lgp: "16px", base: "14px", md: "16px" }}
                  fontWeight="400"
                >
                  You acknowledge that in certain circumstances you may use the
                  App to execute and agree to certain transactions. Any form or
                  transaction executed by means of an electronically-produced
                  signature through the App, shall have the same legal effect as
                  if such signature had been manually written. The Family Office
                  is hereby authorized to rely upon and accept as an original
                  any document or transaction which is sent by electronic
                  transmission through the App. You agree that when you click on
                  a “Submit” or “I agree” or other similar worded button or
                  entry field with your device, your agreement or consent will
                  be legally binding and enforceable and the legal equivalent of
                  your handwritten signature.
                </Box>
              </Box>
              <Box m="0px" textAlign="start">
                <Box
                  as="p"
                  m="0"
                  fontSize={{ base: "16px", md: "18px", lgp: "18px" }}
                  fontWeight="400"
                  color="#fff"
                  py="10px"
                >
                  No Investment Advice
                </Box>
                <Box
                  as="p"
                  color="#C7C7C7"
                  mb="18px"
                  fontSize={{ lgp: "16px", base: "14px", md: "16px" }}
                  fontWeight="400"
                >
                  The information provided in the App is for information
                  purposes only. No information or materials provided in the App
                  should be construed as investment, financial, legal, tax or
                  other advice. Nothing contained in the App constitutes a
                  solicitation, recommendation, endorsement or offer by The
                  Family Office or an affiliate to buy or sell any securities or
                  other financial instruments in any jurisdiction in which such
                  solicitation or offer would be unlawful.
                </Box>
              </Box>
              <Box m="0px" textAlign="start">
                <Box
                  as="p"
                  m="0"
                  fontSize={{ base: "16px", md: "18px", lgp: "18px" }}
                  fontWeight="400"
                  color="#fff"
                  py="10px"
                >
                  Confidentiality
                </Box>
                <Box
                  as="p"
                  color="#C7C7C7"
                  mb="18px"
                  fontSize={{ lgp: "16px", base: "14px", md: "16px" }}
                  fontWeight="400"
                >
                  You acknowledge that any information or materials provided in
                  the App is confidential (“Confidential Information”). You
                  agree to keep the Confidential Information confidential and to
                  protect the confidentiality of such Confidential Information
                  with the same degree of care with which it protects the
                  confidentiality of its own confidential information, but in no
                  event with less than a reasonable degree of care. You may
                  disclose Confidential Information only to your employees,
                  agents and consultants on a need-to-know basis, and only if
                  such employees, agents, consultants have agreed to the same
                  confidentiality obligations.
                </Box>
              </Box>
              <Box m="0px" textAlign="start">
                <Box
                  as="p"
                  m="0"
                  fontSize={{ base: "16px", md: "18px", lgp: "18px" }}
                  fontWeight="400"
                  color="#fff"
                  py="10px"
                >
                  Digital Client Application Privacy Policy
                </Box>
                <Box
                  as="p"
                  color="#C7C7C7"
                  mb="18px"
                  fontSize={{ lgp: "16px", base: "14px", md: "16px" }}
                  fontWeight="400"
                >
                  The Family Office Co. BSC(c) and certain of its affiliates
                  (“The Family Office”, “we” or “us”), acting as a data
                  controller, have prepared this privacy policy to explain how
                  we use any personal information we collect about you when you
                  use this App, and the choices you have concerning how the data
                  is being collected and used.
                </Box>
                <Box
                  as="p"
                  color="#C7C7C7"
                  mb="18px"
                  fontSize={{ lgp: "16px", base: "14px", md: "16px" }}
                  fontWeight="400"
                >
                  This App is not intended for children and minors and we do not
                  knowingly solicit or collect Personal Data from children and
                  minors. As a parent or legal guardian, please do not allow
                  your children to submit Personal Data without your permission.
                </Box>
                <Box
                  as="p"
                  color="#C7C7C7"
                  mb="18px"
                  fontSize={{ lgp: "16px", base: "14px", md: "16px" }}
                  fontWeight="400"
                >
                  By submitting your personal data to us, you agree to the
                  processing set out in this Privacy Policy. Further notices
                  highlighting certain uses we wish to make of your personal
                  data together with the ability to opt in or out of selected
                  uses may also be provided to you when we collect personal data
                  from you.
                </Box>
                <Box
                  as="p"
                  color="#C7C7C7"
                  mb="18px"
                  fontSize={{ lgp: "16px", base: "14px", md: "16px" }}
                  fontWeight="400"
                >
                  This Privacy Policy contains general and technical details
                  about the steps we take to respect your privacy concerns. We
                  have organised the Privacy Policy by major processes and areas
                  so that you can review the information of most interest to
                  you.
                </Box>
              </Box>
              <Box mt="20px" textAlign="start">
                <Flex mb="30px">
                  <Box
                    fontSize={{ base: "16px", md: "18px", lgp: "18px" }}
                    fontWeight="400"
                    color="#fff"
                  >
                    1.
                  </Box>{" "}
                  <Box pl="12px">
                    <Text
                      fontSize={{ base: "16px", md: "18px", lgp: "18px" }}
                      fontWeight="400"
                      color="#fff"
                    >
                      Personal Data we collect
                    </Text>
                    <Text
                      color="#C7C7C7"
                      mb="18px"
                      mt="15px"
                      fontSize={{ lgp: "16px", base: "14px", md: "16px" }}
                      fontWeight="400"
                    >
                      The term “Personal Data” refers to any information that
                      can be used to identify you, or that can be linked to you,
                      as an individual.
                    </Text>
                  </Box>
                </Flex>
                <Flex
                  mb="30px"
                  fontSize={{ lgp: "16px", base: "14px", md: "16px" }}
                  fontWeight="400"
                >
                  <Box
                    fontSize={{ base: "16px", md: "18px", lgp: "18px" }}
                    fontWeight="400"
                  >
                    1.1
                  </Box>{" "}
                  <Box pl="12px">
                    <Text
                      fontSize={{ lgp: "16px", base: "14px", md: "16px" }}
                      fontWeight="400"
                      color="#fff"
                    >
                      We may collect and process the following Personal Data
                      about you.
                    </Text>
                    <Text
                      color="#C7C7C7"
                      mb="18px"
                      mt="15px"
                      fontSize={{ lgp: "16px", base: "14px", md: "16px" }}
                      fontWeight="400"
                    >
                      (a) Personal information about you ► personal information
                      that you provide to us when you apply to open an account
                      or at other points during the onboarding process before or
                      after opening an account (e.g. personal/identification
                      information, name, date of birth, nationality residential
                      address, gender, country of residence, accredited investor
                      status, tax residential status, tax identification
                      numbers, income and wealth information, annual income, net
                      worth, source of funds and wealth, employment activity,
                      investment risk appetite, passport, national ID (or
                      equivalent documents), photograph/video or other likeness,
                      voice, bank details, IBAN details, and proof of address,
                      etc), as well as any additional information provided by or
                      through The Family Office, or submitted through a
                      question, such as your e-mail address, or submitted
                      through the uploading of personal documents in order to
                      comply with KYC checks requirements in the jurisdictions
                      where we operate;
                    </Text>
                    <Text
                      color="#C7C7C7"
                      mb="18px"
                      mt="15px"
                      fontSize={{ lgp: "16px", base: "14px", md: "16px" }}
                      fontWeight="400"
                    >
                      (b) Our correspondence ► if you contact us, such as when
                      you make a general or investment-related inquiry or
                      request technical support, or respond to a question we may
                      ask you, we may keep a record of that correspondence
                      including, but not limited to, audio, electronic, visual
                      and similar information, such as call and video
                      recordings;
                    </Text>
                    <Text
                      color="#C7C7C7"
                      mb="18px"
                      mt="15px"
                      fontSize={{ lgp: "16px", base: "14px", md: "16px" }}
                      fontWeight="400"
                    >
                      (c) Survey information ► we may also ask you to complete
                      surveys that we use for research purposes. In such
                      circumstances we shall collect the information provided in
                      the completed survey; and
                    </Text>
                    <Text
                      color="#C7C7C7"
                      mb="18px"
                      mt="15px"
                      fontSize={{ lgp: "16px", base: "14px", md: "16px" }}
                      fontWeight="400"
                    >
                      (d) Your use of our App ► details of your visits to our
                      website and information collected through cookies and
                      other tracking technologies including, but not limited to,
                      your IP address and domain name, your browser version and
                      operating system, traffic data, location data, web logs
                      and other communication data, and the resources that you
                      access.
                    </Text>
                    <Text
                      color="#C7C7C7"
                      mb="18px"
                      mt="15px"
                      fontSize={{ lgp: "16px", base: "14px", md: "16px" }}
                      fontWeight="400"
                    >
                      (e) Do-not-track ► Because there is not yet a consensus on
                      how companies should respond to web browser-based
                      “do-not-track” (“DNT”) mechanisms, and given certain
                      regulatory requirements applicable to us, we do not
                      respond to web browser-based DNT signals at this time.
                      Please note that not all tracking will stop even if you
                      delete cookies.
                    </Text>
                  </Box>
                </Flex>{" "}
                <Flex mb="30px">
                  <Box
                    fontSize={{ base: "16px", md: "18px", lgp: "18px" }}
                    fontWeight="400"
                  >
                    1.2
                  </Box>{" "}
                  <Box pl="12px">
                    <Text
                      fontSize={{ base: "16px", md: "18px", lgp: "18px" }}
                      fontWeight="400"
                      color="#C7C7C7"
                    >
                      We may collect your Personal Data from you directly. We
                      may also collect Personal Data from third parties
                      including agents that give instructions on your behalf or
                      any other governmental, quasi-governmental bodies that may
                      provide Personal Data on your behalf. As well as this, we
                      may also collect Personal Data from third party service
                      providers as part of your application process, such as
                      from third party video authentication providers as part of
                      our KYC checks.
                    </Text>
                  </Box>
                </Flex>
                <Flex mb="30px">
                  <Box
                    fontSize={{ base: "16px", md: "18px", lgp: "18px" }}
                    fontWeight="400"
                  >
                    1.3
                  </Box>{" "}
                  <Box pl="12px">
                    <Text
                      fontSize={{ base: "16px", md: "18px", lgp: "18px" }}
                      fontWeight="400"
                      color="#C7C7C7"
                    >
                      If you provide us with Personal Data about other
                      individuals, you must inform such individuals that you
                      have provided us with their details and let them know
                      where they can find a copy of this Privacy Policy.
                    </Text>
                  </Box>
                </Flex>
                <Flex mb="30px">
                  <Box
                    fontSize={{ base: "16px", md: "18px", lgp: "18px" }}
                    fontWeight="400"
                  >
                    1.4
                  </Box>{" "}
                  <Box pl="12px">
                    <Text
                      fontSize={{ base: "16px", md: "18px", lgp: "18px" }}
                      fontWeight="400"
                      color="#C7C7C7"
                    >
                      If you choose not to provide certain Personal Data, this
                      may mean that we are not able to provide you with all of
                      our services.
                    </Text>
                  </Box>
                </Flex>
                <Flex mb="30px">
                  <Box
                    fontSize={{ base: "16px", md: "18px", lgp: "18px" }}
                    fontWeight="400"
                  >
                    1.5
                  </Box>{" "}
                  <Box pl="12px">
                    <Text
                      fontSize={{ base: "16px", md: "18px", lgp: "18px" }}
                      fontWeight="400"
                      color="#C7C7C7"
                    >
                      When accessing the App, we may detect and collect your
                      location information in order to comply with applicable
                      regulatory requirements. The App utilizes application
                      programming interface (API) to capture the IP address
                      location of the accessing device. Location information
                      collected may consist of your general and/or specific
                      geographic location as determined by your IP address.
                      Also, you agree that when utilizing a virtual private
                      network (VPN), the VPN location is reporting a location in
                      the same country as your actual location during the entire
                      usage period.
                    </Text>
                  </Box>
                </Flex>
                <Flex mb="30px">
                  <Box
                    fontSize={{ base: "16px", md: "18px", lgp: "18px" }}
                    fontWeight="400"
                    color="#fff"
                  >
                    2.
                  </Box>{" "}
                  <Box pl="12px">
                    <Text
                      fontSize={{ base: "16px", md: "18px", lgp: "18px" }}
                      fontWeight="400"
                      color="#fff"
                    >
                      How we use Personal Data
                    </Text>
                    {/* <Text
                      color="#C7C7C7"
                      mb="18px"
                      mt="15px"
                      fontSize={{ lgp: "16px", base: "14px", md: "16px" }}
                      fontWeight="400"
                    >
                      The term “Personal Data” refers to any information that
                      can be used to identify you, or that can be linked to you,
                      as an individual.
                    </Text> */}
                  </Box>
                </Flex>
                <Flex mb="30px">
                  <Box
                    fontSize={{ base: "16px", md: "18px", lgp: "18px" }}
                    fontWeight="400"
                  >
                    2.1
                  </Box>{" "}
                  <Box pl="12px">
                    <Text
                      fontSize={{ base: "16px", md: "18px", lgp: "18px" }}
                      fontWeight="400"
                      color="#C7C7C7"
                    >
                      We may use your Personal Data in the following ways.
                      <Text
                        fontSize={{ lgp: "16px", base: "14px", md: "16px" }}
                        fontWeight="400"
                      >
                        Please note that use of Personal Data under applicable
                        data protection laws must be justified under one of a
                        number of legal “grounds” and we are required to set out
                        the grounds in respect of each use in this Privacy
                        Policy.
                      </Text>
                    </Text>
                    <Text
                      color="#C7C7C7"
                      mb="18px"
                      mt="15px"
                      fontSize={{ lgp: "16px", base: "14px", md: "16px" }}
                      fontWeight="400"
                    >
                      (a) To process your application to become a user ► to
                      evaluate and process your application to open an account.
                      If you are approved, you can set up, review or update your
                      account information once your account has been opened
                      (including your Personal Data) online at any time.
                      <Text
                        mb="18px"
                        mt="15px"
                        fontSize={{ base: "16px", md: "18px", lgp: "18px" }}
                        fontWeight="400"
                      >
                        Use justification: consent, contract performance,
                        legitimate interests (to allow us to evaluate your
                        eligibility as a user
                      </Text>
                    </Text>
                    <Text
                      color="#C7C7C7"
                      mb="18px"
                      mt="15px"
                      fontSize={{ lgp: "16px", base: "14px", md: "16px" }}
                      fontWeight="400"
                    >
                      (b) To provide marketing materials to you ► to provide you
                      with updates and offers, where you have chosen to receive
                      these. We typically use third party e-mail service
                      providers to send e-mails. These service providers are
                      contractually prohibited from using your e-mail address
                      for any purpose other than to send e-mails related to The
                      Family Office’s operations. We provide you the ability to
                      unsubscribe from all marketing communications, without any
                      costs. Every time you receive an e-mail, you will be
                      provided with the choice to opt-out of future e-mails by
                      following the instructions provided in the e-mail. You may
                      also opt-out of receiving promotional materials by
                      contacting us.{" "}
                      <Text
                        mb="18px"
                        mt="15px"
                        fontSize={{ base: "16px", md: "18px", lgp: "18px" }}
                        fontWeight="400"
                      >
                        (c) Use justification: consent (which can be withdrawn
                        at any time);
                      </Text>
                    </Text>
                    <Text
                      color="#C7C7C7"
                      mb="18px"
                      mt="15px"
                      fontSize={{ lgp: "16px", base: "14px", md: "16px" }}
                      fontWeight="400"
                    >
                      (d) For analytics and profiling ► to tailor our marketing
                      to you. In connection with our marketing activities, we
                      analyse information that we collect about customers to
                      determine what offers are most likely to be of interest to
                      different categories of customers in different
                      circumstances and at different times. We call this the
                      creation of “segments”. Such Personal Data include
                      customer behavioural information such as transaction
                      history, preferences, service requests and interactions
                      with us. From time to time, we will assess the Personal
                      Data that we hold about you in order to assign you to a
                      particular segment. We may use the segment that you have
                      been assigned to you in order to tailor our marketing
                      communications to include offers and content that are
                      relevant to you. We may also use this method to avoid
                      sending you offers that are inappropriate or unlikely to
                      be of interest to you. You have the right to opt out of
                      such analysis of your Personal Data that we use to tailor
                      the direct marketing that we send to you, at any time.
                      <Text
                        mb="18px"
                        mt="15px"
                        fontSize={{ base: "16px", md: "18px", lgp: "18px" }}
                        fontWeight="400"
                      >
                        Use justification: consent (which can be withdrawn at
                        any time); legitimate interests (to enable us to tailor
                        our marketing to you);
                      </Text>
                    </Text>
                    <Text
                      color="#C7C7C7"
                      mb="18px"
                      mt="15px"
                      fontSize={{ lgp: "16px", base: "14px", md: "16px" }}
                      fontWeight="400"
                    >
                      (e) To comply with our legal and regulatory obligations ►
                      to comply with our legal and regulatory obligations such
                      as financial reporting requirements imposed by our
                      auditors and government authorities, and to cooperate with
                      law enforcement agencies, government authorities,
                      regulators and/or the court in connection with proceedings
                      or investigations anywhere in the world where we are
                      compelled to do so (e.g. to comply with anti-money
                      laundering, KYC obligations).
                      <Text
                        mb="18px"
                        mt="15px"
                        fontSize={{ base: "16px", md: "18px", lgp: "18px" }}
                        fontWeight="400"
                      >
                        Use justification: legal obligation, legal claims,
                        legitimate interests (to cooperate with law enforcement
                        and regulatory authorities);
                      </Text>
                    </Text>
                    <Text
                      color="#C7C7C7"
                      mb="18px"
                      mt="15px"
                      fontSize={{ lgp: "16px", base: "14px", md: "16px" }}
                      fontWeight="400"
                    >
                      (f) To handle incidents and process any claims we receive
                      ► tto handle any accidents and incidents such as liaising
                      with emergency services, and to handle any claims made by
                      customers;
                      <Text
                        mb="18px"
                        mt="15px"
                        fontSize={{ base: "16px", md: "18px", lgp: "18px" }}
                        fontWeight="400"
                      >
                        Use justification: vital interest, legal claims,
                        legitimate interests (to ensure that incidents and
                        accidents are handle appropriately and to allow us to
                        assist our customers);
                      </Text>
                    </Text>
                    <Text
                      color="#C7C7C7"
                      mb="18px"
                      mt="15px"
                      fontSize={{ lgp: "16px", base: "14px", md: "16px" }}
                      fontWeight="400"
                    >
                      (g) To improve our services and products ► to assist in
                      developing new services and products and to improve our
                      existing services and products.
                      <Text
                        mb="18px"
                        mt="15px"
                        fontSize={{ base: "16px", md: "18px", lgp: "18px" }}
                        fontWeight="400"
                      >
                        Use justification: legitimate interests (to allow us to
                        continuously improve and develop our services);
                      </Text>
                    </Text>
                    <Text
                      color="#C7C7C7"
                      mb="18px"
                      mt="15px"
                      fontSize={{ lgp: "16px", base: "14px", md: "16px" }}
                      fontWeight="400"
                    >
                      (h) To help our App function correctly and to provide
                      account maintenance activities (if your application is
                      approved) ► to help content from our App get presented in
                      the most effective manner for you and for your device, and
                      if your application is approved, to upkeep and maintain
                      your user account.
                      <Text
                        mb="18px"
                        mt="15px"
                        fontSize={{ base: "16px", md: "18px", lgp: "18px" }}
                        fontWeight="400"
                      >
                        Use justification: contract performance, legitimate
                        interests (to allow us to provide you with the content
                        and services on this App);
                      </Text>
                    </Text>
                    <Text
                      color="#C7C7C7"
                      mb="10px"
                      mt="15px"
                      fontSize={{ lgp: "16px", base: "14px", md: "16px" }}
                      fontWeight="400"
                    >
                      (i) In connection with any reorganization of our business
                      ► To analyse, or enable the analysis of, any proposed
                      sale, merger, asset acquisition, or reorganization of our
                      business.
                      <Text
                        mb="18px"
                        mt="15px"
                        fontSize={{ base: "16px", md: "18px", lgp: "18px" }}
                        fontWeight="400"
                      >
                        Use justification: contract performance, legitimate
                        interests (to allow us to continue providing services to
                        you).
                      </Text>
                    </Text>
                    <Text
                      color="#C7C7C7"
                      mb="18px"
                      mt="15px"
                      fontSize={{ lgp: "16px", base: "14px", md: "16px" }}
                      fontWeight="400"
                    >
                      (j) To process a commitment, subscription, redemption or
                      withdrawal ► to evaluate and process your commitment,
                      subscription, redemption or withdrawal
                      <Text
                        mb="18px"
                        mt="15px"
                        fontSize={{ base: "16px", md: "18px", lgp: "18px" }}
                        fontWeight="400"
                      >
                        Use justification consent, contract performance,
                        legitimate interests (to allow us to continue providing
                        services to you).
                      </Text>
                      <Text
                        mb="18px"
                        mt="15px"
                        fontSize={{ lgp: "16px", base: "14px", md: "16px" }}
                        fontWeight="400"
                      >
                        In the event that we intend to further process your
                        Personal Data for a purpose other than as set out in
                        section 2 above, we shall provide you with information
                        on that other purpose before this additional processing
                        takes place.
                      </Text>
                    </Text>
                  </Box>
                </Flex>
                <Flex mb="30px">
                  <Box
                    fontSize={{ base: "16px", md: "18px", lgp: "18px" }}
                    fontWeight="400"
                    color="#fff"
                  >
                    3.
                  </Box>{" "}
                  <Box pl="12px">
                    <Text
                      fontSize={{ base: "16px", md: "18px", lgp: "18px" }}
                      fontWeight="400"
                      color="#fff"
                    >
                      How we share Personal Data
                    </Text>
                  </Box>
                </Flex>
                <Flex mb="30px">
                  <Box
                    fontSize={{ base: "16px", md: "18px", lgp: "18px" }}
                    fontWeight="400"
                  >
                    3.1
                  </Box>{" "}
                  <Box pl="12px">
                    <Text
                      fontSize={{ base: "16px", md: "18px", lgp: "18px" }}
                      fontWeight="400"
                      color="#C7C7C7"
                    >
                      We may share your Personal Data in the following ways.
                      {/* <Text
                        fontSize={{ lgp: "16px", base: "14px", md: "16px" }}
                        fontWeight="400"
                      >
                        Please note that use of Personal Data under applicable
                        data protection laws must be justified under one of a
                        number of legal “grounds” and we are required to set out
                        the grounds in respect of each use in this Privacy
                        Policy.
                      </Text> */}
                    </Text>
                    <Text
                      color="#C7C7C7"
                      mb="18px"
                      mt="15px"
                      fontSize={{ lgp: "16px", base: "14px", md: "16px" }}
                      fontWeight="400"
                    >
                      (a) Third party service providers who process Personal
                      Data on our behalf to help us undertake the activities
                      described in section 2 ► We may permit selected third
                      parties such as business partners, suppliers, service
                      providers, agents, contractors and other The Family Office
                      affiliates to use your Personal Data for the purposes set
                      out in section 2, including mail houses and e-mail service
                      providers that we engage to send and disseminate
                      promotional materials for The Family Office products, data
                      center providers that host our servers and third party
                      agents that process mailing, requests, and transactions on
                      our behalf. These parties are contractually prohibited
                      from using Personal Data for any purpose other than for
                      the purpose specified in their respective contracts, and
                      will be subject to obligations to process Personal Data in
                      compliance with the same safeguards that we deploy. We
                      also provide non-personally identifiable information to
                      these parties for their use on an aggregated basis for the
                      purpose of performing their contractual obligations to us.
                      We do not permit the sale of Personal Data to entities
                      outside of The Family Office for any use unrelated to our
                      group operations or use of Personal Data by third party
                      for their own purposes.
                    </Text>
                    <Text
                      color="#C7C7C7"
                      mb="18px"
                      mt="15px"
                      fontSize={{ lgp: "16px", base: "14px", md: "16px" }}
                      fontWeight="400"
                    >
                      (b) Law enforcement agencies, government authorities,
                      regulators and the court in order to comply with our legal
                      obligations or to handle incidents/ claims ► We may
                      disclose your Personal Data when required by relevant law
                      or court order, or as requested by other government or law
                      enforcement authorities, or any agency, court, regulator
                      or other third party where we believe this is necessary to
                      assist with proceedings or investigations. Where
                      permitted, we will direct any such request to you or
                      notify you before responding unless to do so would
                      prejudice the prevention or detection of a crime. This
                      also applies when we have reason to believe that
                      disclosing the Personal Data is necessary to obtain legal
                      advice, to identify, investigate, protect, contact, or
                      bring legal action against someone who may be causing
                      interference with our guests, visitors, associates, rights
                      or properties, or to others, whether intentionally or
                      otherwise, or when anyone else could be harmed by such
                      activities.
                    </Text>
                    <Text
                      color="#C7C7C7"
                      mb="18px"
                      mt="15px"
                      fontSize={{ lgp: "16px", base: "14px", md: "16px" }}
                      fontWeight="400"
                    >
                      (c) Third parties who require such data in connection with
                      a change in the structure of our business ► In the event
                      that we (or a part thereof) are (i) subject to
                      negotiations for the sale of our business or (ii) sold to,
                      merge with, or sell substantially all of our assets to a
                      third party or (iii) undergo a reorganization, you agree
                      that any of your Personal Data which we hold may be
                      transferred to that reorganized entity or third party and
                      used for the same purposes as set out in this Privacy
                      Policy, or for the purpose of analysing any proposed sale
                      or re-organisation. We will ensure that no more of your
                      Personal Data is transferred than necessary.
                    </Text>
                  </Box>
                </Flex>
                <Flex mb="30px">
                  <Box
                    fontSize={{ base: "16px", md: "18px", lgp: "18px" }}
                    fontWeight="400"
                  >
                    3.2
                  </Box>{" "}
                  <Box pl="12px">
                    <Text
                      fontSize={{ base: "16px", md: "18px", lgp: "18px" }}
                      fontWeight="400"
                      color="#C7C7C7"
                    >
                      3.2 This Privacy Policy does not apply to our processing
                      of personal information on behalf of, or at the direction
                      of, third party providers who may collect personal
                      information from you and provide it to us. In this
                      situation, we would merely act as a data processor and
                      thus advise you to review applicable third-party
                      providers’ privacy policies before submitting your
                      personal information.
                    </Text>
                  </Box>
                </Flex>
              </Box>
              <Box m="0px" textAlign="start">
                <Box
                  as="p"
                  m="0"
                  fontSize={{ base: "16px", md: "18px", lgp: "18px" }}
                  fontWeight="400"
                  color="#fff"
                  py="10px"
                >
                  Use justifications and legal grounds
                </Box>
                <Box
                  as="p"
                  color="#C7C7C7"
                  mb="18px"
                  p={{ lgp: "0 70px", base: "0 39px", md: "0 70px" }}
                  fontSize={{ lgp: "16px", base: "14px", md: "16px" }}
                  fontWeight="400"
                >
                  We note the grounds we use to justify each use of your
                  information next to the use in the How we use Personal Data
                  and How we share Personal Data sections of this policy.
                </Box>
                <Text
                  as="p"
                  color="#C7C7C7"
                  mb="18px"
                  p={{ lgp: "0 70px", base: "0 39px", md: "0 70px" }}
                  fontSize={{ lgp: "16px", base: "14px", md: "16px" }}
                  fontWeight="400"
                >
                  These are the principal legal grounds that justify our use of
                  your Personal Data:{" "}
                </Text>
              </Box>
              <Box
                textAlign="start"
                w="80%"
                margin="30px auto"
                border="1px solid"
              >
                <Text border="1px solid" p="5px 10px">
                  <Text
                    fontStyle="italic"
                    fontWeight="700"
                    as="span"
                    color="#fff"
                  >
                    Consent:
                  </Text>{" "}
                  where you have consented to our use of your Personal Data
                </Text>
                <Text border="1px solid" p="5px 10px">
                  <Text
                    fontStyle="italic"
                    fontWeight="700"
                    as="span"
                    color="#fff"
                  >
                    Contract performance :
                  </Text>{" "}
                  where your Personal Data is necessary to enter into or perform
                  our contract with you.
                </Text>
                <Text border="1px solid #9a8d8d" p="5px 10px">
                  <Text
                    fontStyle="italic"
                    fontWeight="700"
                    as="span"
                    color="#fff"
                  >
                    Legal and regulatory obligation:
                  </Text>{" "}
                  where we need to use your Personal Data to comply with our
                  legal and regulatory obligations.
                </Text>
                <Text border="1px solid #9a8d8d" p="5px 10px">
                  <Text
                    fontStyle="italic"
                    fontWeight="700"
                    as="span"
                    color="#fff"
                  >
                    Legitimate interests:
                  </Text>{" "}
                  where we use your Personal Data to achieve a legitimate
                  interest and our reasons for using it outweigh any prejudice
                  to your data protection rights.
                </Text>
                <Text border="1px solid #9a8d8d" p="5px 10px">
                  <Text
                    fontStyle="italic"
                    fontWeight="700"
                    as="span"
                    color="#fff"
                  >
                    Legal claims:
                  </Text>{" "}
                  where your information is necessary for us to defend,
                  prosecute or make a claim against you, us or a third party.
                </Text>
                <Text border="1px solid #9a8d8d" p="5px 10px">
                  <Text
                    fontStyle="italic"
                    fontWeight="700"
                    as="span"
                    color="#fff"
                  >
                    Vital interest:
                  </Text>{" "}
                  where we need to process your Personal Data to protect the
                  vital interest of you or another natural person e.g. where you
                  require urgent assistance
                </Text>
              </Box>
              <Box mt="20px" textAlign="start">
                <Flex mb="30px">
                  <Box
                    fontSize={{ base: "16px", md: "18px", lgp: "18px" }}
                    fontWeight="400"
                    color="#fff"
                  >
                    4.
                  </Box>{" "}
                  <Box pl="12px">
                    <Text
                      fontSize={{ base: "16px", md: "18px", lgp: "18px" }}
                      fontWeight="400"
                      color="#fff"
                    >
                      How we transmit, protect and store Personal Data Security
                      over the internet
                    </Text>
                    {/* <Text
                      color="#C7C7C7"
                      mb="18px"
                      mt="15px"
                      fontSize={{ lgp: "16px", base: "14px", md: "16px" }}
                      fontWeight="400"
                    >
                      The term “Personal Data” refers to any information that
                      can be used to identify you, or that can be linked to you,
                      as an individual.
                    </Text> */}
                  </Box>
                </Flex>
                <Flex mb="30px">
                  <Box
                    fontSize={{ base: "16px", md: "18px", lgp: "18px" }}
                    fontWeight="400"
                  >
                    4.1
                  </Box>{" "}
                  <Box pl="12px">
                    <Text
                      fontSize={{ base: "16px", md: "18px", lgp: "18px" }}
                      fontWeight="400"
                      color="#C7C7C7"
                    >
                      It is important to note that all Internet communication is
                      not secure. There is a risk inherent in the use of e-mail.
                      Please be aware of this when requesting information or
                      sending forms to us by e-mail, for example, from the
                      “Contact Us” section. We recommend that you do not include
                      any sensitive information when using e-mail or using any
                      public computers/public WIFI. Our e-mail responses to you
                      may not include any sensitive or confidential information.
                      Please bear in mind that no security system or system of
                      transmitting information over the Internet is guaranteed
                      to be secure.
                    </Text>
                  </Box>
                </Flex>
                <Flex mb="30px">
                  <Box
                    fontSize={{ base: "16px", md: "18px", lgp: "18px" }}
                    fontWeight="400"
                  >
                    4.2
                  </Box>{" "}
                  <Box pl="12px">
                    <Text
                      fontSize={{ base: "16px", md: "18px", lgp: "18px" }}
                      fontWeight="400"
                      color="#C7C7C7"
                    >
                      If your application is successful and a user account is
                      set up, you should always close your browsers when you
                      have finished completing a form. Although the session will
                      automatically terminate after a short period of
                      inactivity, it is easier for a third party to gain access
                      to your profile whilst you are logged onto your account.
                    </Text>
                  </Box>
                </Flex>
                <Flex mb="30px">
                  <Box
                    fontSize={{ base: "16px", md: "18px", lgp: "18px" }}
                    fontWeight="400"
                  >
                    4.3
                  </Box>{" "}
                  <Box pl="12px">
                    <Text
                      fontSize={{ base: "16px", md: "18px", lgp: "18px" }}
                      fontWeight="400"
                      color="#C7C7C7"
                    >
                      We treat all Personal Data that you provide to us as
                      confidential information. To prevent Personal Data from
                      unauthorised access or leakage, we have adopted and
                      regularly monitor our security and data privacy policies
                      and procedures. We use SSL protocol – an industry standard
                      for encryption over the Internet, to protect the Data.
                      When you type in sensitive information, it will be
                      automatically encrypted and transferred over a SSL
                      connection. This ensures that your sensitive Data is
                      encrypted as it travels over the Internet. You will know
                      that you are in a secure mode when the security icon (such
                      as a lock) appears in the screen.
                    </Text>
                  </Box>
                </Flex>
                <Text
                  mb="10px"
                  mt="15px"
                  fontSize={{ base: "16px", md: "18px", lgp: "18px" }}
                  color="#ffffff"
                  fontFamily="700"
                >
                  Security controls
                </Text>
                <Flex mb="30px">
                  <Box
                    fontSize={{ base: "16px", md: "18px", lgp: "18px" }}
                    fontWeight="400"
                  >
                    4.4
                  </Box>{" "}
                  <Box pl="12px">
                    <Text
                      fontSize={{ base: "16px", md: "18px", lgp: "18px" }}
                      fontWeight="400"
                      color="#C7C7C7"
                    >
                      Where we have given you (or where you have chosen) a
                      password, you are responsible for keeping this password
                      confidential and for complying with any other security
                      procedures that we notify you of. We ask you not to share
                      a password with anyone.
                    </Text>
                  </Box>
                </Flex>
                <Flex mb="30px">
                  <Box
                    fontSize={{ base: "16px", md: "18px", lgp: "18px" }}
                    fontWeight="400"
                  >
                    4.5
                  </Box>{" "}
                  <Box pl="12px">
                    <Text
                      fontSize={{ base: "16px", md: "18px", lgp: "18px" }}
                      fontWeight="400"
                      color="#C7C7C7"
                    >
                      The Family Office trains its employees and staff on the
                      importance of data privacy and protection. Our Privacy
                      Policy is updated as required to reflect any changes in
                      applicable laws and developments in best practice
                      procedures. Further, we limit the number of individuals
                      within the companies with access to Personal Data to those
                      directly involved in the process of providing quality
                      service to you.
                    </Text>
                  </Box>
                </Flex>
                <Flex mb="30px">
                  <Box
                    fontSize={{ base: "16px", md: "18px", lgp: "18px" }}
                    fontWeight="400"
                  >
                    4.6
                  </Box>{" "}
                  <Box pl="12px">
                    <Text
                      fontSize={{ base: "16px", md: "18px", lgp: "18px" }}
                      fontWeight="400"
                      color="#C7C7C7"
                    >
                      We store certain customer information in our Customer
                      Information System. Both systems are secure customer
                      databases stored on a dedicated server located in a data
                      centre in Ireland hosted by a third party service
                      provider. Our server resides behind firewalls to protect
                      Personal Data collected from you against unauthorised or
                      accidental access. Because laws applicable to personal
                      information vary by country, our business operations may
                      put in place additional measures that vary depending on
                      the applicable legal requirements.
                    </Text>
                    <Text
                      mb="10px"
                      mt="15px"
                      fontSize={{ base: "16px", md: "18px", lgp: "18px" }}
                      color="#ffffff"
                      fontFamily="700"
                    >
                      Data transmission across international borders
                    </Text>
                  </Box>
                </Flex>

                <Flex mb="30px">
                  <Box
                    fontSize={{ base: "16px", md: "18px", lgp: "18px" }}
                    fontWeight="400"
                  >
                    4.7
                  </Box>{" "}
                  <Box pl="12px">
                    <Text
                      fontSize={{ base: "16px", md: "18px", lgp: "18px" }}
                      fontWeight="400"
                      color="#C7C7C7"
                    >
                      The nature of our business and our operations require us
                      to transfer your Personal Data to other authorized
                      distributors, centres of operations, data centres, or
                      service providers that may be located in countries outside
                      of your own for the purposes mentioned in this Privacy
                      Policy. Although the data protection and other laws of
                      these various countries may not be as comprehensive as
                      those in your own country, The Family Office will take
                      appropriate measures, including implementing up to date
                      contractual clauses, to secure the transfer of your Data
                      to recipients (which may be internal or external to The
                      Family Office) located in a country with a level of
                      protection different from the one existing in the country
                      in which your Data is collected.
                    </Text>
                  </Box>
                </Flex>
                <Flex mb="30px">
                  <Box
                    fontSize={{ base: "16px", md: "18px", lgp: "18px" }}
                    fontWeight="400"
                  >
                    4.8
                  </Box>{" "}
                  <Box pl="12px">
                    <Text
                      fontSize={{ base: "16px", md: "18px", lgp: "18px" }}
                      fontWeight="400"
                      color="#C7C7C7"
                    >
                      Where your Personal Data may be transferred to a country
                      in which data protection laws may be of a lower standard
                      than in the transferor country, The Family Office will
                      impose the same data protection safeguards that we deploy
                      in the countries in which we operate to ensure an adequate
                      level of protection for this data.
                    </Text>
                  </Box>
                </Flex>
                <Flex mb="30px">
                  <Box
                    fontSize={{ base: "16px", md: "18px", lgp: "18px" }}
                    fontWeight="400"
                  >
                    4.9
                  </Box>{" "}
                  <Box pl="12px">
                    <Text
                      fontSize={{ base: "16px", md: "18px", lgp: "18px" }}
                      fontWeight="400"
                      color="#C7C7C7"
                    >
                      The Personal Data collected using the means located in
                      Bahrain may be required to be transferred outside Bahrain
                      for processing. As there are no approved jurisdictions
                      that provide adequate level of data protection required
                      under Bahrain law, any transfer of Personal Data outside
                      Bahrain requires your consent. As business requirement we
                      may transfer your Personal Data to Kingdom of Saudi
                      Arabia, Switzerland, and Ireland (“Consented
                      Jurisdictions”) and you consent to the transfer of your
                      Personal Data to the Consented Jurisdictions.
                    </Text>
                    <Text
                      mb="10px"
                      mt="15px"
                      fontSize={{ base: "16px", md: "18px", lgp: "18px" }}
                      color="#ffffff"
                      fontFamily="700"
                    >
                      Retention
                    </Text>
                  </Box>
                </Flex>

                <Flex mb="30px">
                  <Box
                    fontSize={{ base: "16px", md: "18px", lgp: "18px" }}
                    fontWeight="400"
                  >
                    4.10
                  </Box>{" "}
                  <Box pl="12px">
                    <Text
                      fontSize={{ base: "16px", md: "18px", lgp: "18px" }}
                      fontWeight="400"
                      color="#C7C7C7"
                    >
                      Your Personal Data will be stored for the period of time
                      required or permitted by law in the jurisdiction of the
                      operation holding the information (for example certain
                      transaction details and correspondence may be retained
                      until the time limit for claims in respect of the
                      transaction has expired or in order to comply with
                      regulatory requirements regarding the retention of such
                      data). So if information is used for two purposes we will
                      retain it until the purpose with the latest period
                      expires; but we will stop using it for the purpose with a
                      shorter period once that period expires.
                    </Text>
                  </Box>
                </Flex>
                <Flex mb="30px">
                  <Box
                    fontSize={{ base: "16px", md: "18px", lgp: "18px" }}
                    fontWeight="400"
                  >
                    4.11
                  </Box>{" "}
                  <Box pl="12px">
                    <Text
                      fontSize={{ base: "16px", md: "18px", lgp: "18px" }}
                      fontWeight="400"
                      color="#C7C7C7"
                    >
                      Our retention periods are based on business needs, and
                      your information that is no longer needed is either
                      irreversibly anonymised (and the anonymised information
                      may be retained) or securely destroyed once the purpose
                      for which we collected this personal data is no longer
                      applicable. By way of example:
                    </Text>
                    <Text color="#C7C7C7" mb="10px" mt="15px">
                      (a) use for marketing: in relation to your Personal Data
                      used for marketing purposes, we may retain your Personal
                      Data for that purpose after we have obtained consent to
                      market to you, or the date you last responded to a
                      marketing communication from us (other than to opt out of
                      receiving further communications);
                    </Text>
                    <Text color="#C7C7C7" mb="10px" mt="15px">
                      (b) use to perform a contract: in relation to your
                      Personal Data used to perform any contractual obligation
                      with you, we may retain that Personal Data whilst the
                      contract remains and for a certain period thereafter to
                      deal with any queries or claims thereafter; and
                    </Text>
                    <Text color="#C7C7C7" mb="10px" mt="15px">
                      (c) where claims are contemplated: in relation to any
                      information where we reasonably believe it will be
                      necessary to defend or prosecute or make a claim against
                      you, us or a third party, we may retain that information
                      for as long as that claim could be pursued.
                    </Text>
                    <Text mb="10px" mt="15px" color="#ffffff" fontFamily="700">
                      Monitor and Retention of Electronic Communications
                    </Text>
                  </Box>
                </Flex>
                <Flex mb="30px">
                  <Box
                    fontSize={{ base: "16px", md: "18px", lgp: "18px" }}
                    fontWeight="400"
                  >
                    4.12
                  </Box>{" "}
                  <Box pl="12px">
                    <Text
                      fontSize={{ base: "16px", md: "18px", lgp: "18px" }}
                      fontWeight="400"
                      color="#C7C7C7"
                    >
                      We reserve the right, to the extent permissible under
                      applicable law, regulation or rule, to monitor and record,
                      without notification, any or all communications (including
                      email, SMS and instant messages) and phone calls. Further,
                      you consent to the use of any such recording as evidence
                      in any action or proceeding arising out of this Privacy
                      Policy, and to The Family Office’s erasure of any
                      recordings, in our discretion, as part of our regular
                      procedure for the handling of recordings.
                    </Text>
                  </Box>
                </Flex>
                <Flex mb="30px">
                  <Box
                    fontSize={{ base: "16px", md: "18px", lgp: "18px" }}
                    fontWeight="400"
                    color="#fff"
                  >
                    5.
                  </Box>{" "}
                  <Box pl="12px">
                    <Text
                      fontSize={{ base: "16px", md: "18px", lgp: "18px" }}
                      fontWeight="400"
                      color="#fff"
                    >
                      Your rights Opt-out of marketing
                    </Text>
                  </Box>
                </Flex>
                <Flex mb="30px">
                  <Box
                    fontSize={{ base: "16px", md: "18px", lgp: "18px" }}
                    fontWeight="400"
                  >
                    5.1
                  </Box>{" "}
                  <Box pl="12px">
                    <Text
                      fontSize={{ base: "16px", md: "18px", lgp: "18px" }}
                      fontWeight="400"
                      color="#C7C7C7"
                    >
                      You have the right to ask us not to process your Personal
                      Data for marketing purposes. You can also exercise the
                      right at any time by contacting us.
                    </Text>
                  </Box>
                </Flex>
                <Text mb="10px" mt="15px" color="#ffffff" fontFamily="700">
                  Other rights
                </Text>
                <Flex mb="30px">
                  <Box
                    fontSize={{ base: "16px", md: "18px", lgp: "18px" }}
                    fontWeight="400"
                  >
                    5.2
                  </Box>{" "}
                  <Box pl="12px">
                    <Text
                      fontSize={{ base: "16px", md: "18px", lgp: "18px" }}
                      fontWeight="400"
                      color="#C7C7C7"
                    >
                      Subject to various exceptions and data protection laws in
                      your country, you may have the following rights:
                    </Text>
                    <Text color="#C7C7C7" mb="10px" mt="15px">
                      (a) Access: you can ask us to provide you with further
                      details on the use we make of your Personal Data and a
                      copy of the Personal Data we hold about you;
                    </Text>
                    <Text color="#C7C7C7" mb="10px" mt="15px">
                      (b) Correction: you can ask us to correct any inaccuracies
                      in the Personal Data we hold about you;
                    </Text>
                    <Text color="#C7C7C7" mb="10px" mt="15px">
                      (c) Complaint: if you are not satisfied with our use of
                      your Personal Data or our response to any exercise of
                      these rights, you have the right to complain to the data
                      protection authority in your country (if one exists);
                    </Text>
                    <Text color="#C7C7C7" mb="10px" mt="15px">
                      (d) Erasure: you can ask us to delete your Personal Data
                      if we no longer have a lawful ground to use;
                    </Text>
                    <Text color="#C7C7C7" mb="10px" mt="15px">
                      (e) Withdrawal of consent: where processing is based on
                      consent (e.g. marketing), you can withdraw your consent to
                      processing so that we stop that particular processing
                    </Text>
                    <Text color="#C7C7C7" mb="10px" mt="15px">
                      (f) Object to processing: you have the right to object to
                      other types of processing (e.g. analytics and profiling
                      activities carried out in relation to your Personal Data
                      or any processing that causes material or moral damage to
                      you), unless our reasons for undertaking that processing
                      outweigh any prejudice to your data protection rights;
                    </Text>
                    <Text color="#C7C7C7" mb="10px" mt="15px">
                      (g) Restriction: you can restrict how we use your Personal
                      data, for example whilst we are verifying the accuracy of
                      your Personal Data or where we are verifying the grounds
                      that use as the basis of holding your Personal Data;
                    </Text>
                    <Text color="#C7C7C7" mb="10px" mt="15px">
                      (h) Portability: where technically feasible, you have the
                      right to ask us to transmit the Personal Data that you
                      have provided to us to a third party in a structured,
                      commonly use and machine readable form.
                    </Text>
                  </Box>
                </Flex>
                <Text mb="10px" mt="15px" color="#ffffff" fontFamily="700">
                  Updating or modifying information
                </Text>
                <Flex mb="30px">
                  <Box>5.3</Box>{" "}
                  <Box pl="12px">
                    <Text
                      fontSize={{ base: "16px", md: "18px", lgp: "18px" }}
                      fontWeight="400"
                      color="#C7C7C7"
                    >
                      We will use reasonable endeavours to ensure that your
                      Personal Data is accurate. In order to assist us with
                      this, you should notify us of any changes to the Personal
                      Data that you have provided to us by contacting us.
                    </Text>
                  </Box>
                </Flex>
                <Text mb="10px" mt="15px" color="#ffffff" fontFamily="700">
                  Notifications in the event of breach
                </Text>
                <Flex mb="30px">
                  <Box>5.4</Box>{" "}
                  <Box pl="12px">
                    <Text
                      fontSize={{ base: "16px", md: "18px", lgp: "18px" }}
                      fontWeight="400"
                      color="#C7C7C7"
                    >
                      In the unlikely event of a data breach, we are prepared to
                      follow any laws and regulations which would require us to
                      notify you of the disclosure of private information
                    </Text>
                  </Box>
                </Flex>
                <Flex mb="30px">
                  <Box>6.</Box>{" "}
                  <Box pl="12px">
                    <Text
                      fontSize={{ base: "16px", md: "18px", lgp: "18px" }}
                      fontWeight="400"
                      color="#fff"
                    >
                      Cookies
                    </Text>
                    <Text color="#C7C7C7" mb="10px" mt="15px">
                      Our App uses cookies to collect and store certain
                      information about you, and to distinguish you from other
                      users of this App. This helps us provide you with a good
                      experience when you browse our App and also allows us to
                      improve our App. A cookie is a small text file which is
                      sent by a App, accepted by a web browser and then placed
                      on your hard drive. The information collected from cookies
                      lets us know that you visited our App in the past, and
                      helps you avoid having to re-enter information on each
                      visit in order to use some of our products or services,
                      among other things. We use a variety of cookies in this
                      App:
                    </Text>
                    <Text color="#C7C7C7" mb="10px" mt="15px">
                      Strictly Necessary ► These cookies are necessary for the
                      App to function and cannot be switched off in our systems.
                      They are usually only set in response to actions made by
                      you which amount to a request for services, such as
                      setting your privacy preferences, logging in or filling in
                      forms. You can set your browser to block or alert you
                      about these cookies, but if you do so, some parts of the
                      site will not work. These cookies do not store any
                      personal information.
                    </Text>
                    <Text color="#C7C7C7" mb="10px" mt="15px">
                      Performance Cookies ► These cookies allow us to count
                      visits and traffic sources so we can measure and improve
                      the performance of our site. They help us to know which
                      pages are the most and least popular and see how visitors
                      move around the site. All information these cookies
                      collect is aggregated and therefore anonymous. If you do
                      not allow these cookies we will not know when you have
                      visited our site, and will not be able to monitor its
                      performance.
                    </Text>
                    <Text color="#C7C7C7" mb="10px" mt="15px">
                      Functional Cookies ► These cookies enable the App to
                      provide enhanced functionality and personalization. They
                      may be set by us or by third party providers whose
                      services we have added to our pages. If you do not allow
                      these cookies, some or all of these services may not
                      function properly.
                    </Text>
                    <Text color="#C7C7C7" mb="10px" mt="15px">
                      Targeting Cookies ► These cookies may be set through our
                      site by our advertising partners. They may be used by
                      those companies to build a profile of your interests and
                      show you relevant ads on other sites. They do not store
                      directly personal information, but are based on uniquely
                      identifying your browser and internet device. If you do
                      not allow these cookies, you will experience less targeted
                      advertising.
                    </Text>
                    <Text color="#C7C7C7" mb="10px" mt="15px">
                      Social Media Cookies ► These cookies are set by a range of
                      social media services that we may have added to the site
                      to enable you to share our content with your friends and
                      social or professional networks. They are capable of
                      tracking your browser across other sites and building up a
                      profile of your interests. This may impact the content and
                      messages you see on other websites you visit. If you do
                      not allow these cookies, you may not be able to use or see
                      these sharing tools.
                    </Text>
                  </Box>
                </Flex>
                <Flex mb="30px">
                  <Box>7.</Box>{" "}
                  <Box pl="12px">
                    <Text
                      fontSize={{ base: "16px", md: "18px", lgp: "18px" }}
                      fontWeight="400"
                      color="#fff"
                    >
                      Changes to the Privacy Policy
                    </Text>
                    <Text color="#C7C7C7" mb="10px" mt="15px">
                      In the future, we may need to make additional changes. All
                      additional changes will be included in the latest Privacy
                      Policy published on this App, so that you will always
                      understand our current practices with respect to the
                      information we gather, how we might use that information
                      and disclosures of that information to third parties. You
                      can tell when this Privacy Policy was last updated by
                      looking at the date at the bottom of the Privacy Policy.
                      The Family Office reserves the right, in its sole
                      discretion, to modify, alter or otherwise update this
                      Privacy Policy at any time. Any changes will be effective
                      only after the effective date of the change and will not
                      affect any dispute arising prior to the effective date of
                      the change.
                    </Text>
                  </Box>
                </Flex>
                <Flex mb="30px">
                  <Box>8.</Box>{" "}
                  <Box pl="12px">
                    <Text
                      fontSize={{ base: "16px", md: "18px", lgp: "18px" }}
                      fontWeight="400"
                      color="#fff"
                    >
                      Other Sites
                    </Text>
                    <Text color="#C7C7C7" mb="10px" mt="15px">
                      This App may contain links to other third-party websites.
                      If you follow a link to any of those third party websites,
                      please note that they have their own privacy policies and
                      that we do not accept any responsibility or liability for
                      their policies or processing of your personal information.
                      Please check these policies before you submit any personal
                      information to such third party websites.
                    </Text>
                  </Box>
                </Flex>
                <Flex mb="30px">
                  <Box>9.</Box>{" "}
                  <Box pl="12px">
                    <Text
                      fontSize={{ base: "16px", md: "18px", lgp: "18px" }}
                      fontWeight="400"
                      color="#fff"
                    >
                      Additional Rights
                    </Text>
                    <Text color="#C7C7C7" mb="10px" mt="15px">
                      Applicable laws may give you additional rights that are
                      not described in this Privacy Policy.
                    </Text>
                  </Box>
                </Flex>
              </Box>
              <Text
                w="100%"
                margin="auto"
                borderBottom="1px solid #222222"
              ></Text>
              <Box textAlign="start" mt="30px">
                <Text color="#ffffff" mb="30px" fontWeight="700">
                  Contact Us
                </Text>
                <Text mb="30px">
                  For further information, or inquiries about this User
                  Agreement or Privacy Policy please contact:
                </Text>
                <Box mb="30px">
                  <Text>Client Services</Text>
                  <Text color="primary.500" fontWeight="600">
                    onboarding@tfoco.com
                  </Text>
                </Box>
              </Box>
              <Box mb="30px">
                <Text mb="15px" textAlign="start">
                  I am of legal age to enter into, and I hereby do enter into,
                  this User Agreement.
                </Text>
                <Box d="flex" mb="15px" style={{ gap: "4px" }}>
                  <Checkbox
                    colorScheme="primary"
                    color="gray.400"
                    fontWeight="400"
                    fontSize="14px"
                  />
                  <Text textAlign="start"> [I accept]</Text>
                </Box>
                <Box d="flex" mb="15px" style={{ gap: "4px" }}>
                  <Checkbox
                    colorScheme="primary"
                    color="gray.400"
                    fontWeight="400"
                    fontSize="14px"
                  />
                  <Text textAlign="start">
                    [I consent to the treatment of my personal information
                    transmitted to or collected by The Family Office in
                    accordance with Digital Client App Privacy Policy]
                  </Text>
                </Box>
                <Text mb="15px" textAlign="start">
                  [Users must check both boxes in order to proceed and use the
                  Digital Client App]
                </Text>
              </Box>
            </ModalBody>
          ) : (
            <>
              <ModalBody
                overflow="auto"
                px={{ lgp: "30px", md: "30px", base: "16px" }}
                py="12px"
                mr="10px"
                css={{
                  "&::-webkit-scrollbar": {
                    width: "4px",
                    background: "#222",
                  },
                  "&::-webkit-scrollbar-track": {
                    width: "6px",
                  },
                  "&::-webkit-scrollbar-thumb": {
                    background: "#4D4D4D",
                    borderRadius: "5px",
                  },
                }}
              >
                <Box m="0px">
                  <Box
                    as="p"
                    mb="24px"
                    textAlign="start"
                    fontSize={{ lgp: "20px", base: "18px", md: "20px" }}
                    color="#fff"
                    pt="10px"
                    fontWeight="600"
                  >
                    سياسة شركة
                    <span style={{ direction: "rtl" }}>
                      {" "}
                      The Family Office Co. BSC (C)&#x200E;{" "}
                    </span>
                    للخصوصية
                  </Box>
                  <Box
                    as="p"
                    color="#fff"
                    mb="18px"
                    textAlign="start"
                    fontSize={{ lgp: "16px", base: "14px", md: "16px" }}
                    fontWeight="400"
                  >
                    اتفاقية. يُرجى قراءة المعلومات التالية قراءة دقيقة قبل
                    استخدام هذا الموقع. بالنقر فوق زر "أوافق" أدناه، فإنك توافق
                    على الالتزام بجميع الشروط والأحكام الواردة في اتفاقية
                    المستخدم هذه. إذا كنت لا توافق على أي قسم من أقسام اتفاقية
                    المستخدم، فلا تستخدم هذا الموقع. تحتفظ شركة{" "}
                    <span style={{ direction: "rtl" }}>
                      {" "}
                      The Family Office Co. BSC (C)&#x200E;{" "}
                    </span>{" "}
                    “The Family Office”(المعرَّفة أدناه) بالحق، حسب تقديرها هي
                    وحدها، في تعديل أو تغيير أو تحديث هذه الاتفاقية في أي وقت
                    تراه، وبالنقر فوق زر "أوافق" الخاص بالمراجعات، فإنك تقبل
                    عمليات التعديل. وإذا اقتضى الأمر، فقد نقدم أيضاً آليات
                    إضافية لإبداء الموافقة على التغييرات التي قد تطرأ على هذه
                    الاتفاقية. ولن تصبح أي تغييرات سارية المفعول إلا بعد تاريخ
                    نفاذ التغيير ولن يؤثر ذلك على أي نزاع ينشأ قبل تاريخ نفاذ
                    التغيير.
                  </Box>
                  <Box
                    as="p"
                    color="#C7C7C7"
                    mb="18px"
                    textAlign="start"
                    fontSize={{ lgp: "16px", base: "14px", md: "16px" }}
                    fontWeight="400"
                  >
                    الموقع الإلكتروني لشركة The Family Office عبر الإنترنت
                    ("الموقع") والمستضاف على العنوان التالي
                    https://www.tfoco.com هو منصة رقمية عبر الإنترنت يمكنك
                    التقدم من خلالها لفتح حساب لدى تزويدنا بمعلومات محددة وكذلك
                    الاطلاع على معلومات محددة عن The Family Office وبعض الشركات
                    التابعة لها، وهي متاحة طالما إلتزمت بالشروط والأحكام الموضحة
                    أدناه. لا يوجد في اتفاقية المستخدم هذه أو في الموقع
                    الإلكتروني ما يمكن تأويله باعتباره ينشئ أي ضمانات أو
                    إلتزامات أخرى من طرف شركة The Family Office
                  </Box>
                  <Box
                    as="p"
                    color="#c7c7c7"
                    mb="18px"
                    textAlign="start"
                    fontSize={{ lgp: "16px", base: "14px", md: "16px" }}
                    fontWeight="400"
                  >
                    هذا الموقع موجه فقط لعملاء شركة The Family Office (الشركة)
                    الحاليين والمستقبليين. وتختص اتفاقية المستخدم هذه بالموقع
                    الإلكتروني فقط، وهي تخضع لآليات تسوية النزاعات المنصوص عليها
                    في حزمة فتح الحساب. إذا تبين وجود أي تعارض، فإن الأولوية
                    تكون لشروط اتفاقية المستخدم هذه على حزمة فتح الحساب فيما
                    يتعلق بالموقع الإلكتروني فقط، وبخلاف ذلك، تكون الأولوية
                    لشروط حزمة فتح الحساب فيما يتعلق بعلاقتك مع الشركة.
                  </Box>
                  <Box
                    as="p"
                    color="#C7C7C7"
                    mb="18px"
                    textAlign="start"
                    fontSize={{ lgp: "16px", base: "14px", md: "16px" }}
                    fontWeight="400"
                  >
                    هذا الموقع غير مخصص للاستخدام من قبل أفراد تقل أعمارهم عن
                    ثمانية عشر عاماً (18). ويجب ألا يقل عمر مستخدمي هذا الموقع
                    عن 18 عاماً، أو أن يكونوا قد بلغوا السن القانونية التي
                    تؤهلهم للدخول في اتفاقيات تقع ضمن اختصاص المستخدم، أيهما
                    أكبر
                  </Box>
                  <Box
                    as="p"
                    color="#C7C7C7"
                    mb="18px"
                    textAlign="start"
                    fontSize={{ lgp: "16px", base: "14px", md: "16px" }}
                    fontWeight="400"
                  >
                    هذا الموقع مخصص لاستخدام الأفراد المقيمين ضمن اختصاصات
                    قضائية مسموح بها.
                  </Box>
                </Box>
                <Box m="0px" textAlign="start">
                  <Box
                    as="p"
                    m="0"
                    fontSize={{ base: "16px", md: "18px", lgp: "18px" }}
                    fontWeight="400"
                    color="#fff"
                    py="10px"
                  >
                    إخلاء المسؤولية عن الضمان وتقييد المسؤولية
                  </Box>
                  <Box
                    as="p"
                    color="#C7C7C7"
                    mb="18px"
                    fontSize={{ lgp: "16px", base: "14px", md: "16px" }}
                    fontWeight="400"
                  >
                    يتم تقديم هذا الموقع والمعلومات الواردة فيه "كما هي" دون أي
                    ضمان من أي نوع، سواء كان صريحاً أم ضمنياً، بما في ذلك، على
                    سبيل المثال لا الحصر، الضمانات المضمَّنة المتعلقة بالقابلية
                    للتسويق أو الملاءمة لغرض معين أو عدم الانتهاك. لا تضمن
                    الشركة أن هذا الموقع الإلكتروني لن يتعرض للانقطاع أو أنه
                    سيكون خالياً من الأخطاء، أو أن هذه الأخطاء سوف يتم تصحيحها،
                    أو أن الموقع الذي يوفر الحساب والمعلومات الأخرى خال من
                    الفيروسات أو أي برامج أخرى ضارة. وهذه الضمانات مستثناة إلى
                    أقصى حد يسمح به القانون. ولا تتحمل الشركة بأي حال من الأحوال
                    المسؤولية عن أي أضرار مباشرة أو غير مباشرة أو خاصة أو
                    عَرَضية أو مترتبة قد تنشأ عن استخدامك أو عدم قدرتك على
                    استخدام هذا الموقع أو المعلومات التي يوفرها. لا تسمح بعض
                    الاختصاصات القضائية باستثناء أو تحديد المسؤولية عن الأضرار
                    المترتبة أو العرَضية. وفي مثل هذه الاختصاصات القضائية، تكون
                    مسؤولية الشركة محدودة إلى أقصى حد يسمح به القانون. وإذا تبين
                    وجود أي تعارض أو تناقض بين المعلومات المقدمة عبر الموقع
                    الإلكتروني والمعلومات المقدمة لك مباشرة من أو بالنيابة عن
                    الشركة عبر وسائل الاتصال المعتادة، فإن الأولوية تصبح
                    للمعلومات المقدمة عبر وسائل الاتصال المعتادة.
                  </Box>
                  <Box
                    as="p"
                    color="#C7C7C7"
                    mb="18px"
                    fontSize={{ lgp: "16px", base: "14px", md: "16px" }}
                    fontWeight="400"
                  >
                    بالدخول إلى الموقع واستخدامه، فأنت تدرك أنك قد تتنازل عن
                    حقوق متعلقة بمطالبات غير معروفة أو متوقعة في هذا الوقت،
                    ووفقاً لهذا التنازل، فإنك تقر بأنك قد اطلعت وفهمت، وأنك
                    تتنازل بموجب هذا صراحة عن الفوائد التي قد يوفرها أي قانون في
                    أي اختصاص قضائي ينص عموماً على ما يلي: "لا يمتد الإعفاء
                    العام إلى المطالبات التي لا يعرفها الدائن أو يعتقد في أنها
                    موجودة لصالحه في وقت تنفيذ الإعفاء، والتي كان يمكن في حال
                    معرفته بها أن تؤثر بشكل جوهري على تسويته مع المدين".
                  </Box>
                  <Box
                    as="p"
                    color="#C7C7C7"
                    mb="18px"
                    fontSize={{ lgp: "16px", base: "14px", md: "16px" }}
                    fontWeight="400"
                  >
                    لا تعني القيود وإخلاء المسؤولية الواردة في هذا القسم تحديداً
                    للمسؤولية أو تغييراً في حقوقك التي لا يمكن استبعادها بموجب
                    أي قانون معمول به.
                  </Box>
                </Box>
                <Box m="0px" textAlign="start">
                  <Box
                    as="p"
                    m="0"
                    fontSize={{ base: "16px", md: "18px", lgp: "18px" }}
                    fontWeight="400"
                    color="#fff"
                    py="10px"
                  >
                    القوة القاهرة.
                  </Box>
                  <Box
                    as="p"
                    color="#C7C7C7"
                    mb="18px"
                    fontSize={{ lgp: "16px", base: "14px", md: "16px" }}
                    fontWeight="400"
                  >
                    . لا يتحمل أي طرف المسؤولية عن أي تأخير أو إخفاق في تنفيذ
                    إلتزاماته الواردة في هذه الاتفاقية، ينتج عن وقوع كارثة
                    طبيعية أو تفشي أوبئة أو حدوث إصابات أو قضاء وقدر أو شخص خارج
                    عن القانون أو انقطاع التيار الكهربائي أو نشوب أعمال شغب أو
                    تعطل النظام أو الإرهاب أو الهجمات الإلكترونية أو الأعمال
                    الحكومية أو أي أحداث أخرى ذات طبيعة مماثلة وخارجة عن سيطرة
                    الطرف الذي يرغب في اللجوء لهذا القسم لتسويغ تأخيره أو
                    إخفاقه.
                  </Box>
                </Box>
                <Box m="0px" textAlign="start" mt="10px">
                  <Box
                    as="p"
                    m="0"
                    fontSize={{ base: "16px", md: "18px", lgp: "18px" }}
                    fontWeight="400"
                    color="#fff"
                    py="10px"
                  >
                    موادنا المحمية بحقوق الطبع والنشر ودعاوى الانتهاك.
                  </Box>
                  <Box
                    as="p"
                    color="#C7C7C7"
                    mb="18px"
                    fontSize={{ lgp: "16px", base: "14px", md: "16px" }}
                    fontWeight="400"
                  >
                    حقوق النشر لجميع النصوص والصور والشاشات والمواد الأخرى
                    المتوفرة على هذا الموقع (يشار إليها مجتمعة بإسم "المواد")
                    مملوكة أو معتمدة من قبل الشركة و/ أو أطراف ثالثة. باستثناء
                    ما هو منصوص عليه أدناه، لا يجوز نسخ أي من المواد أو توزيعها
                    أو عرضها أو تنزيلها أو نقلها بأي شكل أو بأي وسيلة دون إذن
                    كتابي مسبق من الشركة، أو مالك حقوق النشر. وقد ينتهك
                    الاستخدام غير المصرح به لأي من المواد التي يتضمنها هذا
                    الموقع قوانين حقوق النشر وقوانين العلامات التجارية وقوانين
                    الخصوصية والدعاية و/ أو اللوائح والقوانين الأخرى.
                  </Box>
                </Box>
                <Box m="0px" textAlign="start">
                  <Box
                    as="p"
                    m="0"
                    fontSize={{ base: "16px", md: "18px", lgp: "18px" }}
                    fontWeight="400"
                    color="#fff"
                    py="10px"
                  >
                    العلامات التجارية.
                  </Box>
                  <Box
                    as="p"
                    color="#C7C7C7"
                    mb="18px"
                    fontSize={{ lgp: "16px", base: "14px", md: "16px" }}
                    fontWeight="400"
                  >
                    العلامات التجارية وعلامات الخدمة التي قد يشار إليها عبر هذا
                    الموقع مملوكة للشركة أو لأصحابها. ولا ينبغي تفسير أي شيء في
                    هذا الموقع على أنه يمنح، ضمنياً، أو عبر إغلاق باب الرجوع، أو
                    بغير ذلك، أي ترخيص أو حق لاستخدام أي علامة تجارية دون إذن
                    كتابي من الشركة. ولا يجوز استخدام اسم الشركة أو شعارها بأي
                    شكل من الأشكال، بما في ذلك الإعلان أو الدعاية المتعلقة
                    بتوزيع المواد عبر هذا الموقع، دون إذن كتابي مسبق. ولا يحق لك
                    استخدام شعار الشركة كارتباط تشعبي لهذا الموقع ما لم تحصل على
                    إذن كتابي سلفاً منها، وإن كانت الشركة تسمح لك باستخدام بعض
                    الميزات المحددة التي يوفرها الموقع كارتباط تشعبي لأغراض
                    محددة.
                  </Box>
                </Box>
                <Box m="0px" textAlign="start">
                  <Box
                    as="p"
                    m="0"
                    fontSize={{ base: "16px", md: "18px", lgp: "18px" }}
                    fontWeight="400"
                    color="#fff"
                    py="10px"
                  >
                    الحق في الاحتفاظ بالمعلومات والإفصاح عنها.
                  </Box>
                  <Box
                    as="p"
                    color="#C7C7C7"
                    mb="18px"
                    fontSize={{ lgp: "16px", base: "14px", md: "16px" }}
                    fontWeight="400"
                  >
                    . يجوز للشركة الاحتفاظ بجميع المعلومات التي تقدمها، بما يتفق
                    مع سياسة الخصوصية التي تطبقها. ويجوز أيضاً للشركة الإفصاح عن
                    المعلومات التي تقدمها إذا طُلب منها ذلك بموجب قانون أو
                    اعتقاداً بحسن نية أن هذا الاحتفاظ أو الإفصاح ضروري بدرجة
                    معقولة من أجل: (أ) إتمام معاملتك (ب) الامتثال لإجراءات
                    قانونية (ج) تنفيذ اتفاقية المستخدم هذه (د) الرد على أي دعاوى
                    مفادها أن أي مواد موجودة على هذا الموقع تنتهك حقوقك أو حقوق
                    أطراف ثالثة (هـ) حماية حقوق أو ممتلكات الشركة والسلامة
                    الشخصية لمستخدميها و/ أو الجمهور، أو (و) في حالة استحواذ طرف
                    ثالث على معظم أصول الشركة أو جميعها
                  </Box>
                </Box>
                <Box m="0px" textAlign="start">
                  <Box
                    as="p"
                    m="0"
                    fontSize={{ base: "16px", md: "18px", lgp: "18px" }}
                    fontWeight="400"
                    color="#fff"
                    py="10px"
                  >
                    الأعمال المحظورة
                  </Box>
                  <Box
                    as="p"
                    color="#C7C7C7"
                    mb="18px"
                    fontSize={{ lgp: "16px", base: "14px", md: "16px" }}
                    fontWeight="400"
                  >
                    أنت تتعهد بموجب هذه الاتفاقية بألا تقوم بأي مما يلي : (أ)
                    تفكيك أو إجراء هندسة عكسية أو إلغاء تجميع أو تعديل أو تحويل
                    الموقع إلى شكل يمكن للإنسان أن يستوعبه أو إنشاء أعمال
                    مستخلصة استناداً إلى الموقع الإلكتروني أو لأي قسم منه (ب)
                    تعطيل أي ترخيص أو ميزات تحكم في الموقع (ج) "تأطير" الموقع أو
                    أي قسم منه أو جعل الموقع أو محتوياته تبدو وكأنها مقدمة من أي
                    شخص آخر غير الشركة (د) إدخال أي فيروس أو رمز أو عمل آخر إلى
                    الموقع الإلكتروني بهدف تعطيل أو إتلاف الموقع أو تغيير أو
                    إتلاف أو حذف أي مواد أو استرداد أو تسجيل معلومات حول الموقع
                    أو مستخدميه (هـ) دمج الموقع أو أي مواد مع برنامج آخر أو
                    إنشاء أعمال مستخلصة من الموقع أو هذه المواد (و) إزالة أو حجب
                    أو تغيير أي إشعار بحقوق النشر أو غيرها من وسائل إيضاح
                    الملكية على الموقع الإلكتروني أو المواد (ز) الترخيص من
                    الباطن أو التنازل عن أو الترجمة أو الإيجار أو الإعارة أو
                    إعادة البيع من أجل الربح أو التوزيع أو التنازل عن المواد أو
                    نقلها أو الدخول إلى الموقع لحساب آخرين (ح) استخدام أو السماح
                    باستخدام الموقع أو المواد بما يتعارض مع أي قانون اتحادي أو
                    حكومي أو محلي أو أجنبي أو أي قانون آخر معمول به، أو قواعد أو
                    لوائح الهيئات التنظيمية أو الإدارية أو (1) التصرف بطريقة
                    احتيالية أو غير قانونية أو خبيثة أو بإهمال عند استخدام
                    الموقع. باستثناء ما هو منصوص عليه صراحةً هنا، تحتفظ الشركة
                    والأطراف الخارجية بجميع الحقوق فيما يتعلق بالموقع
                    الإلكتروني، ويمكنها متابعة جميع الخيارات المتاحة قانوناً
                    بموجب القوانين المدنية والجنائية (وقد تتعاون مع وكالات إنفاذ
                    القانون) إذا حدثت أي انتهاكات.
                  </Box>
                </Box>
                <Box m="0px" textAlign="start">
                  <Box
                    as="p"
                    m="0"
                    fontSize={{ base: "16px", md: "18px", lgp: "18px" }}
                    fontWeight="400"
                    color="#fff"
                    py="10px"
                  >
                    حظر الاستعانة ببرامج الأوامر النصية والروبوتات والأطراف
                    الخارجية.
                  </Box>
                  <Box
                    as="p"
                    color="#C7C7C7"
                    mb="18px"
                    fontSize={{ lgp: "16px", base: "14px", md: "16px" }}
                    fontWeight="400"
                  >
                    لا يجوز لك الوصول إلى الموقع أو استخدامه عن طريق أي برنامج
                    آلي أو نظام خبير أو وكيل إلكتروني أو "روبوت"، ولا يجوز منح
                    أي شخص أو جهة إمكانية الوصول إلى الموقع.
                  </Box>
                </Box>
                <Box m="0px" textAlign="start">
                  <Box
                    as="p"
                    m="0"
                    fontSize={{ base: "16px", md: "18px", lgp: "18px" }}
                    fontWeight="400"
                    color="#fff"
                    py="10px"
                  >
                    حظر أعمال "الكشط".
                  </Box>
                  <Box
                    as="p"
                    color="#C7C7C7"
                    mb="18px"
                    fontSize={{ lgp: "16px", base: "14px", md: "16px" }}
                    fontWeight="400"
                  >
                    ". يحظر عليك "كشط" أو نسخ أو إعادة نشر أو ترخيص أو بيع
                    البيانات أو المعلومات الواردة بالموقع.
                  </Box>
                </Box>
                <Box m="0px" textAlign="start">
                  <Box
                    as="p"
                    m="0"
                    fontSize={{ base: "16px", md: "18px", lgp: "18px" }}
                    fontWeight="400"
                    color="#fff"
                    py="10px"
                  >
                    ملكية بيانات الاستخدام.
                  </Box>
                  <Box
                    as="p"
                    color="#C7C7C7"
                    mb="18px"
                    fontSize={{ lgp: "16px", base: "14px", md: "16px" }}
                    fontWeight="400"
                  >
                    . قد تقوم الشركة بجمع ومراكمة بيانات حول استخدامك للموقع،
                    وسوف تكون الشركة هي المالك الوحيد لهذه المعلومات
                  </Box>
                </Box>
                <Box m="0px" textAlign="start">
                  <Box
                    as="p"
                    m="0"
                    fontSize={{ base: "16px", md: "18px", lgp: "18px" }}
                    fontWeight="400"
                    color="#fff"
                    py="10px"
                  >
                    الروابط.
                  </Box>
                  <Box
                    as="p"
                    color="#C7C7C7"
                    mb="18px"
                    fontSize={{ lgp: "16px", base: "14px", md: "16px" }}
                    fontWeight="400"
                  >
                    على الرغم من أن الشركة لا تتحكم سوى في عدد ضئيل من
                    الارتباطات التشعبية في الموقع، فإن بعض الروابط داخل هذا
                    الموقع قد تؤدي إلى مواقع إلكترونية لجهات أخرى أو موقع
                    إلكتروني تابع لطرف ثالث. وتضع الشركة هذه الروابط الخارجية
                    فقط لمساعدتك. إن وجود رابط لا يعني الموافقة على الموقع
                    الإلكتروني المرتبط به أو على مشغله أو محتوياته، أو أن الشركة
                    مرتبطة بأي شكل من الأشكال بالموقع أو الموقع المرتبط به ما لم
                    يُذكر ذلك صراحةً في كل حالة في الموقع الإلكتروني الذي ترتبط
                    به هذه المواد. ولا يتضمن الموقع أي مواد تظهر في مثل هذه
                    المواقع أو المواقع المرتبطة عبر الإحالة إليها، ما لم يُذكر
                    صراحةً في كل حالة في الموقع الذي يتم ربط هذه المواد به.
                    وتحتفظ الشركة بالحق في إنهاء الارتباط بأي موقع تابع لطرف
                    ثالث في أي وقت. ليس للشركة أي سيطرة على المواقع الإلكترونية
                    التابعة لجهات خارجية، وقد يكون لها شروط استخدام وسياسات
                    خصوصية مغايرة وتدعوك الشركة إلى مراجعتها
                  </Box>
                </Box>
                <Box m="0px" textAlign="start">
                  <Box
                    as="p"
                    m="0"
                    fontSize={{ base: "16px", md: "18px", lgp: "18px" }}
                    fontWeight="400"
                    color="#fff"
                    py="10px"
                  >
                    الاستثناءات والقيود وإشعار حماية المستهلك.
                  </Box>
                  <Box
                    as="p"
                    color="#C7C7C7"
                    mb="18px"
                    fontSize={{ lgp: "16px", base: "14px", md: "16px" }}
                    fontWeight="400"
                  >
                    إذا كنت مستهلكاً، فإن الأحكام الواردة في اتفاقية المستخدم
                    هذه تهدف لأن تكون واسعة النطاق وشاملة بقدر ما تسمح به قوانين
                    بلد إقامتك فقط. وفي جميع الأحوال، تحتفظ الشركة بجميع الحقوق
                    والدفوع والقيود المسموح بها بموجب قانون بلد إقامتك.
                  </Box>
                </Box>
                <Box m="0px" textAlign="start">
                  <Box
                    as="p"
                    m="0"
                    fontSize={{ base: "16px", md: "18px", lgp: "18px" }}
                    fontWeight="400"
                    color="#fff"
                    py="10px"
                  >
                    السيطرة على الموقع.
                  </Box>
                  <Box
                    as="p"
                    color="#C7C7C7"
                    mb="18px"
                    fontSize={{ lgp: "16px", base: "14px", md: "16px" }}
                    fontWeight="400"
                  >
                    يخضع هذا الموقع لسيطرة الشركة وذلك بموجب الاختصاص القانوني
                    لحزمة فتح الحساب الخاص بك. لا تقدم الشركة أي تعهد بأن
                    المحتوى أو المواد الواردة في هذا الموقع مناسبة أو متاحة
                    للاستخدام في اختصاصات قضائية أخرى. ويُحظر تماماً الوصول إلى
                    محتوى الموقع أو المواد من الاختصاصات القضائية التي يكون فيها
                    هذا الوصول غير قانوني. إذا اخترت الوصول إلى هذا الموقع من
                    اختصاصات قضائية أخرى، فإنك تقوم بذلك على مسؤوليتك الخاصة.
                    وتظل أنت المسؤول دائماً عن امتثالك للقوانين المعمول بها.
                  </Box>
                </Box>
                <Box m="0px" textAlign="start">
                  <Box
                    as="p"
                    m="0"
                    fontSize={{ base: "16px", md: "18px", lgp: "18px" }}
                    fontWeight="400"
                    color="#fff"
                    py="10px"
                  >
                    القوانين واجبة التطبيق وحل النزاعات.
                  </Box>
                  <Box
                    as="p"
                    color="#C7C7C7"
                    mb="18px"
                    fontSize={{ lgp: "16px", base: "14px", md: "16px" }}
                    fontWeight="400"
                  >
                    . تخضع اتفاقية المستخدم وأي استخدام لهذا الموقع من قبل هذا
                    المستخدم ويتم تفسيرها بحسب قوانين الاختصاص القضائي المنصوص
                    عليه في حزمة فتح الحساب وتُطبق أحكام تسوية النزاعات الخاصة
                    بحزمة فتح الحساب. وحتى يتم تنفيذ حزمة فتح الحساب، تخضع
                    اتفاقية المستخدم وأي استخدام لهذا الموقع من قبل هذا المستخدم
                    لقوانين مملكة البحرين ويفسر وفقاً لها، بغض النظر عن تعارض
                    مبادئ القوانين الخاصة بها، ويوافق هذا المستخدم بشكل لا رجعة
                    فيه على أن أي إجراء قانوني ينشأ عن أو يتعلق باتفاقية
                    المستخدم هذه أو مثل هذا الاستخدام يجوز رفعه من قبل هذا
                    المستخدم أو نيابة عنه أمام محاكم البحرين فقط ويخضع بشكل لا
                    رجعة فيه للاختصاص القضائي لهذه المحاكم. ويقبل هذا المستخدم
                    قبولاً لا رجعة فيه أن للشركة الحق في تحريك أي إجراء قانوني
                    ضد هذا المستخدم و/ أو أصوله في أي اختصاص قضائي آخر أو لخدمة
                    الإجراءات بأي طريقة يسمح بها القانون، ولا يمنع اتخاذ
                    الإجراءات في أي اختصاص قضائي الشركة من اتخاذ الإجراءات في أي
                    اختصاص قضائي آخر سواء كان ذلك بشكل متزامن أم لا.
                  </Box>
                </Box>
                <Box m="0px" textAlign="start">
                  <Box
                    as="p"
                    m="0"
                    fontSize={{ base: "16px", md: "18px", lgp: "18px" }}
                    fontWeight="400"
                    color="#fff"
                    py="10px"
                  >
                    لا يحق للشركة ممارسة الأعمال في كل اختصاص قضائي.
                  </Box>
                  <Box
                    as="p"
                    color="#C7C7C7"
                    mb="18px"
                    fontSize={{ lgp: "16px", base: "14px", md: "16px" }}
                    fontWeight="400"
                  >
                    لا يحق للشركة مزاولة الأعمال بشكل عام أو تقديم خدمات معينة
                    في كل اختصاص قضائي. قد تحتوي المعلومات المنشورة على هذا
                    الموقع على مصادر أو إشارات مرجعية إلى سلع أو خدمات غير
                    متوفرة في محافظتك أو بلدك.
                  </Box>
                </Box>
                <Box m="0px" textAlign="start">
                  <Box
                    as="p"
                    m="0"
                    fontSize={{ base: "16px", md: "18px", lgp: "18px" }}
                    fontWeight="400"
                    color="#fff"
                    py="10px"
                  >
                    اتفاقية كاملة واستقلالية البنود.
                  </Box>
                  <Box
                    as="p"
                    color="#C7C7C7"
                    mb="18px"
                    fontSize={{ lgp: "16px", base: "14px", md: "16px" }}
                    fontWeight="400"
                  >
                    أنت تقر بأنك قد قرأت وفهمت اتفاقية المستخدم وأنك موافق على
                    الالتزام ببنودها وأحكامها. وتوافق أيضاً على أن اتفاقية
                    المستخدم هذه، جنباً إلى جنب مع سياسة الخصوصية المعمول بها
                    (الواردة هنا)، والمضمَّنة في هذه الاتفاقية بالإشارة وحزمة
                    فتح الحساب، تشكل المحتوى الكامل والحصري للاتفاقية بينك وبين
                    الشركة وتحل محل جميع المقترحات الأخرى أو الاتفاقيات السابقة
                    الشفوية أو المكتوبة وأي اتصالات أخرى تتعلق بموضوع اتفاقية
                    المستخدم هذه. إذا وجد أن أي بند من أحكام اتفاقية المستخدم
                    غير قابل للتنفيذ، فإن ذلك لا يؤثر على سريان الاتفاقية، والتي
                    تظل سارية وقابلة للتنفيذ وفقاً لشروطها.
                  </Box>
                </Box>
                <Box m="0px" textAlign="start">
                  <Box
                    as="p"
                    m="0"
                    fontSize={{ base: "16px", md: "18px", lgp: "18px" }}
                    fontWeight="400"
                    color="#fff"
                    py="10px"
                  >
                    التوقيع الإلكتروني.
                  </Box>
                  <Box
                    as="p"
                    color="#C7C7C7"
                    mb="18px"
                    fontSize={{ lgp: "16px", base: "14px", md: "16px" }}
                    fontWeight="400"
                  >
                    أنت تقر أنك في ظروف معينة قد تستخدم الموقع لتنفيذ معاملات
                    محددة والموافقة عليها. وأي نموذج أو معاملة يتم تنفيذها عن
                    طريق التوقيع الإلكتروني عبر الموقع، يجب أن يكون لها الأثر
                    القانوني نفسه الذي يترتب على التوقيع فيما لو كان مكتوباً بخط
                    اليد. ويحق للشركة بموجب هذا الاعتماد على أي مستند أو معاملة
                    يتم إرسالها عبر وسيلة إلكترونية من خلال الموقع وقبولها كأصل.
                    أنت توافق على أنك عند النقر فوق زر "إرسال" أو "أوافق" أو أي
                    زر أو حقل إدخال آخر مشابه في جهازك، فإن موافقتك أو قبولك
                    ستكون ملزمة قانوناً وقابلة للتنفيذ ومكافئة قانونياً لتوقيعك
                    المكتوب بخط اليد.
                  </Box>
                </Box>
                <Box m="0px" textAlign="start">
                  <Box
                    as="p"
                    m="0"
                    fontSize={{ base: "16px", md: "18px", lgp: "18px" }}
                    fontWeight="400"
                    color="#fff"
                    py="10px"
                  >
                    ليست مشورة استثمارية.
                  </Box>
                  <Box
                    as="p"
                    color="#C7C7C7"
                    mb="18px"
                    fontSize={{ lgp: "16px", base: "14px", md: "16px" }}
                    fontWeight="400"
                  >
                    المعلومات الواردة في الموقع هي معلومات لغرض الاطلاع فحسب.
                    ولا ينبغي تفسير أي معلومات أو مواد واردة في الموقع باعتبارها
                    مشورة استثمارية أو مالية أو قانونية أو ضريبية أو غير ذلك. لا
                    شيء مما يرد في الموقع يمثل التماساً أو توصية أو تأييداً أو
                    عرضاً من قبل The Family Office أو شركة تابعة لشراء أو بيع أي
                    أوراق مالية أو أدوات مالية أخرى في أي ولاية قضائية يكون فيها
                    هذا الطلب أو العرض غير قانوني.
                  </Box>
                </Box>
                <Box m="0px" textAlign="start">
                  <Box
                    as="p"
                    m="0"
                    fontSize={{ base: "16px", md: "18px", lgp: "18px" }}
                    fontWeight="400"
                    color="#fff"
                    py="10px"
                  >
                    السرية.
                  </Box>
                  <Box
                    as="p"
                    color="#C7C7C7"
                    mb="18px"
                    fontSize={{ lgp: "16px", base: "14px", md: "16px" }}
                    fontWeight="400"
                  >
                    . أنت تقر بأن أي معلومات أو مواد واردة في الموقع تعتبر سرية
                    ("معلومات سرية"). وتوافق على الحفاظ على سرية المعلومات
                    السرية وعلى حماية سرية مثل هذه المعلومات السرية بدرجة
                    العناية نفسها التي يحمي بها سرية معلوماته السرية، ولكن ليس
                    بأي حال من الأحوال بدرجة أقل من العناية المعقولة. لا يجوز لك
                    الإفصاح عن المعلومات السرية إلا لموظفيك ووكلائك ومستشاريك
                    وعلى أساس الحاجة إلى الاطلاع، وشريطة أن يوافق هؤلاء الموظفون
                    والوكلاء والمستشارون على نفس التزامات السرية.
                  </Box>
                </Box>
                <Box m="0px" textAlign="start">
                  <Box
                    as="p"
                    m="0"
                    fontSize={{ base: "16px", md: "18px", lgp: "18px" }}
                    fontWeight="400"
                    color="#fff"
                    py="10px"
                  >
                    سياسة الخصوصية للموقع الإلكتروني بشأن العميل الرقمي
                  </Box>
                  <Box
                    as="p"
                    color="#C7C7C7"
                    mb="18px"
                    fontSize={{ lgp: "16px", base: "14px", md: "16px" }}
                    fontWeight="400"
                  >
                    أعدت شركة The Family Office وبعض الشركات التابعة لها، بصفتها
                    المتحكمة في البيانات، سياسة الخصوصية هذه لشرح كيفية
                    استخدامنا لأي معلومات شخصية نجمعها حولك عندما تستخدم هذا
                    الموقع والخيارات التي لديك فيما يتعلق بكيفية جمع البيانات
                    واستخدامها.
                  </Box>
                  <Box
                    as="p"
                    color="#C7C7C7"
                    mb="18px"
                    fontSize={{ lgp: "16px", base: "14px", md: "16px" }}
                    fontWeight="400"
                  >
                    هذا الموقع ليس موجهاً للأطفال والقاصرين ونحن لا نطلب أو نجمع
                    عن قصد بيانات شخصية من الأطفال والقاصرين. بصفتك أحد الوالدين
                    أو الوصي القانوني، يرجى عدم السماح لأطفالك بإرسال بيانات
                    شخصية دون إذنك. بإرسالك بياناتك الشخصية لنا، فأنت توافق على
                    المعالجة الموضحة في سياسة الخصوصية هذه. وقد يتم أيضاً تقديم
                    إشعارات أخرى تسلط الضوء على استخدامات معينة نرغب في تطبيقها
                    على بياناتك الشخصية مع منحك القدرة على الاشتراك أو إلغاء
                    الاشتراك في استخدامات محددة حينما نجمع منك بيانات شخصية.
                  </Box>
                  {/* <Box
                    as="p"
                    color="#C7C7C7"
                    mb="18px"
                    fontSize={{ lgp: "16px", base: "14px", md: "16px" }}
                    fontWeight="400"
                  >
                    By submitting your personal data to us, you agree to the
                    processing set out in this Privacy Policy. Further notices
                    highlighting certain uses we wish to make of your personal
                    data together with the ability to opt in or out of selected
                    uses may also be provided to you when we collect personal
                    data from you.
                  </Box> */}
                  <Box
                    as="p"
                    color="#C7C7C7"
                    mb="18px"
                    fontSize={{ lgp: "16px", base: "14px", md: "16px" }}
                    fontWeight="400"
                  >
                    تحتوي سياسة الخصوصية هذه على تفاصيل عامة وفنية حول الخطوات
                    التي نتخذها لاحترام مخاوف الخصوصية لديك. لقد قمنا بتنظيم
                    سياسة الخصوصية بحسب العمليات والمجالات الرئيسية بحيث يمكنك
                    مراجعة المعلومات التي تهمك.
                  </Box>
                </Box>
                <Box mt="20px" textAlign="start">
                  <Flex mb="30px">
                    <Box
                      fontSize={{ base: "16px", md: "18px", lgp: "18px" }}
                      fontWeight="400"
                      color="#fff"
                    >
                      1.
                    </Box>{" "}
                    <Box pl="12px">
                      <Text
                        fontSize={{ base: "16px", md: "18px", lgp: "18px" }}
                        fontWeight="400"
                        color="#fff"
                      >
                        البيانات الشخصية التي نجمعها
                      </Text>
                      <Text
                        color="#C7C7C7"
                        mb="18px"
                        mt="15px"
                        fontSize={{ lgp: "16px", base: "14px", md: "16px" }}
                        fontWeight="400"
                      >
                        يشير مصطلح "البيانات الشخصية" إلى أي معلومات يمكن
                        استخدامها لتحديد هويتك أو التي يمكن ربطها بك كفرد.
                      </Text>
                    </Box>
                  </Flex>
                  <Flex
                    mb="30px"
                    fontSize={{ lgp: "16px", base: "14px", md: "16px" }}
                    fontWeight="400"
                  >
                    <Box
                      fontSize={{ base: "16px", md: "18px", lgp: "18px" }}
                      fontWeight="400"
                    >
                      1.1
                    </Box>{" "}
                    <Box pl="12px">
                      <Text
                        fontSize={{ lgp: "16px", base: "14px", md: "16px" }}
                        fontWeight="400"
                        color="#fff"
                      >
                        قد نقوم بجمع ومعالجة البيانات الشخصية التالية عنك.
                      </Text>
                      <Text
                        color="#C7C7C7"
                        mb="18px"
                        mt="15px"
                        fontSize={{ lgp: "16px", base: "14px", md: "16px" }}
                        fontWeight="400"
                      >
                        (أ) معلومات شخصية حولك – وهي المعلومات الشخصية التي
                        تقدمها لنا اي وقت قبل، عند أو بعد طلبك فتح حساب لدينا
                        (على سبيل المثال، المعلومات الشخصية ومعلومات إثبات
                        الهوية والاسم وتاريخ الميلاد وعنوان الإقامة في بلد
                        الجنسية والسكن والجنس وبلد الإقامة وحالة المستثمر
                        الائتمانية والضرائب والحالة السكنية وأرقام التعريف
                        الضريبية ومعلومات الدخل والثروة والدخل السنوي وصافي
                        الثروة ومصدر الأموال والثروة والنشاط الوظيفي ومدى الرغبة
                        في المخاطرة الاستثمارية وجواز السفر والهوية الوطنية (أو
                        المستندات المماثلة)، والصور والفديوهات والتسجيلات
                        الصوتية وأمور تعريفية أخرى والبيانات المصرفية ورقم الـ
                        IBAN المصرفي وإثبات العنوان وما إلى ذلك)، بالإضافة إلى
                        أي معلومات إضافية مقدمة بواسطة أو من خلال الشركة، أو يتم
                        إرسالها عبر سؤال مثل عنوان البريد الإلكتروني الخاص بك،
                        أو إرسالها عبر تحميل مستندات شخصية من أجل الامتثال
                        لمتطلبات عمليات التحقق من هوية العملاء في الاختصاصات
                        القضائية التي نعمل بها.
                      </Text>
                      <Text
                        color="#C7C7C7"
                        mb="18px"
                        mt="15px"
                        fontSize={{ lgp: "16px", base: "14px", md: "16px" }}
                        fontWeight="400"
                      >
                        (ب) مراسلاتنا: إذا اتصلت بنا على سبيل المثال لطرح
                        استفسار عام أو استفسار يتعلق بالاستثمار أو طلب دعم فني
                        أو للرد على سؤال موجه من قبلنا ، فقد نحتفظ بسجل لتلك
                        المراسلات بما في ذلك على سبيل المثال وليس الحصر، تسجيلات
                        صوتية، أو معلومات إلكترونية أومرئية، أو معلومات مشابهة
                        مثل تسجيلات لمكالمات صوتية ومرئية
                      </Text>
                      <Text
                        color="#C7C7C7"
                        mb="18px"
                        mt="15px"
                        fontSize={{ lgp: "16px", base: "14px", md: "16px" }}
                        fontWeight="400"
                      >
                        (ج) معلومات الاستبيانات: قد نطلب منك أيضاً إكمال
                        استبيانات نستخدمها لأغراض بحثية. في مثل هذه الظروف،
                        سنقوم بجمع المعلومات المقدَّمة في الاستبيان المكتمل
                      </Text>
                      <Text
                        color="#C7C7C7"
                        mb="18px"
                        mt="15px"
                        fontSize={{ lgp: "16px", base: "14px", md: "16px" }}
                        fontWeight="400"
                      >
                        (د) استخدامك لموقعنا: تفاصيل زياراتك لموقعنا والمعلومات
                        التي تم جمعها عبر ملفات تعريف الارتباط "الكوكيز" وتقنيات
                        التتبع الأخرى بما في ذلك، على سبيل المثال لا الحصر،
                        عنوان الـ IP واسم النطاق وإصدار المتصفح ونظام التشغيل
                        وبيانات حركة المرور وبيانات المكان وسجلات الإنترنت
                        وبيانات الاتصال الأخرى والموارد التي يمكنك الوصول إليها.
                      </Text>
                      <Text
                        color="#C7C7C7"
                        mb="18px"
                        mt="15px"
                        fontSize={{ lgp: "16px", base: "14px", md: "16px" }}
                        fontWeight="400"
                      >
                        (هـ) عدم التتبع: نظراً لأنه لا يوجد إجماع حتى الآن على
                        كيفية استجابة الشركات لآليات "عدم التتبع" المستندة إلى
                        متصفح الإنترنت ونظراً لبعض المتطلبات من قبل الهيئات
                        التنظيمية، فإننا لا نستجيب إلى إشارات عدم التتبع
                        المستندة إلى متصفح الإنترنت في هذا الوقت. يُرجى ملاحظة
                        أنه لن يتم إيقاف جميع عمليات التتبع حتى إذا قمت بحذف
                        ملفات تعريف الارتباط.
                      </Text>
                    </Box>
                  </Flex>{" "}
                  <Flex mb="30px">
                    <Box
                      fontSize={{ base: "16px", md: "18px", lgp: "18px" }}
                      fontWeight="400"
                    >
                      1.2
                    </Box>{" "}
                    <Box pl="12px">
                      <Text
                        fontSize={{ base: "16px", md: "18px", lgp: "18px" }}
                        fontWeight="400"
                        color="#C7C7C7"
                      >
                        قد نقوم بالحصول على بياناتك الشخصية منك مباشرة. وقد نقوم
                        أيضاً بجمع البيانات الشخصية من أطراف ثالثة بما في ذلك
                        الوكلاء الذين يقدمون توجيهات بالنيابة عنك أو أي هيئات
                        حكومية وشبه حكومية أخرى قد تقدم بيانات شخصية نيابة عنك.
                        بالإضافة إلى ذلك، قد نقوم أيضاً بجمع البيانات الشخصية من
                        موفري خدمات خارجيين ضمن عملية التقديم الخاصة بك، مثل
                        موفري خدمات التحقق من مقاطع الفيديو التابعين وذلك ضمن
                        عمليات البحث الخاصة بـ "اعرف عميلك".
                      </Text>
                    </Box>
                  </Flex>
                  <Flex mb="30px">
                    <Box
                      fontSize={{ base: "16px", md: "18px", lgp: "18px" }}
                      fontWeight="400"
                    >
                      1.3
                    </Box>{" "}
                    <Box pl="12px">
                      <Text
                        fontSize={{ base: "16px", md: "18px", lgp: "18px" }}
                        fontWeight="400"
                        color="#C7C7C7"
                      >
                        إذا قمت بتزويدنا ببيانات شخصية عن أفراد آخرين، فيجب عليك
                        إبلاغ هؤلاء الأفراد بأنك قد زودتنا ببياناتهم وأين يمكنهم
                        العثور على نسخة من سياسة الخصوصية هذه.
                      </Text>
                    </Box>
                  </Flex>
                  <Flex mb="30px">
                    <Box
                      fontSize={{ base: "16px", md: "18px", lgp: "18px" }}
                      fontWeight="400"
                    >
                      1.4
                    </Box>{" "}
                    <Box pl="12px">
                      <Text
                        fontSize={{ base: "16px", md: "18px", lgp: "18px" }}
                        fontWeight="400"
                        color="#C7C7C7"
                      >
                        إذا اخترت ألا تقدم بيانات شخصية معينة، فقد يؤدي ذلك إلى
                        عدم قدرتنا على تزويدك بجميع خدماتنا.
                      </Text>
                    </Box>
                  </Flex>
                  <Flex mb="30px">
                    <Box
                      fontSize={{ base: "16px", md: "18px", lgp: "18px" }}
                      fontWeight="400"
                    >
                      1.5
                    </Box>{" "}
                    <Box pl="12px">
                      <Text
                        fontSize={{ base: "16px", md: "18px", lgp: "18px" }}
                        fontWeight="400"
                        color="#C7C7C7"
                      >
                        عند استخدام التطبيق، قد نكتشف ونسجل موقعك من أجل
                        الالتزام بالقوانين أو اللوائح التي تنطبق علينا. يستخدم
                        التطبيق واجهة برمجة التطبيقات (API) لإلتقاط موقع عنوان
                        جهازك (IP). قد تتكون معلومات الموقع التي تم التقاطها من
                        موقعك العام و/أو موقع جغرافي محدد كما هو محدد بواسطة
                        عنوان IP الخاص بك. أيضاً ، أنت توافق على أنه عند
                        استخدامك شبكة خاصة (VPN)، يقوم موقع VPN بالإبلاغ عن موقع
                        في نفس البلد حيث موقعك الفعلي خلال فترة الاستخدام
                        بأكملها.
                      </Text>
                    </Box>
                  </Flex>
                  <Flex mb="30px">
                    <Box
                      fontSize={{ base: "16px", md: "18px", lgp: "18px" }}
                      fontWeight="400"
                      color="#fff"
                    >
                      2.
                    </Box>{" "}
                    <Box pl="12px">
                      <Text
                        fontSize={{ base: "16px", md: "18px", lgp: "18px" }}
                        fontWeight="400"
                        color="#fff"
                      >
                        كيف نستخدم البيانات الشخصية
                      </Text>
                      {/* <Text
                      color="#C7C7C7"
                      mb="18px"
                      mt="15px"
                      fontSize={{ lgp: "16px", base: "14px", md: "16px" }}
                      fontWeight="400"
                    >
                      The term “Personal Data” refers to any information that
                      can be used to identify you, or that can be linked to you,
                      as an individual.
                    </Text> */}
                    </Box>
                  </Flex>
                  <Flex mb="30px">
                    <Box
                      fontSize={{ base: "16px", md: "18px", lgp: "18px" }}
                      fontWeight="400"
                    >
                      2.1
                    </Box>{" "}
                    <Box pl="12px">
                      <Text
                        fontSize={{ base: "16px", md: "18px", lgp: "18px" }}
                        fontWeight="400"
                        color="#C7C7C7"
                      >
                        قد نستخدم بياناتك الشخصية على النحو التالي:
                        <Text
                          fontSize={{ lgp: "16px", base: "14px", md: "16px" }}
                          fontWeight="400"
                        >
                          يُرجى ملاحظة أن استخدام البيانات الشخصية بموجب قوانين
                          حماية البيانات المعمول بها يجب أن يكون مبرراً وفقاً
                          لعدد من "الأسباب" القانونية، ونحن مطالبون بتحديد
                          الأسباب المتعلقة بكل استخدام في سياسة الخصوصية هذه.
                        </Text>
                      </Text>
                      <Text
                        color="#C7C7C7"
                        mb="18px"
                        mt="15px"
                        fontSize={{ lgp: "16px", base: "14px", md: "16px" }}
                        fontWeight="400"
                      >
                        (أ) البت في طلبك الذي تقدمت به كي تصبح مستخدماً: تقييم
                        طلبك ومعالجته لفتح حساب. حينما تتم الموافقة على طلبك،
                        سيكون بإمكانك إعداد معلومات حسابك أو مراجعتها أو تحديثها
                        بمجرد فتح حسابك (بما في ذلك بياناتك الشخصية) عبر
                        الإنترنت في أي وقت. تبرير الاستخدام: الموافقة وتنفيذ
                        العقد والمصالح المشروعة (للسماح لنا بتقييم أهليتك
                        كمستخدم).
                        <Text
                          mb="18px"
                          mt="15px"
                          fontSize={{ base: "16px", md: "18px", lgp: "18px" }}
                          fontWeight="400"
                        >
                          Use justification: consent, contract performance,
                          legitimate interests (to allow us to evaluate your
                          eligibility as a user
                        </Text>
                      </Text>
                      <Text
                        color="#C7C7C7"
                        mb="18px"
                        mt="15px"
                        fontSize={{ lgp: "16px", base: "14px", md: "16px" }}
                        fontWeight="400"
                      >
                        (ب) تزويدك بمواد تسويقية: لتزويدك بالتحديثات والعروض
                        التي اخترت تلقيها. عادةً ما نستعين بموفري خدمة بريد
                        إلكتروني من طرف ثالث لإرسال رسائل البريد الإلكتروني.
                        ويُحظر تعاقدياً (بموجب تعاقداتنا هذه) على موفري الخدمة
                        هؤلاء استخدام عنوان بريدك الإلكتروني لأي غرض آخر بخلاف
                        إرسال رسائل بريد إلكتروني ذات صلة بعمليات الشركة. ونحن
                        نتيح لك إمكانية إلغاء الاشتراك في جميع الرسائل التسويقية
                        دون أن تترتب على ذلك أي تكلفة. وفي كل مرة تتلقى رسالة
                        بريد إلكترونية، سوف يتم تزويدك بخيار إلغاء الاشتراك في
                        رسائل البريد الإلكتروني التالية عبر اتباع الإرشادات
                        الواردة في الرسالة. يمكنك أيضاً إلغاء الاشتراك الخاص
                        بتلقي المواد الترويجية عبر الاتصال بنا.
                        <Text
                          mb="18px"
                          mt="15px"
                          fontSize={{ base: "16px", md: "18px", lgp: "18px" }}
                          fontWeight="400"
                        >
                          (ج) تبرير الاستخدام: الموافقة (التي يمكن سحبها في أي
                          وقت).
                        </Text>
                      </Text>
                      <Text
                        color="#C7C7C7"
                        mb="18px"
                        mt="15px"
                        fontSize={{ lgp: "16px", base: "14px", md: "16px" }}
                        fontWeight="400"
                      >
                        (د) للتحليلات والتصنيف: ضبط أنشطتنا التسويقية على نحو
                        يلبي متطلباتك. فيما يتعلق بأنشطتنا التسويقية، نقوم
                        بتحليل المعلومات التي نجمعها عن العملاء لتحديد العروض
                        التي يرجح أن تكون ذات فائدة لفئات مختلفة من العملاء في
                        ظروف مختلفة وفي أوقات مختلفة. نسمي هذا إنشاء "شرائح".
                        تتضمن هذه البيانات الشخصية المعلومات السلوكية للعميل مثل
                        سجل المعاملات والتفضيلات وطلبات الخدمة والتفاعلات معنا.
                        من حين لآخر، سنقوم بتقييم البيانات الشخصية التي نحتفظ
                        بها عنك من أجل وضعك ضمن شريحة معينة. قد نستخدم الشريحة
                        الذي تم وضعك فيها من أجل ضبط رسائلنا التسويقية بما
                        يجعلها تشمل ما يهمك من عروض ومحتوى. قد نستخدم هذه
                        الطريقة أيضاً لتجنب إرسال عروض غير مناسبة أو لا يحتمل أن
                        تكون ذات فائدة لك، ويحق لك إلغاء الاشتراك في هذا التحليل
                        الذي تخضع له بياناتك الشخصية التي نستخدمها لتصميم
                        الرسائل التسويقية المباشرة التي نرسلها لك، في أي وقت.
                        <Text
                          mb="18px"
                          mt="15px"
                          fontSize={{ base: "16px", md: "18px", lgp: "18px" }}
                          fontWeight="400"
                        >
                          تبرير الاستخدام: الموافقة (ويمكن التراجع عنها في أي
                          وقت) وتحقيق مصالح مشروعة (تتيح لنا ضبط رسائلنا
                          التسويقية على نحو يلائمك).
                        </Text>
                      </Text>
                      <Text
                        color="#C7C7C7"
                        mb="18px"
                        mt="15px"
                        fontSize={{ lgp: "16px", base: "14px", md: "16px" }}
                        fontWeight="400"
                      >
                        (هـ) الإمتثال لإلتزاماتنا القانونية والتنظيمية: للإمتثال
                        لإلتزاماتنا القانونية والتنظيمية مثل متطلبات إعداد
                        التقارير المالية التي يفرضها مدققونا والجهات الحكومية،
                        والتعاون مع هيئات إنفاذ القانون والجهات الحكومية
                        والتنظيمية و/ أو المحاكم فيما يتعلق بالإجراءات أو
                        التحقيقات في أي مكان في العالم حيثما يتعين علينا عمل ذلك
                        (مثل الامتثال لإجراءات مكافحة غسيل الأموال وتطبيق قواعد
                        "التعرف على هوية العميل").
                        <Text
                          mb="18px"
                          mt="15px"
                          fontSize={{ base: "16px", md: "18px", lgp: "18px" }}
                          fontWeight="400"
                        >
                          تبرير الاستخدام: إلتزام قانوني ومطالبات قانونية ومصالح
                          مشروعة (للتعاون مع الهيئات المنوط بها إنفاذ القانون
                          والهيئات التنظيمية).
                        </Text>
                      </Text>
                      <Text
                        color="#C7C7C7"
                        mb="18px"
                        mt="15px"
                        fontSize={{ lgp: "16px", base: "14px", md: "16px" }}
                        fontWeight="400"
                      >
                        (و) التعامل مع الحوادث ومعالجة أي مطالبات نتلقاها:
                        للتعامل مع أي وقائع أو حوادث مثل الاتصال بخدمات الطوارئ
                        والتعامل مع أي مطالبات يقدمها العملاء.
                        <Text
                          mb="18px"
                          mt="15px"
                          fontSize={{ base: "16px", md: "18px", lgp: "18px" }}
                          fontWeight="400"
                        >
                          تبرير الاستخدام: تحقيق مصلحة حيوية وتلبية مطالبات
                          قانونية ومصالح مشروعة (تضمن لنا التعامل مع الحوادث
                          بالشكل المناسب وتتيح لنا مساعدة عملائنا).
                        </Text>
                      </Text>
                      <Text
                        color="#C7C7C7"
                        mb="18px"
                        mt="15px"
                        fontSize={{ lgp: "16px", base: "14px", md: "16px" }}
                        fontWeight="400"
                      >
                        (ز) تحسين خدماتنا ومنتجاتنا: للمساعدة في تطوير خدمات
                        ومنتجات جديدة وتحسين خدماتنا ومنتجاتنا الحالية.
                        <Text
                          mb="18px"
                          mt="15px"
                          fontSize={{ base: "16px", md: "18px", lgp: "18px" }}
                          fontWeight="400"
                        >
                          تبرير الاستخدام: مصالح مشروعة (تتيح لنا تحسين خدماتنا
                          وتطويرها باستمرار).
                        </Text>
                      </Text>
                      <Text
                        color="#C7C7C7"
                        mb="18px"
                        mt="15px"
                        fontSize={{ lgp: "16px", base: "14px", md: "16px" }}
                        fontWeight="400"
                      >
                        (ح) مساعدة موقعنا على العمل بشكل صحيح وتقديم أنشطة صيانة
                        الحساب (إذا تمت الموافقة على طلبك): للمساعدة في تقديم
                        المحتوى من موقعنا بأكثر الطرق فعالية لك ولجهازك، وإذا
                        تمت الموافقة على طلبك، فإذن ذلك لصيانة حساب المستخدم
                        والحفاظ عليه.
                        <Text
                          mb="18px"
                          mt="15px"
                          fontSize={{ base: "16px", md: "18px", lgp: "18px" }}
                          fontWeight="400"
                        >
                          تبرير الاستخدام: تنفيذ العقد والمصالح المشروعة (تتيح
                          لنا تزويدك بالمحتوى والخدمات عبر هذا الموقع)
                        </Text>
                      </Text>
                      <Text
                        color="#C7C7C7"
                        mb="10px"
                        mt="15px"
                        fontSize={{ lgp: "16px", base: "14px", md: "16px" }}
                        fontWeight="400"
                      >
                        (1) إعادة تنظيم أعمالنا: تحليل أو إتاحة تحليل أي عمليات
                        مقترحة لبيع أو دمج أو إقتناء أصول أو إعادة تنظيم
                        أعمالنا.
                        <Text
                          mb="18px"
                          mt="15px"
                          fontSize={{ base: "16px", md: "18px", lgp: "18px" }}
                          fontWeight="400"
                        >
                          تبرير الاستخدام: تنفيذ العقد والمصالح المشروعة (تتيح
                          لنا الاستمرار في تزويدك بخدماتنا).
                        </Text>
                      </Text>
                      <Text
                        color="#C7C7C7"
                        mb="18px"
                        mt="15px"
                        fontSize={{ lgp: "16px", base: "14px", md: "16px" }}
                        fontWeight="400"
                      >
                        (ي) معالجة أي إلتزام أو اشتراك أو تنفيذ تعهد أو تراجع:
                        تقييم ومعالجة التزاماتك أو اشتراكاتك أو تنفيذ التعهدات
                        أو التراجع عنها.
                        <Text
                          mb="18px"
                          mt="15px"
                          fontSize={{ base: "16px", md: "18px", lgp: "18px" }}
                          fontWeight="400"
                        >
                          تبرير الاستخدام: الموافقة وتنفيذ العقد وتحقيق المصالح
                          المشروعة (تتيح لنا مواصلة تقديم خدماتنا لك).
                        </Text>
                        <Text
                          mb="18px"
                          mt="15px"
                          fontSize={{ lgp: "16px", base: "14px", md: "16px" }}
                          fontWeight="400"
                        >
                          إذا قررنا إجراء المزيد من المعالجة لبياناتك الشخصية
                          لغرض آخر بخلاف ما هو منصوص عليه في القسم 2 أعلاه، فسوف
                          نطلعك على هذا الغرض الآخر قبل مباشرة هذه المعالجة
                          الإضافية.
                        </Text>
                      </Text>
                    </Box>
                  </Flex>
                  <Flex mb="30px">
                    <Box
                      fontSize={{ base: "16px", md: "18px", lgp: "18px" }}
                      fontWeight="400"
                      color="#fff"
                    >
                      3.
                    </Box>{" "}
                    <Box pl="12px">
                      <Text
                        fontSize={{ base: "16px", md: "18px", lgp: "18px" }}
                        fontWeight="400"
                        color="#fff"
                      >
                        كيف نشارك البيانات الشخصية
                      </Text>
                    </Box>
                  </Flex>
                  <Flex mb="30px">
                    <Box
                      fontSize={{ base: "16px", md: "18px", lgp: "18px" }}
                      fontWeight="400"
                    >
                      3.1
                    </Box>{" "}
                    <Box pl="12px">
                      <Text
                        fontSize={{ base: "16px", md: "18px", lgp: "18px" }}
                        fontWeight="400"
                        color="#C7C7C7"
                      >
                        يجوز لنا مشاركة بياناتك الشخصية بالطرق التالية.
                        {/* <Text
                        fontSize={{ lgp: "16px", base: "14px", md: "16px" }}
                        fontWeight="400"
                      >
                        Please note that use of Personal Data under applicable
                        data protection laws must be justified under one of a
                        number of legal “grounds” and we are required to set out
                        the grounds in respect of each use in this Privacy
                        Policy.
                      </Text> */}
                      </Text>
                      <Text
                        color="#C7C7C7"
                        mb="18px"
                        mt="15px"
                        fontSize={{ lgp: "16px", base: "14px", md: "16px" }}
                        fontWeight="400"
                      >
                        (أ) مقدمو الخدمات التابعين لأطراف أخرى ممن يعالجون
                        البيانات الشخصية نيابةً عنا لمساعدتنا في تنفيذ الأنشطة
                        الموضحة في القسم 2: قد نسمح لأطراف خارجية محددة مثل
                        شركاء الأعمال والموردين ومقدمي الخدمات والوكلاء
                        والمقاولين والشركات الأخرى التابعة للشركة باستخدام
                        بياناتك الشخصية للأغراض المنصوص عليها في القسم 2، ومنها
                        شركات البريد السريع وموفري خدمات البريد الإلكتروني الذين
                        نستعين بهم لإرسال ونشر المواد الترويجية لمنتجات الشركة
                        وموفري مراكز البيانات الذين يستضيفون خوادمنا والوكلاء
                        الخارجيين الذين يعالجون مسائل البريد والطلبات والمعاملات
                        نيابة عنا. ويُحظر تعاقدياً على هذه الأطراف استخدام
                        البيانات الشخصية لأي غرض آخر بخلاف الغرض المذكور في
                        العقود المبرمة مع كلٍ منها، وستكون خاضعة لإلتزامات
                        معالجة البيانات الشخصية وفقاً لنفس الضمانات التي
                        نستخدمها. كما نقدم أيضاً معلومات غير شخصية إلى هذه
                        الجهات لاستخدامها إجمالاً بهدف الوفاء بالتزاماتهم
                        التعاقدية تجاهنا. لا نسمح ببيع البيانات الشخصية إلى جهات
                        خارج الشركة لأي استخدام غير مرتبط بعمليات مجموعتنا أو
                        استخدام البيانات الشخصية من قبل أطراف أخرى لأغراضهم
                        الخاصة.
                      </Text>
                      <Text
                        color="#C7C7C7"
                        mb="18px"
                        mt="15px"
                        fontSize={{ lgp: "16px", base: "14px", md: "16px" }}
                        fontWeight="400"
                      >
                        (ب) وكالات إنفاذ القانون والجهات الحكومية والهيئات
                        التنظيمية والمحكمة من أجل الامتثال لالتزاماتنا القانونية
                        أو للتعامل مع الحوادث والمطالبات: يحق لنا الكشف عن
                        بياناتك الشخصية عندما يقتضي ذلك قانون ذو صلة أو أمرٌ
                        صادر عن محكمة، أو بناءً على طلب حكومة أخرى أو جهات إنفاذ
                        القانون، أو أي وكالة أو محكمة أو جهة تنظيمية أو أي طرف
                        آخر نعتقد بأنه ضروري للمساعدة في الإجراءات أو التحقيقات.
                        حيثما يُسمح بذلك، سنقوم بتوجيه أي طلب من هذا القبيل إليك
                        أو إخطارك قبل الرد، ما لم يكن القيام بذلك من شأنه
                        الإضرار بمسار يهدف إلى منع جريمة أو اكتشافها. وينطبق ذلك
                        أيضاً حينما يكون لدينا سبب للاعتقاد بأن الكشف عن
                        البيانات الشخصية ضروري للحصول على مشورة قانونية أو تحديد
                        أو إجراء تحقيق أو توفير حماية أو إجراء اتصال أو رفع دعوى
                        قانونية ضد شخص قد يتسبب في المساس بضيوفنا أو زوارنا أو
                        شركائنا أو حقوقنا أو ممتلكات أو بآخرين، سواء عن قصد أو
                        غير ذلك أو عندما يمكن أن يتضرر أي أحد آخر من هذه الأعمال
                      </Text>
                      <Text
                        color="#C7C7C7"
                        mb="18px"
                        mt="15px"
                        fontSize={{ lgp: "16px", base: "14px", md: "16px" }}
                        fontWeight="400"
                      >
                        (ج) الأطراف الأخرى التي تطلب مثل هذه البيانات فيما يتعلق
                        بتغيير في هيكل أعمالنا: إذا دخلنا (أو جزء منا) في
                        مفاوضات بيع أعمالنا أو (2) بعنا إلى أو اندمجنا مع أو
                        بعنا معظم أصولنا إلى طرف آخر أو (3) خضعنا لإعادة هيكلة،
                        فإنك توافق على أنه يجوز نقل أي من بياناتك الشخصية التي
                        نحتفظ بها إلى تلك الجهة الناتجة عن إعادة الهيكلة أو
                        الطرف الآخر واستخدامها لنفس الأغراض المنصوص عليها في
                        سياسة الخصوصية هذه، أو لغرض تحليل أي عملية بيع أو إعادة
                        تنظيم مقترحة. وسوف نضمن عدم نقل المزيد من بياناتك
                        الشخصية أكثر من اللازم.
                      </Text>
                    </Box>
                  </Flex>
                  <Flex mb="30px">
                    <Box
                      fontSize={{ base: "16px", md: "18px", lgp: "18px" }}
                      fontWeight="400"
                    >
                      3.2
                    </Box>{" "}
                    <Box pl="12px">
                      <Text
                        fontSize={{ base: "16px", md: "18px", lgp: "18px" }}
                        fontWeight="400"
                        color="#C7C7C7"
                      >
                        لا تنطبق سياسة الخصوصية هذه على معالجتنا للمعلومات
                        الشخصية نيابة عن، أو بتوجيه من، موفرين للخدمة تابعين
                        لطرف ثالث، ممن قد يجمعون معلومات شخصية منك ويقدمونها
                        لنا. في هذه الحالة، سوف نعمل فقط باعتبارنا معالجين
                        للبيانات، ومن ثم ننصحك بمراجعة سياسات الخصوصية المعمول
                        بها لدى هؤلاء الموفرين للخدمة قبل إرسال معلوماتك
                        الشخصية.
                      </Text>
                    </Box>
                  </Flex>
                </Box>
                <Box m="0px" textAlign="start">
                  <Box
                    as="p"
                    m="0"
                    fontSize={{ base: "16px", md: "18px", lgp: "18px" }}
                    fontWeight="400"
                    color="#fff"
                    py="10px"
                  >
                    مبررات الاستخدام والأسس القانونية
                  </Box>
                  <Box
                    as="p"
                    color="#C7C7C7"
                    mb="18px"
                    p={{ lgp: "0 70px", base: "0 39px", md: "0 70px" }}
                    fontSize={{ lgp: "16px", base: "14px", md: "16px" }}
                    fontWeight="400"
                  >
                    نذكر فيما يلي الأسس القانونية التي نستخدمها لتبرير كل
                    استخدام تخضع له معلوماتك، بالإضافة إلى القسمين الخاصين بـ
                    كيف نستخدم البيانات الشخصية وكيف نشارك البيانات الشخصية في
                    سياسة الخصوصية هذه.
                  </Box>
                  <Text
                    as="p"
                    color="#C7C7C7"
                    mb="18px"
                    p={{ lgp: "0 70px", base: "0 39px", md: "0 70px" }}
                    fontSize={{ lgp: "16px", base: "14px", md: "16px" }}
                    fontWeight="400"
                  >
                    فيما يلي الأسس القانونية الرئيسية التي تبرر استخدامنا
                    لبياناتك الشخصية:
                  </Text>
                </Box>
                <Box
                  textAlign="start"
                  w="80%"
                  margin="30px auto"
                  border="1px solid"
                >
                  <Text border="1px solid" p="5px 10px">
                    <Text
                      fontStyle="italic"
                      fontWeight="700"
                      as="span"
                      color="#fff"
                    >
                      الموافقة:
                    </Text>{" "}
                    وهي قبولك باستخدامنا لبياناتك الشخصية
                  </Text>
                  <Text border="1px solid" p="5px 10px">
                    <Text
                      fontStyle="italic"
                      fontWeight="700"
                      as="span"
                      color="#fff"
                    >
                      تنفيذ العقد:
                    </Text>{" "}
                    حيثما تكون بياناتك الشخصية ضرورية لإبرام عقدنا معك أو
                    تنفيذه.
                  </Text>
                  <Text border="1px solid #9a8d8d" p="5px 10px">
                    <Text
                      fontStyle="italic"
                      fontWeight="700"
                      as="span"
                      color="#fff"
                    >
                      الإلتزام القانوني والتنظيمي:
                    </Text>{" "}
                    حيثما نحتاج إلى استخدام بياناتك الشخصية إمتثالاً لالتزاماتنا
                    القانونية
                  </Text>
                  <Text border="1px solid #9a8d8d" p="5px 10px">
                    <Text
                      fontStyle="italic"
                      fontWeight="700"
                      as="span"
                      color="#fff"
                    >
                      تحقيق مصالح مشروعة:
                    </Text>{" "}
                    عندما نستخدم بياناتك الشخصية لتحقيق مصلحة مشروعة وتفوق أسباب
                    استخدامنا لها أي مساس بحقوق حماية البيانات الخاصة بك.
                  </Text>
                  <Text border="1px solid #9a8d8d" p="5px 10px">
                    <Text
                      fontStyle="italic"
                      fontWeight="700"
                      as="span"
                      color="#fff"
                    >
                      مطالبات قانونية:
                    </Text>{" "}
                    عندما تكون معلوماتك ضرورية بالنسبة لنا للدفاع أو للمقاضاة أو
                    لرفع دعوى ضدك أو ضدنا أو ضد طرف ثالث.
                  </Text>
                  <Text border="1px solid #9a8d8d" p="5px 10px">
                    <Text
                      fontStyle="italic"
                      fontWeight="700"
                      as="span"
                      color="#fff"
                    >
                      المصلحة الحيوية:
                    </Text>{" "}
                    حيثما نحتاج إلى معالجة بياناتك الشخصية لحماية مصلحة حيوية لك
                    أو لشخص طبيعي آخر، مثل احتياجك إلى مساعدة عاجلة.
                  </Text>
                </Box>
                <Box mt="20px" textAlign="start">
                  <Flex mb="30px">
                    <Box
                      fontSize={{ base: "16px", md: "18px", lgp: "18px" }}
                      fontWeight="400"
                      color="#fff"
                    >
                      4.
                    </Box>{" "}
                    <Box pl="12px">
                      <Text
                        fontSize={{ base: "16px", md: "18px", lgp: "18px" }}
                        fontWeight="400"
                        color="#fff"
                      >
                        كيف ننقل البيانات الشخصية ونحميها ونخزنها الأمان عبر
                        الإنترنت
                      </Text>
                      {/* <Text
                      color="#C7C7C7"
                      mb="18px"
                      mt="15px"
                      fontSize={{ lgp: "16px", base: "14px", md: "16px" }}
                      fontWeight="400"
                    >
                      The term “Personal Data” refers to any information that
                      can be used to identify you, or that can be linked to you,
                      as an individual.
                    </Text> */}
                    </Box>
                  </Flex>
                  <Flex mb="30px">
                    <Box
                      fontSize={{ base: "16px", md: "18px", lgp: "18px" }}
                      fontWeight="400"
                    >
                      4.1
                    </Box>{" "}
                    <Box pl="12px">
                      <Text
                        fontSize={{ base: "16px", md: "18px", lgp: "18px" }}
                        fontWeight="400"
                        color="#C7C7C7"
                      >
                        يتعين مراعاة أن جميع الاتصالات عبر الإنترنت ليست آمنة.
                        هناك مخاطر ينطوي عليها استخدام البريد الإلكتروني. ويُرجى
                        الانتباه إلى ذلك عند طلبك معلومات أو إرسالك نماذج إلينا
                        عبر البريد الإلكتروني، على سبيل المثال، من قسم "اتصل
                        بنا". نوصي بعدم تضمين أي معلومات حساسة عند استخدام
                        البريد الإلكتروني أو استخدام أي أجهزة كمبيوتر عامة أو
                        شبكة واي فاي عامة. قد لا تتضمن ردودنا على البريد
                        الإلكتروني أي معلومات حساسة أو سرية. يرجى أن تضع
                        باعتبارك أنه لا يوجد نظام أمني أو نظام لنقل المعلومات
                        يمكن ضمانه عبر الإنترنت.
                      </Text>
                    </Box>
                  </Flex>
                  <Flex mb="30px">
                    <Box
                      fontSize={{ base: "16px", md: "18px", lgp: "18px" }}
                      fontWeight="400"
                    >
                      4.2
                    </Box>{" "}
                    <Box pl="12px">
                      <Text
                        fontSize={{ base: "16px", md: "18px", lgp: "18px" }}
                        fontWeight="400"
                        color="#C7C7C7"
                      >
                        إذا تمكنت من تقديم طلبك وأُنشىء لك حساب مستخدم، فيجب
                        عليك دائماً إغلاق المتصفحات الخاصة بك لدى الانتهاء من
                        إكمال النموذج. وعلى الرغم من أن الجلسة ستنتهي تلقائياً
                        بعد فترة قصيرة من عدم النشاط، فإنه وصول طرف ثالث إلى
                        صفحتك يصبح أسهل أثناء تسجيلك الدخول إلى حسابك.
                      </Text>
                    </Box>
                  </Flex>
                  <Flex mb="30px">
                    <Box
                      fontSize={{ base: "16px", md: "18px", lgp: "18px" }}
                      fontWeight="400"
                    >
                      4.3
                    </Box>{" "}
                    <Box pl="12px">
                      <Text
                        fontSize={{ base: "16px", md: "18px", lgp: "18px" }}
                        fontWeight="400"
                        color="#C7C7C7"
                      >
                        نتعامل مع جميع البيانات الشخصية التي تزودنا بها
                        باعتبارها معلومات سرية. لحماية البيانات الشخصية من
                        الوصول غير المصرح به أو التسريب، اعتمدنا ونتابع بانتظام
                        سياسات وإجراءات الأمان وخصوصية البيانات لدينا. نحن
                        نستخدم بروتوكول SSL – وهو معيار معتمد في التشفير عبر
                        الإنترنت لحماية البيانات. وحينما تدخل معلومات حساسة،
                        سيتم تشفيرها تلقائياً ونقلها عبر بروتوكول SSL. ويضمن ذلك
                        تشفير بياناتك الحساسة أثناء انتقالها عبر الإنترنت.
                        ويمكنك أن تعرف أنك في وضع آمن عند ظهور رمز الأمان (علامة
                        مثل القفل) على الشاشة.
                      </Text>
                    </Box>
                  </Flex>
                  <Text
                    mb="10px"
                    mt="15px"
                    fontSize={{ base: "16px", md: "18px", lgp: "18px" }}
                    color="#ffffff"
                    fontFamily="700"
                  >
                    الضوابط الأمنية
                  </Text>
                  <Flex mb="30px">
                    <Box
                      fontSize={{ base: "16px", md: "18px", lgp: "18px" }}
                      fontWeight="400"
                    >
                      4.4
                    </Box>{" "}
                    <Box pl="12px">
                      <Text
                        fontSize={{ base: "16px", md: "18px", lgp: "18px" }}
                        fontWeight="400"
                        color="#C7C7C7"
                      >
                        حيثما نقدم لك (أو حيثما اخترت) كلمة مرور، فأنت مسؤول عن
                        الحفاظ على سريتها والامتثال لأية إجراءات أمنية أخرى
                        نخطرك بها. نطلب منك عدم إطلاع أي أحد على كلمة المرور
                        الخاصة بك.
                      </Text>
                    </Box>
                  </Flex>
                  <Flex mb="30px">
                    <Box
                      fontSize={{ base: "16px", md: "18px", lgp: "18px" }}
                      fontWeight="400"
                    >
                      4.5
                    </Box>{" "}
                    <Box pl="12px">
                      <Text
                        fontSize={{ base: "16px", md: "18px", lgp: "18px" }}
                        fontWeight="400"
                        color="#C7C7C7"
                      >
                        تقوم الشركة بتعريف موظفيها بمدى أهمية خصوصية البيانات
                        وسُبل حمايتها. يتم تحديث سياسة الخصوصية لدينا على النحو
                        المطلوب بما يعكس أي تغييرات في القوانين المعمول بها
                        والتطورات التي تشهدها إجراءات أفضل الممارسات. وبالإضافة
                        إلى ذلك، فإننا نحصر عدد الأفراد داخل الشركات الذين
                        يمكنهم الوصول إلى البيانات الشخصية على هؤلاء الذين
                        يشاركون مباشرة في تزويدك بخدمة عالية الجودة.
                      </Text>
                    </Box>
                  </Flex>
                  <Flex mb="30px">
                    <Box
                      fontSize={{ base: "16px", md: "18px", lgp: "18px" }}
                      fontWeight="400"
                    >
                      4.6
                    </Box>{" "}
                    <Box pl="12px">
                      <Text
                        fontSize={{ base: "16px", md: "18px", lgp: "18px" }}
                        fontWeight="400"
                        color="#C7C7C7"
                      >
                        6 نقوم بتخزين بعض معلومات العملاء في نظام معلومات
                        العملاء. وهذا النظام عبارة عن قواعد بيانات عملاء آمنة
                        ومخزنة على خادم خاص بذلك وموجود بمركز بيانات في أيرلندا
                        حيث يستضيفه مزود خدمة من طرف آخر. ويوجد خادمنا خلف جدران
                        حماية لحماية بياناتك الشخصية من أي وصول غير مصرح به أو
                        عَرَضي. ونظراً لأن القوانين المعمول بها بالنسبة
                        للمعلومات الشخصية تتباين من دولة لأخرى، فقد نضع تدابير
                        إضافية تختلف وفقاً للمتطلبات القانونية المعمول بها.
                      </Text>
                      <Text
                        mb="10px"
                        mt="15px"
                        fontSize={{ base: "16px", md: "18px", lgp: "18px" }}
                        color="#ffffff"
                        fontFamily="700"
                      >
                        نقل البيانات عبر الحدود الدولية
                      </Text>
                    </Box>
                  </Flex>

                  <Flex mb="30px">
                    <Box
                      fontSize={{ base: "16px", md: "18px", lgp: "18px" }}
                      fontWeight="400"
                    >
                      4.7
                    </Box>{" "}
                    <Box pl="12px">
                      <Text
                        fontSize={{ base: "16px", md: "18px", lgp: "18px" }}
                        fontWeight="400"
                        color="#C7C7C7"
                      >
                        تتطلب منا طبيعة أعمالنا وعملياتنا نقل بياناتك الشخصية
                        إلى موزعين أو مراكز عمليات أو مراكز بيانات أو موفري
                        خدمات معتمدين آخرين قد يكونون موجودين في دول أخرى غير
                        دولتك للأغراض المذكورة في سياسة الخصوصية هذه. وعلى الرغم
                        من أن قوانين حماية البيانات والقوانين الأخرى لهذه
                        البلدان المختلفة قد لا تكون شاملة مثل تلك الموجودة في
                        بلدك، فإن الشركة سوف تتخذ التدابير المناسبة، بما في ذلك
                        تنفيذ البنود التعاقدية المحدثة، لضمان تأمين نقل بياناتك
                        إلى المستلمين (والتي قد تكون جهات داخلية أو خارجية
                        بالنسبة للشركة) الموجودين في بلد يختلف مستوى الحماية به
                        عما هو موجود في البلد الذي يتم فيه جمع بياناتك.
                      </Text>
                    </Box>
                  </Flex>
                  <Flex mb="30px">
                    <Box
                      fontSize={{ base: "16px", md: "18px", lgp: "18px" }}
                      fontWeight="400"
                    >
                      4.8
                    </Box>{" "}
                    <Box pl="12px">
                      <Text
                        fontSize={{ base: "16px", md: "18px", lgp: "18px" }}
                        fontWeight="400"
                        color="#C7C7C7"
                      >
                        عندما يتم نقل بياناتك الشخصية إلى دولة قد تكون فيها
                        قوانين حماية البيانات ذات مستوى أقل من الدولة التي تقوم
                        بالنقل، فإن الشركة سوف يفرض نفس إجراءات حماية البيانات
                        التي نستخدمها في البلدان التي نعمل بها لضمان تحقيق مستوى
                        كاف لحماية هذه البيانات.
                      </Text>
                    </Box>
                  </Flex>
                  <Flex mb="30px">
                    <Box
                      fontSize={{ base: "16px", md: "18px", lgp: "18px" }}
                      fontWeight="400"
                    >
                      4.9
                    </Box>{" "}
                    <Box pl="12px">
                      <Text
                        fontSize={{ base: "16px", md: "18px", lgp: "18px" }}
                        fontWeight="400"
                        color="#C7C7C7"
                      >
                        قد يتعين نقل البيانات الشخصية التي تم جمعها باستخدام
                        الوسائل الموجودة في البحرين إلى خارج البحرين للمعالجة.
                        ونظراً لعدم وجود اختصاصات قضائية معتمدة توفر المستوى
                        الكافي من حماية البيانات الذي تقتضيه القوانين في
                        البحرين، فإن أي نقل للبيانات الشخصية خارج البحرين يتطلب
                        موافقتك. وبحسب متطلبات العمل، قد نقوم بنقل بياناتك
                        الشخصية إلى المملكة العربية السعودية وسويسرا وأيرلندا
                        ("اختصاصات قضائية معتمدة") وأنت توافق على نقل بياناتك
                        الشخصية إلى الاختصاصات القضائية المعتمدة.
                      </Text>
                      <Text
                        mb="10px"
                        mt="15px"
                        fontSize={{ base: "16px", md: "18px", lgp: "18px" }}
                        color="#ffffff"
                        fontFamily="700"
                      >
                        الاحتفاظ بالمعلومات
                      </Text>
                    </Box>
                  </Flex>

                  <Flex mb="30px">
                    <Box
                      fontSize={{ base: "16px", md: "18px", lgp: "18px" }}
                      fontWeight="400"
                    >
                      4.10
                    </Box>{" "}
                    <Box pl="12px">
                      <Text
                        fontSize={{ base: "16px", md: "18px", lgp: "18px" }}
                        fontWeight="400"
                        color="#C7C7C7"
                      >
                        سيتم تخزين بياناتك الشخصية على مدى الفترة الزمنية
                        المطلوبة أو التي يسمح بها القانون في الاختصاص القضائي
                        لعملية الاحتفاظ بالمعلومات (على سبيل المثال، قد يتم
                        الاحتفاظ بتفاصيل معينة عن المعاملات والمراسلات حتى
                        انتهاء المهلة الزمنية للمطالبات المتعلقة بالمعاملة أو من
                        أجل الامتثال للمتطلبات التنظيمية فيما يتعلق بالاحتفاظ
                        بهذه البيانات). لذلك إذا كانت معلومات ما تستخدم لغرضين
                        اثنين، فسوف نحتفظ بها حتى انتهاء الغرض ذي الفترة
                        الأخيرة، ولكننا سوف نتوقف عن استخدامه للغرض ذي الفترة
                        الزمنية الأقصر بمجرد انتهاء تلك الفترة.
                      </Text>
                    </Box>
                  </Flex>
                  <Flex mb="30px">
                    <Box
                      fontSize={{ base: "16px", md: "18px", lgp: "18px" }}
                      fontWeight="400"
                    >
                      4.11
                    </Box>{" "}
                    <Box pl="12px">
                      <Text
                        fontSize={{ base: "16px", md: "18px", lgp: "18px" }}
                        fontWeight="400"
                        color="#C7C7C7"
                      >
                        11 تعتمد فترات الاحتفاظ لدينا على احتياجات العمل،
                        والمعلومات الخاصة بك التي تنتهي الحاجة إليها إما أن يتم
                        تجهيلها بشكل نهائي (يمكن الاحتفاظ بالمعلومات مجهولة
                        المصدر) أو يتم إتلافها بشكل آمن بمجرد انتهاء الغرض الذي
                        جمعنا من أجله هذه البيانات الشخصية. وعلى سبيل المثال:
                      </Text>
                      <Text color="#C7C7C7" mb="10px" mt="15px">
                        (أ) استخدامها في الرسائل التسويقية: فيما يتعلق ببياناتك
                        الشخصية التي استخدمت لأغراض التسويق، قد نحتفظ ببياناتك
                        الشخصية لهذا الغرض بعد حصولنا على الموافقة على تزويدك
                        برسائل تسويقية، أو بعد آخر مرة استجبت فيها لرسالة
                        تسويقية منا (هذا بخلاف اختيار عدم تلقي رسائل أخرى).
                      </Text>
                      <Text color="#C7C7C7" mb="10px" mt="15px">
                        (ب) استخدامها لتنفيذ عقد: فيما يتعلق ببياناتك الشخصية
                        المستخدمة لتنفيذ أي إلتزام تعاقدي معك، يجوز لنا الاحتفاظ
                        بتلك البيانات الشخصية أثناء سريان العقد ولفترة معينة بعد
                        ذلك للتعامل مع أي استفسارات أو مطالبات تردنا بعد ذلك.
                      </Text>
                      <Text color="#C7C7C7" mb="10px" mt="15px">
                        (ج) عند التفكير في المطالبات: فيما يتعلق بأي معلومات
                        نعتقد بدرجة معقولة أنها ستكون ضرورية للدفاع أو المقاضاة
                        أو رفع دعوى ضدك أو ضدنا أو ضد طرف ثالث، يجوز لنا
                        الاحتفاظ بهذه المعلومات طالما بقيت هناك إمكانية لمتابعة
                        هذه المطالبات.
                      </Text>
                      <Text
                        mb="10px"
                        mt="15px"
                        color="#ffffff"
                        fontFamily="700"
                      >
                        المراقبة و الحفاظ على التواصل الالكتروني
                      </Text>
                    </Box>
                  </Flex>
                  <Flex mb="30px">
                    <Box
                      fontSize={{ base: "16px", md: "18px", lgp: "18px" }}
                      fontWeight="400"
                    >
                      4.12
                    </Box>{" "}
                    <Box pl="12px">
                      <Text
                        fontSize={{ base: "16px", md: "18px", lgp: "18px" }}
                        fontWeight="400"
                        color="#C7C7C7"
                      >
                        نحن نحتفظ بالحق، إلى الحد المسموح به بموجب القانون أو
                        اللوائح التي تنطبق علينا، في مراقبة وتسجيل، بدون إشعار،
                        أي أو كل الاتصالات (بما في ذلك البريد الإلكتروني
                        والرسائل القصيرة والرسائل الفورية) والمكالمات الهاتفية.
                        علاوة على ذلك، فإنك توافق على استخدام أي من هذا التسجيل
                        كدليل في أي فعل أو إجراء ينشأ من هذه الاتفاقية و نحتفظ
                        بالحق في محو أي تسجيل، وفقاً لتقديرنا، كجزء من إجراءاتنا
                        المعتادة لـلتعامل مع التسجيلات.
                      </Text>
                    </Box>
                  </Flex>
                  <Flex mb="30px">
                    <Box
                      fontSize={{ base: "16px", md: "18px", lgp: "18px" }}
                      fontWeight="400"
                      color="#fff"
                    >
                      5.
                    </Box>{" "}
                    <Box pl="12px">
                      <Text
                        fontSize={{ base: "16px", md: "18px", lgp: "18px" }}
                        fontWeight="400"
                        color="#fff"
                      >
                        حقوقك الانسحاب من التسويق
                      </Text>
                    </Box>
                  </Flex>
                  <Flex mb="30px">
                    <Box
                      fontSize={{ base: "16px", md: "18px", lgp: "18px" }}
                      fontWeight="400"
                    >
                      5.1
                    </Box>{" "}
                    <Box pl="12px">
                      <Text
                        fontSize={{ base: "16px", md: "18px", lgp: "18px" }}
                        fontWeight="400"
                        color="#C7C7C7"
                      >
                        يحق لك مطالبتنا بعدم معالجة بياناتك الشخصية لأغراض
                        تسويقية. يمكنك أيضاً ممارسة هذا الحق في أي وقت عن طريق
                        التواصل معنا.
                      </Text>
                    </Box>
                  </Flex>
                  <Text mb="10px" mt="15px" color="#ffffff" fontFamily="700">
                    حقوق أخرى
                  </Text>
                  <Flex mb="30px">
                    <Box
                      fontSize={{ base: "16px", md: "18px", lgp: "18px" }}
                      fontWeight="400"
                    >
                      5.2
                    </Box>{" "}
                    <Box pl="12px">
                      <Text
                        fontSize={{ base: "16px", md: "18px", lgp: "18px" }}
                        fontWeight="400"
                        color="#C7C7C7"
                      >
                        مع مراعاة الاستثناءات المختلفة وقوانين حماية البيانات في
                        بلدك، يمكنك ممارسة الحقوق التالية:
                      </Text>
                      <Text color="#C7C7C7" mb="10px" mt="15px">
                        الوصول: يمكنك أن تطلب منا تزويدك بمزيد من التفاصيل حول
                        استخدامنا لبياناتك الشخصية وكذلك نسخة من البيانات
                        الشخصية التي نحتفظ بها عنك.
                      </Text>
                      <Text color="#C7C7C7" mb="10px" mt="15px">
                        (ب) التصحيح: يمكنك أن تطلب منا تصحيح أي أخطاء في بياناتك
                        الشخصية التي نحتفظ بها.
                      </Text>
                      <Text color="#C7C7C7" mb="10px" mt="15px">
                        (ج) الشكوى: إذا لم تكن راضياً عن استخدامنا لبياناتك
                        الشخصية أو ردنا على أي ممارسة لهذه الحقوق، فإنه يحق لك
                        تقديم شكوى إلى هيئة حماية البيانات في بلدك (إن وجدت).
                      </Text>
                      <Text color="#C7C7C7" mb="10px" mt="15px">
                        (د) محو البيانات: يمكنك أن تطلب منا حذف بياناتك الشخصية
                        إذا لم يعد لدينا أساس قانوني لاستخدامها.
                      </Text>
                      <Text color="#C7C7C7" mb="10px" mt="15px">
                        (هـ) سحب الموافقة: حيثما تعتمد معالجة البيانات على
                        الموافقة (مثل التسويق)، يمكنك سحب موافقتك على المعالجة
                        حتى نوقف هذه المعالجة.
                      </Text>
                      <Text color="#C7C7C7" mb="10px" mt="15px">
                        (و) الاعتراض على المعالجة: يحق لك الاعتراض على أنواع
                        أخرى من المعالجة (مثل التحليلات وأنشطة التوصيف التي يتم
                        إجراؤها فيما يتعلق ببياناتك الشخصية أو أي معالجة تسبب لك
                        ضرراً مادياً أو معنوياً لك)، ما لم تكن الأسباب وراء
                        قيامنا بهذه المعالجة تفوق أي مساس بحقوق حماية البيانات
                        الخاصة بك.
                      </Text>
                      <Text color="#C7C7C7" mb="10px" mt="15px">
                        (ز) القيود: يمكنك تحديد كيفية استخدامنا لبياناتك
                        الشخصية، على سبيل المثال أثناء قيامنا بالتحقق من دقة
                        بياناتك الشخصية أو حيثما نتحقق من الأسس التي تستخدم
                        كأساس للاحتفاظ ببياناتك الشخصية.
                      </Text>
                      <Text color="#C7C7C7" mb="10px" mt="15px">
                        (ح) قابلية النقل: حيثما يكون ذلك ممكناً من الناحية
                        الفنية، يحق لك مطالبتنا بإرسال البيانات الشخصية التي
                        زودتنا بها إلى طرف ثالث في نموذج منظم وشائع الاستخدام
                        ويمكن قراءته آلياً.
                      </Text>
                    </Box>
                  </Flex>
                  <Text mb="10px" mt="15px" color="#ffffff" fontFamily="700">
                    تحديث أو تعديل المعلومات
                  </Text>
                  <Flex mb="30px">
                    <Box>5.3</Box>{" "}
                    <Box pl="12px">
                      <Text
                        fontSize={{ base: "16px", md: "18px", lgp: "18px" }}
                        fontWeight="400"
                        color="#C7C7C7"
                      >
                        سوف نبذل كل جهد ممكن لضمان دقة بياناتك الشخصية.
                        ولمساعدتنا في ذلك، يجب عليك إخطارنا عبر الاتصال بنا بأي
                        تغييرات تطرأ على البيانات الشخصية التي قدمتها لنا.
                      </Text>
                    </Box>
                  </Flex>
                  <Text mb="10px" mt="15px" color="#ffffff" fontFamily="700">
                    الإخطار في حالة تعرض البيانات للخرق
                  </Text>
                  <Flex mb="30px">
                    <Box>5.4</Box>{" "}
                    <Box pl="12px">
                      <Text
                        fontSize={{ base: "16px", md: "18px", lgp: "18px" }}
                        fontWeight="400"
                        color="#C7C7C7"
                      >
                        في حالة تعرض البيانات لخرق غير متوقع، فنحن على استعداد
                        لاتباع أي قوانين ولوائح تتطلب منا إخطارك بانكشاف
                        المعلومات الخاصة.
                      </Text>
                    </Box>
                  </Flex>
                  <Flex mb="30px">
                    <Box>6.</Box>{" "}
                    <Box pl="12px">
                      <Text
                        fontSize={{ base: "16px", md: "18px", lgp: "18px" }}
                        fontWeight="400"
                        color="#fff"
                      >
                        ملفات تعريف الارتباط
                      </Text>
                      <Text color="#C7C7C7" mb="10px" mt="15px">
                        يستخدم موقعنا الإلكتروني ملفات تعريف الارتباط لجمع
                        معلومات معينة عنك وتخزينها، ولتمييزك عن المستخدمين
                        الآخرين لهذا الموقع. يساعدنا هذا في تزويدك بتجربة جيدة
                        عند تصفح الموقع الخاص بنا ويتيح لنا أيضاً تحسين موقعنا.
                        ملف تعريف الارتباط هو ملف نصي صغير يتم إرساله بواسطة
                        الموقع، ويتم قبوله بواسطة متصفح الإنترنت ثم يتم وضعه على
                        محرك الأقراص الثابتة لديك. تتيح لنا المعلومات التي تم
                        جمعها من ملفات تعريف الارتباط معرفة أنك زرت موقعنا في
                        الماضي، وتساعدك على تجنب الاضطرار إلى إعادة إدخال
                        المعلومات في كل زيارة من أجل استخدام بعض منتجاتنا أو
                        خدماتنا، وغير ذلك من أمور. ونحن نستخدم في هذا الموقع
                        مجموعة متنوعة من ملفات تعريف الارتباط:
                      </Text>
                      <Text color="#C7C7C7" mb="10px" mt="15px">
                        ضرورية للغاية: ملفات تعريف الارتباط هذه ضرورية لعمل
                        الموقع ولا يمكن إيقاف تشغيلها في أنظمتنا. عادةً ما يتم
                        تقديمها فقط استجابةً لإجراء قمت به ويرقى إلى مستوى طلب
                        خدمات مثل تحديد تفضيلات الخصوصية لديك أو تسجيل الدخول أو
                        ملء النماذج. يمكنك ضبط المتصفح الخاص بك على حظر أو
                        تنبيهك بشأن ملفات تعريف الارتباط هذه، ولكن إذا قمت بذلك،
                        فلن تعمل لديك بعض أقسام الموقع. ولا تخزن ملفات تعريف
                        الارتباط هذه أي معلومات شخصية.
                      </Text>
                      <Text color="#C7C7C7" mb="10px" mt="15px">
                        ملفات تعريف الارتباط الخاصة بالأداء: تتيح لنا ملفات
                        تعريف الارتباط هذه حساب عدد الزيارات ومصادر الزيارات حتى
                        نتمكن من قياس أداء موقعنا وتحسينه. وتساعدنا في معرفة أي
                        الصفحات أكثر زيارة وأيها أقل، ومعرفة كيفية تحرك الزوار
                        في جميع أقسام الموقع. ويتم تجميع كل المعلومات التي
                        تجمعها ملفات تعريف الارتباط هذه وبالتالي فهي مجهولة
                        المصدر. إذا لم تسمح بملفات تعريف الارتباط هذه، فلن نعرف
                        متى قمت بزيارة موقعنا ولن نتمكن من متابعة أدائه.
                      </Text>
                      <Text color="#C7C7C7" mb="10px" mt="15px">
                        ملفات تعريف الارتباط الوظيفية: تُمكّن ملفات تعريف
                        الارتباط هذه الموقع من تأدية مهامه بشكل أفضل وإضفاء
                        الطابع الشخصي. وقد يتم تحديدها من قبلنا أو بواسطة مزودي
                        خدمة آخرين ممنا أضفنا خدماتهم إلى صفحاتنا. إذا لم تسمح
                        بملفات تعريف الارتباط هذه، فقد لا تعمل بعض أو كل هذه
                        الخدمات على النحو الصحيح.
                      </Text>
                      <Text color="#C7C7C7" mb="10px" mt="15px">
                        ملفات تعريف الارتباط الخاصة بالاستهداف: قد يتم تحديد
                        ملفات تعريف الارتباط هذه من خلال موقعنا بواسطة شركائنا
                        الإعلانيين. قد تستخدمها هذه الشركات لتكوين صورة تعريفية
                        عن اهتماماتك وعرض الإعلانات ذات الصلة على مواقع أخرى. لا
                        تقوم هذه الملفات بتخزين المعلومات الشخصية مباشرة، ولكنها
                        تعتمد على تحديد متصفحك وجهاز الإنترنت الخاص بك بشكل
                        فريد. إذا لم تسمح بملفات تعريف الارتباط هذه، فسوف تواجه
                        إعلانات أقل ملاءمة لك.
                      </Text>
                      <Text color="#C7C7C7" mb="10px" mt="15px">
                        ملفات تعريف الارتباط الخاصة بوسائل التواصل الاجتماعي:
                        يتم تحديد ملفات تعريف الارتباط هذه بواسطة مجموعة من
                        خدمات الوسائط الاجتماعية التي ربما نضيفها إلى الموقع
                        لتمكينك من مشاركة المحتوى الخاص بنا مع أصدقائك والشبكات
                        الاجتماعية أو المهنية. وهي قادرة على تتبع متصفحك عبر
                        مواقع أخرى وإنشاء ملف تعريفي لاهتماماتك. قد يؤثر ذلك على
                        المحتوى والرسائل التي تراها على المواقع الأخرى التي
                        تزورها. إذا لم تسمح بهذا النوع من ملفات تعريف الارتباط،
                        فقد لا تتمكن من استخدام أو مشاهدة أدوات المشاركة هذه.
                      </Text>
                    </Box>
                  </Flex>
                  <Flex mb="30px">
                    <Box>7.</Box>{" "}
                    <Box pl="12px">
                      <Text
                        fontSize={{ base: "16px", md: "18px", lgp: "18px" }}
                        fontWeight="400"
                        color="#fff"
                      >
                        إدخال تغييرات على سياسة الخصوصية
                      </Text>
                      <Text color="#C7C7C7" mb="10px" mt="15px">
                        قد نحتاج مستقبلاً إلى إدخال تغييرات إضافية. سوف يتم
                        إدراج جميع التغييرات الإضافية في أحدث بيان لسياسة
                        الخصوصية المنشور على هذا الموقع، وذلك حتى تظل دائماً على
                        علم بممارساتنا الحالية فيما يتعلق بالمعلومات التي نجمعها
                        وطريقة استخدام هذه المعلومات والإفصاح عن تلك المعلومات
                        لأطراف أخرى. يمكنك معرفة تاريخ آخر تحديث لسياسة الخصوصية
                        هذه من خلال التاريخ الموجود في أسفل سياسة الخصوصية.
                        وتحتفظ الشركة بالحق، وفقاً لتقديره وحده، في تعديل أو
                        تغيير أو تحديث سياسة الخصوصية هذه في أي وقت. لن تكون أي
                        تغييرات سارية إلا بعد تاريخ نفاذ التغيير ولن تؤثر على أي
                        نزاع قد ينشأ قبل هذا التاريخ.
                      </Text>
                    </Box>
                  </Flex>
                  <Flex mb="30px">
                    <Box>8.</Box>{" "}
                    <Box pl="12px">
                      <Text
                        fontSize={{ base: "16px", md: "18px", lgp: "18px" }}
                        fontWeight="400"
                        color="#fff"
                      >
                        مواقع أخرى
                      </Text>
                      <Text color="#C7C7C7" mb="10px" mt="15px">
                        قد يحتوي هذا الموقع على روابط لمواقع إلكترونية تابعة
                        لأطراف أخرى. إذا اتبعت رابطاً لأي من هذه المواقع، فيرجى
                        ملاحظة أن لديهم سياسة خصوصية خاصة بهم وأننا لا نتحمل أي
                        مسؤولية أو نقبل أي التزام عن سياساتهم أو معالجة معلوماتك
                        الشخصية. يرجى مراجعة هذه السياسات قبل إرسال أي معلومات
                        شخصية إلى المواقع الخاصة بهذه الأطراف الأخرى.
                      </Text>
                    </Box>
                  </Flex>
                  <Flex mb="30px">
                    <Box>9.</Box>{" "}
                    <Box pl="12px">
                      <Text
                        fontSize={{ base: "16px", md: "18px", lgp: "18px" }}
                        fontWeight="400"
                        color="#fff"
                      >
                        حقوق إضافية
                      </Text>
                      <Text color="#C7C7C7" mb="10px" mt="15px">
                        قد تمنحك القوانين المعمول بها حقوقاً إضافية غير منصوص
                        عليها في سياسة الخصوصية هذه.
                      </Text>
                    </Box>
                  </Flex>
                </Box>
                <Text
                  w="100%"
                  margin="auto"
                  borderBottom="1px solid #222222"
                ></Text>
                <Box textAlign="start" mt="30px">
                  <Text color="#ffffff" mb="30px" fontWeight="700">
                    اتصل بنا:
                  </Text>
                  <Text mb="30px">
                    للمزيد من المعلومات أو للاستفسار حول اتفاقية المستخدم أو
                    سياسة الخصوصية هذه، يرجى الاتصال بـ:
                  </Text>
                  <Box mb="30px">
                    <Text>خدمة العملاء </Text>
                    <Text color="primary.500" fontWeight="600">
                      onboarding@tfoco.com
                    </Text>
                  </Box>
                </Box>
                <Box mb="30px">
                  <Text mb="15px" textAlign="start">
                    لقد بلغت السن القانونية التي تؤهلني للدخول في اتفاقية
                    المستخدم هذه، وبموجب ذلك أتعهد بالالتزام بشروطها وأحكامها.
                  </Text>
                  <Box d="flex" mb="15px" style={{ gap: "4px" }}>
                    <Checkbox
                      colorScheme="primary"
                      color="gray.400"
                      fontWeight="400"
                      fontSize="14px"
                    />
                    <Text textAlign="start">أوافق </Text>
                  </Box>
                  <Box d="flex" mb="15px" style={{ gap: "4px" }}>
                    <Checkbox
                      colorScheme="primary"
                      color="gray.400"
                      fontWeight="400"
                      fontSize="14px"
                    />
                    <Text textAlign="start">
                      (أوافق على معالجة معلوماتي الشخصية المرسلة إلى شركة The
                      Family Office أو تلك التي تم جمعها من قبل شركة The Family
                      Office وفقاً لسياسة خصوصية الموقع)
                    </Text>
                  </Box>
                  <Text mb="15px" textAlign="start">
                    (يجب على المستخدم تحديد مربعيَّ الاختيار الاثنين حتى يمكنه
                    المتابعة واستخدام الموقع)
                  </Text>
                </Box>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  )
}
