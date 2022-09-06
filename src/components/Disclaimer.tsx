import {
  Box,
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
} from "@chakra-ui/react"
import useTranslation from "next-translate/useTranslation"
import React from "react"

import { CloseIconSetting } from "~/components"

type desclaimerType = {
  show: boolean
  close: () => void
}

export default function Disclaimer({ show, close }: desclaimerType) {
  const { lang } = useTranslation("setting")
  const { onClose } = useDisclosure({ defaultIsOpen: true })

  return (
    <>
      <Modal isOpen={show} onClose={onClose} size="xl">
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
          <Box px="29px" py="12px" textAlign="end">
            <Button
              aria-label="Close"
              p="0"
              bg="transparent"
              textAlign="end"
              color="#B99855"
              border="none"
              onClick={close}
              fontSize="18px"
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
              <Box>
                <CloseIconSetting />
              </Box>
            </Button>
          </Box>
          <ModalHeader
            aria-label="Disclaimer"
            role={"heading"}
            textAlign="center"
            fontSize="20px"
            fontWeight="600"
            mt="24px"
          >
            {lang.includes("en") ? "Disclaimer" : "إخلاء مسؤولية"}
          </ModalHeader>
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
              textAlign="start"
            >
              <Text pb="15px" fontSize="16px">
                a. Information relating to investments in entities managed by
                The Family Office or its affiliates is not available to the
                general public.  Under no circumstances should any information
                presented on the Application or otherwise be construed as an
                offer to sell, or solicitation of any offer to purchase, any
                securities or other investments. No information contained herein
                constitutes a recommendation to buy or sell investment
                instruments or other assets, nor to effect any transaction, or
                to conclude any legal act of any kind whatsoever in any
                jurisdiction in which such offer or recommendation would be
                unlawful.
              </Text>
              <Text pb="15px" fontSize="16px">
                b. The Application and any information therein is not aimed at
                any US Person (as defined by Regulation S of the US Securities
                Act 1933) and is not for distribution and does not constitute an
                offer to or solicitation to buy any securities in the US.
              </Text>
              <Text pb="15px" fontSize="16px">
                c. Nothing contained herein constitutes financial, legal, tax or
                other advice, nor should any investment or any other decision(s)
                be made solely on the information set out herein.  Advice from a
                qualified expert should be obtained before making any investment
                decision. The investment strategies discussed in the Application
                and otherwise may not be suitable for all investors. Investors
                must make their own decisions based upon their investment
                objectives, financial position and tax considerations.
              </Text>
              <Text pb="15px" fontSize="16px">
                d. The information provided in the Application and otherwise is
                for informational purposes only and is subject to change at any
                time without notice. The factual information set forth herein
                has been obtained or derived from sources believed by TFO or its
                affiliates to be reliable but it is not necessarily
                all-inclusive and is not guaranteed as to its accuracy and is
                not to be regarded as a representation or warranty, express or
                implied, as to the information’s accuracy or completeness, nor
                should the attached information serve as the basis of any
                investment decision.
              </Text>
              <Text pb="15px" fontSize="16px">
                e. To the extent this information contains any forecasts,
                projections, goals, plans and other forward-looking statements,
                such forward-looking statements necessarily involve known and
                unknown risks and uncertainties, which may cause actual
                performance, financial results and other projections in the
                future to differ materially from any projections of future
                performance or result expressed or implied by such
                forward-looking statements.
              </Text>
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
              textAlign="start"
            >
              <Text pb="15px" fontSize="16px">
                {" "}
                أ. المعلومات ذات الصلة بالاستثمار في كيانات تديرها شركة The
                Family Office أو الشركات التابعة لها ليست متاحة للجمهور. ولا
                يجوز بأي حال من الأحوال اعتبار أي معلومات منشورة عبر التطبيق
                الإلكتروني أو بأي طريقة أخرى عرضًا للبيع أو طلبًا أو عرضا لشراء
                أية أوراق مالية أو استثمارات أخرى. ولا تشكل أي معلومات واردة هنا
                توصية بشراء أو بيع أدوات استثمار أو أصول أخرى ولا لتنفيذ أي
                معاملة أو إبرام أي إجراء قانوني من أي نوع على الإطلاق في أي
                اختصاص قضائي يكون فيه هذا العرض أو التوصية غير قانوني.
              </Text>
              <Text pb="15px" fontSize="16px">
                ب. لا يستهدف التطبيق وأي معلومات واردة فيه أي شخص أمريكي الجنسية
                (كما هو محدد في اللائحة S من قانون الأوراق المالية الأمريكي لعام
                1933) وليس للتوزيع ولا يشكل عرضًا أو طلبًا لشراء أي أوراق مالية
                في الولايات المتحدة الأمريكية.
              </Text>
              <Text fontSize="16px">
                {" "}
                ج. لا شيء مما هو وارد هنا يمثل مشورة مالية أو قانونية أو ضريبية
                أو غيرها، ولا ينبغي القيام بأي استثمار أو قرار (أو قرارات) آخر
                استنادًا إلى المعلومات الواردة هنا فقط. ويتعين الحصول على مشورة
                خبير مؤهل قبل اتخاذ أي قرار استثماري. قد لا تكون استراتيجيات
                الاستثمار التي تم تناولها عبر التطبيق الإلكتروني وغيره ملائمة
                لجميع المستثمرين. يجب على المستثمرين اتخاذ قراراتهم الخاصة بناءً
                على أهدافهم الاستثمارية ووضعهم المالي واعتباراتهم الضريبية.
              </Text>
              <Text pb="15px" fontSize="16px">
                {" "}
                د. المعلومات الواردة في التطبيق وغير ذلك هي لغرض الاطلاع فقط وهي
                عرضة للتغيير في أي وقت دون إشعار. تم الحصول على المعلومات
                الحقيقية الواردة هنا أو استخلاصها من مصادر تعتقد شركة The Family
                Office أو الشركات التابعة لها أنها جديرة بالثقة ولكنها ليست
                بالضرورة شاملة أو مضمونة من حيث دقتها ولا يجب اعتبارها بمثابة
                تمثيل أو ضمان، صريحًا كان أو ضمنيًا، فيما يتعلق بدقة المعلومات
                أو اكتمالها، ويجب ألا تكون المعلومات المرفقة أساسا لأي قرار
                استثماري.
              </Text>
              <Text pb="15px" fontSize="16px">
                {" "}
                ه. بقدر ما تحتوي هذه المعلومات على أي توقعات وتقديرات وأهداف
                وخطط وغيرها من البيانات ذات النظرة المستقبلية، تنطوي مثل هذه
                البيانات بالضرورة على مخاطر وجوانب عدم يقين معروفة وغير معروفة،
                مما قد يتسبب في أداء فعلي ونتائج مالية وتوقعات أخرى في المستقبل
                تتباين جوهريًا مع أي توقعات لأداء أو نتيجة مستقبلية تم التعبير
                عنها صراحة أو ضمنيًا من خلال هذه البيانات ذات النظرة
                المستقبلية."
              </Text>
            </ModalBody>
          )}
        </ModalContent>
      </Modal>
    </>
  )
}
