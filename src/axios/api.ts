import request from "./index.ts";
export function setMsg(params: any) {
  return request.post("/msg", params);
}
export function getMsg(params: any) {
  return request.get("/msg", params);
}
export function getOneMsg(x: number, y: number, params: any) {
  return request.get(`/msg/xy?x=${x}&y=${y}`, params);
}
