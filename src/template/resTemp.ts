export const ResData: Record<number, string> = {
  200000: "OK",

  400001: "Secret Wrong",
  400002: "File Format Wrong",
  400003: "File Not Found"
};

export function resData<D>(
  code: number,
  data: D = null,
  msg: string = ResData[code] || ""
) {
  return { code, data, msg };
}
