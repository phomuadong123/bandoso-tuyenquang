import React from "react";
import { ChevronRight } from "lucide-react";
import { useSlideIndex } from "./useSlideIndex";

export default function CardSlider({ data = [] }) {
  const items = Array.isArray(data) ? data : [];
  const { index, next, animClass } = useSlideIndex(items.length);
  console.log(items);

  const item = items[index] || {};

  return (
    <div className={`report-card ${animClass}`}>
      <div className="card-body">

        <div className="info-group main-info">
          <span className="badge-blue">{item.type || 'MÔ HÌNH'}</span>
          <h4 className="item-name">{item.title ?? 'Giúp đỡ người già neo đơn'}</h4>
        </div>

        <div className="info-group">
          <span className="info-label">Số lượng hỗ trợ lâu dài:</span>
          <span className="info-value ">{item.totalMoney ?? 'đang tải'}</span>
        </div>

        <div className="info-group">
          <span className="info-label">Đã tiếp nhận (tổng trị giá):</span>
          <span className="info-value">{item.totalItemsValue?.toLocaleString() || 'đang tải'} đ</span>
        </div>

      </div>

      <div className="card-arrow" onClick={next}>
        <ChevronRight />
      </div>
    </div>
  );
}