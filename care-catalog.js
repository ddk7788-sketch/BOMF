/* Shared care taxonomy for the desktop mega menu, mobile menu, and page generator. */
const bomkkotCareCatalog = [
  {
    title: "통증재활", slug: "pain-rehabilitation", items: [
      ["디스크", "disc"], ["협착증", "spinal-stenosis"], ["오십견", "frozen-shoulder"],
      ["무릎·슬관절염", "knee-arthritis"], ["만성통증", "chronic-pain"],
      ["교통사고 후유증", "traffic-accident"], ["초음파 가이드 신경주사", "ultrasound-guided-nerve-injection"],
      ["난치성 질환 상담", "refractory-conditions"],
    ],
  },
  {
    title: "추나교정", slug: "chuna-correction", items: [
      ["일자목", "straight-neck"], ["거북목", "forward-head-posture"], ["굽은등", "rounded-back"],
      ["측만증", "scoliosis"], ["전방전위증", "spondylolisthesis"], ["O/X다리", "bow-legs"], ["평발", "flat-feet"],
    ],
  },
  {
    title: "내과 · 신경 · 비뇨기과", slug: "internal-neuro-urology", items: [
      ["두통", "headache"], ["소화불량 (기능성·신경성)", "functional-dyspepsia"], ["안면마비", "facial-palsy"],
      ["중풍 후유증", "stroke-aftercare"], ["요실금", "urinary-incontinence"], ["야뇨", "nocturnal-enuresis"], ["치질", "hemorrhoids"],
    ],
  },
  {
    title: "안이비인후과", slug: "ent", items: [
      ["코로나·독감 예방접종 후 증상 상담", "post-vaccination-symptoms"], ["비염", "rhinitis"], ["축농증", "sinusitis"],
      ["안구건조", "dry-eye"], ["구강건조·구내염", "dry-mouth-stomatitis"], ["어지럼·이석증", "dizziness-bppv"],
    ],
  },
  {
    title: "소아과", slug: "pediatrics", items: [
      ["성장·영양 보약 상담", "growth-nutrition"], ["소아 변비·식욕부진", "pediatric-constipation-appetite"],
      ["야경증·수면장애", "night-terrors-sleep"], ["총명탕 상담", "chongmyung-tang"],
    ],
  },
  {
    title: "부인과 · 정신과", slug: "womens-mental-health", items: [
      ["불면", "insomnia"], ["ADHD 상담", "adhd"], ["틱장애", "tic-disorder"], ["생리통", "menstrual-pain"],
      ["난임 상담", "infertility"], ["산후보약", "postpartum-herbal-care"], ["갱년기", "menopause"], ["수족·복부 냉증", "cold-extremities-abdomen"],
    ],
  },
  {
    title: "피부클리닉", slug: "skin-clinic", items: [
      ["점", "moles"], ["잡티", "blemishes"], ["흉터", "scars"], ["미백·피부톤 관리", "skin-tone"], ["기미", "melasma"],
      ["여드름", "acne"], ["아토피피부염", "atopic-dermatitis"], ["리프팅", "lifting"], ["제모", "hair-removal"],
      ["스킨부스터", "skin-booster"], ["실리프팅·매선", "thread-lifting"],
    ],
  },
  {
    title: "다이어트클리닉", slug: "weight-management", items: [
      ["린화 다이어트 캡슐 상담", "diet-capsule"], ["온다 장비 바디 시술", "onda-body-treatment"],
      ["장 기능·배변 관리", "bowel-function"], ["지방분해 약침 상담", "herbal-lipolysis"],
    ],
  },
];

const bomkkotFeaturedCare = [
  { title: "통증", slug: "chronic-pain", icon: "accessibility_new" },
  { title: "난치성 질환", slug: "refractory-conditions", icon: "medical_services" },
  { title: "체중 관리", slug: "weight-management", icon: "monitor_weight" },
  { title: "피부", slug: "skin-clinic", icon: "face_3" },
  { title: "난임", slug: "infertility", icon: "pregnant_woman" },
];

if (typeof module !== "undefined" && module.exports) module.exports = bomkkotCareCatalog;
if (typeof window !== "undefined") {
  window.BomkkotCareCatalog = bomkkotCareCatalog;
  window.BomkkotFeaturedCare = bomkkotFeaturedCare;
}
