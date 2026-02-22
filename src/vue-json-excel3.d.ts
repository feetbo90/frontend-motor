declare module "vue-json-excel3" {
  import type { DefineComponent } from "vue";
  const component: DefineComponent<{
    data?: Record<string, unknown>[];
    fields?: Record<string, string>;
    type?: "xlsx" | "xls" | "csv";
    name?: string;
    worksheet?: string;
    "default-value"?: string;
  }>;
  export default component;
}
