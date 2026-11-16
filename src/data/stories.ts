export type EndingType = "good" | "bad" | "secret" | "alternative";
export type StoryScene =
  | "forest"
  | "river"
  | "ruins"
  | "tower"
  | "camp"
  | "portal"
  | "dawn"
  | "lost"
  | "secret"
  | "alternative";
export const STORY_IDS = [
  "awakening",
  "river",
  "ridge",
  "ferry",
  "ruins",
  "tower",
  "camp",
  "island",
  "rapids",
  "archive",
  "well",
  "beacon",
  "bridge",
  "guide",
  "sanctum",
  "gate",
  "good",
  "bad",
  "secret",
  "alternative",
] as const;
export type StoryId = (typeof STORY_IDS)[number];

export interface StoryChoice {
  text: string;
  hint: string;
  nextStoryId: StoryId;
}
export interface StoryNode {
  id: StoryId;
  title: string;
  description: string;
  chapter: string;
  image: StoryScene;
  choices: StoryChoice[];
  keyDecision?: boolean;
  isEnding?: boolean;
  endingType?: EndingType;
}
export const START_STORY_ID = "awakening";
export const endingLabels: Record<EndingType, string> = {
  good: "Ánh sáng trở về",
  bad: "Lạc trong sương",
  secret: "Người giữ ký ức",
  alternative: "Một cuộc đời khác",
};
export const stories: Record<StoryId, StoryNode> = {
  awakening: {
    id: "awakening",
    keyDecision: true,
    title: "Khu rừng không có tên",
    chapter: "I · Thức giấc",
    image: "forest",
    description:
      "Bạn tỉnh dậy trên thảm rêu lạnh. Trong túi áo là một chiếc la bàn không chỉ về hướng Bắc, mà hướng về một vầng sáng sau tán cây. Từ xa, tiếng chuông ngân ba lần.\n\nMột dòng suối lấp lánh bên trái. Bên phải, con đường dốc mang dấu chân còn mới. Trước khi màn sương khép lại, bạn phải chọn một hướng.",
    choices: [
      {
        text: "Đi theo tiếng nước",
        hint: "Có lẽ dòng suối dẫn tới một nơi có người.",
        nextStoryId: "river",
      },
      {
        text: "Lần theo những dấu chân",
        hint: "Ai đó cũng đang đi qua khu rừng này.",
        nextStoryId: "ridge",
      },
    ],
  },
  river: {
    id: "river",
    title: "Dòng sông bạc",
    chapter: "II · Dấu vết",
    image: "river",
    description:
      "Dòng suối mở ra một con sông phủ ánh trăng. Người lái đò đeo mặt nạ gỗ đang chờ ở bến. Phía bên kia, tàn tích một ngôi đền nhô lên giữa rễ cây.\n\n“Muốn về nhà, đừng chỉ nhìn vào kim la bàn,” người lái đò nói. Ông chìa tay, chờ quyết định của bạn.",
    choices: [
      {
        text: "Lên thuyền cùng người lái đò",
        hint: "Đổi sự an toàn lấy một lối đi chưa biết.",
        nextStoryId: "ferry",
      },
      {
        text: "Men theo bờ tới ngôi đền",
        hint: "Tự tìm lời giải giữa những tàn tích.",
        nextStoryId: "ruins",
      },
    ],
  },
  ridge: {
    id: "ridge",
    title: "Hai đốm sáng",
    chapter: "II · Dấu vết",
    image: "forest",
    description:
      "Dấu chân dừng ở một ngã rẽ. Trên đỉnh đồi là tòa tháp tắt đèn. Dưới thung lũng, một đốm lửa trại vẫn cháy, dù xung quanh không một tiếng người.\n\nKim la bàn quay về phía tòa tháp. Nhưng khói bếp lại mang mùi bánh mì quen thuộc.",
    choices: [
      {
        text: "Leo lên tòa tháp",
        hint: "Tìm một điểm cao để quan sát.",
        nextStoryId: "tower",
      },
      {
        text: "Đến gần ánh lửa trại",
        hint: "Có thể bạn không phải người duy nhất bị lạc.",
        nextStoryId: "camp",
      },
    ],
  },
  ferry: {
    id: "ferry",
    title: "Chuyến đò im lặng",
    chapter: "III · Bên kia",
    image: "river",
    description:
      "Chiếc thuyền tự trôi dù mái chèo không chạm nước. Một hòn đảo hiện ra, với cây cổ thụ sáng xanh. Bỗng tiếng chuông từ hạ lưu dồn dập gọi tên bạn.\n\nNgười lái đò chỉ nói: “Không phải tiếng gọi nào cũng muốn con trở về.”",
    choices: [
      {
        text: "Xin dừng ở hòn đảo",
        hint: "Tìm hiểu nguồn sáng dưới cây cổ thụ.",
        nextStoryId: "island",
      },
      {
        text: "Đi về phía tiếng chuông",
        hint: "Tìm câu trả lời từ tiếng gọi kỳ lạ.",
        nextStoryId: "rapids",
      },
    ],
  },
  ruins: {
    id: "ruins",
    title: "Ngôi đền bị lãng quên",
    chapter: "III · Bên kia",
    image: "ruins",
    description:
      "Dây leo phủ kín những cột đá. Trên tường có hình một cánh cửa, một ngọn đèn và một người giữ chìa khóa. Dưới chân tượng, hai lối cầu thang dẫn xuống lòng đất.\n\nMột lối có những trang giấy bay ra. Lối còn lại vọng lên tiếng nước nhỏ giọt.",
    choices: [
      {
        text: "Bước vào kho sách",
        hint: "Đọc câu chuyện mà khu rừng đã quên.",
        nextStoryId: "archive",
      },
      {
        text: "Đi xuống giếng cổ",
        hint: "Tìm thứ đang phản chiếu dưới đáy giếng.",
        nextStoryId: "well",
      },
    ],
  },
  tower: {
    id: "tower",
    title: "Ngọn hải đăng giữa rừng",
    chapter: "III · Bên kia",
    image: "tower",
    description:
      "Từ đỉnh tháp, bạn nhìn thấy một biển mây và những mái nhà ở rất xa. Giữa phòng là chiếc đèn chưa được thắp. Một cây cầu treo nối sang triền núi đối diện.\n\nLa bàn vừa khít với ổ khóa trên thân đèn. Bạn có thể thắp nó, hoặc tiếp tục đi.",
    choices: [
      {
        text: "Đặt la bàn vào ngọn đèn",
        hint: "Thắp lên tín hiệu dẫn đường.",
        nextStoryId: "beacon",
      },
      {
        text: "Băng qua cây cầu treo",
        hint: "Mái nhà phía xa có thể là đường về.",
        nextStoryId: "bridge",
      },
    ],
  },
  camp: {
    id: "camp",
    title: "Người lữ khách",
    chapter: "III · Bên kia",
    image: "camp",
    description:
      "Bên lửa trại, một cô gái đang vá chiếc áo choàng có thêu hình la bàn. Cô không ngạc nhiên khi thấy bạn. “Tôi từng tìm đường về. Rồi tôi tìm thấy lý do để ở lại.”\n\nCô mời bạn ngồi xuống. Trên nền đất, một bản đồ vẽ đường tới cây cầu treo.",
    choices: [
      {
        text: "Nghe câu chuyện của cô ấy",
        hint: "Dành thời gian cho một người xa lạ.",
        nextStoryId: "guide",
      },
      {
        text: "Mượn bản đồ, đi tới cây cầu",
        hint: "Tiếp tục hành trình trước khi trời tối.",
        nextStoryId: "bridge",
      },
    ],
  },
  island: {
    id: "island",
    title: "Cây ký ức",
    chapter: "IV · Sự thật",
    image: "secret",
    description:
      "Trên cành cây là những chiếc lọ phát sáng. Mỗi chiếc chứa một ký ức: một bữa cơm, một lời hứa, một buổi chiều ở nhà. Bạn nhận ra giọng nói của chính mình trong một chiếc lọ.\n\nDưới gốc cây có lối đi hẹp. Gần đó, một người mặc áo choàng đang chờ.",
    choices: [
      {
        text: "Đi theo ánh sáng dưới gốc cây",
        hint: "Tìm nơi những ký ức bắt đầu.",
        nextStoryId: "sanctum",
      },
      {
        text: "Hỏi người mặc áo choàng",
        hint: "Có người hiểu bí mật của nơi này.",
        nextStoryId: "guide",
      },
    ],
  },
  rapids: {
    id: "rapids",
    keyDecision: true,
    title: "Lời gọi dưới dòng nước",
    chapter: "IV · Sự thật",
    image: "river",
    description:
      "Thuyền mắc vào đá. Tiếng chuông hóa thành giọng người thân từ dưới dòng nước đen. Bạn nhìn thấy một bàn tay vẫy gọi, nhưng mặt nước không hề phản chiếu gương mặt nào.\n\nPhía trên, sợi dây buộc vào chân cây cầu vẫn nằm trong tầm với.",
    choices: [
      {
        text: "Nhảy xuống tìm người đang gọi",
        hint: "Tin vào điều bạn nghe thấy.",
        nextStoryId: "bad",
      },
      {
        text: "Nắm sợi dây, trèo lên cầu",
        hint: "Tin vào điều bạn có thể chạm tới.",
        nextStoryId: "bridge",
      },
    ],
  },
  archive: {
    id: "archive",
    title: "Trang sách mang tên bạn",
    chapter: "IV · Sự thật",
    image: "ruins",
    description:
      "Một cuốn sách mở sẵn ghi lại từng bước chân của bạn. Trang cuối viết: “Khu rừng giữ những điều con người bỏ quên. Cánh cửa chỉ mở khi một ký ức được trao lại.”\n\nHai ký hiệu dẫn bạn tới phòng ký ức và ngọn hải đăng. Cả hai đều có thể thay đổi số phận khu rừng.",
    choices: [
      {
        text: "Tìm phòng ký ức",
        hint: "Hiểu lời hứa của người giữ rừng.",
        nextStoryId: "sanctum",
      },
      {
        text: "Đem trang sách tới hải đăng",
        hint: "Dùng sự thật để tìm đường trở về.",
        nextStoryId: "beacon",
      },
    ],
  },
  well: {
    id: "well",
    keyDecision: true,
    title: "Chiếc gương dưới đáy giếng",
    chapter: "IV · Sự thật",
    image: "lost",
    description:
      "Mặt nước soi lại căn phòng của bạn, ấm áp và gần đến mức tưởng có thể bước vào. Nhưng bóng của bạn trong đó vẫn đứng yên khi bạn chuyển động.\n\nMột khe sáng phía sau thành giếng hé ra. Trên mép đá có dòng chữ: “Ký ức không phải là hiện tại.”",
    choices: [
      {
        text: "Bước vào hình ảnh căn phòng",
        hint: "Đổi hành trình lấy một điều quen thuộc.",
        nextStoryId: "bad",
      },
      {
        text: "Lách qua khe sáng",
        hint: "Tìm sự thật phía sau chiếc gương.",
        nextStoryId: "sanctum",
      },
    ],
  },
  beacon: {
    id: "beacon",
    keyDecision: true,
    title: "Ánh đèn đánh thức bình minh",
    chapter: "V · Lời hứa",
    image: "tower",
    description:
      "Ngọn đèn bừng sáng, xé màn sương. Một con đường về thị trấn hiện lên. Trong ánh sáng, bạn cũng nhìn thấy những người lạc lối đang chờ ở bìa rừng.\n\nBạn có thể trở về cùng họ, hoặc giữ ngọn đèn sáng để dẫn thêm những người đến sau.",
    choices: [
      {
        text: "Dẫn mọi người trở về",
        hint: "Cùng nhau hoàn thành hành trình.",
        nextStoryId: "good",
      },
      {
        text: "Ở lại làm người thắp đèn",
        hint: "Chọn một nơi thuộc về mới.",
        nextStoryId: "alternative",
      },
    ],
  },
  bridge: {
    id: "bridge",
    keyDecision: true,
    title: "Bước chân trên vực mây",
    chapter: "V · Lời hứa",
    image: "tower",
    description:
      "Cây cầu rung lên trong gió. Ở đầu bên kia là con đường xuống thị trấn, còn dưới vòm đá gần đó là một cánh cổng khắc hình la bàn.\n\nTừ cánh cổng, bạn nghe ba tiếng chuông đầu tiên, giờ đã nhẹ như một lời chào.",
    choices: [
      {
        text: "Đi xuống con đường tới thị trấn",
        hint: "Chọn lối đi rõ ràng trước mắt.",
        nextStoryId: "good",
      },
      {
        text: "Khám phá cánh cổng đá",
        hint: "Tìm lời giải cuối cùng của chiếc la bàn.",
        nextStoryId: "gate",
      },
    ],
  },
  guide: {
    id: "guide",
    keyDecision: true,
    title: "Người đã từng là bạn",
    chapter: "V · Lời hứa",
    image: "camp",
    description:
      "Người lữ khách kể rằng khu rừng chỉ giữ chân những ai còn một lời hứa chưa trọn. Cô đã chọn ở lại để giúp những người lạc. Chiếc la bàn là món quà cô gửi ra thế giới.\n\n“Bạn có thể đi tới cổng. Hoặc cùng tôi làm nơi này bớt cô đơn.”",
    choices: [
      {
        text: "Nhờ cô chỉ đường tới cổng",
        hint: "Mang theo lời cảm ơn và tiếp tục đi.",
        nextStoryId: "gate",
      },
      {
        text: "Ở lại cùng người lữ khách",
        hint: "Bắt đầu một cuộc đời giữa khu rừng.",
        nextStoryId: "alternative",
      },
    ],
  },
  sanctum: {
    id: "sanctum",
    keyDecision: true,
    title: "Trái tim của khu rừng",
    chapter: "V · Lời hứa",
    image: "secret",
    description:
      "Hàng nghìn ký ức lơ lửng quanh một hạt mầm đã khô. Bạn hiểu rằng khu rừng đang dần biến mất vì không còn ai nhớ đến nó.\n\nBạn có thể trao cho hạt mầm ký ức đẹp nhất của mình, hoặc giữ nguyên ký ức và đi qua cánh cổng phía sau.",
    choices: [
      {
        text: "Trao ký ức cho hạt mầm",
        hint: "Cứu điều bí mật mà bạn vừa tìm thấy.",
        nextStoryId: "secret",
      },
      {
        text: "Giữ ký ức, tìm đường về",
        hint: "Bạn vẫn còn những người đang chờ.",
        nextStoryId: "gate",
      },
    ],
  },
  gate: {
    id: "gate",
    keyDecision: true,
    title: "Điều bạn mang theo",
    chapter: "VI · Lựa chọn cuối",
    image: "portal",
    description:
      "Cổng đá mở ra hai lối. Bên trái là bình minh và tiếng chim thật. Bên phải là một căn nhà hoàn hảo như ký ức, không có thời gian, không có mất mát.\n\nChiếc la bàn ngừng quay. Lần này, bạn phải tự quyết định điều gì là nhà.",
    choices: [
      {
        text: "Bước về phía bình minh",
        hint: "Chấp nhận một thế giới chưa hoàn hảo.",
        nextStoryId: "good",
      },
      {
        text: "Chọn căn nhà trong ký ức",
        hint: "Giữ mãi những điều đã qua.",
        nextStoryId: "bad",
      },
    ],
  },
  good: {
    id: "good",
    title: "Nhà ở phía bình minh",
    chapter: "Kết thúc · Trở về",
    image: "dawn",
    isEnding: true,
    endingType: "good",
    description:
      "Bạn bước ra khỏi rừng khi mặt trời vừa lên. Thị trấn vẫn ở đó, cùng những người đã chờ bạn. Trong túi áo, chiếc la bàn trở lại chỉ hướng Bắc.\n\nBạn đã tìm được đường về. Và lần này, bạn biết mình muốn đi đâu.",
    choices: [],
  },
  bad: {
    id: "bad",
    title: "Một giấc mơ không thức dậy",
    chapter: "Kết thúc · Lạc lối",
    image: "lost",
    isEnding: true,
    endingType: "bad",
    description:
      "Căn phòng thật ấm. Mọi thứ hoàn hảo, chỉ có đồng hồ không còn chạy. Ngoài cửa sổ, màn sương phủ kín thế giới. Bạn chợt hiểu: đó không phải đường về, mà là một ký ức đã khép cửa.\n\nỞ một nơi rất xa, tiếng chuông lại ngân ba lần.",
    choices: [],
  },
  secret: {
    id: "secret",
    title: "Người giữ những điều đẹp đẽ",
    chapter: "Kết thúc · Bí mật",
    image: "secret",
    isEnding: true,
    endingType: "secret",
    description:
      "Hạt mầm nảy chồi. Những ký ức rơi xuống như mưa sao, đánh thức cả khu rừng. Bạn không còn nhớ chi tiết ký ức đã trao, nhưng cảm giác ấm áp vẫn ở trong tim.\n\nKhu rừng mở cho bạn một con đường riêng về nhà. Từ hôm đó, trong mỗi giấc mơ, bạn nghe thấy lời cảm ơn của những tán cây.",
    choices: [],
  },
  alternative: {
    id: "alternative",
    title: "Một nơi để bắt đầu lại",
    chapter: "Kết thúc · Lối khác",
    image: "alternative",
    isEnding: true,
    endingType: "alternative",
    description:
      "Bạn treo chiếc la bàn ở lối vào rừng, thắp một ngọn đèn và đặt thêm một chiếc ghế bên bếp lửa. Có những hành trình kết thúc bằng việc trở về. Hành trình của bạn kết thúc bằng một khởi đầu.\n\nKhi người lạc tiếp theo xuất hiện, bạn mỉm cười: “Ngồi xuống nhé. Tôi biết một câu chuyện.”",
    choices: [],
  },
};
