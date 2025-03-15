import { useState } from "react";
import { Link } from "react-router-dom";
import { FiMapPin, FiCalendar, FiFilter, FiChevronRight } from "react-icons/fi";

interface Match {
  id: number;
  title: string;
  location: string;
  distance: string;
  time: string;
  price: string;
  teamName: string;
  level: string;
}

const MatchList = () => {
  const [matches] = useState<Match[]>([
    {
      id: 1,
      title: "주말 5:5 풋살 한 팀 구해요",
      location: "서울 강남구 삼성동",
      distance: "0.8km",
      time: "토요일 오후 3시",
      price: "10,000원",
      teamName: "FC 강남",
      level: "중급",
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
    },
  ]);

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      {/* 헤더 */}
      <div className="bg-white sticky top-0 z-10 px-5 py-4 border-b border-[#E5E7EB]">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-[#191F28]">매치</h1>
          <button className="text-[#4E5968] hover:bg-[#F1F3F5] p-2 rounded-full transition-colors">
            <FiFilter size={20} />
          </button>
        </div>
      </div>

      {/* 필터 영역 */}
      <div className="bg-white border-b border-[#E5E7EB]">
        <div className="flex overflow-x-auto py-2 px-4 space-x-2 whitespace-nowrap">
          <button className="px-4 py-2 rounded-full bg-[#EFF6FF] text-[#3182F6] font-medium text-sm">
            전체
          </button>
          <button className="px-4 py-2 rounded-full border border-[#E5E7EB] text-[#4E5968] font-medium text-sm">
            오늘
          </button>
          <button className="px-4 py-2 rounded-full border border-[#E5E7EB] text-[#4E5968] font-medium text-sm">
            이번 주
          </button>
          <button className="px-4 py-2 rounded-full border border-[#E5E7EB] text-[#4E5968] font-medium text-sm">
            다음 주
          </button>
          <button className="px-4 py-2 rounded-full border border-[#E5E7EB] text-[#4E5968] font-medium text-sm">
            초급
          </button>
          <button className="px-4 py-2 rounded-full border border-[#E5E7EB] text-[#4E5968] font-medium text-sm">
            중급
          </button>
          <button className="px-4 py-2 rounded-full border border-[#E5E7EB] text-[#4E5968] font-medium text-sm">
            상급
          </button>
        </div>
      </div>

      {/* 매치 목록 */}
      <div className="p-4 space-y-4">
        {matches.map((match) => (
          <Link
            to={`/matches/${match.id}`}
            key={match.id}
            className="block bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start">
              <h3 className="font-medium text-[#191F28]">{match.title}</h3>
              <FiChevronRight className="text-[#4E5968]" />
            </div>
            <div className="mt-2 flex items-center text-sm text-[#4E5968]">
              <FiMapPin className="mr-1" />
              <span>{match.location}</span>
              <span className="mx-2">•</span>
              <span>{match.distance}</span>
            </div>
            <div className="mt-1 flex items-center text-sm text-[#4E5968]">
              <FiCalendar className="mr-1" />
              <span>{match.time}</span>
            </div>
            <div className="mt-3 flex justify-between items-center">
              <span className="font-medium text-[#191F28]">{match.price}</span>
              <div className="px-2 py-1 bg-[#F1F3F5] rounded-full text-xs font-medium text-[#333D4B]">
                {match.level}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* 매치 생성 버튼 */}
      <div className="fixed bottom-20 right-4">
        <Link
          to="/matches/create"
          className="bg-[#3182F6] text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center text-2xl hover:bg-[#1B64DA] transition-colors"
        >
          +
        </Link>
      </div>
    </div>
  );
};

export default MatchList;
