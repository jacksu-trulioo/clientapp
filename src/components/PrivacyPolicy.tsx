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

import { CloseIconSetting, TFOLogo } from "~/components"

type PrivacyPolicyType = {
  show: boolean
  close: () => void
}

export default function PrivacyPolicy({ show, close }: PrivacyPolicyType) {
  const { onClose } = useDisclosure({ defaultIsOpen: true })
  const { lang } = useTranslation("setting")

  return (
    <>
      <Modal isOpen={show} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent
          bg="#111111"
          border="1px solid #4D4D4D"
          mx={{ base: "20px", md: "0px" }}
          borderRadius="6px"
          w={{ base: "343px", md: "645px", lgp: "856px" }}
          h={{ base: "600px", md: "500px" }}
          maxW="865px"
          pb="15px"
        >
          <Flex px="29px" py="12px">
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
              <CloseIconSetting />
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
                  aria-label="TFO Privacy Policy"
                  as="p"
                  mb="24px"
                  textAlign="start"
                  fontSize={{ base: "18px", md: "20px" }}
                  color="#fff"
                  pt="10px"
                  fontWeight="600"
                >
                  The Family Office Co. BSC(c) Privacy Policy
                </Box>
              </Box>
              <Box m="0px" textAlign="start">
                <Box
                  as="p"
                  m="0"
                  fontSize={{ base: "16px", md: "18px" }}
                  color="#fff"
                  py="10px"
                >
                  Agreement.
                </Box>
                <Box as="p" color="#FFFFFF" mb="10px">
                  Please read the following information carefully before using
                  this Application. By clicking “I accept” below, you agree to
                  be bound by this User Agreement. If you do not agree with any
                  part of the User Agreement, do not use this Application. TFO
                  (defined below) reserves the right, in its sole discretion, to
                  modify, alter or otherwise update this User Agreement at any
                  time, and by clicking “I accept” to the revisions, you accept
                  the modification. Where required, we may also provide
                  additional mechanisms for consent to changes to this User
                  Agreement. Any changes will be effective only after the
                  effective date of the change and will not affect any dispute
                  arising prior to the effective date of the change.
                </Box>
                <Box as="p" color="#C7C7C7" mb="10px">
                  The Family Office Co. BSC(c) online Application (the
                  "Application") is an online digital platform where you can
                  apply to open an account upon the supply of certain
                  information and where you can view certain information of The
                  Family Office Co. BSC(c) and certain of its affiliates
                  ("TFO"), and is available subject to your compliance with the
                  terms and conditions set forth below. Nothing in this User
                  Agreement or the Application shall be construed as creating
                  any warranty or other obligation on the part of TFO.
                </Box>
                <Box as="p" color="#C7C7C7" mb="10px">
                  This Application is intended only for prospective and current
                  clients of TFO. This User Agreement relates solely to the
                  Application and is in addition to, and is incorporated by
                  reference into, and shall be governed by the governing law
                  provisions of and subject to the dispute resolution mechanisms
                  set forth in, the Account Opening Packet. In the event of any
                  conflict, the terms of this User Agreement shall take
                  precedence over the Account Opening Packet with respect to the
                  Application only, and otherwise the terms of the Account
                  Opening Packet shall take precedence with respect to your
                  relationship with TFO.
                </Box>
                <Box as="p" color="#C7C7C7" mb="10px">
                  This Application is not intended for use by individuals under
                  the age of eighteen (18). Users of this Application must be at
                  least 18 years old, or of legal age to enter into agreements
                  in the user’s jurisdiction, whichever is older.
                </Box>
                <Box as="p" color="#C7C7C7" mb="10px">
                  This Application is intended to be used by individuals in
                  permitted jurisdictions.
                </Box>
              </Box>
              <Box m="0px" textAlign="start">
                <Box as="p" m="0" fontSize="18px" color="#fff" py="10px">
                  Disclaimer of Warranties; Limitation of Liability.
                </Box>
                <Text color="#C7C7C7" mb="10px" textDecoration="none">
                  THIS APPLICATION AND THE INFORMATION PROVIDED THROUGH THE
                  APPLICATION ARE PROVIDED "AS IS" WITHOUT WARRANTY OF ANY KIND,
                  EITHER EXPRESSED OR IMPLIED, INCLUDING, BUT NOT LIMITED TO,
                  THE IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
                  PARTICULAR PURPOSE, OR NON-INFRINGEMENT. TFO DOES NOT WARRANT
                  THAT THE APPLICATION WILL BE UNINTERRUPTED OR ERROR FREE, THAT
                  DEFECTS WILL BE CORRECTED, OR THAT THE APPLICATION THAT MAKES
                  THE ACCOUNT AND OTHER INFORMATION AVAILABLE IS FREE OF VIRUSES
                  OR OTHER HARMFUL COMPONENTS. These warranties are hereby
                  excluded to the fullest extent permissible by law. UNDER NO
                  CIRCUMSTANCES SHALL TFO BE LIABLE FOR ANY DIRECT OR INDIRECT,
                  SPECIAL, INCIDENTAL OR CONSEQUENTIAL DAMAGES THAT MAY ARISE
                  FROM YOUR USE OF, OR INABILITY TO USE, THIS APPLICATION OR THE
                  INFORMATION. Some jurisdictions do not allow the exclusion or
                  limitation of liability for consequential or incidental
                  damages. In such jurisdictions, TFO’s liability is limited to
                  the greatest extent permitted by law. In the event of any
                  conflict or inconsistency between the information provided
                  through the Application and the information provided to you
                  directly from or on behalf of TFO via regular communications,
                  the information provided via regular communications takes
                  precedence.
                </Text>
                <Text color="#C7C7C7" mb="10px" textDecoration="none">
                  BY ACCESSING AND USING THE APPLICATION, YOU UNDERSTAND THAT
                  YOU MAY BE WAIVING RIGHTS WITH RESPECT TO CLAIMS THAT ARE AT
                  THIS TIME UNKNOWN OR UNSUSPECTED, AND IN ACCORDANCE WITH SUCH
                  WAIVER, YOU ACKNOWLEDGE THAT YOU HAVE READ AND UNDERSTAND, AND
                  HEREBY EXPRESSLY WAIVE, THE BENEFITS OF ANY LAW OF ANY
                  JURISDICTION WHICH PROVIDES SUBSTANTIALLY AS FOLLOWS: "A
                  GENERAL RELEASE DOES NOT EXTEND TO CLAIMS WHICH THE CREDITOR
                  DOES NOT KNOW OR SUSPECT TO EXIST IN HIS OR HER FAVOR AT THE
                  TIME OF EXECUTING THE RELEASE, WHICH IF KNOWN BY HIM OR HER
                  MUST HAVE MATERIALLY AFFECTED HIS OR HER SETTLEMENT WITH THE
                  DEBTOR."
                </Text>
                <Box as="p" color="#C7C7C7" mb="10px">
                  THE LIMITATIONS AND DISCLAIMERS IN THIS SECTION DO NOT PURPORT
                  TO LIMIT LIABILITY OR ALTER YOUR RIGHTS AS A CONSUMER THAT
                  CANNOT BE EXCLUDED UNDER APPLICABLE LAW.
                </Box>
              </Box>
              <Box m="0px" textAlign="start">
                <Box as="p" m="0" fontSize="18px" color="#fff" py="10px">
                  Force Majeure
                </Box>
                <Box as="p" color="#C7C7C7" mb="10px">
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
              <Box m="0px" textAlign="start">
                <Box as="p" m="0" fontSize="18px" color="#fff" py="10px">
                  Our Copyrighted Materials; Infringement Claims.
                </Box>
                <Box as="p" color="#C7C7C7" mb="10px">
                  The copyrights in all text, images, screens and other
                  materials provided on this Application (collectively, the
                  "Materials") are owned or licensed by TFO and/or by third
                  parties. Except as provided below, none of the Materials may
                  be copied, distributed, displayed, downloaded, or transmitted
                  in any form or by any means without the prior written
                  permission of TFO or the copyright owner. Unauthorized use of
                  any Materials contained on this Application may violate
                  copyright laws, trademark laws, the laws of privacy and
                  publicity, and/or other regulations and statutes.
                </Box>
              </Box>
              <Box m="0px" textAlign="start">
                <Box as="p" m="0" fontSize="18px" color="#fff" py="10px">
                  Trademarks
                </Box>
                <Box as="p" color="#C7C7C7" mb="10px">
                  Trademarks and service marks that may be referred to on this
                  Application are the property of TFO or their respective
                  owners. Nothing on this Application should be construed as
                  granting, by implication, estoppel, or otherwise, any license
                  or right to use any trademark without TFO’s written
                  permission. The name of TFO or the TFO logo may not be used in
                  any way, including in advertising or publicity pertaining to
                  distribution of materials on this Application, without prior
                  written permission. You are not authorized to use TFO’s logo
                  as a hyperlink to this Application unless you obtain TFO’s
                  written permission in advance, although TFO permits you to use
                  certain designated features of the Application to use TFO’s
                  logo as a hyperlink for designated purposes.
                </Box>
              </Box>
              <Box m="0px" textAlign="start">
                <Box as="p" m="0" fontSize="18px" color="#fff" py="10px">
                  Right to Preserve and Disclose
                </Box>
                <Box as="p" color="#C7C7C7" mb="10px">
                  TFO may preserve all information you provide, consistent with
                  the applicable Privacy Policy. TFO may also disclose
                  information you provide if required to do so by law or in the
                  good faith belief that such preservation or disclosure is
                  reasonably necessary to: (a) complete your transaction; (b)
                  comply with legal process; (c) enforce this User Agreement;
                  (d) respond to claims that any materials on this Application
                  violate your rights or the rights of third parties; (e)
                  protect the rights, property, or personal safety of TFO, its
                  users and/or the public; or (f) in the event that all or
                  substantially all of TFO’s assets are acquired by a
                  third-party.
                </Box>
              </Box>
              <Box m="0px" textAlign="start">
                <Box as="p" m="0" fontSize="18px" color="#fff" py="10px">
                  Prohibited Actions.
                </Box>
                <Box as="p" color="#C7C7C7" mb="10px">
                  You agree not to: (a) decompile, reverse engineer,
                  disassemble, modify, reduce the Application to human
                  perceivable form or create derivative works based upon the
                  Application or any part thereof; (b) disable any licensing or
                  control features of the Application; (c) “frame” the
                  Application or any portion thereof or otherwise cause the
                  Application or its contents to appear to be provided by anyone
                  except TFO; (d) introduce into the Application any virus or
                  other code or routine intended to disrupt or damage the
                  Application, or alter, damage or delete any Materials, or
                  retrieve or record information about the Application or its
                  users; (e) merge the Application or Materials with another
                  program or create derivative works based on the Application or
                  Materials; (f) remove, obscure, or alter any notice of the
                  copyright or other proprietary legends on the Application or
                  Materials; (g) sublicense, assign, translate, rent, lease,
                  lend, resell for profit, distribute or otherwise assign or
                  transfer the Materials or access to the Application to others;
                  (h) use, or allow the use of, the Application or the Materials
                  in contravention of any federal, state, local, foreign or
                  other applicable law, or rules or regulations of regulatory or
                  administrative organizations; or (i) otherwise act in a
                  fraudulent, illegal, malicious or negligent manner when using
                  the Application. Except as expressly provided herein, TFO and
                  the third parties reserve all rights with respect to the
                  Application, and may pursue all legally available options
                  under both civil and criminal laws (and may cooperate with law
                  enforcement agencies) in the event of any violations.
                </Box>
              </Box>
              <Box m="0px" textAlign="start">
                <Box as="p" m="0" fontSize="18px" color="#fff" py="10px">
                  Prohibition on Scripts, Bots, Third Parties.
                </Box>
                <Box as="p" color="#C7C7C7" mb="10px">
                  You shall not access or use the Application by means of any
                  automated program, expert system, electronic agent or “bot,”
                  and shall not give any person or entity access to the
                  Application.
                </Box>
              </Box>
              <Box m="0px" textAlign="start">
                <Box as="p" m="0" fontSize="18px" color="#fff" py="10px">
                  Prohibition on Scraping
                </Box>
                <Box as="p" color="#C7C7C7" mb="10px">
                  You are prohibited from “scraping,” copying, republishing,
                  licensing, or selling the data or information on the
                  Application.
                </Box>
              </Box>
              <Box m="0px" textAlign="start">
                <Box as="p" m="0" fontSize="18px" color="#fff" py="10px">
                  Ownership of Usage Data
                </Box>
                <Box as="p" color="#C7C7C7" mb="10px">
                  TFO may collect and aggregate data about your usage of the
                  Application, and TFO shall be the sole owner of such
                  information.
                </Box>
              </Box>
              <Box m="0px" textAlign="start">
                <Box as="p" m="0" fontSize="18px" color="#fff" py="10px">
                  Links.
                </Box>
                <Box as="p" color="#C7C7C7" mb="10px">
                  Although TFO controls a few hyperlinks in the Application,
                  some links within this Application may lead to third-party
                  Websites or a third-party website. TFO includes these
                  third-party links solely as a convenience to you. The presence
                  of a link does not imply an endorsement of the linked Website
                  or site, its operator, or its contents, or that TFO is in any
                  way affiliated with the linked Website or site unless
                  explicitly indicated in each case in the Website where such
                  materials are linked. The Application does not incorporate any
                  materials appearing in such linked Websites or sites by
                  reference, unless explicitly indicated in each case in the
                  Application where such materials are linked. TFO reserves the
                  right to terminate a link to a third-party Website or site at
                  any time. The third-party Websites and sites are not
                  controlled by TFO, and may have different terms of use and
                  privacy policies, which TFO encourages you to review.
                </Box>
              </Box>
              <Box m="0px" textAlign="start">
                <Box as="p" m="0" fontSize="18px" color="#fff" py="10px">
                  Exclusions And Limitations; Consumer Protection Notice.
                </Box>
                <Box as="p" color="#C7C7C7" mb="10px">
                  If you are a consumer, the provisions in this User Agreement
                  are intended to be only as broad and inclusive as is permitted
                  by the laws of your country of residence. In any event, TFO
                  reserves all rights, defenses and permissible limitations
                  under the law of your country of residence.
                </Box>
              </Box>
              <Box m="0px" textAlign="start">
                <Box as="p" m="0" fontSize="18px" color="#fff" py="10px">
                  Application Control
                </Box>
                <Box as="p" color="#C7C7C7" mb="10px">
                  This Application is controlled by TFO from the jurisdiction of
                  your Account Opening Packet. TFO makes no representation that
                  content or materials in this Application are appropriate or
                  available for use in other jurisdictions. Access to this
                  Application content or materials from jurisdictions where such
                  access is illegal is strictly prohibited. If you choose to
                  access this Application from other jurisdictions, you do so at
                  your own risk. You are always responsible for your compliance
                  with appliable laws.
                </Box>
              </Box>
              <Box m="0px" textAlign="start">
                <Box as="p" m="0" fontSize="18px" color="#fff" py="10px">
                  Governing Law and Dispute Resolution.
                </Box>
                <Box as="p" color="#C7C7C7" mb="10px">
                  This User Agreement and any use of this Application by such
                  user shall be governed by and construed in accordance with the
                  laws of the jurisdiction set forth in the Account Opening
                  Packet and the dispute resolution provisions of the Account
                  Opening Packet shall apply. Until the Account Opening Packet
                  is executed, this User Agreement and any use of this
                  Application by such user shall be governed by and construed in
                  accordance with the laws of the Kingdom of Bahrain, without
                  regard to the conflict of laws principles thereof, and such
                  user irrevocably agrees that any legal action arising out of
                  or relating to this User Agreement or such use may be brought
                  by or on behalf of such user only in the courts of Bahrain and
                  irrevocably submits to the jurisdiction of such courts. Such
                  user irrevocably agrees that TFO shall have the right to
                  commence any legal action against such user and/or its assets
                  in any other jurisdiction or to serve process in any manner
                  permitted by law, and the taking of proceedings in any
                  jurisdiction shall not preclude TFO from taking proceedings in
                  any other jurisdiction whether concurrently or not.
                </Box>
              </Box>
              <Box m="0px" textAlign="start">
                <Box as="p" m="0" fontSize="18px" color="#fff" py="10px">
                  Not Authorized to Do Business In Every Jurisdiction.
                </Box>
                <Box as="p" color="#C7C7C7" mb="10px">
                  TFO is not authorized to do business generally or to provide
                  certain services in every jurisdiction. Information published
                  on this Application may contain references or cross-references
                  to goods or services that are not available in your state or
                  country.
                </Box>
              </Box>
              <Box m="0px" textAlign="start">
                <Box as="p" m="0" fontSize="18px" color="#fff" py="10px">
                  Entire Agreement; Severability.
                </Box>
                <Box as="p" color="#C7C7C7" mb="10px">
                  You acknowledge that you have read and understood this User
                  Agreement and that you agree to be bound by its terms and
                  conditions. You further agree that this User Agreement,
                  together with the applicable Privacy Policy (contained
                  herein), which is hereby incorporated into this User Agreement
                  by reference, and the Account Opening Packet, constitute the
                  complete and exclusive statement of the agreement between you
                  and TFO and supersedes all other proposals or prior agreements
                  oral or written, and any other communications relating to the
                  subject matter of this User Agreement. If any provision of
                  this User Agreement is found unenforceable, it shall not
                  affect the validity of this User Agreement, which shall remain
                  valid and enforceable according to its terms.
                </Box>
              </Box>
              <Box m="0px" textAlign="start">
                <Box as="p" m="0" fontSize="18px" color="#fff" py="10px">
                  Electronic Signature
                </Box>
                <Box as="p" color="#C7C7C7" mb="10px">
                  You acknowledge that in certain circumstances you may use the
                  Application to execute and agree to certain transactions. Any
                  form or transaction executed by means of an
                  electronically-produced signature through the Application,
                  shall have the same legal effect as if such signature had been
                  manually written. TFO is hereby authorized to rely upon and
                  accept as an original any document or transaction which is
                  sent by electronic transmission through the Application. You
                  agree that when you click on a “Submit” or “I agree” or other
                  similar worded button or entry field with your device, your
                  agreement or consent will be legally binding and enforceable
                  and the legal equivalent of your handwritten signature.
                </Box>
              </Box>
              <Box m="0px" textAlign="start">
                <Box as="p" m="0" fontSize="18px" color="#fff" py="10px">
                  No Investment Advice
                </Box>
                <Box as="p" color="#C7C7C7" mb="10px">
                  The information provided in the Application is for information
                  purposes only. No information or materials provided in the
                  Application should be construed as investment, financial,
                  legal, tax or other advice. Nothing contained in the
                  Application constitutes a solicitation, recommendation,
                  endorsement or offer by TFO or an affiliate to buy or sell any
                  securities or other financial instruments in any jurisdiction
                  in which such solicitation or offer would be unlawful.
                </Box>
              </Box>
              <Box m="0px" textAlign="start">
                <Box as="p" m="0" fontSize="18px" color="#fff" py="10px">
                  Confidentiality
                </Box>
                <Box as="p" color="#C7C7C7" mb="10px">
                  You acknowledge that any information or materials provided in
                  the Application is confidential (“Confidential Information”).
                  You agree to keep the Confidential Information confidential
                  and to protect the confidentiality of such Confidential
                  Information with the same degree of care with which it
                  protects the confidentiality of its own confidential
                  information, but in no event with less than a reasonable
                  degree of care. You may disclose Confidential Information only
                  to your employees, agents and consultants on a need-to-know
                  basis, and only if such employees, agents, consultants have
                  agreed to the same confidentiality obligations.
                </Box>
              </Box>
              <Box m="0px" textAlign="start">
                <Box as="p" m="0" fontSize="18px" color="#fff" py="10px">
                  Digital Client Application Privacy Policy
                </Box>
                <Box as="p" color="#C7C7C7" mb="10px">
                  <Text color="#C7C7C7" mb="10px" mt="15px">
                    The Family Office Co. BSC(c) and certain of its affiliates
                    (“TFO”, “we” or “us”), acting as a data controller, have
                    prepared this privacy policy to explain how we use any
                    personal information we collect about you when you use this
                    Application, and the choices you have concerning how the
                    data is being collected and used.
                  </Text>
                  <Text color="#C7C7C7" mb="10px" mt="15px">
                    This Application is not intended for children and minors and
                    we do not knowingly solicit or collect Personal Data from
                    children and minors. As a parent or legal guardian, please
                    do not allow your children to submit Personal Data without
                    your permission.
                  </Text>
                  <Text color="#C7C7C7" mb="10px" mt="15px">
                    By submitting your personal data to us, you agree to the
                    processing set out in this Privacy Policy. Further notices
                    highlighting certain uses we wish to make of your personal
                    data together with the ability to opt in or out of selected
                    uses may also be provided to you when we collect personal
                    data from you.
                  </Text>
                  <Text color="#C7C7C7" mb="10px" mt="15px">
                    This Privacy Policy contains general and technical details
                    about the steps we take to respect your privacy concerns. We
                    have organised the Privacy Policy by major processes and
                    areas so that you can review the information of most
                    interest to you.
                  </Text>
                </Box>
              </Box>
              <Box mt="20px" textAlign="start">
                <Flex mb="30px">
                  <Box>1.</Box>{" "}
                  <Box pl="12px">
                    <Text fontSize="18px" fontWeight="700" color="#fff">
                      Personal Data we collect
                    </Text>
                    <Text color="#C7C7C7" mb="10px" mt="15px">
                      The term “Personal Data” refers to any information that
                      can be used to identify you, or that can be linked to you,
                      as an individual.
                    </Text>
                  </Box>
                </Flex>
                <Flex mb="30px">
                  <Box>1.1</Box>{" "}
                  <Box pl="12px">
                    <Text fontFamily="Gotham" fontSize="18px" color="#C7C7C7">
                      We may collect and process the following Personal Data
                      about you.
                    </Text>
                    <Text color="#C7C7C7" mb="10px" mt="15px">
                      (a) Personal information about you ► personal information
                      that you provide to us when you apply to open an account
                      (e.g. personal/identification information, name, date of
                      birth, nationality residential address, gender, country of
                      residence, accredited investor status, tax residential
                      status, tax identification numbers, income and wealth
                      information, annual income, net worth, source of funds and
                      wealth, employment activity, investment risk appetite,
                      passport, national ID (or equivalent documents), bank
                      details, IBAN details, and proof of address, etc), as well
                      as any additional information provided by or through TFO,
                      or submitted through a question, such as your e-mail
                      address, or submitted through the uploading of personal
                      documents in order to comply with KYC checks requirements
                      in the jurisdictions where we operate;
                    </Text>
                    <Text color="#C7C7C7" mb="10px" mt="15px">
                      (b) Our correspondence ► if you contact us such as when
                      you make a general inquiry or request technical support,
                      we may keep a record of that correspondence;
                    </Text>
                    <Text color="#C7C7C7" mb="10px" mt="15px">
                      (c) Survey information ► we may also ask you to complete
                      surveys that we use for research purposes. In such
                      circumstances we shall collect the information provided in
                      the completed survey; and
                    </Text>
                    <Text color="#C7C7C7" mb="10px" mt="15px">
                      (d) Your use of our Application ► details of your visits
                      to our Application and information collected through
                      cookies and other tracking technologies including, but not
                      limited to, your IP address and domain name, your browser
                      version and operating system, traffic data, location data,
                      web logs and other communication data, and the resources
                      that you access.
                    </Text>
                    <Text color="#C7C7C7" mb="10px" mt="15px">
                      (e) Do-not-track ► Because there is not yet a consensus on
                      how companies should respond to web browser-based
                      “do-not-track” (“DNT”) mechanisms, we do not respond to
                      web browser-based DNT signals at this time. Please note
                      that not all tracking will stop even if you delete
                      cookies.
                    </Text>
                  </Box>
                </Flex>{" "}
                <Flex mb="30px">
                  <Box>1.2</Box>{" "}
                  <Box pl="12px">
                    <Text fontFamily="Gotham" fontSize="18px" color="#C7C7C7">
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
                  <Box>1.3</Box>{" "}
                  <Box pl="12px">
                    <Text fontFamily="Gotham" fontSize="18px" color="#C7C7C7">
                      If you provide us with Personal Data about other
                      individuals, you must inform such individuals that you
                      have provided us with their details and let them know
                      where they can find a copy of this Privacy Policy.
                    </Text>
                  </Box>
                </Flex>
                <Flex mb="30px">
                  <Box>1.4</Box>{" "}
                  <Box pl="12px">
                    <Text fontFamily="Gotham" fontSize="18px" color="#C7C7C7">
                      If you choose not to provide certain Personal Data, this
                      may mean that we are not able to provide you with all of
                      our services.
                    </Text>
                  </Box>
                </Flex>
                <Flex mb="30px">
                  <Box>2.</Box>{" "}
                  <Box pl="12px">
                    <Text fontSize="18px" fontWeight="700" color="#fff">
                      How we use Personal Data
                    </Text>
                  </Box>
                </Flex>
                <Flex mb="30px">
                  <Box>2.1</Box>{" "}
                  <Box pl="12px">
                    <Text fontFamily="Gotham" fontSize="18px" color="#C7C7C7">
                      We may use your Personal Data in the following ways.
                      <Text>
                        Please note that use of Personal Data under applicable
                        data protection laws must be justified under one of a
                        number of legal “grounds” and we are required to set out
                        the grounds in respect of each use in this Privacy
                        Policy.
                      </Text>
                    </Text>
                    <Text color="#C7C7C7" mb="10px" mt="15px">
                      (a) To process your application to become a user ► to
                      evaluate and process your application to open an account.
                      If you are approved, you can set up, review or update your
                      account information once your account has been opened
                      (including your Personal Data) online at any time.
                      <Text mb="10px" mt="15px">
                        Use justification: consent, contract performance,
                        legitimate interests (to allow us to evaluate your
                        eligibility as a user)
                      </Text>
                    </Text>
                    <Text color="#C7C7C7" mb="10px" mt="15px">
                      (b) To provide marketing materials to you ► to provide you
                      with updates and offers, where you have chosen to receive
                      these. We typically use third party e-mail service
                      providers to send e-mails. These service providers are
                      contractually prohibited from using your e-mail address
                      for any purpose other than to send e-mails related to
                      TFO’s operations. We provide you the ability to
                      unsubscribe from all marketing communications, without any
                      costs. Every time you receive an e-mail, you will be
                      provided with the choice to opt-out of future e-mails by
                      following the instructions provided in the e-mail. You may
                      also opt-out of receiving promotional materials by
                      contacting us.
                      <Text mb="10px" mt="15px">
                        Use justification: consent (which can be withdrawn at
                        any time);
                      </Text>
                    </Text>
                    <Text color="#C7C7C7" mb="10px" mt="15px">
                      (c) For analytics and profiling ► to tailor our marketing
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
                      <Text mb="10px" mt="15px">
                        Use justification: consent (which can be withdrawn at
                        any time); legitimate interests (to enable us to tailor
                        our marketing to you);
                      </Text>
                    </Text>
                    <Text color="#C7C7C7" mb="10px" mt="15px">
                      (d) To comply with our legal and regulatory obligations ►
                      to comply with our legal and regulatory obligations such
                      as financial reporting requirements imposed by our
                      auditors and government authorities, and to cooperate with
                      law enforcement agencies, government authorities,
                      regulators and/or the court in connection with proceedings
                      or investigations anywhere in the world where we are
                      compelled to do so (e.g. to comply with anti-money
                      laundering, KYC obligations).
                      <Text mb="10px" mt="15px">
                        Use justification: legal obligation, legal claims,
                        legitimate interests (to cooperate with law enforcement
                        and regulatory authorities);
                      </Text>
                    </Text>
                    <Text color="#C7C7C7" mb="10px" mt="15px">
                      (e) To handle incidents and process any claims we receive
                      ► to handle any accidents and incidents such as liaising
                      with emergency services, and to handle any claims made by
                      customers;
                      <Text mb="10px" mt="15px">
                        Use justification: vital interest, legal claims,
                        legitimate interests (to ensure that incidents and
                        accidents are handle appropriately and to allow us to
                        assist our customers);
                      </Text>
                    </Text>
                    <Text color="#C7C7C7" mb="10px" mt="15px">
                      (f) To improve our services and products ► to assist in
                      developing new services and products and to improve our
                      existing services and products.
                      <Text mb="10px" mt="15px">
                        Use justification: legitimate interests (to allow us to
                        continuously improve and develop our services);
                      </Text>
                    </Text>
                    <Text color="#C7C7C7" mb="10px" mt="15px">
                      (g) To help our Application function correctly and to
                      provide account maintenance activities (if your
                      application is approved) ► to help content from our
                      Application get presented in the most effective manner for
                      you and for your device, and if your application is
                      approved, to upkeep and maintain your user account.
                      <Text mb="10px" mt="15px">
                        Use justification: contract performance, legitimate
                        interests (to allow us to provide you with the content
                        and services on this Application);
                      </Text>
                    </Text>
                    <Text color="#C7C7C7" mb="10px" mt="15px">
                      (h) In connection with any reorganization of our business
                      ► To analyse, or enable the analysis of, any proposed
                      sale, merger, asset acquisition, or reorganization of our
                      business.
                      <Text mb="10px" mt="15px">
                        Use justification: contract performance, legitimate
                        interests (to allow us to continue providing services to
                        you);
                      </Text>
                    </Text>
                    <Text color="#C7C7C7" mb="10px" mt="15px">
                      (i) To process a commitment, subscription, redemption or
                      withdrawal ► to evaluate and process your commitment,
                      subscription, redemption or withdrawal.
                      <Text mb="10px" mt="15px">
                        Use justification: consent, contract performance,
                        legitimate interests (to allow us to continue providing
                        services to you);
                      </Text>
                      <Text mb="10px" mt="15px">
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
                  <Box>3.</Box>{" "}
                  <Box pl="12px">
                    <Text fontSize="18px" fontWeight="700" color="#fff">
                      How we share Personal Data
                    </Text>
                  </Box>
                </Flex>
                <Flex mb="30px">
                  <Box>3.1</Box>{" "}
                  <Box pl="12px">
                    <Text fontFamily="Gotham" fontSize="18px" color="#C7C7C7">
                      We may share your Personal Data in the following ways
                      <Text>
                        Please note that use of Personal Data under applicable
                        data protection laws must be justified under one of a
                        number of legal “grounds” and we are required to set out
                        the grounds in respect of each use in this Privacy
                        Policy.
                      </Text>
                    </Text>
                    <Text color="#C7C7C7" mb="10px" mt="15px">
                      (a) Third party service providers who process Personal
                      Data on our behalf to help us undertake the activities
                      described in section 2 ► We may permit selected third
                      parties such as business partners, suppliers, service
                      providers, agents, contractors and other TFO affiliates to
                      use your Personal Data for the purposes set out in section
                      2, including mail houses and e-mail service providers that
                      we engage to send and disseminate promotional materials
                      for TFO products, data centre providers that host our
                      servers and third party agents that process mailing,
                      requests, and transactions on our behalf. These parties
                      are contractually prohibited from using Personal Data for
                      any purpose other than for the purpose specified in their
                      respective contracts, and will be subject to obligations
                      to process Personal Data in compliance with the same
                      safeguards that we deploy. We also provide non-personally
                      identifiable information to these parties for their use on
                      an aggregated basis for the purpose of performing their
                      contractual obligations to us. We do not permit the sale
                      of Personal Data to entities outside of TFO for any use
                      unrelated to our group operations or use of Personal Data
                      by third party for their own purposes.
                    </Text>
                    <Text color="#C7C7C7" mb="10px" mt="15px">
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
                    <Text color="#C7C7C7" mb="10px" mt="15px">
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
                  <Box>3.2</Box>{" "}
                  <Box pl="12px">
                    <Text fontFamily="Gotham" fontSize="18px" color="#C7C7C7">
                      This Privacy Policy does not apply to our processing of
                      personal information on behalf of, or at the direction of,
                      third party providers who may collect personal information
                      from you and provide it to us. In this situation, we would
                      merely act as a data processor and thus advise you to
                      review applicable third-party providers’ privacy policies
                      before submitting your personal information.
                    </Text>
                  </Box>
                </Flex>
              </Box>

              <Box m="0px" textAlign="start">
                <Box as="p" m="0" fontSize="18px" color="#fff" py="10px">
                  Use justifications and legal grounds
                </Box>
                <Box as="p" color="#C7C7C7" mb="10px" p="0 70px">
                  We note the grounds we use to justify each use of your
                  information next to the use in the How we use Personal Data
                  and How we share Personal Data sections of this policy. These
                  are the principal legal grounds that justify our use of your
                  Personal Data:
                </Box>
              </Box>
              <Box
                textAlign="start"
                w="80%"
                margin="30px auto"
                border="1px solid"
              >
                <Text border="1px solid" p="5px 10px">
                  <Text fontStyle="italic" fontWeight="700" as="span">
                    Consent:
                  </Text>{" "}
                  where you have consented to our use of your Personal Data
                </Text>
                <Text border="1px solid" p="5px 10px">
                  <Text fontStyle="italic" fontWeight="700" as="span">
                    Contract performance :
                  </Text>{" "}
                  where your Personal Data is necessary to enter into or perform
                  our contract with you.
                </Text>
                <Text border="1px solid" p="5px 10px">
                  <Text fontStyle="italic" fontWeight="700" as="span">
                    Legal and regulatory obligation:
                  </Text>{" "}
                  where we need to use your Personal Data to comply with our
                  legal and regulatory obligations.
                </Text>
                <Text border="1px solid" p="5px 10px">
                  <Text fontStyle="italic" fontWeight="700" as="span">
                    Legitimate interests:
                  </Text>{" "}
                  where we use your Personal Data to achieve a legitimate
                  interest and our reasons for using it outweigh any prejudice
                  to your data protection rights.
                </Text>
                <Text border="1px solid" p="5px 10px">
                  <Text fontStyle="italic" fontWeight="700" as="span">
                    Legal claims:
                  </Text>{" "}
                  where your information is necessary for us to defend,
                  prosecute or make a claim against you, us or a third party.
                </Text>
                <Text border="1px solid" p="5px 10px">
                  <Text fontStyle="italic" fontWeight="700" as="span">
                    Vital interest:
                  </Text>{" "}
                  where we need to process your Personal Data to protect the
                  vital interest of you or another natural person e.g. where you
                  require urgent assistance
                </Text>
              </Box>
              <Box mt="20px" textAlign="start">
                <Flex mb="30px">
                  <Box>4.</Box>{" "}
                  <Box pl="12px">
                    <Text fontSize="18px" fontWeight="700" color="#fff">
                      How we transmit, protect and store Personal Data Security
                      over the internet
                    </Text>
                    <Text color="#C7C7C7" mb="10px" mt="15px">
                      The term “Personal Data” refers to any information that
                      can be used to identify you, or that can be linked to you,
                      as an individual.
                    </Text>
                  </Box>
                </Flex>
                <Flex mb="30px">
                  <Box>4.1</Box>{" "}
                  <Box pl="12px">
                    <Text fontFamily="Gotham" fontSize="18px" color="#C7C7C7">
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
                  <Box>4.2</Box>{" "}
                  <Box pl="12px">
                    <Text fontFamily="Gotham" fontSize="18px" color="#C7C7C7">
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
                  <Box>4.3</Box>{" "}
                  <Box pl="12px">
                    <Text fontFamily="Gotham" fontSize="18px" color="#C7C7C7">
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
                <Text mb="10px" mt="15px" color="#ffffff" fontFamily="700">
                  Security controls
                </Text>
                <Flex mb="30px">
                  <Box>4.4</Box>{" "}
                  <Box pl="12px">
                    <Text fontFamily="Gotham" fontSize="18px" color="#C7C7C7">
                      Where we have given you (or where you have chosen) a
                      password, you are responsible for keeping this password
                      confidential and for complying with any other security
                      procedures that we notify you of. We ask you not to share
                      a password with anyone.
                    </Text>
                  </Box>
                </Flex>
                <Flex mb="30px">
                  <Box>4.5</Box>{" "}
                  <Box pl="12px">
                    <Text fontFamily="Gotham" fontSize="18px" color="#C7C7C7">
                      TFO trains its employees and staff on the importance of
                      data privacy and protection. Our Privacy Policy is updated
                      as required to reflect any changes in applicable laws and
                      developments in best practice procedures. Further, we
                      limit the number of individuals within the companies with
                      access to Personal Data to those directly involved in the
                      process of providing quality service to you.
                    </Text>
                  </Box>
                </Flex>
                <Flex mb="30px">
                  <Box>4.6</Box>{" "}
                  <Box pl="12px">
                    <Text fontFamily="Gotham" fontSize="18px" color="#C7C7C7">
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
                  </Box>
                </Flex>
                <Text mb="10px" mt="15px" color="#ffffff" fontFamily="700">
                  Data transmission across international borders
                </Text>
                <Flex mb="30px">
                  <Box>4.7</Box>{" "}
                  <Box pl="12px">
                    <Text fontFamily="Gotham" fontSize="18px" color="#C7C7C7">
                      The nature of our business and our operations require us
                      to transfer your Personal Data to other authorized
                      distributors, centres of operations, data centres, or
                      service providers that may be located in countries outside
                      of your own for the purposes mentioned in this Privacy
                      Policy. Although the data protection and other laws of
                      these various countries may not be as comprehensive as
                      those in your own country, TFO will take appropriate
                      measures, including implementing up to date contractual
                      clauses, to secure the transfer of your Data to recipients
                      (which may be internal or external to TFO) located in a
                      country with a level of protection different from the one
                      existing in the country in which your Data is collected.
                    </Text>
                  </Box>
                </Flex>
                <Flex mb="30px">
                  <Box>4.8</Box>{" "}
                  <Box pl="12px">
                    <Text fontFamily="Gotham" fontSize="18px" color="#C7C7C7">
                      Where your Personal Data may be transferred to a country
                      in which data protection laws may be of a lower standard
                      than in the transferor country, TFO will impose the same
                      data protection safeguards that we deploy in the countries
                      in which we operate to ensure an adequate level of
                      protection for this data.
                    </Text>
                  </Box>
                </Flex>
                <Flex mb="30px">
                  <Box>4.9</Box>{" "}
                  <Box pl="12px">
                    <Text fontFamily="Gotham" fontSize="18px" color="#C7C7C7">
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
                  </Box>
                </Flex>
                <Text mb="10px" mt="15px" color="#ffffff" fontFamily="700">
                  Retention
                </Text>
                <Flex mb="30px">
                  <Box>4.10</Box>{" "}
                  <Box pl="12px">
                    <Text fontFamily="Gotham" fontSize="18px" color="#C7C7C7">
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
                  <Box>4.11</Box>{" "}
                  <Box pl="12px">
                    <Text fontFamily="Gotham" fontSize="18px" color="#C7C7C7">
                      We may collect and process the following Personal Data
                      about you.
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
                  </Box>
                </Flex>
                <Flex mb="30px">
                  <Box>5.</Box>{" "}
                  <Box pl="12px">
                    <Text fontSize="18px" fontWeight="700" color="#fff">
                      Your rights Opt-out of marketing
                    </Text>
                  </Box>
                </Flex>
                <Flex mb="30px">
                  <Box>5.1</Box>{" "}
                  <Box pl="12px">
                    <Text fontFamily="Gotham" fontSize="18px" color="#C7C7C7">
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
                  <Box>5.2</Box>{" "}
                  <Box pl="12px">
                    <Text fontFamily="Gotham" fontSize="18px" color="#C7C7C7">
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
                      processing so that we stop that particular processing;
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
                      (g) Portability: where technically feasible, you have the
                      right to ask us to transmit the Personal Data that you
                      have provided to us to a third party in a structured,
                      commonly use and machine readable form.
                    </Text>
                    <Text color="#C7C7C7" mb="10px" mt="15px">
                      (h) Restriction: you can restrict how we use your Personal
                      data, for example whilst we are verifying the accuracy of
                      your Personal Data or where we are verifying the grounds
                      that use as the basis of holding your Personal Data;
                    </Text>
                  </Box>
                </Flex>
                <Text mb="10px" mt="15px" color="#ffffff" fontFamily="700">
                  Updating or modifying information
                </Text>
                <Flex mb="30px">
                  <Box>5.3</Box>{" "}
                  <Box pl="12px">
                    <Text fontFamily="Gotham" fontSize="18px" color="#C7C7C7">
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
                    <Text fontFamily="Gotham" fontSize="18px" color="#C7C7C7">
                      In the unlikely event of a data breach, we are prepared to
                      follow any laws and regulations which would require us to
                      notify you of the disclosure of private information.
                    </Text>
                  </Box>
                </Flex>
                <Flex mb="30px">
                  <Box>6.</Box>{" "}
                  <Box pl="12px">
                    <Text fontSize="18px" fontWeight="700" color="#fff">
                      Cookies
                    </Text>
                    <Text color="#C7C7C7" mb="10px" mt="15px">
                      Our Website uses cookies to collect and store certain
                      information about you, and to distinguish you from other
                      users of this Website. This helps us provide you with a
                      good experience when you browse our Website and also
                      allows us to improve our Website. A cookie is a small text
                      file which is sent by a Website, accepted by a web browser
                      and then placed on your hard drive. The information
                      collected from cookies lets us know that you visited our
                      Website in the past, and helps you avoid having to
                      re-enter information on each visit in order to use some of
                      our products or services, among other things. We use a
                      variety of cookies in this Website:
                    </Text>
                    <Text color="#C7C7C7" mb="10px" mt="15px">
                      Strictly Necessary ► These cookies are necessary for the
                      Website to function and cannot be switched off in our
                      systems. They are usually only set in response to actions
                      made by you which amount to a request for services, such
                      as setting your privacy preferences, logging in or filling
                      in forms. You can set your browser to block or alert you
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
                      Functional Cookies ► These cookies enable the Website to
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
                    <Text fontSize="18px" fontWeight="700" color="#fff">
                      Changes to the Privacy Policy
                    </Text>
                    <Text color="#C7C7C7" mb="10px" mt="15px">
                      In the future, we may need to make additional changes. All
                      additional changes will be included in the latest Privacy
                      Policy published on this Application, so that you will
                      always understand our current practices with respect to
                      the information we gather, how we might use that
                      information and disclosures of that information to third
                      parties. You can tell when this Privacy Policy was last
                      updated by looking at the date at the bottom of the
                      Privacy Policy. TFO reserves the right, in its sole
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
                    <Text fontSize="18px" fontWeight="700" color="#fff">
                      Other Sites
                    </Text>
                    <Text color="#C7C7C7" mb="10px" mt="15px">
                      This Application may contain links to other third-party
                      websites. If you follow a link to any of those third party
                      websites, please note that they have their own privacy
                      policies and that we do not accept any responsibility or
                      liability for their policies or processing of your
                      personal information. Please check these policies before
                      you submit any personal information to such third party
                      websites.
                    </Text>
                  </Box>
                </Flex>
                <Flex mb="30px">
                  <Box>8.</Box>{" "}
                  <Box pl="12px">
                    <Text fontSize="18px" fontWeight="700" color="#fff">
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
                width="100%"
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
                  <Text color="primary.500">onboarding@tfoco.com</Text>
                </Box>
              </Box>
            </ModalBody>
          ) : (
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
                  fontSize={{ base: "18px", md: "20px" }}
                  color="#fff"
                  pt="10px"
                  fontWeight="600"
                  style={{ direction: "rtl" }}
                >
                  سياسة شركة
                  <span style={{ direction: "rtl" }}>
                    {" "}
                    The Family Office Co. BSC (C)&#x200E;{" "}
                  </span>
                  للخصوصية
                </Box>
              </Box>
              <Box m="0px" textAlign="start">
                <Box
                  as="p"
                  m="0"
                  fontSize={{ base: "16px", md: "18px" }}
                  color="#fff"
                  py="10px"
                >
                  اتفاقية المستخدم
                </Box>
                <Box as="p" color="#FFFFFF" mb="10px">
                  اتفاقية. يُرجى قراءة المعلومات التالية قراءة دقيقة قبل استخدام
                  هذا التطبيق. بالنقر فوق زر "أوافق" أدناه، توافق على الالتزام
                  بجميع الشروط والأحكام الواردة في اتفاقية المستخدم هذه. إذا كنت
                  لا توافق على أي قسم من أقسام اتفاقية المستخدم، فلا تستخدم هذا
                  التطبيق. تحتفظ شركة The Family Office (المعرَّفة أدناه)، حسب
                  تقديرها وحدها، بحق تعديل أو تغيير أو تحديث هذه الاتفاقية في أي
                  وقت تراه، وبالنقر فوق زر "أوافق" الخاص بالمراجعات، تقبل عمليات
                  التعديل. وإذا اقتضى الأمر، فقد نقدم أيضًا آليات إضافية لإبداء
                  الموافقة على التغييرات التي قد تطرأ على هذه الاتفاقية. ولن
                  تصبح أي تغييرات سارية المفعول إلا بعد تاريخ نفاذ التغيير ولن
                  يؤثر ذلك على أي نزاع ينشأ قبل تاريخ نفاذ التغيير.
                </Box>
                <Box as="p" color="#C7C7C7" mb="10px">
                  التطبيق الإلكتروني لشركة
                  <span style={{ direction: "rtl" }}>
                    {" "}
                    The Family Office Co. BSC (C)&#x200E;{" "}
                  </span>
                  عبر الإنترنت ("التطبيق") هو منصة رقمية عبر الإنترنت يمكنك
                  التقدم من خلالها لفتح حساب لدى تزويدنا بمعلومات محددة وكذلك
                  الاطلاع على معلومات محددة عن
                  <span style={{ direction: "rtl" }}>
                    {" "}
                    The Family Office Co. BSC (C)&#x200E;{" "}
                  </span>
                  وبعض الشركات التابعة لها، وهي متاحة طالما التزمت بالشروط
                  والأحكام الموضحة أدناه. لا يوجد في اتفاقية المستخدم هذه أو في
                  التطبيق الإلكتروني ما يمكن اعتباره أي ضمانات أو التزامات أخرى
                  من طرف شركة The Family Office.
                </Box>
                <Box as="p" color="#C7C7C7" mb="10px">
                  هذا التطبيق موجه فقط لعملاء شركة The Family Office (الشركة)
                  الحاليين والمستقبليين. وتختص اتفاقية المستخدم هذه بالتطبيق
                  الإلكتروني فقط، وهي تخضع لآليات تسوية النزاعات المنصوص عليها
                  في حزمة فتح الحساب. إذا تبين وجود أي تعارض، فشروط اتفاقية
                  المستخدم هذه تعتبر العنصر الغالب على حزمة فتح الحساب فيما
                  يتعلق بالتطبيق الإلكتروني فقط، وبخلاف ذلك، تكون شروط حزمة فتح
                  الحساب العنصر الغالب فيما يتعلق بعلاقتك مع الشركة.
                </Box>
                <Box as="p" color="#C7C7C7" mb="10px">
                  هذا التطبيق غير مخصص للاستخدام من قبل أفراد تقل أعمارهم عن
                  ثمانية عشر عامًا (18). ويجب ألا يقل عمر مستخدمي هذا التطبيق عن
                  18 عامًا، أو أن يكونوا قد بلغوا السن القانونية التي تؤهلهم
                  للدخول في اتفاقيات تقع ضمن اختصاص المستخدم، أيهما أكبر.
                </Box>
                <Box as="p" color="#C7C7C7" mb="10px">
                  هذا التطبيق مخصص لاستخدام الأفراد المقيمين ضمن اختصاصات قضائية
                  مسموح بها.
                </Box>
              </Box>
              <Box m="0px" textAlign="start">
                {/* <Box
                      as="p"
                      m="0"
                   
                      fontSize="18px"
                      color="#fff"
                      py="10px"
                    >
                      Disclaimer of Warranties; Limitation of Liability.
                    </Box> */}
                <Box as="p" color="#C7C7C7" mb="10px">
                  إخلاء المسؤولية عن الضمان وتقييد المسؤولية. يتم تقديم هذا
                  التطبيق والمعلومات الواردة فيه "كما هي" دون أي ضمان من أي نوع،
                  صريحًا كان أم ضمنيًا، بما في ذلك، على سبيل المثال لا الحصر،
                  الضمانات المضمنة المتعلقة بالقابلية للتسويق أو الملاءمة لغرض
                  معين أو عدم الانتهاك. لا تضمن الشركة عدم انقطاع هذا التطبيق
                  الإلكتروني أو خلوه من الأخطاء، أو أن هذه الأخطاء سيتم تصحيحها،
                  أو أن التطبيق الذي يوفر الحساب والمعلومات الأخرى خال من
                  الفيروسات أو أي برامج أخرى ضارة. وهذه الضمانات مستثناة إلى
                  أقصى حد يسمح به القانون. ولا تتحمل الشركة بأي حال من الأحوال
                  المسؤولية عن أي أضرار مباشرة أو غير مباشرة أو خاصة أو عَرَضية
                  أو مترتبة قد تنشأ عن استخدامك أو عدم قدرتك على استخدام هذا
                  التطبيق أو المعلومات التي يوفرها. لا تسمح بعض الاختصاصات
                  القضائية باستثناء أو تحديد المسؤولية عن الأضرار المترتبة أو
                  العرَضية. وفي مثل هذه الاختصاصات القضائية، تكون مسؤولية الشركة
                  محدودة إلى أقصى حد يسمح به القانون. وإذا تبين وجود أي تعارض أو
                  تناقض بين المعلومات المقدمة عبر التطبيق الإلكتروني والمعلومات
                  المقدمة لك مباشرة من أو بالنيابة عن الشركة عبر وسائل الاتصال
                  المعتادة، تصبح المعلومات المقدمة عبر وسائل الاتصال المعتادة
                  العنصر الغالب.
                </Box>
                <Box as="p" color="#C7C7C7" mb="10px">
                  بالدخول إلى التطبيق واستخدامه، تدرك أنك قد تتنازل عن حقوق
                  متعلقة بمطالبات غير معروفة أو متوقعة في هذا الوقت، ووفقا لهذا
                  التنازل، تقر بأنك قد اطلعت وفهمت، وأنك تتنازل بموجب هذا بصراحة
                  عن الفوائد التي قد يوفرها أي قانون في أي اختصاص قضائي ينص
                  عموما على ما يلي: "لا يمتد الإعفاء العام إلى المطالبات التي لا
                  يعرفها الدائن أو يعتقد في أنها موجودة لصالحه في وقت تنفيذ
                  الإعفاء، والتي كان يمكن في حال معرفته بها أن تؤثر بشكل جوهري
                  على تسويته مع المدين".
                </Box>
                <Box as="p" color="#C7C7C7" mb="10px">
                  لا تعني القيود وإخلاء المسؤولية الواردة في هذا القسم تحديدا
                  للمسؤولية أو تغييرًا في حقوقك التي لا يمكن استبعادها بموجب أي
                  قانون معمول به.
                </Box>
              </Box>
              <Box m="0px" textAlign="start">
                <Box as="p" m="0" fontSize="18px" color="#fff" py="10px">
                  القوة القاهرة.
                </Box>
                <Box as="p" color="#C7C7C7" mb="10px">
                  لا يتحمل أي طرف المسؤولية عن أي تأخير أو إخفاق في تنفيذ
                  التزاماته الواردة في هذه الاتفاقية، ينتج عن وقوع كارثة طبيعية
                  أو تفشي أوبئة أو حدوث إصابات أو قضاء وقدر أو أعمال شخص خارج عن
                  القانون أو انقطاع التيار الكهربائي أو نشوب أعمال شغب أو تعطل
                  النظام أو الإرهاب أو الهجمات الإلكترونية أو الأعمال الحكومية
                  أو أي أحداث أخرى ذات طبيعة مماثلة خارجة عن سيطرة الطرف الذي
                  يرغب في اللجوء لهذا القسم لتسويغ تأخيره أو إخفاقه.
                </Box>
              </Box>
              <Box m="0px" textAlign="start">
                <Box as="p" m="0" fontSize="18px" color="#fff" py="10px">
                  موادنا المحمية بحقوق الطبع والنشر ودعاوى الانتهاك.
                </Box>
                <Box as="p" color="#C7C7C7" mb="10px">
                  حقوق النشر لجميع النصوص والصور والشاشات والمواد الأخرى
                  المتوفرة على هذا التطبيق (يشار إليها مجتمعة باسم "المواد")
                  مملوكة أو معتمدة من قبل الشركة و/ أو أطراف ثالثة. باستثناء ما
                  هو منصوص عليه أدناه، لا يجوز نسخ أي من المواد أو توزيعها أو
                  عرضها أو تنزيلها أو نقلها بأي شكل أو بأي وسيلة دون إذن كتابي
                  مسبق من الشركة، أو مالك حقوق النشر. وقد ينتهك الاستخدام غير
                  المصرح به لأي من المواد التي يتضمنها هذا التطبيق قوانين حقوق
                  النشر وقوانين العلامات التجارية وقوانين الخصوصية والدعاية و/
                  أو اللوائح والقوانين الأخرى.
                </Box>
              </Box>
              <Box m="0px" textAlign="start">
                <Box as="p" m="0" fontSize="18px" color="#fff" py="10px">
                  العلامات التجارية. تملك
                </Box>
                <Box as="p" color="#C7C7C7" mb="10px">
                  الشركة أو أصحابها العلامات التجارية وعلامات الخدمة التي قد
                  يشار إليها عبر هذا التطبيق. ولا ينبغي تفسير أي شيء في هذا
                  التطبيق على أنه يمنح، ضمنيًا، أو عبر إغلاق باب الرجوع، أو بغير
                  ذلك، أي ترخيص أو حق لاستخدام أي علامة تجارية دون إذن كتابي من
                  الشركة. ولا يجوز استخدام اسم الشركة أو شعارها بأي شكل من
                  الأشكال، بما في ذلك الإعلان أو الدعاية المتعلقة بتوزيع المواد
                  عبر هذا التطبيق، دون إذن كتابي مسبق. ولا يحق لك استخدام شعار
                  الشركة كارتباط تشعبي لهذا التطبيق ما لم تحصل على إذن كتابي
                  سلفًا منها، حتى لو سمحت الشركة لك باستخدام بعض الميزات المحددة
                  التي يوفرها التطبيق كارتباط تشعبي لأغراض محددة.
                </Box>
              </Box>
              <Box m="0px" textAlign="start">
                <Box as="p" m="0" fontSize="18px" color="#fff" py="10px">
                  الحق في الاحتفاظ بالمعلومات والإفصاح عنها
                </Box>
                <Box as="p" color="#C7C7C7" mb="10px">
                  يجوز للشركة الاحتفاظ بجميع المعلومات التي تقدمها، بما يتفق مع
                  سياسة الخصوصية التي تطبقها. ويجوز أيضًا للشركة الإفصاح عن
                  المعلومات التي تقدمها إذا طُلب منها ذلك بموجب قانون أو
                  اعتقادًا بحسن نية أن هذا الاحتفاظ أو الإفصاح ضروري بدرجة
                  معقولة لأجل: (أ) إتمام معاملتك (ب) أو الامتثال لإجراءات
                  قانونية (ج) أو تنفيذ اتفاقية المستخدم هذه (د) أو الرد على أي
                  دعاوى مفادها أن أي مواد موجودة على هذا التطبيق تنتهك حقوقك أو
                  حقوق أطراف ثالثة (هـ) أو حماية حقوق أو ممتلكات الشركة والسلامة
                  الشخصية لمستخدميها و/ أو الجمهور، أو (و) أو في حالة استحواذ
                  طرف ثالث على معظم أصول الشركة أو جميعها.
                </Box>
              </Box>
              <Box m="0px" textAlign="start">
                <Box as="p" m="0" fontSize="18px" color="#fff" py="10px">
                  الأعمال المحظورة.
                </Box>
                <Box as="p" color="#C7C7C7" mb="10px">
                  تتعهد بموجب هذه الاتفاقية بألا تقوم بأي مما يلي : (أ) تفكيك أو
                  إجراء هندسة عكسية أو إلغاء تجميع أو تعديل أو تحويل التطبيق إلى
                  شكل يمكن للإنسان استيعابه أو إنشاء أعمال مستخلصة استنادًا إلى
                  التطبيق الإلكتروني أو لأي قسم منه (ب) أو تعطيل أي ترخيص أو
                  ميزات تحكم في التطبيق (ج) أو "تأطير" التطبيق أو أي قسم منه أو
                  جعل التطبيق أو محتوياته تبدو وكأنها مقدمة من أي شخص آخر غير
                  الشركة (د) أو إدخال أي فيروس أو رمز أو عمل آخر إلى التطبيق
                  الإلكتروني بهدف تعطيل أو إتلاف التطبيق أو تغيير أو إتلاف أو
                  حذف أي مواد أو استرداد أو تسجيل معلومات حول التطبيق أو
                  مستخدميه (هـ) أو دمج التطبيق أو أي مواد مع برنامج آخر أو إنشاء
                  أعمال مستخلصة من التطبيق أو هذه المواد (و) أو إزالة أو حجب أو
                  تغيير أي إشعار بحقوق النشر أو غيرها من وسائل إيضاح الملكية على
                  التطبيق الإلكتروني أو المواد (ز) الترخيص من الباطن أو التنازل
                  عن أو الترجمة أو الإيجار أو الإعارة أو إعادة البيع من أجل
                  الربح أو التوزيع أو التنازل عن المواد أو نقلها أو الدخول إلى
                  التطبيق لحساب آخرين (ح) أو استخدام أو السماح باستخدام التطبيق
                  أو المواد بما يتعارض مع أي قانون اتحادي أو حكومي أو محلي أو
                  أجنبي أو أي قانون آخر معمول به، أو قواعد أو لوائح الهيئات
                  التنظيمية أو الإدارية (ت) أو التصرف بطريقة احتيالية أو غير
                  قانونية أو خبيثة أو بالإهمال عند استخدام التطبيق. باستثناء ما
                  هو منصوص عليه صراحةً هنا. تحتفظ الشركة والأطراف الخارجية بجميع
                  الحقوق فيما يتعلق بالتطبيق الإلكتروني، ويمكنها متابعة جميع
                  الخيارات المتاحة قانونًا بموجب القوانين المدنية والجنائية (وقد
                  تتعاون مع وكالات إنفاذ القانون) إذا حدثت أي انتهاكات.
                </Box>
              </Box>
              <Box m="0px" textAlign="start">
                <Box as="p" m="0" fontSize="18px" color="#fff" py="10px">
                  حظر الاستعانة ببرامج الأوامر النصية والروبوتات والأطراف
                  الخارجية.
                </Box>
                <Box as="p" color="#C7C7C7" mb="10px">
                  لا يجوز لك الوصول إلى التطبيق أو استخدامه عن طريق أي برنامج
                  آلي أو نظام خبير أو وكيل إلكتروني أو "روبوت"، ولا يجوز منح أي
                  شخص أو جهة إمكانية الوصول إلى التطبيق.
                </Box>
              </Box>
              <Box m="0px" textAlign="start">
                <Box as="p" m="0" fontSize="18px" color="#fff" py="10px">
                  حظر أعمال "القشط"
                </Box>
                <Box as="p" color="#C7C7C7" mb="10px">
                  يحظر عليك "قشط" أو نسخ أو إعادة نشر أو ترخيص أو بيع البيانات
                  أو المعلومات الواردة بالتطبيق.
                </Box>
              </Box>
              <Box m="0px" textAlign="start">
                <Box as="p" m="0" fontSize="18px" color="#fff" py="10px">
                  ملكية بيانات الاستخدام
                </Box>
                <Box as="p" color="#C7C7C7" mb="10px">
                  قد تقوم الشركة بجمع بيانات حول استخدامك للتطبيق ومراكمتها،
                  وستكون الشركة المالك الوحيد لهذه المعلومات.
                </Box>
              </Box>
              <Box m="0px" textAlign="start">
                <Box as="p" m="0" fontSize="18px" color="#fff" py="10px">
                  الروابط.
                </Box>
                <Box as="p" color="#C7C7C7" mb="10px">
                  مع أن الشركة تتحكم ببعض الارتباطات التشعبية في التطبيق، فقد
                  تؤدي بعض الروابط داخل هذا التطبيق إلى مواقع إلكترونية لجهات
                  أخرى أو موقع إلكتروني تابع لطرف ثالث. وتضع الشركة هذه الروابط
                  الخارجية فقط لمساعدتك. لا يعني وجود رابط تأييدا للموقع
                  الإلكتروني المرتبط به أو مشغله أو محتوياته، أو أن الشركة
                  مرتبطة بأي شكل من الأشكال بالتطبيق أو التطبيق المرتبط به ما لم
                  يُذكر ذلك صراحةً في كل حالة في التطبيق الإلكتروني الذي ترتبط
                  به هذه المواد. ولا يتضمن التطبيق أي مواد تظهر في مثل هذه
                  المواقع أو المواقع المرتبطة عبر الإحالة إليها، ما لم يُذكر
                  صراحةً في كل حالة في الموقع الذي يتم ربط هذه المواد به. وتحتفظ
                  الشركة بالحق في إنهاء الارتباط بأي موقع تابع لطرف ثالث في أي
                  وقت. ليس للشركة أي سيطرة على المواقع الإلكترونية التابعة لجهات
                  خارجية، وقد يكون لها شروط استخدام وسياسات خصوصية مغايرة وتدعوك
                  الشركة إلى مراجعتها.
                </Box>
              </Box>
              <Box m="0px" textAlign="start">
                <Box as="p" m="0" fontSize="18px" color="#fff" py="10px">
                  الاستثناءات والقيود وإشعار حماية المستهلك.
                </Box>
                <Box as="p" color="#C7C7C7" mb="10px">
                  إذا كنت مستهلكًا، فالأحكام الواردة في اتفاقية المستخدم هذه
                  تهدف أن تكون واسعة النطاق وشاملة بقدر ما تسمح به قوانين بلد
                  إقامتك فقط. وفي جميع الأحوال، تحتفظ الشركة بجميع الحقوق
                  والدفوع والقيود المسموح بها بموجب قانون بلد إقامتك.
                </Box>
              </Box>
              <Box m="0px" textAlign="start">
                <Box as="p" m="0" fontSize="18px" color="#fff" py="10px">
                  السيطرة على التطبيق. يخضع.
                </Box>
                <Box as="p" color="#C7C7C7" mb="10px">
                  يخضع هذا التطبيق لسيطرة الشركة وذلك بموجب الاختصاص القانوني
                  لحزمة فتح الحساب الخاص بك. لا تقدم الشركة أي تعهد بأن المحتوى
                  أو المواد الواردة في هذا التطبيق مناسبة أو متاحة للاستخدام في
                  اختصاصات قضائية أخرى. ويُحظر تمامًا الوصول إلى محتوى التطبيق
                  أو المواد من الاختصاصات القضائية التي يكون فيها هذا الوصول غير
                  قانوني. إذا اخترت الوصول إلى هذا التطبيق من اختصاصات قضائية
                  أخرى، تقوم بذلك على مسؤوليتك الخاصة. وتظل المسؤول دائمًا عن
                  امتثالك للقوانين المعمول بها.
                </Box>
              </Box>
              <Box m="0px" textAlign="start">
                <Box as="p" m="0" fontSize="18px" color="#fff" py="10px">
                  لقوانين واجبة التطبيق وحل النزاعات.
                </Box>
                <Box as="p" color="#C7C7C7" mb="10px">
                  تخضع اتفاقية المستخدم وأي استخدام لهذا التطبيق من قبل هذا
                  المستخدم ويتم تفسيرها حسب قوانين الاختصاص القضائي المنصوص عليه
                  في حزمة فتح الحساب وتُطبق أحكام تسوية النزاعات الخاصة بحزمة
                  فتح الحساب. وحتى يتم تنفيذ حزمة فتح الحساب، تخضع اتفاقية
                  المستخدم وأي استخدام لهذا التطبيق من قبل هذا المستخدم لقوانين
                  مملكة البحرين ويفسر وفقًا لها، بغض النظر عن تعارض مبادئ
                  القوانين الخاصة بها، ويوافق هذا المستخدم بشكل لا رجعة فيه على
                  أن أي إجراء قانوني ينشأ عن أو يتعلق باتفاقية المستخدم هذه أو
                  مثل هذا الاستخدام يجوز رفعه من قبل هذا المستخدم أو نيابة عنه
                  أمام محاكم البحرين فقط ويخضع بشكل لا رجعة فيه للاختصاص القضائي
                  لهذه المحاكم. ويقبل هذا المستخدم قبولا لا رجعة فيه أن للشركة
                  الحق في تحريك أي إجراء قانوني ضد هذا المستخدم و/ أو أصوله في
                  أي اختصاص قضائي آخر أو لخدمة الإجراءات بأي طريقة يسمح بها
                  القانون، ولا يمنع اتخاذ الإجراءات في أي اختصاص قضائي الشركة من
                  اتخاذ الإجراءات في أي اختصاص قضائي آخر سواء كان ذلك بشكل
                  متزامن أم لا.
                </Box>
              </Box>
              <Box m="0px" textAlign="start">
                <Box as="p" m="0" fontSize="18px" color="#fff" py="10px">
                  لا يحق للشركة ممارسة الأعمال في كل اختصاص قضائي.
                </Box>
                <Box as="p" color="#C7C7C7" mb="10px">
                  لا يحق للشركة مزاولة الأعمال بشكل عام أو تقديم خدمات معينة في
                  كل اختصاص قضائي. قد تحتوي المعلومات المنشورة على هذا التطبيق
                  على مصادر أو إشارات مرجعية إلى سلع أو خدمات غير متوفرة في
                  محافظتك أو بلدك.
                </Box>
              </Box>
              <Box m="0px" textAlign="start">
                <Box as="p" m="0" fontSize="18px" color="#fff" py="10px">
                  اتفاقية كاملة واستقلالية البنود.
                </Box>
                <Box as="p" color="#C7C7C7" mb="10px">
                  تقر بأنك قد قرأت وفهمت اتفاقية المستخدم وأنك موافق على
                  الالتزام ببنودها وأحكامها. وتوافق أيضًا على أن اتفاقية
                  المستخدم هذه، جنبًا إلى جنب مع سياسة الخصوصية المعمول بها
                  (الوارد هنا)، والمضمَّنة في هذه الاتفاقية بالإشارة وحزمة فتح
                  الحساب، تشكل المحتوى الكامل والحصري للاتفاقية بينك وبين الشركة
                  وتحل محل جميع المقترحات الأخرى أو الاتفاقيات السابقة الشفوية
                  أو المكتوبة وأي اتصالات أخرى تتعلق بموضوع اتفاقية المستخدم
                  هذه. إذا وجد أن أي بند من أحكام اتفاقية المستخدم غير قابل
                  للتنفيذ، لا يؤثر ذلك على سريان الاتفاقية التي تظل سارية وقابلة
                  للتنفيذ وفقًا لشروطها.
                </Box>
              </Box>
              <Box m="0px" textAlign="start">
                <Box as="p" m="0" fontSize="18px" color="#fff" py="10px">
                  التوقيع الإلكتروني.
                </Box>
                <Box as="p" color="#C7C7C7" mb="10px">
                  تقر أنك في ظروف معينة قد تستخدم التطبيق لتنفيذ معاملات محددة
                  والموافقة عليها. ويجب أن يكون لأي نموذج أو معاملة يتم تنفيذها
                  عن طريق التوقيع الإلكتروني عبر التطبيق نفس الأثر القانوني الذي
                  يترتب على التوقيع فيما لو كان مكتوبًا بخط اليد. ويحق للشركة
                  بموجب هذا الاعتماد على أي مستند أو معاملة يتم إرسالها عبر
                  وسيلة إلكترونية من خلال التطبيق وقبولها كأصل. توافق على أنك
                  عند النقر فوق زر "إرسال" أو "أوافق" أو أي زر أو حقل إدخال آخر
                  مشابه في جهازك، أن موافقتك أو قبولك ستكون ملزمة قانونًا وقابلة
                  للتنفيذ ومكافئة قانونيًا لتوقيعك المكتوب بخط اليد.
                </Box>
              </Box>
              <Box m="0px" textAlign="start">
                <Box as="p" m="0" fontSize="18px" color="#fff" py="10px">
                  ليست مشورة استثمارية.
                </Box>
                <Box as="p" color="#C7C7C7" mb="10px">
                  المعلومات الواردة في التطبيق هي للاطلاع فحسب. ولا ينبغي اعتبار
                  أي معلومات أو مواد واردة في التطبيق مشورة استثمارية أو مالية
                  أو قانونية أو ضريبية أو غير ذلك. لا شيء مما يرد في التطبيق
                  يمثل التماسًا أو توصية أو تأييدًا أو عرضًا من قبل شركة The
                  Family Office أو شركة تابعة لشراء أو بيع أي أوراق مالية أو
                  أدوات مالية أخرى في أي ولاية قضائية يكون فيها هذا الطلب أو
                  العرض غير قانوني.
                </Box>
              </Box>
              <Box m="0px" textAlign="start">
                <Box as="p" m="0" fontSize="18px" color="#fff" py="10px">
                  السرية.
                </Box>
                <Box as="p" color="#C7C7C7" mb="10px">
                  تقر بأن أي معلومات أو مواد واردة في التطبيق تعتبر سرية
                  ("معلومات سرية"). وتوافق على الحفاظ على سرية المعلومات السرية
                  وعلى حماية سرية مثل هذه المعلومات السرية بدرجة العناية نفسها
                  التي يحمي بها سرية معلوماته السرية، ولكن ليس بأي حال من
                  الأحوال بدرجة أقل من العناية المعقولة. لا يجوز لك الإفصاح عن
                  المعلومات السرية إلا لموظفيك ووكلائك ومستشاريك على أساس الحاجة
                  إلى الاطلاع، شريطة أن يوافق هؤلاء الموظفون والوكلاء
                  والمستشارون على نفس التزامات السرية.
                </Box>
              </Box>
              <Box m="0px">
                <Box
                  as="p"
                  m="0"
                  textAlign="left"
                  fontSize="18px"
                  color="#fff"
                  py="10px"
                >
                  سياسة الخصوصية للتطبيق الإلكتروني بشأن العميل الرقمي
                </Box>
                <Box as="p" color="#C7C7C7" mb="10px" textAlign="left">
                  <Text color="#C7C7C7" mb="10px" mt="15px">
                    أعدت شركة The Family Office وبعض الشركات التابعة لها، بصفتها
                    المتحكمة في البيانات، سياسة الخصوصية هذه لشرح كيفية
                    استخدامنا لأي معلومات شخصية نجمعها حولك عندما تستخدم هذا
                    التطبيق والخيارات التي لديك فيما يتعلق بكيفية جمع البيانات
                    واستخدامها.
                  </Text>
                  <Text color="#C7C7C7" mb="10px" mt="15px">
                    هذا التطبيق ليس موجهًا للأطفال والقاصرين ولا نطلب أو نجمع عن
                    قصد بيانات شخصية من الأطفال والقاصرين. بصفتك أحد الوالدين أو
                    الوصي القانوني، يرجى عدم السماح لأطفالك بإرسال بيانات شخصية
                    دون إذنك.
                  </Text>
                  <Text color="#C7C7C7" mb="10px" mt="15px">
                    بإرسالك بياناتك الشخصية لنا، توافق على المعالجة الموضحة في
                    سياسة الخصوصية هذه. وقد يتم أيضًا تقديم إشعارات أخرى تسلط
                    الضوء على استخدامات معينة نرغب في تطبيقها على بياناتك
                    الشخصية مع منحك القدرة على الاشتراك أو إلغاء الاشتراك في
                    استخدامات محددة حينما نجمع منك بيانات شخصية.
                  </Text>
                  <Text color="#C7C7C7" mb="10px" mt="15px">
                    تحتوي سياسة الخصوصية هذه على تفاصيل عامة وفنية حول الخطوات
                    التي نتخذها لاحترام مخاوف الخصوصية لديك. لقد قمنا بتنظيم
                    سياسة الخصوصية بحسب العمليات والمجالات الرئيسية بحيث يمكنك
                    مراجعة المعلومات التي تهمك.
                  </Text>
                </Box>
              </Box>
              <Box mt="20px" textAlign="start">
                <Flex mb="30px">
                  <Box>1.</Box>{" "}
                  <Box pl="12px">
                    <Text fontSize="18px" fontWeight="700" color="#fff">
                      البيانات الشخصية التي نجمعها
                    </Text>
                    <Text color="#C7C7C7" mb="10px" mt="15px">
                      يشير مصطلح "البيانات الشخصية" إلى أي معلومات يمكن
                      استخدامها لتحديد هويتك أو يمكن ربطها بك كفرد.
                    </Text>
                  </Box>
                </Flex>
                <Flex mb="30px">
                  <Box>1.1</Box>{" "}
                  <Box pl="12px">
                    <Text fontSize="18px" color="#C7C7C7">
                      قد نقوم بجمع البيانات الشخصية التالية عنك ومعالجتها.
                    </Text>
                    <Text color="#C7C7C7" mb="10px" mt="15px">
                      (أ) معلومات شخصية عنك : هي المعلومات الشخصية التي تقدمها
                      لنا عند طلبك فتح حساب لدينا (على سبيل المثال، المعلومات
                      الشخصية ومعلومات إثبات الهوية والاسم وتاريخ الميلاد وعنوان
                      الإقامة في بلد الجنسية والسكن والجنس وبلد الإقامة وحالة
                      المستثمر الائتمانية والضرائب والحالة السكنية وأرقام
                      التعريف الضريبية ومعلومات الدخل والثروة والدخل السنوي
                      وصافي الثروة ومصدر الأموال والثروة والنشاط الوظيفي ومدى
                      الرغبة في المخاطرة الاستثمارية وجواز السفر والهوية الوطنية
                      (أو المستندات المماثلة) والبيانات المصرفية ورقم الـIBAN
                      المصرفي وإثبات العنوان وما إلى ذلك)، إضافة إلى أي معلومات
                      إضافية مقدمة بواسطة أو من خلال الشركة، أو يتم إرسالها عبر
                      سؤال مثل عنوان بريدك الإلكتروني، أو إرسالها عبر تحميل
                      مستندات شخصية من للامتثال لمتطلبات عمليات التحقق من هوية
                      العملاء في الاختصاصات القضائية التي نعمل بها.
                    </Text>
                    <Text color="#C7C7C7" mb="10px" mt="15px">
                      (ب) مراسلاتنا : إذا اتصلت بنا على سبيل المثال لطرح استفسار
                      عام أو طلب دعم فني، فقد نحتفظ بسجل لتلك المراسلات
                    </Text>
                    <Text color="#C7C7C7" mb="10px" mt="15px">
                      (ج) معلومات الاستبيانات : قد نطلب منك أيضًا إكمال
                      استبيانات نستخدمها لأغراض بحثية. في مثل هذه الظروف، سنجمع
                      المعلومات المقدَّمة في الاستبيان المكتمل.
                    </Text>
                    <Text color="#C7C7C7" mb="10px" mt="15px">
                      (د) استخدامك لتطبيقنا : استخدامك لتطبيقنا: تفاصيل زياراتك
                      لتطبيقنا والمعلومات التي تم جمعها عبر ملفات تعريف الارتباط
                      "الكوكيز" وتقنيات التتبع الأخرى بما في ذلك، على سبيل
                      المثال لا الحصر، عنوان الـIP واسم النطاق وإصدار المتصفح
                      ونظام التشغيل وبيانات حركة المرور وبيانات المكان وسجلات
                      الإنترنت وبيانات الاتصال الأخرى والموارد التي يمكنك الوصول
                      إليها.
                    </Text>
                    <Text color="#C7C7C7" mb="10px" mt="15px">
                      (هـ)عدم التتبع : نظرًا لعدم وجود إجماع حتى الآن على كيفية
                      استجابة الشركات لآليات "عدم التتبع" المستندة إلى متصفح
                      الإنترنت، فإننا لا نستجيب إلى إشارات عدم التتبع المستندة
                      إلى متصفح الإنترنت في هذا الوقت. يُرجى ملاحظة أنه لن يتم
                      إيقاف جميع عمليات التتبع حتى لو حذفت ملفات تعريف الارتباط.
                    </Text>
                  </Box>
                </Flex>{" "}
                <Flex mb="30px">
                  <Box>1.2</Box>{" "}
                  <Box pl="12px">
                    <Text fontSize="18px" color="#C7C7C7">
                      صل على بياناتك الشخصية منك مباشرة. وقد نجمع أيضًا البيانات
                      الشخصية من أطراف ثالثة بما في ذلك الوكلاء الذين يقدمون
                      توجيهات بالنيابة عنك أو أي هيئات حكومية وشبه حكومية أخرى
                      قد تقدم بيانات شخصية نيابة عنك. بالإضافة إلى ذلك، قد نجمع
                      أيضًا البيانات الشخصية من موفري خدمات خارجيين ضمن عملية
                      التقديم الخاصة بك، مثل موفري خدمات التحقق من مقاطع الفيديو
                      التابعين وذلك ضمن عمليات البحث الخاصة بـ"اعرف عميلك".
                    </Text>
                  </Box>
                </Flex>
                <Flex mb="30px">
                  <Box>1.3</Box>{" "}
                  <Box pl="12px">
                    <Text fontSize="18px" color="#C7C7C7">
                      إذا زودتنا ببيانات شخصية عن أفراد آخرين، فيجب عليك إبلاغ
                      هؤلاء الأفراد بأنك قد زودتنا ببياناتهم وأين يمكنهم العثور
                      على نسخة من سياسة الخصوصية هذه.
                    </Text>
                  </Box>
                </Flex>
                <Flex mb="30px">
                  <Box>1.4</Box>{" "}
                  <Box pl="12px">
                    <Text fontSize="18px" color="#C7C7C7">
                      إذا اخترت ألا تقدم بيانات شخصية معينة، فقد يؤدي ذلك إلى
                      عدم قدرتنا على تزويدك بجميع خدماتنا.
                    </Text>
                  </Box>
                </Flex>
                <Flex mb="30px">
                  <Box>2.</Box>{" "}
                  <Box pl="12px">
                    <Text fontSize="18px" fontWeight="700" color="#fff">
                      كيف نستخدم البيانات الشخصية
                    </Text>
                  </Box>
                </Flex>
                <Flex mb="30px">
                  <Box>2.1</Box>{" "}
                  <Box pl="12px">
                    <Text fontSize="18px" color="#C7C7C7">
                      قد نستخدم بياناتك الشخصية على النحو التالي.
                      <Text>
                        يُرجى ملاحظة أن استخدام البيانات الشخصية بموجب قوانين
                        حماية البيانات المعمول بها يجب أن يكون مبررًا وفقًا لعدد
                        من "الأسباب" القانونية، ونحن مطالبون بتحديد الأسباب
                        المتعلقة بكل استخدام في سياسة الخصوصية هذه.
                      </Text>
                    </Text>
                    <Text color="#C7C7C7" mb="10px" mt="15px">
                      (أ)البت في طلبك الذي تقدمت به لتصبح مستخدمًا : تقييم طلبك
                      ومعالجته لفتح حساب. حينما يوافق على طلبك، سيمكنك إعداد
                      معلومات حسابك أو مراجعتها أو تحديثها بمجرد فتح حسابك (بما
                      في ذلك بياناتك الشخصية)
                      <Text mb="10px" mt="15px">
                        عبر الإنترنت في أي وقت. تبرير الاستخدام: الموافقة وتنفيذ
                        العقد والمصالح المشروعة (للسماح لنا بتقييم أهليتك
                        كمستخدم)
                      </Text>
                    </Text>
                    <Text color="#C7C7C7" mb="10px" mt="15px">
                      (ب)تزويدك بمواد تسويقية : لتزويدك بالتحديثات والعروض التي
                      اخترت تلقيها. عادةً ما نستعين بموفري خدمة بريد إلكتروني من
                      طرف ثالث لإرسال رسائل البريد الإلكتروني. ويُحظر تعاقديًا
                      (بموجب تعاقداتنا هذه) على موفري الخدمة هؤلاء استخدام عنوان
                      بريدك الإلكتروني لأي غرض آخر بخلاف إرسال رسائل بريد
                      إلكتروني ذات صلة بعمليات الشركة. ونتيح لك إمكانية إلغاء
                      الاشتراك في جميع الرسائل التسويقية دون أن تترتب على ذلك أي
                      تكلفة. وفي كل مرة تتلقى رسالة بريد إلكترونية، سيتم تزويدك
                      بخيار إلغاء الاشتراك في رسائل البريد الإلكتروني التالية
                      عبر اتباع الإرشادات الواردة في الرسالة. يمكنك أيضًا إلغاء
                      الاشتراك الخاص بتلقي المواد الترويجية عبر الاتصال بنا.
                      <Text mb="10px" mt="15px">
                        (ج)تبرير الاستخدام : الموافقة (التي يمكن سحبها في أي
                        وقت);
                      </Text>
                    </Text>
                    <Text color="#C7C7C7" mb="10px" mt="15px">
                      (د)للتحليلات والتصنيف : ضبط أنشطتنا التسويقية على نحو يلبي
                      متطلباتك. فيما يتعلق بأنشطتنا التسويقية، نحلل المعلومات
                      التي نجمعها عن العملاء لتحديد العروض التي يرجح أن تكون ذات
                      فائدة لفئات مختلفة من العملاء في ظروف مختلفة وفي أوقات
                      مختلفة. نسمي هذا إنشاء "شرائح". تتضمن هذه البيانات الشخصية
                      المعلومات السلوكية للعميل مثل سجل المعاملات والتفضيلات
                      وطلبات الخدمة والتفاعلات معنا. من حين لآخر، سنقيّم
                      البيانات الشخصية التي نحتفظ بها عنك لوضعك ضمن شريحة معينة.
                      قد نستخدم الشريحة الذي تم وضعك فيها لضبط رسائلنا التسويقية
                      بما يجعلها تشمل ما يهمك من عروض ومحتوى. قد نستخدم هذه
                      الطريقة أيضًا لتجنب إرسال عروض غير مناسبة أو لا يحتمل أن
                      تكون ذات فائدة لك، ويحق لك إلغاء الاشتراك في هذا التحليل
                      الذي تخضع له بياناتك الشخصية التي نستخدمها لتصميم الرسائل
                      التسويقية المباشرة التي نرسلها لك، في أي وقت.
                      <Text mb="10px" mt="15px">
                        تبرير الاستخدام : الموافقة (ويمكن التراجع عنها في أي
                        وقت) وتحقيق مصالح مشروعة (تتيح لنا ضبط رسائلنا التسويقية
                        على نحو يلائمك)
                      </Text>
                    </Text>
                    <Text color="#C7C7C7" mb="10px" mt="15px">
                      (هـ)الامتثال لالتزاماتنا القانونية والتنظيمي : للامتثال
                      لالتزاماتنا القانونية والتنظيمية مثل متطلبات إعداد
                      التقارير المالية التي يفرضها مدققونا والجهات الحكومية،
                      والتعاون مع هيئات إنفاذ القانون والجهات الحكومية
                      والتنظيمية و/ أو المحاكم فيما يتعلق بالإجراءات أو
                      التحقيقات في أي مكان في العالم حيثما يتعين علينا عمل ذلك
                      (مثل الامتثال لإجراءات مكافحة غسيل الأموال وتطبيق قواعد
                      "التعرف على هوية العميل").
                      <Text mb="10px" mt="15px">
                        تبرير الاستخدام: التزام قانوني ومطالبات قانونية ومصالح
                        مشروعة (للتعاون مع الهيئات المنوط بها إنفاذ القانون
                        والهيئات التنظيمية)
                      </Text>
                    </Text>
                    <Text color="#C7C7C7" mb="10px" mt="15px">
                      (و) التعامل مع الحوادث ومعالجة أي مطالبات نتلقاها :
                      للتعامل مع أي وقائع أو حوادث مثل الاتصال بخدمات الطوارئ
                      والتعامل مع أي مطالبات يقدمها العملاء
                      <Text mb="10px" mt="15px">
                        تبرير الاستخدام: تحقيق مصلحة حيوية وتلبية مطالبات
                        قانونية ومصالح مشروعة (تضمن لنا التعامل مع الحوادث
                        بالشكل المناسب وتتيح لنا مساعدة عملائنا)
                      </Text>
                    </Text>
                    <Text color="#C7C7C7" mb="10px" mt="15px">
                      (ز) تحسين خدماتنا ومنتجاتنا : للمساعدة في تطوير خدمات
                      ومنتجات جديدة وتحسين خدماتنا ومنتجاتنا الحالية.
                      <Text mb="10px" mt="15px">
                        تبرير الاستخدام:مصالح مشروعة (تتيح لنا تحسين خدماتنا
                        وتطويرها باستمرار)
                      </Text>
                    </Text>
                    <Text color="#C7C7C7" mb="10px" mt="15px">
                      (ح)مساعدة تطبيقنا على العمل بشكل صحيح وتقديم أنشطة صيانة
                      الحساب (إذا تمت الموافقة على طلبك) : للمساعدة في تقديم
                      المحتوى من تطبيقنا بأكثر الطرق فعالية لك ولجهازك، وإذا تمت
                      الموافقة على طلبك، فإذن ذلك لصيانة حساب المستخدم والحفاظ
                      عليه.
                      <Text mb="10px" mt="15px">
                        تبرير الاستخدام: تنفيذ العقد والمصالح المشروعة (تتيح لنا
                        تزويدك بالمحتوى والخدمات عبر هذا التطبيق)
                      </Text>
                    </Text>
                    <Text color="#C7C7C7" mb="10px" mt="15px">
                      (ح) مساعدة تطبيقنا على العمل بشكل صحيح وتقديم أنشطة صيانة
                      الحساب (إذا تمت الموافقة على طلبك) : للمساعدة في تقديم
                      المحتوى من تطبيقنا بأكثر الطرق فعالية لك ولجهازك، وإذا تمت
                      الموافقة على طلبك، فإذن ذلك لصيانة حساب المستخدم والحفاظ
                      عليه.
                      <Text mb="10px" mt="15px">
                        تبرير الاستخدام: تنفيذ العقد والمصالح المشروعة (تتيح لنا
                        تزويدك بالمحتوى والخدمات عبر هذا التطبيق)
                      </Text>
                    </Text>
                    {/* <Text color="#C7C7C7" mb="10px" mt="15px">
                          (i) To process a commitment, subscription, redemption
                          or withdrawal ► to evaluate and process your
                          commitment, subscription, redemption or withdrawal.
                          <Text mb="10px" mt="15px">
                            Use justification: consent, contract performance,
                            legitimate interests (to allow us to continue
                            providing services to you);
                          </Text>
                          <Text mb="10px" mt="15px">
                            In the event that we intend to further process your
                            Personal Data for a purpose other than as set out in
                            section 2 above, we shall provide you with
                            information on that other purpose before this
                            additional processing takes place.
                          </Text>
                        </Text> */}
                    <li>
                      <span>(1)</span>
                      <p className="pointsArea">
                        <strong>
                          <strong>إعادة تنظيم أعمالنا</strong>
                        </strong>
                        : تحليل أو إتاحة تحليل أي عمليات مقترحة لبيع أو دمج أو
                        اقتناء أصول أو إعادة تنظيم أعمالنا.
                      </p>

                      <p className="pointsArea db-mt">
                        <strong>
                          <strong> تبرير الاستخدام: </strong>
                        </strong>
                        تنفيذ العقد والمصالح المشروعة (تتيح لنا الاستمرار في
                        تزويدك بخدماتنا).
                      </p>

                      <p className="pointsArea db-mt">
                        إذا قررنا إجراء المزيد من المعالجة لبياناتك الشخصية لغرض
                        آخر بخلاف ما هو منصوص عليه في القسم 2 أعلاه، فسنطلعك على
                        هذا الغرض الآخر قبل مباشرة هذه المعالجة الإضافية.
                      </p>
                    </li>
                  </Box>
                </Flex>
                <Flex mb="30px">
                  <Box>3.</Box>{" "}
                  <Box pl="12px">
                    <Text fontSize="18px" fontWeight="700" color="#fff">
                      كيف نشارك البيانات الشخصية
                    </Text>
                  </Box>
                </Flex>
                <Flex mb="30px">
                  <Box>3.1</Box>{" "}
                  <Box pl="12px">
                    <Text fontSize="18px" color="#C7C7C7">
                      يجوز لنا مشاركة بياناتك الشخصية بالطرق التالية.
                      {/* <Text>
                            Please note that use of Personal Data under
                            applicable data protection laws must be justified
                            under one of a number of legal “grounds” and we are
                            required to set out the grounds in respect of each
                            use in this Privacy Policy.
                          </Text> */}
                    </Text>
                    <Text color="#C7C7C7" mb="10px" mt="15px">
                      (أ) مقدمو الخدمات التابعين لأطراف أخرى ممن يعالجون
                      البيانات الشخصية نيابةً عنا لمساعدتنا في تنفيذ الأنشطة
                      الموضحة في القسم 2 : قد نسمح لأطراف خارجية محددة مثل شركاء
                      الأعمال والموردين ومقدمي الخدمات والوكلاء والمقاولين
                      والشركات الأخرى التابعة للشركةباستخدام بياناتك الشخصية
                      للأغراض المنصوص عليها في القسم 2، ومنها شركات البريد
                      السريع وموفري خدمات البريد الإلكتروني الذين نستعين بهم
                      لإرسال ونشر المواد الترويجية لمنتجاتالشركة وموفري مراكز
                      البيانات الذين يستضيفون خوادمنا والوكلاء الخارجيين الذين
                      يعالجون مسائل البريد والطلبات والمعاملات نيابة عنا. ويُحظر
                      تعاقديًا على هذه الأطراف استخدام البيانات الشخصية لأي غرض
                      آخر بخلاف الغرض المذكور في العقود المبرمة مع كلٍ منها،
                      وستكون خاضعة لالتزامات معالجة البيانات الشخصية وفقًا لنفس
                      الضمانات التي نستخدمها. كما نقدم أيضًا معلومات غير شخصية
                      إلى هذه الجهات لاستخدامها إجمالًابهدف الوفاء بالتزاماتهم
                      التعاقدية تجاهنا. لا نسمح ببيع البيانات الشخصية إلى جهات
                      خارجالشركةلأي استخدام غير مرتبط بعمليات مجموعتنا أو
                      استخدام البيانات الشخصية من قبل أطراف أخرى لأغراضهم
                      الخاصة.
                    </Text>
                    <Text color="#C7C7C7" mb="10px" mt="15px">
                      (ب) وكالات إنفاذ القانون والجهات الحكومية والهيئات
                      التنظيمية والمحكمة للامتثال لالتزاماتنا القانونية أو
                      للتعامل مع الحوادث والمطالبات : يحق لنا الكشف عن بياناتك
                      الشخصية عندما يقتضيذلك قانون ذو صلة أو أمرٌصادر عن محكمة،
                      أو بناءً على طلب حكومة أخرى أو جهات إنفاذ القانون، أو أي
                      وكالة أو محكمة أو جهة تنظيمية أو أي طرف آخر نعتقد بأنه
                      ضروري للمساعدة في الإجراءات أو التحقيقات. حيثما يُسمح
                      بذلك، سنوجه أي طلب من هذا القبيل إليك أو إخطارك قبل الرد،
                      ما لم يكن القيام بذلك من شأنهالإضرار بمسار يهدف إلى منع
                      جريمة أو اكتشافها. وينطبقذلك أيضًا حينما يكون لدينا سبب
                      للاعتقاد بأن الكشف عن البيانات الشخصية ضروري للحصول على
                      مشورة قانونيةأو تحديد أو إجراء تحقيق أو توفير حماية أو
                      إجراء اتصال أو رفع دعوى قانونية ضد شخص قد يتسبب في المساس
                      بضيوفنا أو زوارنا أو شركائنا أو حقوقنا أو ممتلكات أو
                      بآخرين، سواء عن قصد أو غير ذلك أو عندما يمكن أن يتضرر أي
                      أحد آخر من هذه الأعمال.
                    </Text>
                    <Text color="#C7C7C7" mb="10px" mt="15px">
                      (ج) الأطراف الأخرى التي تطلب مثل هذه البيانات فيما يتعلق
                      بتغيير في هيكل أعمالنا: إذا دخلنا (أو جزء منا) في مفاوضات
                      بيع أعمالنا أو (2) بعنا إلى أو اندمجنامع أو بعنامعظم
                      أصولنا إلى طرف آخر أو (3) خضعنا لإعادة هيكلة، توافق على
                      أنه يجوز نقل أي من بياناتك الشخصية التي نحتفظ بها إلى تلك
                      الجهة الناتجة عن إعادة الهيكلة أو الطرف الآخر واستخدامها
                      لنفس الأغراض المنصوص عليها في سياسة الخصوصية هذه، أو لغرض
                      تحليل أي عملية بيع أو إعادة تنظيم مقترحة. وسنضمن عدم نقل
                      أي من بياناتك الشخصية أكثر من اللازم.
                    </Text>
                  </Box>
                </Flex>
                <Flex mb="30px">
                  <Box>3.2</Box>{" "}
                  <Box pl="12px">
                    <Text fontSize="18px" color="#C7C7C7">
                      لا تنطبق سياسة الخصوصية هذه على معالجتنا للمعلومات الشخصية
                      نيابة عن، أو بتوجيه من، موفري الخدمة التابعين لطرف ثالث،
                      ممن قد يجمعون معلومات شخصية منك ويقدمونها لنا. في هذه
                      الحالة، سنعمل فقط باعتبارنا معالجينللبيانات، ومن ثم ننصحك
                      بمراجعة سياسات الخصوصية المعمول بها لدى موفري الخدمة هؤلاء
                      قبل إرسال معلوماتك الشخصية.
                    </Text>
                  </Box>
                </Flex>
              </Box>

              <Box m="0px" textAlign="start">
                <Box as="p" m="0" fontSize="18px" color="#fff" py="10px">
                  مبررات الاستخدام والأسس القانونية
                </Box>
                <Box as="p" color="#C7C7C7" mb="10px" p="0 70px">
                  نذكرفيما يلي الأسس القانونية التي نستخدمها لتبرير كل استخدام
                  تخضع له معلوماتك، بالإضافة إلى القسمين الخاصين بـ كيف نستخدم
                  البيانات الشخصية وكيف نشارك البيانات الشخصية في سياسة الخصوصية
                  هذه . فيما يليالأسس القانونية الرئيسية التي تبرر استخدامنا
                  لبياناتك الشخصية:
                </Box>
              </Box>
              <Box
                textAlign="start"
                w="80%"
                margin="30px auto"
                border="1px solid"
              >
                <Text border="1px solid" p="5px 10px">
                  <Text fontStyle="italic" fontWeight="700" as="span">
                    الموافقة:
                  </Text>{" "}
                  وهي قبولك باستخدامنا لبياناتك الشخصية
                </Text>
                <Text border="1px solid" p="5px 10px">
                  <Text fontStyle="italic" fontWeight="700" as="span">
                    تنفيذ العقد:
                  </Text>{" "}
                  حيثما تكون بياناتك الشخصية ضرورية لإبرام عقدنا معك أو تنفيذه.
                </Text>
                <Text border="1px solid" p="5px 10px">
                  <Text fontStyle="italic" fontWeight="700" as="span">
                    الالتزام القانوني والتنظيمي:
                  </Text>{" "}
                  حيثما نحتاج إلى استخدام بياناتك الشخصية امتثالًا لالتزاماتنا
                  القانونية والتنظيمية.
                </Text>
                <Text border="1px solid" p="5px 10px">
                  <Text fontStyle="italic" fontWeight="700" as="span">
                    تحقيق مصالح مشروعة:
                  </Text>{" "}
                  عندما نستخدم بياناتك الشخصية لتحقيق مصلحة مشروعة وتفوق أسباب
                  استخدامنا لها أي مساسبحقوق حماية بياناتك الخاصة.
                </Text>
                <Text border="1px solid" p="5px 10px">
                  <Text fontStyle="italic" fontWeight="700" as="span">
                    مطالبات قانونية:
                  </Text>{" "}
                  عندما تكون معلوماتك ضرورية لنا للدفاع أو للمقاضاة أو لرفع دعوى
                  ضدك أو ضدنا أو ضد طرف ثالث.
                </Text>
                <Text border="1px solid" p="5px 10px">
                  <Text fontStyle="italic" fontWeight="700" as="span">
                    المصلحة الحيوية:
                  </Text>{" "}
                  حيثما نحتاج إلى معالجة بياناتك الشخصية لحماية مصلحة حيوية لك
                  أو لشخص طبيعي آخر، مثل احتياجك إلى مساعدة عاجلة
                </Text>
              </Box>
              <Box mt="20px" textAlign="start">
                <Flex mb="30px">
                  <Box>4.</Box>{" "}
                  <Box pl="12px">
                    <Text fontSize="18px" fontWeight="700" color="#fff">
                      {" "}
                      كيف ننقل البيانات الشخصية ونحميها ونخزنها
                    </Text>
                    {/* <Text color="#C7C7C7" mb="10px" mt="15px">
                          The term “Personal Data” refers to any information
                          that can be used to identify you, or that can be
                          linked to you, as an individual.
                        </Text> */}
                  </Box>
                </Flex>
                <Flex mb="30px">
                  <Box>4.1</Box>{" "}
                  <Box pl="12px">
                    <Text fontSize="18px" color="#C7C7C7">
                      يتعين مراعاة أن جميع الاتصالات عبر الإنترنت ليست آمنة.
                      هناك مخاطر ينطوي عليها استخدام البريد الإلكتروني. ويُرجى
                      الانتباه إلى ذلك عند طلبك معلومات أو إرسالكنماذج إلينا عبر
                      البريد الإلكتروني، على سبيل المثال، من قسم "اتصل بنا".
                      نوصي بعدم تضمين أي معلومات حساسة عند استخدام البريد
                      الإلكتروني أو استخدام أي أجهزة كمبيوتر عامة أو شبكة واي
                      فاي عامة. قد لا تتضمن ردودنا على البريد الإلكتروني أي
                      معلومات حساسة أو سرية. يرجى أن تضع باعتبارك أنه لا يوجد
                      نظام أمني أو نظام لنقل المعلومات يمكن ضمانه عبر الإنترنت.
                    </Text>
                  </Box>
                </Flex>
                <Flex mb="30px">
                  <Box>4.2</Box>{" "}
                  <Box pl="12px">
                    <Text fontSize="18px" color="#C7C7C7">
                      إذا تمكنت من تقديم طلبك وأُنشىء لك حساب مستخدم، فيجب عليك
                      دائمًا إغلاق المتصفحات الخاصة بك لدى الانتهاء من إكمال
                      النموذج. ومع أن الجلسة ستنتهي تلقائيًا بعد فترة قصيرة من
                      عدم النشاط، يصبح وصول طرف ثالث إلى صفحتك أسهل أثناء تسجيلك
                      الدخول إلى حسابك.
                    </Text>
                  </Box>
                </Flex>
                <Flex mb="30px">
                  <Box>4.3</Box>{" "}
                  <Box pl="12px">
                    <Text fontSize="18px" color="#C7C7C7">
                      نتعامل مع جميع البيانات الشخصية التي تزودنا بها باعتبارها
                      معلومات سرية. لحماية البيانات الشخصية من الوصول غير المصرح
                      به أو التسريب، اعتمدنا ونتابع بانتظام سياسات وإجراءات
                      الأمان وخصوصية البيانات لدينا. ونحن نستخدم بروتوكولSSL–وهو
                      معيار معتمد في التشفير عبر الإنترنت لحماية البيانات.
                      وحينما تدخل معلومات حساسة، ستشفر تلقائيًا وتنقل عبر
                      بروتوكول SSL. ويضمن ذلك تشفير بياناتك الحساسة أثناء
                      انتقالها عبر الإنترنت. ويمكنك أن تعرف أنك في وضع آمن عند
                      ظهور رمز الأمان (علامة مثل القفل) على الشاشة.
                    </Text>
                  </Box>
                </Flex>
                <Text mb="10px" mt="15px" color="#ffffff" fontFamily="700">
                  {" "}
                  <b>الضوابط الأمنية</b>
                </Text>
                <Flex mb="30px">
                  <Box>4.4</Box>{" "}
                  <Box pl="12px">
                    <Text fontSize="18px" color="#C7C7C7">
                      حيثما نقدملك (أو حيثما اخترت) كلمة مرور، فأنت مسؤول عن
                      الحفاظ على سريتها والامتثال لأية إجراءات أمنية أخرى نخطرك
                      بها. نطلب منك عدم إطلاع أي أحد على كلمة المرور الخاصة بك.
                    </Text>
                  </Box>
                </Flex>
                <Flex mb="30px">
                  <Box>4.5</Box>{" "}
                  <Box pl="12px">
                    <Text fontSize="18px" color="#C7C7C7">
                      تعرّف الشركةموظفيهابمدى أهمية خصوصية البيانات وسُبل
                      حمايتها. تحدّث سياسة الخصوصية لدينا على النحو المطلوب بما
                      يعكس أي تغييرات في القوانين المعمول بها والتطورات التي
                      تشهدها إجراءات أفضل الممارسات. وإضافة إلى ذلك، فإننا نحصر
                      عدد الأفراد داخل الشركات الذين يمكنهم الوصول إلى البيانات
                      الشخصية على هؤلاء الذين يشاركون مباشرة في تزويدكبخدمة
                      عالية الجودة.
                    </Text>
                  </Box>
                </Flex>
                <Flex mb="30px">
                  <Box>4.6</Box>{" "}
                  <Box pl="12px">
                    <Text fontSize="18px" color="#C7C7C7">
                      نخزّن بعضمعلومات العملاء في نظام معلومات العملاء.
                      وهذاالنظام عبارة عن قواعد بيانات عملاء آمنة مخزنة على خادم
                      خاص بذلك بمركز بيانات في أيرلنداحيث يستضيفه مزود خدمة من
                      طرف آخر. ويوجد خادمنا خلف جدران حماية لحماية بياناتك
                      الشخصية من أي وصول غيرمصرح به أو عَرَضي. ونظرًا لأن
                      القوانين المعمول بها بالنسبة للمعلومات الشخصية تتباينمن
                      دولة لأخرى، فقد نضع تدابير إضافية تختلف وفقًا للمتطلبات
                      القانونية المعمول بها.
                    </Text>
                  </Box>
                </Flex>
                <Text mb="10px" mt="15px" color="#ffffff" fontFamily="700">
                  <b>نقل البيانات عبر الحدود الدولية</b>
                </Text>
                <Flex mb="30px">
                  <Box>4.7</Box>{" "}
                  <Box pl="12px">
                    <Text fontSize="18px" color="#C7C7C7">
                      تتطلب منا طبيعة أعمالنا وعملياتنا نقل بياناتك الشخصية إلى
                      موزعين أو مراكز عمليات أو مراكز بيانات أو موفري خدمات
                      معتمدين آخرين قد يكونون في دول أخرى غير دولتك للأغراض
                      المذكورة في سياسة الخصوصية هذه. ومع أن قوانين حماية
                      البيانات والقوانين الأخرى لهذه البلدان المختلفة قد لا تكون
                      شاملة مثل تلك الموجودة في بلدك، ستتخذ الشركة سوف التدابير
                      المناسبة، بما في ذلك تنفيذ البنود التعاقدية المحدثة، لضمان
                      تأمين نقل بياناتك إلى المستلمين (والتي قد تكون جهات داخلية
                      أو خارجية بالنسبة للشركة) في بلد يختلف به مستوى الحماية
                      عما هو موجود في البلد الذي جمع فيه بياناتك.
                    </Text>
                  </Box>
                </Flex>
                <Flex mb="30px">
                  <Box>4.8</Box>{" "}
                  <Box pl="12px">
                    <Text fontSize="18px" color="#C7C7C7">
                      عندما تنقل بياناتك الشخصية إلى دولة قد تكون فيها قوانين
                      حماية البيانات ذات مستوى أقل من الدولة التي تقوم بالنقل،
                      ستفرض الشركةنفس إجراءات حماية البيانات التي نستخدمها في
                      البلدان التي نعمل بها لضمان تحقيق مستوى كاف لحماية هذه
                      البيانات.
                    </Text>
                  </Box>
                </Flex>
                <Flex mb="30px">
                  <Box>4.9</Box>{" "}
                  <Box pl="12px">
                    <Text fontSize="18px" color="#C7C7C7">
                      قد يتعين نقل البيانات الشخصية التي جمعت باستخدام الوسائل
                      الموجودة في البحرين إلى خارج البحرين للمعالجة. ونظرًا لعدم
                      وجود اختصاصات قضائية معتمدة توفر المستوى الكافي من حماية
                      البيانات الذي تقتضيهالقوانينفي البحرين، يتطلب موافقتك لأي
                      نقل للبيانات الشخصية خارج البحرين. وبحسب متطلبات العمل، قد
                      ننقل بياناتك الشخصية إلى السعودية وسويسرا وأيرلندا
                      ("اختصاصات قضائيةمعتمدة") وتوافق على نقل بياناتك الشخصية
                      إلى الاختصاصات القضائية المعتمدة.
                    </Text>
                  </Box>
                </Flex>
                <Text mb="10px" mt="15px" color="#ffffff" fontFamily="700">
                  <b>الاحتفاظ بالمعلومات</b>
                </Text>
                <Flex mb="30px">
                  <Box>4.10</Box>{" "}
                  <Box pl="12px">
                    <Text fontSize="18px" color="#C7C7C7">
                      تخزن بياناتك الشخصية على مدى الفترة الزمنية المطلوبة أو
                      التي يسمح بها القانون في الاختصاص القضائي لعملية الاحتفاظ
                      بالمعلومات (على سبيل المثال، قد يحتفظ بتفاصيل معينة عن
                      المعاملات والمراسلات حتى انتهاء المهلة الزمنية للمطالبات
                      المتعلقة بالمعاملة أو للامتثال للمتطلبات التنظيمية فيما
                      يتعلق بالاحتفاظ بهذه البيانات). لذلك إذا كانت معلومات ما
                      تستخدم لغرضين، فسنحتفظ بها حتى انتهاء الغرض ذي الفترة
                      الأخيرة، ولكننا سنتوقف عن استخدامه للغرض ذي الفترة الزمنية
                      الأقصر بمجرد انتهاء تلك الفترة.
                    </Text>
                  </Box>
                </Flex>
                <Flex mb="30px">
                  <Box>4.11</Box>{" "}
                  <Box pl="12px">
                    <Text fontSize="18px" color="#C7C7C7">
                      تعتمد فترات الاحتفاظ لدينا على احتياجات العمل، والمعلومات
                      الخاصة بك التي تنتهي الحاجة إليها إما أن يتم تجهيلها بشكل
                      نهائي (يمكن الاحتفاظ بالمعلومات مجهولة المصدر) أو يتم
                      إتلافها بشكل آمن بمجرد انتهاء الغرض الذي جمعنا من أجله هذه
                      البيانات الشخصية.وعلى سبيل المثال
                    </Text>
                    <Text color="#C7C7C7" mb="10px" mt="15px">
                      (أ) <u>استخدامها في الرسائل التسويقية: </u>
                      &nbsp;فيما يتعلق ببياناتك الشخصية التي استخدمت للتسويق، قد
                      نحتفظ ببياناتك الشخصية لهذا الغرض بعد حصولنا على الموافقة
                      على تزويدكبرسائل تسويقية، أو بعد آخر مرة استجبت فيها
                      لرسالة تسويقية منا (هذا بخلاف اختيار عدم تلقي رسائل أخرى)
                    </Text>
                    <Text color="#C7C7C7" mb="10px" mt="15px">
                      (ب) <u>استخدامها لتنفيذ عقد: </u>
                      &nbsp;فيما يتعلق ببياناتك الشخصية المستخدمة لتنفيذ أي
                      التزام تعاقدي معك، يجوز لنا الاحتفاظ بتلك البيانات الشخصية
                      أثناء سريان العقد ولفترة معينة بعد ذلك للتعامل مع أي
                      استفسارات أو مطالبات تردنا بعد ذلك.
                    </Text>
                    <Text color="#C7C7C7" mb="10px" mt="15px">
                      (ج) <u>عندالتفكير في المطالبات: </u>
                      &nbsp;فيما يتعلق بأي معلومات نعتقد بدرجة معقولة أنها ستكون
                      ضرورية للدفاع أو المقاضاة أو رفع دعوى ضدك أو ضدنا أو ضد
                      طرف ثالث، يجوز لنا الاحتفاظ بهذه المعلومات طالما بقيت هناك
                      إمكانية لمتابعة هذه المطالبات.
                    </Text>
                  </Box>
                </Flex>
                <Flex mb="30px">
                  <Box>5.</Box>{" "}
                  <Box pl="12px">
                    <Text fontSize="18px" fontWeight="700" color="#fff">
                      <strong>حقوقك</strong>
                      <strong className=".mb-mt-ml">الانسحاب من التسويق</strong>
                    </Text>
                  </Box>
                </Flex>
                <Flex mb="30px">
                  <Box>5.1</Box>{" "}
                  <Box pl="12px">
                    <Text fontSize="18px" color="#C7C7C7">
                      يحقلك مطالبتنا بعدم معالجة بياناتك الشخصية لأغراض تسويقية.
                      يمكنك أيضًا ممارسة هذا الحق في أي وقت عبر طريق التواصل
                      معنا.
                    </Text>
                  </Box>
                </Flex>
                <Text mb="10px" mt="15px" color="#ffffff" fontFamily="700">
                  <b>حقوق أخرى</b>
                </Text>
                <Flex mb="30px">
                  <Box>5.2</Box>{" "}
                  <Box pl="12px">
                    <Text fontSize="18px" color="#C7C7C7">
                      مع مراعاة الاستثناءات المختلفة وقوانين حماية البيانات في
                      بلدك، يمكنك ممارسة الحقوق التالية:
                    </Text>
                    <Text color="#C7C7C7" mb="10px" mt="15px">
                      (أ) <b>الوصول: </b>
                      يمكنك أن تطلب منا تزويدك بمزيد من التفاصيل عن استخدامنا
                      لبياناتك الشخصية وكذلك نسخة من البيانات الشخصية التي نحتفظ
                      بها عنك
                    </Text>
                    <Text color="#C7C7C7" mb="10px" mt="15px">
                      (ب) <b>التصحيح: </b>
                      يمكنك أن تطلب منا تصحيح أي أخطاء في بياناتك الشخصية التي
                      نحتفظ بها
                    </Text>
                    <Text color="#C7C7C7" mb="10px" mt="15px">
                      (ج) <b>الشكوى: </b>
                      إذا لم تكن راضيًا عن استخدامنا لبياناتك الشخصية أو ردّنا
                      على أي ممارسة لهذه الحقوق، يحق لك تقديم شكوى إلى هيئة
                      حماية البيانات في بلدك (إن وجدت)
                    </Text>
                    <Text color="#C7C7C7" mb="10px" mt="15px">
                      (د) <b>محو البيانات: </b>
                      يمكنك أن تطلب منا حذف بياناتك الشخصية إذا لم يعد لدينا
                      أساس قانوني لاستخدامها
                    </Text>
                    <Text color="#C7C7C7" mb="10px" mt="15px">
                      (هـ) <b>سحب الموافقة: </b>
                      حيثما تعتمد معالجة البيانات على الموافقة (مثل التسويق)،
                      يمكنك سحب موافقتك على المعالجة حتى نوقف هذه المعالجة
                    </Text>
                    <Text color="#C7C7C7" mb="10px" mt="15px">
                      (و) <b>الاعتراض على المعالجة: </b>: يحق لك الاعتراض على
                      أنواع أخرى من المعالجة (مثل التحليلات وأنشطة التوصيف التي
                      يتم إجراؤها فيما يتعلق ببياناتك الشخصية أو أي معالجة تسبب
                      لك ضررًا ماديًا أو معنويًا لك)، ما لم تكن الأسباب وراء
                      قيامنا بهذهالمعالجة تفوق أي مساس بحقوق حماية بياناتك
                    </Text>
                    <Text color="#C7C7C7" mb="10px" mt="15px">
                      (ز) <b>القيود: </b>
                      يمكنك تحديد كيفية استخدامنا لبياناتك الشخصية، على سبيل
                      المثال أثناء قيامنا بالتحقق من دقة بياناتك الشخصية أو
                      حيثما نتحقق من الأسس التي تستخدم كأساس للاحتفاظ ببياناتك
                      الشخصية
                    </Text>
                    <Text color="#C7C7C7" mb="10px" mt="15px">
                      (ح) <b>قابلية النقل: </b>: حيثما يكون ذلك ممكنًا من
                      الناحية الفنية، يحق لك مطالبتنا بإرسال البيانات الشخصية
                      التي زودتنا بها إلى طرف ثالث في نموذج منظم وشائع الاستخدام
                      يمكن قراءته آليًا.
                    </Text>
                  </Box>
                </Flex>
                <Text mb="10px" mt="15px" color="#ffffff" fontFamily="700">
                  {" "}
                  <b>تحديث أو تعديل المعلومات</b>
                </Text>
                <Flex mb="30px">
                  <Box>5.3</Box>{" "}
                  <Box pl="12px">
                    <Text fontSize="18px" color="#C7C7C7">
                      سنبذل كل جهد ممكن لضمان دقة بياناتك الشخصية. ولمساعدتنا في
                      ذلك، يجب عليك إخطارنا عبر الاتصال بنا بأي تغييرات تطرأ على
                      البيانات الشخصية التي قدمتها لنا.
                    </Text>
                  </Box>
                </Flex>
                <Text mb="10px" mt="15px" color="#ffffff" fontFamily="700">
                  {" "}
                  <b>الإخطار في حالة تعرضالبيانات للخرق</b>
                </Text>
                <Flex mb="30px">
                  <Box>5.4</Box>{" "}
                  <Box pl="12px">
                    <Text fontSize="18px" color="#C7C7C7">
                      في حالة تعرض البيانات لخرق غير متوقع، فنحن على استعداد
                      لاتباع أي قوانين ولوائح تتطلب منا إخطارك بانكشاف المعلومات
                      الخاصة.
                    </Text>
                  </Box>
                </Flex>
                <Flex mb="30px">
                  <Box>6.</Box>{" "}
                  <Box pl="12px">
                    <Text fontSize="18px" fontWeight="700" color="#fff">
                      <strong> ملفات تعريف الارتباط </strong>
                    </Text>
                    <Text color="#C7C7C7" mb="10px" mt="15px">
                      يستخدم موقعنا الإلكتروني ملفات تعريف الارتباط لجمع معلومات
                      معينة عنك وتخزينها، ولتمييزك عن المستخدمين الآخرين لهذا
                      الموقع. يساعدنا هذا في تزويدك بتجربة جيدة عند تصفح موقعنا
                      ويتيح لنا أيضًا تحسين موقعنا. ملف تعريف الارتباط هو ملف
                      نصي صغير يرسل بواسطة الموقع، ويقبل بواسطة متصفح الإنترنت
                      ثم يوضع على محرك الأقراص الثابتة لديك. تتيح لنا المعلومات
                      التي جمعت من ملفات تعريف الارتباط معرفة أنك زرت موقعنا في
                      الماضي، وتساعدك على تجنب الاضطرار إلى إعادة إدخال
                      المعلومات في كل زيارة لاستخدام بعض منتجاتنا أو خدماتنا،
                      وغير ذلك. ونستخدم في هذا الموقع مجموعة متنوعة من ملفات
                      تعريف الارتباط:
                    </Text>
                    <Text color="#C7C7C7" mb="10px" mt="15px">
                      ضرورية للغاية: ملفات تعريف الارتباط هذه ضرورية لعمل الموقع
                      ولا يمكن إيقاف تشغيلها في أنظمتنا. عادةً ما تقدم فقط
                      استجابةً لإجراء قمت به ويرقى إلى مستوى طلب خدمات مثل تحديد
                      تفضيلات الخصوصية لديك أو تسجيل الدخول أو ملء النماذج.
                      يمكنك ضبط متصفحك على حظر أو تنبيهك بشأن ملفات تعريف
                      الارتباط هذه، ولكن إذا قمت بذلك، فلن تعمل لديك بعض أقسام
                      الموقع. ولا تخزن ملفات تعريف الارتباط هذه أي معلومات
                      شخصية.
                    </Text>
                    <Text color="#C7C7C7" mb="10px" mt="15px">
                      ملفات تعريف الارتباط الخاصة بالأداء: تتيح لنا ملفات تعريف
                      الارتباط هذه حساب عدد الزيارات ومصادر الزيارات حتى نتمكن
                      من قياس أداء موقعنا وتحسينه. وتساعدنا في معرفة أي الصفحات
                      أكثر زيارة وأيها أقل، ومعرفة كيفية تحرك الزوار في جميع
                      أقسام الموقع. ويتم تجميع كل المعلومات التي تجمعها ملفات
                      تعريف الارتباط هذه وبالتالي فهي مجهولة المصدر. إذا لم تسمح
                      بملفات تعريف الارتباط هذه، فلن نعرف متى زرت موقعنا ولن
                      نتمكن من متابعة أدائه.
                    </Text>
                    <Text color="#C7C7C7" mb="10px" mt="15px">
                      ملفات تعريف الارتباط الوظيفية: تُمكّن ملفات تعريف الارتباط
                      هذه الموقع من تأدية مهامه بشكل أفضل وإضفاء الطابع الشخصي.
                      وقد تحدد من قبلنا أو بواسطة مزودي خدمة آخرين ممن أضفنا
                      خدماتهم إلى صفحاتنا. إذا لم تسمح بملفات تعريف الارتباط
                      هذه، فقد لا تعمل بعض أو كل هذه الخدمات على النحو الصحيح.
                    </Text>
                    <Text color="#C7C7C7" mb="10px" mt="15px">
                      ملفات تعريف الارتباط الخاصة بالاستهداف: قد تحدد ملفات
                      تعريف الارتباط هذه من خلال موقعنا بواسطة شركائنا
                      الإعلانيين. قد تستخدمها هذه الشركات لتكوين صورة تعريفية عن
                      اهتماماتك وعرض الإعلانات ذات الصلة على مواقع أخرى. لا تخزن
                      هذه الملفات المعلومات الشخصية مباشرة، ولكنها تعتمد على
                      تحديد متصفحك وجهاز الإنترنت الخاص بك بشكل فريد. إذا لم
                      تسمح بملفات تعريف الارتباط هذه، فستواجه إعلانات أقل ملاءمة
                      لك.
                    </Text>
                    <Text color="#C7C7C7" mb="10px" mt="15px">
                      ملفات تعريف الارتباط الخاصة بوسائل التواصل الاجتماعي: تحدد
                      ملفات تعريف الارتباط هذه بواسطة مجموعة من خدمات الوسائط
                      الاجتماعية التي ربما نضيفها إلى الموقع لتمكينك من مشاركة
                      المحتوى الخاص بنا مع أصدقائك والشبكات الاجتماعية أو
                      المهنية. وهي قادرة على تتبع متصفحك عبر مواقع أخرى وإنشاء
                      ملف تعريفي لاهتماماتك. قد يؤثر ذلك على المحتوى والرسائل
                      التي تراها على المواقع الأخرى التي تزورها. إذا لم تسمح
                      بهذا النوع من ملفات تعريف الارتباط، فقد لا تتمكن من
                      استخدام أو مشاهدة أدوات المشاركة هذه.
                    </Text>
                  </Box>
                </Flex>
                <Flex mb="30px">
                  <Box>7.</Box>{" "}
                  <Box pl="12px">
                    <Text fontSize="18px" fontWeight="700" color="#fff">
                      <strong> إدخال تغييرات على سياسة الخصوصية</strong>
                    </Text>
                    <Text color="#C7C7C7" mb="10px" mt="15px">
                      {" "}
                      قد نحتاج مستقبلًا إلى إدخال تغييرات إضافية. ستدرججميع
                      التغييرات الإضافية في أحدث بيان لسياسة الخصوصية المنشور
                      على هذا التطبيق، وذلك لتظل دائمًا على علم بممارساتنا
                      الحالية فيما يتعلق بالمعلومات التي نجمعها وطريقة استخدام
                      هذه المعلومات والإفصاح عن تلك المعلومات لأطراف أخرى.يمكنك
                      معرفة تاريخ آخر تحديث لسياسة الخصوصية هذه من خلال التاريخ
                      الموجود في أسفل سياسة الخصوصية. وتحتفظالشركةبالحق، وفقًا
                      لتقديرهاوحدها، في تعديل أو تغيير أو تحديث سياسة الخصوصية
                      هذه في أي وقت. لن تكون أي تغييرات سارية إلا بعد تاريخ نفاذ
                      التغيير ولن تؤثر على أي نزاع قد ينشأ قبل هذا التاريخ.{" "}
                    </Text>
                  </Box>
                </Flex>
                <Flex mb="30px">
                  <Box>8.</Box>{" "}
                  <Box pl="12px">
                    <Text fontSize="18px" fontWeight="700" color="#fff">
                      <strong> مواقع أخرى </strong>
                    </Text>
                    <Text color="#C7C7C7" mb="10px" mt="15px">
                      {" "}
                      قد يحتوي هذا التطبيق على روابط لمواقع إلكترونيةتابعة
                      لأطراف أخرى. إذا اتبعت رابطًا لأي من هذه المواقع، فيرجى
                      ملاحظة أن لديهم سياسة خصوصية خاصة بهم ولا نتحمل أي مسؤولية
                      أو نقبل أي التزام عن سياساتهم أو معالجة معلوماتك الشخصية.
                      يرجى مراجعة هذه السياسات قبل إرسال أي معلومات شخصية إلى
                      مواقع هذه الأطراف الأخرى.
                    </Text>
                  </Box>
                </Flex>
                <Flex mb="30px">
                  <Box>9.</Box>{" "}
                  <Box pl="12px">
                    <Text fontSize="18px" fontWeight="700" color="#fff">
                      <strong> حقوق إضافية</strong>
                    </Text>
                    <Text color="#C7C7C7" mb="10px" mt="15px">
                      {" "}
                      قد تمنحك القوانين المعمول بها حقوقًا إضافية غير منصوص
                      عليها في سياسة الخصوصية هذه.
                    </Text>
                  </Box>
                </Flex>
              </Box>
              <Text
                width="100%"
                margin="auto"
                borderBottom="1px solid #222222"
              ></Text>
              <Box textAlign="start" mt="30px">
                <Text color="#ffffff" mb="30px" fontWeight="700">
                  <strong>اتصل بنا </strong>
                </Text>
                <Text mb="30px">
                  للمزيد من المعلومات أو للاستفسار حول اتفاقية المستخدم أو سياسة
                  الخصوصية هذه ، يرجى الاتصال بـ:
                </Text>
                <Box mb="30px">
                  <Text>خدمة العملاء </Text>
                  <Text color="primary.500">onboarding@tfoco.com</Text>
                </Box>
              </Box>
            </ModalBody>
          )}
          {/* <ModalFooter px="0px" pb="0px">
            <Flex w="100%" px="10px" py="12px" borderTop="1px solid #222">
              <Button
                color="#B99855"
                bg="transparent"
                border="none"
                onClick={handleClose}
                _active={{
                  bg: "transparent",
                }}
                _hover={{
                  bg: "transparent",
                }}
                _focus={{
                  boxShadow: "none",
                }}
              >
                Cancel
              </Button>
              <Spacer />
              <Button
                bg="#B99855"
                border="none"
                py="10px"
                px="16px"
                borderRadius="3px"
                color="#1A1A1A"
                onClick={onClose}
                _active={{
                  bg: "B99855",
                }}
                _hover={{
                  bg: "B99855",
                }}
                _focus={{
                  boxShadow: "none",
                }}
              >
                Accept All
              </Button>
            </Flex>
          </ModalFooter> */}
        </ModalContent>
      </Modal>
    </>
  )
}
