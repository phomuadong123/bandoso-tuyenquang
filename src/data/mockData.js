// Dữ liệu mô phỏng Cơ sở dữ liệu cho Bản đồ số Tuyên Quang

export const MOCK_DATA = {
  // Thống kê chung
  statistics: {
    totalValue: "15.5 Tỷ VNĐ",
    activitiesCount: 320,
    volunteersCount: 15400,
    projectsCount: 45
  },

  // Tin tức / Slider
  news: [
    {
      id: 1,
      title: "Hành trình Tháng Thanh Niên 2024 tại Tuyên Quang",
      image: "/images/news1.jpg",
      date: "26/03/2024"
    },
    {
      id: 2,
      title: "Khánh thành công trình Thắp sáng đường quê",
      image: "/images/news2.jpg",
      date: "20/03/2024"
    },
    {
      id: 3,
      title: "Tuổi trẻ Tuyên Quang chung tay bảo vệ môi trường",
      image: "/images/news3.jpg",
      date: "15/03/2024"
    }
  ],

  // Văn bản chỉ đạo (Marquee trên Sidebar)
  documents: [
    {
      id: "VB01",
      number: "123-CV/TĐTN",
      excerpt: "V/v triển khai chiến dịch thanh niên tình nguyện hè năm 2024",
      date: "01/04/2024"
    },
    {
      id: "VB02",
      number: "124-KH/TĐTN",
      excerpt: "Kế hoạch tổ chức các hoạt động chào mừng kỷ niệm ngày thành lập Đoàn",
      date: "15/03/2024"
    },
    {
      id: "VB03",
      number: "125-TB/TĐTN",
      excerpt: "Thông báo kết quả cuộc thi sáng tạo khởi nghiệp thanh niên",
      date: "10/03/2024"
    }
  ],

  // Thông tin Ban Phong trào
  committee: [
    {
      id: 1,
      name: "Đ/c Hoàng Tường Vi",
      role: "Trưởng Ban Phong trào Tỉnh đoàn",
      phone: "0942.167.235",
      avatar: "/images/dc-huong-tuong-vi.jpg",
      unit: "Tỉnh đoàn Tuyên Quang"
    },
    {
      id: 2,
      name: "Đ/c Nguyễn Trung Kiên",
      role: "Phó Chánh văn phòng Tỉnh đoàn",
      phone: "0912.345.678",
      avatar: "/images/dc-nguyen-trung-kien.jpg",
      unit: "Tỉnh đoàn Tuyên Quang"
    },
    {
      id: 3,
      name: "Đ/c Lục Minh Hoài",
      role: "Phó ban Phong trào",
      phone: "0912.345.678",
      avatar: "/images/dc-luc-minh-hoai.jpg",
      unit: "Tỉnh đoàn Tuyên Quang"
    },
    {
      id: 4,
      name: "Đ/c Nguyễn Thị Hậu",
      role: "Bí thư chi đoàn Sở Thông tin và truyền thông tỉnh",
      phone: "0912.345.678",
      avatar: "/images/dc-nguyen-thi-hau.jpg",
      unit: "Tỉnh đoàn Tuyên Quang"
    }
  ],

  // Dữ liệu Bản đồ (Ví dụ 5 xã tiêu biểu, thực tế có 124 xã)
  locations: [
    {
      id: "X01",
      name: "Xã Tân Trào (Sơn Dương)",
      coords: { lat: 21.6886, lng: 105.4746 },
      secretary: "Lê Văn C - Bí thư Đoàn xã",
      phone: "0988.111.222",
      needs: "Hỗ trợ xây dựng sân chơi cho trẻ em, tặng sách vở cho học sinh nghèo.",
      status: "Đang cần hỗ trợ",
      image: "/images/cay-da-tan-trao.jpg"
    },
    {
      id: "X02",
      name: "Phường Minh Xuân (TP. Tuyên Quang)",
      coords: { lat: 21.8211, lng: 105.2152 },
      secretary: "Nguyễn Thị D - Bí thư Đoàn phường",
      phone: "0977.333.444",
      needs: "Hỗ trợ dọn dẹp vệ sinh môi trường, thu gom rác thải nhựa đê kè hồ điều hoà.",
      status: "Đã hoàn thành",
      image: "/images/cot-co-lung-cu.jpg"
    },
    {
      id: "X03",
      name: "Xã Hồng Thái (Na Hang)",
      coords: { lat: 22.4501, lng: 105.3524 },
      secretary: "Bàn Văn E - Bí thư Đoàn xã",
      phone: "0966.555.666",
      needs: "Hỗ trợ lắp đặt hệ thống đèn đường năng lượng mặt trời (3km).",
      status: "Đang triển khai",
      image: "/images/xa-hong-thai.jpg"
    },
    {
      id: "X04",
      name: "Xã Xuân Lập (Lâm Bình)",
      coords: { lat: 22.5123, lng: 105.1234 },
      secretary: "Chảo Phúc F - Bí thư Đoàn xã",
      phone: "0955.777.888",
      needs: "Hỗ trợ áo ấm mùa đông cho 200 em học sinh tiểu học.",
      status: "Đang cần hỗ trợ",
      image: "/images/news1.jpg"
    },
    {
      id: "X05",
      name: "Thị trấn Vĩnh Lộc (Chiêm Hóa)",
      coords: { lat: 22.1487, lng: 105.2678 },
      secretary: "Hoàng Thị G - Bí thư Đoàn thị trấn",
      phone: "0944.999.000",
      needs: "Tổ chức lớp dạy bơi miễn phí cho trẻ em dịp hè.",
      status: "Đang lên kế hoạch",
      image: "/images/news3.jpg"
    }
  ]
};
