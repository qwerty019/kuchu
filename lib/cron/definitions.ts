export type LoginData = {
  status: string;
  sessionId: string;
};

export type BranchesData = {
  status: string;
  items: Branch[];
};

export type Branch = {
  branchId: number;
  branch: string;
  address: string;
};

export type OstData = {
  status: string;
  items: Ost[];
};

export type Ost = {
  branchId: number;
  regId: number;
  tovName: string;
  fabr: string;
  ruDrugName: string;
  naklDataId: number;
  uQntOst: number;
  priceRoznWNDS: number;
  priceOptWNDS: number;
  priceFabrNoNDS: number;
  jv: boolean;
  brakLS: boolean;
  isAptekaRu: boolean;
  BarCode: string;
  fixPriceValue: number;
  pku: string;
  isPersonalOrder: boolean;
  recipe: boolean;
  uQntRez: number;
  nds: number;
  srokG: string;
  ratio: number;
  mark: boolean;
  firstNaklDataId: number;
  distrId: number;
  distr: string;
  customDeclaration: string;
  seria: string;
  sn: string;
  gtin: string;
  commission: boolean;
};

export type GoodsData = {
  status: string;
  date: string;
  lastId: number;
  items: Good[];
};

export type Good = {
  regId: number;
  drugId: number;
  formId: number;
  fabrId: number;
  mnnId: number;
  drug: string;
  form: string;
  fabr: string;
  mnn: string;
  flag: number;
  ean: string;
  isVital: boolean;
  isService: boolean;
  rSum: number;
};

export type OrderData = {
  status: string;
  date: string;
  lastId: number;
  Orders: Order[] | [];
};

export type Order = {
  DocId: number;
  DocDate: string;
  branchId: number;
  DateLife: string;
  Status: number;
  CustomerPhone: string;
  CustomerName: string;
  Comment: string;
  PrepaySum: number;
  PrepayDocId: number;
  PaymentSum: number;
  OrderSum: number;
  Goods: OrderGood[];
};

export type OrderGood = {
  Form: string;
  FormId: number;
  Drug: string;
  DrugId: number;
  Fabr: string;
  Country: string;
  InternalBarcode: string;
  FabrBarcode: string;
  Mark: false;
  Quantity: number;
  Price: number;
  NDS: number;
  SumTax: number;
  SumWTax: number;
  SumWOTax: number;
  Discount: number;
  SumDiscount: number;
  FixedPrice: number;
  FirstNaklDataID: number;
};

export type CertificateData = {
  status: string;
  cert_list: Certificate[];
};

export type Certificate = {
  title: string;
  status: number;
  nominal: number;
  customer: string;
  pay_date: string;
  sale_date: string;
  upd_count: number;
  cert_number: string;
  create_date: string;
  cert_branchs: number[];
  comment_text: string;
  pay_branch_id: number;
  sale_branch_id: number;
  expiration_date: string;
  gift_certificate_id: number;
  pay_nakl_title_r_id: number;
  sale_nakl_title_r_id: number;
};

export type ClassifierData = {
  status: string;
  items: Classifier;
};

export type Classifier = {
  Classifier: string;
  id: number;
  tovList?: TovList[];
  row?: Classifier[];
};

export type TovList = {
  RegId: number;
  tovName: string;
};
