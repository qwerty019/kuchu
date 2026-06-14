export type LoginData = {
  status: string;
  sessionId: string;
};

export type GoodsData = {
  status: string;
  date: string;
  lastId: number;
  items: Good[] | [];
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

export type CallData = {
  balance: string;
  call_id: number;
  created: string;
  phone: string;
  pincode: string;
};

type Sms = {
  id: number;
  from: string;
  number: string;
  text: string;
  status: number;
  extendStatus: string;
  channel: string;
  cost: number;
  dateCreate: number;
  dateSend: number;
};

export type SmsData = {
  success: boolean;
  data: Sms | Sms[];
};

export type FoundData = {
  status: string;
  items: Found[] | [];
};

export type Found = {
  regId: number;
  drugId: number;
  formId: number;
};

export type AdditionalData = {
  status: string;
  items: Additional[] | [];
};

export type Additional = {
  slaveDrugId: number;
  slaveDrug: string;
  slaveCnt: number;
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

export type Branch = {
  branchId: number;
  branch: string;
  address: string;
};

export type Book = {
  status: string;
  date: string;
  MadeToOrderTitleID: number;
  MadeToOrder2TitleID: number;
  items: BookItem[];
};

export type BookItem = {
  regId: number;
  qnt: number;
  isBooking: number;
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

export type OstByGoodsData = {
  status: string;
  branchList: BranchList[] | [];
};

export type BranchList = {
  branchId: number;
  goodsList: Ost2[] | [];
};

export type Ost2 = {
  regId: number;
  naklDataId: number;
  uQntOst: number;
  priceRoznWNDS: number;
  createDate: string;
  srokG: string;
  fixPriceValue: number;
  pku: string;
  isAptekaRu: boolean;
  brakLS: boolean;
  isPersonalOrder: boolean;
  recipe: boolean;
  uQntRez: number;
  NDS: number;
  PercOptNac: number;
  PriceOptWNDS: number;
  jv: boolean;
  ratio: number;
  mark: boolean;
  firstNaklDataId: number;
};

export type DiscountCardData = {
  status: string;
  items: DiscountCard2[] | [];
};

export type DiscountCard2 = {
  fio: string;
  phone: string;
  accumulation: number;
  discount: number;
  discountJ: number;
};

export type Info = {
  add: boolean;
  clicked: boolean;
  search: string;
  loading: boolean;
  lat: number | null;
  long: number | null;
  result: {
    lat: number;
    long: number;
    address: string;
  } | null;
  found: {
    lat: number;
    long: number;
    address: string;
    zoneId: number;
  } | null;
  error: string | null;
};

export type SetInfo = React.Dispatch<React.SetStateAction<Info>>;

export type BranchType = {
  address: string | null;
  city: {
    id: number;
    title: string;
  };
  id: number;
  title: string;
  fbId: number | null;
  main: boolean;
};

export type DiscountCard = {
  id: number;
  accumulation: number;
  barcode: string;
  discount: number;
  rateAccumulation: number;
};

export type Story = {
  id: number;
  img: string;
  title: string;
  storybranches: {
    branchId: number;
  }[];
  slides: {
    id: number;
    img: string;
    title: string;
    text: string;
    subtitle: string | null;
    categoryId: number | null;
    link: string | null;
    button: string | null;
    category: {
      id: number;
      title: string;
      route: string;
    } | null;
  }[];
};

export type Sale = {
  img: string;
  title: string;
  text: string | null;
  id: number;
  images: string[];
  subtitle: string | null;
  salegoods: {
    good: {
      ost: {
        priceRoznWNDS: number;
        branchId: number;
        uQntOst: number;
        fixPriceValue: number;
        recipe: boolean;
        naklDataId: number;
      }[];
      id: number;
      img: string | null;
      regId: number;
      drug: string;
      form: string;
    };
  }[];
  category: {
    goods: {
      id: number;
      form: string;
      img: string | null;
      ost: {
        priceRoznWNDS: number;
        branchId: number;
        uQntOst: number;
        fixPriceValue: number;
        recipe: boolean;
        naklDataId: number;
      }[];
      regId: number;
      drug: string;
    }[];
    id: number;
    title: string;
    route: string;
  } | null;
};

export type Option = {
  value: string;
  label: string;
  desc?: string;
  disabled?: boolean;
};

export type Payment = {
  id: string;
  status: "pending";
  paid: boolean;
  amount: {
    value: string;
    currency: string;
  };
  confirmation: {
    type: "redirect";
    confirmation_url: string;
    confirmation_token: string;
  };
  created_at: string;
  description: string;
  metadata: {
    dbOrderId?: number;
    certId?: string;
    orderId?: number;
  };
  recipient: {
    account_id: string;
    gateway_id: string;
  };
  refundable: boolean;
  test: boolean;
};
