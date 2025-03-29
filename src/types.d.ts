// 补充 blockbench-types 可能缺少的类型

// 如果 OutlinerElement 类型未定义，可以在此补充
interface OutlinerElement {
  type: string;
  name: string;
  children?: OutlinerElement[];
}

// 如果 Dialog 的 form 数据类型未定义
interface DialogFormData {
  [key: string]: any;
}
