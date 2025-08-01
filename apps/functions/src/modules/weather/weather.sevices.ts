import dayjs from 'dayjs';

export interface WeatherResult {
  temperature: number;
  base_date: string;
  base_time: string;
}

export class WeatherService {
  private readonly baseUrl = 'https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtNcst';
  private readonly apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  public async getLocationTemperature(nx: number, ny: number): Promise<WeatherResult | null> {
    const now = dayjs();
    const base_date = now.format('YYYYMMDD');
    const base_time = now.subtract(1, 'hour').minute(0).second(0).format('HHmm');

    const params = new URLSearchParams({
      serviceKey: this.apiKey,
      dataType: 'JSON',
      base_date,
      base_time,
      nx: nx.toString(),
      ny: ny.toString(),
    });

    const url = `${this.baseUrl}?${params.toString()}`;
    
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`API 호출 실패: ${res.status}`);
      const json = await res.json() as any;

      const items = json?.response?.body?.items?.item;
      if (!Array.isArray(items)) return null;

      const T1H = items.find((item: any) => item.category === 'T1H');
      if (!T1H) return null;

      return {
        temperature: parseFloat(T1H.obsrValue),
        base_date,
        base_time,
      };
    } catch (err) {
      console.error(`❌ WeatherService.getLocationTemperature 실패:`, err);
      return null;
    }
  }
}
