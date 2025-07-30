import fetch from "node-fetch";

export interface WeatherResult {
  temperature: number;
  base_date: string;
  base_time: string;
}

export class WeatherService {
  constructor(private serviceKey: string) {}

  async getLocationTemperature(nx: number, ny: number): Promise<WeatherResult | null> {
    const dayjs = (await import("dayjs")).default;
    const now = dayjs().minute(0).second(0).millisecond(0);
    const base_date = now.format("YYYYMMDD");
    const base_time = now.subtract(1, "hour").format("HHmm");

    const params = new URLSearchParams({
      serviceKey: this.serviceKey,
      dataType: "JSON",
      base_date,
      base_time,
      nx: nx.toString(),
      ny: ny.toString(),
    });

    const url = `https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtNcst?${params}`;

    try {
      const response = await fetch(url);
      const json = await response.json() as any;

      if (json.response?.header?.resultCode !== "00") {
        console.warn("⚠️ 기상청 응답 오류", json.response?.header?.resultMsg);
        return null;
      }

      const items = json.response.body.items.item;
      const T1H = items.find((item: any) => item.category === "T1H")?.obsrValue;

      if (T1H == null) return null;

      return {
        temperature: T1H,
        base_date,
        base_time,
      };
    } catch (err) {
      console.error("❌ WeatherFetcher 에러", err);
      return null;
    }
  }
}
