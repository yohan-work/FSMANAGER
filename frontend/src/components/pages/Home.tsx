import { Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import {
  FiMapPin,
  FiUsers,
  FiCalendar,
  FiMessageCircle,
  FiCreditCard,
  FiSearch,
  FiList,
  FiMap,
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
  getCenter: () => any; // 타입 오류 해결을 위해 추가
  getLevel: () => number;
  setLevel: (level: number) => void;
  relayout: () => void; // 지도 크기 재설정을 위해 추가
}

interface KakaoMarker {
  setMap: (map: KakaoMap | null) => void;
}

interface Match {
  id: number;
  title: string;
  location: string;
  distance: string;
  time: string;
  price: string;
  teamName: string;
  level: string;
  lat?: number;
  lng?: number;
}

const Home = () => {
  const [nearbyMatches, setNearbyMatches] = useState<Match[]>([]);
  const [location, setLocation] = useState<string>("로딩 중...");
  const [viewMode, setViewMode] = useState<"list" | "map">("list");
  const mapRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [map, setMap] = useState<KakaoMap | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [markers, setMarkers] = useState<KakaoMarker[]>([]);
  const [mapError, setMapError] = useState<string | null>(null);

  // 화면 크기에 따라 기본 뷰 모드 설정 (모바일에서만 사용)
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        // 모바일에서만 뷰 모드 전환 가능
      } else {
        // 데스크톱에서는 항상 리스트 뷰 (지도는 우측에 고정)
        setViewMode("list");
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Mock data for demonstration
  useEffect(() => {
    // In a real app, this would be fetched from your API
    setNearbyMatches([
      {
        id: 1,
        title: "주말 5:5 풋살 한 팀 구해요",
        location: "서울 강남구 삼성동",
        distance: "0.8km",
        time: "토요일 오후 3시",
        price: "10,000원",
        teamName: "FC 강남",
        level: "중급",
        lat: 37.508,
        lng: 127.056,
      },
      {
        id: 2,
        title: "평일 저녁 친선 경기 팀 모집",
        location: "서울 강남구 역삼동",
        distance: "1.2km",
        time: "수요일 오후 7시",
        price: "15,000원",
        teamName: "역삼 유나이티드",
        level: "초급",
        lat: 37.501,
        lng: 127.037,
      },
      {
        id: 3,
        title: "주말 아침 풋살 정기모임",
        location: "서울 서초구 반포동",
        distance: "2.5km",
        time: "일요일 오전 9시",
        price: "12,000원",
        teamName: "반포FC",
        level: "상급",
        lat: 37.504,
        lng: 127.02,
      },
    ]);

    // Simulate getting user location
    setTimeout(() => setLocation("서울 강남구"), 1000);
  }, []);

  // 카카오맵 초기화
  useEffect(() => {
    // 이미 맵이 로드되었으면 중복 로드 방지
    if (map) return;

    console.log("카카오맵 초기화 시작", { mapRef: !!mapRef.current });

    // 맵 초기화 함수
    const initializeMap = () => {
      if (!mapRef.current) {
        console.error("맵 컨테이너가 없습니다.");
        setMapError("맵 컨테이너를 찾을 수 없습니다.");
        return;
      }

      if (!window.kakao || !window.kakao.maps) {
        console.error("카카오맵 API가 로드되지 않았습니다.");
        setMapError(
          "카카오맵 API를 로드할 수 없습니다. 잠시 후 다시 시도해주세요."
        );
        return;
      }

      try {
        console.log("카카오맵 로드 시작");
        window.kakao.maps.load(() => {
          try {
            // 맵 옵션 설정
            const options = {
              center: new window.kakao.maps.LatLng(37.504, 127.049),
              level: 5,
            };

            // 맵 생성
            const kakaoMap = new window.kakao.maps.Map(mapRef.current, options);
            console.log("카카오맵 생성 완료");

            // 맵 상태 저장
            setMap(kakaoMap);

            // 지도 크기 재설정 (지도가 보이지 않는 문제 해결)
            setTimeout(() => {
              if (kakaoMap && kakaoMap.relayout) {
                console.log("지도 크기 재설정");
                kakaoMap.relayout();
              }
            }, 500);
          } catch (error) {
            console.error("카카오맵 초기화 오류:", error);
            setMapError("카카오맵 초기화 중 오류가 발생했습니다.");
          }
        });
      } catch (error) {
        console.error("카카오맵 로드 오류:", error);
        setMapError("카카오맵 로드 중 오류가 발생했습니다.");
      }
    };

    // 카카오맵 API가 로드되었는지 확인하고 초기화
    const checkKakaoAndInitialize = () => {
      if (window.kakao && window.kakao.maps) {
        console.log("카카오맵 API가 이미 로드되어 있습니다.");
        initializeMap();
      } else {
        console.log("카카오맵 API 로드 대기 중...");
        // 1초 후에 다시 확인
        setTimeout(checkKakaoAndInitialize, 1000);
      }
    };

    // 초기화 시작
    checkKakaoAndInitialize();

    // 컴포넌트 언마운트 시 정리
    return () => {
      // 맵 정리 로직이 필요하면 여기에 추가
    };
  }, [map]);

  // 지도 컨테이너 크기 변경 감지
  useEffect(() => {
    if (!map) return;

    const handleResize = () => {
      if (map && map.relayout) {
        // 지도 크기 변경 시 중앙 위치 유지
        const center = map.getCenter();
        map.relayout();
        map.setCenter(center);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [map]);

  // 마커 생성
  useEffect(() => {
    if (map && nearbyMatches.length > 0 && window.kakao && window.kakao.maps) {
      // 기존 마커 제거
      markers.forEach((marker) => marker.setMap(null));

      // 새 마커 생성
      const newMarkers = nearbyMatches
        .map((match) => {
          if (match.lat && match.lng) {
            const position = new window.kakao.maps.LatLng(match.lat, match.lng);

            // 커스텀 마커 이미지
            const imageSrc =
              "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png";
            const imageSize = new window.kakao.maps.Size(24, 35);
            const markerImage = new window.kakao.maps.MarkerImage(
              imageSrc,
              imageSize
            );

            const marker = new window.kakao.maps.Marker({
              map: map,
              position: position,
              title: match.title,
              image: markerImage,
            });

            // 마커 클릭 이벤트
            window.kakao.maps.event.addListener(marker, "click", () => {
              // 마커 클릭 시 해당 매치 상세 페이지로 이동
              window.location.href = `/matches/${match.id}`;
            });

            return marker;
          }
          return null;
        })
        .filter(Boolean);

      setMarkers(newMarkers);
    }
  }, [map, nearbyMatches, markers]);

  return (
    <div className="relative flex h-screen">
      {/* 메인 컨텐츠 영역 - 좌측 고정 너비 */}
      <div
        className={`
          ${viewMode === "map" ? "hidden md:block" : "block"} 
          w-full md:w-auto md:min-w-[420px] md:max-w-[420px]
          overflow-auto pb-16 md:pb-0 h-full
          bg-[#f9fafb] z-10
        `}
      >
        {/* Header - Toss-inspired */}
        <div className="bg-white sticky top-0 z-10 px-5 py-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="font-bold text-[#191F28] text-lg">풋살매치</span>
            </div>
            <div className="flex space-x-4">
              <button className="text-[#191F28] hover:bg-[#f1f3f5] p-2 rounded-full">
                <FiSearch size={20} />
              </button>
              <button className="text-[#191F28] hover:bg-[#f1f3f5] p-2 rounded-full">
                <FiMessageCircle size={20} />
              </button>
              {/* 모바일에서만 보이는 지도/목록 전환 버튼 */}
              <div className="md:hidden flex border border-gray-200 rounded-lg overflow-hidden">
                <button
                  className={`p-2 ${
                    viewMode === "list"
                      ? "bg-[#3182F6] text-white"
                      : "bg-white text-[#4E5968]"
                  }`}
                  onClick={() => setViewMode("list")}
                >
                  <FiList size={18} />
                </button>
                <button
                  className={`p-2 ${
                    viewMode === "map"
                      ? "bg-[#3182F6] text-white"
                      : "bg-white text-[#4E5968]"
                  }`}
                  onClick={() => setViewMode("map")}
                >
                  <FiMap size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Location Bar */}
        <div className="bg-white px-5 py-3 flex items-center justify-between border-b border-gray-100">
          <div className="flex items-center space-x-2">
            <FiMapPin className="text-[#3182F6]" />
            <span className="font-medium text-[#191F28]">{location}</span>
          </div>
          <button className="text-[#3182F6] text-sm font-medium hover:underline">
            변경
          </button>
        </div>

        {/* Main content */}
        <div className="px-5 py-6">
          {/* Balance Card - Toss-inspired */}
          <div className="bg-white rounded-2xl shadow-sm p-5 mb-6">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-bold text-[#191F28]">내 활동</h2>
              <Link
                to="/profile"
                className="text-[#3182F6] text-sm font-medium hover:underline"
              >
                전체보기
              </Link>
            </div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-[#EBF5FF] rounded-full flex items-center justify-center">
                <FiUsers className="text-[#3182F6]" size={18} />
              </div>
              <div>
                <p className="text-[#191F28] font-medium">내 팀</p>
                <p className="text-[#4E5968] text-sm">
                  2개의 팀에 소속되어 있습니다
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-[#E7F9F1] rounded-full flex items-center justify-center">
                <FiCalendar className="text-[#20C997]" size={18} />
              </div>
              <div>
                <p className="text-[#191F28] font-medium">예정된 매치</p>
                <p className="text-[#4E5968] text-sm">
                  다가오는 매치가 없습니다
                </p>
              </div>
            </div>
          </div>

          {/* Quick action buttons - Toss-inspired */}
          <div className="bg-white rounded-2xl shadow-sm p-5 mb-6">
            <h2 className="text-lg font-bold text-[#191F28] mb-4">빠른 메뉴</h2>
            <div className="grid grid-cols-4 gap-4">
              <Link to="/matches/nearby" className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-[#EBF5FF] flex items-center justify-center mb-1 shadow-sm">
                  <FiMapPin className="text-[#3182F6]" size={18} />
                </div>
                <span className="text-xs text-[#333D4B] font-medium">
                  주변 매치
                </span>
              </Link>
              <Link to="/teams" className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-[#E7F9F1] flex items-center justify-center mb-1 shadow-sm">
                  <FiUsers className="text-[#20C997]" size={18} />
                </div>
                <span className="text-xs text-[#333D4B] font-medium">
                  팀 관리
                </span>
              </Link>
              <Link to="/matches/create" className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-[#FFF5EB] flex items-center justify-center mb-1 shadow-sm">
                  <FiCalendar className="text-[#FF922B]" size={18} />
                </div>
                <span className="text-xs text-[#333D4B] font-medium">
                  매치 생성
                </span>
              </Link>
              <Link to="/payments" className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-[#F3F0FF] flex items-center justify-center mb-1 shadow-sm">
                  <FiCreditCard className="text-[#845EF7]" size={18} />
                </div>
                <span className="text-xs text-[#333D4B] font-medium">정산</span>
              </Link>
            </div>
          </div>

          {/* Nearby matches - Toss-inspired */}
          <div className="bg-white rounded-2xl shadow-sm p-5 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-[#191F28]">내 주변 매치</h2>
              <Link
                to="/matches/nearby"
                className="text-[#3182F6] text-sm font-medium hover:underline"
              >
                더보기
              </Link>
            </div>

            <div className="space-y-4">
              {nearbyMatches.map((match) => (
                <Link
                  to={`/matches/${match.id}`}
                  key={match.id}
                  className="block"
                >
                  <div className="border border-gray-200 rounded-xl p-4 hover:border-[#3182F6] hover:shadow-sm transition-all">
                    <div className="flex justify-between items-start">
                      <h3 className="font-medium text-[#191F28]">
                        {match.title}
                      </h3>
                      <span className="text-sm text-[#3182F6] font-medium">
                        {match.distance}
                      </span>
                    </div>
                    <div className="mt-2 text-sm text-[#4E5968]">
                      {match.location}
                    </div>
                    <div className="mt-1 text-sm text-[#4E5968]">
                      {match.time}
                    </div>
                    <div className="mt-3 flex justify-between items-center">
                      <span className="text-sm font-medium text-[#191F28]">
                        {match.price}
                      </span>
                      <div className="px-2 py-1 bg-[#F1F3F5] rounded-full text-xs font-medium text-[#333D4B]">
                        {match.level}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 지도 영역 - 모바일에서는 전체 화면, 데스크톱에서는 우측 영역 (남은 공간 전체) */}
      <div
        className={`
          ${viewMode === "list" ? "hidden md:block" : "block"} 
          fixed md:relative 
          top-0 left-0 right-0 bottom-0 
          w-full md:flex-1
          h-full
          z-0 md:z-5
        `}
        style={{ minHeight: "100%" }}
      >
        {mapError ? (
          <div className="w-full h-full flex items-center justify-center bg-gray-100 text-red-500">
            <p>{mapError}</p>
          </div>
        ) : (
          <div
            ref={mapRef}
            className="w-full h-full bg-gray-100"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
            }}
          />
        )}

        {/* 지도 위에 떠 있는 검색 바 */}
        <div className="absolute top-4 left-0 right-0 mx-auto w-[90%] max-w-md z-10">
          <div className="bg-white rounded-full shadow-md p-3 flex items-center">
            <FiSearch className="text-[#3182F6] ml-2 mr-3" />
            <input
              type="text"
              placeholder="풋살장, 지역명 검색"
              className="flex-1 outline-none text-[#191F28]"
            />
          </div>
        </div>

        {/* 지도 컨트롤 버튼 */}
        <div className="absolute bottom-24 right-4 flex flex-col space-y-2 z-10">
          <button
            className="bg-white rounded-full w-10 h-10 shadow-md flex items-center justify-center text-[#191F28]"
            onClick={() => map && map.setLevel(map.getLevel() - 1)}
          >
            +
          </button>
          <button
            className="bg-white rounded-full w-10 h-10 shadow-md flex items-center justify-center text-[#191F28]"
            onClick={() => map && map.setLevel(map.getLevel() + 1)}
          >
            -
          </button>
          <button className="bg-white rounded-full w-10 h-10 shadow-md flex items-center justify-center">
            <FiMapPin className="text-[#3182F6]" />
          </button>
        </div>
      </div>

      {/* Bottom navigation - Toss-inspired */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t py-3 px-4 shadow-md z-20">
        <div className="flex justify-around">
          <Link to="/" className="flex flex-col items-center">
            <FiMapPin className="text-[#3182F6] mb-1" size={20} />
            <span className="text-xs text-[#3182F6] font-medium">홈</span>
          </Link>
          <Link to="/matches" className="flex flex-col items-center">
            <FiCalendar className="text-[#4E5968] mb-1" size={20} />
            <span className="text-xs text-[#4E5968] font-medium">매치</span>
          </Link>
          <Link to="/teams" className="flex flex-col items-center">
            <FiUsers className="text-[#4E5968] mb-1" size={20} />
            <span className="text-xs text-[#4E5968] font-medium">팀</span>
          </Link>
          <Link to="/chat" className="flex flex-col items-center">
            <FiMessageCircle className="text-[#4E5968] mb-1" size={20} />
            <span className="text-xs text-[#4E5968] font-medium">채팅</span>
          </Link>
          <Link to="/profile" className="flex flex-col items-center">
            <div className="w-5 h-5 bg-[#E7E7E7] rounded-full mb-1 border border-[#D1D6DB]"></div>
            <span className="text-xs text-[#4E5968] font-medium">프로필</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
