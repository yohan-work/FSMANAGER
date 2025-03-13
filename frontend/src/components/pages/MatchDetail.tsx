import { useEffect, useState, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  FiArrowLeft,
  FiMapPin,
  FiCalendar,
  FiClock,
  FiDollarSign,
  FiUsers,
  FiStar,
  FiMessageCircle,
  FiPhone,
  FiShare2,
  FiHeart,
} from "react-icons/fi";

// 카카오맵 API 타입 정의
declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    kakao: any; // 카카오맵 API는 공식 타입 정의가 없어 any 사용
  }
}

// 카카오맵 관련 타입 정의
interface KakaoMap {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setCenter: (latlng: any) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getCenter: () => any;
  getLevel: () => number;
  setLevel: (level: number) => void;
  relayout: () => void;
}

// 매치 타입 정의
interface Match {
  id: number;
  title: string;
  location: string;
  address: string;
  distance: string;
  date: string;
  time: string;
  price: string;
  teamName: string;
  level: string;
  participants: number;
  maxParticipants: number;
  description: string;
  hostName: string;
  hostImage: string;
  hostLevel: string;
  hostMatches: number;
  lat?: number;
  lng?: number;
}

const MatchDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [match, setMatch] = useState<Match | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<KakaoMap | null>(null);
  const [mapError, setMapError] = useState<string | null>(null);

  useEffect(() => {
    // 실제 앱에서는 API에서 데이터를 가져옵니다
    // 여기서는 목업 데이터를 사용합니다
    const fetchMatchDetail = () => {
      setLoading(true);

      // 목업 데이터
      const mockMatches: Record<string, Match> = {
        "1": {
          id: 1,
          title: "주말 5:5 풋살 한 팀 구해요",
          location: "서울 강남구 삼성동",
          address: "서울특별시 강남구 삼성동 159-1 코엑스 앞 풋살장",
          distance: "0.8km",
          date: "2023년 3월 25일",
          time: "토요일 오후 3시 ~ 5시",
          price: "10,000원",
          teamName: "FC 강남",
          level: "중급",
          participants: 8,
          maxParticipants: 10,
          description:
            "주말 오후에 진행하는 5:5 풋살 경기입니다. 현재 8명이 모였고, 2명이 더 필요합니다. 실력은 중급 정도면 충분합니다. 경기 후 간단한 친목 시간도 있을 예정입니다.",
          hostName: "김강남",
          hostImage: "https://randomuser.me/api/portraits/men/32.jpg",
          hostLevel: "중급",
          hostMatches: 24,
          lat: 37.508,
          lng: 127.056,
        },
        "2": {
          id: 2,
          title: "평일 저녁 친선 경기 팀 모집",
          location: "서울 강남구 역삼동",
          address: "서울특별시 강남구 역삼동 테헤란로 152 역삼공원 풋살장",
          distance: "1.2km",
          date: "2023년 3월 22일",
          time: "수요일 오후 7시 ~ 9시",
          price: "15,000원",
          teamName: "역삼 유나이티드",
          level: "초급",
          participants: 6,
          maxParticipants: 10,
          description:
            "평일 저녁에 진행하는 친선 경기입니다. 초보자도 환영합니다. 함께 즐겁게 운동하실 분들을 찾습니다. 장비는 개인이 준비해주세요.",
          hostName: "박역삼",
          hostImage: "https://randomuser.me/api/portraits/men/45.jpg",
          hostLevel: "중급",
          hostMatches: 18,
          lat: 37.501,
          lng: 127.037,
        },
        "3": {
          id: 3,
          title: "주말 아침 풋살 정기모임",
          location: "서울 서초구 반포동",
          address: "서울특별시 서초구 반포동 반포한강공원 풋살장",
          distance: "2.5km",
          date: "2023년 3월 26일",
          time: "일요일 오전 9시 ~ 11시",
          price: "12,000원",
          teamName: "반포FC",
          level: "상급",
          participants: 7,
          maxParticipants: 10,
          description:
            "매주 일요일 아침에 진행하는 정기 모임입니다. 실력이 어느 정도 있으신 분들을 찾습니다. 경기 후 함께 브런치도 먹을 예정입니다.",
          hostName: "이반포",
          hostImage: "https://randomuser.me/api/portraits/men/67.jpg",
          hostLevel: "상급",
          hostMatches: 36,
          lat: 37.504,
          lng: 127.02,
        },
      };

      // ID에 해당하는 매치 찾기
      setTimeout(() => {
        if (id && mockMatches[id]) {
          setMatch(mockMatches[id]);
        }
        setLoading(false);
      }, 500); // 로딩 시뮬레이션
    };

    fetchMatchDetail();
  }, [id]);

  // 카카오맵 초기화
  useEffect(() => {
    if (!match || !match.lat || !match.lng || map) return;

    const initializeMap = () => {
      if (!mapRef.current) return;

      try {
        // 카카오맵 API가 로드되었는지 확인
        if (
          typeof window.kakao === "undefined" ||
          typeof window.kakao.maps === "undefined"
        ) {
          setMapError("카카오맵 API를 로드할 수 없습니다.");
          return;
        }

        // 카카오맵 API 로드
        if (typeof window.kakao.maps.load === "function") {
          window.kakao.maps.load(() => {
            createMap();
          });
        } else {
          // 이미 로드된 경우 바로 맵 생성
          createMap();
        }
      } catch (error) {
        console.error("카카오맵 로드 오류:", error);
        setMapError("카카오맵을 로드하는 중 오류가 발생했습니다.");
      }
    };

    const createMap = () => {
      try {
        if (!mapRef.current || !match.lat || !match.lng) return;

        // 맵 옵션 설정
        const options = {
          center: new window.kakao.maps.LatLng(match.lat, match.lng),
          level: 3,
        };

        // 맵 생성
        const kakaoMap = new window.kakao.maps.Map(mapRef.current, options);
        setMap(kakaoMap);

        // 마커 생성
        const markerPosition = new window.kakao.maps.LatLng(
          match.lat,
          match.lng
        );
        const marker = new window.kakao.maps.Marker({
          position: markerPosition,
        });
        marker.setMap(kakaoMap);

        // 인포윈도우 생성
        const iwContent = `<div style="padding:5px;font-size:12px;">${match.title}</div>`;
        const infowindow = new window.kakao.maps.InfoWindow({
          content: iwContent,
        });
        infowindow.open(kakaoMap, marker);

        // 지도 크기 재설정
        setTimeout(() => {
          if (kakaoMap.relayout) {
            kakaoMap.relayout();
            kakaoMap.setCenter(
              new window.kakao.maps.LatLng(match.lat, match.lng)
            );
          }
        }, 300);
      } catch (error) {
        console.error("카카오맵 초기화 오류:", error);
        setMapError("카카오맵을 초기화하는 중 오류가 발생했습니다.");
      }
    };

    // 약간의 지연 후 초기화 (DOM이 완전히 렌더링된 후)
    setTimeout(initializeMap, 500);
  }, [match, map]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#f9fafb]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#3182F6] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#4E5968]">매치 정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (!match) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-[#f9fafb] p-4">
        <div className="text-center">
          <div className="text-6xl mb-4">😢</div>
          <h2 className="text-xl font-bold text-[#] mb-2">
            매치를 찾을 수 없습니다
          </h2>
          <p className="text-[#4E5968] mb-6">
            요청하신 매치 정보가 존재하지 않습니다.
          </p>
          <button
            onClick={() => navigate("/")}
            className="bg-[#3182F6] text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            홈으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#f9fafb] min-h-screen pb-20">
      {/* 헤더 */}
      <div className="bg-white sticky top-0 z-10 px-5 py-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate(-1)}
              className="text-[#ffffff] hover:bg-[#f1f3f5] p-2 rounded-full"
            >
              <FiArrowLeft size={20} />
            </button>
            <span className="font-bold text-[#191F28] text-lg">매치 상세</span>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setIsLiked(!isLiked)}
              className={`p-2 rounded-full ${
                isLiked ? "text-red-500" : "text-[#ffffff]"
              }`}
            >
              <FiHeart size={20} />
            </button>
            <button className="text-[#ffffff] p-2 rounded-full">
              <FiShare2 size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* 매치 정보 */}
      <div className="bg-white shadow-sm mb-4">
        <div className="p-5">
          <h1 className="text-xl font-bold text-[#191F28] mb-3">
            {match.title}
          </h1>

          <div className="flex items-center text-[#4E5968] mb-2">
            <FiMapPin className="mr-2 text-[#3182F6]" />
            <span>{match.address}</span>
          </div>

          <div className="flex items-center text-[#4E5968] mb-2">
            <FiCalendar className="mr-2 text-[#3182F6]" />
            <span>{match.date}</span>
          </div>

          <div className="flex items-center text-[#4E5968] mb-2">
            <FiClock className="mr-2 text-[#3182F6]" />
            <span>{match.time}</span>
          </div>

          <div className="flex items-center text-[#4E5968] mb-2">
            <FiDollarSign className="mr-2 text-[#3182F6]" />
            <span>참가비: {match.price}</span>
          </div>

          <div className="flex items-center text-[#4E5968] mb-2">
            <FiUsers className="mr-2 text-[#3182F6]" />
            <span>
              참가 인원: {match.participants}/{match.maxParticipants}명
            </span>
          </div>

          <div className="flex items-center text-[#4E5968]">
            <FiStar className="mr-2 text-[#3182F6]" />
            <span>실력 수준: {match.level}</span>
          </div>
        </div>

        {/* 참가 현황 */}
        <div className="px-5 py-4 border-t border-gray-100">
          <div className="flex justify-between items-center mb-2">
            <h2 className="font-bold text-[#191F28]">참가 현황</h2>
            <span className="text-[#3182F6] font-medium">
              {match.participants}/{match.maxParticipants}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-[#3182F6] h-2.5 rounded-full"
              style={{
                width: `${(match.participants / match.maxParticipants) * 100}%`,
              }}
            ></div>
          </div>
        </div>
      </div>

      {/* 매치 설명 */}
      <div className="bg-white shadow-sm mb-4 p-5">
        <h2 className="font-bold text-[#191F28] mb-3">매치 설명</h2>
        <p className="text-[#4E5968] whitespace-pre-line">
          {match.description}
        </p>
      </div>

      {/* 주최자 정보 */}
      <div className="bg-white shadow-sm mb-4 p-5">
        <h2 className="font-bold text-[#191F28] mb-3">주최자 정보</h2>
        <div className="flex items-center">
          <img
            src={match.hostImage}
            alt={match.hostName}
            className="w-12 h-12 rounded-full mr-4"
          />
          <div>
            <p className="font-medium text-[#191F28]">{match.hostName}</p>
            <div className="flex items-center text-sm text-[#4E5968]">
              <span className="mr-2">레벨: {match.hostLevel}</span>
              <span>주최 매치: {match.hostMatches}회</span>
            </div>
          </div>
        </div>
      </div>

      {/* 팀 정보 */}
      <div className="bg-white shadow-sm mb-4 p-5">
        <h2 className="font-bold text-[#191F28] mb-3">팀 정보</h2>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-[#191F28]">{match.teamName}</p>
            <p className="text-sm text-[#4E5968]">레벨: {match.level}</p>
          </div>
          <Link
            to={`/teams/${match.teamName.replace(/\s+/g, "-").toLowerCase()}`}
            className="text-[#3182F6] text-sm font-medium hover:underline"
          >
            팀 상세 보기
          </Link>
        </div>
      </div>

      {/* 위치 정보 */}
      <div className="bg-white shadow-sm mb-4 p-5">
        <h2 className="font-bold text-[#191F28] mb-3">위치 정보</h2>
        {mapError ? (
          <div className="bg-gray-100 h-48 rounded-lg mb-3 flex items-center justify-center">
            <p className="text-red-500">{mapError}</p>
          </div>
        ) : (
          <div
            ref={mapRef}
            className="h-48 rounded-lg mb-3 overflow-hidden"
            style={{ width: "100%" }}
          ></div>
        )}
        <p className="text-[#4E5968]">{match.address}</p>
      </div>

      {/* 하단 고정 버튼 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t py-4 px-5 flex space-x-3 z-20">
        <button className="flex-1 bg-white border border-[#3182F6] text-[#3182F6] py-3 rounded-lg font-medium flex items-center justify-center">
          <FiPhone className="mr-2" />
          문의하기
        </button>
        <button className="flex-1 bg-[#3182F6] text-white py-3 rounded-lg font-medium flex items-center justify-center">
          <FiMessageCircle className="mr-2" />
          참가 신청
        </button>
      </div>
    </div>
  );
};

export default MatchDetail;
