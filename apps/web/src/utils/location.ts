import { SERVER_BASE_URL } from '../constants/url';

interface DfsResult {
  x?: number;
  y?: number;
  lat?: number;
  lng?: number;
}

const RE = 6371.00877;    // 지구 반경(km)
const GRID = 5.0;        // 격자 간격(km)
const SLAT1 = 30.0;      // 투영 위도1(degree)
const SLAT2 = 60.0;      // 투영 위도2(degree)
const OLON = 126.0;      // 기준점 경도(degree)
const OLAT = 38.0;       // 기준점 위도(degree)
const XO = 43;           // 기준점 X좌표(GRID)
const YO = 136;          // 기준점 Y좌표(GRID)

// 사용자 위치 가져오기
export const getGeoLocation = (): Promise<GeolocationPosition> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      return reject(new Error('failed get geolocation'))
    }

    navigator.geolocation.getCurrentPosition(
      position => resolve(position), 
      error => reject(error), 
      { enableHighAccuracy: true, timeout: 1000*10 }
    )
  })
}

// 그리드 좌표 얻기
// https://gist.github.com/fronteer-kr/14d7f779d52a21ac2f16
export const dfsXYConv = (code: 'toXY' | 'toLL', v1: number, v2: number): DfsResult => {
  const DEGRAD = Math.PI / 180;
  const RADDEG = 180 / Math.PI;

  const re = RE / GRID;
  const slat1 = SLAT1 * DEGRAD;
  const slat2 = SLAT2 * DEGRAD;
  const olon = OLON * DEGRAD;
  const olat = OLAT * DEGRAD;

  // sn
  let sn = Math.tan(Math.PI * 0.25 + slat2 * 0.5) /
           Math.tan(Math.PI * 0.25 + slat1 * 0.5);
  sn = Math.log(Math.cos(slat1) / Math.cos(slat2)) / Math.log(sn);

  // sf
  let sf = Math.tan(Math.PI * 0.25 + slat1 * 0.5);
  sf = Math.pow(sf, sn) * Math.cos(slat1) / sn;

  // ro
  let ro = Math.tan(Math.PI * 0.25 + olat * 0.5);
  ro = re * sf / Math.pow(ro, sn);

  const result: DfsResult = {};

  if (code === 'toXY') {
    const lat = v1;
    const lng = v2;

    // ra
    let ra = Math.tan(Math.PI * 0.25 + lat * DEGRAD * 0.5);
    ra = re * sf / Math.pow(ra, sn);

    // theta
    let theta = lng * DEGRAD - olon;
    if (theta > Math.PI)  theta -= 2 * Math.PI;
    if (theta < -Math.PI) theta += 2 * Math.PI;
    theta *= sn;

    result.x   = Math.floor(ra * Math.sin(theta) + XO + 0.5);
    result.y   = Math.floor(ro - ra * Math.cos(theta) + YO + 0.5);
    result.lat = lat;
    result.lng = lng;
  }
  else { // toLL
    const x = v1;
    const y = v2;
    const xn = x - XO;
    const yn = ro - y + YO;

    let ra = Math.sqrt(xn * xn + yn * yn);
    if (sn < 0) ra = -ra;

    let alat = Math.pow((re * sf / ra), 1 / sn);
    alat = 2 * Math.atan(alat) - Math.PI * 0.5;

    let theta: number;
    if (Math.abs(xn) <= 0) {
      theta = 0;
    } else if (Math.abs(yn) <= 0) {
      theta = Math.PI * 0.5;
      if (xn < 0) theta = -theta;
    } else {
      theta = Math.atan2(xn, yn);
    }

    const alon = theta / sn + olon;
    result.lat = alat * RADDEG;
    result.lng = alon * RADDEG;
    result.x   = x;
    result.y   = y;
  }

  return result;
}

// 격자 좌표로 변환하기
export const getUserXYCoords = async (): Promise<{name: string, x: number, y: number}> => {
  try {
    const { coords } = await getGeoLocation();
    const { latitude: lat, longitude: lng } = coords;
    const name = await getDistrictName(lat, lng);
    const { x, y } = dfsXYConv('toXY', lat, lng);

    if (x == null || y == null) {
      throw new Error('failed dfsXYConv')
    }

    return { name, x, y };

  } catch (err) {
    console.error('위치 정보 얻기 실패:', err);
    throw err;
  }
}

// 사용자 위치를 지역명으로 변환하기
export const getDistrictName = async (lat: number, lng: number): Promise<string> => {
  const url = new URL('https://dapi.kakao.com/v2/local/geo/coord2address.json')

  url.searchParams.set('x', lng.toString()); // 경도
  url.searchParams.set('y', lat.toString()); // 위도

  const res = await fetch(url.toString(), {
    headers: {
      Authorization: `KakaoAK ${import.meta.env.VITE_KAKAO_REST_KEY}`,
    },
  })

  if (!res.ok) {
    throw new Error('kakao api err')
  }

  const { documents } = (await res.json()) as {
    documents: Array<{
      address: {
        region_1depth_name: string; 
        region_2depth_name: string;
      };
    }>;
  };

  if (documents.length === 0) {
    throw new Error('주소 정보를 찾을 수 없습니다.');
  }

  const { region_1depth_name, region_2depth_name } = documents[0].address;
  return `${region_1depth_name} ${region_2depth_name}`;
}

export const registerUserLocation = async (districtName: string) => {
  const url = new URL("https://dapi.kakao.com/v2/local/search/address.json");
  url.searchParams.set("query", districtName);

  const res = await fetch(url.toString(), {
    headers: {
      Authorization: `KakaoAK ${import.meta.env.VITE_KAKAO_REST_KEY}`,
    },
  });

  const { documents } = await res.json();
  const { x: lng, y: lat } = documents[0];

  const { x, y } = dfsXYConv("toXY", parseFloat(lat), parseFloat(lng));
  const endpoint = import.meta.env.DEV ? SERVER_BASE_URL.dev : SERVER_BASE_URL.prod

  await fetch(`${endpoint}/registerLocation`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      displayName: districtName,
      nx: x,
      ny: y,
    }),
  });
}