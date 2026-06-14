export type DiscountCardData = {
  status: string;
  items: DiscountCard[];
};

export type DiscountCard = {
  fio: string;
  phone: string;
  barcode: string;
  accumulation: number;
  discount: number;
  discountJ: number;
  rateAccumulation: number;
  rateAccumulationJ: number;
};

export type FindData = {
  status: string;
  items: Find[];
};

export type Find = {
  regId: number;
  drugId: number;
  formId: number;
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

export type DopData = {
  status: string;
  items: Dop[];
};

export type Dop = {
  slaveDrugId: number;
  slaveDrug: string;
  slaveCnt: number;
};
