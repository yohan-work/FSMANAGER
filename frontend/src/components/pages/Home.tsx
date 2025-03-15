import { Link, useNavigate } from "react-router-dom";
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
  FiPlus,
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
  // 마커를 상태가 아닌 ref로 관리하여 무한 렌더링 방지
  const markersRef = useRef<KakaoMarker[]>([]);
  const [mapError, setMapError] = useState<string | null>(null);
  const navigate = useNavigate();

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

      try {
        console.log("카카오맵 로드 시작");

        // 카카오맵 API가 로드되었는지 확인
        if (
          typeof window.kakao === "undefined" ||
          typeof window.kakao.maps === "undefined"
        ) {
          console.error("카카오맵 API가 로드되지 않았습니다.");
          setMapError(
            "카카오맵 API를 로드할 수 없습니다. 카카오 개발자 사이트에서 현재 도메인(-)이 등록되어 있는지 확인해주세요."
          );
          return;
        }

        // 카카오맵 API 로드
        if (typeof window.kakao.maps.load === "function") {
          window.kakao.maps.load(() => {
            // 약간의 지연 후 맵 생성 (DOM이 완전히 렌더링된 후)
            setTimeout(() => {
              createMap();
            }, 100);
          });
        } else {
          // 이미 로드된 경우 바로 맵 생성
          // 약간의 지연 후 맵 생성 (DOM이 완전히 렌더링된 후)
          setTimeout(() => {
            createMap();
          }, 100);
        }
      } catch (error) {
        console.error("카카오맵 로드 오류:", error);
        setMapError(
          `카카오맵 로드 중 오류가 발생했습니다: ${
            error instanceof Error ? error.message : "알 수 없는 오류"
          }`
        );
      }
    };

    // 맵 생성 함수
    const createMap = () => {
      try {
        if (!mapRef.current) {
          console.error("맵 컨테이너가 없습니다.");
          return;
        }

        const containerWidth = mapRef.current.clientWidth;
        const containerHeight = mapRef.current.clientHeight;

        console.log("맵 컨테이너 크기:", containerWidth, containerHeight);

        // 컨테이너 크기가 유효하지 않으면 고정 크기 설정 후 다시 시도
        if (containerWidth <= 0 || containerHeight <= 0) {
          console.log(
            "맵 컨테이너 크기가 유효하지 않습니다. 고정 크기 설정 후 다시 시도합니다."
          );

          // 컨테이너에 명시적인 크기 설정
          if (mapRef.current) {
            // 모바일 여부 확인
            const isMobile = window.innerWidth < 768;

            // 모바일이면 전체 화면 크기, 데스크톱이면 계산된 크기
            const width = isMobile
              ? window.innerWidth
              : window.innerWidth - 420;
            const height = window.innerHeight;

            // 인라인 스타일로 명시적 크기 설정
            mapRef.current.style.width = `${width}px`;
            mapRef.current.style.height = `${height}px`;

            console.log("맵 컨테이너 크기 설정:", width, height);
          }

          // 약간의 지연 후 다시 시도
          setTimeout(createMap, 100);
          return;
        }

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

            // 중앙 위치 재설정
            kakaoMap.setCenter(new window.kakao.maps.LatLng(37.504, 127.049));

            // 지도 타일 강제 로드를 위한 레벨 변경 트릭
            const currentLevel = kakaoMap.getLevel();
            kakaoMap.setLevel(currentLevel + 1);
            setTimeout(() => {
              kakaoMap.setLevel(currentLevel);
            }, 100);
          }
        }, 500);
      } catch (error) {
        console.error("카카오맵 초기화 오류:", error);
        setMapError(
          `카카오맵 초기화 중 오류가 발생했습니다: ${
            error instanceof Error ? error.message : "알 수 없는 오류"
          }`
        );
      }
    };

    // 카카오맵 API가 로드되었는지 확인하고 초기화
    let attempts = 0;
    const maxAttempts = 10; // 5초 동안 시도 (500ms 간격)

    const checkKakaoAndInitialize = () => {
      attempts++;
      console.log(`카카오맵 API 확인 시도 ${attempts}/${maxAttempts}`);

      // window.kakao 객체가 존재하는지 더 정확하게 확인
      if (
        typeof window.kakao !== "undefined" &&
        typeof window.kakao.maps !== "undefined"
      ) {
        console.log("카카오맵 API가 로드되었습니다.");
        initializeMap();
      } else if (attempts < maxAttempts) {
        console.log("카카오맵 API 로드 대기 중...");
        // 500ms 후에 다시 확인
        setTimeout(checkKakaoAndInitialize, 500);
      } else {
        console.error("카카오맵 API 로드 시간 초과");
        setMapError(
          "카카오맵 API 로드 시간이 초과되었습니다. 카카오 개발자 사이트에서 현재 도메인(-)이 등록되어 있는지 확인하고, 페이지를 새로고침해주세요."
        );
      }
    };

    // 초기화 시작 - 약간의 지연 후 시작 (스크립트 로드 시간 확보)
    setTimeout(checkKakaoAndInitialize, 1000);

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

        // 지도 크기 재설정
        map.relayout();

        // 중앙 위치 복원
        map.setCenter(center);

        // 지도 타일 강제 로드를 위한 레벨 변경 트릭
        const currentLevel = map.getLevel();
        map.setLevel(currentLevel + 1);
        setTimeout(() => {
          map.setLevel(currentLevel);
        }, 100);
      }
    };

    // 초기 실행
    handleResize();

    // 이벤트 리스너 등록
    window.addEventListener("resize", handleResize);

    // 뷰 모드 변경 시에도 지도 크기 재설정
    const resizeObserver = new ResizeObserver(() => {
      handleResize();
    });

    if (mapRef.current) {
      resizeObserver.observe(mapRef.current);
    }

    return () => {
      window.removeEventListener("resize", handleResize);
      if (mapRef.current) {
        resizeObserver.unobserve(mapRef.current);
      }
      resizeObserver.disconnect();
    };
  }, [map]);

  // 뷰 모드 변경 시 지도 크기 재설정
  useEffect(() => {
    if (!map) return;

    // 약간의 지연 후 지도 크기 재설정 (DOM 업데이트 후)
    const timer = setTimeout(() => {
      if (map.relayout) {
        console.log("뷰 모드 변경으로 지도 크기 재설정");

        // 맵 컨테이너 크기 확인
        if (mapRef.current) {
          const containerWidth = mapRef.current.clientWidth;
          const containerHeight = mapRef.current.clientHeight;
          console.log(
            "뷰 모드 변경 후 맵 컨테이너 크기:",
            containerWidth,
            containerHeight
          );

          // 컨테이너 크기가 유효하지 않으면 고정 크기 설정
          if (containerWidth <= 0 || containerHeight <= 0) {
            console.log(
              "맵 컨테이너 크기가 유효하지 않습니다. 고정 크기 설정 후 재시도합니다."
            );

            // 모바일 여부 확인
            const isMobile = window.innerWidth < 768;

            // 모바일이면 전체 화면 크기, 데스크톱이면 계산된 크기
            const width = isMobile
              ? window.innerWidth
              : window.innerWidth - 420;
            const height = window.innerHeight;

            // 인라인 스타일로 명시적 크기 설정
            mapRef.current.style.width = `${width}px`;
            mapRef.current.style.height = `${height}px`;

            console.log("맵 컨테이너 크기 설정:", width, height);

            // 추가 지연 후 재시도
            setTimeout(() => {
              if (map.relayout) {
                const center = map.getCenter();
                map.relayout();
                map.setCenter(center);
              }
            }, 100);
            return;
          }
        }

        const center = map.getCenter();
        map.relayout();
        map.setCenter(center);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [viewMode, map]);

  // 마커 생성 로직 수정
  useEffect(() => {
    if (map && nearbyMatches.length > 0 && window.kakao && window.kakao.maps) {
      // 기존 마커 제거
      markersRef.current.forEach((marker) => marker.setMap(null));
      markersRef.current = [];

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

      // 마커를 ref에 저장
      markersRef.current = newMarkers;
    }
  }, [map, nearbyMatches]); // markers 의존성 제거

  return (
    <div className="flex flex-col h-screen">
      {/* 헤더 */}
      <div className="bg-white border-b">
        <div className="max-w-screen-xl mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-bold">매치</h1>
            </div>
            <button
              onClick={() => navigate("/matches/create")}
              className="bg-[#3182F6] text-white px-4 py-2 rounded-lg font-medium hover:bg-[#1B64DA] transition-colors"
            >
              <div className="flex items-center space-x-1">
                <FiPlus />
                <span>매치 만들기</span>
              </div>
            </button>
          </div>
        </div>
      </div>

      <div className="relative flex h-screen w-full overflow-hidden">
        {/* 메인 컨텐츠 영역 - 좌측 고정 너비 */}
        <div
          className={`
            ${viewMode === "map" ? "hidden md:block" : "block"} 
            w-full md:w-[420px] md:min-w-[420px] md:max-w-[420px]
            overflow-auto pb-16 md:pb-0 h-full
            bg-[#f9fafb] z-10
            flex-shrink-0
          `}
        >
          {/* Header - Toss-inspired */}
          <div className="bg-white sticky top-0 z-10 px-5 py-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="font-bold text-[#191F28] text-lg">
                  FS MANAGER
                </span>
              </div>
              <div className="flex space-x-4">
                <button className="text-[#ffffff] hover:bg-[#f1f3f5] p-2 rounded-full">
                  <FiSearch size={20} />
                </button>
                <button className="text-[#ffffff] hover:bg-[#f1f3f5] p-2 rounded-full">
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
            <button className="text-[#fff] text-sm font-medium hover:underline">
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
              <h2 className="text-lg font-bold text-[#191F28] mb-4">
                빠른 메뉴
              </h2>
              <div className="grid grid-cols-4 gap-4">
                <Link
                  to="/matches/nearby"
                  className="flex flex-col items-center"
                >
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
                <Link
                  to="/matches/create"
                  className="flex flex-col items-center"
                >
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
                  <span className="text-xs text-[#333D4B] font-medium">
                    정산
                  </span>
                </Link>
              </div>
            </div>

            {/* Nearby matches - Toss-inspired */}
            <div className="bg-white rounded-2xl shadow-sm p-5 mb-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-[#191F28]">
                  내 주변 매치
                </h2>
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
            fixed md:static 
            top-0 left-0 right-0 bottom-0 
            w-full md:w-[calc(100%-420px)]
            h-full
            z-0 md:z-5
          `}
          style={{ minHeight: "100%", backgroundColor: "#000" }}
        >
          {mapError ? (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100 p-4">
              <div className="bg-white rounded-lg shadow-md p-6 max-w-md text-center">
                <div className="text-red-500 mb-4 text-5xl flex justify-center">
                  <FiMapPin />
                </div>
                <h3 className="text-lg font-bold text-red-500 mb-2">
                  카카오맵 로드 오류
                </h3>
                <p className="text-gray-700 mb-4">{mapError}</p>
                <div className="text-sm text-gray-500 mb-4">
                  <p className="mb-2">문제 해결 방법:</p>
                  <ul className="text-left list-disc pl-5">
                    <li>
                      카카오 개발자 사이트에서 현재 도메인(-)이 등록되어 있는지
                      확인하세요.
                    </li>
                    <li>API 키가 올바른지 확인하세요.</li>
                    <li>브라우저 콘솔에서 추가 오류 메시지를 확인하세요.</li>
                  </ul>
                </div>
                <button
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
                  onClick={() => window.location.reload()}
                >
                  페이지 새로고침
                </button>
              </div>
            </div>
          ) : (
            <div
              ref={mapRef}
              id="kakao-map"
              className="w-full h-full"
              style={{
                width: "100%",
                height: "100%",
                backgroundColor: "#f8f9fa",
                position: "relative",
              }}
            />
          )}

          {/* 지도 위에 떠 있는 검색 바 */}
          <div className="absolute top-4 left-0 right-0 mx-auto w-[90%] max-w-md z-10">
            <div className="bg-white rounded-full shadow-md px-4 py-3 flex items-center">
              <FiSearch className="text-[#3182F6] mr-3" size={20} />
              <input
                type="text"
                placeholder="풋살장, 지역명 검색"
                className="flex-1 outline-none text-[#191F28] bg-transparent"
              />
            </div>
          </div>

          {/* 지도 컨트롤 버튼 */}
          <div className="absolute bottom-24 right-4 flex flex-col space-y-2 z-10">
            <button
              className="bg-white rounded-full w-12 h-12 shadow-md flex items-center justify-center text-[#191F28] text-xl font-bold"
              onClick={() => map && map.setLevel(map.getLevel() - 1)}
            >
              +
            </button>
            <button
              className="bg-white rounded-full w-12 h-12 shadow-md flex items-center justify-center text-[#191F28] text-xl font-bold"
              onClick={() => map && map.setLevel(map.getLevel() + 1)}
            >
              -
            </button>
            <button
              className="bg-white rounded-full w-12 h-12 shadow-md flex items-center justify-center"
              onClick={() => {
                // 현재 위치로 이동하는 기능 (실제로는 고정 위치로 이동)
                if (map) {
                  map.setCenter(new window.kakao.maps.LatLng(37.504, 127.049));
                }
              }}
            >
              <FiMapPin className="text-[#3182F6]" size={20} />
            </button>
          </div>
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
