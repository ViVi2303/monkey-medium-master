export default function timeSince(date, type = "eng") {
  const now = new Date();
  const yourDate = new Date(date);
  const timeUnits = [
    { unit: type === "vn" ? "năm" : "year", divisor: 31536000 },
    { unit: type === "vn" ? "tháng" : "month", divisor: 2678400 },
    { unit: type === "vn" ? "tuần" : "week", divisor: 604800 },
    { unit: type === "vn" ? "ngày" : "day", divisor: 86400 },
    { unit: type === "vn" ? "giờ" : "hour", divisor: 3600 },
    { unit: type === "vn" ? "phút" : "minute", divisor: 60 },
    { unit: type === "vn" ? "giây" : "second", divisor: 1 }
  ];

  for (const unit of timeUnits) {
    const elapsed = Math.floor((now.getTime() - yourDate.getTime()) / 1000);
    const timer = elapsed / unit.divisor;
    if (timer >= 1) {
      const unitLabel = Math.floor(timer) === 1 ? unit.unit : `${unit.unit}s`;
      return `${Math.floor(timer)} ${unitLabel} ${type==="vn" ? "trước" : "ago"}`;
    }
  }
}

// timeSince('2023-10-20T17:09:55.672Z')