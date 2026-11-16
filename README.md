# Lab 7 — Destini

Trò chơi kể chuyện tương tác **Khu rừng của những điều bỏ quên**, sử dụng React + TypeScript trong Expo SDK 58. Chạy trên Android, iOS và web, giữ nguyên Expo Router và game Target Rush có sẵn.

## Chạy ứng dụng

```sh
npm ci
npm run web -- --port 8187
```

Nếu đã có `node_modules`, bỏ qua `npm ci`. Mở http://localhost:8187. Chạy `npm start` để mở dự án bằng Expo trên điện thoại.

## Trải nghiệm

- 20 tình huống, 30 tuyến truyện hoàn chỉnh và 4 loại kết thúc.
- Nền và ảnh minh họa SVG cục bộ thay đổi theo tình huống.
- Chuyển cảnh fade/slide, trạng thái đang chuyển, phản hồi hover/focus/nhấn và hiệu ứng riêng cho từng kết thúc.
- Tiến trình, số cảnh đã trải qua, số lựa chọn; trên mobile, tiến trình hiển thị trước nội dung.
- Chạm vào một mục trong **Dấu chân của bạn** để đọc lại tình huống, quyết định và nơi đã đến.
- Màn kết thúc hiển thị kết quả, số cảnh/lựa chọn, thời gian và các quyết định quan trọng.
- Chơi lại xóa lịch sử và thời gian, hủy chuyển cảnh đang chờ và đưa về màn bắt đầu.
- Tôn trọng cài đặt giảm chuyển động và hỗ trợ thao tác bằng bàn phím trên web.

Lượt chơi được giữ trong bộ nhớ của phiên đang mở; tải lại ứng dụng bắt đầu lượt mới. Thời gian hành trình tính cả thời gian rời ứng dụng.

**Target Rush** vẫn ở tab riêng, đường dẫn `/target-rush` và liên kết trong Hướng dẫn. Giữ nguyên cơ chế 30 giây, ba mạng, combo, đồng xu, bom và tạm dừng.

## Kiểm tra

```sh
npm run lint
npm run typecheck
npm test
npx expo export --platform all --output-dir .validation/export-finalize
```

Kiểm thử tự động duyệt đủ 30 tuyến, bốn kết thúc, tài nguyên ảnh, lịch sử, tiến trình, tổng kết, Restart và hành động không hợp lệ. Ba kiểm thử Target Rush tiếp tục chạy cùng bộ kiểm thử.

Xem [UPGRADE.md](./UPGRADE.md) để đọc cấu trúc dữ liệu, sơ đồ phân nhánh, danh sách file thay đổi và kết quả kiểm chứng. Không cần bổ sung thư viện. Không chạy `reset-project` khi muốn giữ bài Lab.
