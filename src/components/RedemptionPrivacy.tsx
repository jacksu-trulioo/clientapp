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

type Type = {
  show: boolean
  close: () => void
}

export default function RedemptionPrivacyPolicy({ show, close }: Type) {
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
          w={{ base: "343px", md: "645px", lg: "856px" }}
          h={{ base: "600px", md: "500px" }}
          maxW="865px"
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
              px={{ lg: "30px", md: "30px", base: "16px" }}
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
                  aria-label="Terms and Conditions"
                  role={"heading"}
                  as="p"
                  fontFamily="Gotham"
                  mb="24px"
                  textAlign="start"
                  fontSize={{ base: "18px", md: "20px" }}
                  color="#fff"
                  pt="10px"
                  fontWeight="500"
                >
                  Terms & Conditions
                </Box>
              </Box>
              <Box fontSize="18px" mt="24px" fontFamily="400" textAlign="start">
                <Text>
                  <Text fontWeight="700" as="span">
                    a.
                  </Text>
                  <Text ml="5px" as="span">
                    Information relating to investments in entities managed by
                    TFO or its affiliates is not available to the general
                    public. Under no circumstances should any information
                    presented in the App or otherwise be construed as an offer
                    to sell, or solicitation of any offer to purchase, any
                    securities or other investments. No information contained
                    herein constitutes a recommendation to buy or sell
                    investment instruments or other assets, nor to effect any
                    transaction, or to conclude any legal act of any kind
                    whatsoever in any jurisdiction in which such offer or
                    recommendation would be unlawful.
                  </Text>
                </Text>
              </Box>
              <Box fontSize="18px" mt="24px" fontFamily="400" textAlign="start">
                <Text>
                  <Text fontWeight="700" as="span">
                    b.
                  </Text>
                  <Text ml="5px" as="span">
                    The App and any information therein is not aimed at any US
                    Person (as defined by Regulation S of the US Securities Act
                    1933) and is not for distribution and does not constitute an
                    offer to or solicitation to buy any securities in the US.
                  </Text>
                </Text>
              </Box>
              <Box fontSize="18px" mt="24px" fontFamily="400" textAlign="start">
                <Text>
                  <Text fontWeight="700" as="span">
                    c.
                  </Text>
                  <Text ml="5px" as="span">
                    Nothing contained herein constitutes financial, legal, tax
                    or other advice, nor should any investment or any other
                    decision(s) be made solely on the information set out
                    herein. Advice from a qualified expert should be obtained
                    before making any investment decision. The investment
                    strategies discussed in the App and otherwise may not be
                    suitable for all investors. Investors must make their own
                    decisions based upon their investment objectives, financial
                    position and tax considerations.
                  </Text>
                </Text>
              </Box>
              <Box fontSize="18px" mt="24px" fontFamily="400" textAlign="start">
                <Text>
                  <Text fontWeight="700" as="span">
                    d.
                  </Text>
                  <Text ml="5px" as="span">
                    The information provided in the App and otherwise is for
                    informational purposes only and is subject to change at any
                    time without notice. The factual information set forth
                    herein has been obtained or derived from sources believed by
                    TFO or its affiliates to be reliable but it is not
                    necessarily all-inclusive and is not guaranteed as to its
                    accuracy and is not to be regarded as a representation or
                    warranty, express or implied, as to the information’s
                    accuracy or completeness, nor should the attached
                    information serve as the basis of any investment decision.
                  </Text>
                </Text>
              </Box>
              <Box fontSize="18px" mt="24px" fontFamily="400" textAlign="start">
                <Text>
                  <Text fontWeight="700" as="span">
                    e.
                  </Text>
                  <Text ml="5px" as="span">
                    To the extent this information contains any forecasts,
                    projections, goals, plans and other forward-looking
                    statements, such forward-looking statements necessarily
                    involve known and unknown risks and uncertainties, which may
                    cause actual performance, financial results and other
                    projections in the future to differ materially from any
                    projections of future performance or result expressed or
                    implied by such forward-looking statements.
                  </Text>
                </Text>
              </Box>
            </ModalBody>
          ) : (
            <ModalBody
              overflow="auto"
              px={{ lg: "30px", md: "30px", base: "16px" }}
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
                  fontFamily="Gotham"
                  mb="24px"
                  textAlign="start"
                  fontSize={{ base: "18px", md: "20px" }}
                  color="#fff"
                  pt="10px"
                  fontWeight="500"
                >
                  الشروط والأحكام
                </Box>
              </Box>
              <Box fontSize="18px" mt="24px" fontFamily="400" textAlign="start">
                <Text>
                  <Text ml="5px" as="span">
                    أ. المعلومات ذات الصلة بالاستثمار في كيانات تديرها شركة The
                    Family Office أو الشركات التابعة لها ليست متاحة للجمهور. ولا
                    يجوز بأي حال من الأحوال اعتبار أي معلومات منشورة عبر التطبيق
                    الإلكتروني أو بأي طريقة أخرى عرضًا للبيع أو طلبًا أو عرضا
                    لشراء أية أوراق مالية أو استثمارات أخرى. ولا تشكل أي معلومات
                    واردة هنا توصية بشراء أو بيع أدوات استثمار أو أصول أخرى ولا
                    لتنفيذ أي معاملة أو إبرام أي إجراء قانوني من أي نوع على
                    الإطلاق في أي اختصاص قضائي يكون فيه هذا العرض أو التوصية غير
                    قانوني
                  </Text>
                </Text>
              </Box>
              <Box fontSize="18px" mt="24px" fontFamily="400" textAlign="start">
                <Text>
                  <Text ml="5px" as="span">
                    ب. لا يستهدف التطبيق وأي معلومات واردة فيه أي شخص أمريكي
                    الجنسية (كما هو محدد في اللائحة S من قانون الأوراق المالية
                    الأمريكي لعام 1933) وليس للتوزيع ولا يشكل عرضًا أو طلبًا
                    لشراء أي أوراق مالية في الولايات المتحدة الأمريكية.
                  </Text>
                </Text>
              </Box>
              <Box fontSize="18px" mt="24px" fontFamily="400" textAlign="start">
                <Text>
                  <Text ml="5px" as="span">
                    ج. لا شيء مما هو وارد هنا يمثل مشورة مالية أو قانونية أو
                    ضريبية أو غيرها، ولا ينبغي القيام بأي استثمار أو قرار (أو
                    قرارات) آخر استنادًا إلى المعلومات الواردة هنا فقط. ويتعين
                    الحصول على مشورة خبير مؤهل قبل اتخاذ أي قرار استثماري. قد لا
                    تكون استراتيجيات الاستثمار التي تم تناولها عبر التطبيق
                    الإلكتروني وغيره ملائمة لجميع المستثمرين. يجب على المستثمرين
                    اتخاذ قراراتهم الخاصة بناءً على أهدافهم الاستثمارية ووضعهم
                    المالي واعتباراتهم الضريبية.
                  </Text>
                </Text>
              </Box>
              <Box fontSize="18px" mt="24px" fontFamily="400" textAlign="start">
                <Text>
                  <Text ml="5px" as="span">
                    د. المعلومات الواردة في التطبيق وغير ذلك هي لغرض الاطلاع فقط
                    وهي عرضة للتغيير في أي وقت دون إشعار. تم الحصول على
                    المعلومات الحقيقية الواردة هنا أو استخلاصها من مصادر تعتقد
                    شركة The Family Office أو الشركات التابعة لها أنها جديرة
                    بالثقة ولكنها ليست بالضرورة شاملة أو مضمونة من حيث دقتها ولا
                    يجب اعتبارها بمثابة تمثيل أو ضمان، صريحًا كان أو ضمنيًا،
                    فيما يتعلق بدقة المعلومات أو اكتمالها، ويجب ألا تكون
                    المعلومات المرفقة أساسا لأي قرار استثماري.
                  </Text>
                </Text>
              </Box>
              <Box fontSize="18px" mt="24px" fontFamily="400" textAlign="start">
                <Text>
                  <Text ml="5px" as="span">
                    ه. بقدر ما تحتوي هذه المعلومات على أي توقعات وتقديرات وأهداف
                    وخطط وغيرها من البيانات ذات النظرة المستقبلية، تنطوي مثل هذه
                    البيانات بالضرورة على مخاطر وجوانب عدم يقين معروفة وغير
                    معروفة، مما قد يتسبب في أداء فعلي ونتائج مالية وتوقعات أخرى
                    في المستقبل تتباين جوهريًا مع أي توقعات لأداء أو نتيجة
                    مستقبلية تم التعبير عنها صراحة أو ضمنيًا من خلال هذه
                    البيانات ذات النظرة المستقبلية."
                  </Text>
                </Text>
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
