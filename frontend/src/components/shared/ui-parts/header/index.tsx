/**
 * ページ共通のHeader
 */
export const Header = () => {
  return (
    // ヘッダーの背景色を可愛いピンクのグラデーションにする。
    <header className="bg-gradient-to-r from-[#ffd1dc] via-[#ff9faf] to-[#ff85a2] text-white relative z-[999]">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2 cursor-pointer">
          <h1 className="text-2xl font-bold text-center">
            負けヒロイン(友達止まり)育成計画❤️❤️❤️！！！！！
          </h1>
        </div>
      </div>
    </header>
  );
};
