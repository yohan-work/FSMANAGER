import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiArrowLeft,
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiSettings,
  FiChevronRight,
  FiHeart,
  FiClock,
  FiShield,
} from "react-icons/fi";

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  location: string;
  level: string;
  profileImage: string;
  stats: {
    totalMatches: number;
    winRate: number;
    mvpCount: number;
    mannerScore: number;
  };
  recentActivities: {
    type: string;
    title: string;
    date: string;
  }[];
}

const Profile = () => {
  const navigate = useNavigate();
  const [profile] = useState<UserProfile>({
    name: "김축구",
    email: "football@example.com",
    phone: "010-1234-5678",
    location: "서울특별시 강남구",
    level: "중급",
    profileImage: "https://via.placeholder.com/100",
    stats: {
      totalMatches: 25,
      winRate: 68,
      mvpCount: 5,
      mannerScore: 4.8,
    },
    recentActivities: [
      {
        type: "참여",
        title: "주말 친선 경기",
        date: "2024.03.15",
      },
      {
        type: "주최",
        title: "평일 저녁 풋살",
        date: "2024.03.12",
      },
      {
        type: "관심",
        title: "토요일 오전 매치",
        date: "2024.03.10",
      },
    ],
  });

  const menuItems = [
    {
      icon: <FiHeart className="text-[#3182F6]" />,
      title: "관심 매치",
      count: 5,
    },
    {
      icon: <FiClock className="text-[#3182F6]" />,
      title: "참여 내역",
      count: 12,
    },
    {
      icon: <FiShield className="text-[#3182F6]" />,
      title: "주최 내역",
      count: 3,
    },
  ];

  const settingsItems = [
    {
      icon: <FiUser className="text-[#3182F6]" />,
      title: "계정 정보",
    },
    {
      icon: <FiSettings className="text-[#3182F6]" />,
      title: "환경 설정",
    },
  ];

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      {/* 헤더 */}
      <div className="bg-white sticky top-0 z-10 px-5 py-4 border-b border-[#E5E7EB]">
        <div className="max-w-screen-xl mx-auto flex items-center space-x-4">
          <button
            onClick={() => navigate(-1)}
            className="text-[#191F28] hover:bg-[#F1F3F5] p-2 rounded-full transition-colors"
          >
            <FiArrowLeft size={20} />
          </button>
          <h1 className="text-xl font-bold text-[#191F28]">프로필</h1>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* 좌측 영역 */}
          <div className="md:w-1/3 space-y-4">
            {/* 프로필 정보 */}
            <div className="bg-white p-6 rounded-xl">
              <div className="flex items-center">
                <img
                  src={profile.profileImage}
                  alt="Profile"
                  className="w-20 h-20 rounded-full object-cover"
                />
                <div className="ml-4">
                  <h2 className="text-xl font-bold text-[#191F28]">
                    {profile.name}
                  </h2>
                  <div className="mt-1 flex items-center text-sm text-[#4E5968]">
                    <FiMapPin className="mr-1" />
                    <span>{profile.location}</span>
                  </div>
                  <div className="mt-2">
                    <span className="px-3 py-1 bg-[#EFF6FF] text-[#3182F6] rounded-full text-sm font-medium">
                      {profile.level}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                <div className="flex items-center text-sm text-[#4E5968]">
                  <FiMail className="mr-2" />
                  <span>{profile.email}</span>
                </div>
                <div className="flex items-center text-sm text-[#4E5968]">
                  <FiPhone className="mr-2" />
                  <span>{profile.phone}</span>
                </div>
              </div>
            </div>

            {/* 활동 내역 */}
            <div className="bg-white rounded-xl">
              {menuItems.map((item, index) => (
                <button
                  key={index}
                  className="w-full px-6 py-4 flex items-center justify-between border-b border-[#E5E7EB] last:border-b-0"
                  onClick={() => {
                    /* TODO: 각 메뉴 처리 */
                  }}
                >
                  <div className="flex items-center">
                    {item.icon}
                    <span className="ml-3 text-[#191F28]">{item.title}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="mr-2 text-[#4E5968]">{item.count}</span>
                    <FiChevronRight className="text-[#4E5968]" />
                  </div>
                </button>
              ))}
            </div>

            {/* 설정 */}
            <div className="bg-white rounded-xl">
              {settingsItems.map((item, index) => (
                <button
                  key={index}
                  className="w-full px-6 py-4 flex items-center justify-between border-b border-[#E5E7EB] last:border-b-0"
                  onClick={() => {
                    /* TODO: 각 설정 처리 */
                  }}
                >
                  <div className="flex items-center">
                    {item.icon}
                    <span className="ml-3 text-[#191F28]">{item.title}</span>
                  </div>
                  <FiChevronRight className="text-[#4E5968]" />
                </button>
              ))}
            </div>

            {/* 로그아웃 버튼 */}
            <button
              onClick={() => {
                /* TODO: 로그아웃 처리 */
              }}
              className="w-full py-3 text-[#4E5968] font-medium border border-[#E5E7EB] rounded-lg hover:bg-[#F1F3F5] transition-colors"
            >
              로그아웃
            </button>
          </div>

          {/* 우측 영역 */}
          <div className="md:flex-1 space-y-4">
            {/* 통계 */}
            <div className="bg-white p-6 rounded-xl">
              <h3 className="text-lg font-bold text-[#191F28] mb-4">
                활동 통계
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 bg-[#F8F9FA] rounded-lg">
                  <div className="text-[#4E5968] text-sm mb-1">총 매치</div>
                  <div className="text-xl font-bold text-[#191F28]">
                    {profile.stats.totalMatches}회
                  </div>
                </div>
                <div className="p-4 bg-[#F8F9FA] rounded-lg">
                  <div className="text-[#4E5968] text-sm mb-1">승률</div>
                  <div className="text-xl font-bold text-[#191F28]">
                    {profile.stats.winRate}%
                  </div>
                </div>
                <div className="p-4 bg-[#F8F9FA] rounded-lg">
                  <div className="text-[#4E5968] text-sm mb-1">MVP</div>
                  <div className="text-xl font-bold text-[#191F28]">
                    {profile.stats.mvpCount}회
                  </div>
                </div>
                <div className="p-4 bg-[#F8F9FA] rounded-lg">
                  <div className="text-[#4E5968] text-sm mb-1">매너 점수</div>
                  <div className="text-xl font-bold text-[#191F28]">
                    {profile.stats.mannerScore}
                  </div>
                </div>
              </div>
            </div>

            {/* 최근 활동 */}
            <div className="bg-white p-6 rounded-xl">
              <h3 className="text-lg font-bold text-[#191F28] mb-4">
                최근 활동
              </h3>
              <div className="space-y-4">
                {profile.recentActivities.map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-[#F8F9FA] rounded-lg"
                  >
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-[#EFF6FF] rounded-full flex items-center justify-center">
                        {activity.type === "참여" && (
                          <FiClock className="text-[#3182F6]" />
                        )}
                        {activity.type === "주최" && (
                          <FiShield className="text-[#3182F6]" />
                        )}
                        {activity.type === "관심" && (
                          <FiHeart className="text-[#3182F6]" />
                        )}
                      </div>
                      <div className="ml-3">
                        <div className="text-sm text-[#4E5968]">
                          {activity.type}
                        </div>
                        <div className="font-medium text-[#191F28]">
                          {activity.title}
                        </div>
                      </div>
                    </div>
                    <div className="text-sm text-[#4E5968]">
                      {activity.date}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
