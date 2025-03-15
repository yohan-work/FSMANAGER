import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft, FiMapPin, FiInfo } from "react-icons/fi";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ko } from "date-fns/locale";

interface FormData {
  title: string;
  location: string;
  date: Date | null;
  startTime: string;
  endTime: string;
  price: string;
  maxParticipants: string;
  level: string;
  description: string;
  teamName: string;
}

const CreateMatch = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    title: "",
    location: "",
    date: null,
    startTime: "",
    endTime: "",
    price: "",
    maxParticipants: "",
    level: "",
    description: "",
    teamName: "",
  });

  const levels = ["초급", "중급", "상급"];
  const times = Array.from(
    { length: 24 },
    (_, i) => `${String(i).padStart(2, "0")}:00`
  );

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (date: Date | null) => {
    setFormData((prev) => ({ ...prev, date }));
  };

  const handleSubmit = () => {
    // TODO: API 연동
    console.log(formData);
    navigate("/");
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="block text-sm font-medium text-[#4E5968]">
          매치 제목
        </label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleInputChange}
          placeholder="예) 주말 친선 경기 한 팀 모집합니다"
          className="w-full px-4 py-3 rounded-lg border border-[#E5E7EB] focus:border-[#3182F6] focus:ring-1 focus:ring-[#3182F6] outline-none transition-colors"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-[#4E5968]">
          장소 선택
        </label>
        <div className="relative">
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleInputChange}
            placeholder="매치 장소를 선택해주세요"
            className="w-full px-4 py-3 rounded-lg border border-[#E5E7EB] focus:border-[#3182F6] focus:ring-1 focus:ring-[#3182F6] outline-none transition-colors"
          />
          <FiMapPin className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#3182F6]" />
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-[#4E5968]">
          날짜 선택
        </label>
        <DatePicker
          selected={formData.date}
          onChange={handleDateChange}
          locale={ko}
          dateFormat="yyyy년 MM월 dd일"
          minDate={new Date()}
          placeholderText="날짜를 선택해주세요"
          className="w-full px-4 py-3 rounded-lg border border-[#E5E7EB] focus:border-[#3182F6] focus:ring-1 focus:ring-[#3182F6] outline-none transition-colors"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-[#4E5968]">
            시작 시간
          </label>
          <select
            name="startTime"
            value={formData.startTime}
            onChange={handleInputChange}
            className="w-full px-4 py-3 rounded-lg border border-[#E5E7EB] focus:border-[#3182F6] focus:ring-1 focus:ring-[#3182F6] outline-none transition-colors"
          >
            <option value="">선택해주세요</option>
            {times.map((time) => (
              <option key={time} value={time}>
                {time}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-[#4E5968]">
            종료 시간
          </label>
          <select
            name="endTime"
            value={formData.endTime}
            onChange={handleInputChange}
            className="w-full px-4 py-3 rounded-lg border border-[#E5E7EB] focus:border-[#3182F6] focus:ring-1 focus:ring-[#3182F6] outline-none transition-colors"
          >
            <option value="">선택해주세요</option>
            {times.map((time) => (
              <option key={time} value={time}>
                {time}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="block text-sm font-medium text-[#4E5968]">
          참가비
        </label>
        <div className="relative">
          <input
            type="text"
            name="price"
            value={formData.price}
            onChange={handleInputChange}
            placeholder="참가비를 입력해주세요"
            className="w-full px-4 py-3 pl-8 rounded-lg border border-[#E5E7EB] focus:border-[#3182F6] focus:ring-1 focus:ring-[#3182F6] outline-none transition-colors"
          />
          <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#3182F6]">
            ₩
          </span>
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-[#4E5968]">
          모집 인원
        </label>
        <select
          name="maxParticipants"
          value={formData.maxParticipants}
          onChange={handleInputChange}
          className="w-full px-4 py-3 rounded-lg border border-[#E5E7EB] focus:border-[#3182F6] focus:ring-1 focus:ring-[#3182F6] outline-none transition-colors"
        >
          <option value="">선택해주세요</option>
          {[...Array(20)].map((_, i) => (
            <option key={i + 1} value={i + 1}>
              {i + 1}명
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-[#4E5968]">
          실력 수준
        </label>
        <div className="grid grid-cols-3 gap-3">
          {levels.map((level) => (
            <button
              key={level}
              type="button"
              onClick={() => setFormData((prev) => ({ ...prev, level }))}
              className={`py-3 rounded-lg border ${
                formData.level === level
                  ? "border-[#3182F6] bg-[#EFF6FF] text-[#3182F6]"
                  : "border-[#E5E7EB] text-[#4E5968]"
              } font-medium transition-colors`}
            >
              {level}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-[#4E5968]">
          팀 이름
        </label>
        <input
          type="text"
          name="teamName"
          value={formData.teamName}
          onChange={handleInputChange}
          placeholder="팀 이름을 입력해주세요"
          className="w-full px-4 py-3 rounded-lg border border-[#E5E7EB] focus:border-[#3182F6] focus:ring-1 focus:ring-[#3182F6] outline-none transition-colors"
        />
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="block text-sm font-medium text-[#4E5968]">
          매치 설명
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          placeholder="매치에 대한 상세 설명을 입력해주세요"
          rows={6}
          className="w-full px-4 py-3 rounded-lg border border-[#E5E7EB] focus:border-[#3182F6] focus:ring-1 focus:ring-[#3182F6] outline-none transition-colors resize-none"
        />
      </div>

      <div className="bg-[#F8F9FA] rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <FiInfo className="text-[#3182F6] mt-1" />
          <div className="text-sm text-[#4E5968]">
            <p className="font-medium mb-1">매치 설명 작성 팁</p>
            <ul className="list-disc list-inside space-y-1">
              <li>매치의 특별한 규칙이나 제한사항이 있다면 명시해주세요</li>
              <li>필요한 준비물이나 장비가 있다면 알려주세요</li>
              <li>주차 정보나 찾아오는 방법을 설명해주세요</li>
              <li>특별한 이벤트나 친목 활동이 있다면 소개해주세요</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      {/* 헤더 */}
      <div className="bg-white sticky top-0 z-10 px-5 py-4 border-b border-[#E5E7EB]">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() =>
                currentStep > 1 ? setCurrentStep(currentStep - 1) : navigate(-1)
              }
              className="text-[#191F28] hover:bg-[#F1F3F5] p-2 rounded-full transition-colors"
            >
              <FiArrowLeft size={20} />
            </button>
            <span className="font-bold text-[#191F28] text-lg">
              매치 만들기 {currentStep}/3
            </span>
          </div>
        </div>
      </div>

      {/* 컨텐츠 */}
      <div className="max-w-md mx-auto px-5 py-6">
        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}
      </div>

      {/* 하단 버튼 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t py-4 px-5">
        <button
          onClick={() => {
            if (currentStep < 3) {
              setCurrentStep(currentStep + 1);
            } else {
              handleSubmit();
            }
          }}
          className="w-full bg-[#3182F6] text-white py-4 rounded-lg font-medium"
        >
          {currentStep < 3 ? "다음" : "매치 만들기"}
        </button>
      </div>
    </div>
  );
};

export default CreateMatch;
